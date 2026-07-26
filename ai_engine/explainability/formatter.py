"""
formatter.py — Multi-Format Output Utilities for Eligify Explainability

Formats SchemeExplanation objects into Plain Text, Markdown, or JSON representations
suitable for terminal displays, web dashboards, or API responses.
"""

import json
from typing import Union, Dict, Any
from ai_engine.explainability.explainer import SchemeExplanation
from ai_engine.rules.models import EligibilityResult, Scheme


def _ensure_explanation(
    target: Union[SchemeExplanation, EligibilityResult],
    scheme: Union[Scheme, None] = None
) -> SchemeExplanation:
    """Helper to convert raw EligibilityResult to SchemeExplanation if needed."""
    if isinstance(target, SchemeExplanation):
        return target
    from ai_engine.explainability.explainer import generate_explanation
    return generate_explanation(target, scheme)


def format_as_text(
    explanation_or_eval: Union[SchemeExplanation, EligibilityResult],
    scheme: Union[Scheme, None] = None
) -> str:
    """
    Formats an explanation into a clean, human-readable Plain Text summary.

    Args:
        explanation_or_eval: SchemeExplanation or EligibilityResult instance.
        scheme: Optional Scheme instance (used if EligibilityResult passed).

    Returns:
        str: Multi-line plain text explanation.
    """
    exp = _ensure_explanation(explanation_or_eval, scheme)

    status_str = "ELIGIBLE" if exp.eligible else "INELIGIBLE"
    lines = [
        "================================================================================",
        f" SCHEME EXPLANATION: [{exp.scheme_id}] {exp.scheme_name}",
        "================================================================================",
        f"VERDICT         : {status_str}",
        f"CONFIDENCE      : {int(exp.confidence * 100)}%",
        f"SUMMARY         : {exp.summary}",
        "",
        "--- MATCHED CONDITIONS ---",
    ]

    if exp.matched_conditions:
        for cond in exp.matched_conditions:
            lines.append(f"  [PASS] {cond}")
    else:
        lines.append("  (None)")

    lines.append("")
    lines.append("--- FAILED CONDITIONS ---")
    if exp.failed_conditions:
        for cond in exp.failed_conditions:
            lines.append(f"  [FAIL] {cond}")
    else:
        lines.append("  (None)")

    if exp.benefits:
        lines.append("")
        lines.append(f"BENEFITS        : {exp.benefits}")

    if exp.required_documents:
        lines.append("")
        lines.append("REQUIRED DOCUMENTS:")
        for doc in exp.required_documents:
            lines.append(f"  - {doc}")

    if exp.application_link:
        lines.append("")
        lines.append(f"APPLICATION LINK: {exp.application_link}")

    lines.append("================================================================================")
    return "\n".join(lines)


def format_as_markdown(
    explanation_or_eval: Union[SchemeExplanation, EligibilityResult],
    scheme: Union[Scheme, None] = None
) -> str:
    """
    Formats an explanation into GitHub-flavored Markdown.

    Args:
        explanation_or_eval: SchemeExplanation or EligibilityResult instance.
        scheme: Optional Scheme instance.

    Returns:
        str: Formatted Markdown string.
    """
    exp = _ensure_explanation(explanation_or_eval, scheme)

    badge = "**[ELIGIBLE]**" if exp.eligible else "**[INELIGIBLE]**"
    
    md_lines = [
        f"### [{exp.scheme_id}] {exp.scheme_name}",
        "",
        f"**Status:** {badge}  ",
        f"**Confidence Match:** `{int(exp.confidence * 100)}%`",
        "",
        f"> **Verdict:** {exp.summary}",
        "",
        "#### [PASS] Matched Conditions",
    ]

    if exp.matched_conditions:
        for cond in exp.matched_conditions:
            md_lines.append(f"- {cond}")
    else:
        md_lines.append("- *No conditions matched.*")

    md_lines.append("")
    md_lines.append("#### [FAIL] Failed Conditions")
    if exp.failed_conditions:
        for cond in exp.failed_conditions:
            md_lines.append(f"- {cond}")
    else:
        md_lines.append("- *No conditions failed.*")

    if exp.benefits:
        md_lines.append("")
        md_lines.append(f"#### Benefits\n{exp.benefits}")

    if exp.required_documents:
        md_lines.append("")
        md_lines.append("#### Required Documents")
        for doc in exp.required_documents:
            md_lines.append(f"- [x] {doc}")

    if exp.application_link:
        md_lines.append("")
        md_lines.append(f"**[Official Application Portal Link]({exp.application_link})**")

    return "\n".join(md_lines)


def format_as_json(
    explanation_or_eval: Union[SchemeExplanation, EligibilityResult],
    scheme: Union[Scheme, None] = None,
    indent: int = 2
) -> str:
    """
    Serializes an explanation into a JSON string.

    Args:
        explanation_or_eval: SchemeExplanation or EligibilityResult instance.
        scheme: Optional Scheme instance.
        indent: JSON indentation spaces.

    Returns:
        str: JSON formatted string.
    """
    exp = _ensure_explanation(explanation_or_eval, scheme)
    return exp.model_dump_json(indent=indent)
