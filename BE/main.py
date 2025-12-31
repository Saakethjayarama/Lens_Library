import os
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

IMAGES_DIR = os.getenv("IMAGES_DIR")
if not IMAGES_DIR:
    raise RuntimeError("IMAGES_DIR is not set in .env")

IMAGES_PATH = Path(IMAGES_DIR).resolve()
if not IMAGES_PATH.exists() or not IMAGES_PATH.is_dir():
    raise RuntimeError(f"IMAGES_DIR does not exist or is not a directory: {IMAGES_PATH}")

app = FastAPI()

# Adjust CORS as needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Models
# -----------------------------

class ImagePlaceholder(BaseModel):
    id: str
    imageUrl: str


class PaginatedImagesResponse(BaseModel):
    images: List[ImagePlaceholder]
    hasMore: bool


# -----------------------------
# Helpers
# -----------------------------

def list_image_files() -> List[Path]:
    # Only files, sorted for stable pagination
    return sorted(
        [p for p in IMAGES_PATH.iterdir() if p.is_file()],
        key=lambda p: p.name.lower()
    )


def get_file_path_or_404(filename: str) -> Path:
    file_path = IMAGES_PATH / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    return file_path


# -----------------------------
# Endpoints
# -----------------------------

@app.get("/images", response_model=PaginatedImagesResponse)
def get_images(
    page: int = Query(..., ge=1),
    limit: int = Query(..., ge=1),
):
    """
    Matches frontend getImages(page, limit)
    """
    files = list_image_files()

    start = (page - 1) * limit
    end = page * limit

    page_files = files[start:end]
    has_more = end < len(files)

    images = [
        ImagePlaceholder(
            id=file.name,
            imageUrl=f"/files/{file.name}"
        )
        for file in page_files
    ]

    return {
        "images": images,
        "hasMore": has_more
    }


@app.delete("/images/{image_id}")
def delete_image(image_id: str):
    """
    Deletes the file whose name == image_id
    """
    file_path = get_file_path_or_404(image_id)

    try:
        file_path.unlink()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"success": True}


@app.get("/images/download/{image_id}")
def download_image(image_id: str):
    """
    Forces download of the file
    """
    file_path = get_file_path_or_404(image_id)

    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type="application/octet-stream"
    )


@app.get("/files/{image_id}")
def serve_image(image_id: str):
    """
    Public file-serving endpoint.
    This is what imageUrl points to.
    """
    file_path = get_file_path_or_404(image_id)

    return FileResponse(path=file_path)
