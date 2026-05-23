import { ResumeData, Experience, Education, Project } from '../types/resume';

// Heuristic pagination constants
// An A4 page has roughly 100 "units" of vertical space.
const MAX_UNITS_PAGE_1 = 85; // Leave room for main header
const MAX_UNITS_PAGE_N = 95; // Leave room for mini header

function estimateTextUnits(text: string | undefined | null, charsPerLine = 75): number {
  if (!text) return 0;
  // Basic estimation: count characters, divide by line length
  // Add some padding for line height
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
  return lines * 1.5; // 1.5 units per line
}

function estimateExperienceUnits(exp: Experience): number {
  let units = 4; // Title, company, dates, location (approx 4 lines/units)
  units += estimateTextUnits(exp.bullets?.join(" "), 80);
  return units;
}

function estimateEducationUnits(edu: Education): number {
  let units = 3; // Degree, school, dates
  units += estimateTextUnits(edu.description, 80);
  return units;
}

function estimateProjectUnits(proj: Project): number {
  let units = 3; // Title, tech, dates
  units += estimateTextUnits(proj.bullets?.join(" ") + " " + proj.description, 80);
  return units;
}

function createEmptyPageData(baseData: ResumeData, pageIndex: number): ResumeData {
  return {
    ...baseData,
    personalInfo: pageIndex === 1 ? baseData.personalInfo : { 
      // Keep name for mini-headers, but remove summary and photo on subsequent pages
      name: baseData.personalInfo.name, 
      title: '', email: '', phone: '', location: '', website: '', github: '', linkedin: '', summary: '' 
    },
    skills: pageIndex === 1 ? baseData.skills : [],
    experiences: [],
    education: [],
    projects: [],
    // For extra details, we'll assign them fully to pages later
    achievements: [],
    passions: [],
    languages: [],
    courses: [],
    certifications: [],
  };
}

/**
 * Heuristically splits the resume data into multiple pages.
 * Ensures the margin and headers are preserved by creating discrete ResumeData chunks.
 */
export function paginateResumeData(data: ResumeData): ResumeData[] {
  const pages: ResumeData[] = [];
  
  let currentPageIndex = 1;
  let currentPage = createEmptyPageData(data, currentPageIndex);
  let currentUnits = 0;

  // Add summary to page 1
  if (data.personalInfo?.summary) {
    currentUnits += 3 + estimateTextUnits(data.personalInfo?.summary, 90);
  }

  // Helper to add an item and roll over to next page if needed
  const tryAddItem = (cost: number, addItemFn: (page: ResumeData) => void) => {
    const limit = currentPageIndex === 1 ? MAX_UNITS_PAGE_1 : MAX_UNITS_PAGE_N;
    
    // If this item exceeds the limit and we already have content on this page, push to next page
    if (currentUnits + cost > limit && currentUnits > 15) {
      pages.push(currentPage);
      currentPageIndex++;
      currentPage = createEmptyPageData(data, currentPageIndex);
      currentUnits = 0;
    }
    
    addItemFn(currentPage);
    currentUnits += cost;
  };

  // 1. Process Experiences
  if (data.experiences && data.experiences.length > 0) {
    currentUnits += 4; // Section header
    data.experiences.forEach(exp => {
      tryAddItem(estimateExperienceUnits(exp) + 2, (p) => p.experiences.push(exp));
    });
  }

  // 2. Process Education
  if (data.education && data.education.length > 0) {
    currentUnits += 4; // Section header
    data.education.forEach(edu => {
      tryAddItem(estimateEducationUnits(edu) + 2, (p) => p.education.push(edu));
    });
  }

  // 3. Process Projects
  if (data.projects && data.projects.length > 0) {
    currentUnits += 4; // Section header
    data.projects.forEach(proj => {
      tryAddItem(estimateProjectUnits(proj) + 2, (p) => p.projects.push(proj));
    });
  }

  const isSidebarTemplate = ['double-column', 'dark-sidebar', 'teal-sidebar', 'navy-header'].includes(data.settings?.templateId || '');

  // 3.5 Process Skills if in main column
  if (!isSidebarTemplate && data.skills && data.skills.length > 0) {
    // Clear the auto-assigned skills from page 1 / currentPage
    if (pages.length > 0) {
      pages[0].skills = [];
    }
    currentPage.skills = [];
    
    currentUnits += 4; // Section header
    data.skills.forEach(skillGrp => {
      const itemsLength = skillGrp.items?.length || 0;
      // roughly 1 line per 5 skills + 1 for category
      const skillUnits = 1 + Math.ceil(itemsLength / 5);
      tryAddItem(skillUnits + 1, (p) => p.skills.push(skillGrp));
    });
  }

  // 4. Extras (achievements, passions, languages, courses, certifications) and skills
  // always stay on page 1 - they are part of the template sidebar/layout,
  // NOT overflow content. Only experiences/education/projects cause page splits.
  if (pages.length === 0) {
    // Still on page 1 - assign extras and skills directly
    currentPage.achievements = data.achievements;
    currentPage.passions = data.passions;
    currentPage.languages = data.languages;
    currentPage.courses = data.courses;
    currentPage.certifications = data.certifications;
    if (isSidebarTemplate) {
      currentPage.skills = data.skills;
    }
  } else {
    // Page 1 was already pushed - assign extras and skills to it
    pages[0].achievements = data.achievements;
    pages[0].passions = data.passions;
    pages[0].languages = data.languages;
    pages[0].courses = data.courses;
    pages[0].certifications = data.certifications;
    if (isSidebarTemplate) {
      pages[0].skills = data.skills;
    }
  }

  pages.push(currentPage);
  
  // Filter out empty subsequent pages - only keep page 2+ if they have
  // actual overflow entries (experiences, education, projects, or skills)
  return pages.filter((page, index) => {
    if (index === 0) return true; // Always keep page 1
    const hasOverflowContent = 
      (page.experiences?.length || 0) > 0 ||
      (page.education?.length || 0) > 0 ||
      (page.projects?.length || 0) > 0 ||
      (page.skills?.length || 0) > 0;
    return hasOverflowContent;
  });
}
