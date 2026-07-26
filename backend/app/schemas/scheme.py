from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class SchemeBase(BaseModel):
    scheme_name: str
    description: str
    benefits: Optional[str] = None
    required_documents: Optional[str] = None

class SchemeCreate(SchemeBase):
    pass

class SchemeResponse(SchemeBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
