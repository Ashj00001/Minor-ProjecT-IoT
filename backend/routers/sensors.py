import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import database, models, schemas

router = APIRouter(prefix="/api/v1/sensors", tags=["IoT Sensor Telemetry"])


@router.post("/data", response_model=schemas.SensorDataResponse, status_code=status.HTTP_201_CREATED)
def post_sensor_reading(data: schemas.SensorDataCreate, db: Session = Depends(database.get_db)):
    """
    POST /sensors/data
    Endpoint called by Raspberry Pi or IoT simulator every few seconds to record environmental telemetry.
    """
    reading = models.SensorData(**data.dict())
    db.add(reading)

    # Automatic anomaly threshold checks for automated alerts
    if data.temperature > 35.0:
        db.add(models.Alert(
            title="High Temperature Warning",
            message=f"Sensor registered extreme temperature of {data.temperature}°C (Threshold: 35.0°C). Risk of plant heat stress.",
            severity="critical",
            sensor_type="Temperature",
            value=data.temperature,
            threshold=35.0
        ))
    elif data.temperature < 10.0:
        db.add(models.Alert(
            title="Low Temperature Alert",
            message=f"Sensor registered low temperature of {data.temperature}°C. Risk of frost damage.",
            severity="warning",
            sensor_type="Temperature",
            value=data.temperature,
            threshold=10.0
        ))

    if data.soil_moisture < 30.0:
        db.add(models.Alert(
            title="Low Soil Moisture - Irrigation Required",
            message=f"Soil moisture dropped to {data.soil_moisture}% (Threshold: 30.0%). Automatic irrigation system recommended.",
            severity="critical" if data.soil_moisture < 20.0 else "warning",
            sensor_type="Soil Moisture",
            value=data.soil_moisture,
            threshold=30.0
        ))

    db.commit()
    db.refresh(reading)
    return reading


@router.get("/live", response_model=schemas.SensorDataResponse)
def get_live_sensor_reading(db: Session = Depends(database.get_db)):
    """
    GET /sensors/live
    Fetch the latest single IoT telemetry reading.
    """
    latest = db.query(models.SensorData).order_by(models.SensorData.timestamp.desc()).first()

    if not latest:
        # Initial seed fallback reading if DB is empty
        latest = models.SensorData(
            temperature=31.2,
            humidity=67.4,
            soil_moisture=42.0,
            light_lux=820.0,
            timestamp=datetime.datetime.utcnow()
        )
        db.add(latest)
        db.commit()
        db.refresh(latest)

    return latest


@router.get("/history", response_model=List[schemas.SensorDataResponse])
def get_sensor_history(limit: int = Query(30, ge=5, le=200), db: Session = Depends(database.get_db)):
    """
    GET /sensors/history
    Retrieve recent historical sensor readings for charts and trends.
    """
    readings = db.query(models.SensorData).order_by(models.SensorData.timestamp.desc()).limit(limit).all()

    if len(readings) < 5:
        # Seed realistic continuous historical time series data if database was just initialized
        now = datetime.datetime.utcnow()
        seeded = []
        import random
        for i in range(25, 0, -1):
            ts = now - datetime.timedelta(minutes=i * 5)
            s_temp = round(28.0 + math_sin_wave(i) * 3.5 + random.uniform(-0.5, 0.5), 1)
            s_hum = round(65.0 + math_cos_wave(i) * 4.0 + random.uniform(-1.0, 1.0), 1)
            s_soil = round(44.0 - (i * 0.3) % 15 + random.uniform(-0.5, 0.5), 1)
            s_light = round(780.0 + math_sin_wave(i) * 120 + random.uniform(-20, 20), 1)

            s_entry = models.SensorData(
                temperature=s_temp,
                humidity=s_hum,
                soil_moisture=s_soil,
                light_lux=s_light,
                timestamp=ts
            )
            seeded.append(s_entry)

        db.add_all(seeded)
        db.commit()
        readings = db.query(models.SensorData).order_by(models.SensorData.timestamp.desc()).limit(limit).all()

    # Return chronological order (oldest to newest) for smooth line charts
    return sorted(readings, key=lambda x: x.timestamp)


def math_sin_wave(i: int) -> float:
    import math
    return math.sin(i * 0.4)

def math_cos_wave(i: int) -> float:
    import math
    return math.cos(i * 0.4)
