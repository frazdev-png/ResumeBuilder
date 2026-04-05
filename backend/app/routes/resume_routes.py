"""
Resume API Routes - REST endpoints for resume CRUD operations.

All routes require authentication and use JWT token to identify user.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models import ResumeCreate, ResumeUpdate, Resume
from app.services.resume_service import resume_service
from app.routes.auth_routes import get_current_user
from app.models import User


# Create router with prefix and tags for OpenAPI documentation
router = APIRouter(
    prefix="/api/resumes",
    tags=["resumes"],
    responses={404: {"description": "Not found"}},
)


@router.post("", response_model=Resume)
async def create_resume(
    resume_data: ResumeCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new resume for the authenticated user.
    """
    try:
        resume = await resume_service.create_resume(str(current_user.id), resume_data)
        return resume
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[Resume])
async def list_resumes(current_user: User = Depends(get_current_user)):
    """Get all resumes for the current user."""
    try:
        resumes = await resume_service.get_user_resumes(str(current_user.id))
        return resumes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{resume_id}", response_model=Resume)
async def get_resume(resume_id: str, current_user: User = Depends(get_current_user)):
    """Get a specific resume by ID."""
    resume = await resume_service.get_resume_by_id(resume_id, str(current_user.id))
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume


@router.patch("/{resume_id}", response_model=Resume)
async def update_resume(
    resume_id: str,
    update_data: ResumeUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing resume.
    Supports partial updates - only fields provided will be changed.
    """
    resume = await resume_service.update_resume(resume_id, str(current_user.id), update_data)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resume


@router.delete("/{resume_id}")
async def delete_resume(resume_id: str, current_user: User = Depends(get_current_user)):
    """Delete a resume."""
    success = await resume_service.delete_resume(resume_id, str(current_user.id))
    if not success:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return {"message": "Resume deleted successfully"}
