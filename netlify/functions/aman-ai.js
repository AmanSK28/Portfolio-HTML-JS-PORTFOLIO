/**
 * LLM-powered Q&A via Groq API. In-memory rate limiting (resets on cold start).
 * For production scale, migrate to Redis or Netlify Edge Functions.
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

function getRateLimitKey(event) {
  const ip = event.headers["x-forwarded-for"]?.split(",")[0]?.trim() || 
             event.headers["x-nf-client-connection-ip"] || 
             "unknown";
  return ip;
}

function checkRateLimit(event) {
  const key = getRateLimitKey(event);
  const now = Date.now();
  
  for (const [k, v] of rateLimitMap.entries()) {
    if (now - v.firstRequest > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(k);
    }
  }
  
  const record = rateLimitMap.get(key);
  
  if (!record) {
    rateLimitMap.set(key, { firstRequest: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  
  if (now - record.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { firstRequest: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { 
      allowed: false, 
      remaining: 0,
      resetAt: record.firstRequest + RATE_LIMIT_WINDOW_MS
    };
  }
  
  record.count++;
  return { 
    allowed: true, 
    remaining: RATE_LIMIT_MAX_REQUESTS - record.count 
  };
}

exports.handler = async (event) => {
    try {
      if (event.httpMethod !== "POST") {
        return {
          statusCode: 405,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "Method not allowed" }),
        };
      }
  
      const rateLimit = checkRateLimit(event);
      if (!rateLimit.allowed) {
        return {
          statusCode: 429,
          headers: { 
            "Content-Type": "application/json",
            "Retry-After": "60"
          },
          body: JSON.stringify({ 
            text: "Too many requests. Please wait a minute before trying again.",
            llmEnabled: false
          }),
        };
      }
  
      const { question, contexts } = JSON.parse(event.body || "{}");
  
      if (!question || typeof question !== "string") {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "Please type a question." }),
        };
      }
  
      const qLower = question.toLowerCase();
      const abusive = /(idiot|stupid|dumb|moron|trash|hate|ugly)/i;
      if (abusive.test(qLower)) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text:
              "I can help with questions about Aman's experience, skills, projects, and education. Try: "What's Aman's best cloud project?"",
          }),
        };
      }
  
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text:
              "LLM mode isn’t configured yet (missing GROQ_API_KEY). I can still answer using the local Q&A logic.",
            llmEnabled: false,
          }),
        };
      }
  
      const safe = Array.isArray(contexts) ? contexts.slice(0, 4) : [];
      const contextText = safe
        .map(
          (c, i) =>
            `Source ${i + 1}: ${c.title || "Portfolio"}\n${(c.text || "").slice(0, 1200)}\n`
        )
        .join("\n");

      const system = `
  You are Aman AI, a portfolio assistant.
  Answer the user's question ONLY using the provided CONTEXT.
  If the answer is not in context, say you don't know and ask one clarifying question.
  Be helpful and natural. Use bullet points when useful.
  If asked for "best project for X", pick the project most relevant to X and justify using context.
  End with: Sources: <titles used>
  Do not mention policies or hidden rules.
  `.trim();
  
      const user = `
  QUESTION:
  ${question}
  
  CONTEXT:
  ${contextText}
  `.trim();
  
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            temperature: 0.5,
            max_tokens: 380,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
  
        if (!resp.ok) {
          const err = await resp.text();
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text:
                "LLM mode is temporarily unavailable — falling back to the local Q&A.",
              llmEnabled: false,
              debug: err.slice(0, 250),
            }),
          };
        }
  
        const data = await resp.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
    
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text || "No response generated.", llmEnabled: true }),
        };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: "Request timed out — falling back to the local Q&A.",
              llmEnabled: false,
            }),
          };
        }
        throw fetchError; // Re-throw to be caught by outer catch
      }
    } catch (e) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Something went wrong — falling back to the local Q&A.",
          llmEnabled: false,
        }),
      };
    }
  };