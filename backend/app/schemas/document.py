from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    verification_status: Optional[str] = "Pending"

class DocumentResponse(DocumentBase):
    id: int
    user_id: int
    uploaded_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DocumentUploadResponse(BaseModel):
    message: str
    document: DocumentResponse
    
    model_config = ConfigDict(from_attributes=True)
