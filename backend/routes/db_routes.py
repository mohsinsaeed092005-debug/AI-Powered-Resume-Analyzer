import os
import re
import requests
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError
from pydantic import BaseModel, Field
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from database.connection import users_collection, job_descriptions_collection

router = APIRouter(prefix="/db", tags=["Database"])

OPENROUTER_URL = os.getenv("OPENROUTER_URL", "https://openrouter.ai/api/v1/chat/completions")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o")
PROJECT_ROOT = Path(__file__).resolve().parents[2]
LOCAL_EMBEDDING_MODEL = PROJECT_ROOT / "models" / "all-MiniLM-L6-v2"
EMBEDDING_MODEL_NAME = os.getenv(
    "EMBEDDING_MODEL_NAME",
    str(LOCAL_EMBEDDING_MODEL) if LOCAL_EMBEDDING_MODEL.exists() else "all-MiniLM-L6-v2",
)
embedding_model = None

SKILL_CANDIDATES = [
    "Python", "FastAPI", "MongoDB", "SQL", "NoSQL", "Django", "Flask", "REST", "GraphQL",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Pandas", "NumPy", "scikit-learn",
    "PyTorch", "TensorFlow", "JavaScript", "TypeScript", "React", "Node.js", "Linux", "Git",
    "CI/CD", "DevOps", "data analysis", "machine learning", "NLP", "ETL", "microservices"
]
ROLE_CANDIDATES = [
    "Python Developer", "Backend Developer", "Full Stack Developer", "Data Engineer",
    "Machine Learning Engineer", "DevOps Engineer", "Software Engineer", "Data Scientist",
    "API Developer", "Backend Engineer", "Database Engineer"
]
ROLE_SKILL_DATASET = {
    "Backend Developer": ["python", "fastapi", "django", "flask", "rest", "mongodb", "sql", "docker", "git", "api"],
    "AI Engineer": ["python", "machine learning", "ml", "nlp", "pytorch", "tensorflow", "scikit-learn", "llm", "data"],
    "Machine Learning Engineer": ["python", "machine learning", "ml", "scikit-learn", "pytorch", "tensorflow", "pandas", "numpy"],
    "Data Scientist": ["python", "sql", "pandas", "numpy", "statistics", "machine learning", "data analysis", "visualization"],
    "Data Engineer": ["python", "sql", "etl", "mongodb", "aws", "docker", "spark", "data pipeline", "database"],
    "Full Stack Developer": ["javascript", "typescript", "react", "node.js", "python", "fastapi", "mongodb", "sql", "rest"],
    "DevOps Engineer": ["docker", "kubernetes", "aws", "azure", "gcp", "linux", "ci/cd", "git", "monitoring"],
    "API Developer": ["fastapi", "rest", "graphql", "python", "node.js", "mongodb", "sql", "microservices"],
}

class UserCreate(BaseModel):
    name: str
    email: str
    skills: list[str] = Field(default_factory=list)
    education: list[str] = Field(default_factory=list)
    experience: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    target_role: str | None = None

class JobDescription(BaseModel):
    description: str = Field(..., min_length=1)


class ResumeAnalysisRequest(UserCreate):
    job_description: str = Field(..., min_length=1)


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def get_embedding_model():
    global embedding_model
    if embedding_model is None:
        from sentence_transformers import SentenceTransformer

        if Path(EMBEDDING_MODEL_NAME).exists():
            embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME, local_files_only=True)
        else:
            embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    return embedding_model


def resume_to_text(payload: ResumeAnalysisRequest) -> str:
    sections = [
        payload.name,
        payload.email,
        payload.target_role or "",
        "Skills: " + ", ".join(payload.skills),
        "Education: " + ". ".join(payload.education),
        "Experience: " + ". ".join(payload.experience),
        "Projects: " + ". ".join(payload.projects),
        "Certifications: " + ". ".join(payload.certifications),
    ]
    return normalize_text(" ".join(section for section in sections if section))


def user_profile_terms(user: UserCreate) -> list[str]:
    profile_text = normalize_text(
        " ".join(
            user.skills
            + user.education
            + user.experience
            + user.projects
            + user.certifications
            + ([user.target_role] if user.target_role else [])
        )
    ).lower()
    terms = {skill.lower() for skill in user.skills}
    for candidate in SKILL_CANDIDATES:
        if candidate.lower() in profile_text:
            terms.add(candidate.lower())
    return sorted(terms)


def extract_terms(description: str, candidates: list[str]) -> list[str]:
    lower_text = description.lower()
    return [candidate for candidate in candidates if candidate.lower() in lower_text]


def db_unavailable_error() -> HTTPException:
    return HTTPException(
        status_code=503,
        detail="MongoDB is not running. Start MongoDB on localhost:27017 and try again.",
    )


