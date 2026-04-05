"""
Resume service layer - handles business logic for resume operations.

This separates business logic from route handlers, making the code:
- More testable
- Easier to maintain
- Reusable across different routes
"""

from datetime import datetime
from typing import Optional
from bson import ObjectId
from app.database import get_database
from app.models import ResumeCreate, ResumeUpdate, Resume


class ResumeService:
    """Service class for resume CRUD operations."""
    
    @staticmethod
    async def create_resume(user_id: str, resume_data: ResumeCreate) -> Resume:
        """
        Create a new resume for a user.
        
        Args:
            user_id: The owner of the resume
            resume_data: Resume content from the form
            
        Returns:
            The created resume with database ID
        """
        db = get_database()
        
        # Prepare document for MongoDB
        now = datetime.utcnow()
        resume_doc = {
            "user_id": user_id,
            "full_name": resume_data.full_name,
            "email": resume_data.email,
            "phone": resume_data.phone,
            "summary": resume_data.summary,
            "skills": resume_data.skills,
            "experience": [exp.model_dump() for exp in resume_data.experience],
            "education": [edu.model_dump() for edu in resume_data.education],
            "template": "default",
            "created_at": now,
            "updated_at": now,
        }
        
        # Insert into database
        result = await db.resumes.insert_one(resume_doc)
        
        # Return the created resume
        resume_doc["_id"] = str(result.inserted_id)
        return Resume(**resume_doc)
    
    @staticmethod
    async def get_resume_by_id(resume_id: str, user_id: str) -> Optional[Resume]:
        """
        Get a single resume by ID, ensuring it belongs to the user.
        
        Security: Always verify user_id to prevent users from
        accessing other users' resumes.
        """
        db = get_database()
        
        resume_doc = await db.resumes.find_one({
            "_id": ObjectId(resume_id),
            "user_id": user_id
        })
        
        if not resume_doc:
            return None
            
        resume_doc["_id"] = str(resume_doc["_id"])
        return Resume(**resume_doc)
    
    @staticmethod
    async def get_user_resumes(user_id: str):
        """Get all resumes belonging to a user."""
        db = get_database()
        
        cursor = db.resumes.find({"user_id": user_id})
        resumes = []
        
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            resumes.append(Resume(**doc))
            
        return resumes
    
    @staticmethod
    async def update_resume(
        resume_id: str, 
        user_id: str, 
        update_data: ResumeUpdate
    ) -> Optional[Resume]:
        """
        Update an existing resume.
        
        Only updates fields that are provided (partial update).
        Automatically updates the updated_at timestamp.
        """
        db = get_database()
        
        # Build update document - exclude None values
        update_dict = {"updated_at": datetime.utcnow()}
        
        if update_data.full_name is not None:
            update_dict["full_name"] = update_data.full_name
        if update_data.email is not None:
            update_dict["email"] = update_data.email
        if update_data.phone is not None:
            update_dict["phone"] = update_data.phone
        if update_data.summary is not None:
            update_dict["summary"] = update_data.summary
        if update_data.skills is not None:
            update_dict["skills"] = update_data.skills
        if update_data.experience is not None:
            update_dict["experience"] = [exp.model_dump() for exp in update_data.experience]
        if update_data.education is not None:
            update_dict["education"] = [edu.model_dump() for edu in update_data.education]
        
        # Perform update
        result = await db.resumes.update_one(
            {"_id": ObjectId(resume_id), "user_id": user_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            return None
            
        # Return updated resume
        return await ResumeService.get_resume_by_id(resume_id, user_id)
    
    @staticmethod
    async def delete_resume(resume_id: str, user_id: str) -> bool:
        """Delete a resume. Returns True if deleted, False if not found."""
        db = get_database()
        
        result = await db.resumes.delete_one({
            "_id": ObjectId(resume_id),
            "user_id": user_id
        })
        
        return result.deleted_count > 0


# Create singleton instance for import
resume_service = ResumeService()
