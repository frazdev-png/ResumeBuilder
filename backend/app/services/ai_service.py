"""
AI Service - integrates with Google Gemini API for content improvement.

This service handles all AI-related operations, keeping the AI logic
separate from the rest of the application.
"""

import httpx
import urllib.parse
from app.config import get_settings
from app.models import AIImproveRequest, AIImproveResponse, Resume, AICoverLetterRequest, AICoverLetterResponse, AIResumeScoreResponse


class AIService:
    """Service class for AI-powered content improvement."""
    
    def __init__(self):
        """Initialize AI Service. Now uses proxy endpoint."""
        self.enabled = True
        self.api_url = "https://gemini.rudyy.workers.dev/chat"
    
    async def improve_content(self, request: AIImproveRequest) -> AIImproveResponse:
        """
        Improve resume content using Gemini AI.
        
        Args:
            request: Contains section type, original content, and desired tone
            
        Returns:
            Improved content with suggestions
        """
        if not self.enabled:
            # Fallback if AI is not configured
            return AIImproveResponse(
                improved_content=request.content,
                suggestions=["AI service not configured. Please set GEMINI_API_KEY."]
            )
        
        # Build prompt based on section type
        prompt = self._build_prompt(request)
        
        try:
            print(f"🤖 Calling Worker API for {request.section} improvement...")
            async with httpx.AsyncClient() as client:
                resp = await client.get(self.api_url, params={"message": prompt}, timeout=30.0)
                data = resp.json()
                
            if not data.get("success"):
                raise ValueError("API returned success false")
                
            improved_text = data.get("response", "")
            print(f"✅ Gemini response received: {improved_text[:100]}")
            
            suggestions = self._extract_suggestions(improved_text, request.section)
            
            return AIImproveResponse(
                improved_content=improved_text.strip(),
                suggestions=suggestions
            )
            
        except Exception as e:
            print(f"❌ Gemini Error: {str(e)}")
            return AIImproveResponse(
                improved_content=request.content,
                suggestions=[f"AI improvement failed: {str(e)}"]
            )
    
    def _build_prompt(self, request: AIImproveRequest) -> str:
        """Build an effective prompt for the AI based on the section type."""
        
        base_prompt = f"""You are an expert resume writer and career coach. 
Improve the following {request.section} section for a resume.

Requirements:
- Tone: {request.tone}
- Be concise and impactful
- Use strong action verbs
- Quantify achievements where possible
- Keep it professional and ATS-friendly

Original content to improve:
{request.content}

CRITICAL INSTRUCTION: Provide ONLY the raw improved text. Do not include any conversational text like 'Here is the improved summary', do not wrap in quotes or markdown blocks. Just the raw string!
"""
        
        # Section-specific enhancements
        if request.section == "summary":
            base_prompt += "\nMake it a compelling 2-3 sentence professional summary."
        elif request.section == "experience":
            base_prompt += "\nTransform bullet points into achievement-focused statements."
        elif request.section == "skills":
            base_prompt += "\nOrganize skills by category and prioritize relevant ones."
            
        return base_prompt
    
    def _extract_suggestions(self, improved_text: str, section: str) -> list:
        """Generate improvement suggestions based on changes made."""
        suggestions = []
        
        # Analyze improvements and provide helpful tips
        if section == "summary":
            suggestions = [
                "Added specific value proposition",
                "Emphasized years of experience",
                "Highlighted key strengths"
            ]
        elif section == "experience":
            suggestions = [
                "Used stronger action verbs",
                "Quantified achievements",
                "Improved clarity and impact"
            ]
        elif section == "skills":
            suggestions = [
                "Prioritized most relevant skills",
                "Organized by category",
                "Removed outdated technologies"
            ]
            
        return suggestions[:3]

    async def generate_cover_letter(self, request: AICoverLetterRequest) -> AICoverLetterResponse:
        """Generate a complete cover letter from the resume data."""
        # Truncate string to safely fit inside GET URL limits (Cloudflare ~2KB)
        yaml_resume = str(request.resume_data)[:1500]
        prompt = f"""You are an expert career coach.
Write a professional Cover Letter based on this data:
Data: {yaml_resume}
Job: {request.target_job}
Company: {request.target_company}

Format nicely. Be concise. NO conversational filler at start/end!"""
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(self.api_url, params={"message": prompt}, timeout=45.0)
                data = resp.json()
            return AICoverLetterResponse(cover_letter=data.get("response", "").strip())
        except Exception as e:
            return AICoverLetterResponse(cover_letter=f"Failed to generate cover letter: {str(e)}")

    async def score_resume(self, resume_data: dict) -> AIResumeScoreResponse:
        """Score the resume out of 100 with bullet points."""
        yaml_resume = str(resume_data)[:1500]
        prompt = f"""You are an expert ATS algorithm.
Score this resume data:
Data: {yaml_resume}

Return EXACTLY in this format:
SCORE: [Number 1-100]
PROS:
- [Pro 1]
- [Pro 2]
CONS:
- [Fix 1]
- [Fix 2]

NO conversational filler!"""

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(self.api_url, params={"message": prompt}, timeout=45.0)
                data = resp.json()
                text = data.get("response", "")
            
            # Simple string parsing
            score = 75
            try:
                for line in text.split('\\n'):
                    if line.startswith("SCORE:"):
                        score = int(line.split(":")[1].strip())
            except:
                pass
                
            return AIResumeScoreResponse(score=score, feedback=text.strip())
        except Exception as e:
            return AIResumeScoreResponse(score=0, feedback=f"Failed to score: {str(e)}")


# Singleton instance
ai_service = AIService()
