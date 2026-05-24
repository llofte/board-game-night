# Board Game Night — Project Context

## What this is
A board game group tracker. The user tells Claude about each game night in plain English, and Claude updates Airtable and the dashboard directly — no script steps, no manual runs.

## Architecture
- **Database**: Airtable (source of truth for all data)
- **Dashboard**: Static HTML on GitHub Pages — reads/writes Airtable directly via REST API
- **Apps Script**: Retired. No longer used.

## Airtable
- Base ID: `appMG6K6WduzpxNM4`
- Token: `patHNaPELhhWYyFCk.303ed772bef21348f1daca49c8caa024df09dca0a3f0a9f1ddd5b85b71db272b`
- Base URL: `https://api.airtable.com/v0/appMG6K6WduzpxNM4`

### Tables
| Table | ID | Primary field |
|---|---|---|
| Games Library | tblhMuIz19HxQ1Zvv | Game Name |
| Play Log | tbl8jFp1t2SvunYKk | Date |
| Expansions | tblLwJfd0oCNK6XPM | Expansion Name |
| Team Log | tbl5Yi01dkX7DdiX8 | Date |

### Games Library fields
Game Name | Min Players | Max Players | Expansion Min | Expansion Max | Owners | Genre | Rules URL

### Play Log fields
Date | Game | Players (comma-separated) | 1st Place | 2nd Place | 3rd Place | Duration (mins) | Notes

### Expansions fields
Expansion Name | Game | Owned (checkbox) | Owner

### Team Log fields
Date | Game | Team 1 (comma-separated) | Team 2 (comma-separated) | T1 Score | T2 Score | Winner ("Team 1" or "Team 2") | Duration (mins) | Notes

## How Claude makes changes
Claude uses WebFetch or the browser javascript_tool to call the Airtable REST API directly:
- **Read**: GET `{base_url}/{table}?pageSize=100&...`
- **Write**: POST `{base_url}/{table}` with `{ records: [{ fields: {...} }] }`
- **Update**: PATCH `{base_url}/{table}/{recordId}` with `{ fields: {...} }`
- **Delete**: DELETE `{base_url}/{table}/{recordId}`

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
- User never touches Airtable directly — Claude handles all data changes
- User never edits code — Claude handles all code changes
- User only runs: `git push` commands when Claude provides the full terminal command
- Dashboard auto-sorts games alphabetically on load (Airtable query sorts by Game Name)
- Owner display: "Dave, Leanna" → shown as "Loftes" on dashboard
