export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/kunaal-ravindran-86b0211b7/',
  github: 'https://github.com/kunaalk3',
  chess: 'https://www.chess.com/member/kunaal_k3',
  fitchef: 'https://fitchefaus.com/',
  mcgees: 'https://www.adl.mcgees.com.au/',
  emailPersonal: 'kunaal20011106@gmail.com',
  emailWork: 'kunaal@digitalconverters.com.au',
}

export const TYPEWRITER_ROLES = [
  'AI Engineer',
  'Systems Builder',
  'CSE · Masters in Enterprise Management',
  'Sous Chef',
  'Chess Player',
]

export const STATS = [
  { number: 5, suffix: '+', label: 'Years Experience' },
  { number: 2.5, suffix: 'M', label: 'Revenue Managed (AUD)', prefix: '$' },
  { number: 5, suffix: '', label: 'Active Roles' },
  { number: 10, suffix: '+', label: 'Projects Shipped' },
]

export const EXPERIENCE = [
  {
    year: '2025 — Present',
    company: 'Fit Chef Australia',
    role: 'End-to-End IT Lead · $2.5M Revenue',
    link: 'https://fitchefaus.com/',
    linkLabel: 'fitchefaus.com',
    description:
      'Full IT ownership for a $2.5M/yr commercial meal prep operation — infrastructure, systems, internal tools, and digital ops from the ground up.',
    tags: ['IT Lead', 'Infrastructure', 'Systems', 'Operations'],
    current: true,
  },
  {
    year: 'May 2025 — Present',
    company: 'Independent AI Consultant',
    role: 'Strategic AI Advisory · Adelaide',
    link: null,
    linkLabel: null,
    description:
      'Architecting custom AI agents with Claude API. Directing AI transformation roadmaps and building intelligent automation systems for businesses.',
    tags: ['Claude API', 'Agentic AI', 'Automation'],
    current: true,
  },
  {
    year: 'Apr 2025 — Present',
    company: 'Digital Converters',
    role: 'Systems Eng · Front End · Adelaide',
    link: null,
    linkLabel: null,
    description:
      'React referral pipelines, Power BI dashboards, Power Automate workflows, and Framer landing pages for enterprise clients.',
    tags: ['React', 'Power BI', 'Framer', 'SharePoint'],
    current: true,
  },
  {
    year: '2025 — Present',
    company: 'Super Cheap Auto',
    role: 'Retail Team Member · Casual',
    link: null,
    linkLabel: null,
    description:
      'Customer-facing retail role driven by a genuine passion for cars. Building sales technique, product knowledge, and a deeper understanding of human psychology and buying behaviour.',
    tags: ['Sales', 'Customer Interaction', 'Automotive', 'Psychology'],
    current: true,
  },
  {
    year: 'Dec 2023 — Jun 2024',
    company: 'Sunoida Solutions',
    role: 'BI Consultant · Chennai',
    link: null,
    linkLabel: null,
    description:
      'Bespoke banking BI delivery. Translated business requirements into technical specs and managed stakeholder alignment across teams.',
    tags: ['BI', 'Banking', 'Analytics'],
    current: false,
  },
  {
    year: 'Jun 2022 — Aug 2022',
    company: 'Kals Breweries & Distilleries',
    role: 'SAP QA Tester · Chennai',
    link: null,
    linkLabel: null,
    description:
      'Secured SAP HANA stability by identifying and resolving 150+ defects. Maintained 100% requirements coverage through rigorous test planning.',
    tags: ['SAP HANA', 'QA Testing', 'Documentation'],
    current: false,
  },
]

export const PROJECTS = [
  {
    name: "McGee's Property — Power BI",
    type: 'Data · Dashboard · BI',
    link: 'https://www.adl.mcgees.com.au/',
    linkLabel: 'adl.mcgees.com.au',
    description:
      'End-to-end Power BI dashboard for a property management firm. Data pipeline, model design, and executive reporting.',
    tags: ['Power BI', 'SQL', 'DAX'],
    image: null,
  },
  {
    name: 'ShopHunt',
    type: 'Full Stack · Systems Architecture',
    link: null,
    linkLabel: null,
    description:
      'Custom price-comparison platform built with React and systems architecture design patterns.',
    tags: ['React', 'Architecture'],
    image: null,
  },
  {
    name: 'Spidey',
    type: 'Python · Automation · Privacy',
    link: null,
    linkLabel: null,
    description:
      'Large-scale web scraper with k-anonymization for privacy-preserving data extraction using Selenium and BeautifulSoup.',
    tags: ['Python', 'Selenium', 'k-anon'],
    image: null,
  },
  {
    name: 'FindUni',
    type: 'Machine Learning · Data Science',
    link: null,
    linkLabel: null,
    description:
      'ML-powered university recommendation engine trained on multi-dimensional student profile data.',
    tags: ['ML', 'Python', 'Data Science'],
    image: null,
  },
]

