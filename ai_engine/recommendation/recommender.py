"""
recommender.py — Scheme Recommendation Engine Entrypoint for Eligify

Orchestrates loading scheme datasets, evaluating citizen profiles against rule sets,
ranking eligible matches, applying post-filters, and returning top scheme recommendations.
"""

from typing import List, Dict, Any, Optional
from ai_engine.dataset.loader import load_schemes_csv
from ai_engine.rules.models import UserProfile, Scheme, EligibilityResult
from ai_engine.rules.evaluator import evaluate_eligibility
from ai_engine.recommendation.ranking import rank_recommendations, RecommendedScheme
from ai_engine.recommendation.filters import apply_filters


def recommend_schemes(
    user_profile: UserProfile,
    dataset_path: Optional[str] = None,
    filter_criteria: Optional[Dict[str, Any]] = None,
    priority_map: Optional[Dict[str, float]] = None,
    include_partial: bool = False,
    min_confidence: float = 0.5,
) -> List[RecommendedScheme]:
    """
    Recommends eligible government schemes for a given user profile.

    Workflow Steps:
    1. Load dataset CSV records via load_schemes_csv.
    2. Convert dataset records into Scheme Pydantic models.
    3. Evaluate every scheme against the UserProfile using evaluate_eligibility.
    4. Retain eligible schemes (or schemes meeting min_confidence if include_partial=True).
    5. Rank eligible schemes using the ranking module.
    6. Apply post-evaluation filters (State, Ministry, Occupation, etc.) if requested.
    7. Return ranked recommendations list sorted from best match to lowest.

    Args:
        user_profile (UserProfile): Citizen profile used for evaluation.
        dataset_path (Optional[str]): Path to scheme CSV dataset. Uses default if None.
        filter_criteria (Optional[Dict[str, Any]]): Dictionary of filter flags (e.g. {'state': 'Tamil Nadu'}).
        priority_map (Optional[Dict[str, float]]): Mapping of scheme_id -> custom priority boost float.
        include_partial (bool): If True, includes non-fully eligible schemes that meet min_confidence.
        min_confidence (float): Minimum confidence threshold for partial matching (default: 0.5).

    Returns:
        List[RecommendedScheme]: Ranked list of recommended scheme objects.
    """
    # Step 1 & 2: Load raw dataset records and convert to Scheme models
    if dataset_path:
        raw_records = load_schemes_csv(dataset_path)
    else:
        raw_records = load_schemes_csv()

    schemes: List[Scheme] = [Scheme(**record) for record in raw_records]

    # Step 3 & 4: Evaluate every scheme and filter by eligibility criteria
    evaluated_pairs: List[tuple[Scheme, EligibilityResult]] = []

    for scheme in schemes:
        eval_result = evaluate_eligibility(user_profile, scheme)
        
        if include_partial:
            if eval_result.confidence >= min_confidence:
                evaluated_pairs.append((scheme, eval_result))
        else:
            if eval_result.eligible:
                evaluated_pairs.append((scheme, eval_result))

    # Step 5: Rank evaluated scheme recommendations
    ranked_results: List[RecommendedScheme] = rank_recommendations(
        evaluated_pairs=evaluated_pairs,
        user_state=user_profile.state,
        priority_map=priority_map,
    )

    # Step 6: Apply post-filters if specified
    if filter_criteria:
        ranked_results = apply_filters(
            recommendations=ranked_results,
            state=filter_criteria.get("state"),
            ministry=filter_criteria.get("ministry"),
            occupation=filter_criteria.get("occupation"),
            gender=filter_criteria.get("gender"),
            category=filter_criteria.get("category"),
            disability=filter_criteria.get("disability"),
        )

    return ranked_results


if __name__ == "__main__":
    # Demonstration CLI execution
    print("--- Eligify Recommendation Engine Test ---")

    # Sample User: Unemployed female graduate from Madhya Pradesh
    sample_user = UserProfile(
        age=24,
        gender="Female",
        category="General",
        annual_income=150000.0,
        state="Madhya Pradesh",
        occupation="Unemployed",
        disability=False,
        education="Graduate",
    )

    print(f"User Profile: Age {sample_user.age}, {sample_user.gender}, State: {sample_user.state}, Income: Rs. {sample_user.annual_income:,.0f}")
    
    recommendations = recommend_schemes(sample_user)

    print(f"\nFound {len(recommendations)} recommended schemes:")
    for idx, rec in enumerate(recommendations, start=1):
        print(f"\n{idx}. [{rec.scheme.scheme_id}] {rec.scheme.scheme_name}")
        print(f"   State Jurisdiction: {rec.scheme.state}")
        print(f"   Confidence: {rec.evaluation.confidence} | Ranking Score: {rec.ranking_score}")
        print(f"   Explanation: {rec.evaluation.explanation}")
