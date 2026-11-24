"""Generate 1200x630 monochrome social cards into public/og/ from existing
site photography (public/media/v8) + the ARKA mark. Run from repo root:
    python3 scripts/assets/generate-og.py
Needs Pillow and ImageMagick (for the SVG logo)."""
import os, re, subprocess, tempfile, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageOps, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = lambda *a: os.path.join(ROOT, *a)
OUT = P("public", "og"); os.makedirs(OUT, exist_ok=True)
HEAD = ImageFont.truetype(P("public/fonts/Michroma-Regular.ttf"), 50)
SMALL = ImageFont.truetype(P("public/fonts/Michroma-Regular.ttf"), 17)
BODY = ImageFont.truetype(P("public/fonts/Exo-VariableFont_wght.ttf"), 26)

logo_png = os.path.join(tempfile.mkdtemp(), "logo.png")
subprocess.run(["magick", "-background", "none", "-density", "300", P("public/arka-logo.svg"), "-resize", "92x92", logo_png], check=True)
LOGO = Image.open(logo_png).convert("RGBA")

def card(name, photo, eyebrow, title, sub="AI, Software & Digital Growth · Greater Toronto Area"):
    im = Image.open(P("public/media/v8", f"{photo}-1600.webp")).convert("RGB")
    im = ImageOps.fit(im, (1200, 630), Image.LANCZOS)
    im = ImageOps.grayscale(im).convert("RGB")
    im = ImageEnhance.Brightness(ImageEnhance.Contrast(im).enhance(1.1)).enhance(0.45)
    # left-to-right shade for legibility
    shade = Image.linear_gradient("L").rotate(90).resize((1200, 630))
    shade = ImageOps.invert(shade).point(lambda v: int(v * 0.85))
    im = Image.composite(Image.new("RGB", im.size, (5, 6, 10)), im, shade)
    d = ImageDraw.Draw(im)
    d.rectangle([40, 40, 1160, 590], outline=(255, 255, 255, 40), width=1)
    im.paste(LOGO, (72, 72), LOGO)
    d.text((182, 100), "ARKA", font=SMALL, fill=(245, 245, 247), anchor="lm")
    d.text((182, 126), "arkalegion.com", font=SMALL, fill=(150, 154, 162), anchor="lm")
    d.text((72, 250), eyebrow.upper(), font=SMALL, fill=(170, 174, 182))
    lines = textwrap.wrap(title, 26)[:3]
    y = 290
    for ln in lines:
        d.text((72, y), ln, font=HEAD, fill=(245, 245, 247)); y += 66
    d.line([72, y + 20, 132, y + 20], fill=(230, 233, 238), width=2)
    d.text((72, y + 40), sub, font=BODY, fill=(190, 194, 200))
    im.save(os.path.join(OUT, f"{name}.jpg"), "JPEG", quality=84, optimize=True, progressive=True)

PAGES = [
    ("home", "orbit-day", "AI · Software · Growth", "AI, Software & Digital Growth."),
    ("services", "orbit-night", "Services", "Four disciplines, one growth system."),
    ("service-ai-solutions", "ai-datacentre", "AI Solutions", "AI systems that do the repetitive work."),
    ("service-web-development", "web-code", "Web & Software Development", "Websites and platforms built to perform."),
    ("service-digital-marketing", "mkt-analytics", "Digital Marketing", "Marketing that compounds into growth."),
    ("service-technology-consulting", "con-circuit", "Technology Consulting", "Clear technology decisions, built to scale."),
    ("local-ai-automation-toronto", "ai-datacentre", "Toronto & GTA", "AI automation for Toronto businesses."),
    ("local-web-design-toronto", "web-code", "Toronto & GTA", "Web design and development in Toronto."),
    ("local-custom-software-development-toronto", "con-blueprint", "Toronto & GTA", "Custom software development for Toronto teams."),
    ("local-digital-marketing-gta", "mkt-analytics", "Mississauga · Vaughan · Markham", "Digital marketing across the GTA."),
    ("work", "night-sky", "Work", "Selected client builds."),
    ("work-royal-caspian", "case-luxury-interior", "Case study · Web Platform", "Royal Caspian"),
    ("work-healexa-clinic", "case-rehab", "Case study · Healthcare Website", "Healexa Clinic"),
    ("work-mehri-noshad", "case-toronto", "Case study · Real Estate Website", "Mehri Noshad"),
    ("work-six-side-marketing", "case-edit-suite", "Case study · Agency Website", "Six Side Marketing"),
    ("work-noctavius-aviation", "case-jet", "Case study · Aviation Website", "Noctavius Aviation"),
    ("about", "orbit-day", "About", "The ARKA Studio."),
    ("contact", "aurora", "Contact", "Let's build what's next."),
    ("blog", "night-sky", "Journal", "Guides on AI, web & digital growth."),
]
for a in PAGES: card(*a)

# one card per Journal article, titled from its <h1>
BLOG_PHOTO = {"ai": "ai-network", "web": "web-desk", "market": "mkt-growth", "lead": "mkt-dashboard", "software": "con-blueprint", "aoda": "laptop-glow"}
bdir = P("public", "blog")
for f in sorted(os.listdir(bdir)):
    if not f.endswith(".html"): continue
    s = open(os.path.join(bdir, f)).read()
    h1 = re.sub("<[^>]+>", "", re.search(r"<h1>(.*?)</h1>", s, re.S).group(1)).replace("&amp;", "&").strip()
    h1 = re.split(r":\s", h1)[0] if len(h1) > 70 else h1
    slug = f[:-5]
    key = next((v for k, v in BLOG_PHOTO.items() if k in slug), "ai-3d")
    card(f"blog-{slug}", key, "ARKA Journal", h1)
print("og cards:", len(os.listdir(OUT)))
