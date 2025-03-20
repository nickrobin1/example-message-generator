export type MarketingContent = {
  brandName: string;
  logoUrl: string;
  brandDescription: string;
  smsMessage: string;
  pushTitle: string;
  pushMessage: string;
  cardTitle: string;
  cardDescription: string;
  cardImage: string;
  userReply: string;
  brandReply: string;
  inAppType: string;
  inAppTitle: string;
  inAppBody: string;
  inAppImage: string;
  inAppCtaText: string;
  inAppSurveyOptions: string[];
  inAppSelectedOptions: string[];
  inAppSurveyType: string;
  inAppBackgroundImage: string;
  smsIcon: string;
  pushIcon: string;
  inAppInputLabel?: string;
  inAppInputPlaceholder?: string;
  inAppSubmitButtonText?: string;
};

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
  pushTitle: string;
  pushMessage: string;
  cardTitle: string;
  cardDescription: string;
  inAppTitle: string;
  inAppBody: string;
  inAppCtaText: string;
}