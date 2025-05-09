/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Kích hoạt dark mode dựa trên class
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'], // Quét các file chứa class Tailwind
  theme: {
    extend: {},
  },
  plugins: [],
};
