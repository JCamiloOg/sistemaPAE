import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            keyframes: {
                modalIn: {
                    '0%': { opacity: '0', transform: 'translateY(18px) scale(0.96)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
                },
                modalOut: {
                    '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                    '100%': { opacity: '0', transform: 'translateY(18px) scale(0.96)' }
                },
                backdropIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                backdropOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' }
                }
            },
            animation: {
                modalIn: 'modalIn 0.28s ease forwards',
                modalOut: 'modalOut 0.22s ease forwards',
                backdropIn: 'backdropIn 0.22s ease forwards',
                backdropOut: 'backdropOut 0.2s ease forwards'
            }

        },
    },
    plugins: [],
};

export default config;