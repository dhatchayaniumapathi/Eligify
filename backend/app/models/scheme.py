from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.core.database import Base

class Scheme(Base):
    """
    SQLAlchemy model representing a government scheme.
    """
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    benefits = Column(Text, nullable=True)
    required_documents = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Scheme(id={self.id}, scheme_name='{self.scheme_name}')>"
