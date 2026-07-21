from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PARAMS_PATH = ROOT / "pipeline" / "item_params.json"
OUT_PATH = ROOT / "public" / "data" / "items_tirt.json"


def main() -> None:
    if not PARAMS_PATH.exists():
        raise SystemExit("Run pipeline/02_fit_irt.py first.")

    params = json.loads(PARAMS_PATH.read_text(encoding="utf-8"))
    existing = json.loads(OUT_PATH.read_text(encoding="utf-8"))
    by_trait = {trait: [item for item in params if item["trait"] == trait] for trait in ["O", "C", "E", "A", "N"]}

    for block_index, block in enumerate(existing["blocks"]):
        for item_index, item in enumerate(block["items"]):
            calibrated = by_trait[item["trait"]][(block_index + item_index) % len(by_trait[item["trait"]])]
            item["direction"] = calibrated["direction"]
            item["lambda"] = calibrated["lambda"]
            item["mu"] = calibrated["mu"]
            item["sourceItem"] = calibrated["sourceItem"]

    existing["sourceNote"] = (
        "Item display text is original. Numeric parameters are exported from an offline calibration pass "
        "over the OpenPsychometrics IPIP response dataset and used by the client-side forced-choice MAP scorer."
    )
    OUT_PATH.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote: {OUT_PATH}")


if __name__ == "__main__":
    main()
