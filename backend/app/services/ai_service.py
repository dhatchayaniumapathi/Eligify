from ai_engine.recommendation.recommender import recommend_schemes
from ai_engine.rules.models import UserProfile
from app.models.user import User


def get_ai_recommendations(profile: User):
    """
    Bridge between backend User model and Eligify AI Engine.
    """

    user_profile = UserProfile(
        age=profile.age or 0,
        gender=profile.gender or "All",
        category=profile.category or "General",
        annual_income=profile.annual_income or 0,
        state=profile.state or "All",
        occupation=profile.occupation or "All",
        disability=profile.disability or False,
        education=profile.education or "All",
    )

    recommendations = recommend_schemes(user_profile)

    return [
        {
            "scheme_id": rec.scheme.scheme_id,
            "scheme_name": rec.scheme.scheme_name,
            "description": rec.scheme.description,
            "benefits": rec.scheme.benefits,
            "required_documents": "; ".join(rec.scheme.required_documents),
            "confidence": rec.evaluation.confidence,
            "explanation": rec.evaluation.explanation,
            "ranking_score": rec.ranking_score,
        }
        for rec in recommendations
    ]