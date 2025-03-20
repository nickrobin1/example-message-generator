export interface MarketingContent {
  brandName: string;
  logoUrl: string;
  smsMessage: string;
  pushTitle: string;
  pushMessage: string;
  cardTitle: string;
  cardDescription: string;
  cardImage: string;
  userReply: string;
  brandReply: string;
  // In-app message fields
  inAppType: 'modal-logo' | 'modal-image' | 'fullscreen' | 'survey';
  inAppTitle: string;
  inAppBody: string;
  inAppImage: string;
  inAppCtaText: string;
  inAppSurveyOptions: string[];
  inAppSelectedOptions: string[];
  inAppSurveyType: 'single' | 'multiple';
  inAppBackgroundImage: string;
}