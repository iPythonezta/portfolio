// Only skills evidenced by the CV or by code in the featured projects.
export type SkillGroup = { key: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { key: "languages", items: ["Python", "JavaScript", "TypeScript", "C++", "Java", "SQL"] },
  { key: "backend", items: ["Django", "Django REST Framework", "Flask", "FastAPI", "SQLAlchemy", "WebSockets / SSE", "REST API design"] },
  { key: "frontend", items: ["React", "Next.js", "Vite", "Tailwind CSS", "Framer Motion", "Material UI"] },
  { key: "ai_ml", items: ["OpenAI / Azure OpenAI", "Multi-agent systems", "RAG + ChromaDB", "Prophet", "HMMs (hmmlearn)", "scikit-learn", "pandas / NumPy", "Embeddings"] },
  { key: "automation", items: ["Selenium", "Scheduling & workers", "PyInstaller packaging", "3rd-party API integration", "Web scraping"] },
  { key: "data", items: ["PostgreSQL", "MySQL", "SQLite", "Turso / libSQL", "msgpack / orjson", "Search indexing"] },
  { key: "cloud_devops", items: ["Azure", "GitHub Actions CI/CD", "Modal", "Git"] },
  { key: "practices", items: ["OOP", "SOLID & GoF patterns", "Unit & integration testing", "Technical writing", "Basic penetration testing"] },
];
