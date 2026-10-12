import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
import models
from routers import auth, plants, predict, sensors, reports, alerts, simulator

# Initialize database schema tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Thalir Smart Agriculture API",
    description="AI Leaf Disease Detection & IoT Environmental Telemetry Platform",
    version="1.0.0"
)

# Enable CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static route
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(plants.router)
app.include_router(predict.router)
app.include_router(sensors.router)
app.include_router(reports.router)
app.include_router(alerts.router)
app.include_router(simulator.router)


@app.on_event("startup")
def startup_event():
    # Start IoT telemetry simulator thread
    simulator.start_simulator_thread()
    print("[*] Thalir FastAPI Application started successfully.")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "Thalir AI & IoT Smart Agriculture Backend",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
