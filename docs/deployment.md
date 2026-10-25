# FoodVerse AI — Deployment & Production Configuration Guide

This document details deployment strategies for FoodVerse AI across single-host unified configurations, Docker containerization, and modern cloud platforms.

---

## 1. Unified Single-Host Deployment (Recommended)

In a unified single-host architecture, the React production build (`frontend/dist`) is served directly by the FastAPI backend as static assets. This eliminates CORS complexities and yields a single public URL.

### Build and Serve Pipeline:
1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. In production mode (`ENVIRONMENT=production`), FastAPI mounts `frontend/dist` at `/` while serving APIs under `/api/v1/*`.
3. Launch with production ASGI server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

---

## 2. Docker Container Deployment

### Multi-Stage `Dockerfile`
A container specification builds the Vite bundle in Node.js, installs Python dependencies, and serves the unified application via Uvicorn:

```dockerfile
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Container
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libgl1-mesa-glx libglib2.0-0 && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./static
ENV ENVIRONMENT=production
ENV PORT=8000
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 3. Cloud Platform Deployment

### Deploying to Render / Railway
1. **Repository:** Connect the GitHub repository.
2. **Build Command:**
   ```bash
   cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt
   ```
3. **Start Command:**
   ```bash
   cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. **Environment Variables:** Set `ENVIRONMENT=production`, `ALLOWED_ORIGINS=*`, and optional AI keys.

### Deploying to Vercel (Frontend) + Render (Backend)
- Frontend: Set root directory to `frontend`, output directory to `dist`, and set `VITE_API_BASE_URL=https://your-api.onrender.com/api/v1`.
- Backend: Configure `ALLOWED_ORIGINS` to include your Vercel domain.

---

## 4. Live Production Deployment on Render

The official live cloud deployment of FoodVerse AI is hosted on Render via Blueprint infrastructure-as-code (`render.yaml`):

* **Web Application (Frontend):** [https://foodverse-frontend-l1bc.onrender.com](https://foodverse-frontend-l1bc.onrender.com)
* **API Gateway (Backend):** [https://foodverse-backend-etpe.onrender.com](https://foodverse-backend-etpe.onrender.com)
* **Interactive Swagger Documentation:** [https://foodverse-backend-etpe.onrender.com/docs](https://foodverse-backend-etpe.onrender.com/docs)
* **Health Check Endpoint:** [https://foodverse-backend-etpe.onrender.com/api/v1/health](https://foodverse-backend-etpe.onrender.com/api/v1/health)

