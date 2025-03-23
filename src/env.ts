// This file is used to inject environment variables into the window object
// This prevents the environment variables from being included in the build output
export function injectEnv() {
  window.ENV = {
    VITE_PUBLIC_POSTHOG_KEY: import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
    VITE_PUBLIC_POSTHOG_HOST: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  };
} 