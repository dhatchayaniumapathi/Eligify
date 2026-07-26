"""
condition_matchers.py — Modular Rule Matchers for Eligify

Provides granular, reusable condition evaluation functions for individual profile criteria.
Each matcher returns a tuple of (matched: bool, explanation_reason: str).
"""

from typing import Tuple

EDUCATION_HIERARCHY = {
    "all": 0,
    "any": 0,
    "below 10th": 1,
    "10th pass": 2,
    "12th pass": 3,
    "diploma": 4,
    "graduate": 5,
    "post graduate": 6,
}


def match_age(user_age: int, min_age: int, max_age: int) -> Tuple[bool, str]:
    """Evaluates age against min_age and max_age bounds."""
    if min_age <= user_age <= max_age:
        return True, f"Age ({user_age} yrs) is within eligible range ({min_age}-{max_age} yrs)."
    return False, f"Age ({user_age} yrs) is outside eligible range ({min_age}-{max_age} yrs)."


def match_gender(user_gender: str, scheme_gender: str) -> Tuple[bool, str]:
    """Evaluates gender compatibility."""
    u_gen = str(user_gender).strip().lower()
    s_gen = str(scheme_gender).strip().lower()

    if s_gen in ("all", "any", "both") or u_gen in ("all", "any"):
        return True, f"Gender requirement '{scheme_gender}' is open to all applicants."
    if u_gen == s_gen:
        return True, f"Gender '{user_gender}' matches target requirement."
    return False, f"Gender '{user_gender}' does not match scheme target '{scheme_gender}'."


def match_category(user_category: str, scheme_category: str) -> Tuple[bool, str]:
    """Evaluates social category compatibility."""
    u_cat = str(user_category).strip().lower()
    s_cat = str(scheme_category).strip().lower()

    if s_cat in ("all", "any") or u_cat in ("all", "any"):
        return True, f"Category requirement '{scheme_category}' is open to all social categories."
    if u_cat == s_cat:
        return True, f"Category '{user_category}' matches scheme target category."
    return False, f"Category '{user_category}' does not match target category '{scheme_category}'."


def match_income(user_income: float, max_income: float) -> Tuple[bool, str]:
    """Evaluates annual family income against maximum ceiling."""
    if max_income <= 0.0:
        return True, "No maximum annual income cap for this scheme."
    if user_income <= max_income:
        return True, f"Annual income (₹{user_income:,.2f}) is within maximum ceiling of ₹{max_income:,.2f}."
    return False, f"Annual income (₹{user_income:,.2f}) exceeds maximum threshold of ₹{max_income:,.2f}."


def match_state(user_state: str, scheme_state: str) -> Tuple[bool, str]:
    """Evaluates jurisdiction/state compatibility."""
    u_st = str(user_state).strip().lower()
    s_st = str(scheme_state).strip().lower()

    if s_st in ("all", "central", "pan-india", "india") or u_st in ("all", "any"):
        return True, f"Scheme state '{scheme_state}' is applicable pan-India."
    if u_st == s_st:
        return True, f"State '{user_state}' matches scheme jurisdiction."
    return False, f"State '{user_state}' does not match scheme state '{scheme_state}'."


def match_occupation(user_occupation: str, scheme_occupation: str, user_age: int = 0) -> Tuple[bool, str]:
    """Evaluates occupation eligibility with support for special categories (e.g. Senior Citizen)."""
    u_occ = str(user_occupation).strip().lower()
    s_occ = str(scheme_occupation).strip().lower()

    if s_occ in ("all", "any") or u_occ in ("all", "any"):
        return True, f"Occupation requirement '{scheme_occupation}' is open to all professions."
    
    if u_occ == s_occ:
        return True, f"Occupation '{user_occupation}' matches scheme target requirement."

    # Special handling: Senior Citizen rule
    if s_occ == "senior citizen" and (u_occ == "senior citizen" or user_age >= 60):
        return True, "Applicant qualifies under Senior Citizen criteria."

    return False, f"Occupation '{user_occupation}' does not match target occupation '{scheme_occupation}'."


def match_disability(user_disability: bool, disability_required: bool) -> Tuple[bool, str]:
    """Evaluates benchmark disability requirement."""
    if not disability_required:
        return True, "No disability prerequisite required for this scheme."
    if disability_required and user_disability:
        return True, "User meets mandatory disability requirement (40%+)."
    return False, "Scheme requires benchmark disability status (40%+)."


def match_education(user_education: str, scheme_education: str) -> Tuple[bool, str]:
    """Evaluates educational qualification level against scheme minimum standard."""
    u_edu = str(user_education).strip().lower()
    s_edu = str(scheme_education).strip().lower()

    if s_edu in ("all", "any") or u_edu in ("all", "any"):
        return True, f"Education requirement '{scheme_education}' is open to all educational levels."

    user_rank = EDUCATION_HIERARCHY.get(u_edu, 0)
    scheme_rank = EDUCATION_HIERARCHY.get(s_edu, 0)

    if user_rank >= scheme_rank and user_rank > 0:
        return True, f"Education '{user_education}' meets or exceeds requirement '{scheme_education}'."
    return False, f"Education '{user_education}' does not meet minimum requirement '{scheme_education}'."
