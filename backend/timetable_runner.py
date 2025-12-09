# timetable_runner.py
import os
import time
import json
from pathlib import Path

OUTPUT_DIR = Path("timetable_tools/output_v5")

def generate_timetable():
    """
    Runs:
      1. timetable.py (scheduler) -> produces overall_schedule.csv and All_Timetables_v5.xlsx
      2. attach_teachers_to_timetable.py -> produces All_Timetables_with_Teachers_fixed_v2.xlsx
      3. json_converter.excel_to_json(...) -> produces a JSON file

    Returns:
        (str(csv_path), str(json_path))
    """
    # Dynamic imports at runtime so FastAPI can start even if heavy deps are missing
    try:
        import timetable as timetable_module
    except Exception as e:
        raise RuntimeError(f"Failed to import timetable.py: {e}")

    try:
        import attach_teachers_to_timetable as attach_module
    except Exception as e:
        raise RuntimeError(f"Failed to import attach_teachers_to_timetable.py: {e}")

    try:
        # excel_to_json(excel_path, json_out_path)
        from json_converter import excel_to_json
    except Exception as e:
        raise RuntimeError(f"Failed to import json_converter.py: {e}")

    # Ensure output dir exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # -------------------------
    # STEP 1: Run scheduler
    # -------------------------
    try:
        # timetable_module should expose a main() function that writes files into OUTPUT_DIR
        timetable_module.main()
    except Exception as e:
        raise RuntimeError(f"Error running scheduler (timetable.py): {e}")

    overall_csv = OUTPUT_DIR / "overall_schedule.csv"
    all_xlsx = OUTPUT_DIR / "All_Timetables_v5.xlsx"

    if not overall_csv.exists():
        raise FileNotFoundError(f"Missing expected CSV at: {overall_csv}")

    if not all_xlsx.exists():
        raise FileNotFoundError(f"Missing expected XLSX at: {all_xlsx}")

    # -------------------------
    # STEP 2: Attach teachers
    # -------------------------
    subjects_csv = "subjects_with_teachers.csv"
    teachers_csv = "teachers.csv"
    output_xlsx = OUTPUT_DIR / "All_Timetables_with_Teachers_fixed_v2.xlsx"
    missing_csv = "missing_mappings.csv"

    try:
        actual_xlsx_path = attach_module.process(
            str(all_xlsx),
            subjects_csv,
            teachers_csv,
            str(output_xlsx),
            missing_csv
        )
    except Exception as e:
        raise RuntimeError(f"Error running attach_teachers_to_timetable.py: {e}")

    if not Path(actual_xlsx_path).exists():
        raise FileNotFoundError(f"Attach-teachers output XLSX missing: {actual_xlsx_path}")

    # -------------------------
    # STEP 3: Convert to JSON
    # -------------------------
    ts = int(time.time())
    json_out_path = OUTPUT_DIR / f"timetable_{ts}.json"

    try:
        excel_to_json(str(actual_xlsx_path), str(json_out_path))
    except Exception as e:
        raise RuntimeError(f"Error running excel_to_json: {e}")

    if not json_out_path.exists():
        raise FileNotFoundError(f"JSON file was not produced: {json_out_path}")

    # -------------------------
    # SANITIZE JSON (convert NaN/Inf -> null)
    # -------------------------
    # Some converters may write bare NaN/Infinity tokens which are invalid JSON.
    # We'll load with parse_constant to turn those into None, then re-dump to ensure valid JSON.
    try:
        raw_text = json_out_path.read_text(encoding="utf-8")
        # parse_constant handles NaN/Infinity tokens by mapping them to None
        parsed = json.loads(raw_text, parse_constant=lambda _: None)
        # rewrite sanitized JSON (pretty, compact)
        json_out_path.write_text(json.dumps(parsed, ensure_ascii=False), encoding="utf-8")
    except Exception as e:
        # If sanitization fails, raise an error so frontend doesn't get invalid JSON
        raise RuntimeError(f"Failed to sanitize JSON output: {e}")

    # Final CSV sanity check
    if not overall_csv.exists():
        raise FileNotFoundError(f"Final CSV missing after pipeline: {overall_csv}")

    return str(overall_csv), str(json_out_path)
