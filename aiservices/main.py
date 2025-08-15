# api.py
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import sys
import os

# Add parent directory to path to import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.extract import extract_keywords_from_jd
from utils.profileFinder import LinkedInSourcingAgent
from utils.scoring import score_candidates_dynamic
from utils.outreach import generate_outreach

app = FastAPI(title="AI Hiring Agent API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (optional)
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend'))
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

# Initialize agent
agent = LinkedInSourcingAgent()

# ---------------------
# Pydantic Models
# ---------------------
class JobDescription(BaseModel):
    description: str
    num_candidates: int = 5

class CandidateResponse(BaseModel):
    name: str
    linkedin_url: str
    headline: str
    title: str = ""
    education: List[str] = []
    companies: List[str] = []
    skills: List[str] = []
    experience_years: int = 0
    location: str = ""
    role_level: str = ""
    industry: str = ""

class ScoredCandidate(BaseModel):
    name: str
    linkedin_url: str
    headline: str
    score: float
    breakdown: Dict[str, int]

class OutreachMessage(BaseModel):
    candidate: str
    message: str
    score: float = 0
    linkedin_url: str = ""

# ---------------------
# API Endpoints
# ---------------------
@app.get("/")
async def root():
    return {"message": "AI Hiring Agent API"}

# @app.get("/frontend")
# async def serve_frontend():
#     index_path = os.path.join(frontend_path, "index.html")
#     if os.path.exists(index_path):
#         return FileResponse(index_path)
#     return {"message": "Frontend not found"}

@app.post("/search", response_model=List[CandidateResponse])
async def search_candidates(job: JobDescription):
    try:
        structured_keywords, flat_keywords = extract_keywords_from_jd(job.description)
        candidates = agent.search_linkedin(flat_keywords, num_results=job.num_candidates)
        return candidates
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.post("/score", response_model=List[ScoredCandidate])
async def score_candidates_endpoint(job: JobDescription, candidates: List[CandidateResponse]):
    try:
        scored = score_candidates_dynamic(candidates, extract_keywords_from_jd(job.description)[0])
        return scored
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")

@app.post("/outreach", response_model=List[OutreachMessage])
async def generate_outreach_endpoint(job: JobDescription, scored_candidates: List[ScoredCandidate]):
    try:
        messages = generate_outreach(scored_candidates, job.description)
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Outreach generation failed: {str(e)}")

@app.post("/full-pipeline")
async def full_pipeline(job: JobDescription):
    try:
        # Extract keywords
        structured_keywords, flat_keywords = extract_keywords_from_jd(job.description)
        # Search LinkedIn
        candidates = agent.search_linkedin(flat_keywords, num_results=job.num_candidates)
        # Score candidates
        scored_candidates = score_candidates_dynamic(candidates, structured_keywords)
        # Generate outreach
        outreach_messages = generate_outreach(scored_candidates, job.description)
        return {
            "candidates": candidates,
            "scored_candidates": scored_candidates,
            "outreach_messages": outreach_messages
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
