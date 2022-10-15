/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.{html,js,css}", "./views/*.ejs", "./views/layout/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};
