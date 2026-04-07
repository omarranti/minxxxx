#!/usr/bin/env python3
"""
Fetch public Linktree profile data from the embedded Next.js __NEXT_DATA__ payload.

If __NEXT_DATA__ is missing or empty (bot blocking, layout change), try Playwright
or manual export instead of this script.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from urllib.parse import urlunparse, urlparse

import requests
from bs4 import BeautifulSoup

DEFAULT_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)


def normalize_linktree_url(raw: str) -> str:
    raw = raw.strip()
    if not re.match(r"^https?://", raw, re.I):
        username = raw.lstrip("/")
        raw = f"https://linktr.ee/{username}"
    parsed = urlparse(raw)
    if parsed.netloc.lower().replace("www.", "") not in ("linktr.ee", "linktree.com"):
        raise ValueError(f"Expected linktr.ee URL, got: {raw}")
    path = parsed.path.rstrip("/") or "/"
    first = path.split("/")[1] if path != "/" else ""
    if not first:
        raise ValueError("Missing Linktree username in URL")
    return f"https://linktr.ee/{first}"


def extract_page_props(next_data: dict) -> dict:
    """Resolve pageProps from common Next.js / Linktree layouts."""
    candidates = [
        lambda d: d["props"]["pageProps"],
        lambda d: d.get("props", {}).get("pageProps"),
    ]
    for getter in candidates:
        try:
            props = getter(next_data)
            if isinstance(props, dict) and props:
                return props
        except (KeyError, TypeError):
            continue
    top = list(next_data.keys()) if isinstance(next_data, dict) else []
    raise KeyError(
        f"Could not find props.pageProps in __NEXT_DATA__. Top-level keys: {top[:20]}"
    )


def fetch_page_props(username_or_url: str, timeout: float = 30.0) -> dict:
    url = normalize_linktree_url(username_or_url)
    resp = requests.get(
        url,
        headers={"User-Agent": DEFAULT_UA, "Accept-Language": "en-US,en;q=0.9"},
        timeout=timeout,
    )
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    script = soup.find("script", id="__NEXT_DATA__", type="application/json")
    if not script or not script.string:
        raise RuntimeError(
            "No __NEXT_DATA__ script found in HTML. The page may block this client "
            "or Linktree changed their layout; try Playwright or a browser export."
        )
    data = json.loads(script.string)
    return extract_page_props(data)


def fetch_linktree_page(full_url: str, timeout: float = 30.0) -> dict:
    """
    GET any linktr.ee (or linktree.com) URL. Returns pageProps when the page embeds
    a standard profile __NEXT_DATA__ payload; otherwise metadata only.
    """
    raw = full_url.strip()
    if not re.match(r"^https?://", raw, re.I):
        raw = "https://" + raw
    p = urlparse(raw)
    host = p.netloc.lower().split(":")[0].removeprefix("www.")
    if host not in ("linktr.ee", "linktree.com"):
        raise ValueError(f"Expected Linktree host, got {host!r}")
    path = p.path if p.path else "/"
    clean = urlunparse(("https", "linktr.ee", path, "", "", ""))
    resp = requests.get(
        clean,
        headers={"User-Agent": DEFAULT_UA, "Accept-Language": "en-US,en;q=0.9"},
        timeout=timeout,
        allow_redirects=True,
    )
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    out: dict = {
        "url_requested": raw,
        "url_fetched": resp.url,
        "status_code": resp.status_code,
    }
    title_tag = soup.title
    out["html_title"] = title_tag.get_text(strip=True) if title_tag else None
    script = soup.find("script", id="__NEXT_DATA__", type="application/json")
    if not script or not script.string:
        out["pageProps"] = None
        out["note"] = "no __NEXT_DATA__"
        return out
    try:
        data = json.loads(script.string)
    except json.JSONDecodeError as e:
        out["pageProps"] = None
        out["note"] = f"invalid __NEXT_DATA__ json: {e}"
        return out
    try:
        out["pageProps"] = extract_page_props(data)
    except KeyError:
        out["pageProps"] = None
        out["note"] = "no pageProps in __NEXT_DATA__"
        out["next_data_top_keys"] = list(data.keys())[:40]
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="Scrape public data from a Linktree profile.")
    parser.add_argument(
        "target",
        help="Linktree username (e.g. zyliaminx) or full URL (query params are stripped)",
    )
    parser.add_argument(
        "--out",
        "-o",
        metavar="FILE",
        help="Write JSON to this file instead of stdout",
    )
    args = parser.parse_args()

    try:
        page_props = fetch_page_props(args.target)
    except ValueError as e:
        print(f"error: {e}", file=sys.stderr)
        return 2
    except requests.RequestException as e:
        print(f"request failed: {e}", file=sys.stderr)
        return 3
    except (json.JSONDecodeError, KeyError, RuntimeError) as e:
        print(f"parse error: {e}", file=sys.stderr)
        return 4

    text = json.dumps(page_props, indent=2, ensure_ascii=False)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(text + "\n")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
