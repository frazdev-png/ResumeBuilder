"""
Authentication service - handles user registration, login, and JWT token management.
"""

from datetime import datetime, timedelta
import bcrypt
from jose import JWTError, jwt
from bson import ObjectId
from app.config import get_settings
from app.database import get_database
from app.models import UserCreate, User


class AuthService:
    """Service class for authentication operations."""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a plain text password using bcrypt directly.
        """
        # bcrypt has 72 byte limit - truncate if necessary
        password_bytes = password.encode('utf-8')
        if len(password_bytes) > 72:
            password_bytes = password_bytes[:72]
        
        # Generate salt and hash
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against its hash."""
        password_bytes = plain_password.encode('utf-8')
        if len(password_bytes) > 72:
            password_bytes = password_bytes[:72]
        
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    
    @staticmethod
    def create_access_token(user_id: str) -> str:
        """
        Create JWT access token for authenticated user.
        
        JWT (JSON Web Token) contains:
        - Payload: user_id and expiration time
        - Signature: prevents tampering
        
        The token is signed with SECRET_KEY, so we can verify
        it came from our server without storing sessions.
        """
        settings = get_settings()
        
        # Token expires after configured minutes
        expire = datetime.utcnow() + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        
        payload = {
            "sub": user_id,  # subject = user identifier
            "exp": expire,
            "iat": datetime.utcnow(),  # issued at
            "type": "access"
        }
        
        return jwt.encode(
            payload, 
            settings.secret_key, 
            algorithm=settings.algorithm
        )
    
    @staticmethod
    def decode_token(token: str) -> str | None:
        """
        Decode and validate JWT token.
        
        Returns user_id if valid, None if invalid or expired.
        """
        settings = get_settings()
        
        try:
            payload = jwt.decode(
                token, 
                settings.secret_key, 
                algorithms=[settings.algorithm]
            )
            return payload.get("sub")
        except JWTError:
            # Token is invalid or expired
            return None
    
    @staticmethod
    async def register_user(user_data: UserCreate) -> User | None:
        """
        Register a new user.
        
        Returns the created user, or None if email already exists.
        """
        db = get_database()
        
        # Check if email already exists
        existing = await db.users.find_one({"email": user_data.email})
        if existing:
            return None
        
        # Create user document
        now = datetime.utcnow()
        user_doc = {
            "email": user_data.email,
            "full_name": user_data.full_name,
            "password_hash": AuthService.hash_password(user_data.password),
            "created_at": now,
        }
        
        # Insert into database
        result = await db.users.insert_one(user_doc)
        
        # Return user (without password)
        user_doc["_id"] = str(result.inserted_id)
        return User(**user_doc)
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> User | None:
        """
        Authenticate user with email and password.
        
        Returns user if credentials are valid, None otherwise.
        """
        db = get_database()
        
        # Find user by email
        user_doc = await db.users.find_one({"email": email})
        if not user_doc:
            return None
        
        # Verify password
        if not AuthService.verify_password(password, user_doc["password_hash"]):
            return None
        
        # Return user (without password)
        user_doc["_id"] = str(user_doc["_id"])
        return User(**user_doc)
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> User | None:
        """Get user by ID."""
        db = get_database()
        
        user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user_doc:
            return None
            
        user_doc["_id"] = str(user_doc["_id"])
        return User(**user_doc)


# Singleton instance
auth_service = AuthService()
