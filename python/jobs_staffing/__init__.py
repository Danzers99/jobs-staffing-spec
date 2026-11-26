"""Jobs & Staffing v1 for Python: the schema, constants and validate().

An open format for describing work for people or AI agents, and requesting staffing
with consent. Spec: https://heydavidmorales.com/ext/jobs/v1/
"""
from __future__ import annotations

import json
from functools import lru_cache
from importlib.resources import files
from typing import Any

from jsonschema import Draft202012Validator, FormatChecker

__all__ = ["EXTENSION_URI", "SCHEMA_URL", "TYPES", "schema", "validate", "extension_declaration", "data_part"]
__version__ = "1.3.0"

EXTENSION_URI = "https://heydavidmorales.com/ext/jobs/v1"
SCHEMA_URL = f"{EXTENSION_URI}/schema.json"
TYPES = ("JobOpportunity", "StaffingRequest", "OpportunityFeed")

schema: dict[str, Any] = json.loads(files(__package__).joinpath("schema.json").read_text(encoding="utf-8"))


@lru_cache(maxsize=None)
def _validator(type_: str) -> Draft202012Validator:
    root = {k: v for k, v in schema.items() if k != "oneOf"}
    root["$ref"] = f"#/$defs/{type_}"
    return Draft202012Validator(root, format_checker=FormatChecker())


def validate(doc: Any) -> dict[str, Any]:
    """Validate a JobOpportunity, StaffingRequest or OpportunityFeed (chosen by its $type).

    Returns {"valid": bool, "type": str | None, "errors": [{"path": str, "message": str}]}.
    """
    type_ = doc.get("$type") if isinstance(doc, dict) else None
    if type_ not in TYPES:
        return {"valid": False, "type": None, "errors": [{"path": "/$type", "message": f"Expected $type to be one of {', '.join(TYPES)}."}]}
    errors = [
        {"path": "/" + "/".join(str(p) for p in e.absolute_path), "message": e.message}
        for e in sorted(_validator(type_).iter_errors(doc), key=lambda e: list(e.absolute_path))
    ]
    return {"valid": not errors, "type": type_, "errors": errors}


def extension_declaration(version: str = "1.3.0", feed: str | None = None) -> dict[str, Any]:
    """The agent card entry that declares the extension (A2A capabilities.extensions)."""
    params: dict[str, Any] = {"version": version, "schema": SCHEMA_URL}
    if feed:
        params["feed"] = feed
    return {"uri": EXTENSION_URI, "required": False, "params": params}


def data_part(obj: dict[str, Any]) -> dict[str, Any]:
    """Wrap an object as an A2A 1.0 data part tagged with the extension URI."""
    return {"data": obj, "metadata": {"extension": EXTENSION_URI}}
