import posthog from 'posthog-js'

// Analytics event types
export type AnalyticsEvent = 
  | 'brand_lookup'
  | 'generate_click'
  | 'export_click'
  | 'copy_click'
  | 'feedback_submit'

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
        console.warn('PostHog not available, skipping brand lookup tracking');
        return;
      }

      posthog.capture('brand_lookup', {
        brand_domain: brandDomain,
        timestamp: new Date().toISOString()
      });
      console.log('Tracked brand lookup:', brandDomain);
    } catch (error) {
      console.error('Failed to track brand lookup:', error);
    }
  },

  // Generate click event
  trackGenerateClick: () => {
    try {
      if (!isPostHogAvailable()) {
        console.warn('PostHog not available, skipping generate click tracking');
        return;
      }

      posthog.capture('generate_click', {
        timestamp: new Date().toISOString()
      });
      console.log('Tracked generate click');
    } catch (error) {
      console.error('Failed to track generate click:', error);
    }
  },

  // Export click event
  trackExportClick: (channel: string) => {
    try {
      if (!isPostHogAvailable()) {
        console.warn('PostHog not available, skipping export click tracking');
        return;
      }

      posthog.capture('export_click', {
        channel,
        timestamp: new Date().toISOString()
      });
      console.log('Tracked export click:', channel);
    } catch (error) {
      console.error('Failed to track export click:', error);
    }
  },

  // Copy click event
  trackCopyClick: (channel: string) => {
    try {
      if (!isPostHogAvailable()) {
        console.warn('PostHog not available, skipping copy click tracking');
        return;
      }

      posthog.capture('copy_click', {
        channel,
        timestamp: new Date().toISOString()
      });
      console.log('Tracked copy click:', channel);
    } catch (error) {
      console.error('Failed to track copy click:', error);
    }
  },

  // Feedback submit event
  trackFeedbackSubmit: (feedbackType: 'positive' | 'negative', feedbackText?: string) => {
    try {
      if (!isPostHogAvailable()) {
        console.warn('PostHog not available, skipping feedback submit tracking');
        return;
      }

      posthog.capture('feedback_submit', {
        feedback_type: feedbackType,
        feedback_text: feedbackText,
        timestamp: new Date().toISOString()
      });
      console.log('Tracked feedback submit:', feedbackType);
    } catch (error) {
      console.error('Failed to track feedback submit:', error);
    }
  }
}; 