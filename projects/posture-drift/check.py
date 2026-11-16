"""Offline CLI acceptance runner. Run from any directory."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def check_case(case, folder):
    paths = []
    for side in ("before", "after"):
        path = folder / (side + ".json")
        path.write_text(json.dumps(case[side]), encoding="utf-8")
        paths.append(str(path))
    result = subprocess.run(
        [sys.executable, str(ROOT / "advisor.py"), "drift", "compare",
         "--before", paths[0], "--after", paths[1], "--format", "json"],
        capture_output=True, text=True, timeout=10, cwd=folder,
    )
    if result.returncode:
        raise ValueError(result.stderr.strip() or "command failed")
    if json.loads(result.stdout) != case["expected"]:
        raise ValueError("unexpected output: " + result.stdout.strip())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--inventory", action="store_true")
    args = parser.parse_args()
    paths = sorted((HERE / "cases").glob("*/*.json"))
    if len(paths) != 72:
        parser.error(f"expected 72 examples, found {len(paths)}")
    failures = 0
    with tempfile.TemporaryDirectory() as temp:
        for path in paths:
            case = json.loads(path.read_text(encoding="utf-8"))
            if args.inventory:
                continue
            try:
                check_case(case, Path(temp))
            except (ValueError, subprocess.TimeoutExpired) as exc:
                print(f"{path.relative_to(HERE)}: {exc}", file=sys.stderr)
                failures += 1
    print(f"{len(paths)} examples loaded" if args.inventory else
          f"{len(paths) - failures}/{len(paths)} comparisons passed")
    return int(bool(failures))


if __name__ == "__main__":
    sys.exit(main())
