@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cyber-black text-white font-sans;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-bold;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00ff41;
}

/* Markdown Styles for Chatbot */
.markdown-body p {
  margin-bottom: 0.5rem;
}

.markdown-body p:last-child {
  margin-bottom: 0;
}

.markdown-body ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.markdown-body ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.markdown-body strong {
  font-weight: 700;
  color: #00ff41;
  /* Cyber green for emphasis */
}

.markdown-body h3 {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #00ff41;
}