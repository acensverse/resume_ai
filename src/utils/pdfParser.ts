import { ResumeData } from '../types/resume';

/**
 * Dynamically loads pdf.js from cdnjs in the browser (client-side only)
 */
const loadPdfJs = async (): Promise<any> => {
  if (typeof window === 'undefined') return null;
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      resolve(pdfjsLib);
    };
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

/**
 * Extracts raw text page-by-page from a PDF ArrayBuffer using pdf.js
 */
export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdfjsLib = await loadPdfJs();
  if (!pdfjsLib) throw new Error('PDF parsing library could not be loaded in this environment.');

  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

/**
 * Directly communicates with Google Gemini API to parse text into ResumeData layout
 */
async function callGeminiParser(apiKey: string, prompt: string): Promise<string> {
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
        temperature: 0.2, // Lower temperature is better for strict JSON formatting
        responseMimeType: 'application/json' // Instruct Gemini to return valid JSON
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
    throw new Error('Gemini API returned an empty parse response.');
  }

  return outputText.trim();
}

/**
 * Prompts Gemini to parse the raw resume text into our typed layout JSON
 */
export async function parseResumeTextWithAi(text: string, apiKey: string): Promise<ResumeData> {
  const prompt = `
You are an expert resume parsing AI. Parse the following raw text extracted from a resume PDF and format it strictly as a single JSON object matching the TypeScript type schema below. 

You must return ONLY the raw valid JSON string. Do not wrap the JSON in markdown code blocks like \`\`\`json ... \`\`\`. Do not include any conversational explanation or HTML.

TypeScript Schema:
interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
}

interface Experience {
  id: string; // generate unique id e.g. "exp-1", "exp-2"
  company: string;
  position: string;
  location: string;
  startDate: string; // YYYY-MM format, or empty if unknown
  endDate: string; // YYYY-MM format, or empty if present/unknown
  current: boolean;
  bullets: string[];
}

interface Education {
  id: string; // generate unique id e.g. "edu-1", "edu-2"
  school: string;
  degree: string;
  major: string;
  location: string;
  startDate: string; // YYYY-MM format, or empty if unknown
  endDate: string; // YYYY-MM format, or empty if present/unknown
  current: boolean;
  description: string;
}

interface Project {
  id: string; // generate unique id e.g. "proj-1", "proj-2"
  name: string;
  description: string;
  bullets: string[];
  technologies: string[];
  link: string;
}

interface SkillGroup {
  id: string; // generate unique id e.g. "skill-1", "skill-2"
  category: string;
  items: string[]; // list of skills in this category
}

interface ResumeSettings {
  templateId: 'modern' | 'classic' | 'creative' | 'minimalist'; // pick the best layout template matching their style
  primaryColor: string; // pick a nice accent color hex that matches their style (e.g. '#6366f1' for indigo, '#0f766e' for teal, '#2563eb' for blue)
  fontFamily: string; // 'font-sans' or 'font-serif' or 'font-mono' or 'font-outfit'
  fontSize: 'sm' | 'md' | 'lg';
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  margins: 'compact' | 'normal' | 'loose';
  sectionOrder: string[]; // order of sections, default is ['experiences', 'education', 'projects', 'skills']
  sectionTitles?: Record<string, string>;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  customSections: any[];
  settings: ResumeSettings;
}

Raw resume text to parse:
"""
${text}
"""
`;

  const parsedJsonText = await callGeminiParser(apiKey, prompt);
  try {
    const resumeData = JSON.parse(parsedJsonText);
    
    // Validate basic required sections
    if (!resumeData.personalInfo) {
      throw new Error("Missing personalInfo section in parsed output.");
    }
    
    // Ensure arrays exist
    resumeData.experiences = resumeData.experiences || [];
    resumeData.education = resumeData.education || [];
    resumeData.projects = resumeData.projects || [];
    resumeData.skills = resumeData.skills || [];
    resumeData.customSections = resumeData.customSections || [];
    
    // Ensure settings exists
    resumeData.settings = resumeData.settings || {
      templateId: 'modern',
      primaryColor: '#6366f1',
      fontFamily: 'font-sans',
      fontSize: 'md',
      lineSpacing: 'normal',
      margins: 'normal',
      sectionOrder: ['experiences', 'education', 'projects', 'skills']
    };
    
    return resumeData;
  } catch (error) {
    console.error('Failed to parse Gemini JSON output:', parsedJsonText, error);
    throw new Error('Failed to structure the parsed data into a valid resume blueprint.');
  }
}

/**
 * Basic client-side regex fallback parser to pull contact info and simple sections if no Gemini Key
 */
export function parseResumeTextFallback(text: string): ResumeData {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract phone
  const phoneRegex = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract links
  const githubRegex = /github\.com\/[a-zA-Z0-9_-]+/;
  const githubMatch = text.match(githubRegex);
  const github = githubMatch ? `https://${githubMatch[0]}` : '';

  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/;
  const linkedinMatch = text.match(linkedinRegex);
  const linkedin = linkedinMatch ? `https://${linkedinMatch[0]}` : '';

  // Guess name from the first few lines (ignore header titles or short strings)
  let name = '';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length > 3 && line.length < 30 && !line.includes('@') && !line.includes('http') && !/\d/.test(line)) {
      name = line;
      break;
    }
  }

  // Guess title from next line
  let title = '';
  if (name) {
    const nameIdx = lines.indexOf(name);
    if (nameIdx !== -1 && nameIdx + 1 < lines.length) {
      const nextLine = lines[nameIdx + 1];
      if (nextLine.length < 50 && !nextLine.includes('@') && !nextLine.includes('http') && !/education|experience|skills|projects/i.test(nextLine)) {
        title = nextLine;
      }
    }
  }

  // Guess summary
  let summary = '';
  const summaryKeywords = ['summary', 'profile', 'objective', 'about me', 'professional profile'];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (summaryKeywords.some(kw => line === kw || line.startsWith(kw + ' '))) {
      const summaryLines = [];
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        if (nextLine.length < 40 && (
          nextLine.toLowerCase().includes('experience') || 
          nextLine.toLowerCase().includes('education') || 
          nextLine.toLowerCase().includes('skills') || 
          nextLine.toLowerCase().includes('projects') || 
          nextLine.toLowerCase().includes('employment')
        )) {
          break;
        }
        summaryLines.push(nextLine);
        j++;
      }
      summary = summaryLines.join(' ');
      break;
    }
  }

  // Fallback structures
  return {
    personalInfo: {
      name: name || 'Extracted Profile',
      title: title || 'Professional Title',
      email: email,
      phone: phone,
      location: 'City, Country',
      website: '',
      github: github,
      linkedin: linkedin,
      summary: summary || 'Professional summary extracted from PDF.'
    },
    experiences: [
      {
        id: 'exp-1',
        company: 'Company',
        position: 'Role',
        location: '',
        startDate: '',
        endDate: '',
        current: true,
        bullets: ['Extracted layout contents. Open editor to refine details and AI-polish achievements.']
      }
    ],
    education: [
      {
        id: 'edu-1',
        school: 'University',
        degree: 'Degree',
        major: 'Subject',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ],
    projects: [],
    skills: [
      {
        id: 'skill-1',
        category: 'Skills Overview',
        items: ['Extracted Section data. Fill categories in builder details.']
      }
    ],
    customSections: [],
    settings: {
      templateId: 'modern',
      primaryColor: '#6366f1',
      fontFamily: 'font-sans',
      fontSize: 'md',
      lineSpacing: 'normal',
      margins: 'normal',
      sectionOrder: ['experiences', 'education', 'projects', 'skills']
    }
  };
}
