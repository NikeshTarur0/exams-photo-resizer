#!/usr/bin/env python3
"""
Python Server-Side Image Compressor Utility
Resizes and compresses images to meet exact exam criteria (pixel width/height and file size in KB).
"""

import sys
import os
import argparse
import json
import base64
from io import BytesIO

try:
    # pyrefly: ignore [missing-import]
    from PIL import Image, ImageOps
except ImportError:
    # Print JSON error output if PIL is missing
    print(json.dumps({
        "success": False,
        "error": "Pillow library is not installed. Run 'pip install Pillow' to enable server-side fallback."
    }))
    sys.exit(1)


def process_image(input_path, width, height, min_kb, max_kb, bg_color="white", format_out="JPEG"):
    """
    Resizes image to exact target dimensions and iteratively compresses quality
    to fit strictly within [min_kb, max_kb] range.
    """
    if not os.path.exists(input_path):
        return {"success": False, "error": f"Input file not found: {input_path}"}

    try:
        img = Image.open(input_path)
        
        # Convert image mode (RGBA/PNG transparent to RGB with white/custom background)
        if img.mode in ("RGBA", "P", "LA"):
            background = Image.new("RGB", img.size, bg_color if bg_color else (255, 255, 255))
            if img.mode == "RGBA":
                background.paste(img, mask=img.split()[3])
            else:
                background.paste(img)
            img = background
        else:
            img = img.convert("RGB")

        # High-quality Lanczos resampling to target width and height
        img_resized = img.resize((width, height), Image.Resampling.LANCZOS)

        # Iterative compression (Binary search on JPEG quality 5..95)
        low_q = 5
        high_q = 95
        best_buffer = None
        best_quality = 85
        best_size_kb = 0

        # Try high quality first
        for q in range(95, 4, -5):
            buffer = BytesIO()
            img_resized.save(buffer, format="JPEG", quality=q, optimize=True)
            size_kb = buffer.tell() / 1024.0

            if min_kb <= size_kb <= max_kb:
                best_buffer = buffer
                best_quality = q
                best_size_kb = size_kb
                break
            elif size_kb < min_kb and best_buffer is None:
                # File is smaller than min_kb even at high quality; keep highest quality
                best_buffer = buffer
                best_quality = q
                best_size_kb = size_kb
            elif size_kb <= max_kb and best_buffer is None:
                best_buffer = buffer
                best_quality = q
                best_size_kb = size_kb

        if best_buffer is None:
            # Fallback to binary search in 5..95 quality
            while low_q <= high_q:
                mid_q = (low_q + high_q) // 2
                buffer = BytesIO()
                img_resized.save(buffer, format="JPEG", quality=mid_q, optimize=True)
                size_kb = buffer.tell() / 1024.0

                best_buffer = buffer
                best_quality = mid_q
                best_size_kb = size_kb

                if size_kb > max_kb:
                    high_q = mid_q - 1
                elif size_kb < min_kb:
                    low_q = mid_q + 1
                else:
                    break

        best_buffer.seek(0)
        img_bytes = best_buffer.read()
        b64_str = base64.b64encode(img_bytes).decode("utf-8")

        return {
            "success": True,
            "width": width,
            "height": height,
            "quality": best_quality,
            "file_size_kb": round(best_size_kb, 2),
            "meets_min_kb": best_size_kb >= min_kb,
            "meets_max_kb": best_size_kb <= max_kb,
            "data_url": f"data:image/jpeg;base64,{b64_str}"
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


def main():
    parser = argparse.ArgumentParser(description="Indian Exam Image Compressor & Resizer Utility")
    parser.add_argument("--input", help="Path to input image file (e.g. photo.jpg)")
    parser.add_argument("--width", type=int, default=350, help="Target width in pixels (default: 350)")
    parser.add_argument("--height", type=int, default=450, help="Target height in pixels (default: 450)")
    parser.add_argument("--min-kb", type=float, default=20.0, help="Minimum file size in KB (default: 20.0)")
    parser.add_argument("--max-kb", type=float, default=50.0, help="Maximum file size in KB (default: 50.0)")
    parser.add_argument("--output", help="Optional output image path to save (e.g. resized.jpg)")

    args = parser.parse_args()

    # If executed with no arguments, display friendly guide and usage help
    if not args.input:
        print("================================================================")
        print(" 📸 Indian Exam Image Compressor Utility (Pillow Engine)")
        print("================================================================")
        print("\nNotice: No input image specified.")
        print("\nUsage Example:")
        print('  python compressor.py --input "my_photo.jpg" --width 350 --height 450 --min-kb 20 --max-kb 50 --output "resized_photo.jpg"\n')
        print("Preset Dimensions Quick Reference:")
        print("  - SSC CGL Photo      : --width 350 --height 450 --min-kb 20 --max-kb 50")
        print("  - SSC CGL Signature  : --width 280 --height 140 --min-kb 10 --max-kb 20")
        print("  - UPSC IAS Photo     : --width 500 --height 500 --min-kb 20 --max-kb 300")
        print("  - IBPS PO Photo      : --width 200 --height 230 --min-kb 20 --max-kb 50")
        print("================================================================")
        return

    result = process_image(args.input, args.width, args.height, args.min_kb, args.max_kb)

    if args.output and result.get("success"):
        b64_data = result["data_url"].split(",")[1]
        with open(args.output, "wb") as f:
            f.write(base64.b64decode(b64_data))
        result["saved_to"] = args.output

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
