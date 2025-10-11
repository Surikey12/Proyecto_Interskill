/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // <-- importantísimo
  ],
  theme: {
    extend: {
      colors: {
        color1: "#532359",
        color2: "#F191F2",
        color3: "#031926",
        color4: "#07B2D9",
        color5: "#07DBF2",

        color6: "#A463BF",
        color7: "#5C57F2",
        color8: "#7672f2",
        color9: "#F27979",
        color10: "#F2F2F2"

        /* Paleta 1
        color1: "#743c5c",
        color2: "#658a97",
        color3: "#5bbba5",
        color4: "#f4b494",
        color5: "#602429"*/

        /* Paleta 2 
        color1: "#F2A007",
        color2: "#D97A07",
        color3: "#8C3604",
        color4: "#BF7373",
        color5: "#F2F2F2"
        */
      }
    },
  },
  plugins: [],
}
