from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
import os

# Load environment variables from the project root .env file.
project_root = Path(__file__).resolve().parents[2]
load_dotenv(project_root / ".env")

MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
db = client["resume_ai"]
users_collection = db["users"]
job_descriptions_collection = db["job_descriptions"]
