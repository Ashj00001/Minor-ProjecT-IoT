from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import database, models, schemas

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post("/register", response_model=schemas.Token)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Simple hash representation for quick zero-dependency setup
    hashed_pwd = f"pbkdf2_{user.password}_hashed"
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd,
        role=user.role or "farmer"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "access_token": f"jwt_token_{new_user.id}_thalir",
        "token_type": "bearer",
        "user": new_user
    }


@router.post("/login", response_model=schemas.Token)
def login_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        # Auto-create demo user for smooth first-time demo onboarding
        hashed_pwd = f"pbkdf2_{user.password}_hashed"
        db_user = models.User(
            username=user.username or user.email.split("@")[0],
            email=user.email,
            hashed_password=hashed_pwd,
            role="farmer"
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    return {
        "access_token": f"jwt_token_{db_user.id}_thalir",
        "token_type": "bearer",
        "user": db_user
    }


@router.get("/me", response_model=schemas.UserResponse)
def get_current_user(db: Session = Depends(database.get_db)):
    user = db.query(models.User).first()
    if not user:
        user = models.User(
            username="Demo Farmer",
            email="farmer@thalir.agri",
            hashed_password="demo",
            role="farmer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
