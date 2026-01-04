# Portfolio Website

A responsive static portfolio website featuring interactive animations, dark mode, and an AI-powered Q&A assistant.

## Features

- Responsive design with mobile hamburger navigation
- Dark/light theme toggle with localStorage persistence
- Interactive scroll reveal animations and parallax effects
- Skills section with animated binary matrix background
- Experience timeline with staggered animations
- Aman AI: Client-side Q&A assistant with LLM integration (via Netlify Functions)

## Local Development

1. Clone the repository
2. Open `index.html` in a web browser, or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```
3. For testing Netlify functions locally, use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

## Deployment

This site is deployed on Netlify as a static site with serverless functions.

### Netlify Functions

- `netlify/functions/aman-ai.js` - LLM-powered Q&A function

### Environment Variables

Set the following in Netlify dashboard:
- `GROQ_API_KEY` - Required for Aman AI LLM functionality

## Project Structure

```
├── Assets/              # Images and documents
├── css/
│   ├── main.css        # Theme variables, reset, header, navigation
│   ├── components.css  # Reusable components (buttons, cards, icons)
│   ├── sections.css    # Section-specific styles (profile, about, experience, etc.)
│   ├── skills.css      # Skills section styles
│   ├── aman-ai.css     # Aman AI section styles
│   └── mediaqueries.css # Responsive overrides
├── js/
│   ├── nav.js          # Navigation menu functionality
│   ├── navigation.js   # Interactive elements handler (replaces inline handlers)
│   ├── typewriter.js   # Typewriter effect
│   ├── theme.js        # Dark/light mode toggle
│   ├── reveal.js       # Scroll reveal animations
│   ├── parallax.js     # Parallax effects
│   ├── experience.js   # Experience timeline animations
│   ├── skills-matrix.js # Skills binary matrix animation
│   ├── aman-ai-ui.js   # Aman AI Q&A system
│   ├── main.js         # Main initialization coordinator
│   └── constants.js    # Application constants and configuration
├── netlify/
│   ├── functions/
│   │   └── aman-ai.js  # Serverless function for LLM integration
│   └── netlify.toml    # Netlify configuration (CSP headers, security)
└── index.html          # Main HTML file
```

## Technologies

- Vanilla JavaScript (ES6+)
- CSS3 with CSS Variables
- HTML5
- Netlify Functions (serverless)
- Groq API (for LLM functionality)

## Security Features

- Content Security Policy (CSP) headers
- XSS protection via safe DOM rendering
- Rate limiting (client and server-side)
- Input sanitization
- Secure headers (X-Frame-Options, X-Content-Type-Options)

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Skip-to-content link
- Semantic HTML5 elements
- Focus management

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge) with ES6+ support.

