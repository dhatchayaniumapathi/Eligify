from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.utils.security import get_current_user
from app.schemas.document import DocumentResponse, DocumentUploadResponse
from app.services.document_service import process_and_store_document, get_user_documents

router = APIRouter()

@router.post("/upload-document", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a user document, save it locally, and store its metadata in the PostgreSQL DB.
    Utilizes current user context based on JWT authentication.
    """
    doc_record = process_and_store_document(db, current_user.id, file)
    
    return {
        "message": "Document uploaded successfully",
        "document": doc_record
    }

@router.get("/documents", response_model=List[DocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve metadata for all documents uploaded by the authenticated user.
    """
    documents = get_user_documents(db, current_user.id)
    return documents
