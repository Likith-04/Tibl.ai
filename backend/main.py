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
ADMIN_FILE = BASE_DIR / "admin.json"


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


@app.get("/users")
def get_users():
    teachers_file = BASE_DIR / "teachers.csv"
    
    # Start with Admin user
    # Start with Admin user
    users = []
    if ADMIN_FILE.exists():
        try:
            admin_data = json.loads(ADMIN_FILE.read_text(encoding="utf-8"))
            users.append(admin_data)
        except Exception as e:
            print(f"Error reading admin.json: {e}")
    else:
        # Fallback if file missing
        users.append({
            "id": "ADMIN_001",
            "name": "Srinand",
            "role": "Admin",
            "email": "admin@tibl.ai",
            "password": "password123",
            "created_at": "Sep 13, 2025"
        })
    
    if not teachers_file.exists():
        return users
    
    try:
        with open(teachers_file, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                users.append({
                    "id": row["id"],
                    "name": row["name"],
                    "role": "Teacher",
                    "email": row.get("email", ""),
                    "password": row.get("password", ""),
                    "created_at": "Sep 13, 2025" # Default date
                })
    except Exception as e:
        raise HTTPException(500, f"Failed to read teachers.csv: {e}")
        
    return users


from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(creds: LoginRequest):
    # Check for Admin
    admin_user = None
    if ADMIN_FILE.exists():
        try:
             admin_data = json.loads(ADMIN_FILE.read_text(encoding="utf-8"))
             if admin_data["email"] == creds.email and admin_data["password"] == creds.password:
                 admin_user = admin_data
        except Exception:
             pass
    
    # Fallback to hardcoded if file check failed or file missing, but only if it matches hardcoded defaults (legacy support)
    if not admin_user and creds.email == "admin@tibl.ai" and creds.password == "password123":
         admin_user = {
            "id": "ADMIN_001",
            "name": "Srinand",
            "role": "Admin",
            "email": "admin@tibl.ai",
         }

    if admin_user:
        return {
            "id": admin_user["id"],
            "name": admin_user["name"],
            "role": "Admin",
            "email": admin_user["email"],
            "avatar": f"https://ui-avatars.com/api/?name={admin_user['name']}&background=3b82f6&color=fff"
        }

    teachers_file = BASE_DIR / "teachers.csv"
    if not teachers_file.exists():
        raise HTTPException(401, "Invalid credentials")
    
    try:
        with open(teachers_file, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                email = row.get("email", "")
                password = row.get("password", "")
                
                if email == creds.email and password == creds.password:
                    return {
                        "id": row["id"],
                        "name": row["name"],
                        "role": "Teacher",
                        "email": email,
                        "avatar": f"https://ui-avatars.com/api/?name={row['name']}&background=random&color=fff"
                    }
    except Exception as e:
        print(f"Login error: {e}")
        
    raise HTTPException(401, "Invalid email or password")


@app.get("/timetable/teacher/{teacher_id}")
def get_teacher_timetable(teacher_id: str):
    # 1. Find the latest JSON file
    json_filename = get_latest_generated_file()
    if not json_filename:
        # If no generated file, try to load the static 'timetable.json' if it exists
        static_json = BASE_DIR / "timetable.json"
        if static_json.exists():
            filepath = static_json
        else:
            raise HTTPException(404, "No timetable data found")
    else:
        # If we have a generated file, prefer that.
        # Ensure we are looking for the JSON version.
        target_json_name = json_filename
        if target_json_name.endswith(".csv"):
            target_json_name = target_json_name.replace(".csv", ".json")
            
        filepath = GENERATED_DIR / target_json_name
        
        # Fallback to static if generated JSON doesn't exist
        if not filepath.exists():
             filepath = BASE_DIR / "timetable.json"
             if not filepath.exists():
                 raise HTTPException(404, "Timetable JSON not found")

    try:
        text = filepath.read_text(encoding="utf-8")
        full_data = json.loads(text)
    except Exception as e:
        raise HTTPException(500, f"Failed to load timetable: {e}")

    # 2. Filter for the teacher
    # Structure: { "Section": [ { "Day": "MON", "Time": "Value" } ] }
    
    # We want to build: { "My Schedule": [ { "Day": "MON", "09:00-10:00": "Class (Section)", ... } ] }
    # Initialize empty schedule for MON-FRI
    days = ["MON", "TUE", "WED", "THU", "FRI"]
    my_schedule = {day: {"Day": day} for day in days}
    
    # Iterate through all sections
    for section, rows in full_data.items():
        for row in rows:
            day = row.get("Day")
            if day not in my_schedule:
                continue
            
            # Check all time slots
            for time_slot, content in row.items():
                if time_slot == "Day":
                    continue
                
                # Content format: "Subject — Teacher Name (ID)"
                # We check if teacher_id is in content
                if content and isinstance(content, str) and f"({teacher_id})" in content:
                    # Found a class!
                    # If we already have something there, append it
                    existing = my_schedule[day].get(time_slot)
                    new_entry = f"{content.split('—')[0].strip()} ({section})"
                    
                    if existing:
                        my_schedule[day][time_slot] = f"{existing}\n{new_entry}"
                    else:
                        my_schedule[day][time_slot] = new_entry

    # Convert dict to list
    final_rows = [my_schedule[day] for day in days]
    
    return {"My Schedule": final_rows}


class UpdateProfileRequest(BaseModel):
    name: str
    email: str

@app.put("/users/{user_id}")
def update_user(user_id: str, data: UpdateProfileRequest):
    old_name = ""
    user_found = False

    # 1. Update Admin or Teacher
    if user_id == "ADMIN_001":
        if not ADMIN_FILE.exists():
             raise HTTPException(404, "Admin file not found")
        try:
             admin_data = json.loads(ADMIN_FILE.read_text(encoding="utf-8"))
             old_name = admin_data["name"]
             admin_data["name"] = data.name
             admin_data["email"] = data.email
             ADMIN_FILE.write_text(json.dumps(admin_data, indent=4), encoding="utf-8")
             user_found = True
        except Exception as e:
             raise HTTPException(500, f"Failed to update admin: {e}")
    else:
        teachers_file = BASE_DIR / "teachers.csv"
        if not teachers_file.exists():
            raise HTTPException(404, "Teachers file not found")
        
        updated_rows = []
        try:
            with open(teachers_file, newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                fieldnames = reader.fieldnames
                for row in reader:
                    if row["id"] == user_id:
                        user_found = True
                        old_name = row["name"]
                        row["name"] = data.name
                        row["email"] = data.email
                    updated_rows.append(row)
            
            if user_found:
                with open(teachers_file, "w", newline="", encoding="utf-8") as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(updated_rows)
            else:
                 raise HTTPException(404, "User not found")
        except Exception as e:
            raise HTTPException(500, f"Failed to update teacher: {e}")

    # 2. Update Timetable JSONs
    # We need to update both static timetable.json and the latest generated one
    
    def update_json_file(path):
        if not path.exists(): return
        try:
            content = path.read_text(encoding="utf-8")
            # Replace "— Old Name (ID)" with "— New Name (ID)"
            old_str = f"— {old_name} ({user_id})"
            new_str = f"— {data.name} ({user_id})"
            
            if old_str in content:
                new_content = content.replace(old_str, new_str)
                path.write_text(new_content, encoding="utf-8")
        except Exception as e:
            print(f"Failed to update JSON {path}: {e}")

    # Update static
    update_json_file(BASE_DIR / "timetable.json")
    
    # Update latest generated
    latest_file = get_latest_generated_file()
    if latest_file:
        target_json = latest_file
        if target_json.endswith(".csv"):
            target_json = target_json.replace(".csv", ".json")
            
        update_json_file(GENERATED_DIR / target_json)

    return {"status": "success", "user": {"id": user_id, "name": data.name, "email": data.email}}


@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    if user_id == "ADMIN_001":
        raise HTTPException(400, "Cannot delete admin user")
        
    teachers_file = BASE_DIR / "teachers.csv"
    if not teachers_file.exists():
        raise HTTPException(404, "Teachers file not found")
    
    updated_rows = []
    user_found = False
    
    try:
        with open(teachers_file, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            fieldnames = reader.fieldnames
            for row in reader:
                if row["id"] == user_id:
                    user_found = True
                    continue
                updated_rows.append(row)
                
        if not user_found:
             raise HTTPException(404, "User not found")
             
        with open(teachers_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(updated_rows)
            
    except Exception as e:
        raise HTTPException(500, f"Failed to delete teacher: {e}")
        
    return {"status": "success", "message": "User deleted"}



class CreateUserRequest(BaseModel):
    id: str
    name: str
    email: str
    password: str

@app.post("/users")
def create_user(data: CreateUserRequest):
    teachers_file = BASE_DIR / "teachers.csv"
    if not teachers_file.exists():
        # Create header if not exists
        with open(teachers_file, "w", newline="", encoding="utf-8") as f:
            f.write("id,name,email,password\n")
            
    # Check if ID exists
    try:
        with open(teachers_file, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row["id"] == data.id:
                    raise HTTPException(400, "User ID already exists")
    except FileNotFoundError:
        pass # newly created above

    try:
        with open(teachers_file, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([data.id, data.name, data.email, data.password])
    except Exception as e:
        raise HTTPException(500, f"Failed to create user: {e}")
        
    return {"status": "success", "user": data.dict()}
