import os
from PIL import Image, ImageDraw

SAMPLE_DIR = os.path.join(os.path.dirname(__file__), "sample_images")
os.makedirs(SAMPLE_DIR, exist_ok=True)


def create_healthy_leaf():
    img = Image.new("RGB", (400, 400), color=(240, 248, 240))
    draw = ImageDraw.Draw(img)
    # Leaf shape
    draw.polygon([(200, 40), (320, 160), (280, 320), (200, 360), (120, 320), (80, 160)], fill=(34, 139, 34))
    # Veins
    draw.line([(200, 40), (200, 360)], fill=(60, 179, 113), width=4)
    draw.line([(200, 150), (280, 110)], fill=(60, 179, 113), width=2)
    draw.line([(200, 150), (120, 110)], fill=(60, 179, 113), width=2)
    draw.line([(200, 240), (270, 210)], fill=(60, 179, 113), width=2)
    draw.line([(200, 240), (130, 210)], fill=(60, 179, 113), width=2)
    img.save(os.path.join(SAMPLE_DIR, "tomato_healthy.jpg"))


def create_early_blight_leaf():
    img = Image.new("RGB", (400, 400), color=(245, 245, 240))
    draw = ImageDraw.Draw(img)
    # Leaf shape
    draw.polygon([(200, 40), (320, 160), (280, 320), (200, 360), (120, 320), (80, 160)], fill=(46, 117, 46))
    # Veins
    draw.line([(200, 40), (200, 360)], fill=(80, 160, 80), width=4)
    # Concentric ring blight spots
    draw.ellipse([(140, 180), (190, 230)], fill=(101, 67, 33), outline=(218, 165, 32), width=3)
    draw.ellipse([(155, 195), (175, 215)], fill=(50, 30, 15))
    draw.ellipse([(230, 120), (275, 165)], fill=(101, 67, 33), outline=(218, 165, 32), width=3)
    draw.ellipse([(245, 135), (260, 150)], fill=(50, 30, 15))
    draw.ellipse([(160, 270), (210, 315)], fill=(101, 67, 33), outline=(218, 165, 32), width=3)
    img.save(os.path.join(SAMPLE_DIR, "tomato_early_blight.jpg"))


def create_late_blight_leaf():
    img = Image.new("RGB", (400, 400), color=(240, 240, 235))
    draw = ImageDraw.Draw(img)
    # Leaf shape
    draw.polygon([(200, 40), (320, 160), (280, 320), (200, 360), (120, 320), (80, 160)], fill=(60, 100, 50))
    # Veins
    draw.line([(200, 40), (200, 360)], fill=(80, 130, 70), width=4)
    # Dark water-soaked lesions with white mold border
    draw.polygon([(110, 140), (170, 120), (200, 190), (130, 210)], fill=(40, 25, 15), outline=(220, 220, 210), width=3)
    draw.polygon([(210, 210), (290, 200), (270, 280), (200, 260)], fill=(35, 20, 10), outline=(220, 220, 210), width=3)
    img.save(os.path.join(SAMPLE_DIR, "potato_late_blight.jpg"))


def create_rust_leaf():
    img = Image.new("RGB", (400, 400), color=(245, 245, 240))
    draw = ImageDraw.Draw(img)
    # Corn leaf blade
    draw.polygon([(160, 20), (240, 20), (250, 380), (150, 380)], fill=(70, 140, 50))
    draw.line([(200, 20), (200, 380)], fill=(110, 180, 90), width=5)
    # Rust pustules
    for y in [60, 100, 140, 190, 230, 280, 320]:
        draw.ellipse([(170, y), (188, y+14)], fill=(184, 115, 51), outline=(210, 105, 30), width=2)
        draw.ellipse([(215, y+20), (232, y+34)], fill=(184, 115, 51), outline=(210, 105, 30), width=2)
    img.save(os.path.join(SAMPLE_DIR, "corn_common_rust.jpg"))


if __name__ == "__main__":
    create_healthy_leaf()
    create_early_blight_leaf()
    create_late_blight_leaf()
    create_rust_leaf()
    print("[*] Sample leaf test images created in ai-model/sample_images/")
