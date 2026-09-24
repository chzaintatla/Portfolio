import re
import unicodedata

import bleach

ALLOWED_TAGS = [
    "p", "br", "hr", "h2", "h3", "h4", "strong", "em", "u", "s", "code", "pre", "blockquote",
    "ul", "ol", "li", "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
]
ALLOWED_ATTRS = {
    "a": ["href", "title", "rel", "target"],
    "img": ["src", "alt", "title", "width", "height", "loading"],
    "code": ["class"],
    "pre": ["class"],
}


def clean_html(html: str | None) -> str | None:
    """Strip anything the rich-text editor should not produce (scripts, handlers, iframes…)."""
    if html is None:
        return None
    return bleach.clean(
        html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS,
        protocols=["http", "https", "mailto"], strip=True,
    )


def plain_text(value: str | None, limit: int | None = None) -> str | None:
    if value is None:
        return None
    text = bleach.clean(value, tags=[], strip=True).strip()
    return text[:limit] if limit else text


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    return re.sub(r"[-\s_]+", "-", value)[:150] or "item"


def reading_minutes(html: str) -> int:
    words = len((plain_text(html) or "").split())
    return max(1, round(words / 220))
