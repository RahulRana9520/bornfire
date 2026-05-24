import os
from PIL import Image

def remove_white_bg(image_path):
    print(f"Processing {image_path}")
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    
    newData = []
    for item in data:
        # Check if the pixel is white or very close to white
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0)) # transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(image_path, "PNG")
    print(f"Saved {image_path}")

base_dir = r"e:\TaskSage2.0\focus-flow-main\frontend\public"
files = ["app.png", "logo.png", "pwa-512x512.png"]

for f in files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        remove_white_bg(path)
