const tailwindcss = require('tailwindcss');
module.exports = {
  plugins: [
    require('postcss-pseudo-is'),
    'postcss-preset-env',
    tailwindcss
  ],
};