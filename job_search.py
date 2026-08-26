#!/usr/bin/env python3
"""
job_search.py 
----------------------------------------------------
Automated Job search using the firecrawl in the claude 
seraches using the queries in QUERIES in the include domains in INCLUDE_DOMAINS.

Setup:
  pip install requests
  Windows PowerShell:  setx FIRECRAWL_API_KEY "fc-your-key"   
  python english_first_job_search.py
  python english_first_job_search.py --selftest    # verify filters, no API calls
"""

import os
import re
import csv
import sys
import json
import time
import datetime as dt

import requests


API_URL = "https://api.firecrawl.dev/v2/search"
API_KEY = os.environ.get("FIRECRAWL_API_KEY", "")

# domains to include in the search. These are the boards that actually return NL postings for English-first queries.
INCLUDE_DOMAINS = [
    "nl.indeed.com",
    "iamexpat.nl",
    "undutchables.nl",
   # "honeypot.io",
    "magnet.me",
    "linkedin.com",
]

# queries to search
QUERIES = [
    "junior developer",
    "werkstudent developer",
    "junior React TypeScript developer",
    "junior Python Django developer",
    "part-time software developer",
    "graduate software developer English",
]

LIMIT_PER_QUERY = 8
SCRAPE_FULL_PAGE = True
SLEEP_BETWEEN = 2

SEEN_FILE = "seen_jobs.json"
CSV_FILE = "job_matches.csv"
# planned to mail me results
EMAIL_TO = ""
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")

# match filters
DUTCH_REQUIRED = [
    r"nederlandstalig", r"nederlandse taal", r"dutch language",
    r"fluent in dutch", r"dutch[- ]speaking", r"vloeiend nederlands",
    r"beheersing (van )?(de |het )?nederlands",
    r"nederlands.{0,25}(voertaal|machtig)", r"voertaal.{0,25}nederlands",
    r"(goede|uitstekende) (kennis van (het )?)?nederlands",
]
FULLTIME = [r"full[- ]?time", r"fulltime", r"voltijd",
            r"\b(32|36|38|40)\s*(uur|hours|u/w)\b"]
PARTTIME = [r"part[- ]?time", r"parttime", r"werkstudent", r"bijbaan", r"deeltijd",
            r"student", r"\b(8|10|12|16|20|24)\s*(uur|hours|u/w)\b"]
SENIOR_TITLE = [r"\bsenior\b", r"\bmedior\b", r"\blead\b", r"\bstaff\b",
                r"\barchitect\b", r"\bprincipal\b"]
TOO_MUCH_XP = [
    r"(minimaal\s*)?([3-9]|1\d)\s*\+?\s*(years?|jaar)[^.]{0,25}(experience|ervaring|werkervaring)",
    r"(experience|ervaring)[^.]{0,25}([3-9]|1\d)\s*\+?\s*(years?|jaar)",
]
POSITIVE = {
    "english": 3, "junior": 2, "werkstudent": 2, "bijbaan": 2, "part-time": 2,
    "parttime": 2, "student": 1, "remote": 2, "hybrid": 1, "react": 1,
    "typescript": 1, "python": 1, "django": 1, "node": 1, "javascript": 1,
}

# URLs that are board landing / search / category pages, NOT a single posting.
LISTING_PATTERNS = [
    r"/q-.*vacatures\.html",     # Indeed search-results page
    r"/jobs/?$", r"/jobs\?",     # generic jobs index / query page
    r"-jobs/?$",                 # LinkedIn "...-jobs" landing
    r"/vacatures/?$", r"/vacatures\.php",
    r"/student-jobs/?$", r"/career/?$", r"/careers/?$",
    r"/en/jobs/?$", r"/search", r"/browse",
]


def _any(patterns, text):
    return any(re.search(p, text, re.I) for p in patterns)


def looks_like_listing(url):
    """True if the URL is a board index/search/landing page rather than one posting."""
    return _any(LISTING_PATTERNS, url or "")


def classify(title, body):
    title, body = title or "", body or ""
    text = f"{title}\n{body}".lower()
    if _any(DUTCH_REQUIRED, text):
        return False, "requires Dutch", 0
    if _any(SENIOR_TITLE, title.lower()):
        return False, "senior/medior title", 0
    if _any(TOO_MUCH_XP, text):
        return False, "wants 3+ years", 0
    if _any(FULLTIME, text) and not _any(PARTTIME, text):
        return False, "full-time only", 0
    score = sum(w for kw, w in POSITIVE.items() if kw in text)
    if "english" not in text and not _any(PARTTIME, text):
        return False, "no english/part-time signal", score
    return True, "match", score


# ----------------------------------------------------------------------------
# FIRECRAWL
# ----------------------------------------------------------------------------
def firecrawl_search(query):
    payload = {
        "query": query,
        "limit": LIMIT_PER_QUERY,
        "sources": ["web"],
        "includeDomains": INCLUDE_DOMAINS,
    }
    if SCRAPE_FULL_PAGE:
        payload["scrapeOptions"] = {"formats": ["markdown"], "onlyMainContent": True}
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    for attempt in range(3):
        r = requests.post(API_URL, json=payload, headers=headers, timeout=120)
        if r.status_code == 429:
            wait = 15 * (attempt + 1)
            print(f"   rate-limited, waiting {wait}s...")
            time.sleep(wait)
            continue
        r.raise_for_status()
        return r.json()
    print("   giving up on this query after repeated rate limits")
    return {}


