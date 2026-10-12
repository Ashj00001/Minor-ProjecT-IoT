import time
import random
import threading
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas

router = APIRouter(prefix="/api/v1/simulator", tags=["IoT Data Simulator"])

# Global simulator state
SIMULATOR_STATE = {
    "active": True,
    "preset": "Normal",
    "interval_seconds": 4,
    "last_run": None,
    "total_packets_sent": 0
}

_simulator_thread = None
_thread_stop_event = threading.Event()


def run_simulator_loop():
    """Background thread generating dynamic environmental telemetry."""
    print("[*] Thalir IoT Data Simulator Thread Started.")
    while not _thread_stop_event.is_set():
        if SIMULATOR_STATE["active"]:
            try:
                db: Session = database.SessionLocal()
                preset = SIMULATOR_STATE["preset"]

                if preset == "Heatwave":
                    temp = round(random.uniform(36.0, 41.5), 1)
                    hum = round(random.uniform(32.0, 45.0), 1)
                    moist = round(random.uniform(25.0, 34.0), 1)
                    lux = round(random.uniform(950.0, 1250.0), 1)
                elif preset == "Drought":
                    temp = round(random.uniform(34.0, 38.0), 1)
                    hum = round(random.uniform(28.0, 38.0), 1)
                    moist = round(random.uniform(14.0, 24.0), 1)
                    lux = round(random.uniform(880.0, 1100.0), 1)
                elif preset == "Heavy Rain":
                    temp = round(random.uniform(20.0, 24.0), 1)
                    hum = round(random.uniform(88.0, 98.0), 1)
                    moist = round(random.uniform(80.0, 95.0), 1)
                    lux = round(random.uniform(180.0, 420.0), 1)
                elif preset == "Night":
                    temp = round(random.uniform(18.0, 22.0), 1)
                    hum = round(random.uniform(75.0, 85.0), 1)
                    moist = round(random.uniform(45.0, 55.0), 1)
                    lux = round(random.uniform(0.0, 15.0), 1)
                else:  # Normal
                    temp = round(random.uniform(28.5, 32.5), 1)
                    hum = round(random.uniform(62.0, 72.0), 1)
                    moist = round(random.uniform(40.0, 52.0), 1)
                    lux = round(random.uniform(750.0, 920.0), 1)

                reading = models.SensorData(
                    temperature=temp,
                    humidity=hum,
                    soil_moisture=moist,
                    light_lux=lux,
                    timestamp=datetime.datetime.utcnow()
                )
                db.add(reading)

                # Anomaly alerts
                if temp > 35.0:
                    db.add(models.Alert(
                        title=f"High Temp Warning ({temp}°C)",
                        message=f"Environment temperature exceeded safe threshold during {preset} simulation.",
                        severity="critical",
                        sensor_type="Temperature",
                        value=temp,
                        threshold=35.0
                    ))
                if moist < 30.0:
                    db.add(models.Alert(
                        title=f"Low Soil Moisture Alert ({moist}%)",
                        message=f"Soil moisture critically low ({moist}%). Soil requires immediate irrigation.",
                        severity="warning",
                        sensor_type="Soil Moisture",
                        value=moist,
                        threshold=30.0
                    ))

                db.commit()
                db.close()

                SIMULATOR_STATE["last_run"] = datetime.datetime.utcnow().isoformat()
                SIMULATOR_STATE["total_packets_sent"] += 1

            except Exception as e:
                print(f"[!] Simulator background thread error: {e}")

        # Sleep interval
        interval = SIMULATOR_STATE["interval_seconds"]
        _thread_stop_event.wait(interval)


def start_simulator_thread():
    global _simulator_thread
    if _simulator_thread is None or not _simulator_thread.is_alive():
        _thread_stop_event.clear()
        _simulator_thread = threading.Thread(target=run_simulator_loop, daemon=True)
        _simulator_thread.start()


@router.get("/status")
def get_simulator_status():
    return SIMULATOR_STATE


@router.post("/config")
def update_simulator_config(config: schemas.SimulatorConfig):
    SIMULATOR_STATE["active"] = config.active
    if config.preset:
        SIMULATOR_STATE["preset"] = config.preset
    if config.interval_seconds:
        SIMULATOR_STATE["interval_seconds"] = max(1, config.interval_seconds)

    return {
        "message": "Simulator configuration updated successfully",
        "config": SIMULATOR_STATE
    }


@router.post("/toggle")
def toggle_simulator():
    SIMULATOR_STATE["active"] = not SIMULATOR_STATE["active"]
    return {
        "message": f"Simulator {'activated' if SIMULATOR_STATE['active'] else 'paused'}",
        "active": SIMULATOR_STATE["active"]
    }
