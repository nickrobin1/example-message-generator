interface Step {
  Goal: string;
  Prompt: string;
  Type?: string;
}

interface IndustryJourney {
  name: string;
  use_case: string;
  steps: {
    [key: string]: Step;
  };
}

interface IndustryJourneys {
  industries: IndustryJourney[];
}

export const industryJourneys: IndustryJourneys = {
  "industries": [
    {
      "name": "Retail & Consumer Goods",
      "use_case": "Abandoned Cart",
      "steps": {
        "In-App": {
          "Goal": "Capture customer contact information",
          "Prompt": "Create an in-browser message that offers a 15% discount code in exchange for the customer providing their email and phone number to enable personalized shopping updates.",
          "Type": "Email/Phone Capture"
        },
        "Email": {
          "Goal": "Drive return with coupon offer",
          "Prompt": "Write a welcome email that includes a 15% coupon code and encourages the customer to return and complete their purchase."
        },
        "SMS": {
          "Goal": "Recover cart with quick reminder",
          "Prompt": "Create a short SMS that references the customer's last viewed items and includes the 15% discount code."
        }
      }
    },
    {
      "name": "Media & Entertainment",
      "use_case": "Account Creation to App Download",
      "steps": {
        "Email": {
          "Goal": "Promote app for better experience",
          "Prompt": "Write an email that highlights exclusive app benefits and encourages users to download it now."
        },
        "In-App": {
          "Goal": "Collect content preferences",
          "Prompt": "Design an in-app survey that asks users about their favorite genres, shows, or viewing times.",
          "Type": "Survey"
        },
        "Push": {
          "Goal": "Notify user when new content is available",
          "Prompt": "Craft a push notification letting the user know that a series that is on their favorites has a new episode."
        }
      }
    },
    {
      "name": "Restaurants & On-Demand",
      "use_case": "App Download and First Purchase",
      "steps": {
        "Email": {
          "Goal": "Incentivize app download with promo",
          "Prompt": "Write a promotional email welcoming user, introducing the first-order discount and inviting the user to download the app."
        },
        "Content Card": {
          "Goal": "Prompt popular items to the user in feed",
          "Prompt": "Create a content card promoting popular items and reminding user they can apply their promo code."
        },
        "Push": {
          "Goal": "Confirm order and status",
          "Prompt": "Write a push notification that confirms the order and includes delivery or pickup time."
        }
      }
    },
    {
      "name": "Financial Services",
      "use_case": "Drive Direct Deposit Set-Up",
      "steps": {
        "In-App": {
          "Goal": "Prime for Push Opt-In",
          "Prompt": "Create an in-app message that educates user on benefits of opting into push notifications with this brand and asks them to opt in.",
          "Type": "Modal with Logo"
        },
        "Push": {
          "Goal": "Nudge setup for direct deposit",
          "Prompt": "Write a concise push notification that highlights the convenience and speed of setting up direct deposit."
        },
        "Content Card": {
          "Goal": "Explain direct deposit benefits",
          "Prompt": "Create an in-app content card explaining why direct deposit is beneficial and linking to the setup screen."
        },
        "Email": {
          "Goal": "Confirm setup success",
          "Prompt": "Write a confirmation email thanking the user for setting up direct deposit and outlining what happens next."
        }
      }
    },
    {
      "name": "Travel & Hospitality",
      "use_case": "Abandoned Booking to App Download",
      "steps": {
        "In-App": {
          "Goal": "Capture email for personalized itineraries",
          "Prompt": "Create an email capture form that offers to send personalized itineraries and travel recommendations.",
          "Type": "Email Capture"
        },
        "Email": {
          "Goal": "Recover booking, push app download",
          "Prompt": "Write a two-part email: first, a reminder to finish booking their trip; second, an invitation to download the app for itinerary tracking and travel updates."
        },
        "Content Card": {
          "Goal": "Cross-sell trip add-ons",
          "Prompt": "Create an in-app content card suggesting popular add-ons such as dinner reservations or local experiences."
        }
      }
    },
    {
      "name": "Healthcare & Life Sciences",
      "use_case": "Appointment Booking & Reminders",
      "steps": {
        "Email": {
          "Goal": "Confirm appointment time",
          "Prompt": "Write a text message confirming the user's appointment date, time, and location."
        },
        "SMS": {
          "Goal": "Send pre-visit instructions",
          "Prompt": "Create an email that provides instructions on what to bring, how to prepare, and safety protocols."
        },
        "Push": {
          "Goal": "Reminder 24 hours before visit",
          "Prompt": "Write a push notification that reminds the user of their upcoming appointment and allows them to reschedule if needed."
        }
      }
    },
    {
      "name": "Telecommunications",
      "use_case": "New Plan Activation Journey",
      "steps": {
        "Email": {
          "Goal": "Confirm new plan activation",
          "Prompt": "Send a welcome email confirming the user's new plan and outlining their benefits and promoting app download."
        },
        "SMS": {
          "Goal": "Alert user of first bill",
          "Prompt": "Write a brief SMS alerting the user that their first bill is ready and where to view it."
        },
        "In-App": {
          "Goal": "Educate on data usage tools",
          "Prompt": "Create an in-app message or tutorial highlighting where the user can track their data and usage.",
          "Type": "Modal with Logo"
        },
        "Push": {
          "Goal": "Nudge to enroll in autopay",
          "Prompt": "Craft a push notification reminding the user to set up autopay and avoid missed payments."
        }
      }
    },
    {
      "name": "Education",
      "use_case": "Continued Learning and Streak Celebration",
      "steps": {
        "In-App": {
          "Goal": "Prompt users to pick goals for their learning",
          "Prompt": "Design an in-app survey asking the number of minutes per day they want to dedicate towards their learning goals.",
          "Type": "Survey"
        },
        "Push": {
          "Goal": "Get users to return to the app for their lesson",
          "Prompt": "Send a push notification encouraging the user to complete their lesson for the day."
        },
        "Content Card": {
          "Goal": "Celebrate the user's learning streak",
          "Prompt": "Create a content card that celebrates the user's X day long learning streak."
        }
      }
    },
    {
      "name": "Other Industries",
      "use_case": "Newsletter Signup to Loyalty Enrollment",
      "steps": {
        "In-App": {
          "Goal": "Prompt newsletter signup",
          "Prompt": "Create a modal offering users a chance to sign up for the newsletter in exchange for early access to promotions.",
          "Type": "Email/Phone Capture"
        },
        "Email": {
          "Goal": "Drive loyalty program awareness",
          "Prompt": "Send an email that thanks the user for subscribing and promotes the benefits of joining the loyalty program."
        },
        "SMS": {
          "Goal": "Notify of loyalty bonus",
          "Prompt": "Craft an sms alerting the user that joining the loyalty program earns them bonus points or discounts."
        }
      }
    },
    {
      "name": "Gaming",
      "use_case": "Increase Game Play and Referrals",
      "steps": {
        "Push": {
          "Goal": "Encourage gamer to return to the app",
          "Prompt": "Create a push notification encouraging the gamer to return to the app to continue their game progress."
        },
        "In-App": {
          "Goal": "Celebrate gaming streak",
          "Prompt": "Create an in-app message that celebrates the gamer's X day long gaming streak.",
          "Type": "Modal with Logo"
        },
        "Content Card": {
          "Goal": "Encourage referrals",
          "Prompt": "Design a content card that promotes inviting friends to join the game."
        }
      }
    },
    {
      "name": "Insurance",
      "use_case": "Onboarding to Claim Processing Update",
      "steps": {
        "In-App": {
          "Goal": "Customer profile completion",
          "Prompt": "Surface an in-app message encouraging the customer to complete their profile and access their ID card.",
          "Type": "Modal with Logo"
        },
        "Content Card": {
          "Goal": "Promote plan benefits",
          "Prompt": "Create a content card that promotes the benefits of their membership."
        },
        "Push": {
          "Goal": "Update customer in real-time about claim processing",
          "Prompt": "Create a push notification that lets the customer know that their claim has been processed."
        }
      }
    }
  ]
}; 