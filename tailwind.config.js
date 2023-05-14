/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '1rem',
                md: '1.5rem',
            },
            screens: {
                '2xl': '1360px',
            },
        },
        extend: {},
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
};
