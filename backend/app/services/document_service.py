import os
import shutil
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document

def save_document_to_disk(upload_file: UploadFile, destination_path: str):
    """
    Saves a FastAPI UploadFile to the local file system.
    """
    try:
        with open(destination_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()

def process_and_store_document(db: Session, user_id: int, file: UploadFile) -> Document:
    """
    Orchestrates the saving of the file to the local uploads directory 
    and saving the corresponding metadata to the PostgreSQL database.
    """
    upload_dir = settings.UPLOAD_DIRECTORY
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    file_path = os.path.join(upload_dir, file.filename)
    save_document_to_disk(file, file_path)
    
    document_record = Document(
        user_id=user_id,
        filename=file.filename,
        verification_status="Pending"
    )
    db.add(document_record)
    db.commit()
    db.refresh(document_record)
    
    return document_record

def get_user_documents(db: Session, user_id: int):
    """
    Retrieves all document metadata references stored for a particular user.
    """
    return db.query(Document).filter(Document.user_id == user_id).all()
