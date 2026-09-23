import os
from PIL import Image, ImageDraw

out_dir = r"c:\Dev\hackathons\SatyaCheck_Website\SatyaCheck_Website\public\videos"
os.makedirs(out_dir, exist_ok=True)

width, height = 720, 1280
cream_color = (253, 250, 231)  # #FDFAE7
cobalt_border = (30, 43, 250, 50)  # faint cobalt outline
cobalt_accent = (30, 43, 250, 180)

scenes = [
    ("scene-1-call", "Scene 1: The Call"),
    ("scene-2-clone", "Scene 2: Voice Clone"),
    ("scene-3-pressure", "Scene 3: The Pressure"),
    ("scene-4-check", "Scene 4: The Check"),
    ("scene-5-relief", "Scene 5: The Relief")
]

for filename, label in scenes:
    img = Image.new("RGBA", (width, height), cream_color + (255,))
    draw = ImageDraw.Draw(img)
    
    # Outer faint cobalt outline
    margin = 24
    draw.rounded_rectangle(
        [(margin, margin), (width - margin, height - margin)],
        radius=40,
        outline=(30, 43, 250, 40),
        width=3
    )
    
    # Subtle inner card simulation
    inner_margin = 80
    draw.rounded_rectangle(
        [(inner_margin, height // 3), (width - inner_margin, 2 * height // 3)],
        radius=28,
        fill=(30, 43, 250, 12),
        outline=(30, 43, 250, 60),
        width=2
    )
    
    # Small dot accent in center
    cx, cy = width // 2, height // 2
    r = 20
    draw.ellipse([(cx - r, cy - r), (cx + r, cy + r)], fill=(30, 43, 250, 200))
    
    out_path = os.path.join(out_dir, f"{filename}.webp")
    # Save as webp
    img.convert("RGB").save(out_path, "WEBP", quality=90)
    print(f"Saved: {out_path}")

print("All 5 placeholder posters generated successfully.")
