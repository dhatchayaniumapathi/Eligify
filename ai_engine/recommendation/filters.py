"""
filters.py — Recommendation Filtering Module for Eligify

Provides reusable, modular filter functions to filter recommended scheme results
by State, Ministry, Occupation, Gender, Social Category, and Disability prerequisites.
"""

from typing import List, Optional
from ai_engine.recommendation.ranking import RecommendedScheme


def filter_by_state(
    recommendations: List[RecommendedScheme], target_state: str
) -> List[RecommendedScheme]:
    """Filters recommendations by target state jurisdiction (includes central 'All' schemes)."""
    if not target_state or target_state.strip().lower() in ("all", "any"):
        return recommendations

    st = target_state.strip().lower()
    return [
        rec for rec in recommendations
        if rec.scheme.state.strip().lower() in (st, "all", "central", "pan-india", "india")
    ]


def filter_by_ministry(
    recommendations: List[RecommendedScheme], target_ministry: str
) -> List[RecommendedScheme]:
    """Filters recommendations by administering ministry or department name substring."""
    if not target_ministry or target_ministry.strip().lower() in ("all", "any"):
        return recommendations

    min_query = target_ministry.strip().lower()
    return [
        rec for rec in recommendations
        if min_query in rec.scheme.ministry.strip().lower()
    ]


def filter_by_occupation(
    recommendations: List[RecommendedScheme], target_occupation: str
) -> List[RecommendedScheme]:
    """Filters recommendations by target occupation."""
    if not target_occupation or target_occupation.strip().lower() in ("all", "any"):
        return recommendations

    occ = target_occupation.strip().lower()
    return [
        rec for rec in recommendations
        if rec.scheme.occupation.strip().lower() in (occ, "all", "any")
    ]


def filter_by_gender(
    recommendations: List[RecommendedScheme], target_gender: str
) -> List[RecommendedScheme]:
    """Filters recommendations by target gender."""
    if not target_gender or target_gender.strip().lower() in ("all", "any"):
        return recommendations

    gen = target_gender.strip().lower()
    return [
        rec for rec in recommendations
        if rec.scheme.gender.strip().lower() in (gen, "all", "any", "both")
    ]


def filter_by_category(
    recommendations: List[RecommendedScheme], target_category: str
) -> List[RecommendedScheme]:
    """Filters recommendations by social category."""
    if not target_category or target_category.strip().lower() in ("all", "any"):
        return recommendations

    cat = target_category.strip().lower()
    return [
        rec for rec in recommendations
        if rec.scheme.category.strip().lower() in (cat, "all", "any")
    ]


def filter_by_disability(
    recommendations: List[RecommendedScheme], disability_status: bool
) -> List[RecommendedScheme]:
    """
    Filters recommendations by disability requirement.
    If user does not have a disability, filters out schemes requiring mandatory disability.
    """
    if disability_status:
        # User has disability: keep all schemes
        return recommendations

    # User does not have disability: filter out disability-mandatory schemes
    return [rec for rec in recommendations if not rec.scheme.disability_required]


def apply_filters(
    recommendations: List[RecommendedScheme],
    state: Optional[str] = None,
    ministry: Optional[str] = None,
    occupation: Optional[str] = None,
    gender: Optional[str] = None,
    category: Optional[str] = None,
    disability: Optional[bool] = None,
) -> List[RecommendedScheme]:
    """
    Applies a chain of specified filters sequentially onto a recommendation list.

    Args:
        recommendations (List[RecommendedScheme]): Initial list of recommendations.
        state (Optional[str]): State filter query.
        ministry (Optional[str]): Ministry filter query.
        occupation (Optional[str]): Occupation filter query.
        gender (Optional[str]): Gender filter query.
        category (Optional[str]): Category filter query.
        disability (Optional[bool]): Disability status filter flag.

    Returns:
        List[RecommendedScheme]: Filtered list of recommendations.
    """
    filtered = recommendations

    if state:
        filtered = filter_by_state(filtered, state)
    if ministry:
        filtered = filter_by_ministry(filtered, ministry)
    if occupation:
        filtered = filter_by_occupation(filtered, occupation)
    if gender:
        filtered = filter_by_gender(filtered, gender)
    if category:
        filtered = filter_by_category(filtered, category)
    if disability is not None:
        filtered = filter_by_disability(filtered, disability)

    return filtered
