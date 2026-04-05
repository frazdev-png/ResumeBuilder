# AI Resume Builder

A production-level AI-powered resume builder with FastAPI backend and React frontend.

## Tech Stack

- **Backend:** FastAPI (Python) + MongoDB (Motor)
- **Frontend:** React + TypeScript + Tailwind CSS
- **AI:** Gemini API

## Project Structure

```
resume-builder/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # Entry point
│   │   ├── config.py       # Settings & env vars
│   │   ├── database.py     # MongoDB connection
│   │   ├── models/         # Pydantic models
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Business logic
│   ├── requirements.txt
│   └── .env
│
└── frontend/               # React frontend
    ├── src/
    ├── public/
    └── package.json
```

## Development Schedule

| Day | Topic |
|-----|-------|
| 1 | FastAPI Backend + MongoDB Setup |
| 2 | React Frontend + Tailwind Setup |
| 3 | Resume Form Components |
| 4 | Live Preview |
| 5 | Frontend-Backend Connection |
| 6 | JWT Authentication |
| 7 | Database Operations |
| 8 | Gemini AI Integration |
| 9 | PDF Export |
| 10 | UI Polish & Deployment |

## Setup Instructions

### Backend Setup (Day 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file from `.env.example` and add your values.

### Run Backend

```bash
uvicorn app.main:app --reload
```

### Run MongoDB (Local)

```bash
# Using Docker
docker run -d -p 27017:27017 --name resume-mongo mongo:latest
```

Or use MongoDB Atlas for cloud database.

## 🚀 Deployment

### 1. Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AI Resume Builder"

# Create GitHub repo first, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-builder.git
git push -u origin main
```

### 2. Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your repository
4. Configure:
   - **Name**: `ai-resume-builder-backend`
   - **Runtime**: Python 3
   - **Build**: `pip install -r requirements.txt`
   - **Start**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **Environment Variables**:
   ```
   MONGODB_URL=your_mongodb_atlas_url
   JWT_SECRET_KEY=your_secret_key
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   GEMINI_API_KEY=your_gemini_key
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

6. Click **Create Web Service**

### 3. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Select your repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build**: `npm run build`
   - **Output**: `dist`

5. **Environment Variable**:
   ```
   VITE_API_URL=https://ai-resume-builder-backend.onrender.com
   ```

6. Click **Deploy**

### 4. Update CORS

After deployment, update `ALLOWED_ORIGINS` in Render with your actual Vercel URL.
