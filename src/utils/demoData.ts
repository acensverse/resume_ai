import { ResumeData } from '../types/resume';

export const SOFTWARE_ENGINEER_DEMO: ResumeData = {
  personalInfo: {
    name: 'Alex Rivera',
    title: 'Senior Software Engineer',
    email: 'alex.rivera@devmail.io',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    website: 'https://alexrivera.dev',
    github: 'https://github.com/alexrivera',
    linkedin: 'https://linkedin.com/in/alex-rivera-dev',
    summary: 'Senior Software Engineer with 6+ years of experience specializing in building scalable web applications and distributed systems. Expert in React/Next.js, Node.js, TypeScript, and AWS cloud architecture. Passionate about mentoring developers, optimizing system performance, and implementing robust CI/CD practices.'
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'TechNovation Solutions',
      position: 'Senior Full Stack Engineer',
      location: 'San Francisco, CA',
      startDate: '2023-03',
      endDate: '',
      current: true,
      bullets: [
        'Architected and implemented a next-generation SaaS dashboard using Next.js App Router and TypeScript, boosting client-side performance by 35% and improving SEO metrics by 50%.',
        'Led a cross-functional team of 6 engineers to migrate a monolithic backend into high-throughput AWS Lambda serverless microservices, reducing monthly cloud infrastructure costs by $12,000.',
        'Established a comprehensive CI/CD pipeline using GitHub Actions, Jest, and Cypress, cutting deployment cycle times from 3 hours to under 15 minutes with zero-downtime rollouts.',
        'Mentored 4 junior and mid-level developers, conducting weekly pair programming sessions and code reviews, resulting in a 25% acceleration in sprint velocity.'
      ]
    },
    {
      id: 'exp-2',
      company: 'AppForge Studio',
      position: 'Software Engineer II',
      location: 'Austin, TX (Remote)',
      startDate: '2020-08',
      endDate: '2023-02',
      current: false,
      bullets: [
        'Designed and developed real-time collaboration features using WebSockets and Redis, supporting over 50,000 active concurrent connections during peak traffic hours.',
        'Refactored legacy React state management into modular React Context and React Query hooks, decreasing code duplication by 30% and eliminating client-side memory leak bugs.',
        'Integrated multi-provider payment processing (Stripe & PayPal), increasing international checkout conversions by 18% over a six-month period.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      major: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2016-09',
      endDate: '2020-05',
      current: false,
      description: 'Graduated with Honors. Focus on Systems Architecture and Database Design. Active member of Computer Science Undergraduate Association.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OmniStream DevTool',
      description: 'Open-source state visualization utility for distributed stream processors.',
      technologies: ['React', 'D3.js', 'Go', 'gRPC', 'WebAssembly'],
      bullets: [
        'Created high-performance flow diagrams in D3 capable of visualizing 10k+ event nodes per second in real-time.',
        'Achieved 1.5k GitHub stars in the first three months of release and attracted contributions from 12 community developers.',
        'Published detailed technical analysis on Go-Wasm interop, which was featured in Go Weekly newsletter.'
      ],
      link: 'https://github.com/alexrivera/omnistream'
    },
    {
      id: 'proj-2',
      name: 'TaskGlass App',
      description: 'Glassmorphic productivity dashboard for tracking developer workflows.',
      technologies: ['Next.js', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
      bullets: [
        'Built interactive Kanban boards with drag-and-drop mechanics using React DnD and sleek micro-animations.',
        'Implemented full offline support using indexedDB and background synchronization service workers.'
      ],
      link: 'https://taskglass.io'
    }
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Go', 'HTML5/CSS3', 'SQL', 'Python']
    },
    {
      id: 'skill-2',
      category: 'Frameworks & Libraries',
      items: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Redux Toolkit', 'FastAPI']
    },
    {
      id: 'skill-3',
      category: 'Cloud & DevOps',
      items: ['AWS (S3, Lambda, RDS, ECS)', 'Docker', 'GitHub Actions', 'Vercel', 'PostgreSQL', 'Redis', 'GraphQL']
    }
  ],
  customSections: [],
  settings: {
    templateId: 'modern',
    primaryColor: '#6366f1', // Indigo
    fontFamily: 'font-sans',
    fontSize: 'md',
    lineSpacing: 'normal',
    margins: 'normal',
    sectionOrder: ['experiences', 'education', 'projects', 'skills']
  }
};

