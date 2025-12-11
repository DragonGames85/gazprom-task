/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    cyan: '#00ffff',
                    pink: '#ff00ff',
                    green: '#00ff00',
                    blue: '#0080ff',
                    purple: '#8000ff',
                },
                dark: {
                    bg: '#0a0a0f',
                    card: '#1a1a2e',
                    border: '#16213e',
                },
            },
            boxShadow: {
                'neon-cyan': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
                'neon-pink': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
                'neon-green': '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
            },
        },
    },
    plugins: [],
};
