import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  const route = req.query.route as string;

  try {
    switch (route) {
      case 'translate':
        return handleTranslate(req, res);
      default:
        return res.status(404).json({ success: false, message: `Route '${route}' not found` });
    }
  } catch (error: any) {
    console.error(`[translate_api] Error in route ${route}:`, error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

async function handleTranslate(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { text, targetLanguage } = req.body || {};

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, error: 'Text is required' });
  }

  if (targetLanguage !== 'Kannada' && targetLanguage !== 'kn') {
    return res.status(400).json({ success: false, error: 'Only Kannada translation is supported' });
  }

  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      console.warn('[translate_api] GOOGLE_GENAI_API_KEY not configured. Returning empty translation.');
      return res.status(200).json({ 
        success: true, 
        translatedText: '',
        warning: 'Translation API key not configured'
      });
    }

    // Use Google Generative AI to translate to Kannada
    const translatedText = await translateToKannada(text, apiKey);

    return res.status(200).json({
      success: true,
      translatedText,
      originalText: text
    });
  } catch (error: any) {
    console.error('[translate_api] Translation error:', error);
    // Return gracefully instead of failing
    return res.status(200).json({
      success: true,
      translatedText: '',
      error: error.message || 'Translation service temporarily unavailable'
    });
  }
}

async function translateToKannada(text: string, apiKey: string): Promise<string> {
  const prompt = `Translate the following English text to Kannada. Return ONLY the Kannada translation without any explanation or additional text.

English text: "${text}"

Kannada translation:`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 1,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.error?.message || 
        `Google API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No translation candidates returned');
    }

    const translatedText = data.candidates[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up the translation (remove extra whitespace)
    return translatedText.trim();
  } catch (error: any) {
    console.error('[translateToKannada] API call failed:', error);
    throw error;
  }
}
