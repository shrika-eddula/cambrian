from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from pylabrobot.liquid_handling import LiquidHandler
from pylabrobot.resources import Plate96, Well, TipRack, Resource

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store resources and liquid handler state
resources: Dict[str, Resource] = {}
liquid_handler = None

class ResourceConfig(BaseModel):
    type: str
    name: str
    position: Dict[str, float]

class Protocol(BaseModel):
    steps: List[Dict[str, Any]]

@app.post("/initialize")
async def initialize_handler():
    global liquid_handler
    try:
        # Initialize with simulation mode for now
        liquid_handler = LiquidHandler(simulate=True)
        await liquid_handler.setup()
        return {"status": "success", "message": "Liquid handler initialized"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add-resource")
async def add_resource(config: ResourceConfig):
    global resources
    try:
        if config.type == "plate96":
            resource = Plate96(name=config.name)
        elif config.type == "tiprack":
            resource = TipRack(name=config.name)
        else:
            raise HTTPException(status_code=400, detail="Unsupported resource type")
        
        resources[config.name] = resource
        if liquid_handler:
            liquid_handler.deck.assign_child_resource(
                resource,
                location=(config.position["x"], config.position["y"], config.position["z"])
            )
        return {"status": "success", "message": f"Added {config.type}: {config.name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-protocol")
async def run_protocol(protocol: Protocol):
    if not liquid_handler:
        raise HTTPException(status_code=400, detail="Liquid handler not initialized")
    
    try:
        for step in protocol.steps:
            # Execute each step based on its type
            if step["type"] == "transfer":
                source = resources[step["source"]].get_well(step["source_well"])
                target = resources[step["target"]].get_well(step["target_well"])
                await liquid_handler.transfer(
                    source=source,
                    target=target,
                    volume=step["volume"]
                )
        return {"status": "success", "message": "Protocol executed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resources")
async def get_resources():
    return {
        "resources": [
            {
                "name": name,
                "type": resource.__class__.__name__,
                "position": resource.get_absolute_location()
            }
            for name, resource in resources.items()
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