export const PRODUCT_MANAGER_DEMO: ResumeData = {
  personalInfo: {
    name: 'Sarah Chen',
    title: 'Lead Product Manager',
    email: 'sarah.chen@productmind.org',
    phone: '+1 (555) 438-9021',
    location: 'New York, NY',
    website: 'https://sarahchen.pm',
    github: '',
    linkedin: 'https://linkedin.com/in/sarah-chen-pm',
    summary: 'Results-driven Lead Product Manager with 7+ years of experience leading cross-functional teams to launch disruptive B2B SaaS platforms. Expert in user research, product strategy, data analytics, and Agile methodologies. Proven record of driving 2x user retention and executing successful zero-to-one product launches.'
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'ScaleUp Analytics',
      position: 'Lead Product Manager - Core Platform',
      location: 'New York, NY',
      startDate: '2022-05',
      endDate: '',
      current: true,
      bullets: [
        'Owned product roadmap and vision for a core business intelligence product generating $45M ARR, driving 32% year-over-year revenue expansion.',
        'Launched a new AI-powered predictive reporting dashboard, increasing weekly active users (WAU) by 45% and reducing churn rate from 4.2% to 2.1%.',
        'Coordinated discovery and delivery processes with 14 engineers, 2 product designers, and marketing teams, consistently shipping major monthly updates on schedule.',
        'Established quantitative tracking using Mixpanel and Amplitude, uncovering customer drop-off points to optimize onboarding funnel, resulting in a 20% uplift in customer lifetime value.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Velo SaaS Systems',
      position: 'Senior Product Manager',
      location: 'Boston, MA',
      startDate: '2019-01',
      endDate: '2022-04',
      current: false,
      bullets: [
        'Led zero-to-one product discovery and development of a mobile CRM app, achieving 100k downloads and a 4.7-star rating on the App Store in its first year.',
        'Conducted over 60 direct customer interviews, translating user pain points into highly prioritized product backlog items.',
        'Pioneered internal shift to Outcome-Based Roadmaps aligned with company OKRs, boosting product shipment velocity by 15%.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'New York University',
      degree: 'Master of Business Administration (MBA)',
      major: 'Strategy & Technology Management',
      location: 'New York, NY',
      startDate: '2016-09',
      endDate: '2018-05',
      current: false,
      description: 'Specialization in Product Strategy. VP of Technology Club.'
    },
    {
      id: 'edu-2',
      school: 'Boston University',
      degree: 'Bachelor of Science',
      major: 'Business Administration',
      location: 'Boston, MA',
      startDate: '2012-09',
      endDate: '2016-05',
      current: false,
      description: 'Summa Cum Laude.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'ProductFuel Newsletter',
      description: 'A weekly curation of SaaS product management strategies and template blueprints.',
      technologies: ['Substack', 'Figma', 'Google Analytics'],
      bullets: [
        'Grew subscriber list from 0 to 12,000+ readers organically through writing detailed case studies.',
        'Consistently achieved a 52% email open rate, far exceeding the industry average of 21%.'
      ],
      link: 'https://productfuel.substack.com'
    }
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Product Strategy',
      items: ['Roadmapping', 'User Discovery', 'Market Analysis', 'A/B Testing', 'OKRs', 'Agile/Scrum', 'Design Thinking']
    },
    {
      id: 'skill-2',
      category: 'Tools & Analytics',
      items: ['Jira/Confluence', 'Mixpanel', 'Amplitude', 'SQL', 'Figma', 'Tableau', 'Optimizely', 'Hotjar']
    }
  ],
  customSections: [],
  settings: {
    templateId: 'classic',
    primaryColor: '#0f766e', // Teal
    fontFamily: 'font-serif',
    fontSize: 'md',
    lineSpacing: 'normal',
    margins: 'normal',
    sectionOrder: ['experiences', 'projects', 'education', 'skills']
  }
};

export const BLANK_RESUME: ResumeData = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    summary: ''
  },
  experiences: [],
  education: [],
  projects: [],
  skills: [],
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

