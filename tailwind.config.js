/** @type {import('tailwindcss').Config} */


export const darkMode = 'class';

export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}"
];
export const theme = {
    extend: {},
};
export const plugins = [require("tailwindcss-animate")];

