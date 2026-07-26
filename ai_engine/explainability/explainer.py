"""
explainer.py — Scheme Eligibility Explainability Core for Eligify

Converts raw EligibilityResult and Scheme objects into a comprehensive, structured
SchemeExplanation model detailing why a citizen is eligible, matched vs failed rules,
confidence metrics, financial benefits, document checklists, and application links.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from ai_engine.rules.models import Scheme, EligibilityResult


class SchemeExplanation(BaseModel):
    """Structured explanation payload detailing an eligibility verdict."""

    scheme_id: str = Field(..., description="Unique scheme identifier")
    scheme_name: str = Field(..., description="Official scheme title")
    eligible: bool = Field(..., description="Eligibility verdict (True/False)")
    confidence: float = Field(..., description="Confidence match score (0.0 to 1.0)")
    summary: str = Field(..., description="High-level human-readable verdict summary")
    matched_conditions: List[str] = Field(default_factory=list, description="Rules successfully passed")
    failed_conditions: List[str] = Field(default_factory=list, description="Rules that failed qualification")
    benefits: str = Field(default="", description="Summary of financial or social benefits provided")
    required_documents: List[str] = Field(default_factory=list, description="Checklist of required verification documents")
    application_link: str = Field(default="", description="Official application portal link")


def generate_explanation(
    evaluation: EligibilityResult,
    scheme: Optional[Scheme] = None
) -> SchemeExplanation:
    """
    Generates a structured, human-readable SchemeExplanation from an EligibilityResult
    and optional Scheme metadata.

    Args:
        evaluation (EligibilityResult): Evaluation result from the Rule Engine.
        scheme (Optional[Scheme]): Corresponding Scheme model containing extra metadata (benefits, documents, link).

    Returns:
        SchemeExplanation: Comprehensive explanation model.
    """
    # Extract metadata from scheme if provided
    benefits = scheme.benefits if scheme else ""
    required_docs = scheme.required_documents if scheme else []
    app_link = scheme.application_link if scheme else ""

    # Build human-readable summary
    total_rules = len(evaluation.matched_conditions) + len(evaluation.failed_conditions)
    passed_count = len(evaluation.matched_conditions)

    if evaluation.eligible:
        summary = (
            f"You are ELIGIBLE for '{evaluation.scheme_name}'. "
            f"Your profile matched all {passed_count} required eligibility criteria with {int(evaluation.confidence * 100)}% confidence."
        )
    else:
        failed_count = len(evaluation.failed_conditions)
        summary = (
            f"You are CURRENTLY INELIGIBLE for '{evaluation.scheme_name}'. "
            f"Your profile matched {passed_count}/{total_rules} criteria, but failed {failed_count} mandatory requirement(s)."
        )

    return SchemeExplanation(
        scheme_id=evaluation.scheme_id,
        scheme_name=evaluation.scheme_name,
        eligible=evaluation.eligible,
        confidence=evaluation.confidence,
        summary=summary,
        matched_conditions=evaluation.matched_conditions,
        failed_conditions=evaluation.failed_conditions,
        benefits=benefits,
        required_documents=required_docs,
        application_link=app_link,
    )


if __name__ == "__main__":
    from ai_engine.rules.models import UserProfile
    from ai_engine.rules.evaluator import evaluate_eligibility
    from ai_engine.explainability.formatter import format_as_text, format_as_markdown, format_as_json

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

    sample_scheme = Scheme(
        scheme_id="SCH012",
        scheme_name="Chief Minister Ladli Behna Yojana",
        ministry="Department of Women and Child Development",
        state="Madhya Pradesh",
        min_age=21,
        max_age=60,
        gender="Female",
        category="All",
        max_income=250000.0,
        occupation="All",
        disability_required=False,
        education="All",
        benefits="Monthly assistance of Rs. 1250",
        required_documents=["Aadhaar Card", "Samagra ID", "Bank Account"],
        application_link="https://cmladlibehna.mp.gov.in/",
        description="State initiative in MP to enhance economic independence of women."
    )

    eval_result = evaluate_eligibility(sample_user, sample_scheme)
    explanation = generate_explanation(eval_result, sample_scheme)

    print("--- PLAIN TEXT FORMAT ---")
    print(format_as_text(explanation))
    
    print("\n--- MARKDOWN FORMAT ---")
    print(format_as_markdown(explanation))

    print("\n--- JSON FORMAT ---")
    print(format_as_json(explanation))

