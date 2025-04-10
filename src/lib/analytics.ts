import posthog from 'posthog-js'

// Analytics event types
export type AnalyticsEvent = 
  | 'brand_lookup'
  | 'generate_click'
  | 'export_click'
  | 'copy_click'
  | 'feedback_submit'
  | 'error_occurred'
  | 'demo_video_click'

// Helper function to check if PostHog is available
const isPostHogAvailable = () => {
  try {
    return typeof posthog !== 'undefined' && posthog.capture;
  } catch (error) {
    console.error('Error checking PostHog availability:', error);
    return false;
  }
};

// Analytics service
export const analytics = {
  // Brand lookup event
  trackBrandLookup: (brandDomain: string) => {
    try {
      if (!isPostHogAvailable()) {
        return;
      }

      posthog.capture('brand_lookup', {
        brand_domain: brandDomain,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling
    }
  },

  // Generate click event
  trackGenerateClick: () => {
    try {
      if (!isPostHogAvailable()) {
        return;
      }

      posthog.capture('generate_click', {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling
    }
  },

  // Export click event
  trackExportClick: (channel: string) => {
    try {
      if (!isPostHogAvailable()) {
        return;
      }

      posthog.capture('export_click', {
        channel,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling
    }
  },

  // Copy click event
  trackCopyClick: (channel: string) => {
    try {
      if (!isPostHogAvailable()) {
        return;
      }

      posthog.capture('copy_click', {
        channel,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling
    }
  },

  // Error tracking event
  trackError: (errorType: string, errorMessage: string, context?: Record<string, any>) => {
    try {
      if (!isPostHogAvailable()) {
        return;
      }

      posthog.capture('error_occurred', {
        error_type: errorType,
        error_message: errorMessage,
        context,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling
    }
  },

  // Feedback submit event
  trackFeedbackSubmit: (feedbackType: 'positive' | 'negative', feedbackText?: string) => {
    try {
      if (!isPostHogAvailable()) {
        return;
      }

      posthog.capture('feedback_submit', {
        feedback_type: feedbackType,
        feedback_text: feedbackText,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling
    }
  },

  // Generic track event
  track: (eventName: string, properties?: Record<string, any>) => {
    try {
      if (!isPostHogAvailable()) {
        return;
      }

      posthog.capture(eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Silent error handling
    }
  }
}; 