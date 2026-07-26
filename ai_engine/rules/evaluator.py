"""
evaluator.py — Rule-Based Eligibility Evaluator Core

Main evaluation logic that takes a UserProfile and a Scheme object, runs all condition matchers,
calculates match confidence, and returns a structured EligibilityResult.
"""

from typing import List, Dict, Any
from ai_engine.rules.models import UserProfile, Scheme, EligibilityResult
from ai_engine.rules.exceptions import InvalidProfileError, InvalidSchemeError, EvaluationError
from ai_engine.rules.condition_matchers import (
    match_age,
    match_gender,
    match_category,
    match_income,
    match_state,
    match_occupation,
    match_disability,
    match_education,
)


def evaluate_eligibility(user_profile: UserProfile, scheme: Scheme) -> EligibilityResult:
    """
    Evaluates a UserProfile against a single Scheme's eligibility criteria.

    Args:
        user_profile (UserProfile): Validated user profile model.
        scheme (Scheme): Validated government scheme model.

    Returns:
        EligibilityResult: Contains eligibility status (bool), confidence score (0.0 to 1.0),
                           matched conditions, failed conditions, and explanation summary.

    Raises:
        InvalidProfileError: If user_profile is invalid or None.
        InvalidSchemeError: If scheme is invalid or None.
        EvaluationError: If an unexpected execution error occurs.
    """
    if not isinstance(user_profile, UserProfile):
        raise InvalidProfileError("Invalid user profile provided for evaluation.")
    
    if not isinstance(scheme, Scheme):
        raise InvalidSchemeError("Invalid scheme provided for evaluation.")

    try:
        matched_conditions: List[str] = []
        failed_conditions: List[str] = []

        # List of rules to execute: (rule_name, matcher_function_call)
        rule_evaluations = [
            ("Age Check", match_age(user_profile.age, scheme.min_age, scheme.max_age)),
            ("Gender Check", match_gender(user_profile.gender, scheme.gender)),
            ("Category Check", match_category(user_profile.category, scheme.category)),
            ("Income Check", match_income(user_profile.annual_income, scheme.max_income)),
            ("State Jurisdiction Check", match_state(user_profile.state, scheme.state)),
            ("Occupation Check", match_occupation(user_profile.occupation, scheme.occupation, user_profile.age)),
            ("Disability Check", match_disability(user_profile.disability, scheme.disability_required)),
            ("Education Check", match_education(user_profile.education, scheme.education)),
        ]

        for rule_name, (passed, detail) in rule_evaluations:
            entry = f"[{rule_name}]: {detail}"
            if passed:
                matched_conditions.append(entry)
            else:
                failed_conditions.append(entry)

        total_rules = len(rule_evaluations)
        passed_rules = len(matched_conditions)
        
        # Calculate confidence score as proportion of matched rules
        confidence = round(passed_rules / total_rules, 2)
        eligible = len(failed_conditions) == 0

        # Construct explanation summary
        if eligible:
            explanation = (
                f"User qualifies for '{scheme.scheme_name}'! "
                f"All {passed_rules}/{total_rules} eligibility criteria were satisfied successfully."
            )
        else:
            failed_names = [f.split("]")[0].replace("[", "") for f in failed_conditions]
            explanation = (
                f"User does NOT qualify for '{scheme.scheme_name}'. "
                f"Passed {passed_rules}/{total_rules} rules. Failed criteria: {', '.join(failed_names)}."
            )

        return EligibilityResult(
            scheme_id=scheme.scheme_id,
            scheme_name=scheme.scheme_name,
            eligible=eligible,
            confidence=confidence,
            matched_conditions=matched_conditions,
            failed_conditions=failed_conditions,
            explanation=explanation,
        )

    except Exception as e:
        if isinstance(e, (InvalidProfileError, InvalidSchemeError)):
            raise e
        raise EvaluationError(f"Unexpected error during eligibility evaluation: {str(e)}") from e


if __name__ == "__main__":
    # Self-test demonstration
    sample_user = UserProfile(
        age=28,
        gender="Female",
        category="General",
        annual_income=180000.0,
        state="Tamil Nadu",
        occupation="Self-Employed",
        disability=False,
        education="Graduate"
    )

    sample_scheme = Scheme(
        scheme_id="SCH011",
        scheme_name="Kalaignar Magalir Urimai Thittam",
        ministry="Department of Special Programme Implementation",
        state="Tamil Nadu",
        min_age=21,
        max_age=65,
        gender="Female",
        category="All",
        max_income=250000.0,
        occupation="All",
        disability_required=False,
        education="All",
        benefits="Monthly financial assistance of Rs. 1000",
        required_documents=["Aadhaar Card", "Ration Card"],
        application_link="https://kmut.tn.gov.in/",
        description="Tamil Nadu flagship scheme empowering women heads of families."
    )

    res = evaluate_eligibility(sample_user, sample_scheme)
    print(f"Scheme ID: {res.scheme_id}")
    print(f"Eligible: {res.eligible}")
    print(f"Confidence: {res.confidence}")
    print(f"Explanation: {res.explanation}")
