# FastAPI Execution Guide

This guide provides step-by-step instructions for running the Cryptofy AI Brain (FastAPI) in both development and production environments.

---

## 🛠 Prerequisites

- **Python**: 3.11 or higher
- **PostgreSQL**: Ensure you have a running instance and the `DATABASE_URL` in your `.env` file.
- **Docker**: (Optional) For production deployment.

---

## 🚀 Local Development

Follow these steps to set up and run the server locally with auto-reload enabled.

### 1. Set Up Virtual Environment
It is recommended to use a virtual environment to manage dependencies.

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Activate virtual environment (Mac/Linux)
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Ensure you have a `.env` file in the `python/` directory with the following variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/cryptofy
GOOGLE_API_KEY=your_gemini_api_key
```

### 4. Run the Development Server
Use `uvicorn` with the `--reload` flag to automatically restart the server when code changes.

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🏭 Production Environment

For production, use the provided Docker configuration or run the server without the reload flag.

### Option 1: Using Docker (Recommended)

Docker ensures consistency across environments.

#### 1. Build the Image
```bash
docker build -t cryptofy-ai-brain .
```

#### 2. Run the Container
```bash
docker run -d \
  --name cryptofy-ai \
  -p 8000:8000 \
  --env-file .env \
  cryptofy-ai-brain
```

### Option 2: Manual Execution
If running directly on a server, use multiple workers for better performance.

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 📂 Directory Structure
- `main.py`: Application entry point and router inclusion.
- `database.py`: SQLAlchemy engine and session management.
- `models.py`: Database schema definitions.
- `routers/`: API endpoint definitions (chat, insights, p2p).
- `engine/`: Core AI and market logic.
