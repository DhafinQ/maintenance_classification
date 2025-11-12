from fastapi import APIRouter
from routes.machine_routes import router as machine_router
from routes.production_routes import router as production_router
from routes.log_routes import router as log_router
from routes.predict_routes import router as predict_router
from routes.auth_routes import router as auth_router

api_router = APIRouter()
api_router.include_router(machine_router)
api_router.include_router(production_router)
api_router.include_router(log_router)
api_router.include_router(predict_router)
api_router.include_router(auth_router)
