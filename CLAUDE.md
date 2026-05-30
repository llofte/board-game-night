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

### Primary method: Airtable MCP (preferred)
An Airtable MCP connector is configured in this Claude Code environment. Use it directly for all reads, writes, updates, deletes, and schema changes. No scripts needed.

### Fallback: REST API via at.py
If MCP is unavailable, use `at.py` in the project folder:
- **Read**: `python3 at.py get "Table" [--filter formula] [--fields f1,f2]`
- **Write**: `python3 at.py post "Table" '{"Field": "value"}'`
- **Update**: `python3 at.py patch "Table" recXXX '{"Field": "value"}'`
- **Delete**: `python3 at.py delete "Table" recXXX`
- **Schema**: POST to `https://api.airtable.com/v0/meta/bases/{baseId}/tables/{tableId}/fields`

Always update CLAUDE.md field lists after adding a field.

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

## Adding a game
When adding any game, always populate: Game Name, Min/Max Players, Genre, BGG URL, Owners (if known), Rules URL (if PDF in rules/ folder), Tutorial URL (if provided). Expansion Min/Max only if an owned expansion changes player count.
Also look up known expansions and add them to the Expansions table (Owned: false by default).

## Marking an expansion as owned
1. Check if that expansion changes the player count
2. If yes — update Expansion Min / Expansion Max on the Games Library record
3. If no — leave those fields alone (or clear them if incorrectly set)

## Header icon
🎲 in the header is a placeholder. User wants to revisit — SVG meeple is the top candidate, chess pawn ♟️ and gear ⚙️ were also discussed. Pick up from SVG meeple as the recommended path when user raises it.

## Preview panel
The PostToolUse:Write hook auto-shows HTML files in the preview panel. Never set up a Python server or use preview_start — just Write the file and the panel updates automatically.
