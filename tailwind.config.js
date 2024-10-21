/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(131deg, rgba(43, 165, 255, 1) 0%, rgba(0, 255, 141, 1) 0%, rgba(1, 202, 255, 1) 83%)',
        'weather-img': 'url("https://cdn.pixabay.com/photo/2024/04/05/17/47/ai-generated-8677874_1280.jpg")',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.scrollbar-none': {
            'scrollbar-width': 'none',
          },
        },
        ['responsive', 'hover']
      );
    },
  ],
}

