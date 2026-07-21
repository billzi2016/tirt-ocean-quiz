from __future__ import annotations

import argparse
import zipfile
from pathlib import Path
from urllib.request import urlretrieve


DATA_URL = "https://openpsychometrics.org/_rawdata/IPIP-FFM-data-8Nov2018.zip"
ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "raw_data"
ZIP_PATH = RAW_DIR / "IPIP-FFM-data-8Nov2018.zip"


def main() -> None:
    parser = argparse.ArgumentParser(description="Download the OpenPsychometrics IPIP response dataset.")
    parser.add_argument("--force", action="store_true", help="Download again even when the ZIP already exists.")
    args = parser.parse_args()

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    if args.force or not ZIP_PATH.exists():
      urlretrieve(DATA_URL, ZIP_PATH)

    with zipfile.ZipFile(ZIP_PATH) as archive:
      archive.extractall(RAW_DIR)

    print(f"dataset: {ZIP_PATH}")
    print(f"extracted: {RAW_DIR / 'IPIP-FFM-data-8Nov2018'}")


if __name__ == "__main__":
    main()
