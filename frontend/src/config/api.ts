// API Base URL configuration
// In production (Vercel), API routes are served from the same domain
// In development, they're served from localhost:3000
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD
  ? 'https://marketing-crm-zstb.onrender.com'
  : 'http://localhost:3000');

// Helper function to build API URLs
export const getApiUrl = (path: string) => {
  return `${API_BASE_URL}${path}`;
};
