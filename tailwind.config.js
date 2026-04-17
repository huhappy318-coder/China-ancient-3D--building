/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Songti SC"', '"STSong"', 'serif'],
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      colors: {
        ink: '#0f0c0a',
        lacquer: '#17110f',
        bronze: '#b98a52',
        ember: '#e7b665',
        mist: '#cbbca4',
      },
      boxShadow: {
        glow: '0 30px 80px rgba(0, 0, 0, 0.45)',
        amber: '0 20px 60px rgba(191, 133, 51, 0.22)',
      },
      backgroundImage: {
        'scene-grid':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