export const CREATIVE_DESIGNER_DEMO: ResumeData = {
  personalInfo: {
    name: 'Mia Vance',
    title: 'Senior UX/UI Designer',
    email: 'mia.vance@designmind.co',
    phone: '+1 (555) 782-9012',
    location: 'Brooklyn, NY',
    website: 'https://miavance.design',
    github: '',
    linkedin: 'https://linkedin.com/in/mia-vance-design',
    summary: 'Aesthetic-driven Senior UX/UI Designer with 6+ years of experience crafting user-centered digital products across mobile and web platforms. Expert in design systems, high-fidelity prototyping, interaction design, and design-to-development workflows. Passionate about creating visually striking, intuitive user interfaces that solve complex workflows.'
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'StudioVibe Interactive',
      position: 'Senior Product Designer',
      location: 'New York, NY',
      startDate: '2023-01',
      endDate: '',
      current: true,
      bullets: [
        'Redesigned the core mobile banking interface for a fintech client, resulting in a 40% increase in daily transaction volume and a 4.8-star App Store rating.',
        'Established a comprehensive token-based design system in Figma used by 18 designers and 50+ developers, cutting mockup production time by 50% and improving code consistency.',
        'Conducted user research sprints and cognitive walkthroughs for an e-commerce platform, boosting checkout conversion rates by 22% through simplified payment flows.'
      ]
    },
    {
      id: 'exp-2',
      company: 'PixelCraft Agency',
      position: 'UX/UI Designer II',
      location: 'Brooklyn, NY',
      startDate: '2020-06',
      endDate: '2022-12',
      current: false,
      bullets: [
        'Collaborated closely with front-end engineers to implement interactive web experiences using HTML/CSS and Framer Motion, ensuring 100% design fidelity.',
        'Created responsive wireframes, user personas, and interactive prototypes for 12 client product launches across healthcare and education sectors.',
        'Designed high-fidelity mockups for a SaaS dashboard, which helped secure a $15M Series A funding round.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'Rhode Island School of Design (RISD)',
      degree: 'Bachelor of Fine Arts (BFA)',
      major: 'Graphic Design',
      location: 'Providence, RI',
      startDate: '2016-09',
      endDate: '2020-05',
      current: false,
      description: 'Focus on Web Interaction and Type Design. Graduated with honors. Recipient of the Design Excellence Award.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Aura Mobile Wallet',
      description: 'A concept mobile wallet focused on minimal aesthetic and crypto transactions.',
      technologies: ['Figma', 'Prototyping', 'User Research'],
      bullets: [
        'Conducted 20+ usability tests to refine the onboarding flow, reducing customer drop-off by 30%.',
        'Published case study on Medium, which was featured in the UX Collective publication.'
      ],
      link: 'https://behance.net/miavance/aura'
    },
    {
      id: 'proj-2',
      name: 'ZenFlow SaaS Portal',
      description: 'Productivity web app for team sprint velocity tracking.',
      technologies: ['Figma', 'Design System', 'React'],
      bullets: [
        'Created 80+ component variants in Figma with auto-layout and variant properties.'
      ],
      link: 'https://zenflow.io'
    }
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Design Specialties',
      items: ['UI/UX Design', 'Interaction Design', 'Prototyping', 'Wireframing', 'User Research', 'Design Systems', 'Typography']
    },
    {
      id: 'skill-2',
      category: 'Software Tools',
      items: ['Figma', 'Sketch', 'Adobe Creative Suite', 'Framer', 'Principle', 'Miro']
    }
  ],
  customSections: [],
  settings: {
    templateId: 'creative',
    primaryColor: '#8b5cf6',
    fontFamily: 'font-outfit',
    fontSize: 'md',
    lineSpacing: 'normal',
    margins: 'normal',
    sectionOrder: ['experiences', 'education', 'projects', 'skills']
  }
};

