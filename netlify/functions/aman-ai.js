// netlify/functions/aman-ai.js
// CommonJS format = maximum compatibility on Netlify Functions.

exports.handler = async (event) => {
    try {
      if (event.httpMethod !== "POST") {
        return {
          statusCode: 405,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "Method not allowed" }),
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
  
      // Light abuse/off-topic filter to prevent “idiot” style prompts from mapping to random portfolio docs
      const qLower = question.toLowerCase();
      const abusive = /(idiot|stupid|dumb|moron|trash|hate|ugly)/i;
      if (abusive.test(qLower)) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text:
              "I can help with questions about Aman’s experience, skills, projects, and education. Try: “What’s Aman’s best cloud project?”",
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
  
      // Keep contexts small and clean
      const safe = Array.isArray(contexts) ? contexts.slice(0, 4) : [];
      const contextText = safe
        .map(
          (c, i) =>
            `Source ${i + 1}: ${c.title || "Portfolio"}\n${(c.text || "").slice(0, 1200)}\n`
        )
        .join("\n");
  
      // Grounded “RAG” prompt: ONLY use context
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
  
      // Groq is OpenAI-compatible (base URL: https://api.groq.com/openai/v1)  [oai_citation:5‡GroqCloud](https://console.groq.com/docs/openai?utm_source=chatgpt.com)
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
      });
  
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