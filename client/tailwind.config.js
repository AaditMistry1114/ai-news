/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        foreground: '#e2e8f0', // slate-200
        primary: '#6366f1',    // indigo-500
      },
    },
  },
  plugins: [],
}
