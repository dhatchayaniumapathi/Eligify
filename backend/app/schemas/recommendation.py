from pydantic import BaseModel, ConfigDict
from typing import List


class AIRecommendationScheme(BaseModel):
    scheme_id: str
    scheme_name: str
    description: str
    benefits: str
    required_documents: str
    confidence: float
    explanation: str
    ranking_score: float

    model_config = ConfigDict(from_attributes=True)


class RecommendationResponse(BaseModel):
    user_id: int
    recommended_schemes: List[AIRecommendationScheme]
    message: str = "Recommendations generated successfully"

    model_config = ConfigDict(from_attributes=True)