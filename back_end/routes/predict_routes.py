from fastapi import APIRouter, UploadFile, File
import joblib
import pandas as pd

router = APIRouter(prefix="/predict", tags=["Prediction"])

model = None  # nanti load .pkl di sini

# @router.on_event("startup")
# def load_model():
#     global model
#     model = joblib.load("models/pkl/your_model.pkl")

# @router.post("/")
# async def predict(file: UploadFile = File(...)):
#     df = pd.read_csv(file.file)
#     predictions = model.predict(df)
#     df["prediction"] = predictions.tolist()
#     return df.to_dict(orient="records")
