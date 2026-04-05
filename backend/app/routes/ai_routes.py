"""
AI API Routes - endpoints for AI-powered content improvement.
"""

from fastapi import APIRouter, HTTPException
from app.models import AIImproveRequest, AIImproveResponse, AICoverLetterRequest, AICoverLetterResponse, AIResumeScoreResponse
from app.services.ai_service import ai_service


router = APIRouter(
    prefix="/api/ai",
    tags=["ai"],
)


@router.post("/improve", response_model=AIImproveResponse)
async def improve_content(request: AIImproveRequest):
    """
    Improve resume content using AI.
    
    This endpoint takes a section of resume content and returns
    an improved version using Gemini AI.
    
    Example request:
    {
        "section": "summary",
        "content": "I am a software developer with 5 years experience",
        "tone": "professional"
    }
    """
    try:
        result = await ai_service.improve_content(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI improvement failed: {str(e)}")

@router.post("/cover-letter", response_model=AICoverLetterResponse)
async def generate_cover_letter(request: AICoverLetterRequest):
    """Generate a cover letter based on resume data."""
    try:
        return await ai_service.generate_cover_letter(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cover letter generation failed: {str(e)}")

@router.post("/score", response_model=AIResumeScoreResponse)
async def score_resume(resume_data: dict):
    """Score a resume based on completeness and formatting."""
    try:
        return await ai_service.score_resume(resume_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume scoring failed: {str(e)}")


@router.get("/status")
async def ai_status():
    """Check if AI service is configured and available."""
    return {
        "enabled": ai_service.enabled,
        "message": "AI service ready" if ai_service.enabled else "GEMINI_API_KEY not configured"
    }
