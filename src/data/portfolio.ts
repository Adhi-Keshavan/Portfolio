export type Project = {
  slug: string
  number: string
  title: string
  eyebrow: string
  summary: string
  problem: string
  approach: string
  architecture: string[]
  stack: string[]
  contribution: string
  process: string
  challenges: string
  result: string
  repository: string
  demo?: string
  screenshot?: string
  screenshotAlt?: string
  screenshots?: { src: string; alt: string }[]
  accent: string
  preview: 'aitizen' | 'payready' | 'cricket'
}

export const person = {
  name: 'Adhi Keshavan B',
  shortName: 'Adhi Keshavan',
  role: 'Software developer & CSBS student',
  education: 'B.Tech, Computer Science and Business Systems',
  college: 'Saranathan College of Engineering',
  years: '2023–2027',
  location: 'Trichy, Tamil Nadu',
  email: 'adhikeshavan050505@gmail.com',
  github: 'https://github.com/Adhi-Keshavan',
  linkedin: 'https://www.linkedin.com/in/adhi-keshavan',
  resume: '/resume.pdf' as string | null,
}

export const workspaceObjects = [
  { id: 'monitor', number: '01', title: 'Desktop', hint: 'Enter the studio OS', description: 'Project explorer, terminal, and portfolio apps.' },
  { id: 'keyboard', number: '02', title: 'Terminal', hint: 'Use real commands', description: 'A focused command interface for this portfolio.' },
  { id: 'notebook', number: '03', title: 'About', hint: 'Read the story', description: 'Background, education, and how I think.' },
  { id: 'phone', number: '04', title: 'Contact', hint: 'Start a conversation', description: 'Email, professional profiles, and résumé.' },
] as const

export const skillGroups = [
  { name: 'Programming', items: ['Python', 'Java', 'JavaScript', 'TypeScript'] },
  { name: 'Frontend', items: ['React', 'HTML', 'CSS', 'Three.js'] },
  { name: 'Backend', items: ['FastAPI', 'REST APIs'] },
  { name: 'Databases', items: ['SQL'] },
  { name: 'Data Analytics', items: ['Pandas', 'NumPy', 'Matplotlib', 'Jupyter'] },
  { name: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Blender', 'pytest'] },
  { name: 'Fundamentals', items: ['Data validation', 'API design', 'Testing', 'Data modeling'] },
] as const

export const projects: Project[] = [
  {
    slug: 'aitizen-realm',
    number: '01',
    title: 'Aitizen Realm',
    eyebrow: 'Final-year project · 3D web experience',
    summary: 'An interactive introduction to an autonomous-agent concept, built as a cinematic web experience.',
    problem: 'Explain a complex final-year autonomous-agent concept in a way that people can explore and understand.',
    approach: 'A scroll-led narrative moves from the core idea through a proposed cognitive cycle, agents, real-world environments, and future direction.',
    architecture: ['React component sections organize the story', 'Three.js renders the 3D hero experience', 'Blender and GLB assets form the visual pipeline'],
    stack: ['React', 'Vite', 'Three.js', 'Blender', 'CSS'],
    contribution: 'The project credits Adhi with 3D modeling, Blender assets, and shaders within a four-person team.',
    process: 'The cover page is structured as eight connected chapters, from the hero through project specifications and team credits.',
    challenges: 'Making high-fidelity 3D assets legible within a browser narrative while keeping the project explanation readable.',
    result: 'A published source repository for the project cover page. The repository describes the broader autonomous-agent system as a concept; this case study covers the implemented web experience.',
    repository: 'https://github.com/Adhi-Keshavan/Aitizen-Realm-Cover-Page',
    accent: '#d97736',
    preview: 'aitizen',
  },
  {
    slug: 'payready-india',
    number: '02',
    title: 'PayReady India',
    eyebrow: 'AI-assisted KYC readiness · full stack',
    summary: 'A merchant onboarding and KYC preparation guide with checklists, source-linked answers, optional AI guidance, and a privacy-aware document lab.',
    problem: 'Merchants need a clear way to prepare for PayPal India onboarding without confusing preparation guidance with an official KYC decision.',
    approach: 'Separate readiness guidance from account verification. The prototype uses checklists, verified sources, optional grounded answers, and synthetic or redacted sample inputs.',
    architecture: ['React and Vite frontend', 'FastAPI endpoints for checklists, scores, and assistant answers', 'Verified knowledge base with official source links', 'Optional Gemini and PayPal Sandbox integrations stay server-side'],
    stack: ['React', 'Vite', 'FastAPI', 'Python', 'Gemini API'],
    contribution: 'The connected repository contains the frontend, backend, knowledge base, API tests, and demo documentation. Individual team attribution is not documented.',
    process: 'The foundation was checked with backend unit tests, frontend lint and build, and browser flows for checklist progress and connection recovery.',
    challenges: 'Keeping guidance grounded in official sources, rejecting sensitive values, and making the Sandbox payment demo visibly separate from KYC.',
    result: 'A working local prototype. It does not access PayPal accounts, submit documents, or make verification decisions.',
    repository: 'https://github.com/Adhi-Keshavan/Paypal/tree/main/paypal-kyc-assistant',
    accent: '#ca8a58',
    preview: 'payready',
  },
  {
    slug: 'pressure-performance',
    number: '03',
    title: 'Pressure Performance',
    eyebrow: 'SupeRR Selector Season 2 · data analytics',
    summary: 'A reproducible cricket data pipeline for studying batting and bowling performance under pressure.',
    problem: 'Evaluate performance under pressure from ball-by-ball data without leaking future information or multiplying rows through joins.',
    approach: 'Audit the official pack, validate relationships, derive pre-ball pressure features, then compare batting and bowling against ordinary baselines.',
    architecture: ['Python loaders and schema checks', 'Preprocessing for extras, dismissals, and duplicate playing-XI keys', 'Pre-ball pressure model', 'Separate descriptive batting and bowling analyses', 'Validation reports and tests'],
    stack: ['Python', 'Pandas', 'NumPy', 'SciPy', 'pytest'],
    contribution: 'The repository documents the analysis pipeline, data-quality audit, pressure model, descriptive comparisons, and validation reports.',
    process: 'The work is organized in phases with written evidence for data validation, pressure coverage, batting, and bowling analysis.',
    challenges: 'The supplied extras data cannot recover exact runs for many deliveries. The model explicitly omits unsupported run-rate pressure and marks uncertain calculations.',
    result: 'Phases 1–4 and their validation reports are present. Final player rankings have not been produced, so no ranking claims are made here.',
    repository: 'https://github.com/Adhi-Keshavan/RR_Hackathon',
    accent: '#b79570',
    preview: 'cricket',
  },
]
