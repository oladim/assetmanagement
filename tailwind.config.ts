import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Open Sans","Helvetica Neue","Helvetica","Arial","sans-serif"],
      },
      colors:{
        primary: "#008efa",
        hover: "#135397",
        yellow: "#e5e507",
        secondary: "#14aaff"
      }
    },
  },
  plugins: [],
} satisfies Config;

// export default {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx}',
//     "./src/**/*.{js,jsx,ts,tsx}",
//     'node_modules/flowbite-react/lib/esm/**/*.js'
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         body: ["Open Sans","Helvetica Neue","Helvetica","Arial","sans-serif"],
//       },
//       colors:{
//         primary: "#008efa",
//         hover: "#135397",
//         yellow: "#e5e507",
//         secondary: "#14aaff"
//       }
//     },
//   },
//   plugins: [
//     require('flowbite/plugin')
//   ],
// }
