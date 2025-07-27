from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, HttpUrl
from pathlib import Path
from typing import List, Union
import requests
from fastapi.responses import StreamingResponse
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from utilities.data_load_func import load_json, save_json
import json
import os
# import modules to return a cleaner error responsewith CORS headers:
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# amended data directory path to fall back to a relative path if DATA_DIR isn’t set:
DEFAULT_DATA_DIR = Path(__file__).resolve().parents[2] / "data"
DATA_DIR = Path(os.getenv("DATA_DIR", DEFAULT_DATA_DIR))
PLANETS_PATH = DATA_DIR / "planets.json"
MISSIONS_PATH = DATA_DIR / "missions.json"

class Planet(BaseModel):
    id: int = Field(..., gt=0)
    name: str = Field(..., min_length=2, max_length=20)
    img_url: HttpUrl
    facts: List[str] = Field(..., min_items=1)
    diameter_km: Union[int, None] = Field(None, ge=0)
    distance_from_sun_km: Union[int, None] = Field(None, ge=0, lt=5000000000)
    mass_earths: Union[float, None] = Field(None, ge=0.0, lt=1000.0)
    orbital_period_days: Union[int, None] = Field(None, ge=0)
    orbital_period_years: Union[float, None] = Field(None, ge=0.0)
    moons: Union[int, None] = Field(None, ge=0, le=100)


class PlanetCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=20)
    img_url: HttpUrl
    facts: List[str] = Field(..., min_items=1)
    diameter_km: Union[int, None] = None
    distance_from_sun_km: Union[int, None] = None
    mass_earths: Union[float, None] = None
    orbital_period_days: Union[int, None] = None
    orbital_period_years: Union[float, None] = None
    moons: Union[int, None] = None

@app.get("/planets", response_model=List[Planet])
def get_planets():
    # print(f"PLANETS_PATH: {PLANETS_PATH}")
    data = load_json(PLANETS_PATH)
    # print(f"data: {json.dumps(data, indent=2, ensure_ascii=False)}")
    return data

@app.get("/planets/{planet_id}", response_model=Planet, status_code=201)
def get_planet_by_id(planet_id: int):
    planets = load_json(PLANETS_PATH)
    for planet in planets:
        if planet['id'] == planet_id:
            return planet
    raise HTTPException(status_code=404, detail="Planet not found")


@app.post("/planets", response_model=Planet, status_code=201)
def add_planet(new_data: PlanetCreate):
    all_planets = load_json(PLANETS_PATH)
    last_id = 0
    for planet in all_planets:
        if planet["id"] > last_id:
            last_id = planet["id"]
    new_id = last_id + 1
    new_planet = Planet(id=new_id, **new_data.model_dump())
    # print(f"new_planet: {new_planet}")
    # print(new_data.model_dump())
    all_planets.append(new_planet.model_dump(mode="json"))
    save_json(PLANETS_PATH, all_planets)
    return new_planet

# Katinka's method
# @app.post("/planets", response_model=Planet, status_code=201)
# def add_planet(new_data: PlanetCreate):
#     """ fdfff"""
#     df=app.state.planets_df.copy()
#     neue_id= next(i for i, j in zip(range(1, len(df) + 2), df["id"].values) if i != j)
#     p_dic=new_data.model_dump(mode="json")
#     p_dic['id']=neue_id
#     new_planet = pd.DataFrame([p_dic])
#     df=pd.concat([df,new_planet])
#     app.state.planets_df=df.sort_values(by="id")
#     # write_dataframe()   # Katinka#s eigene Funktion
#     new_planet=new_planet.to_dict(orient="records")
#     return Planet(**new_planet[0])

    
@app.put("/planets/{planet_id}", response_model=Planet)
def update_planet(planet_id: int, updated_data: PlanetCreate):
    planets = load_json(PLANETS_PATH)
    for idx, planet in enumerate(planets):
        if planet["id"] == planet_id:
            updated_planet = Planet(id=planet_id, **updated_data.model_dump())
            # print(f"idx: {idx}")
            planets[idx] = updated_planet.model_dump(mode='json')
            save_json(PLANETS_PATH, planets)
            return updated_planet
    raise HTTPException(status_code=404, detail="Planet not found")

@app.get("/planets/{planet_id}/image")
def get_planet_image(planet_id: int):
    planets = load_json(PLANETS_PATH)
    planet = None
    for planet_loop in planets:
        if planet_loop["id"] == planet_id:
            planet = planet_loop
    
    if planet is None:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    try:
        response = requests.get(
            planet["img_url"],
            stream=True,
            timeout=10,
            headers={"User-Agent": "Mozilla/5.0"},
            allow_redirects=True
        )
        response.raise_for_status()
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Image could not be retrieved")
    
    content_typ = response.headers.get("Content-Type", "image/jpeg")
    headers = {
        "Access-Control-Allow-Origin": "*"
    }
    return StreamingResponse(response.raw, media_type=content_typ, headers=headers)
    
@app.delete("/planets/{planet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_planet(planet_id: int):
    planets = load_json(PLANETS_PATH)
    
    updated_planets = []
    found = False
    
    for planet in planets:
        if planet["id"] != planet_id:
            updated_planets.append(planet)
        else:
            found = True
    
    if not found:
        raise HTTPException(status_code=404, detail="Planet not found")
    
    save_json(PLANETS_PATH, updated_planets)
    return

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors()}),
        headers={"Access-Control-Allow-Origin": "http://localhost:5173"},
    )