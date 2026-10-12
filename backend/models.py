import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(String(20), default="farmer")  # farmer, agronomist, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    species = Column(String(100), nullable=False)
    field_zone = Column(String(50), default="Zone A")
    planted_date = Column(String(20), default="2026-03-01")
    health_status = Column(String(50), default="Healthy")
    image_url = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sensor_readings = relationship("SensorData", back_populates="plant", cascade="all, delete-orphan")
    disease_reports = relationship("DiseaseReport", back_populates="plant", cascade="all, delete-orphan")


class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=True)
    temperature = Column(Float, nullable=False)   # in Celsius (°C)
    humidity = Column(Float, nullable=False)      # in Relative Humidity (%)
    soil_moisture = Column(Float, nullable=False) # in percentage (%)
    light_lux = Column(Float, nullable=False)     # in Lux (lx)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    plant = relationship("Plant", back_populates="sensor_readings")


class DiseaseReport(Base):
    __tablename__ = "disease_reports"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=True)
    crop = Column(String(50), nullable=False)
    disease_detected = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String(20), default="Moderate")
    symptoms_json = Column(Text, nullable=True)
    recommendation = Column(Text, nullable=False)
    image_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    plant = relationship("Plant", back_populates="disease_reports")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(20), default="warning")  # info, warning, critical
    sensor_type = Column(String(50), nullable=True)
    value = Column(Float, nullable=True)
    threshold = Column(Float, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
