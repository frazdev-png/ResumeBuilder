"""
Authentication API Routes - endpoints for user signup and login.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.models import UserCreate, User
from app.services.auth_service import auth_service

router = APIRouter(
    prefix="/api/auth",
    tags=["authentication"],
)

security = HTTPBearer()

# Login request model
class LoginRequest(BaseModel):
    email: str
    password: str

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Dependency to get current authenticated user from JWT token.
    Used to protect routes that require authentication.
    """
    token = credentials.credentials
    user_id = auth_service.decode_token(token)
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


@router.post("/signup", response_model=User, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """
    Register a new user.
    
    Expects JSON body with email, full_name, password.
    Returns 400 if email already exists.
    """
    user = await auth_service.register_user(user_data)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    return user


@router.post("/login")
async def login(login_data: LoginRequest):
    """
    Authenticate user and return JWT token.
    
    Returns 401 if credentials are invalid.
    """
    # Validate credentials
    user = await auth_service.authenticate_user(login_data.email, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = auth_service.create_access_token(str(user.id))
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user info.
    Requires valid JWT token in Authorization header.
    """
    return current_user


@router.post("/test-register")
async def test_register():
    """
    Quick endpoint to create a test user for Day 1 testing.
    
    Remove in production!
    """
    test_user = UserCreate(
        email="test@example.com",
        full_name="Test User",
        password="password123"
    )
    
    user = await auth_service.register_user(test_user)
    
    if not user:
        # User might already exist, try to get them
        from app.database import get_database
        db = get_database()
        existing = await db.users.find_one({"email": "test@example.com"})
        if existing:
            existing["_id"] = str(existing["_id"])
            return {"message": "Test user already exists", "user": User(**existing)}
    
    return {"message": "Test user created", "user": user}
