import json
from pathlib import Path

def parse_sse_response(text: str):
    lines = text.splitlines()

    for i in range(len(lines)):
        if lines[i].startswith("event: result"):
            # next line should contain data
            if i + 1 < len(lines) and lines[i+1].startswith("data:"):
                json_str = lines[i+1].replace("data: ", "")
                return json.loads(json_str)

    raise ValueError("No result event found in response")

def infer_type_schema(obj):
    if isinstance(obj, dict):
        return {k: infer_type_schema(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        if not obj:
            return ["empty_list"]
        return [infer_type_schema(obj[0])]
    else:
        return type(obj).__name__


def build_tree(path: Path):
    return {
        "name": path.name,
        "type": "dir" if path.is_dir() else "file",
        "children": [build_tree(p) for p in path.iterdir()] if path.is_dir() else []
    }