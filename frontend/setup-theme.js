const fs = require('fs');
const path = require('path');

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r} ${g} ${b}`;
}

const palettes = {
    green: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
    blue:  { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
    slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' },
    orange:{ 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
    hc_primary: { 50: '#ffff00', 100: '#ffff00', 200: '#ffff00', 300: '#ffff00', 400: '#ffff00', 500: '#ffff00', 600: '#cccc00', 700: '#999900', 800: '#666600', 900: '#333300' },
    hc_dark: { 50: '#ffffff', 100: '#e0e0e0', 200: '#c0c0c0', 300: '#a0a0a0', 400: '#808080', 500: '#606060', 600: '#404040', 700: '#202020', 800: '#000000', 900: '#000000', 950: '#000000' },
};

// Create the Light theme mapping (reverse of slate for dark)
const lightSlate = {
    50: palettes.slate[950],
    100: palettes.slate[900],
    200: palettes.slate[800],
    300: palettes.slate[700],
    400: palettes.slate[600],
    500: palettes.slate[500],
    600: palettes.slate[400],
    700: palettes.slate[300],
    800: palettes.slate[200],
    900: palettes.slate[100],
    950: palettes.slate[50], // Very light background
};

const themes = {
    ':root': { primary: palettes.green, dark: palettes.slate, accent: palettes.orange, bg: palettes.slate[900], text: palettes.slate[300], glassBg: '15 23 42' }, // Dark theme default
    '.light': { primary: palettes.green, dark: lightSlate, accent: palettes.orange, bg: lightSlate[950], text: lightSlate[300], glassBg: '255 255 255' },
    '.blue': { primary: palettes.blue, dark: palettes.slate, accent: palettes.orange, bg: palettes.slate[900], text: palettes.slate[300], glassBg: '15 23 42' },
    '.green': { primary: palettes.green, dark: palettes.slate, accent: palettes.orange, bg: palettes.slate[900], text: palettes.slate[300], glassBg: '15 23 42' },
    '.high-contrast': { primary: palettes.hc_primary, dark: palettes.hc_dark, accent: palettes.orange, bg: palettes.hc_dark[950], text: '#ffffff', glassBg: '0 0 0' }
};

let cssContent = `/* Auto-generated theme variables */\n\n`;

for (const [selector, theme] of Object.entries(themes)) {
    cssContent += `${selector} {\n`;
    for (const [paletteName, colors] of Object.entries(theme)) {
        if (typeof colors === 'string') continue;
        for (const [shade, hex] of Object.entries(colors)) {
            cssContent += `  --color-${paletteName}-${shade}: ${hexToRgb(hex)};\n`;
        }
    }
    // Add base bg and text colors for the theme
    cssContent += `  --theme-bg: ${theme.bg.startsWith('#') ? hexToRgb(theme.bg) : hexToRgb(palettes.slate[900])};\n`;
    cssContent += `  --theme-text: ${theme.text.startsWith('#') ? hexToRgb(theme.text) : hexToRgb(palettes.slate[300])};\n`;
    cssContent += `  --glass-bg: ${theme.glassBg};\n`;
    
    if(selector === '.light') {
       cssContent += `  --glass-border: 0 0 0;\n`;
    } else if(selector === '.high-contrast') {
       cssContent += `  --glass-border: 255 255 255;\n`;
    } else {
       cssContent += `  --glass-border: 148 163 184;\n`;
    }
    cssContent += `}\n\n`;
}

// Write to index.css
const cssFilePath = path.join(__dirname, 'src', 'index.css');
let existingCss = fs.readFileSync(cssFilePath, 'utf8');

// remove previous glass definition & any root variables
existingCss = existingCss.replace(/\.glass\s*{[^}]*}/, `.glass {
  background: rgba(var(--glass-bg) / 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(var(--glass-border) / 0.1);
}`);

if(!existingCss.includes('/* Auto-generated theme variables */')) {
    existingCss = existingCss.replace('@tailwind utilities;', '@tailwind utilities;\n\n' + cssContent);
} else {
    // replace everything from Auto-generated to the end of the last block
    existingCss = existingCss.replace(/\/\* Auto-generated theme variables \*\/[\s\S]*?(?=\/\* Custom scrollbar \*\/)/, cssContent);
}

// Make sure body has the bg and text color
if(!existingCss.includes('body {')) {
    existingCss += `\nbody {\n  background-color: rgb(var(--theme-bg));\n  color: rgb(var(--theme-text));\n}\n`;
}

fs.writeFileSync(cssFilePath, existingCss);

// Write to tailwind.config.js
const twColors = {};
for (const paletteName of ['primary', 'dark', 'accent']) {
    twColors[paletteName] = {};
    const shades = paletteName === 'dark' ? [50,100,200,300,400,500,600,700,800,900,950] : [50,100,200,300,400,500,600,700,800,900];
    for(const shade of shades) {
        twColors[paletteName][shade] = \`rgb(var(--color-\${paletteName}-\${shade}) / <alpha-value>)\`;
    }
}

const twConfigContent = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: ${JSON.stringify(twColors, null, 8).replace(/"/g, "'")},
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};`;

fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), twConfigContent);
console.log('Successfully generated theme CSS and tailwind variables.');
