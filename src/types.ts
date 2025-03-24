export interface MarketingContent {
  // Brand info
  brandName: string;
  logoUrl: string;
  brandDescription: string;
  brandColor?: string;

  // SMS
  smsMessage: string;
  smsIcon: string;

  // Push
  pushMessage: string;
  pushIcon: string;

  // Card
  cardTitle: string;
  cardDescription: string;
  cardImage: string;

  // Email
  emailSubject: string;
  emailHeadline: string;
  emailBody: string;
  emailCta: string;
  emailImage: string;

  // In-App Message
  inAppType: 'modal-logo' | 'modal-image' | 'survey' | 'information-capture';
  inAppTitle: string;
  inAppBody: string;
  inAppCtaText: string;
  inAppImage: string;
  inAppBackgroundImage: string;
  inAppSurveyOptions: string[];
  inAppSelectedOptions: string[];
  inAppSurveyType: 'single' | 'multiple';
  inAppInputLabel: string;
  inAppInputPlaceholder: string;
  inAppSubmitButtonText: string;
  userReply: string;
  brandReply: string;
}

export interface BrandFetchResponse {
  name: string;
  domain: string;
  logo: string;
  description?: string;
  longDescription?: string;
  colors?: {
    primary: string;
    all: Array<{ hex: string; type: string; brightness: number }>;
  };
}

export interface AIGeneratedContent {
  smsMessage: string;
  pushMessage: string;
  cardTitle: string;
  cardDescription: string;
  inAppTitle: string;
  inAppBody: string;
  inAppCtaText: string;
}