from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas

router = APIRouter(prefix="/api/v1/alerts", tags=["System Alerts"])


@router.get("/", response_model=List[schemas.AlertResponse])
def get_all_alerts(db: Session = Depends(database.get_db)):
    alerts = db.query(models.Alert).order_by(models.Alert.created_at.desc()).all()
    if not alerts:
        # Seed default sample alert
        sample = models.Alert(
            title="Low Soil Moisture Notice",
            message="Soil moisture level dropped below 35% in Zone A. Automatic irrigation recommended.",
            severity="warning",
            sensor_type="Soil Moisture",
            value=34.2,
            threshold=35.0,
            is_read=False
        )
        db.add(sample)
        db.commit()
        alerts = [sample]
    return alerts


@router.post("/{alert_id}/read", response_model=schemas.AlertResponse)
def mark_alert_read(alert_id: int, db: Session = Depends(database.get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.commit()
    db.refresh(alert)
    return alert


@router.post("/read-all")
def mark_all_alerts_read(db: Session = Depends(database.get_db)):
    db.query(models.Alert).update({models.Alert.is_read: True})
    db.commit()
    return {"message": "All alerts marked as read"}
