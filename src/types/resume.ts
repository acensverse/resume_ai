export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  bullets: string[];
  technologies: string[];
  link: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  name: string;
  items: CustomSectionItem[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: 'star' | 'cog' | 'chart' | 'heart' | 'bulb' | 'trophy' | 'target' | 'bolt';
}

export interface Passion {
  id: string;
  title: string;
  description: string;
  icon?: 'leaf' | 'book' | 'globe' | 'music' | 'coffee' | 'bike' | 'smile';
}

export interface Language {
  id: string;
  name: string;
  level: string;
  rating: number; // 1 to 5
}

export interface Course {
  id: string;
  name: string;
  provider: string;
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  description?: string;
}

export interface ResumeSettings {
  templateId: 'modern' | 'classic' | 'creative' | 'minimalist' | 'double-column' | 'dark-sidebar' | 'teal-sidebar' | 'navy-header';
  primaryColor: string; // Hex or tailwind class mapping
  fontFamily: string; // Font class
  fontSize: 'sm' | 'md' | 'lg'; // Custom spacing/scaling presets
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  margins: 'compact' | 'normal' | 'loose';
  sectionOrder: string[];
  sectionTitles?: Record<string, string>;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillGroup[];
  customSections: CustomSection[];
  settings: ResumeSettings;
  
  // Premium extra sections
  achievements?: Achievement[];
  passions?: Passion[];
  languages?: Language[];
  courses?: Course[];
  certifications?: Certification[];
  quote?: { text: string; author?: string };
}
