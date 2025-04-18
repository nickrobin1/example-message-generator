export interface MarketingContent {
  brandName: string;
  logoUrl: string;
  brandDescription: string;
  brandColor: string;
  industry: string;
  useCase: string;
  generatedAt?: string;
  whatsappMessage: string;
  smsMessage: string;
  pushMessage: string;
  cardTitle: string;
  cardDescription: string;
  cardImage: string;
  inAppTitle: string;
  inAppBody: string;
  inAppCtaText: string;
  inAppType?: string;
  inAppImage: string;
  inAppBackgroundImage?: string;
  inAppSurveyOptions: string[];
  inAppSelectedOptions: string[];
  inAppInputLabel?: string;
  inAppInputPlaceholder?: string;
  inAppInputLabel2?: string;
  inAppInputPlaceholder2?: string;
  inAppSubmitButtonText?: string;
  emailSubject: string;
  emailHeadline: string;
  emailBody: string;
  emailCta: string;
  smsIcon: string;
  pushIcon: string;
  whatsappIcon: string;
  sms_in_pitch?: boolean;
  push_in_pitch?: boolean;
  email_in_pitch?: boolean;
  card_in_pitch?: boolean;
  in_app_in_pitch?: boolean;
  whatsapp_in_pitch?: boolean;
  channel_order?: string[];
  // Channel goals from industry journey steps
  smsGoal?: string;
  pushGoal?: string;
  emailGoal?: string;
  cardGoal?: string;
  inAppGoal?: string;
  whatsappGoal?: string;
  emailImage: string;
}

export interface BrandFetchResponse {
  name: string;
  domain: string;
  logo: string;
  description?: string;
  longDescription?: string;
  contentImage?: string;
  colors?: {
    primary: string;
    all: Array<{ hex: string; type: string }>;
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
  inAppType?: string;
}

export interface IndustryDetermination {
  industry: string;
  useCase: string;
  confidence: number;
}