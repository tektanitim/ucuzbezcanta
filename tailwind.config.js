// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Next.js App Router'ı kapsar
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Eğer Pages Router kullanılıyorsa
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // src klasörü içindeki tüm bileşenleri ve diğer dosyaları kapsar
  ],
  theme: {
    extend: {
      keyframes: {
        // Hero Slider başlık/alt başlık/buton animasyonu
        fadeInFromBottom: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        // Animasyon için Tailwind sınıfı
        'fade-in-up': 'fadeInFromBottom 0.8s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Typography eklentisi
    require('@tailwindcss/line-clamp'), // Line Clamp eklentisi
  ],
};