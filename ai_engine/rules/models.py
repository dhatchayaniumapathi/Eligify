"""
models.py — Data Models for Eligify Rule Engine

Provides Pydantic models for User Profiles, Government Schemes, and Eligibility Evaluation Results.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class UserProfile(BaseModel):
    """Represents a citizen's profile used for eligibility evaluation."""

    age: int = Field(..., ge=0, le=120, description="Age of the user in years")
    gender: str = Field(..., description="Gender (e.g., Male, Female, Transgender, All)")
    category: str = Field(..., description="Social Category (e.g., General, SC, ST, OBC, Minority, All)")
    annual_income: float = Field(..., ge=0.0, description="Annual family income in INR")
    state: str = Field(..., description="State of residence (e.g., Tamil Nadu, Maharashtra, All)")
    occupation: str = Field(..., description="Primary occupation (e.g., Farmer, Student, Unemployed, Self-Employed, Artisan, Senior Citizen, All)")
    disability: bool = Field(default=False, description="Disability status (True if person has 40%+ benchmark disability)")
    education: str = Field(default="All", description="Educational qualification (e.g., Below 10th, 10th Pass, 12th Pass, Graduate, Post Graduate, Diploma, All)")

    @field_validator("gender", "category", "state", "occupation", "education", mode="before")
    @classmethod
    def sanitize_strings(cls, v: str) -> str:
        """Strip whitespace and normalize string values."""
        if isinstance(v, str):
            return v.strip()
        return str(v)


class Scheme(BaseModel):
    """Represents a government welfare scheme and its eligibility rules."""

    scheme_id: str = Field(..., description="Unique scheme identifier (e.g., SCH001)")
    scheme_name: str = Field(..., description="Official scheme title")
    ministry: str = Field(..., description="Administering Ministry or Department")
    state: str = Field(default="All", description="Target state ('All' for Central schemes)")
    min_age: int = Field(default=0, ge=0, description="Minimum age requirement")
    max_age: int = Field(default=99, le=120, description="Maximum age requirement")
    gender: str = Field(default="All", description="Target gender ('All' if applicable to all)")
    category: str = Field(default="All", description="Target social category ('All' if applicable to all)")
    max_income: float = Field(default=0.0, ge=0.0, description="Maximum annual income threshold (0.0 = no cap)")
    occupation: str = Field(default="All", description="Target occupation ('All' if open to all occupations)")
    disability_required: bool = Field(default=False, description="Whether disability is a mandatory prerequisite")
    education: str = Field(default="All", description="Minimum education qualification requirement")
    benefits: str = Field(default="", description="Detailed summary of scheme benefits")
    required_documents: List[str] = Field(default_factory=list, description="List of required application documents")
    application_link: str = Field(default="", description="Official portal application URL")
    description: str = Field(default="", description="Detailed overview of the scheme")

    @field_validator("required_documents", mode="before")
    @classmethod
    def sanitize_documents(cls, v) -> List[str]:
        """Convert string list or semicolon-separated string into a list of strings."""
        if isinstance(v, str):
            return [doc.strip() for doc in v.split(";") if doc.strip()]
        if isinstance(v, list):
            return [str(doc).strip() for doc in v if str(doc).strip()]
        return []


class EligibilityResult(BaseModel):
    """Structured response containing the evaluation outcome for a scheme."""

    scheme_id: str = Field(..., description="Scheme ID evaluated")
    scheme_name: str = Field(..., description="Scheme title evaluated")
    eligible: bool = Field(..., description="True if user passes all required conditions, False otherwise")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Match confidence score between 0.0 and 1.0")
    matched_conditions: List[str] = Field(default_factory=list, description="List of rules successfully passed")
    failed_conditions: List[str] = Field(default_factory=list, description="List of rules that failed qualification")
    explanation: str = Field(..., description="Detailed human-readable explanation of evaluation verdict")
