/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Dark theme with accent colors
                background: 'hsl(222, 47%, 8%)',
                foreground: 'hsl(210, 40%, 98%)',
                card: {
                    DEFAULT: 'hsl(222, 47%, 11%)',
                    foreground: 'hsl(210, 40%, 98%)',
                },
                primary: {
                    DEFAULT: 'hsl(262, 83%, 58%)',
                    foreground: 'hsl(210, 40%, 98%)',
                },
                secondary: {
                    DEFAULT: 'hsl(217, 33%, 17%)',
                    foreground: 'hsl(210, 40%, 98%)',
                },
                muted: {
                    DEFAULT: 'hsl(217, 33%, 17%)',
                    foreground: 'hsl(215, 20%, 65%)',
                },
                accent: {
                    DEFAULT: 'hsl(262, 83%, 58%)',
                    foreground: 'hsl(210, 40%, 98%)',
                },
                destructive: {
                    DEFAULT: 'hsl(0, 62%, 50%)',
                    foreground: 'hsl(210, 40%, 98%)',
                },
                success: {
                    DEFAULT: 'hsl(142, 71%, 45%)',
                    foreground: 'hsl(210, 40%, 98%)',
                },
                warning: {
                    DEFAULT: 'hsl(38, 92%, 50%)',
                    foreground: 'hsl(222, 47%, 8%)',
                },
                border: 'hsl(217, 33%, 20%)',
                input: 'hsl(217, 33%, 17%)',
                ring: 'hsl(262, 83%, 58%)',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
