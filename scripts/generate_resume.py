"""Generate an interim, fact-checked one-page resume for the portfolio download."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "resume.pdf"
FONT_DIR = Path(r"C:\Windows\Fonts")
pdfmetrics.registerFont(TTFont("Segoe", str(FONT_DIR / "segoeui.ttf")))
pdfmetrics.registerFont(TTFont("SegoeSemi", str(FONT_DIR / "seguisb.ttf")))
pdfmetrics.registerFont(TTFont("SegoeBold", str(FONT_DIR / "segoeuib.ttf")))

INK = colors.HexColor("#17212C")
MUTED = colors.HexColor("#526474")
BLUE = colors.HexColor("#227BA1")
RULE = colors.HexColor("#D5E0E6")
W, H = A4
LEFT = 46
RIGHT = W - 46
c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
c.setTitle("Adhi Keshavan B - Resume")
c.setAuthor("Adhi Keshavan B")


def text(x, y, value, size=9, font="Segoe", color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, value)


def wrapped(x, y, value, width=RIGHT - LEFT, size=9, leading=13, color=MUTED, font="Segoe"):
    lines = simpleSplit(value, font, size, width)
    for line in lines:
        text(x, y, line, size, font, color)
        y -= leading
    return y


def heading(y, label):
    c.setStrokeColor(RULE)
    c.setLineWidth(.8)
    c.line(LEFT, y + 11, RIGHT, y + 11)
    text(LEFT, y - 2, label.upper(), 9, "SegoeBold", BLUE)
    return y - 23


def project(y, title, stack, detail):
    text(LEFT, y, title, 10.2, "SegoeBold")
    text(RIGHT - pdfmetrics.stringWidth(stack, "Segoe", 8), y, stack, 8, "Segoe", BLUE)
    y -= 17
    return wrapped(LEFT, y, detail, size=8.6, leading=12) - 13


c.setFillColor(BLUE)
c.rect(0, H - 9, W, 9, fill=1, stroke=0)
text(LEFT, H - 56, "ADHI KESHAVAN B", 25, "SegoeBold")
text(LEFT, H - 77, "Software Development  |  Backend Engineering  |  Data Analytics", 10, "SegoeSemi", BLUE)
text(LEFT, H - 101, "Trichy, Tamil Nadu  |  adhikeshavan050505@gmail.com", 8.7, "Segoe", MUTED)
text(LEFT, H - 116, "github.com/Adhi-Keshavan  |  linkedin.com/in/adhi-keshavan", 8.7, "Segoe", MUTED)
c.linkURL("mailto:adhikeshavan050505@gmail.com", (LEFT + 105, H - 104, RIGHT, H - 94), relative=0)
c.linkURL("https://github.com/Adhi-Keshavan", (LEFT, H - 120, LEFT + 165, H - 111), relative=0)
c.linkURL("https://www.linkedin.com/in/adhi-keshavan", (LEFT + 180, H - 120, RIGHT, H - 111), relative=0)

y = H - 158
y = heading(y, "Profile")
y = wrapped(LEFT, y, "Final-year B.Tech Computer Science and Business Systems student building interactive web experiences, backend prototypes, and reproducible data analysis. Interested in software development, backend, full stack, and analytics opportunities.", size=9, leading=13) - 17

y = heading(y, "Education")
text(LEFT, y, "B.Tech - Computer Science and Business Systems", 10, "SegoeBold")
text(RIGHT - pdfmetrics.stringWidth("2023 - 2027", "SegoeSemi", 9), y, "2023 - 2027", 9, "SegoeSemi", BLUE)
y -= 16
text(LEFT, y, "Saranathan College of Engineering", 9, "Segoe", MUTED)
y -= 30

y = heading(y, "Selected projects")
y = project(y, "Aitizen Realm", "React  |  Three.js  |  Blender", "Final-year team project cover experience. Credited contribution: 3D modeling, Blender assets, and shaders for an interactive narrative about autonomous agents.")
y = project(y, "PayReady India", "React  |  FastAPI  |  Python", "Merchant onboarding preparation prototype with readiness checklists and source-linked guidance. It is independent of PayPal and does not make KYC decisions.")
y = project(y, "Pressure Performance", "Python  |  Pandas  |  NumPy", "Cricket data pipeline for pre-ball pressure features and descriptive batting and bowling comparisons. Documented validation reports explicitly identify unsupported calculations; no final rankings are claimed.")
y -= 3

y = heading(y, "Technical skills")
skills = [
    ("Programming", "Python, Java, JavaScript, TypeScript"),
    ("Frontend", "React, HTML, CSS, Three.js"),
    ("Backend and data", "FastAPI, REST APIs, SQL, Pandas, NumPy, Matplotlib, Jupyter"),
    ("Tools", "Git, GitHub, VS Code, Blender, pytest"),
]
for label, items in skills:
    text(LEFT, y, label, 8.7, "SegoeSemi", INK)
    text(LEFT + 112, y, items, 8.7, "Segoe", MUTED)
    y -= 17
y -= 14

y = heading(y, "Documented internship certificates")
y = wrapped(LEFT, y, "NoviTech R&D Private Limited - one-month certificates in Data Analytics, Artificial Intelligence, and Machine Learning (June 18 - July 18, 2025).", size=8.7, leading=12)

if y < 55:
    raise RuntimeError(f"Resume content exceeds the safe page area: y={y}")

c.setStrokeColor(RULE)
c.line(LEFT, 43, RIGHT, 43)
text(LEFT, 27, "Portfolio resume prepared from verified project repositories and certificates.", 7.5, "Segoe", MUTED)
text(RIGHT - pdfmetrics.stringWidth("01 / 01", "Segoe", 7.5), 27, "01 / 01", 7.5, "Segoe", MUTED)
c.showPage()
c.save()
print(OUTPUT)
