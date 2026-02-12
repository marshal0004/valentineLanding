from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from PIL import Image
import io
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Upload directory
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Pydantic Models ---

class SectionCreate(BaseModel):
    section_type: str = "memory"
    order: int = 1
    title: str = ""
    caption: str = ""
    animation_style: str = "Floating Polaroids"

class SectionUpdate(BaseModel):
    section_type: Optional[str] = None
    order: Optional[int] = None
    title: Optional[str] = None
    caption: Optional[str] = None
    animation_style: Optional[str] = None

class SectionResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    section_type: str
    order: int
    title: str
    caption: str
    background_photo: str
    overlay_photos: List[str]
    animation_style: str
    created_at: str
    updated_at: str

class SettingsUpdate(BaseModel):
    couple_names: Optional[str] = None
    relationship_start_date: Optional[str] = None
    password: Optional[str] = None
    love_letter_text: Optional[str] = None
    intro_title: Optional[str] = None
    intro_subtitle: Optional[str] = None
    is_published: Optional[bool] = None

class SettingsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    couple_names: str
    relationship_start_date: str
    password: str
    background_music_file: str
    love_letter_text: str
    intro_title: str
    intro_subtitle: str
    is_published: bool

class PasswordVerify(BaseModel):
    password: str

# --- Helper Functions ---

def compress_image(file_bytes: bytes, max_width: int = 1920, quality: int = 80) -> bytes:
    """Compress image using Pillow"""
    try:
        img = Image.open(io.BytesIO(file_bytes))
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.LANCZOS)
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        return output.getvalue()
    except Exception as e:
        logger.error(f"Image compression failed: {e}")
        return file_bytes

async def save_upload(file: UploadFile, prefix: str = "") -> str:
    """Save uploaded file and return filename"""
    ext = Path(file.filename).suffix.lower()
    filename = f"{prefix}{uuid.uuid4().hex}{ext}"
    file_bytes = await file.read()
    
    if ext in ['.jpg', '.jpeg', '.png', '.webp']:
        file_bytes = compress_image(file_bytes)
        filename = f"{prefix}{uuid.uuid4().hex}.jpg"
    
    filepath = UPLOAD_DIR / filename
    with open(filepath, 'wb') as f:
        f.write(file_bytes)
    return filename

def section_to_response(doc: dict) -> dict:
    """Convert MongoDB doc to response dict"""
    return {
        "id": doc.get("id", ""),
        "section_type": doc.get("section_type", "memory"),
        "order": doc.get("order", 0),
        "title": doc.get("title", ""),
        "caption": doc.get("caption", ""),
        "background_photo": doc.get("background_photo", ""),
        "overlay_photos": doc.get("overlay_photos", []),
        "animation_style": doc.get("animation_style", ""),
        "created_at": doc.get("created_at", ""),
        "updated_at": doc.get("updated_at", ""),
    }

def settings_to_response(doc: dict) -> dict:
    """Convert MongoDB settings doc to response dict"""
    return {
        "id": doc.get("id", ""),
        "couple_names": doc.get("couple_names", ""),
        "relationship_start_date": doc.get("relationship_start_date", ""),
        "password": doc.get("password", ""),
        "background_music_file": doc.get("background_music_file", ""),
        "love_letter_text": doc.get("love_letter_text", ""),
        "intro_title": doc.get("intro_title", ""),
        "intro_subtitle": doc.get("intro_subtitle", ""),
        "is_published": doc.get("is_published", False),
    }

# --- Section Routes ---

@api_router.get("/sections", response_model=List[SectionResponse])
async def get_sections():
    docs = await db.sections.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return [section_to_response(d) for d in docs]

