# Board Game Night — Project Context

## What this is
A board game group tracker. The user tells Claude about each game night in plain English, and Claude updates Airtable and the dashboard directly — no script steps, no manual runs.

## Architecture
- **Database**: Airtable (source of truth for all data)
- **Dashboard**: Static HTML on GitHub Pages — reads/writes Airtable directly via REST API
- **Apps Script**: Retired. No longer used.

## Airtable
- Base ID: `appMG6K6WduzpxNM4`
- Token: stored in dashboard.html (AT_TOKEN constant) — do not log here
- Base URL: `https://api.airtable.com/v0/appMG6K6WduzpxNM4`

### Tables
| Table | ID | Primary field |
|---|---|---|
| Games Library | tblhMuIz19HxQ1Zvv | Game Name |
| Play Log | tbl8jFp1t2SvunYKk | Date |
| Expansions | tblLwJfd0oCNK6XPM | Expansion Name |
| Team Log | tbl5Yi01dkX7DdiX8 | Date |

### Games Library fields
Game Name | Min Players | Max Players | Expansion Min | Expansion Max | Owners | Genre | BGG URL | Rules URL | Tutorial URL | Notes | Favorite

Expansion Min / Expansion Max: the player count range the expansion adds (additive with base range).
Dashboard unions expansion range with base range for filtering and display.
- Dune: Imperium base 1-4, Uprising adds 6-player mode → Expansion Min=6, Expansion Max=6 → displays "1–4, 6"
- A game base 2-4, expansion extends to 6 → Expansion Min=5, Expansion Max=6 → displays "2–6"

### Play Log fields
Date | Game | Players (comma-separated) | 1st Place | 2nd Place | 3rd Place | Duration (mins) | Notes

### Expansions fields
Expansion Name | Game | Owned (checkbox) | Owner

### Team Log fields
Date | Game | Team 1 (comma-separated) | Team 2 (comma-separated) | T1 Score | T2 Score | Winner ("Team 1" or "Team 2") | Duration (mins) | Notes

## How Claude makes changes
Claude owns ALL Airtable changes — records AND schema. The user never touches Airtable.

### Record operations (via Python scripts or at.py)
- **Read**: GET `{base_url}/{table}?pageSize=100&...`
- **Write**: POST `{base_url}/{table}` with `{ records: [{ fields: {...} }] }`
- **Update**: PATCH `{base_url}/{table}/{recordId}` with `{ fields: {...} }`
- **Delete**: DELETE `{base_url}/{table}/{recordId}`

### Schema operations (adding/modifying fields)
- **Add field**: POST `https://api.airtable.com/v0/meta/bases/{baseId}/tables/{tableId}/fields`
  Body: `{ "name": "Field Name", "type": "multilineText" | "singleLineText" | "number" | "checkbox" | "url" | ... }`
- Token has `schema.bases:write` permission — use it whenever a new field is needed.
- Always update CLAUDE.md field lists after adding a field.

No Apps Script. No paste-and-deploy. Claude just does it.

## Dashboard
URL: https://llofte.github.io/board-game-night/dashboard.html
File: /Users/llofte/Desktop/Board Game Night/dashboard.html

## Regular players
Dave, Leanna, Peter, Mark, Jay, Ben, Shannon, Marc, Heather, Nathan

## How to log a game night
User describes it in plain English. Claude:
1. Parses game, date, players, result
2. Creates a record in the Play Log table via Airtable API
3. Confirms what was logged

For team games (Codenames, Dune: Imperium w/ Uprising): Claude creates a record in the Team Log table.

## Game recommendations
When asked, Claude:
1. Reads Games Library from Airtable
2. Filters by player count
3. Cross-references Play Log to find games not played recently
4. Suggests 2-3 options

## Roadmap
- Step 1: Google Sheet as shared record ✅ (retired)
- Step 2: Static HTML dashboard on GitHub Pages ✅
- Step 3: Airtable as live database ✅ (current)

## Notes
- User never touches Airtable directly — Claude handles ALL data changes AND schema changes (adding fields, etc.)
- User never edits code — Claude handles all code changes
- User only runs: `git push` commands when Claude provides the full terminal command
- Dashboard auto-sorts games alphabetically on load (Airtable query sorts by Game Name)
- Owner display: "Dave, Leanna" → shown as "Loftes" on dashboard

## Platform priorities
- ~half the group uses Android (Chrome), ~half uses iPhone (Safari)
- All dashboard features must work on both platforms
- Always consider Android Chrome AND iPhone Safari when making UI/interaction changes
- User (Leanna) is the only one who saves to home screen — general group accesses via mobile browser
