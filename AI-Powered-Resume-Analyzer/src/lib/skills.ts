const KNOWN_SKILLS = [
  "python", "javascript", "typescript", "java", "c", "c++", "c#",
  "go", "rust", "ruby", "php", "swift", "kotlin", "dart", "r",
  "scala", "perl", "matlab", "sql", "html", "css", "sass", "scss",
  "react", "reactjs", "next.js", "nextjs", "angular", "vue", "vuejs",
  "svelte", "node.js", "nodejs", "express", "django", "flask",
  "spring boot", "nest.js", "nestjs", "laravel", "rails",
  "react native", "flutter", "expo",
  "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
  "matplotlib", "seaborn", "opencv", "hugging face", "langchain",
  "openai", "transformers",
  "machine learning", "ml", "deep learning", "nlp",
  "natural language processing", "computer vision", "generative ai",
  "llm", "neural networks", "reinforcement learning",
  "data analysis", "data visualization", "data pipelines",
  "feature engineering", "model deployment", "mlops",
  "model training", "hyperparameter tuning",
  "mongodb", "postgresql", "mysql", "redis", "sqlite",
  "firebase", "supabase", "dynamodb", "cassandra",
  "snowflake", "bigquery", "databricks",
  "rest api", "restful", "graphql", "grpc", "websocket",
  "docker", "kubernetes", "k8s", "terraform", "ansible",
  "jenkins", "github actions", "ci/cd",
  "aws", "azure", "gcp", "cloud computing", "serverless", "lambda",
  "ec2", "s3", "heroku", "vercel", "netlify",
  "git", "github", "gitlab", "bitbucket",
  "linux", "bash", "powershell",
  "nginx", "apache",
  "jwt", "oauth", "authentication", "authorization",
  "microservices", "monolithic",
  "agile", "scrum", "jira",
  "figma", "sketch", "adobe xd",
  "tailwind", "tailwindcss", "bootstrap", "material ui",
  "redux", "zustand", "mobx",
  "prisma", "sequelize", "mongoose",
  "jest", "mocha", "cypress", "playwright", "selenium",
  "webpack", "vite", "rollup",
  "storybook", "chromatic",
  "responsive design", "accessibility",
  "seo", "web performance",
  "data warehouse", "etl",
  "apache spark", "spark", "hadoop", "airflow", "kafka",
  "tableau", "power bi",
  "statistics", "hypothesis testing", "regression", "classification",
  "jupyter",
  "solidity", "ethereum", "smart contracts", "web3",
  "unity", "unreal engine", "blender",
  "arduino", "esp32", "stm32", "rtos", "iot",
  "embedded c", "microcontrollers", "firmware",
  "pcb design", "uart", "spi", "i2c", "sensors",
  "network security", "penetration testing", "vulnerability assessment",
  "encryption", "firewall", "siem", "ethical hacking",
  "xgboost", "random forest",
  "user research", "wireframing", "prototyping", "usability testing",
  "design thinking", "interaction design", "visual design",
  "typography", "color theory",
  "monitoring", "prometheus", "grafana",
  "api", "sdk", "cli",
];

export function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  for (const skill of KNOWN_SKILLS) {
    const pattern = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i");
    if (pattern.test(lower)) {
      found.add(skill);
    }
  }

  return Array.from(found).sort();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
