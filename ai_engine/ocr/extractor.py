"""
extractor.py — OCR Text Extraction Module for Eligify

Uses EasyOCR (with PyTesseract fallback) to extract raw text and bounding-box confidence scores
from preprocessed document images.
"""

import time
import numpy as np
from typing import Union, Tuple, List, Optional
from PIL import Image
from ai_engine.ocr.preprocessor import preprocess_image

_EASYOCR_READER = None


def get_easyocr_reader(languages: Optional[List[str]] = None):
    """Lazy-loads and caches the EasyOCR Reader instance to avoid reload overhead."""
    global _EASYOCR_READER
    if _EASYOCR_READER is None:
        try:
            import easyocr
            langs = languages or ["en"]
            _EASYOCR_READER = easyocr.Reader(langs, gpu=False)
        except Exception as e:
            _EASYOCR_READER = False
    return _EASYOCR_READER


def extract_text_easyocr(img: np.ndarray) -> Tuple[str, float, List[dict]]:
    """Extracts text using EasyOCR."""
    reader = get_easyocr_reader()
    if not reader:
        raise RuntimeError("EasyOCR is not available.")

    results = reader.readtext(img)
    text_lines = []
    confidences = []
    details = []

    for bbox, text, conf in results:
        clean_text = str(text).strip()
        if clean_text:
            text_lines.append(clean_text)
            conf_val = float(conf) if conf is not None else 0.8
            confidences.append(conf_val)
            details.append({"text": clean_text, "confidence": conf_val, "bbox": [list(pt) for pt in bbox]})

    full_text = "\n".join(text_lines)
    avg_confidence = round(float(np.mean(confidences)), 2) if confidences else 0.0
    return full_text, avg_confidence, details


def extract_text_tesseract(img: np.ndarray) -> Tuple[str, float, List[dict]]:
    """Extracts text using PyTesseract as a fallback engine."""
    import pytesseract

    data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
    text_lines = []
    confidences = []
    details = []

    n_boxes = len(data["text"])
    for i in range(n_boxes):
        word = str(data["text"][i]).strip()
        conf = float(data["conf"][i])
        if word and conf > 0:
            text_lines.append(word)
            norm_conf = round(conf / 100.0, 2)
            confidences.append(norm_conf)
            details.append({"text": word, "confidence": norm_conf})

    full_text = " ".join(text_lines)
    avg_confidence = round(float(np.mean(confidences)), 2) if confidences else 0.0
    return full_text, avg_confidence, details


def extract_text(
    image_input: Union[str, bytes, Image.Image, np.ndarray],
    preprocess: bool = True,
    use_fallback: bool = True
) -> Tuple[str, float, float, List[dict]]:
    """
    Extracts text from a document image using OCR engines with automatic fallback.

    Args:
        image_input: Filepath, bytes, PIL Image, or NumPy array.
        preprocess: Whether to run preprocessing pipeline prior to OCR.
        use_fallback: If True, tries PyTesseract if EasyOCR fails or is unavailable.

    Returns:
        Tuple[full_text, avg_confidence, processing_time_ms, detailed_lines]
    """
    start_time = time.time()

    if preprocess:
        processed_img = preprocess_image(image_input)
    else:
        from ai_engine.ocr.preprocessor import load_image
        processed_img = load_image(image_input)

    # Attempt EasyOCR extraction
    try:
        text, conf, details = extract_text_easyocr(processed_img)
        elapsed_ms = round((time.time() - start_time) * 1000, 2)
        if text.strip():
            return text, conf, elapsed_ms, details
    except Exception:
        pass

    # Fallback to PyTesseract if enabled
    if use_fallback:
        try:
            text, conf, details = extract_text_tesseract(processed_img)
            elapsed_ms = round((time.time() - start_time) * 1000, 2)
            return text, conf, elapsed_ms, details
        except Exception:
            pass

    # If both engines are unavailable or return no text, return empty fallback result
    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    return "", 0.0, elapsed_ms, []
