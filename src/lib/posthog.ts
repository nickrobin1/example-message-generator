import posthog from 'posthog-js';

// Initialize PostHog
posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com',
  loaded: (posthog) => {
    // Enable feature flags
  // posthog.featureFlags.override({ 'cta-buttons': 'hover' });
  }
});

window.posthog = posthog;

export { posthog }; 