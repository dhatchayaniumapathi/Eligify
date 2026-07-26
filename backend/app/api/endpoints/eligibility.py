from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.utils.security import get_current_user
from app.schemas.recommendation import RecommendationResponse
from app.services.ai_service import get_ai_recommendations

router = APIRouter()

@router.post("/eligibility", response_model=RecommendationResponse)
def get_eligibility(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Trigger the AI engine to evaluate the authenticated user's profile against the eligibility constraints.
    """
    # Extract AI recommendations utilizing the logged-in user profile
    recommendations = get_ai_recommendations(current_user)
    
    return {
        "user_id": current_user.id,
        "recommended_schemes": recommendations,
        "message": "AI Recommendations populated successfully"
    }
