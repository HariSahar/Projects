These are some of the projects I had done so far
job-search-pipeline

A terminal tool that automates a job search: it searches job boards via the Firecrawl API, scrapes the full postings, filters them by my own rules, and remembers what it has shown so each run surfaces only new roles. Built and run through Claude Code with an MCP integration.

What it does
Searches job boards (scoped via includeDomains) and scrapes each full posting.
Filters out roles that require Dutch, are full-time, or want 3+ years / senior.
Scores the rest by fit and deduplicates across runs.
Writes matches to a CSV (optional email digest).
Tech

Python · Firecrawl API · requests · Claude Code + MCP.

Usage
bash
pip install requests
setx FIRECRAWL_API_KEY "fc-your-key"   # macOS/Linux: export FIRECRAWL_API_KEY="fc-your-key"

python job_search.py              # run the search
python job_search.py --selftest   # verify filters, no API calls

Boards, queries, and filters are configurable at the top of the file. The API key is read from the environment — never committed.
