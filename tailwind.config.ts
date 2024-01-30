import type { Config } from "tailwindcss";

const widthExtension = {
    "full-content": "980px"
};

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            maxWidth: {
                ...widthExtension
            },
            width: {
                ...widthExtension
            },
            colors: {
                "turquoise-100": "#57BBBF",
                "turquoise-200": "rgb(49,127,129)"
            },
            gridTemplateColumns: {
                "auto-sm": "repeat(auto-fill,minmax(120px,1fr))"
            },
            backgroundImage: {
                "site-background": "url('/site-background.jpeg')"
            }
        }
    },
    plugins: [require("flowbite/plugin")]
};
export default config;