export const ELLEN_JOHNSON_DEMO: ResumeData = {
  personalInfo: {
    name: 'Ellen Johnson',
    title: 'Digital Marketing Manager | Growth Hacking | Data Analysis',
    email: 'help@enhancv.com',
    phone: '',
    location: 'San Francisco, California',
    website: 'help@enhancv.com',
    github: '',
    linkedin: 'https://linkedin.com',
    summary: 'Motivated Digital Marketing Manager with over 3 years of experience in driving user acquisition and growth through strategic paid campaigns. Expert in data analysis, creative optimization, and cross-functional collaboration to achieve business objectives. Proven track record of scaling campaigns and enhancing ROI.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&fit=crop'
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Tech Innovate',
      position: 'Senior Digital Marketing Specialist',
      location: 'San Francisco, CA',
      startDate: '2022-01',
      endDate: '',
      current: true,
      bullets: [
        'Led the development and execution of comprehensive digital marketing campaigns across Meta, Google, and TikTok, increasing user acquisition by 45% within 12 months.',
        'Managed a $500K quarterly budget for paid acquisition channels, optimizing spend for a 25% increase in engagement.',
        'Implemented advanced targeting and retargeting strategies that reduced CPA by 20%, while increasing conversion rates by 15%.',
        'Conducted A/B testing on over 100 ad creatives, identifying top performers that led to a 25% increase in engagement.',
        'Collaborated with cross-functional teams to align marketing efforts with product launches, resulting in a 40% increase in product adoption.',
        'Analyzed campaign data to provide actionable insights, leading to a strategic pivot that captured a new user segment and contributed to a 35% increase in market share.'
      ]
    },
    {
      id: 'exp-2',
      company: 'MarketGuru',
      position: 'Digital Marketing Manager',
      location: 'San Francisco, CA',
      startDate: '2019-06',
      endDate: '2021-12',
      current: false,
      bullets: [
        'Managed and scaled paid search and social campaigns across Snapchat and Apple Search Ads, achieving a 50% increase in leads.',
        'Designed and executed a landing page optimization strategy that lifted conversion rates by 18%.',
        'Utilized Looker and Google Analytics to monitor campaign performance, driving a 10% decrease in bounce rates.',
        'Orchestrated the creative testing process, enhancing ad performance and contributing to a 22% increase in CTR.',
        'Collaborated with engineering to integrate new tracking systems, improving data accuracy and campaign efficiency.'
      ]
    },
    {
      id: 'exp-3',
      company: 'AdVantage Media',
      position: 'Performance Marketing Analyst',
      location: 'San Francisco, CA',
      startDate: '2017-03',
      endDate: '2019-05',
      current: false,
      bullets: [
        'Analyzed performance data across multiple digital channels, identifying trends that informed strategic decisions.',
        'Supported the execution of campaigns that resulted in a 15% increase in user engagement.',
        'Developed and maintained reporting dashboards for real-time performance tracking, enhancing team responsiveness.',
        'Assisted in managing a portfolio of digital ads, optimizing for a 10% improvement in ad efficiency.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of California, Berkeley',
      degree: 'Master of Science',
      major: 'Marketing Analytics',
      location: 'Berkeley, CA',
      startDate: '2015-01',
      endDate: '2017-01',
      current: false,
      description: 'Focus on statistical data models, cohort metrics, and consumer behaviour analytics.'
    },
    {
      id: 'edu-2',
      school: 'San Francisco State University',
      degree: 'Bachelor of Science',
      major: 'Business Administration',
      location: 'San Francisco, CA',
      startDate: '2011-01',
      endDate: '2015-01',
      current: false,
      description: 'Graduated Cum Laude.'
    }
  ],
  projects: [],
  skills: [
    {
      id: 'skill-1',
      category: 'Data & Channels',
      items: ['Data Analysis', 'Paid Acquisition', 'Retargeting', 'ROAS Optimization', 'Cross-Functional Collaboration']
    },
    {
      id: 'skill-2',
      category: 'Platforms & Tools',
      items: ['Google Analytics', 'Looker', 'Appsflyer', 'Meta Advertising', 'Google Ads', 'TikTok Ads', 'Snapchat Ads', 'SQL']
    }
  ],
  customSections: [],
  achievements: [
    {
      id: 'ach-1',
      title: '45% User Acquisition Increase',
      description: 'Spearheaded digital marketing initiatives at Tech Innovate that led to a 45% increase in user acquisition.',
      icon: 'target'
    },
    {
      id: 'ach-2',
      title: '30% ROAS Improvement',
      description: 'Optimized ad spend across digital platforms at Tech Innovate, resulting in a 30% improvement in ROAS.',
      icon: 'chart'
    },
    {
      id: 'ach-3',
      title: 'Market Share Expansion',
      description: 'Identified and captured a new user segment, contributing to a 35% increase in market share.',
      icon: 'bolt'
    },
    {
      id: 'ach-4',
      title: 'Conversion Rate Optimization',
      description: 'Implemented a successful landing page optimization strategy, lifting conversion rates by 18%.',
      icon: 'heart'
    }
  ],
  passions: [],
  languages: [
    {
      id: 'lang-1',
      name: 'English',
      level: 'Native',
      rating: 5
    },
    {
      id: 'lang-2',
      name: 'Spanish',
      level: 'Advanced',
      rating: 3
    }
  ],
  courses: [],
  certifications: [
    {
      id: 'cert-1',
      name: 'Advanced Google Analytics',
      provider: 'Google Analytics Academy'
    },
    {
      id: 'cert-2',
      name: 'Effective Creative Testing',
      provider: 'Coursera Hub'
    }
  ],
  settings: {
    templateId: 'double-column',
    primaryColor: '#0ea5e9',
    fontFamily: 'font-outfit',
    fontSize: 'sm',
    lineSpacing: 'compact',
    margins: 'normal',
    sectionOrder: ['experiences', 'education', 'skills']
  }
};

