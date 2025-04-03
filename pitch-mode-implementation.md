# Pitch Mode Implementation Plan

## Overview
Pitch Mode automatically generates industry-specific marketing content based on a brand's industry, using predefined use cases from industry_journeys.json. The system will make a single AI call to determine both the industry and use case, then use that information to generate relevant content.

## Core Flow
1. User enters brand domain/name
2. System looks up brand information (existing)
3. System makes ONE AI call to:
   - Determine industry from our enum
   - Select the appropriate use case from industry_journeys.json
4. System generates content using the determined industry/use case
5. User can view generated content in preview mode
6. User can generate and export a pitch slide

## Implementation Checklist

### Phase 1: Industry & Use Case Determination
- [x] Create new Netlify Function `determine-industry`
  - [x] Set up function with proper CORS headers
  - [x] Implement OpenAI integration
  - [x] Create prompt template with industry_journeys.json
  - [x] Add confidence scoring
  - [x] Add error handling with "Other Industries" fallback
  - [x] Add detailed logging
- [x] Update frontend to use new endpoint
  - [x] Add determineIndustry function to ai.ts
  - [x] Update types to include industry determination
  - [x] Add logging for debugging
- [ ] Test industry determination
  - [ ] Test with various brands
  - [ ] Verify confidence scores
  - [ ] Check error handling

### Phase 2: Content Generation Updates
- [x] Update generate-content Netlify Function
  - [x] Modify prompt to use industry and use case
  - [x] Include brand-specific details
  - [x] Use channel examples as templates
  - [ ] Update response format
- [x] Update frontend
  - [x] Remove content type selection UI
  - [x] Update content generation flow
  - [ ] Add loading states
  - [ ] Console Log to the browser window so we can see whats happening
- [ ] Test content generation
  - [ ] Test with various industries
  - [ ] Verify brand voice consistency
  - [ ] Check use case alignment

### Phase 3: Preview Generation
- [ ] Create new component `PitchModeView`
  - [ ] Design 16:9 layout
  - [ ] Include all 4 previews
  - [ ] Add brand information header
  - [ ] Add industry/use case information
- [ ] Add export functionality
  - [ ] Implement HTML to image conversion
  - [ ] Add download button
  - [ ] Ensure proper resolution
- [ ] Test preview generation
  - [ ] Test with various content lengths
  - [ ] Verify image quality
  - [ ] Check mobile responsiveness

### Phase 4: Integration & Polish
- [ ] Add loading states
  - [ ] During industry determination
  - [ ] During content generation
  - [ ] During preview generation
- [ ] Add error states
  - [ ] For failed industry determination
  - [ ] For failed content generation
  - [ ] For failed preview generation
- [ ] Add analytics
  - [ ] Track industry determination accuracy
  - [ ] Track preview generation usage
  - [ ] Track export usage
- [ ] Final testing
  - [ ] End-to-end flow testing
  - [ ] Cross-browser testing
  - [ ] Mobile testing

## Technical Details

### Industry Determination Prompt
```typescript
interface IndustryDetermination {
  industry: string;
  useCase: string;
  confidence: number;
  channelExamples: {
    inApp: string;
    sms: string;
    email: string;
    push: string;
  };
}
```

### Content Generation Prompt
The content generation will use the determined industry and use case to create brand-specific content that follows the use case structure.

### Preview Layout
- 16:9 aspect ratio
- Brand information header
- Industry and use case information
- 4 preview sections (Email, SMS, Push, In-App)
- Export button

## Testing Strategy
1. Test each phase independently
2. Use a variety of brands across different industries
3. Verify content quality and relevance
4. Check error handling and fallbacks
5. Test export functionality
6. Verify mobile responsiveness

## Success Criteria
1. Accurate industry determination (high confidence scores)
2. Relevant, brand-specific content generation
3. High-quality preview generation
4. Smooth export functionality
5. Good error handling and user feedback

## Future Considerations
1. Multiple use cases per industry
2. Custom use case templates
3. Industry-specific customization options
4. Analytics dashboard
5. A/B testing capabilities 