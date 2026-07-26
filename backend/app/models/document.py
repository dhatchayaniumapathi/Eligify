from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Document(Base):
    """
    SQLAlchemy model representing a user uploaded document.
    """
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    verification_status = Column(String(50), default="Pending")
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Note: Requires the 'documents' relationship to be defined on the User model
    user = relationship("User", back_populates="documents")

    def __repr__(self):
        return f"<Document(id={self.id}, filename='{self.filename}', verification_status='{self.verification_status}')>"
