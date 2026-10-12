from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import database, models, schemas

router = APIRouter(prefix="/api/v1/plants", tags=["Plant Management"])


@router.get("/", response_model=List[schemas.PlantResponse])
def get_all_plants(db: Session = Depends(database.get_db)):
    plants = db.query(models.Plant).all()
    if not plants:
        # Seed default sample crops for rich demo experience
        default_plants = [
            models.Plant(name="Roma Tomato #1", species="Tomato (Solanum lycopersicum)", field_zone="Zone A - Greenhouse 1", planted_date="2026-02-10", health_status="Healthy", image_url="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80", notes="Automated drip irrigation attached."),
            models.Plant(name="Yukon Gold Potato", species="Potato (Solanum tuberosum)", field_zone="Zone B - Open Field", planted_date="2026-01-20", health_status="Early Blight Detected", image_url="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80", notes="Monitored for early blight concentric lesions."),
            models.Plant(name="Sweet Corn Plot #4", species="Corn (Zea mays)", field_zone="Zone C - South Ridge", planted_date="2026-03-01", health_status="Healthy", image_url="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80", notes="High nitrogen soil mix."),
            models.Plant(name="Fuji Apple Tree #2", species="Apple (Malus domestica)", field_zone="Zone D - Orchard", planted_date="2024-11-15", health_status="Healthy", image_url="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80", notes="Pruned in spring for maximum airflow.")
        ]
        db.add_all(default_plants)
        db.commit()
        plants = db.query(models.Plant).all()
    return plants


@router.post("/", response_model=schemas.PlantResponse, status_code=status.HTTP_201_CREATED)
def create_plant(plant: schemas.PlantCreate, db: Session = Depends(database.get_db)):
    db_plant = models.Plant(**plant.dict())
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return db_plant


@router.get("/{plant_id}", response_model=schemas.PlantResponse)
def get_plant_by_id(plant_id: int, db: Session = Depends(database.get_db)):
    plant = db.query(models.Plant).filter(models.Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant record not found")
    return plant


@router.put("/{plant_id}", response_model=schemas.PlantResponse)
def update_plant(plant_id: int, plant_data: schemas.PlantCreate, db: Session = Depends(database.get_db)):
    plant = db.query(models.Plant).filter(models.Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant record not found")

    for key, value in plant_data.dict().items():
        setattr(plant, key, value)

    db.commit()
    db.refresh(plant)
    return plant


@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plant(plant_id: int, db: Session = Depends(database.get_db)):
    plant = db.query(models.Plant).filter(models.Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant record not found")
    db.delete(plant)
    db.commit()
    return None