export const SKILLS = [
  {
    label: 'Domain 01',
    title: 'Artificial Intelligence',
    pills: [
      { name: 'Claude API', primary: true },
      { name: 'Agentic Systems', primary: true },
      { name: 'Intelligent Automation', primary: true },
      { name: 'AI Evaluation', primary: false },
      { name: 'Responsible AI', primary: false },
      { name: 'Azure AI', primary: false },
      { name: 'Machine Learning', primary: false },
      { name: 'AI Governance', primary: false },
    ],
  },
  {
    label: 'Domain 02',
    title: 'Data & Analytics',
    pills: [
      { name: 'Power BI', primary: true },
      { name: 'SQL', primary: true },
      { name: 'DAX', primary: false },
      { name: 'Power Automate', primary: false },
      { name: 'Data Modelling', primary: false },
      { name: 'SAP HANA', primary: false },
      { name: 'Dashboards', primary: false },
      { name: 'ML Pipelines', primary: false },
    ],
  },
  {
    label: 'Domain 03',
    title: 'Development',
    pills: [
      { name: 'Python', primary: true },
      { name: 'React', primary: true },
      { name: 'Next.js', primary: true },
      { name: 'HTML5 / CSS3', primary: false },
      { name: 'C++', primary: false },
      { name: 'REST APIs', primary: false },
      { name: 'Selenium', primary: false },
      { name: 'Git', primary: false },
    ],
  },
  {
    label: 'Domain 04',
    title: 'Enterprise & Systems',
    pills: [
      { name: 'SharePoint', primary: true },
      { name: 'Azure DevOps', primary: true },
      { name: 'ServiceNow', primary: false },
      { name: 'Jira', primary: false },
      { name: 'SAP', primary: false },
      { name: 'Systems Architecture', primary: false },
      { name: 'ITSM', primary: false },
      { name: 'Project Management', primary: false },
    ],
  },
]

export const SPORTS = [
  { name: 'Tennis', level: 3, label: 'Advanced' },
  { name: 'Padel', level: 3, label: 'Advanced' },
  { name: 'Badminton', level: 3, label: 'Advanced' },
  { name: 'Pickleball', level: 3, label: 'Advanced' },
]

export const INDIA_REGIONS = [
  { region: 'North', cities: ['Delhi', 'Manali', 'Dharamshala', 'Kasol'] },
  { region: 'South', cities: ['Chennai', 'Bangalore', 'Hyderabad', 'Ooty', 'Kodaikanal'] },
  { region: 'Kerala', cities: ['Kochi', 'Thrissur', 'Guruvayur', 'Varkala', 'Poovar'] },
  { region: 'West', cities: ['Goa', 'Pune'] },
]

export const INTL_CITIES = [
  'Tokyo', 'Osaka', 'Kyoto', 'Nara', 'Hiroshima',
  'Sydney', 'Melbourne', 'Brisbane', 'Adelaide',
  'Bangkok', 'Pattaya', 'Kuala Lumpur', 'Singapore',
  'Dubai', 'Abu Dhabi', 'Bali', 'Hong Kong',
]

export const TRAVEL_PILLS = [
  { label: '15+ Countries', highlight: true },
  { label: '🇯🇵 Japan × 5 cities', highlight: false },
  { label: '🇦🇺 Australia × 4 cities', highlight: false },
  { label: '🇹🇭 Thailand × 2', highlight: false },
  { label: '🇲🇾 Malaysia × 2', highlight: false },
  { label: '🇸🇬 Singapore × 2', highlight: false },
  { label: '🇦🇪 UAE', highlight: false },
  { label: '🇮🇩 Bali', highlight: false },
  { label: '🇨🇳 HK · China', highlight: false },
  { label: '🇱🇰 Sri Lanka', highlight: false },
]

export const CUISINES = [
  { name: 'Japanese', primary: true },
  { name: 'Turkish', primary: true },
  { name: 'Thai', primary: true },
  { name: 'Italian', primary: true },
  { name: 'Arabic', primary: true },
  { name: 'Chettinad', primary: false },
  { name: 'North Indian', primary: false },
]
