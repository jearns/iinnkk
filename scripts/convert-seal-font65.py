#!/usr/bin/env python3
"""Convert a personally licensed TTF/OTF seal font to WOFF2 locally.

Requires: python -m pip install 'fonttools[woff]'
Usage: python scripts/convert-seal-font65.py /path/to/font.ttf /path/to/font.woff2
Do not commit the resulting font to a public repository without distribution rights.
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont

if len(sys.argv) != 3 or Path(sys.argv[1]).suffix.lower() not in {'.ttf', '.otf'} or Path(sys.argv[2]).suffix.lower() != '.woff2':
    raise SystemExit('Usage: convert-seal-font65.py INPUT.ttf OUTPUT.woff2')
font = TTFont(sys.argv[1]); font.flavor = 'woff2'; font.save(sys.argv[2]); print(f'Saved {sys.argv[2]}')
