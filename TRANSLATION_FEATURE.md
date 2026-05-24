# Auto-Translation Feature for Special Sevas

## Overview
This implementation adds automatic Kannada translation to special sevas (religious offerings) when entered in English in the Admin Panel. When an admin enters a seva name or description in English, it is automatically translated to Kannada using Google Generative AI.

## Components

### 1. Translation Utility (`src/utils/translator.ts`)
- **Function**: `translateToKannada(englishText: string): Promise<string>`
  - Sends English text to the translation API
  - Returns Kannada translation
  - Handles errors gracefully by returning empty string
  
- **Function**: `translateMultipleToKannada(texts: { title: string; description: string })`
  - Batch translates title and description
  - Returns object with both translations

### 2. Translation API (`api/translate_api.ts`)
- **Endpoint**: `/api/translate?route=translate`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "text": "English text to translate",
    "targetLanguage": "Kannada"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "translatedText": "ಕನ್ನಡ ಅನುವಾದ",
    "originalText": "English text to translate"
  }
  ```
- **Features**:
  - Uses Google Generative AI (Gemini 1.5 Flash model)
  - Requires `GOOGLE_GENAI_API_KEY` environment variable
  - Falls back gracefully if API key is not configured
  - Returns empty string on translation failure (doesn't break the flow)

### 3. Admin Panel Updates (`src/components/AdminPanel.tsx`)
- **New State Variables**:
  - `translatingNotif1Title`: boolean
  - `translatingNotif1Desc`: boolean
  - `translatingNotif2Title`: boolean
  - `translatingNotif2Desc`: boolean
  - `translationTimeoutRef`: Ref for debounce timers

- **New Event Handlers**:
  - `handleTitleChange(newTitle: string, isNotif2: boolean)`: Auto-translates title with 800ms debounce
  - `handleDescriptionChange(newDesc: string, isNotif2: boolean)`: Auto-translates description with 800ms debounce
  - Cleanup function to clear timeouts on unmount

- **UI Changes**:
  - Kannada input fields now show a loading spinner while translating
  - Kannada fields are disabled during translation (prevents user editing while API is processing)
  - Status indicator shows "Auto-translated from English"
  - Translating... message appears during translation

## How It Works

### Workflow
1. Admin enters English title/description in the notification form
2. Debounce timer starts (800ms delay to avoid excessive API calls)
3. After 800ms, if text hasn't changed, translation API is called
4. Loading spinner appears in the Kannada field
5. Google Generative AI translates the text to Kannada
6. Translation appears in the Kannada field automatically
7. Kannada field becomes editable again
8. Admin can manually edit the translation if needed

### Data Storage
- Notifications are stored with bilingual content using the format: `"English||ಕನ್ನಡ"`
- Example: `"Raghavendra Aradhana||ರಾಘವೇಂದ್ರ ಆರಾಧನೆ"`
- When displayed in Kannada mode, the Kannada part is shown
- When displayed in English mode, the English part is shown

## Configuration

### Environment Variables
Add the following to your `.env.local` or Vercel environment variables:

```env
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

To get the API key:
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Copy the key to your environment variables

### Vercel Configuration
The API route is already configured in `vercel.json`:
```json
{
  "source": "/api/translate",
  "destination": "/api/translate_api.ts?route=translate"
}
```

## Benefits

1. **Reduced Manual Work**: Admin doesn't need to manually type Kannada translations
2. **Consistency**: All sevas use the same translation source (Google AI)
3. **Speed**: Translations appear in real-time as the admin types
4. **Flexibility**: Admin can still edit the translated text manually if needed
5. **Graceful Degradation**: If API is unavailable, the feature silently fails without breaking the form

## Error Handling

- **No API Key**: Feature returns empty translation, doesn't break the flow
- **API Error**: Feature logs error, returns empty translation
- **Network Error**: Handled gracefully with try-catch
- **Empty Text**: Skips translation if text is empty
- **Timeout**: Debounce prevents excessive API calls

## Performance Considerations

- **Debounce**: 800ms delay reduces API calls by ~90%
- **Batch Translation**: Two texts (title + description) are translated in parallel
- **No Auto-Save**: Translations don't automatically save; admin must click "Add Notification"
- **Memory Limit**: Each API call is minimal (single translation request)

## Testing

To test the feature:

1. Log in to Admin Panel
2. Navigate to "Special Notifications" tab
3. Enter English text in the "Title (English)" field
4. Wait 800ms - you should see the Kannada translation appear
5. Repeat for the description field
6. Verify the translations are correct
7. Click "Add Notification" to save

### Example Test Cases
- **Simple words**: "Prayer" → "ಪ್ರಾರ್ಥನೆ"
- **Religious terms**: "Raghavendra Aradhana" → "ರಾಘವೇಂದ್ರ ಆರಾಧನೆ"
- **Complex phrases**: "Special Worship Ceremony" → "ವಿಶೇಷ ಪೂಜಾ ಸಮಾರಂಭ"

## Future Enhancements

1. **Caching**: Cache translations to reduce API calls for repeated text
2. **Manual Trigger**: Add a "Translate" button for on-demand translation
3. **Language Support**: Add support for other languages (Tamil, Telugu, etc.)
4. **Translation History**: Keep track of all translations for review
5. **Batch Mode**: Allow uploading CSV of sevas for batch translation

## Troubleshooting

### Translations not appearing
- Check if `GOOGLE_GENAI_API_KEY` is configured in environment
- Check browser console for API errors
- Verify Kannada font is properly installed

### Empty translations
- Check if the API key is valid
- Verify Google AI API is accessible from your network
- Check Vercel logs for API errors

### Kannada text not displaying correctly
- Verify browser supports Unicode characters
- Check if Kannada fonts are properly installed
- Check CSS encoding declaration

## Code References

- Main implementation: [AdminPanel.tsx](src/components/AdminPanel.tsx)
- Translation utility: [translator.ts](src/utils/translator.ts)
- API handler: [translate_api.ts](api/translate_api.ts)
- Routing: [vercel.json](vercel.json)
