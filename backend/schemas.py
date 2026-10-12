import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: str
    role: Optional[str] = "farmer"


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# --- Plant Schemas ---
class PlantBase(BaseModel):
    name: str
    species: str
    field_zone: Optional[str] = "Zone A"
    planted_date: Optional[str] = "2026-03-01"
    health_status: Optional[str] = "Healthy"
    image_url: Optional[str] = None
    notes: Optional[str] = None


class PlantCreate(PlantBase):
    pass


class PlantResponse(PlantBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Sensor Data Schemas ---
class SensorDataBase(BaseModel):
    plant_id: Optional[int] = None
    temperature: float
    humidity: float
    soil_moisture: float
    light_lux: float


class SensorDataCreate(SensorDataBase):
    pass


class SensorDataResponse(SensorDataBase):
    id: int
    timestamp: datetime.datetime

    class Config:
        from_attributes = True


# --- Disease Report Schemas ---
class DiseaseReportBase(BaseModel):
    plant_id: Optional[int] = None
    crop: str
    disease_detected: str
    confidence: float
    severity: Optional[str] = "Moderate"
    recommendation: str
    image_path: Optional[str] = None


class DiseaseReportCreate(DiseaseReportBase):
    symptoms_json: Optional[str] = None


class DiseaseReportResponse(DiseaseReportBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Alert Schemas ---
class AlertBase(BaseModel):
    title: str
    message: str
    severity: Optional[str] = "warning"
    sensor_type: Optional[str] = None
    value: Optional[float] = None
    threshold: Optional[float] = None


class AlertResponse(AlertBase):
    id: int
    is_read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# --- Simulator Control Schema ---
class SimulatorConfig(BaseModel):
    active: bool
    preset: Optional[str] = "Normal"  # Normal, Heatwave, Drought, Heavy Rain, Night
    interval_seconds: Optional[int] = 3
