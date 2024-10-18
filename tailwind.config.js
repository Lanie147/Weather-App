/** @type {import('tailwindcss').Config} */
module.exports = {
  experimental: {
    optimizeUniversalDefaults: true
},
  content: ["./views/*.ejs",
  ".public/*.js", "./views/partials/*.ejs"],
  theme: {
    extend: {
      keyframes: {
        'grow-shrink': {
          '0%, 100%': { transform: 'scale(1)' }, // Initial size
          '50%': { transform: 'scale(1.1)' },    // Grows to 1.1 times its size at 50%
        },
      },
      animation: {
        'slow-grow-shrink': 'grow-shrink 6s ease-in-out infinite', //animates over the course of 10 seconds
        'slow-spin': 'spin 60s linear infinite', // Custom slow spin animation
      },
      fontFamily:{
        body: ['Poppins']
      },
    },
  },
  plugins: [],
};
