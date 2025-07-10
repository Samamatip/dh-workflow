import next from 'next';
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js'; //importing constants from next js to use in the next.config.js file

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, //enables strict mode in react js to catch bugs in the development phase itself
  
  // Enhanced development configuration for better HMR
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      // Keep pages in memory longer during development
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
    experimental: {
      // Enable faster builds and better HMR
      optimizeCss: false,
    },
  }),

  env: {
    //environment variables to be used in the application to store sensitive data like api keys and urls etc
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

//function to return the nextConfig object based on the phase of the application build process
const nextConfigFunction = async (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // In development, disable PWA to prevent interference with HMR
    console.log('🔄 Development mode: PWA disabled for better HMR');
    return nextConfig;
  }
  
  if (phase === PHASE_PRODUCTION_BUILD) {
    // Only enable PWA in production build
    const withPWA = (await import('@ducanh2912/next-pwa')).default({
      dest: 'public', //directory to store the pwa files
      disable: false, // Enable PWA in production
      register: true, // Enable automatic registration in production
      skipWaiting: true,
      reloadOnOnline: true,
    });

    //returning the nextConfig object enhanced with the pwa configuration
    return withPWA(nextConfig);
  }

  // Returning the default nextConfig object for other phases
  return nextConfig;
};

export default nextConfigFunction; //exporting the nextConfigFunction to be used in the next js build process
