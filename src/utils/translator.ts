/**
 * Translation utility for converting English text to Kannada
 * Uses Google Generative AI for accurate translations
 */

export async function translateToKannada(englishText: string): Promise<string> {
  if (!englishText || englishText.trim().length === 0) {
    return '';
  }

  try {
    const response = await fetch('/api/translate?route=translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: englishText,
        targetLanguage: 'Kannada'
      })
    });

    if (!response.ok) {
      console.error('Translation API error:', response.statusText);
      return '';
    }

    const data = await response.json();
    
    if (data.success && data.translatedText) {
      return data.translatedText;
    }

    console.warn('Translation service returned empty result:', data);
    return '';
  } catch (error) {
    console.error('Translation error:', error);
    return '';
  }
}

/**
 * Batch translate multiple texts to Kannada
 */
export async function translateMultipleToKannada(
  texts: { title: string; description: string }
): Promise<{ title: string; description: string }> {
  const [titleKn, descKn] = await Promise.all([
    translateToKannada(texts.title),
    translateToKannada(texts.description)
  ]);

  return {
    title: titleKn,
    description: descKn
  };
}
