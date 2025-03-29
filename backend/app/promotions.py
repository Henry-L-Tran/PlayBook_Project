from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Define the data model for a promotion
class Promotion(BaseModel):
    id: int
    title: str
    description: str
    start_date: str 
    end_date: str
    image_url: str
    is_active: bool

# Creating or updating a promotion
class PromotionCreate(BaseModel):
    title: str
    description: str
    start_date: str
    end_date: str
    image_url: str
    is_active: Optional[bool] = True

# List to store promotions.
promotions: List[Promotion] = [
    Promotion(
        id=1,
        title="25% Payout Boost",
        description="Start the new year boosted! Opt in and get a 25% boost on any winnings for this lineup.",
        start_date="2025-01-01T00:00:00Z",
        end_date="2025-01-02T23:59:00Z",
        image_url="https://example.com/example.png",
        is_active=True
    ),
    Promotion(
        id=2,
        title="$40 Free Entry",
        description="Get that bread with a free entry—just for you.",
        start_date="2025-03-01T00:00:00Z",
        end_date="2025-04-16T21:15:00Z",
        image_url="https://example.com/example.png",
        is_active=True
    )
]

# Endpoint to get all promotions
@app.get("/promotions", response_model=List[Promotion])
def get_promotions():
    return promotions

# Endpoint to get a promotion by its id
@app.get("/promotions/{promo_id}", response_model=Promotion)
def get_promotion(promo_id: int):
    for promo in promotions:
        if promo.id == promo_id:
            return promo
    raise HTTPException(status_code=404, detail="Promotion not found")

# Endpoint to create a new promotion
@app.post("/promotions", response_model=Promotion, status_code=201)
def create_promotion(promo: PromotionCreate):
    new_id = max([p.id for p in promotions], default=0) + 1
    new_promo = Promotion(
        id=new_id,
        title=promo.title,
        description=promo.description,
        start_date=promo.start_date,
        end_date=promo.end_date,
        image_url=promo.image_url,
        is_active=promo.is_active
    )
    promotions.append(new_promo)
    return new_promo

# Endpoint to update an existing promotion
@app.put("/promotions/{promo_id}", response_model=Promotion)
def update_promotion(promo_id: int, promo_update: PromotionCreate):
    for index, promo in enumerate(promotions):
        if promo.id == promo_id:
            updated_promo = Promotion(
                id=promo_id,
                title=promo_update.title,
                description=promo_update.description,
                start_date=promo_update.start_date,
                end_date=promo_update.end_date,
                image_url=promo_update.image_url,
                is_active=promo_update.is_active
            )
            promotions[index] = updated_promo
            return updated_promo
    raise HTTPException(status_code=404, detail="Promotion not found")

# Endpoint to delete a promotion
@app.delete("/promotions/{promo_id}", status_code=204)
def delete_promotion(promo_id: int):
    for index, promo in enumerate(promotions):
        if promo.id == promo_id:
            promotions.pop(index)
            return
    raise HTTPException(status_code=404, detail="Promotion not found")
