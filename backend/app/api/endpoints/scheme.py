from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.scheme import Scheme
from app.schemas.scheme import SchemeResponse

router = APIRouter()

@router.get("/schemes", response_model=List[SchemeResponse])
def get_schemes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Fetch a paginated list of all available government schemes.
    This endpoint is public and requires no authentication.
    """
    schemes = db.query(Scheme).offset(skip).limit(limit).all()
    return schemes

@router.get("/schemes/{id}", response_model=SchemeResponse)
def get_scheme(id: int, db: Session = Depends(get_db)):
    """
    Fetch details of a specific government scheme by its unique ID.
    This endpoint is public and requires no authentication.
    """
    scheme = db.query(Scheme).filter(Scheme.id == id).first()
    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheme not found"
        )
    return scheme
