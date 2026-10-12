from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas

router = APIRouter(prefix="/api/v1/reports", tags=["Diagnostic Reports"])


@router.get("/", response_model=List[schemas.DiseaseReportResponse])
def get_all_reports(db: Session = Depends(database.get_db)):
    reports = db.query(models.DiseaseReport).order_by(models.DiseaseReport.created_at.desc()).all()
    if not reports:
        # Seed default sample report for rich initial view
        sample = models.DiseaseReport(
            crop="Tomato",
            disease_detected="Early Blight",
            confidence=96.4,
            severity="Moderate",
            recommendation="Apply copper octanoate fungicide and reduce foliage moisture.",
            symptoms_json='["Concentric ring spots on lower leaves", "Yellowing tissue"]',
            image_path="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80"
        )
        db.add(sample)
        db.commit()
        reports = [sample]
    return reports


@router.get("/{report_id}", response_model=schemas.DiseaseReportResponse)
def get_report_by_id(report_id: int, db: Session = Depends(database.get_db)):
    report = db.query(models.DiseaseReport).filter(models.DiseaseReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
