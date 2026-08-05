#!/usr/bin/env python3
"""
Reconvierte a JPEG baseline las fotos que van a insertarse en un informe P.A.T.

Por qué existe: fotos de teléfono (y las insertadas como "rich value" en Excel)
suelen venir en JPEG progresivo. Word/LibreOffice lo renderizan mal -- la foto
aparece de lado o distorsionada, aunque el archivo se vea perfecto en cualquier
otro visor y no tenga ningún problema real de orientación ni de EXIF. Pasó con
el caso SIBA Energy y costó varias iteraciones diagnosticarlo -- por eso este
paso queda como preprocesamiento obligatorio, no como nota en un README que
alguien se puede saltar.

Uso:
    python3 normalize_photos.py <carpeta_entrada> <carpeta_salida>

No modifica los archivos originales. No rota ni recorta nada -- reencodea el
mismo pixel grid a baseline, nada más. generate_report.js rechaza con error
cualquier imagen que todavía sea progresiva, así que correr este script antes
no es opcional si las fotos vienen de un teléfono o de un rich value de Excel.
"""
import sys
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Falta Pillow: pip install pillow")


def normalize_folder(src_dir: str, dst_dir: str) -> None:
    src = Path(src_dir)
    dst = Path(dst_dir)
    dst.mkdir(parents=True, exist_ok=True)

    converted, already_ok = 0, 0
    for f in sorted(src.glob("*")):
        if f.suffix.lower() not in (".jpg", ".jpeg"):
            continue
        im = Image.open(f)
        was_progressive = bool(im.info.get("progressive"))
        im = im.convert("RGB")
        out = dst / f.name
        im.save(out, "JPEG", quality=95, progressive=False, optimize=True)
        if was_progressive:
            converted += 1
            print(f"[reconvertida] {f.name} (era progressive JPEG)")
        else:
            already_ok += 1
            print(f"[sin cambios]  {f.name} (ya era baseline)")

    print(f"\n{converted} reconvertidas, {already_ok} ya estaban en baseline. Salida: {dst}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    normalize_folder(sys.argv[1], sys.argv[2])
