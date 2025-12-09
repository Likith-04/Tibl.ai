import pandas as pd
import json
import os

def excel_to_json(excel_path, output_json_path):

    # Debugging: Print the path being used
    print("Trying to load file:", excel_path)

    # Check if file exists
    if not os.path.exists(excel_path):
        print("❌ Error: File does NOT exist at this path.")
        return

    xls = pd.ExcelFile(excel_path)
    final_json = {}

    for sheet_name in xls.sheet_names:
        df = pd.read_excel(excel_path, sheet_name=sheet_name)
        final_json[sheet_name] = df.to_dict(orient="records")

    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(final_json, f, indent=4, ensure_ascii=False)

    print(f"✅ JSON saved to: {output_json_path}")


# ---------------------------------------
#  USE YOUR CORRECT WINDOWS PATH HERE
# ---------------------------------------

excel_to_json(
    excel_path=r"c:\Users\saisr\OneDrive\Desktop\Desktop\timetable-py\Tibl.ai-main\backend\timetable_tools\output_v5\All_Timetables_with_Teachers_fixed_v2.xlsx",
    output_json_path="timetable.json"
)
