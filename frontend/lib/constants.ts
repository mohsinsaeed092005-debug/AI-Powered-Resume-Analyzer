export const SKILL_CANDIDATES = [
  "Python", "FastAPI", "MongoDB", "SQL", "NoSQL", "Django", "Flask", "REST", "GraphQL",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Pandas", "NumPy", "scikit-learn",
  "PyTorch", "TensorFlow", "JavaScript", "TypeScript", "React", "Node.js", "Linux", "Git",
  "CI/CD", "DevOps", "data analysis", "machine learning", "NLP", "ETL", "microservices"
];

export const ROLE_CANDIDATES = [
  "Python Developer", "Backend Developer", "Full Stack Developer", "Data Engineer",
  "Machine Learning Engineer", "DevOps Engineer", "Software Engineer", "Data Scientist",
  "API Developer", "Backend Engineer", "Database Engineer"
];

export const ROLE_SKILL_DATASET: Record<string, string[]> = {
  "Backend Developer": ["python", "fastapi", "django", "flask", "rest", "mongodb", "sql", "docker", "git", "api"],
  "AI Engineer": ["python", "machine learning", "ml", "nlp", "pytorch", "tensorflow", "scikit-learn", "llm", "data"],
  "Machine Learning Engineer": ["python", "machine learning", "ml", "scikit-learn", "pytorch", "tensorflow", "pandas", "numpy"],
  "Data Scientist": ["python", "sql", "pandas", "numpy", "statistics", "machine learning", "data analysis", "visualization"],
  "Data Engineer": ["python", "sql", "etl", "mongodb", "aws", "docker", "spark", "data pipeline", "database"],
  "Full Stack Developer": ["javascript", "typescript", "react", "node.js", "python", "fastapi", "mongodb", "sql", "rest"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "azure", "gcp", "linux", "ci/cd", "git", "monitoring"],
  "API Developer": ["fastapi", "rest", "graphql", "python", "node.js", "mongodb", "sql", "microservices"],
};
