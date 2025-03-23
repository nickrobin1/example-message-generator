import posthog from 'posthog-js'

// Analytics event types
export type AnalyticsEvent = 
  | 'brand_lookup'
  | 'generate_click'
  | 'export_click'
  | 'feedback_submit'

// Analytics service
export const analytics = {
  // Brand lookup event
  trackBrandLookup: (brandDomain: string) => {
    try {
      posthog.capture('brand_lookup', {
        brand_domain: brandDomain,
        timestamp: new Date().toISOString()
      })
      console.log('Tracked brand lookup:', brandDomain)
    } catch (error) {
      console.error('Failed to track brand lookup:', error)
    }
  },

  // Generate click event
  trackGenerateClick: () => {
    try {
      posthog.capture('generate_click', {
        timestamp: new Date().toISOString()
      })
      console.log('Tracked generate click')
    } catch (error) {
      console.error('Failed to track generate click:', error)
    }
  },

  // Export click event
  trackExportClick: (channel: string) => {
    try {
      posthog.capture('export_click', {
        channel,
        timestamp: new Date().toISOString()
      })
      console.log('Tracked export click:', channel)
    } catch (error) {
      console.error('Failed to track export click:', error)
    }
  },

  // Feedback submit event
  trackFeedbackSubmit: (feedbackType: 'positive' | 'negative', feedbackText?: string) => {
    try {
      posthog.capture('feedback_submit', {
        feedback_type: feedbackType,
        feedback_text: feedbackText,
        timestamp: new Date().toISOString()
      })
      console.log('Tracked feedback submit:', feedbackType)
    } catch (error) {
      console.error('Failed to track feedback submit:', error)
    }
  }
} 