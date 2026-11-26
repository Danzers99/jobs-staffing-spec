"""Validate the Jobs & Staffing v1 examples against the schema.

Every file in examples/ must be valid (A2A message examples are checked by their
Jobs & Staffing data parts); every file in examples/invalid/ must fail. Run:

    pip install "jsonschema>=4.18"
    python scripts/validate.py
"""
import json
import pathlib
import sys

from jsonschema import Draft202012Validator, FormatChecker

ROOT = pathlib.Path(__file__).resolve().parent.parent
EXT = "https://heydavidmorales.com/ext/jobs/v1"

schema = json.loads((ROOT / "schema" / "jobs-staffing-v1.schema.json").read_text())
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema, format_checker=FormatChecker())


def objects(doc):
    """The Jobs & Staffing objects in a file: the file itself, or its tagged A2A data parts."""
    if isinstance(doc, dict) and "$type" in doc:
        return [doc]
    parts = doc.get("params", {}).get("message", {}).get("parts", []) if isinstance(doc, dict) else []
    return [p["data"] for p in parts if p.get("metadata", {}).get("extension") == EXT]


failures = 0
for path in sorted((ROOT / "examples").glob("*.json")):
    found = objects(json.loads(path.read_text()))
    if not found:
        continue  # e.g. the agent card snippet, which holds no Jobs & Staffing object
    for obj in found:
        errors = list(validator.iter_errors(obj))
        status = "ok" if not errors else "INVALID"
        print(f"{status:8} {path.relative_to(ROOT)} ({obj.get('$type')})")
        for e in errors[:5]:
            print(f"           {list(e.path)}: {e.message[:200]}")
        failures += bool(errors)

for path in sorted((ROOT / "examples" / "invalid").glob("*.json")):
    errors = list(validator.iter_errors(json.loads(path.read_text())))
    status = "rejected" if errors else "ACCEPTED"
    print(f"{status:8} {path.relative_to(ROOT)} (must be rejected)")
    failures += not errors

print("all checks passed" if not failures else f"{failures} check(s) failed")
sys.exit(1 if failures else 0)
