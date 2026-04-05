"""
Database module for MongoDB connection using Motor (async MongoDB driver).

Motor is the official async Python driver for MongoDB, perfect for FastAPI
because it doesn't block the event loop during database operations.
"""

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

# Global variable to hold the database client
# This is a pattern used in FastAPI to maintain connection across requests
client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    """
    Initialize MongoDB connection.
    
    Called when FastAPI starts up. Creates a persistent connection
    pool that can be reused across all requests.
    """
    global client
    settings = get_settings()
    
    # Create client with connection pool
    # maxPoolSize=10 means up to 10 concurrent connections
    client = AsyncIOMotorClient(
        settings.mongodb_url,
        maxPoolSize=10,
        minPoolSize=1,
    )
    
    # Verify connection by pinging the server
    await client.admin.command("ping")
    print(f"✅ Connected to MongoDB: {settings.mongodb_url}")


async def close_db() -> None:
    """
    Close MongoDB connection.
    
    Called when FastAPI shuts down. Properly closes all connections
    to avoid resource leaks.
    """
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")


def get_database():
    """
    Returns the database instance for performing operations.
    
    Usage in routes:
        db = get_database()
        result = await db.users.find_one({"email": email})
    """
    settings = get_settings()
    if client is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return client[settings.database_name]


async def check_db_health() -> dict:
    """
    Health check endpoint to verify database connectivity.
    
    Returns database status and server info.
    """
    if client is None:
        return {"status": "disconnected", "error": "Client not initialized"}
    
    try:
        # Ping the server
        await client.admin.command("ping")
        server_info = await client.server_info()
        return {
            "status": "connected",
            "version": server_info.get("version", "unknown"),
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}
