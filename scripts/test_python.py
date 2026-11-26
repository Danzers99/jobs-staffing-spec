"""Runs every example through the installed Python package (pip install .)."""
import json
import pathlib
import sys

import jobs_staffing

ROOT = pathlib.Path(__file__).resolve().parent.parent
failures = 0
for path in sorted((ROOT / "examples").glob("*.json")):
    doc = json.loads(path.read_text())
    if doc.get("$type") not in jobs_staffing.TYPES:
        continue
    r = jobs_staffing.validate(doc)
    print(("ok      " if r["valid"] else "INVALID ") + path.name)
    failures += not r["valid"]
for path in sorted((ROOT / "examples" / "invalid").glob("*.json")):
    r = jobs_staffing.validate(json.loads(path.read_text()))
    print(("ACCEPTED " if r["valid"] else "rejected ") + "invalid/" + path.name)
    failures += r["valid"]
d = jobs_staffing.extension_declaration(feed="https://example.com/opportunities.json")
failures += d["params"]["feed"] != "https://example.com/opportunities.json"
failures += jobs_staffing.data_part({})["metadata"]["extension"] != jobs_staffing.EXTENSION_URI
print("python package: all checks passed" if not failures else f"{failures} failure(s)")
sys.exit(1 if failures else 0)
