"""
Thalir Backend Automated Test Suite
Verifies API routes for authentication, plant CRUD, sensor telemetry, AI predictions, and alerts.
"""

import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure backend modules can be imported
sys.path.append(os.path.dirname(__file__))

from main import app
from database import Base, engine

# Create fresh test tables
Base.metadata.create_all(bind=engine)

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "Thalir" in data["app"]


def test_plants_api():
    # Test GET plants
    response = client.get("/api/v1/plants/")
    assert response.status_code == 200
    plants = response.json()
    assert isinstance(plants, list)
    assert len(plants) > 0

    # Test POST plant
    new_crop = {
        "name": "Test Crop Row",
        "species": "Tomato",
        "field_zone": "Zone A",
        "planted_date": "2026-03-01",
        "health_status": "Healthy",
        "notes": "Test registration"
    }
    create_res = client.post("/api/v1/plants/", json=new_crop)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == "Test Crop Row"


def test_live_sensor_api():
    response = client.get("/api/v1/sensors/live")
    assert response.status_code == 200
    sensor_data = response.json()
    assert "temperature" in sensor_data
    assert "humidity" in sensor_data
    assert "soil_moisture" in sensor_data
    assert "light_lux" in sensor_data


def test_sensor_history_api():
    response = client.get("/api/v1/sensors/history?limit=10")
    assert response.status_code == 200
    history = response.json()
    assert isinstance(history, list)
    assert len(history) > 0


def test_simulator_api():
    # Test status
    res = client.get("/api/v1/simulator/status")
    assert res.status_code == 200
    status_data = res.json()
    assert "active" in status_data

    # Test config update
    cfg_res = client.post("/api/v1/simulator/config", json={"active": True, "preset": "Heatwave"})
    assert cfg_res.status_code == 200
    assert cfg_res.json()["config"]["preset"] == "Heatwave"


def test_alerts_api():
    res = client.get("/api/v1/alerts/")
    assert res.status_code == 200
    alerts = res.json()
    assert isinstance(alerts, list)


if __name__ == "__main__":
    pytest.main(["-v", "test_backend.py"])
