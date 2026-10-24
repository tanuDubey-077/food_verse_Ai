# FoodVerse AI — Developer Setup Guide

This guide walks through configuring, installing, running, and testing FoodVerse AI locally.

---

## 1. Environment Checklist

Ensure the following tools are installed on your host system:
- **Python:** 3.11+ (Python 3.13 recommended)
- **Node.js:** v18.0.0+ (Node v20 or v24 recommended)
- **Git:** 2.30+

---

## 2. Repository Cloning & Structure

```bash
git clone https://github.com/tanuDubey-077/food_verse_Ai.git
cd food_verse_Ai
```

The repository is organized into:
- `/backend`: FastAPI application, AI providers, database, and pytest test suite.
- `/frontend`: React 19 + TypeScript + Vite spatial user interface.
- `/docs`: Epics, system architecture, API specifications, and deployment guides.

---

## 3. Backend Setup

### Step 3.1: Python Virtual Environment
Navigate to the root and configure a Python virtual environment:
```bash
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3.2: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3.3: Configure Environment Variables
Copy `.env.example` in the root or create `backend/.env`:
```bash
cp ../.env.example .env
```
Default values work out of the box with zero external keys (using local AI reasoning and local USDA nutrition dataset). To enable OpenAI or Gemini, configure `LLM_API_KEY` and `VISION_API_KEY`.

### Step 3.4: Launch the Backend Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The FastAPI backend will start at `http://localhost:8000`.  
- Interactive API Docs: `http://localhost:8000/docs`  
- Health endpoint: `http://localhost:8000/api/v1/health`

---

## 4. Frontend Setup

### Step 4.1: Install Dependencies
Open a second terminal window:
```bash
cd frontend
npm install
```
*(On Windows PowerShell, if `npm` execution policy restriction occurs, use `npm.cmd install`)*

### Step 4.2: Launch Vite Development Server
```bash
npm run dev
# or npm.cmd run dev
```
The spatial frontend application will launch at `http://localhost:5173`.

---

## 5. Verifying the Full Stack

1. Open `http://localhost:5173` in your browser.
2. Check the top header **System Status** indicator. It will display a luminous emerald status: `AI ENGINE ONLINE | SQLite Connected`.
3. Press `Ctrl + K` to open the floating **Command Palette**.
4. Test **Food Recognition** by uploading a food photo or typing a dish name.
5. Test **Smart Cooking Assistant** with any ingredients in your pantry.