def try_insert(collection, document: dict) -> str | None:
    try:
        result = collection.insert_one(document.copy())
    except (PyMongoError, ServerSelectionTimeoutError):
        return None
    return str(result.inserted_id) if result.inserted_id else None


def call_openrouter(messages: list[dict], max_tokens: int = 900) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Missing OPENROUTER_API_KEY in environment")

    payload_data = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": max_tokens,
    }

    try:
        response = requests.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload_data,
            timeout=30,
        )
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"OpenRouter request failed: {exc}")

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail=f"OpenRouter error: {response.status_code} {response.text}")

    openrouter_data = response.json()
    choice = openrouter_data.get("choices", [{}])[0]
    return choice.get("message", {}).get("content") or choice.get("text") or ""


def summarize_description(description: str) -> str:
    sentences = re.split(r"(?<=[.!?])\s+", description)
    return sentences[0] if sentences else description


def suggest_roles(description: str) -> list[str]:
    roles = extract_terms(description, ROLE_CANDIDATES)
    lower_text = description.lower()
    if not roles:
        if "python" in lower_text and "developer" in lower_text:
            roles.append("Python Developer")
        elif "backend" in lower_text:
            roles.append("Backend Developer")
        elif "engineer" in lower_text:
            roles.append("Engineer")
        elif "data" in lower_text:
            roles.append("Data Engineer")
    return roles or ["Technical role"]

@router.get("/health")
def database_health():
    try:
        users_collection.database.client.admin.command("ping")
    except (PyMongoError, ServerSelectionTimeoutError):
        return {
            "database": "offline",
            "message": "MongoDB is not running on localhost:27017",
        }
    return {"database": "online", "message": "MongoDB connection is ready"}

@router.get("/users/count")
def users_count():
    try:
        count = users_collection.count_documents({})
    except (PyMongoError, ServerSelectionTimeoutError):
        raise db_unavailable_error()
    return {"users_count": count}

@router.post("/analyze")
def analyze_job_description(payload: JobDescription):
    description = normalize_text(payload.description)
    analysis = {
        "summary": summarize_description(description),
        "required_skills": extract_terms(description, SKILL_CANDIDATES),
        "suggested_roles": suggest_roles(description),
        "original_description": description,
    }
    result = {"description": description, "analysis": analysis}
    analysis_id = try_insert(job_descriptions_collection, result)
    analysis["analysis_id"] = analysis_id
    analysis["stored"] = bool(analysis_id)
    return analysis


@router.post("/resume/analyze")
def analyze_resume_match(payload: ResumeAnalysisRequest):
    description = normalize_text(payload.job_description)
    required_skills = extract_terms(description, SKILL_CANDIDATES)
    resume_skills = {skill.lower(): skill for skill in payload.skills}
    matched_skills = [
        skill for skill in required_skills
        if skill.lower() in resume_skills or skill.lower() in normalize_text(" ".join(payload.projects + payload.experience)).lower()
    ]
    missing_skills = [skill for skill in required_skills if skill not in matched_skills]
    match_score = round((len(matched_skills) / len(required_skills)) * 100) if required_skills else 0

    analysis = {
        "candidate": {"name": payload.name, "email": payload.email, "target_role": payload.target_role},
        "summary": summarize_description(description),
        "required_skills": required_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggested_roles": suggest_roles(description),
        "match_score": match_score,
        "recommendations": [
            f"Add evidence for {skill} in projects or experience."
            for skill in missing_skills[:5]
        ],
    }
    stored_payload = {"resume": payload.dict(), "analysis": analysis}
    analysis_id = try_insert(job_descriptions_collection, stored_payload)
    analysis["analysis_id"] = analysis_id
    analysis["stored"] = bool(analysis_id)
    return analysis


@router.post("/jobs/predict")
def predict_jobs(user: UserCreate):
    user_terms = user_profile_terms(user)
    profile_text = normalize_text(
        " ".join(
            user.skills
            + user.education
            + user.experience
            + user.projects
            + user.certifications
            + ([user.target_role] if user.target_role else [])
        )
    )
    if not profile_text:
        raise HTTPException(status_code=400, detail="Add skills, experience, projects, or a target role first.")

    predictions = []
    try:
        model = get_embedding_model()
        role_texts = [" ".join(skills) for skills in ROLE_SKILL_DATASET.values()]
        embeddings = model.encode([profile_text] + role_texts)
        embedding_scores = cosine_similarity([embeddings[0]], embeddings[1:])[0]
    except Exception:
        role_texts = [" ".join(skills) for skills in ROLE_SKILL_DATASET.values()]
        vectors = TfidfVectorizer(stop_words="english").fit_transform([profile_text] + role_texts)
        embedding_scores = cosine_similarity(vectors[0], vectors[1:])[0]

    for index, (role, role_skills) in enumerate(ROLE_SKILL_DATASET.items()):
        role_skill_set = set(role_skills)
        matched_skills = sorted(role_skill_set.intersection(user_terms))
        missing_skills = sorted(role_skill_set.difference(user_terms))
        skill_score = len(matched_skills) / len(role_skill_set) if role_skill_set else 0
        semantic_score = float(embedding_scores[index])
        final_score = round(((skill_score * 0.65) + (semantic_score * 0.35)) * 100, 2)
        predictions.append(
            {
                "role": role,
                "score": final_score,
                "match_label": f"{final_score}% Match",
                "matched_skills": matched_skills,
                "missing_skills": missing_skills[:5],
            }
        )

    predictions.sort(key=lambda item: item["score"], reverse=True)
    result = {
        "candidate": {"name": user.name, "email": user.email, "target_role": user.target_role},
        "extracted_skills": user_terms,
        "best_roles": predictions[:3],
        "all_predictions": predictions,
    }
    analysis_id = try_insert(job_descriptions_collection, result)
    result["analysis_id"] = analysis_id
    result["stored"] = bool(analysis_id)
    return result


