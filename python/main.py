from fastapi import FastAPI
from routers import chat, insights, p2p
from . import models
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cryptofy AI Brain")

app.include_router(chat.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(p2p.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
