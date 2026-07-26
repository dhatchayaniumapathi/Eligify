"""
exceptions.py — Custom Exceptions for Eligify Rule Engine

Defines exception hierarchy for profile validation, scheme definition errors, and evaluation failures.
"""


class EligibilityEngineError(Exception):
    """Base exception for all errors originating from the Eligibility Engine."""
    pass


class InvalidProfileError(EligibilityEngineError):
    """Raised when a UserProfile contains missing, malformed, or out-of-range attributes."""
    pass


class InvalidSchemeError(EligibilityEngineError):
    """Raised when a Scheme definition contains missing or invalid rule criteria."""
    pass


class EvaluationError(EligibilityEngineError):
    """Raised when an unexpected error occurs during rule evaluation processing."""
    pass
