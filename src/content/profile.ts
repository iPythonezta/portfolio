// Single source of truth for personal details. Used by the site AND the resume page.
// NOTE: the phone number is intentionally NOT here; it is injected only into the PDF export.

export const profile = {
  name: "Huzaifa Azhar",
  handle: "iPythonezta",
  title: "Software Engineer",
  headline: "Python, AI & Automation",
  location: "Faisalabad, Pakistan",
  email: "hazhar.contact@gmail.com",
  links: {
    github: "https://github.com/iPythonezta",
    linkedin: "https://www.linkedin.com/in/huzaifa-azhar/",
    fiverr: "https://www.fiverr.com/huzaifa_blogger",
  },
  tagline:
    "I build backends, AI agents and automation that ship: from a search engine written from scratch to LLM pipelines that fill 1,000-field insurance forms.",
  summary:
    "Software engineering student at NUST and freelance developer since 2022. I design and ship Python backends (Django, Flask, FastAPI), React frontends and LLM-powered automation, and I care about clean, testable code, measurable results and production-ready delivery.",
  resumeSummary:
    "Software Engineer specialising in Python, AI and automation. Freelance developer since 2022 with 90+ completed orders and a 4.9 average rating. Builds REST backends (Django, Flask, FastAPI), React frontends and LLM-powered workflows, with a foundation in algorithms, data structures and testing. BE Software Engineering student at NUST.",
  stats: [
    { label: "Freelance orders delivered", value: 90, suffix: "+" },
    { label: "Average client rating", value: 4.9, suffix: "/5", decimals: 1 },
    { label: "Building software since", value: 2022, suffix: "", plain: true },
    { label: "Featured projects", value: 8, suffix: "" },
  ],
};

export const experience = [
  {
    when: "08/2022 – present",
    role: "Freelance Programmer & Web Developer",
    org: "Fiverr · Level 2 seller",
    kind: "freelance" as const,
    metrics: [
      { label: "orders delivered", value: "90+" },
      { label: "average rating", value: "4.9 / 5" },
      { label: "seller level", value: "Level 2" },
    ],
    focus: [
      "Backend & APIs: Django, Django REST Framework, Flask, FastAPI",
      "Frontend: React / TypeScript dashboards and landing pages",
      "Automation: browser automation, scheduling workers, scrapers",
      "AI workflows: GPT-based classification, extraction and form filling",
      "Delivery: packaged desktop apps (PyInstaller) for non-technical users",
    ],
    points: [
      "Delivered 90+ orders for international clients with a 4.9 average star rating.",
      "Built web apps, REST APIs, scrapers, browser automation and AI-assisted workflows in Python, Django, Flask and React.",
      "Packaged tools as installable desktop apps (PyInstaller) for non-technical users.",
    ],
    seeProjects: ["fb-lead-radar", "acord-form-filler", "x-automation-suite", "inventory-management-tool"],
  },
  {
    when: "2026",
    role: "Team Member, Microsoft Imagine Cup 2026",
    org: "ZeroDevAI · team of four",
    kind: "competition" as const,
    metrics: [],
    focus: [],
    points: [
      "Built the tool-calling code-generation agent for a voice-to-app platform (requirements, coding and deploy agents on Azure OpenAI).",
    ],
    seeProjects: ["zerodevai"],
  },
  {
    when: "08/2022 – present",
    role: "Web Development Instructor (volunteer)",
    org: "App Dev League Inc",
    kind: "volunteer" as const,
    metrics: [],
    focus: [],
    points: ["Teaches web development fundamentals to young learners as a volunteer instructor."],
    seeProjects: [] as string[],
  },
];

export const education = [
  {
    when: "09/2024 – 09/2028",
    degree: "Bachelor of Engineering, Software Engineering",
    org: "National University of Sciences & Technology (NUST)",
    status: "In progress · expected 2028",
    coursework: [
      { name: "Data Structures & Algorithms (CS-250)", applied: "BigSearch: lexicon, forward and inverted indexes, PageRank", project: "bigsearch" },
      { name: "Software Design & Architecture", applied: "Inventory Tool refactor: SOLID principles, Strategy, Observer and Factory patterns", project: "inventory-management-tool" },
      { name: "Web Engineering", applied: "Lab work published on GitHub", project: "" },
      { name: "Software Testing", applied: "Java unit-testing lab published on GitHub", project: "" },
    ],
  },
];

export const certifications = [
  {
    name: "IT Automation with Python",
    issuer: "Google",
    kind: "Professional Certificate",
    covers: "Python scripting, interacting with the OS, Git and GitHub, debugging and troubleshooting, configuration management and cloud, automating real-world tasks.",
    appliedIn: ["fb-lead-radar", "x-automation-suite"],
  },
  {
    name: "Meta Back-End Developer",
    issuer: "Meta",
    kind: "Professional Certificate",
    covers: "Python and Django, REST API design, MySQL and databases, version control, Linux and testing, finishing with a capstone back-end project.",
    appliedIn: ["inventory-management-tool", "pakwarera"],
    link: { label: "Capstone repository", href: "https://github.com/iPythonezta/Meta-Backend-Final-Project" },
  },
  {
    name: "Advanced React",
    issuer: "Meta",
    kind: "Course",
    covers: "Advanced hooks, reusable component patterns, testing React apps and consuming APIs.",
    appliedIn: ["inventory-management-tool", "draftgenius"],
  },
  {
    name: "AI Engineering",
    issuer: "IBM",
    kind: "Professional Certificate",
    covers: "Machine learning with Python and scikit-learn, deep learning frameworks, building and evaluating models.",
    appliedIn: ["draftgenius", "pakwarera"],
  },
  {
    name: "Junior Cyber Security Analyst",
    issuer: "Hack The Box",
    kind: "Coursework completed",
    covers: "Security-analyst fundamentals: networking, Linux and Windows basics, security monitoring and basic penetration-testing concepts.",
    appliedIn: [] as string[],
  },
];

export const languages = ["English", "Urdu"];

// Smaller projects for the resume (descriptions from the GitHub repos / project READMEs).
export const additionalProjects = [
  { name: "BigCrawl", desc: "Python web crawler that respects robots.txt and uses SimHash for near-duplicate detection.", href: "https://github.com/iPythonezta/BigCrawl" },
  { name: "Facebook Product Recommendation Bot", desc: "FastAPI + React app that monitors Facebook groups and replies with product recommendations from a RAG agent over ChromaDB.", href: "" },
  { name: "Jskibiddi", desc: "Java-based interpreted programming language with Gen-Z keywords, built on the Lox interpreter design, with a Flask backend and web frontend.", href: "https://github.com/iPythonezta/Jskibiddi" },
  { name: "Risk Profiler Web App", desc: "Web app that estimates a person's money-laundering risk from their personal data.", href: "https://github.com/iPythonezta/Risk-Profiler-Webapp" },
  { name: "AI-Journo", desc: "AI journalist that gathers the latest news and publishes it on X (Twitter).", href: "https://github.com/iPythonezta/AI-Journo" },
  { name: "X-ray Classifier", desc: "Machine-learning model that classifies diseases from X-ray images and symptoms.", href: "https://github.com/iPythonezta/xray-classifier" },
  { name: "Project Management Tool", desc: "Full project management application built with Django and React.", href: "https://github.com/iPythonezta/Project-Management-Tool" },
  { name: "GetCovidData", desc: "Python package for retrieving COVID-19 statistics with simple commands.", href: "https://github.com/iPythonezta/GetCovidData" },
];
