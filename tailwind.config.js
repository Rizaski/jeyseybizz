/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.js",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0052cc',
                secondary: '#36b37e',
                accent: '#ff5630',
            },
            fontFamily: {
                'inter': ['Inter', 'Poppins', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            borderRadius: {
                'custom': '1rem',
            },
        },
    },
    plugins: [],
}