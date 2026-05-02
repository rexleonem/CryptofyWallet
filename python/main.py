from fastapi import FastAPI
from routers import chat, insights

app = FastAPI(title="Cryptofy AI Brain")

app.include_router(chat.router, prefix="/api")
app.include_router(insights.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
