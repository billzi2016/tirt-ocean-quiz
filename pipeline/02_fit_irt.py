from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.special import logit


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "raw_data" / "IPIP-FFM-data-8Nov2018" / "data-final.csv"
OUT_PATH = ROOT / "pipeline" / "item_params.json"

TRAITS = {
    "EXT": "E",
    "AGR": "A",
    "CSN": "C",
    "EST": "N",
    "OPN": "O",
}

REVERSED = {
    "EXT": {2, 4, 6, 8, 10},
    "AGR": {1, 3, 5, 7},
    "CSN": {2, 4, 6, 8},
    "EST": {2, 4},
    "OPN": {2, 4, 6},
}


def main() -> None:
    if not DATA_PATH.exists():
        raise SystemExit("Run pipeline/01_fetch_data.py first.")

    columns = [f"{prefix}{index}" for prefix in TRAITS for index in range(1, 11)]
    frame = pd.read_csv(DATA_PATH, sep="\t", usecols=columns)
    frame = frame.apply(pd.to_numeric, errors="coerce")
    frame = frame[(frame >= 1).all(axis=1) & (frame <= 5).all(axis=1)]

    params = []
    for prefix, trait in TRAITS.items():
        trait_columns = [f"{prefix}{index}" for index in range(1, 11)]
        scored = frame[trait_columns].copy()
        for index in REVERSED[prefix]:
            scored[f"{prefix}{index}"] = 6 - scored[f"{prefix}{index}"]

        total = scored.sum(axis=1)
        total_z = (total - total.mean()) / total.std(ddof=0)

        for index, column in enumerate(trait_columns, start=1):
            item = scored[column]
            item_z = (item - item.mean()) / item.std(ddof=0)
            discrimination = float(np.corrcoef(item_z, total_z)[0, 1])
            discrimination = float(np.clip(discrimination * 2.2, 0.35, 1.35))
            endorse_rate = float(np.clip((item >= 4).mean(), 0.02, 0.98))
            difficulty = float(-logit(endorse_rate))
            lam = discrimination / np.sqrt(1 + discrimination**2)
            mu = (-discrimination * difficulty) / np.sqrt(1 + discrimination**2)
            params.append(
                {
                    "sourceItem": column,
                    "trait": trait,
                    "direction": -1 if index in REVERSED[prefix] else 1,
                    "lambda": round(float(lam), 4),
                    "mu": round(float(mu), 4),
                }
            )

    OUT_PATH.write_text(json.dumps(params, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"rows used: {len(frame):,}")
    print(f"wrote: {OUT_PATH}")


if __name__ == "__main__":
    main()
