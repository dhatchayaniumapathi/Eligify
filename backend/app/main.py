# FastAPI Main Entry Point Placeholder
# Business logic to be implemented

from fastapi import FastAPI

app = FastAPI(
    title="Eligify API",
    description="AI-Powered Government Scheme Eligibility & Recommendation Platform API",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"message": "Eligify API Service running."}
