from pydantic import BaseModel, ConfigDict
from typing import List
from .scheme import SchemeResponse

class RecommendationResponse(BaseModel):
    user_id: int
    recommended_schemes: List[SchemeResponse]
    message: str = "Recommendations generated successfully"
    
    model_config = ConfigDict(from_attributes=True)
