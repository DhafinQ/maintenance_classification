from fastapi import FastAPI, HTTPException
# from schemas.predict_schema import PredictRequest, PredictResponse
# from services.ml_service import predict_failure
from routes.init import api_router

app = FastAPI(
    title="Machine Maintenance Classifier API",
    description="API untuk memprediksi kondisi mesin (rusak/tidak rusak)",
    version="1.0.0",
)

app.include_router(api_router)

def root():
    return {"message": "Welcome to Machine Maintenance API!"}
# @app.get("/health")
# def health_check():
#     return {"status": "OK"}

# @app.post("/predict", response_model=PredictResponse)
# def predict_endpoint(request: PredictRequest):
#     try:
#         result = predict_failure(request.dict())
#         return PredictResponse(**result)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Terjadi kesalahan: {e}")
