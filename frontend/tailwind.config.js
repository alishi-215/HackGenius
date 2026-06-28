/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cyber-black': '#0a0a0a',
                'cyber-gray': '#1a1a1a',
                'cyber-green': '#00ff41', // Matrix green
                'cyber-blue': '#00b8ff',
                'cyber-purple': '#bd00ff',
            },
            fontFamily: {
                mono: ['"Fira Code"', 'monospace'], // Suggest Fira Code
            }
        },
    },
    plugins: [
        require('tailwind-scrollbar')({ nocompatible: true }),
    ],
}
