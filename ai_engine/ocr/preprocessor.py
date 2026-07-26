"""
preprocessor.py — Image Preprocessing Utilities for Eligify OCR

Applies image enhancement algorithms (grayscale conversion, noise reduction,
CLAHE contrast adaptation, aspect-ratio scaling, and deskewing) using OpenCV and Pillow
to maximize OCR text extraction accuracy on identity and income documents.
"""

import cv2
import numpy as np
from PIL import Image
from typing import Union


def load_image(image_input: Union[str, bytes, Image.Image, np.ndarray]) -> np.ndarray:
    """
    Loads an image from file path, raw bytes, PIL Image, or NumPy array into a BGR NumPy array.

    Args:
        image_input: Image source (filepath, bytes, PIL.Image, or np.ndarray).

    Returns:
        np.ndarray: BGR image array.

    Raises:
        ValueError: If image input cannot be decoded or loaded.
    """
    if isinstance(image_input, str):
        img = cv2.imread(image_input)
        if img is None:
            raise ValueError(f"Unable to load image from path: '{image_input}'")
        return img

    if isinstance(image_input, bytes):
        nparr = np.frombuffer(image_input, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Unable to decode image from raw bytes.")
        return img

    if isinstance(image_input, Image.Image):
        # Convert PIL Image to OpenCV BGR array
        rgb_arr = np.array(image_input.convert("RGB"))
        return cv2.cvtColor(rgb_arr, cv2.COLOR_RGB2BGR)

    if isinstance(image_input, np.ndarray):
        if len(image_input.shape) == 2:
            return cv2.cvtColor(image_input, cv2.COLOR_GRAY2BGR)
        return image_input

    raise ValueError(f"Unsupported image input type: {type(image_input)}")


def convert_to_grayscale(img: np.ndarray) -> np.ndarray:
    """Converts a BGR or RGB image to 8-bit single-channel grayscale."""
    if len(img.shape) == 2:
        return img
    return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


def remove_noise(img: np.ndarray) -> np.ndarray:
    """Applies Gaussian blurring to reduce high-frequency background noise."""
    return cv2.GaussianBlur(img, (3, 3), 0)


def increase_contrast(img: np.ndarray) -> np.ndarray:
    """Applies CLAHE (Contrast Limited Adaptive Histogram Equalization) to enhance text readability."""
    gray = convert_to_grayscale(img)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(gray)


def resize_image(img: np.ndarray, target_width: int = 1200) -> np.ndarray:
    """Resizes image maintaining aspect ratio to reach a target width for optimal OCR resolution."""
    height, width = img.shape[:2]
    if width == 0 or width == target_width:
        return img

    aspect_ratio = height / float(width)
    target_height = int(target_width * aspect_ratio)
    
    interpolation = cv2.INTER_CUBIC if target_width > width else cv2.INTER_AREA
    return cv2.resize(img, (target_width, target_height), interpolation=interpolation)


def deskew_image(img: np.ndarray) -> np.ndarray:
    """Detects text skew angle and rotates the image to straighten text lines."""
    gray = convert_to_grayscale(img)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # Find non-zero pixel coordinates
    coords = np.column_stack(np.where(thresh > 0))
    if len(coords) < 10:
        return img

    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    # Ignore trivial angles (< 0.5 degrees)
    if abs(angle) < 0.5 or abs(angle) > 45:
        return img

    (h, w) = img.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(img, matrix, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated


def preprocess_image(
    image_input: Union[str, bytes, Image.Image, np.ndarray],
    target_width: int = 1200,
    enable_deskew: bool = True
) -> np.ndarray:
    """
    Complete modular preprocessing pipeline:
    1. Load image
    2. Resize to target resolution
    3. Convert to grayscale
    4. Apply noise reduction
    5. Enhance contrast via CLAHE
    6. Deskew text alignment (optional)

    Returns:
        np.ndarray: Enhanced grayscale image array ready for OCR text extraction.
    """
    img = load_image(image_input)
    img = resize_image(img, target_width=target_width)
    if enable_deskew:
        img = deskew_image(img)
    img = convert_to_grayscale(img)
    img = remove_noise(img)
    img = increase_contrast(img)
    return img