export const AIDEN_WILLIAMS_DEMO: ResumeData = {
  personalInfo: {
    name: 'Aiden Williams',
    title: 'Senior Project Manager | Treasury & Expense Management',
    email: 'help@enhancv.com',
    phone: '+1-(234)-555-1234',
    location: 'Columbus, Ohio',
    website: '',
    github: '',
    linkedin: 'https://linkedin.com/in/aiden',
    summary: 'Accomplished Senior Project Manager with over 6 years of experience in leading high-priority treasury and expense management initiatives. Proficient in PeopleSoft Cash Management, project budgeting, and implementing technology solutions. Noteworthy achievement in driving a key project that reduced operational expenses by 15%.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop'
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'JPMorgan Chase',
      position: 'Senior Project Manager - Treasury Systems',
      location: 'Columbus, OH',
      startDate: '2018-01',
      endDate: '',
      current: true,
      bullets: [
        'Oversaw the strategic implementation of an enterprise-wide Expense Management system, affecting 10,000+ employees.',
        'Managed cross-functional teams to deliver four critical treasury projects within a 12-month period ahead of schedule.',
        'Drove process optimization using Lean Six Sigma methodologies yielding a 25% increase in efficiency.',
        'Collaborated with IT and Treasury departments to integrate banking systems, achieving seamless transaction processing.',
        'Developed comprehensive risk management protocols that decreased project risks by 40%.',
        'Conceptualized and executed a financial analytics dashboard that provided real-time insights, reducing decision-making time by 30%.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Nationwide Insurance',
      position: 'Treasury Systems Analyst',
      location: 'Columbus, OH',
      startDate: '2014-06',
      endDate: '2017-12',
      current: false,
      bullets: [
        'Led a successful upgrade of the PeopleSoft Cash Management module which improved transaction handling capacity by 20%.',
        'Conducted in-depth business process analyses that culminated in a standardized procedure adopted by 5 departments.',
        'Managed vendor relationships for the procurement of Treasury IT solutions, optimizing costs by 10%.',
        'Authored project proposals for senior management, securing approvals for three high-impact projects.',
        'Facilitated user acceptance testing and trainings, achieving a 95% user satisfaction rate.'
      ]
    },
    {
      id: 'exp-3',
      company: 'KeyBank',
      position: 'Project Coordinator - Banking Systems',
      location: 'Cleveland, OH',
      startDate: '2010-03',
      endDate: '2014-05',
      current: false,
      bullets: [
        'Coordinated the launch of a new payment processing platform resulting in a 15% increase in transaction volume.',
        'Spearheaded the analysis of banking systems that enhanced fraud detection measures by 10%.',
        'Delivered monthly reports on project status, driving alignment across stakeholders.',
        'Championed necessary system changes, ensuring compliance with updated financial regulations.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'Ohio State University',
      degree: 'Master of Science',
      major: 'Finance',
      location: 'Columbus, OH',
      startDate: '2007-01',
      endDate: '2009-01',
      current: false,
      description: 'Focus on Quantitative Corporate Finance and Treasury Risk models.'
    },
    {
      id: 'edu-2',
      school: 'Miami University',
      degree: 'Bachelor of Science',
      major: 'Business Administration',
      location: 'Oxford, OH',
      startDate: '2003-01',
      endDate: '2007-01',
      current: false,
      description: 'Graduated Summa Cum Laude.'
    }
  ],
  projects: [],
  skills: [
    {
      id: 'skill-1',
      category: 'Key Skills',
      items: ['Project Management', 'Business Process Improvement', 'PeopleSoft Cash Management', 'Expense Management', 'Data Analytics', 'Risk Management']
    }
  ],
  customSections: [],
  achievements: [
    {
      id: 'ach-1',
      title: 'Enterprise-Wide System Implementation',
      description: 'Led the rollout of a new expense management system, significantly improving operational efficiency.',
      icon: 'star'
    },
    {
      id: 'ach-2',
      title: 'Process Efficiency Optimization',
      description: 'Applied Lean Six Sigma principles to revamp treasury processes, resulting in a 25% boost in department efficiency.',
      icon: 'cog'
    },
    {
      id: 'ach-3',
      title: 'Risk Management Framework Development',
      description: 'Devised comprehensive risk management strategies, cutting down project risks by 40% and enhancing system security.',
      icon: 'target'
    },
    {
      id: 'ach-4',
      title: 'Financial Analytics Dashboard Creation',
      description: 'Created a financial analytics tool that provided executives with real-time data, accelerating strategic decision-making.',
      icon: 'chart'
    }
  ],
  passions: [
    {
      id: 'pass-1',
      title: 'Financial Market Analysis',
      description: 'Avidly analyzes financial markets, seeking correlations that inform treasury and risk management strategies.',
      icon: 'globe'
    }
  ],
  languages: [
    {
      id: 'lang-1',
      name: 'English',
      level: 'Native',
      rating: 5
    },
    {
      id: 'lang-2',
      name: 'Spanish',
      level: 'Advanced',
      rating: 4
    }
  ],
  courses: [
    {
      id: 'course-1',
      name: 'Certification in Project Management',
      provider: 'Project Management Institute (PMP)'
    },
    {
      id: 'course-2',
      name: 'Certified Lean Six Sigma Green Belt',
      provider: 'American Society for Quality (ASQ)'
    }
  ],
  certifications: [],
  settings: {
    templateId: 'dark-sidebar',
    primaryColor: '#3b82f6',
    fontFamily: 'font-sans',
    fontSize: 'sm',
    lineSpacing: 'compact',
    margins: 'normal',
    sectionOrder: ['experiences', 'education', 'skills']
  }
};

export const JASON_REED_DEMO: ResumeData = {
  personalInfo: {
    name: 'Jason Reed',
    title: 'Vice President, Manufacturing | Strategic Leadership | Process Optimization',
    email: 'help@enhancv.com',
    phone: '',
    location: 'Seattle, WA',
    website: '',
    github: '',
    linkedin: 'https://linkedin.com/in/jason',
    summary: 'With over 15 years of leadership experience in manufacturing, I excel in strategic planning, process optimization, and team leadership. My career is marked by successful project completions that significantly improved operational efficiencies and profitability.',
    photoUrl: ''
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'AGC Biologics',
      position: 'Vice President, Manufacturing',
      location: 'Seattle, WA',
      startDate: '2019-01',
      endDate: '',
      current: true,
      bullets: [
        'Led the strategic planning and execution of manufacturing processes, resulting in a 20% increase in production efficiency and a 15% reduction in costs.',
        'Implemented a Lean Manufacturing initiative across all departments, reducing waste by 25% and improving product quality.',
        'Negotiated and secured multi-million dollar contracts with key clients, increasing company revenue by 30%.',
        'Directed the development and launch of two new product lines, contributing to a 40% growth in market share.',
        'Spearheaded a sustainability project that reduced the company\'s carbon footprint.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Pfizer',
      position: 'Director of Operations',
      location: 'New York, NY',
      startDate: '2014-06',
      endDate: '2018-12',
      current: false,
      bullets: [
        'Managed operations for a major pharmaceutical manufacturing facility, overseeing a team of 200+ employees.',
        'Achieved a 95% on-time delivery rate through the optimization of supply chain and production scheduling.',
        'Led a cross-functional team to improve product quality, resulting in a 50% reduction in customer complaints.',
        'Developed and implemented a risk management plan that minimized production delays and saved the company over $2M annually.',
        'Introduced new technology that increased production capacity by 20%.'
      ]
    },
    {
      id: 'exp-3',
      company: 'Merck',
      position: 'Senior Process Engineer',
      location: 'Kenilworth, NJ',
      startDate: '2010-03',
      endDate: '2014-05',
      current: false,
      bullets: [
        'Designed and optimized manufacturing processes for vaccine production, increasing yield by 15%.',
        'Collaborated with R&D to scale up new products from pilot to full-scale manufacturing.',
        'Implemented a continuous improvement program that reduced process downtime.',
        'Conducted detailed data analysis to identify bottlenecks and implement corrective actions.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'Massachusetts Institute of Technology',
      degree: 'Master of Science',
      major: 'Chemical Engineering',
      location: 'Cambridge, MA',
      startDate: '2005-01',
      endDate: '2007-01',
      current: false,
      description: 'Specialization in biochemical process control models.'
    },
    {
      id: 'edu-2',
      school: 'University of Washington',
      degree: 'Bachelor of Science',
      major: 'Chemical Engineering',
      location: 'Seattle, WA',
      startDate: '2001-01',
      endDate: '2005-01',
      current: false,
      description: 'Graduated with Honours.'
    }
  ],
  projects: [],
  skills: [
    {
      id: 'skill-1',
      category: 'Key Capabilities',
      items: ['Strategic Planning', 'Lean Manufacturing', 'Process Optimization', 'Team Leadership', 'Contract Negotiation', 'Product Development', 'Sustainability Initiatives', 'Supply Chain Management', 'Risk Management', 'Technology Integration']
    }
  ],
  customSections: [],
  achievements: [
    {
      id: 'ach-1',
      title: '20% Production Efficiency Increase',
      description: 'Led strategic planning and execution that improved production efficiency by 20%, significantly reducing operational costs.',
      icon: 'bolt'
    },
    {
      id: 'ach-2',
      title: '30% Revenue Growth from New Contracts',
      description: 'Negotiated and secured key client contracts, driving a 30% increase in company revenue.',
      icon: 'star'
    },
    {
      id: 'ach-3',
      title: '40% Market Share Growth',
      description: 'Directed the launch of two new product lines, contributing to a 40% growth in market share.',
      icon: 'chart'
    }
  ],
  passions: [
    {
      id: 'pass-1',
      title: 'Sustainable Manufacturing',
      description: 'Passionate about developing and implementing sustainable manufacturing practices to reduce environmental impact.',
      icon: 'leaf'
    },
    {
      id: 'pass-2',
      title: 'Spending Time in Nature',
      description: 'In the weekend, you will find me in Mount Rainier National Park, recharging for next week.',
      icon: 'bike'
    }
  ],
  languages: [
    {
      id: 'lang-1',
      name: 'English',
      level: 'Native',
      rating: 5
    },
    {
      id: 'lang-2',
      name: 'Spanish',
      level: 'Advanced',
      rating: 4
    }
  ],
  courses: [],
  certifications: [
    {
      id: 'cert-1',
      name: 'Lean Manufacturing Certification',
      provider: 'Lean Enterprise Institute'
    },
    {
      id: 'cert-2',
      name: 'Advanced Project Management',
      provider: 'Project Management Institute'
    }
  ],
  quote: {
    text: 'Quality means doing it right when no one is looking.',
    author: 'Henry Ford'
  },
  settings: {
    templateId: 'teal-sidebar',
    primaryColor: '#0f766e',
    fontFamily: 'font-sans',
    fontSize: 'sm',
    lineSpacing: 'compact',
    margins: 'normal',
    sectionOrder: ['experiences', 'skills', 'education']
  }
};

export const BRANDON_HALE_DEMO: ResumeData = {
  personalInfo: {
    name: 'Brandon Hale',
    title: 'Senior Business Development Director | Biotech & Pharma Expertise',
    email: 'help@enhancv.com',
    phone: '+1-(234)-555-1234',
    location: 'Jacksonville, Florida',
    website: '',
    github: '',
    linkedin: 'https://linkedin.com/in/brandon',
    summary: 'With over a decade of experience in the biopharmaceutical industry, I have successfully spearheaded business development initiatives, consistently exceeding sales targets. My acumen in maintaining relationships, analyzing market trends, and leading high-impact projects has been a cornerstone of my career, highlighted by a pivotal role in generating $30M in new business for a leading CRO. Eager to bring my expertise to a senior business development position.',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop'
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Genentech',
      position: 'Business Development Manager',
      location: 'San Francisco, CA',
      startDate: '2018-05',
      endDate: '2021-12',
      current: false,
      bullets: [
        'Generated $30M in new sales revenue by identifying and securing strategic partnerships within the biotechnology sector.',
        'Increased client portfolio by 40% through targeted outreach and networking efforts, introducing 25+ new pharmaceutical products to the company\'s catalog.',
        'Led cross-functional teams to develop highly effective marketing strategies resulting in a 15% increase in year-over-year revenue.',
        'Designed and executed innovative customer retention programs that boosted long-term contracts by 30% and improved overall client satisfaction rates.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Regeneron Pharmaceuticals',
      position: 'Regional Sales Director',
      location: 'Tarrytown, NY',
      startDate: '2015-01',
      endDate: '2018-04',
      current: false,
      bullets: [
        'Surpassed sales goals by 20% for two consecutive years, growing the regional sales revenue to $50M.',
        'Developed and maintained a high-performance sales team, achieving a 15% increase in productivity through targeted training and development.',
        'Successfully launched three blockbuster drugs in the regional market, capturing a 10% market share within the first six months of launch.',
        'Implemented a CRM system that enhanced customer tracking and sales force efficiency by 25%.',
        'Negotiated key contracts with hospital networks, contributing to a 20% expansion of the company\'s market penetration.'
      ]
    },
    {
      id: 'exp-3',
      company: 'Pfizer Inc',
      position: 'Key Account Manager',
      location: 'New York, NY',
      startDate: '2010-06',
      endDate: '2014-12',
      current: false,
      bullets: [
        'Managed the growth of strategic accounts, resulting in a 35% increase in annual revenue from top-tier clients.',
        'Orchestrated the successful entry of Pfizer\'s portfolio into new therapeutic areas, growing the account base by 20%.',
        'Cemented Pfizer\'s market presence by brokering pivotal alliances with industry leaders, amplifying pipeline development opportunities.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of Florida',
      degree: 'Master of Science',
      major: 'Business Administration (MBA)',
      location: 'Gainesville, FL',
      startDate: '2007-01',
      endDate: '2009-01',
      current: false,
      description: 'Focus on strategic pharma management models.'
    },
    {
      id: 'edu-2',
      school: 'Florida State University',
      degree: 'Bachelor of Science',
      major: 'Biotechnology',
      location: 'Tallahassee, FL',
      startDate: '2003-01',
      endDate: '2007-01',
      current: false,
      description: 'Graduated with Honours.'
    }
  ],
  projects: [],
  skills: [
    {
      id: 'skill-1',
      category: 'Primary Competencies',
      items: ['Business Development', 'Strategic Sales Planning', 'Client Retention Strategies', 'CRM Systems', 'Market Analysis']
    }
  ],
  customSections: [],
  achievements: [
    {
      id: 'ach-1',
      title: 'Top Regional Sales Performer',
      description: 'Recognized as the top-performing sales director at Regeneron Pharmaceuticals.',
      icon: 'trophy'
    },
    {
      id: 'ach-2',
      title: 'Successful Product Launch',
      description: 'Coordinated the launch campaign for a blockbuster drug at Regeneron, resulting in a $15M revenue surge.',
      icon: 'target'
    },
    {
      id: 'ach-3',
      title: 'Strategic Accounts Revenue Growth',
      description: 'Spearheaded a strategic account initiative at Pfizer, leading to a 35% increase in annual sales from key clients.',
      icon: 'star'
    },
    {
      id: 'ach-4',
      title: 'Sales Team Development Award',
      description: 'Revamped the sales training program at Genentech, boosting team performance by 15%.',
      icon: 'cog'
    }
  ],
  passions: [
    {
      id: 'pass-1',
      title: 'Leadership and Mentoring',
      description: 'Enthusiastic about developing sales talent and fostering leadership skills within teams.',
      icon: 'smile'
    },
    {
      id: 'pass-2',
      title: 'Community Outreach',
      description: 'Actively involved in community outreach programs, advocating for science education & opportunities for underrepresented groups.',
      icon: 'globe'
    }
  ],
  languages: [],
  courses: [
    {
      id: 'course-1',
      name: 'Advanced Biopharmaceutical Business Development',
      provider: 'Harvard Business School (Executive Education)'
    },
    {
      id: 'course-2',
      name: 'Regulatory Affairs for Biologics',
      provider: 'Coursera Hub'
    }
  ],
  certifications: [],
  settings: {
    templateId: 'navy-header',
    primaryColor: '#1e3a8a',
    fontFamily: 'font-sans',
    fontSize: 'sm',
    lineSpacing: 'compact',
    margins: 'normal',
    sectionOrder: ['experiences', 'education', 'skills']
  }
};

export const DEMO_PRESETS: Record<string, { label: string; data: ResumeData }> = {
  software: {
    label: 'Software Engineer',
    data: SOFTWARE_ENGINEER_DEMO
  },
  pm: {
    label: 'Product Manager',
    data: PRODUCT_MANAGER_DEMO
  },
  designer: {
    label: 'Creative Designer',
    data: CREATIVE_DESIGNER_DEMO
  },
  marketing: {
    label: 'Digital Marketing (Ellen)',
    data: ELLEN_JOHNSON_DEMO
  },
  project_manager: {
    label: 'Project Manager (Aiden)',
    data: AIDEN_WILLIAMS_DEMO
  },
  vp_manufacturing: {
    label: 'Manufacturing VP (Jason)',
    data: JASON_REED_DEMO
  },
  biz_dev: {
    label: 'Business Director (Brandon)',
    data: BRANDON_HALE_DEMO
  }
};
