"""
ranking.py — Recommendation Ranking & Scoring Module for Eligify

Ranks evaluated government scheme recommendations using a composite score based on:
1. Eligibility match confidence (0.0 to 1.0)
2. Number of matched criteria conditions
3. Penalty for failed criteria conditions
4. Domain-specific priority boosts (e.g. State preference, financial benefit tier)
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from ai_engine.rules.models import Scheme, EligibilityResult


class RecommendedScheme(BaseModel):
    """Container holding scheme details, evaluation output, and calculated ranking scores."""

    scheme: Scheme = Field(..., description="Target government scheme object")
    evaluation: EligibilityResult = Field(..., description="Evaluation outcome from rule engine")
    priority_score: float = Field(default=0.0, description="Additional priority boost score")
    ranking_score: float = Field(default=0.0, description="Final aggregated score used for ranking sorting")


def calculate_ranking_score(
    scheme: Scheme,
    evaluation: EligibilityResult,
    user_state: Optional[str] = None,
    custom_priority_boost: float = 0.0,
) -> float:
    """
    Computes a composite numerical ranking score for a scheme evaluation.

    Scoring Weight Formula:
    - Base confidence score (weight: 50.0)
    - Matched conditions count (weight: +10.0 per condition)
    - Failed conditions penalty (weight: -20.0 per failed condition)
    - User home-state match bonus (+15.0 score boost for state-specific local schemes)
    - Custom priority boost (+ custom_priority_boost)

    Args:
        scheme (Scheme): Scheme object being evaluated.
        evaluation (EligibilityResult): Output from eligibility evaluation.
        user_state (Optional[str]): User's state of residence for local scheme preference.
        custom_priority_boost (float): Optional extra score adjustment.

    Returns:
        float: Calculated composite score rounded to 2 decimal places.
    """
    base_confidence_points = evaluation.confidence * 50.0
    matched_count_points = len(evaluation.matched_conditions) * 10.0
    failed_penalty_points = len(evaluation.failed_conditions) * 20.0

    state_bonus = 0.0
    if user_state and scheme.state.strip().lower() == user_state.strip().lower():
        state_bonus = 15.0

    total_score = (
        base_confidence_points
        + matched_count_points
        - failed_penalty_points
        + state_bonus
        + custom_priority_boost
    )

    return round(total_score, 2)


def rank_recommendations(
    evaluated_pairs: List[tuple[Scheme, EligibilityResult]],
    user_state: Optional[str] = None,
    priority_map: Optional[Dict[str, float]] = None,
) -> List[RecommendedScheme]:
    """
    Ranks evaluated scheme pairs from highest score (best match) to lowest score.

    Args:
        evaluated_pairs (List[tuple[Scheme, EligibilityResult]]): List of (Scheme, EligibilityResult) tuples.
        user_state (Optional[str]): Optional user state for location preference scoring.
        priority_map (Optional[Dict[str, float]]): Mapping of scheme_id -> custom priority boost float.

    Returns:
        List[RecommendedScheme]: Sorted list of RecommendedScheme objects in descending order of ranking_score.
    """
    priority_map = priority_map or {}
    recommendations: List[RecommendedScheme] = []

    for scheme, eval_res in evaluated_pairs:
        p_boost = priority_map.get(scheme.scheme_id, 0.0)
        score = calculate_ranking_score(scheme, eval_res, user_state=user_state, custom_priority_boost=p_boost)
        
        rec = RecommendedScheme(
            scheme=scheme,
            evaluation=eval_res,
            priority_score=p_boost,
            ranking_score=score,
        )
        recommendations.append(rec)

    # Sort descending by ranking_score, secondary sort by confidence
    recommendations.sort(key=lambda r: (r.ranking_score, r.evaluation.confidence), reverse=True)
    return recommendations
