const { transform } = require("typescript");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        red: {
          light: "#FF9797",
          DEFAULT: "#EC5757",
        },
        gray: {
          DEFAULT: "#888EB0",
          light: "#F9FAFE",
          700: "#7E88C3",
        },
        green: {
          light: "#33D69F0F",
          DEFAULT: "#33D69F",
        },
        orange: {
          light: "#FF8F000F",
          DEFAULT: "#FF8F00",
        },
        blue: {
          light: "#A7C7FF",    // Azul claro
          DEFAULT: "#4C9BFF",  // Azul más intenso
        },
        black: {
          light: "#252945",
          DEFAULT: "#1E2139",
          700: "#141625",
          800: "#0C0E16",
          100: "#DFE3FA0F",
        },
        white: {
          light: "#f8f8fb",
          DEFAULT: "#ffffff",
        },
      },
      spacing: {
        30: "6.438rem",
        27: "108px",
        128: "730px",
        130: "760px",
      },
      boxShadow: {
        "custom-light": "0px 10px 10px -10px rgba(72, 84, 159, 0.10)",
      },
      transitionProperty: {
        transform: "transform",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
