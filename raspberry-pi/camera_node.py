#!/usr/bin/env python3
"""
Thalir Raspberry Pi Camera Node
Captures crop leaf photos using RPi Camera Module or USB webcam
and posts image files to the Thalir AI Disease Detection endpoint (/api/v1/predict).
"""

import time
import os
import argparse
import requests

try:
    import cv2
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False


def capture_leaf_photo(output_path: str = "temp_leaf.jpg") -> bool:
    """Capture photo frame using USB webcam or RPi camera via OpenCV."""
    if OPENCV_AVAILABLE:
        cam = cv2.VideoCapture(0)
        if not cam.isOpened():
            print("[!] OpenCV camera index 0 could not be opened.")
            return False
        ret, frame = cam.read()
        cam.release()
        if ret:
            cv2.imwrite(output_path, frame)
            return True
    print("[!] Camera hardware unavailable. Please verify USB webcam or RPi Camera CSI ribbon.")
    return False


def upload_leaf_for_ai_diagnosis(backend_url: str, image_path: str, crop_type: str = None, plant_id: int = None):
    endpoint = f"{backend_url.rstrip('/')}/api/v1/predict/"
    if not os.path.exists(image_path):
        print(f"[!] Target leaf image '{image_path}' does not exist.")
        return

    print(f"[*] Transmitting leaf image '{image_path}' to AI endpoint: {endpoint}")
    with open(image_path, "rb") as f:
        files = {"file": (os.path.basename(image_path), f, "image/jpeg")}
        data = {}
        if crop_type: data["crop_type"] = crop_type
        if plant_id: data["plant_id"] = str(plant_id)

        try:
            res = requests.post(endpoint, files=files, data=data, timeout=15)
            if res.status_code == 200:
                result = res.json()
                print("[+] --- AI Diagnosis Received ---")
                pred = result.get("prediction", {})
                print(f"    Crop: {pred.get('crop')} | Condition: {pred.get('disease')}")
                print(f"    Status: {pred.get('status')} | Confidence: {pred.get('confidence')}%")
                print(f"    Recommendation: {pred.get('recommendation')}")
            else:
                print(f"[!] Server returned status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"[!] Camera post transmission error: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Thalir RPi Camera AI Diagnosis Capture Node")
    parser.add_argument("--backend", type=str, default="http://127.0.0.1:8000", help="Thalir Backend URL")
    parser.add_argument("--image", type=str, default=None, help="Path to static image file if testing")
    parser.add_argument("--crop", type=str, default="Tomato", help="Target crop type (Tomato, Potato, Corn, Apple, Grape)")
    parser.add_argument("--plant-id", type=int, default=None, help="Target registered plant entity ID")
    parser.add_argument("--interval", type=int, default=0, help="Continuous loop interval in seconds (0 for single run)")
    args = parser.parse_args()

    def run_once():
        img_path = args.image
        if not img_path:
            img_path = "captured_leaf.jpg"
            success = capture_leaf_photo(img_path)
            if not success:
                return

        upload_leaf_for_ai_diagnosis(args.backend, img_path, crop_type=args.crop, plant_id=args.plant_id)

    if args.interval > 0:
        print(f"[*] Starting Thalir RPi Camera Loop (Interval: {args.interval}s)")
        while True:
            run_once()
            time.sleep(args.interval)
    else:
        run_once()
