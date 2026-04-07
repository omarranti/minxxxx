#!/usr/bin/env python3
"""
Batch-fetch a list of URLs: Linktree (any path), Canva published sites, and generic HTML pages.

Respect site terms and robots; use low volume and delays. Output is one JSON document.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

from scrape_linktree import DEFAULT_UA, fetch_linktree_page

DEFAULT_DELAY = 1.0


def strip_common_tracking(url: str) -> str:
    u = url.strip()
    if not u.lower().startswith(("http://", "https://")):
        u = "https://" + u
    p = urlparse(u)
    pairs = parse_qsl(p.query, keep_blank_values=True)
    filtered = [(k, v) for k, v in pairs if k != "fbclid" and not k.startswith("utm_")]
    q = urlencode(filtered)
    path = p.path if p.path else "/"
    return urlunparse((p.scheme, p.netloc, path, p.params, q, ""))


def meta_content(soup: BeautifulSoup, **kwargs) -> str | None:
    tag = soup.find("meta", **kwargs)
    if tag and tag.get("content"):
        return tag["content"].strip()
    return None


def fetch_generic_page(url: str, timeout: float = 30.0) -> dict:
    resp = requests.get(
        url,
        headers={"User-Agent": DEFAULT_UA, "Accept-Language": "en-US,en;q=0.9"},
        timeout=timeout,
        allow_redirects=True,
    )
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    title_el = soup.title
    return {
        "url_fetched": resp.url,
        "status_code": resp.status_code,
        "html_title": title_el.get_text(strip=True) if title_el else None,
        "meta_description": meta_content(soup, attrs={"name": "description"})
        or meta_content(soup, property="og:description"),
        "og_title": meta_content(soup, property="og:title"),
        "html_bytes": len(resp.content),
        "kind": "generic_html",
    }


def compact_linktree_props(props: dict | None) -> dict | None:
    if not props or not isinstance(props, dict):
        return None
    acc = props.get("account") or {}
    links = acc.get("links") or []
    slim = []
    for L in links:
        if not isinstance(L, dict):
            continue
        slim.append(
            {
                "title": L.get("title"),
                "url": L.get("url"),
                "type": L.get("type"),
            }
        )
    return {
        "username": acc.get("username"),
        "pageTitle": acc.get("pageTitle"),
        "description": acc.get("description"),
        "links": slim,
    }


def classify_host(url: str) -> str:
    p = urlparse(url)
    host = p.netloc.lower().split(":")[0].removeprefix("www.")
    if host in ("linktr.ee", "linktree.com"):
        return "linktree"
    if host.endswith(".my.canva.site") or host.endswith(".canva.site"):
        return "canva"
    return "other"


def scrape_one(url: str, timeout: float, full_linktree: bool) -> dict:
    canonical = strip_common_tracking(url)
    kind = classify_host(canonical)
    base = {"source_url": url.strip(), "canonical_url": canonical, "class": kind}

    if kind == "linktree":
        lt = fetch_linktree_page(canonical, timeout=timeout)
        props = lt.get("pageProps")
        if full_linktree:
            payload = props
        else:
            payload = compact_linktree_props(props)
        return {
            **base,
            "ok": True,
            "html_title": lt.get("html_title"),
            "url_fetched": lt.get("url_fetched"),
            "status_code": lt.get("status_code"),
            "note": lt.get("note"),
            "next_data_top_keys": lt.get("next_data_top_keys"),
            "data": payload,
        }

    gen = fetch_generic_page(canonical, timeout=timeout)
    gen["kind"] = "canva_site" if kind == "canva" else gen.get("kind", "generic_html")
    return {**base, "ok": True, **gen}


def load_urls(path: Path) -> list[str]:
    lines = path.read_text(encoding="utf-8").splitlines()
    return [ln.strip() for ln in lines if ln.strip() and not ln.strip().startswith("#")]


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Batch-scrape Linktree, Canva sites, and generic pages from a URL list."
    )
    parser.add_argument(
        "--urls-file",
        "-f",
        type=Path,
        default=Path("urls.txt"),
        help="Text file with one URL per line (default: ./urls.txt)",
    )
    parser.add_argument(
        "--out",
        "-o",
        type=Path,
        default=Path("batch_results.json"),
        help="Write combined JSON results here",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=DEFAULT_DELAY,
        help=f"Seconds between requests (default: {DEFAULT_DELAY})",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=30.0,
        help="Per-request timeout in seconds",
    )
    parser.add_argument(
        "--full-linktree",
        action="store_true",
        help="Store full Linktree pageProps instead of compact username/title/links",
    )
    args = parser.parse_args()

    if not args.urls_file.is_file():
        print(f"error: urls file not found: {args.urls_file}", file=sys.stderr)
        return 2

    urls = load_urls(args.urls_file)
    results: list[dict] = []
    for i, url in enumerate(urls):
        if i > 0:
            time.sleep(args.delay)
        row: dict = {"source_url": url.strip(), "canonical_url": strip_common_tracking(url)}
        try:
            row.update(scrape_one(url, timeout=args.timeout, full_linktree=args.full_linktree))
        except requests.RequestException as e:
            row["ok"] = False
            row["error"] = f"request: {e}"
        except ValueError as e:
            row["ok"] = False
            row["error"] = str(e)
        except Exception as e:
            row["ok"] = False
            row["error"] = f"{type(e).__name__}: {e}"
        results.append(row)
        err = row.get("error")
        print(row["canonical_url"], "OK" if row.get("ok") else f"ERR {err}", flush=True)

    doc = {
        "count": len(results),
        "full_linktree": args.full_linktree,
        "delay_seconds": args.delay,
        "results": results,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {args.out}", file=sys.stderr)
    failed = sum(1 for r in results if not r.get("ok"))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
