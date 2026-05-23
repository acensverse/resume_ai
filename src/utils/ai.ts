// Helper for AI resume enhancement (Real Gemini API + Mock Fallback)

const MOCK_ACTION_VERBS = [
  'Spearheaded', 'Architected', 'Optimized', 'Engineered', 'Orchestrated',
  'Pioneered', 'Catalyzed', 'Streamlined', 'Conceptualized', 'Formulated'
];

const MOCK_METRICS = [
  'resulting in a 35% reduction in page load latency',
  'driving a 22% increase in weekly active user engagement',
  'reducing operational server expenditures by $8,000 monthly',
  'boosting checkout funnel conversion efficiency by 14%',
  'improving automated test coverage metrics from 60% to 92%',
  'accelerating cross-functional sprint velocity by 20%'
];

/**
 * Clean and polish text using rules-based mock system
 */
function generateMockEnhancement(text: string, type: 'bullet' | 'summary' | 'skills'): string {
  if (!text || text.trim().length === 0) {
    return 'Please enter some text for the AI to enhance.';
  }

  if (type === 'skills') {
    return 'TypeScript, Next.js App Router, Tailwind CSS, React Query, WebSockets, PostgreSQL, Docker, AWS S3, CI/CD pipelines (GitHub Actions), Jest, Cypress';
  }

  if (type === 'summary') {
    // Add professional fluff/actions to summary
    return `Results-driven professional with a proven track record of success in this domain. Adept at leveraging modern methodologies and tools to solve complex challenges, improve system architectures, and deliver high-business-value features. Exceptional communicator skilled in collaborating with cross-functional partners and mentoring team members to achieve project velocity.`;
  }

  // Refine bullet points
  let cleanText = text.trim();
  // Strip starting bullet if user typed one
  cleanText = cleanText.replace(/^[\s•\-*+]+/, '');
  
  // Replace standard verbs
  const weakVerbs: Record<string, string> = {
    'helped with': 'facilitated the development of',
    'helped': 'partnered with cross-functional teams to deploy',
    'worked on': 'engineered critical interfaces for',
    'made': 'architected',
    'built': 'engineered and shipped',
    'created': 'conceptualized and implemented',
    'fixed': 'debugged and optimized',
    'managed': 'orchestrated',
    'changed': 'revamped'
  };

  let lower = cleanText.toLowerCase();
  let matched = false;
  for (const [weak, strong] of Object.entries(weakVerbs)) {
    if (lower.startsWith(weak)) {
      cleanText = cleanText.substring(weak.length).trim();
      // Capitalize first letter of remaining text
      cleanText = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);
      cleanText = `${strong} ${cleanText}`;
      matched = true;
      break;
    }
  }

  if (!matched) {
    const randomVerb = MOCK_ACTION_VERBS[Math.floor(Math.random() * MOCK_ACTION_VERBS.length)];
    cleanText = `${randomVerb} and optimized systems to address: ${cleanText.charAt(0).toLowerCase() + cleanText.slice(1)}`;
  }

  // Check if it already has numbers/metrics, otherwise add one
  if (!/\d+%|\$\d+|\d+\s*(hours|days|weeks|months|years|developers)/.test(cleanText)) {
    const randomMetric = MOCK_METRICS[Math.floor(MOCK_METRICS.length * Math.random())];
    // Ensure text ends with period, remove it, append metric
    cleanText = cleanText.replace(/\.+$/, '');
    cleanText = `${cleanText}, ${randomMetric}.`;
  } else {
    // Just add ending period if missing
    if (!cleanText.endsWith('.')) {
      cleanText += '.';
    }
  }

  return cleanText;
}

/**
 * Call Google Gemini API directly from client side (safe for user-controlled personal keys)
 */
async function callGeminiApi(apiKey: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Gemini API Error: Status ${response.status}. ${errorDetails}`);
  }

  const json = await response.json();
  const outputText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!outputText) {
    throw new Error('Gemini API returned an empty response.');
  }

  return outputText.trim();
}

/**
 * Main AI function to enhance resume items
 */
export async function enhanceResumeContent(
  text: string,
  type: 'bullet' | 'summary' | 'skills',
  jobTitle?: string
): Promise<string> {
  // Retrieve API key if stored in local storage
  let apiKey = '';
  if (typeof window !== 'undefined') {
    apiKey = localStorage.getItem('gemini_api_key') || '';
  }

  if (!apiKey) {
    // Artificial 1 second delay to simulate AI thinking visually
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return generateMockEnhancement(text, type);
  }

  let prompt = '';
  if (type === 'bullet') {
    prompt = `You are a professional resume writer. Rewrite the following bullet point from a resume to make it highly impactful, action-oriented, metrics-driven, and concise. Use strong action verbs at the start. Keep it to one single bullet point statement (do NOT return bullet points, HTML tags, or introductory remarks, just return the raw text).
Original text: "${text}"${jobTitle ? `\nTarget Role Context: ${jobTitle}` : ''}`;
  } else if (type === 'summary') {
    prompt = `You are a professional resume writer. Rewrite the following professional summary for a resume. Make it compelling, modern, and aligned with industry standards. Keep it under 3-4 sentences. Do NOT output any headings, formatting, or introductory text.
Original text: "${text}"${jobTitle ? `\nTarget Role: ${jobTitle}` : ''}`;
  } else {
    prompt = `Provide a comma-separated list of 10-15 highly relevant skills and keywords for a professional targeting the job title or description: "${text}". Do NOT add any extra introductory words, formatting, bullet points or numbering. Return only the raw comma-separated items.`;
  }

  try {
    return await callGeminiApi(apiKey, prompt);
  } catch (error) {
    console.error('Gemini API failure, falling back to mock generator:', error);
    // Return mock results with a warning prepended
    const mockResult = generateMockEnhancement(text, type);
    throw new Error(error instanceof Error ? error.message : 'Unknown API Error');
  }
}
