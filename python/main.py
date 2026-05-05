from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from routers import chat, insights, p2p, market, history
import models
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cryptofy AI Brain", description="The AI Intelligence Engine for Cryptofy Wallet")

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

app.include_router(chat.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(p2p.router, prefix="/api")
app.include_router(market.router, prefix="/api")
app.include_router(history.router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
