"""
Pydantic models for data validation and serialization.

These models define the structure of our data and ensure:
1. Input validation - reject invalid data before it reaches the database
2. Type safety - catch type errors at runtime
3. Auto-generated documentation - FastAPI uses these for OpenAPI docs
4. Serialization - convert MongoDB documents to JSON-friendly format
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


# ============== User Models ==============

class UserBase(BaseModel):
    """Base user model with common fields."""
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    """Model for user registration - includes password."""
    password: str = Field(..., min_length=6, description="Minimum 6 characters")


class User(UserBase):
    """User model returned from API - includes metadata."""
    id: str = Field(..., alias="_id")
    created_at: datetime
    
    class Config:
        # Allows using MongoDB's _id field as id
        populate_by_name = True
        # Enable JSON serialization for datetime
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ============== Experience Models ==============

class Experience(BaseModel):
    """Work experience entry."""
    company: str
    position: str
    location: Optional[str] = None
    start_date: str  # Format: "YYYY-MM" or "YYYY-MM-DD"
    end_date: Optional[str] = None  # None = current job
    description: str
    
    
class Education(BaseModel):
    """Education entry."""
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None


class Project(BaseModel):
    """Project entry."""
    name: str
    description: str
    url: Optional[str] = None
    technologies: str = ""


# ============== Resume Models ==============

class ResumeBase(BaseModel):
    """Base resume with all content fields."""
    full_name: str = ""
    email: str = ""
    phone: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)


class ResumeCreate(ResumeBase):
    """Model for creating a new resume."""
    pass


class ResumeUpdate(BaseModel):
    """Model for updating an existing resume - all fields optional."""
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[Experience]] = None
    education: Optional[List[Education]] = None
    projects: Optional[List[Project]] = None


class Resume(ResumeBase):
    """Full resume model with database metadata."""
    id: str = Field(..., alias="_id")
    user_id: str
    template: str = "default"  # For future multiple templates feature
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


# ============== AI Improvement Models ==============

class AIImproveRequest(BaseModel):
    """Request body for AI content improvement."""
    section: str = Field(..., description="Section to improve: summary, experience, skills")
    content: str = Field(..., description="Original content to improve")
    tone: str = Field(default="professional", description="Tone: professional, casual, formal")


class AIImproveResponse(BaseModel):
    """Response from AI improvement service."""
    improved_content: str
    suggestions: List[str] = Field(default_factory=list)


class AICoverLetterRequest(BaseModel):
    resume_data: dict
    target_job: Optional[str] = None
    target_company: Optional[str] = None

class AICoverLetterResponse(BaseModel):
    cover_letter: str

class AIResumeScoreResponse(BaseModel):
    score: int
    feedback: str


# ============== Health Check ==============

class HealthResponse(BaseModel):
    """API health check response."""
    status: str
    version: str = "1.0.0"
    database: dict