@router.post("/resume/score")
def score_resume(payload: ResumeAnalysisRequest):
    resume_text = resume_to_text(payload)
    job_description = normalize_text(payload.job_description)
    if not resume_text or not job_description:
        raise HTTPException(status_code=400, detail="Resume profile and job description are required.")

    score_method = "sentence-transformers cosine similarity"
    model_name = EMBEDDING_MODEL_NAME
    try:
        model = get_embedding_model()
        embeddings = model.encode([resume_text, job_description])
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    except Exception as exc:
        vectorizer = TfidfVectorizer(stop_words="english")
        vectors = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(vectors[0], vectors[1])[0][0]
        score_method = f"TF-IDF fallback because embedding model failed: {exc}"
        model_name = None

    similarity_score = round(float(similarity) * 100, 2)
    result = {
        "candidate": {"name": payload.name, "email": payload.email, "target_role": payload.target_role},
        "similarity_score": similarity_score,
        "match_label": f"{similarity_score}% Match",
        "score_method": score_method,
        "embedding_model": model_name,
        "resume_text": resume_text,
        "job_description": job_description,
    }
    analysis_id = try_insert(job_descriptions_collection, result)
    result["analysis_id"] = analysis_id
    result["stored"] = bool(analysis_id)
    return result


@router.post("/ai/analyze")
def analyze_job_description_openrouter(payload: JobDescription):
    description = normalize_text(payload.description)
    prompt = f"""
Analyze this job description.
Extract:
- Required skills
- Experience level
- Keywords
- Soft skills

Job Description:
{description}
"""

    message = call_openrouter(
        [
            {"role": "system", "content": "You are an assistant that extracts structured hiring requirements from a job description."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=700,
    )

    analysis = {
        "job_description": description,
        "openrouter_response": message,
        "openrouter_meta": {
            "model": OPENROUTER_MODEL,
        }
    }
    analysis_id = try_insert(job_descriptions_collection, analysis)
    analysis["analysis_id"] = analysis_id
    analysis["stored"] = bool(analysis_id)
    return analysis


@router.post("/resume/tailor")
def tailor_resume(payload: ResumeAnalysisRequest):
    description = normalize_text(payload.job_description)
    profile = {
        "name": payload.name,
        "email": payload.email,
        "target_role": payload.target_role,
        "skills": payload.skills,
        "education": payload.education,
        "experience": payload.experience,
        "projects": payload.projects,
        "certifications": payload.certifications,
    }
    prompt = f"""
Generate ATS optimized resume content for this job description using this profile.

Improve:
- Skills section
- ATS keywords
- Professional summary
- Experience bullet points
- Project bullet points

Return the answer with these headings:
1. ATS Optimized Summary
2. Optimized Skills
3. ATS Keywords to Add
4. Improved Experience Bullets
5. Improved Project Bullets
6. Missing Items to Add

Profile:
{profile}

Job Description:
{description}
"""

    tailored_content = call_openrouter(
        [
            {
                "role": "system",
                "content": "You are an expert resume writer and ATS optimization assistant. Keep suggestions truthful to the user's profile.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=1200,
    )

    result = {
        "profile": profile,
        "job_description": description,
        "tailored_resume_content": tailored_content,
        "openrouter_meta": {"model": OPENROUTER_MODEL},
    }
    analysis_id = try_insert(job_descriptions_collection, result)
    result["analysis_id"] = analysis_id
    result["stored"] = bool(analysis_id)
    return result

@router.post("/users")
def create_user(user: UserCreate):
    data = user.dict()
    try:
        result = users_collection.insert_one(data)
    except (PyMongoError, ServerSelectionTimeoutError):
        raise db_unavailable_error()
    return {"inserted_id": str(result.inserted_id)}
