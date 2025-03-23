import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PostHogProvider } from 'posthog-js/react';
import posthog from 'posthog-js';
import App from './App.tsx';
import './index.css';

// Initialize PostHog with proper error handling
const initializePostHog = () => {
  return new Promise((resolve, reject) => {
    try {
      const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
      const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

      if (!posthogKey || !posthogHost) {
        throw new Error('PostHog configuration is missing. Please check your environment variables.');
      }

      console.log('Initializing PostHog with:', {
        key: posthogKey ? 'Present' : 'Missing',
        host: posthogHost ? 'Present' : 'Missing'
      });

      resolve({
        apiKey: posthogKey,
        options: {
          api_host: posthogHost,
          loaded: (posthogInstance: typeof posthog) => {
            posthogInstance.debug() // Enable debug mode temporarily
            console.log('PostHog initialized successfully');
          },
          capture_pageview: true,
          capture_pageleave: true,
          autocapture: true,
        }
      });
    } catch (error) {
      console.error('Failed to initialize PostHog:', error);
      reject(error);
    }
  });
};

// App wrapper component that handles PostHog initialization
const AppWrapper = () => {
  const [isPostHogReady, setIsPostHogReady] = useState(false);
  const [postHogConfig, setPostHogConfig] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePostHog()
      .then(config => {
        setPostHogConfig(config);
        setIsPostHogReady(true);
      })
      .catch(err => {
        setError(err.message);
        console.error('PostHog initialization failed:', err);
      });
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Analytics Initialization Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            The app will continue to function, but analytics will be disabled.
          </p>
        </div>
      </div>
    );
  }

  if (!isPostHogReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Loading...</h2>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-[#3D1D72] animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PostHogProvider {...postHogConfig}>
      <App />
    </PostHogProvider>
  );
};

// Create root and render the app wrapper
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
