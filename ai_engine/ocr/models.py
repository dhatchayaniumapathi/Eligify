"""
models.py — Data Models for Eligify OCR Engine

Defines Pydantic models for Extracted Fields, Raw OCR Results, and Profile Verification Results.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ExtractedField(BaseModel):
    """Represents a single key-value field extracted from document OCR text."""

    field_name: str = Field(..., description="Field identifier (e.g. name, dob, aadhaar_number)")
    field_value: Optional[str] = Field(None, description="Cleaned, extracted field value")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="Extraction confidence rating (0.0 to 1.0)")
    raw_text: Optional[str] = Field(None, description="Original raw snippet before normalization")


class OCRResult(BaseModel):
    """Container holding raw text output and parsed structured fields from document OCR."""

    document_type: str = Field(default="General Document", description="Type of document (e.g. Aadhaar Card, Income Certificate)")
    raw_text: str = Field(..., description="Full unparsed text extracted from the document")
    confidence_score: float = Field(default=0.0, ge=0.0, le=1.0, description="Overall OCR extraction confidence score")
    extracted_fields: Dict[str, ExtractedField] = Field(default_factory=dict, description="Dictionary of parsed field names to ExtractedField models")
    processing_time_ms: float = Field(default=0.0, description="Processing duration in milliseconds")


class VerificationResult(BaseModel):
    """Outcome of cross-referencing OCR extracted fields against user profile attributes."""

    document_type: str = Field(..., description="Document type verified")
    is_verified: bool = Field(..., description="True if document credentials match user profile claims")
    match_score: float = Field(..., ge=0.0, le=1.0, description="Overall verification match confidence score (0.0 to 1.0)")
    matched_fields: List[str] = Field(default_factory=list, description="Fields that matched profile attributes")
    mismatched_fields: List[str] = Field(default_factory=list, description="Fields that failed attribute comparison")
    details: Dict[str, Any] = Field(default_factory=dict, description="Detailed field-by-field comparison audit breakdown")
