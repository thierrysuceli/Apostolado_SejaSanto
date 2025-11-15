#!/usr/bin/env python3
"""Generate PWA icons from source image"""
from PIL import Image
import os

def generate_icons():
    input_path = 'public/app-icon.jpg'
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found")
        return
    
    # Open and convert to RGBA for PNG
    img = Image.open(input_path)
    
    # Generate 192x192
    icon_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save('public/icon-192.png', 'PNG')
    print("✓ Generated icon-192.png")
    
    # Generate 512x512
    icon_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save('public/icon-512.png', 'PNG')
    print("✓ Generated icon-512.png")
    
    print("\n✅ PWA icons generated successfully!")

if __name__ == '__main__':
    generate_icons()
