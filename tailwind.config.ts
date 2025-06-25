import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    //  custom responsive breakpoints
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
      
      //  custom mobile breakpoints
      'mobile': '320px',
      'tablet': '768px',
      'desktop': '1024px',
      'wide': '1440px',
      
      //  custom range breakpoints
      'sm-only': {'min': '640px', 'max': '767px'},
      'md-only': {'min': '768px', 'max': '1023px'},
      'lg-only': {'min': '1024px', 'max': '1279px'},
      
      //  custom max width breakpoints
      'max-sm': {'max': '639px'},
      'max-md': {'max': '767px'},
      'max-lg': {'max': '1023px'},
      
      //  custom height breakpoints
      'h-sm': {'raw': '(min-height: 640px)'},
      'h-md': {'raw': '(min-height: 768px)'},
      'h-lg': {'raw': '(min-height: 1024px)'},
      
      //  custom orientation breakpoints
      'portrait': {'raw': '(orientation: portrait)'},
      'landscape': {'raw': '(orientation: landscape)'},
      
      //  custom device specific breakpoints
      'retina': {'raw': '(-webkit-min-device-pixel-ratio: 2)'},
      'print': {'raw': 'print'},
    },
    
    //  custom extend breakpoints
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1920px',
        'mobile-h': {'raw': '(max-height: 667px)'},
      }
    }
  }
}

export default config 