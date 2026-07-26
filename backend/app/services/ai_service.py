from datetime import datetime
from app.models.user import User

def get_ai_recommendations(profile: User):
    """
    Placeholder AI recommendation function.
    The AI team will implement the actual AI evaluation logic mapping the user's 
    profile variables (age, category, income, etc) to relevant schemes later.
    """
    # Return placeholder data for now so that the Schema and frontend UI 
    # can develop without being blocked on the AI implementation.
    return [
        {
            "id": 999,
            "scheme_name": "Dummy Government Scheme (Pending AI)",
            "description": "This is a placeholder scheme injected because the core AI logic is pending implementation.",
            "benefits": "Dummy benefits.",
            "required_documents": "Aadhar Card, Income Certificate",
            "created_at": datetime.utcnow()
        }
    ]