@api_router.get("/sections/{section_id}", response_model=SectionResponse)
async def get_section(section_id: str):
    doc = await db.sections.find_one({"id": section_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Section not found")
    return section_to_response(doc)

@api_router.post("/sections", response_model=SectionResponse)
async def create_section(data: SectionCreate):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "section_type": data.section_type,
        "order": data.order,
        "title": data.title,
        "caption": data.caption,
        "background_photo": "",
        "overlay_photos": [],
        "animation_style": data.animation_style,
        "created_at": now,
        "updated_at": now,
    }
    await db.sections.insert_one(doc)
    return section_to_response(doc)

@api_router.put("/sections/{section_id}", response_model=SectionResponse)
async def update_section(section_id: str, data: SectionUpdate):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.sections.find_one_and_update(
        {"id": section_id},
        {"$set": update_data},
        return_document=True,
        projection={"_id": 0}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Section not found")
    return section_to_response(result)

@api_router.delete("/sections/{section_id}")
async def delete_section(section_id: str):
    doc = await db.sections.find_one({"id": section_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Section not found")
    # Delete associated files
    if doc.get("background_photo"):
        fpath = UPLOAD_DIR / doc["background_photo"]
        if fpath.exists():
            fpath.unlink()
    for photo in doc.get("overlay_photos", []):
        fpath = UPLOAD_DIR / photo
        if fpath.exists():
            fpath.unlink()
    await db.sections.delete_one({"id": section_id})
    return {"message": "Section deleted"}

@api_router.post("/sections/{section_id}/background", response_model=SectionResponse)
async def upload_background(section_id: str, file: UploadFile = File(...)):
    doc = await db.sections.find_one({"id": section_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Section not found")
    # Delete old background
    if doc.get("background_photo"):
        old_path = UPLOAD_DIR / doc["background_photo"]
        if old_path.exists():
            old_path.unlink()
    filename = await save_upload(file, prefix="bg_")
    result = await db.sections.find_one_and_update(
        {"id": section_id},
        {"$set": {"background_photo": filename, "updated_at": datetime.now(timezone.utc).isoformat()}},
        return_document=True,
        projection={"_id": 0}
    )
    return section_to_response(result)

@api_router.post("/sections/{section_id}/photos", response_model=SectionResponse)
async def upload_overlay_photos(section_id: str, files: List[UploadFile] = File(...)):
    doc = await db.sections.find_one({"id": section_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Section not found")
    current_photos = doc.get("overlay_photos", [])
    if len(current_photos) + len(files) > 4:
        raise HTTPException(status_code=400, detail="Maximum 4 overlay photos allowed")
    new_photos = []
    for f in files:
        filename = await save_upload(f, prefix="overlay_")
        new_photos.append(filename)
    all_photos = current_photos + new_photos
    result = await db.sections.find_one_and_update(
        {"id": section_id},
        {"$set": {"overlay_photos": all_photos, "updated_at": datetime.now(timezone.utc).isoformat()}},
        return_document=True,
        projection={"_id": 0}
    )
    return section_to_response(result)

@api_router.delete("/sections/{section_id}/photos/{photo_index}")
async def delete_overlay_photo(section_id: str, photo_index: int):
    doc = await db.sections.find_one({"id": section_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Section not found")
    photos = doc.get("overlay_photos", [])
    if photo_index < 0 or photo_index >= len(photos):
        raise HTTPException(status_code=400, detail="Invalid photo index")
    photo_file = photos[photo_index]
    fpath = UPLOAD_DIR / photo_file
    if fpath.exists():
        fpath.unlink()
    photos.pop(photo_index)
    await db.sections.update_one(
        {"id": section_id},
        {"$set": {"overlay_photos": photos, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Photo deleted"}

# --- Settings Routes ---

@api_router.get("/settings", response_model=SettingsResponse)
async def get_settings():
    doc = await db.settings.find_one({}, {"_id": 0})
    if not doc:
        doc = await seed_settings()
    return settings_to_response(doc)

@api_router.put("/settings", response_model=SettingsResponse)
async def update_settings(data: SettingsUpdate):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    doc = await db.settings.find_one({}, {"_id": 0})
    if not doc:
        doc = await seed_settings()
    await db.settings.update_one(
        {"id": doc["id"]},
        {"$set": update_data}
    )
    updated = await db.settings.find_one({"id": doc["id"]}, {"_id": 0})
    return settings_to_response(updated)

@api_router.post("/settings/music", response_model=SettingsResponse)
async def upload_music(file: UploadFile = File(...)):
    doc = await db.settings.find_one({}, {"_id": 0})
    if not doc:
        doc = await seed_settings()
    # Delete old music file
    if doc.get("background_music_file"):
        old_path = UPLOAD_DIR / doc["background_music_file"]
        if old_path.exists():
            old_path.unlink()
    ext = Path(file.filename).suffix.lower()
    filename = f"music_{uuid.uuid4().hex}{ext}"
    file_bytes = await file.read()
    filepath = UPLOAD_DIR / filename
    with open(filepath, 'wb') as f:
        f.write(file_bytes)
    await db.settings.update_one(
        {"id": doc["id"]},
        {"$set": {"background_music_file": filename, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    updated = await db.settings.find_one({"id": doc["id"]}, {"_id": 0})
    return settings_to_response(updated)

# --- Auth Routes ---

@api_router.post("/auth/verify")
async def verify_password(data: PasswordVerify):
    doc = await db.settings.find_one({}, {"_id": 0})
    if not doc:
        doc = await seed_settings()
    if data.password == doc.get("password", ""):
        return {"success": True, "message": "Access granted"}
    return {"success": False, "message": "Incorrect password"}

# --- Health Check ---

@api_router.get("/")
async def root():
    return {"message": "ValentineMemories3D API is running"}

# --- Database Seeding ---

ANIMATION_STYLES = [
    "Floating Polaroids", "3D Carousel", "Scattered Desk", "Glowing Film Strip",
    "Photo Cube", "Floating Bubbles", "Vinyl Records", "Gallery Wall"
]

SAMPLE_SECTIONS = [
    {"order": 0, "section_type": "intro", "title": "Our Love Story", "caption": "Every moment with you is a memory I treasure forever...", "animation_style": ""},
    {"order": 1, "section_type": "memory", "title": "Our First Chat", "caption": "The message that started it all...", "animation_style": "Floating Polaroids"},
    {"order": 2, "section_type": "memory", "title": "First Date", "caption": "Nervous hearts, magical moments...", "animation_style": "3D Carousel"},
    {"order": 3, "section_type": "memory", "title": "Our Silly Moments", "caption": "Because love is also about laughing until it hurts...", "animation_style": "Scattered Desk"},
    {"order": 4, "section_type": "memory", "title": "Late Night Calls", "caption": "When the world sleeps, we talk about forever...", "animation_style": "Glowing Film Strip"},
    {"order": 5, "section_type": "memory", "title": "Adventures Together", "caption": "Every place is perfect when you're beside me...", "animation_style": "Photo Cube"},
    {"order": 6, "section_type": "memory", "title": "Festivals & Celebrations", "caption": "Every celebration is brighter with you...", "animation_style": "Floating Bubbles"},
    {"order": 7, "section_type": "memory", "title": "Our Songs & Vibes", "caption": "Every song reminds me of you...", "animation_style": "Vinyl Records"},
    {"order": 8, "section_type": "memory", "title": "Our Last Trip", "caption": "Miles traveled, memories made, love deepened...", "animation_style": "Gallery Wall"},
    {"order": 9, "section_type": "final", "title": "My Heart Is Yours, Forever", "caption": "Every love story is beautiful, but ours is my favorite.", "animation_style": ""},
]

async def seed_settings():
    """Create default settings"""
    doc = {
        "id": str(uuid.uuid4()),
        "couple_names": "You & Your Love",
        "relationship_start_date": "2023-02-14T00:00:00Z",
        "password": "143",
        "background_music_file": "",
        "love_letter_text": "My Dearest Love,\n\nFrom the very first message to this very moment, every second with you has been the best part of my life. You are my sunshine, my midnight thought, my forever person.\n\nI love you more than words could ever express.\n\nForever yours,\nYour Love",
        "intro_title": "Our Love Story",
        "intro_subtitle": "Every heartbeat is yours...",
        "is_published": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.settings.insert_one(doc)
    return doc

async def seed_database():
    """Seed database with sample data if empty"""
    count = await db.sections.count_documents({})
    if count == 0:
        logger.info("Seeding database with sample sections...")
        now = datetime.now(timezone.utc).isoformat()
        for s in SAMPLE_SECTIONS:
            doc = {
                "id": str(uuid.uuid4()),
                "section_type": s["section_type"],
                "order": s["order"],
                "title": s["title"],
                "caption": s["caption"],
                "background_photo": "",
                "overlay_photos": [],
                "animation_style": s["animation_style"],
                "created_at": now,
                "updated_at": now,
            }
            await db.sections.insert_one(doc)
        logger.info("Seeded 10 sample sections")
    
    settings_count = await db.settings.count_documents({})
    if settings_count == 0:
        await seed_settings()
        logger.info("Seeded default settings")

@app.on_event("startup")
async def startup():
    await seed_database()

# Include router and mount static files
app.include_router(api_router)

# Mount uploads directory for static file serving
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
