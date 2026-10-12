import os
import sys
import json
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
import database, models, schemas

# Add parent directory of ai-model to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "ai-model")))
from inference import predict_leaf_disease

router = APIRouter(prefix="/api/v1/predict", tags=["AI Disease Detection"])

UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)


@router.post("/")
async def predict_disease(
    file: UploadFile = File(...),
    plant_id: Optional[int] = Form(None),
    crop_type: Optional[str] = Form(None),
    db: Session = Depends(database.get_db)
):
    """
    POST /predict
    Upload leaf image file -> Run AI model inference -> Store report in DB -> Return JSON diagnosis.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File provided is not an image. Please upload a JPEG, PNG, or WEBP image."
        )

    try:
        contents = await file.read()

        # Save uploaded image file locally
        file_ext = os.path.splitext(file.filename)[1] or ".jpg"
        unique_filename = f"leaf_{uuid.uuid4().hex[:8]}{file_ext}"
        saved_file_path = os.path.join(UPLOADS_DIR, unique_filename)

        with open(saved_file_path, "wb") as f:
            f.write(contents)

        # Execute AI Computer Vision model prediction
        prediction = predict_leaf_disease(contents, target_crop=crop_type)

        if not prediction.get("success", False):
            raise HTTPException(status_code=500, detail=prediction.get("error", "AI Model Error"))

        # Log Disease Report entry into database
        report = models.DiseaseReport(
            plant_id=plant_id,
            crop=prediction["crop"],
            disease_detected=prediction["disease"],
            confidence=prediction["confidence"],
            severity=prediction["severity"],
            symptoms_json=json.dumps(prediction["symptoms"]),
            recommendation=prediction["recommendation"],
            image_path=f"/uploads/{unique_filename}"
        )
        db.add(report)

        # Update plant entity health status if plant_id is specified
        if plant_id:
            plant = db.query(models.Plant).filter(models.Plant.id == plant_id).first()
            if plant:
                plant.health_status = f"{prediction['disease']} ({prediction['severity']})"
                plant.image_url = f"/uploads/{unique_filename}"

        # Trigger automatic system alert if severe disease detected
        if prediction["severity"] in ["High", "Critical"]:
            alert = models.Alert(
                title=f"Critical Disease Detected: {prediction['crop']} {prediction['disease']}",
                message=f"AI leaf scan identified {prediction['disease']} with {prediction['confidence']}% confidence. Recommended action: {prediction['organic_remedies'][0]}",
                severity="critical" if prediction["severity"] == "Critical" else "warning",
                sensor_type="AI Vision Camera"
            )
            db.add(alert)

        db.commit()
        db.refresh(report)

        return {
            "report_id": report.id,
            "filename": unique_filename,
            "image_url": f"/uploads/{unique_filename}",
            "prediction": prediction
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Prediction service error: {str(e)}")
