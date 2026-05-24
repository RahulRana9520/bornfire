import os
from PIL import Image

def crop_and_resize(image_path):
    print(f"Processing {image_path}")
    img = Image.open(image_path).convert("RGBA")
    
    # Get bounding box of non-transparent pixels
    # Image.getbbox() works on the alpha channel if the image has RGBA mode
    bbox = img.getbbox()
    if bbox:
        # Crop to the bounding box
        cropped = img.crop(bbox)
        
        # Calculate new size to fit within original canvas size
        # Original size
        original_size = img.size
        
        # Find the maximum dimension of the cropped image
        max_dim = max(cropped.size)
        
        # Create a new blank transparent image of the same max dimension
        # to ensure it's a square
        square_cropped = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
        
        # Paste the cropped image into the center of the square
        offset = ((max_dim - cropped.size[0]) // 2, (max_dim - cropped.size[1]) // 2)
        square_cropped.paste(cropped, offset)
        
        # Resize to original size (e.g., 512x512)
        # Using a slight padding so it doesn't touch the absolute edges
        padding = int(original_size[0] * 0.05) # 5% padding
        target_size = original_size[0] - 2 * padding
        
        resized = square_cropped.resize((target_size, target_size), Image.Resampling.LANCZOS)
        
        # Create the final image
        final_img = Image.new("RGBA", original_size, (0, 0, 0, 0))
        final_img.paste(resized, (padding, padding))
        
        final_img.save(image_path, "PNG")
        print(f"Saved optimized {image_path}")
    else:
        print(f"No bounding box found for {image_path} (maybe fully transparent?)")

base_dir = r"e:\TaskSage2.0\focus-flow-main\frontend\public"
files = ["app.png", "logo.png", "pwa-512x512.png"]

for f in files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        crop_and_resize(path)
