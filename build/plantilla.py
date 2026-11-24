"""Genera app/public/plantilla-autos.xlsx (plantilla de carga masiva para agencias).
Uso: python3 build/plantilla.py  (requiere openpyxl). Las marcas salen de app/src/data/modelos.js."""
import json, subprocess, pathlib
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.comments import Comment

ROOT = pathlib.Path(__file__).resolve().parent.parent
marcas = json.loads(subprocess.check_output(
    ["node", "-e", "import('./app/src/data/modelos.js').then(m=>console.log(JSON.stringify(Object.keys(m.SEARCH_MAKES))))"], cwd=ROOT))

PROVINCIAS = ["Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
  "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz",
  "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"]
LISTAS = {
  "Marca": marcas, "Condición": ["0km", "Usado"], "Moneda": ["ARS", "USD"],
  "Combustible": ["Nafta", "Diésel", "Híbrido", "Eléctrico", "GNC"], "Transmisión": ["Manual", "Automática"],
  "Carrocería": ["SUV", "Sedán", "Hatchback", "Pick-up", "Deportivo", "Utilitario"], "Provincia": PROVINCIAS,
}
# (título, ancho, obligatoria, ayuda)
COLS = [
  ("Código", 12, True, "Tu código para este auto (letras, números, - o _). Es el nombre de la carpeta de fotos o el inicio del nombre de cada foto: A001-1.jpg"),
  ("Marca", 16, True, "Elegila de la lista."), ("Modelo", 16, True, "Ej.: Hilux"), ("Versión", 24, True, "Ej.: SRV 2.8 4x4 AT"),
  ("Año", 8, True, "Ej.: 2023"), ("Condición", 11, True, "0km o Usado."), ("Km", 10, True, "Solo números. 0 si es 0km."),
  ("Precio", 14, True, "Solo números, sin puntos ni símbolos."), ("Moneda", 9, True, "ARS (pesos) o USD (dólares)."),
  ("Combustible", 13, True, None), ("Transmisión", 13, True, None), ("Carrocería", 13, True, None),
  ("Ciudad", 18, False, "Si la dejás vacía, usamos la de tu agencia."), ("Provincia", 18, False, "Si la dejás vacía, usamos la de tu agencia."),
  ("Motor", 12, False, "Ej.: 2.8 TDI"), ("Puertas", 9, False, "2 a 5"), ("Color", 12, False, None), ("Tracción", 13, False, "Ej.: 4x4, Delantera"),
  ("Descripción", 50, False, "Hasta 1000 caracteres."),
]
FILAS = 500

wb = Workbook()
ws = wb.active
ws.title = "Autos"
azul = PatternFill("solid", fgColor="405FF2")
gris = PatternFill("solid", fgColor="6B7280")
for i, (t, w, req, ayuda) in enumerate(COLS, start=1):
    c = ws.cell(row=1, column=i, value=t + (" *" if req else ""))
    c.font = Font(bold=True, color="FFFFFF")
    c.fill = azul if req else gris
    c.alignment = Alignment(vertical="center")
    if ayuda:
        c.comment = Comment(ayuda, "Red de Autos")
    ws.column_dimensions[c.column_letter].width = w
ws.row_dimensions[1].height = 24
ws.freeze_panes = "B2"

# Listas en una hoja oculta
ls = wb.create_sheet("Listas")
for j, (k, vals) in enumerate(LISTAS.items(), start=1):
    ls.cell(row=1, column=j, value=k)
    for r, v in enumerate(vals, start=2):
        ls.cell(row=r, column=j, value=v)
ls.sheet_state = "hidden"

def col_of(title):
    return next(i for i, c in enumerate(COLS, start=1) if c[0] == title)

for j, (k, vals) in enumerate(LISTAS.items(), start=1):
    letra = ls.cell(row=1, column=j).column_letter
    dv = DataValidation(type="list", formula1=f"=Listas!${letra}$2:${letra}${len(vals)+1}", allow_blank=True,
                        showErrorMessage=True, errorTitle="Valor no válido", error=f"Elegí {k.lower()} de la lista.")
    ws.add_data_validation(dv)
    letra_ws = ws.cell(row=1, column=col_of(k)).column_letter
    dv.add(f"{letra_ws}2:{letra_ws}{FILAS + 1}")

for titulo, minimo, maximo in [("Año", 1950, 2100), ("Km", 0, 2000000), ("Puertas", 2, 5)]:
    dv = DataValidation(type="whole", operator="between", formula1=str(minimo), formula2=str(maximo), allow_blank=True,
                        showErrorMessage=True, errorTitle="Número no válido", error=f"{titulo}: un número entre {minimo} y {maximo}.")
    ws.add_data_validation(dv)
    l = ws.cell(row=1, column=col_of(titulo)).column_letter
    dv.add(f"{l}2:{l}{FILAS + 1}")
dv = DataValidation(type="decimal", operator="greaterThan", formula1="0", allow_blank=True, showErrorMessage=True,
                    errorTitle="Precio no válido", error="Precio: solo números, mayor a 0.")
ws.add_data_validation(dv)
l = ws.cell(row=1, column=col_of("Precio")).column_letter
dv.add(f"{l}2:{l}{FILAS + 1}")

# Instrucciones
ins = wb.create_sheet("Cómo cargar", 0)
texto = [
  ("Cómo cargar tus autos en Red de Autos", True),
  ("", False),
  ("1. Completá la hoja \"Autos\": una fila por auto. Las columnas azules son obligatorias.", False),
  ("2. Poné un Código distinto a cada auto (por ejemplo A001, A002 o tu código de stock).", False),
  ("3. Fotos (máximo 7 por auto, JPG, PNG o WebP). Ordenalas de una de estas dos formas:", False),
  ("     • Una carpeta por auto con el código como nombre:  Fotos/A001/1.jpg, Fotos/A001/2.jpg …", False),
  ("     • Todas juntas, con el código al principio del nombre:  A001-1.jpg, A001-2.jpg, A002-1.jpg …", False),
  ("   El orden sale del nombre del archivo y la primera foto es la portada.", False),
  ("4. En Red de Autos entrá a Mi cuenta → Publicar vehículo, subí este Excel y arrastrá la carpeta de fotos.", False),
  ("5. Revisá los autos y tocá Publicar.", False),
  ("", False),
  ("Para cambiar precios o datos, volvé a subir el Excel con el mismo Código: el auto se actualiza (no se duplica).", False),
  ("Si no subís fotos para un auto que ya estaba publicado, se mantienen las que tenía.", False),
]
for r, (t, b) in enumerate(texto, start=1):
    c = ins.cell(row=r, column=1, value=t)
    c.font = Font(bold=b, size=14 if b else 11, color="050B20")
ins.column_dimensions["A"].width = 110
wb.active = 1

out = ROOT / "app/public/plantilla-autos.xlsx"
wb.save(out)
print("ok", out, len(marcas), "marcas")
