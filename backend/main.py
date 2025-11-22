# main.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import time
import csv
import json
from pathlib import Path
from typing import List, Dict
from timetable_runner import generate_timetable

app = FastAPI(title="Tibl.ai Backend")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

BASE_DIR = Path(__file__).resolve().parent
GENERATED_DIR = BASE_DIR / "generated"
GENERATED_DIR.mkdir(exist_ok=True)


def get_latest_generated_file():
    files = sorted(
        [p for p in GENERATED_DIR.iterdir() if p.is_file()],
        key=lambda p: p.stat().st_mtime,
        reverse=True
    )
    return files[0].name if files else None


@app.get("/latest")
def latest():
    name = get_latest_generated_file()
    if not name:
        raise HTTPException(404, "No generated files found")
    return {"filename": name, "download_url": f"/download/{name}"}


@app.get("/preview/{filename}")
def preview(filename: str) -> List[Dict]:
    filepath = (GENERATED_DIR / filename).resolve()

    # Safety check: ensure path is inside GENERATED_DIR
    try:
        if GENERATED_DIR.resolve() not in filepath.parents and filepath != GENERATED_DIR.resolve():
            raise HTTPException(400, "Invalid filename")
    except RuntimeError:
        raise HTTPException(400, "Invalid filename")

    if not filepath.exists():
        raise HTTPException(404, "File not found")

    rows = []
    try:
        with open(filepath, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                rows.append(r)
    except Exception as e:
        raise HTTPException(500, f"Failed to read CSV: {e}")

    return rows


@app.post("/generate")
def generate():
    """
    Run the whole pipeline and return URLs to the stored CSV + JSON.
    """
    try:
        raw_csv_path, raw_json_path = generate_timetable()
    except Exception as e:
        raise HTTPException(500, f"Generation failed: {e}")

    ts = int(time.time())
    csv_name = f"timetable_{ts}.csv"
    json_name = f"timetable_{ts}.json"

    csv_dest = GENERATED_DIR / csv_name
    json_dest = GENERATED_DIR / json_name

    try:
        # copy csv
        with open(raw_csv_path, "rb") as s, open(csv_dest, "wb") as d:
            d.write(s.read())
        # copy json
        with open(raw_json_path, "rb") as s, open(json_dest, "wb") as d:
            d.write(s.read())
    except Exception as e:
        raise HTTPException(500, f"Failed to store generated assets: {e}")

    return {
        "filename": csv_name,
        "download_url": f"/download/{csv_name}",
        "json_filename": json_name,
        "json_url": f"/json/{json_name}"
    }


@app.get("/download/{filename}")
def download_csv(filename: str):
    filepath = (GENERATED_DIR / filename).resolve()
    try:
        if GENERATED_DIR.resolve() not in filepath.parents and filepath != GENERATED_DIR.resolve():
            raise HTTPException(400, "Invalid filename")
    except RuntimeError:
        raise HTTPException(400, "Invalid filename")

    if not filepath.exists():
        raise HTTPException(404, "File not found")

    return FileResponse(filepath, media_type="text/csv", filename=filename)


# Dev: serve the uploaded XLSX directly for browser download
@app.get("/download/dev-xlsx")
def download_dev_xlsx():
    dev_path = Path("/mnt/data/timetable_tools/output_v5/All_Timetables_with_Teachers_fixed_v2.xlsx")
    if not dev_path.exists():
        raise HTTPException(status_code=404, detail="Dev XLSX not found on server")
    return FileResponse(
        path=dev_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=dev_path.name,
    )


# Dev: return the local filesystem path (raw) so external tooling can map it to a URL
@app.get("/dev-xlsx-path")
def dev_xlsx_path():
    local_path = "/mnt/data/timetable_tools/output_v5/All_Timetables_with_Teachers_fixed_v2.xlsx"
    return {"local_path": local_path}


@app.get("/json/{filename}")
def download_json(filename: str):
    filepath = (GENERATED_DIR / filename).resolve()
    try:
        if GENERATED_DIR.resolve() not in filepath.parents and filepath != GENERATED_DIR.resolve():
            raise HTTPException(400, "Invalid filename")
    except RuntimeError:
        raise HTTPException(400, "Invalid filename")

    if not filepath.exists():
        raise HTTPException(404, "File not found")

    # Load JSON content and return as JSONResponse (ensures fetch(...).json() works)
    try:
        text = filepath.read_text(encoding="utf-8")
        data = json.loads(text)
    except Exception as e:
        raise HTTPException(500, f"Failed to read/parse JSON file: {e}")

    return JSONResponse(data)