def extract_results(resp):
    data = resp.get("data", resp) if isinstance(resp, dict) else resp
    out = []
    if isinstance(data, dict):
        for key in ("web", "news", "developer", "results"):
            v = data.get(key)
            if isinstance(v, list):
                out.extend(v)
    elif isinstance(data, list):
        out = data
    return out


def result_text(r):
    body = ""
    for key in ("markdown", "content", "description", "snippet"):
        v = r.get(key)
        if isinstance(v, str):
            body += "\n" + v
    return body


def guess_company(title, url):
    for sep in (" - ", " | ", " @ ", " at "):
        if sep in (title or ""):
            return title.split(sep)[-1].strip()
    try:
        return re.sub(r"^www\.", "", url.split("/")[2])
    except Exception:
        return ""


# ----------------------------------------------------------------------------
# STORAGE
# ----------------------------------------------------------------------------
def load_seen():
    if os.path.exists(SEEN_FILE):
        with open(SEEN_FILE, encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def save_seen(seen):
    with open(SEEN_FILE, "w", encoding="utf-8") as f:
        json.dump(sorted(seen), f, indent=2)


def append_csv(rows):
    new = not os.path.exists(CSV_FILE)
    with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if new:
            w.writerow(["found", "score", "role", "company", "url"])
        w.writerows(rows)


def maybe_email(matches):
    if not (EMAIL_TO and SMTP_USER and SMTP_PASS):
        return
    import smtplib
    from email.mime.text import MIMEText
    lines = [f"[{s}] {t}  —  {c}\n{u}\n" for (_, s, t, c, u) in matches]
    msg = MIMEText("New English-first dev roles:\n\n" + "\n".join(lines))
    msg["Subject"] = f"{len(matches)} new dev role(s) — {dt.date.today()}"
    msg["From"], msg["To"] = SMTP_USER, EMAIL_TO
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)
    print(f"Emailed {len(matches)} match(es) to {EMAIL_TO}")


# ----------------------------------------------------------------------------
# SELF TEST
# ----------------------------------------------------------------------------
def selftest():
    ok = True

    listing_cases = [
        ("https://nl.indeed.com/viewjob?jk=abc123", False),
        ("https://nl.indeed.com/q-junior-developer-vacatures.html", True),
        ("https://www.linkedin.com/jobs/part-time-software-engineer-jobs", True),
        ("https://www.fenetre.nl/en/jobs/student-jobs", True),
        ("https://www.iamexpat.nl/career/jobs-netherlands/it/junior-dev-98431", False),
    ]
    for url, expected in listing_cases:
        got = looks_like_listing(url)
        flag = "OK " if got == expected else "FAIL"
        ok &= got == expected
        print(f"  [{flag}] listing={got!s:5}  <- {url}")

    print()
    class_cases = [
        ("Junior React Developer (English speaking), remote",
         "International team. Part-time possible, 16 hours. English is our working language.", True),
        ("Werkstudent Ontwikkelaar",
         "Je bent de Nederlandse taal machtig in woord en geschrift. 8 uur per week.", False),
        ("Senior Full-Stack Engineer",
         "You have 5+ years experience with React and Node. Full-time.", False),
        ("Full-Stack Developer", "40 uur per week. Fluent in Dutch required.", False),
        ("Graduate Python Developer",
         "English-speaking team, hybrid, part-time welcome for students.", True),
    ]
    for title, body, expected in class_cases:
        keep, reason, score = classify(title, body)
        flag = "OK " if keep == expected else "FAIL"
        ok &= keep == expected
        print(f"  [{flag}] keep={keep!s:5} ({reason}, score={score})  <- {title}")

    print("\nSelf-test", "passed." if ok else "FAILED.")
    return ok


# ----------------------------------------------------------------------------
# MAIN
# ----------------------------------------------------------------------------
def main():
    if "--selftest" in sys.argv:
        sys.exit(0 if selftest() else 1)
    if not API_KEY:
        print("No FIRECRAWL_API_KEY in environment.")
        print('Set it:  setx FIRECRAWL_API_KEY "fc-your-key"  (then reopen terminal)')
        sys.exit(1)

    seen = load_seen()
    new_matches, skipped_listings = [], 0

    for q in QUERIES:
        print(f"Searching: {q}")
        try:
            resp = firecrawl_search(q)
        except Exception as e:
            print(f"   error: {e}")
            continue
        for r in extract_results(resp):
            url = (r.get("url") or "").strip()
            if not url or url in seen:
                continue
            if looks_like_listing(url):
                skipped_listings += 1
                continue
            title = r.get("title") or url
            keep, reason, score = classify(title, result_text(r))
            if not keep:
                continue
            seen.add(url)
            new_matches.append((dt.date.today().isoformat(), score, title,
                                guess_company(title, url), url))
        time.sleep(SLEEP_BETWEEN)

    new_matches.sort(key=lambda x: x[1], reverse=True)

    if new_matches:
        append_csv(new_matches)
        save_seen(seen)
        print(f"\n{len(new_matches)} NEW match(es)  (skipped {skipped_listings} listing pages):\n")
        for _, score, title, company, url in new_matches:
            print(f"  [{score}] {title}  —  {company}\n       {url}")
        maybe_email(new_matches)
        print(f"\nSaved to {CSV_FILE}")
    else:
        print(f"\nNo new matches this run (skipped {skipped_listings} listing pages).")
        print("If this keeps happening, widen INCLUDE_DOMAINS or lower the filters.")


if __name__ == "__main__":
    main()