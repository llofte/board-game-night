// ============================================================
// STEP 1 — Run setupSheets() once to restructure + load data
// ============================================================

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupGamesLibrary(ss);
  setupPlayLog(ss);
  SpreadsheetApp.getUi().alert('✅ Setup complete! Both sheets have been restructured with real data.');
}

// ── Run once to create and populate the Expansions sheet ─────
function setupExpansionsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('🎲 Expansions');
  if (!sheet) sheet = ss.insertSheet('🎲 Expansions');
  sheet.clearContents();

  sheet.getRange('A1:C1').setValues([['Game', 'Expansion Name', 'Owned']]);

  const expansions = [
    // Catan
    ['Catan', 'Seafarers',            false],
    ['Catan', 'Cities & Knights',     false],
    ['Catan', 'Traders & Barbarians', false],
    ['Catan', 'Explorers & Pirates',  false],
    // Ticket to Ride
    ['Ticket to Ride', '1910 Card Expansion', false],
    ['Ticket to Ride', 'The Heart of Africa', false],
    ['Ticket to Ride', 'India & Switzerland', false],
    ['Ticket to Ride', 'UK & Pennsylvania',   false],
    ['Ticket to Ride', 'Nordic Countries',    false],
    // Pandemic
    ['Pandemic', 'On the Brink',        false],
    ['Pandemic', 'In the Lab',          false],
    ['Pandemic', 'State of Emergency',  false],
    // Terraforming Mars
    ['Terraforming Mars', 'Prelude',          false],
    ['Terraforming Mars', 'Venus Next',       false],
    ['Terraforming Mars', 'Hellas & Elysium', false],
    ['Terraforming Mars', 'Colonies',         false],
    ['Terraforming Mars', 'Turmoil',          false],
    // Wingspan
    ['Wingspan', 'European Expansion', false],
    ['Wingspan', 'Oceania Expansion',  false],
    ['Wingspan', 'Asia Expansion',     false],
    // 7 Wonders
    ['7 Wonders', 'Leaders', false],
    ['7 Wonders', 'Cities',  false],
    ['7 Wonders', 'Babel',   false],
    ['7 Wonders', 'Armada',  false],
    // Arcs
    ['Arcs', 'The Blighted Reach', true],
    // Root
    ['Root', 'The Riverfolk Expansion',     true],
    ['Root', 'The Underworld Expansion',    true],
    ['Root', 'The Marauder Expansion',      true],
    ['Root', 'The Clockwork Expansion',     false],
    ['Root', 'The Clockwork Expansion 2',   false],
    ['Root', 'The Exiles & Partisans Deck', true],
    ['Root', 'Landmarks Pack',              true],
    ['Root', 'Hirelings Pack',              true],
    ['Root', 'The Vagabond Pack',           true],
  ];

  sheet.getRange(2, 1, expansions.length, 3).setValues(expansions);
  Logger.log('✅ Expansions sheet created with ' + expansions.length + ' entries.');
}

function setupGamesLibrary(ss) {
  let sheet = ss.getSheetByName('🎲 Games Library');
  if (!sheet) sheet = ss.getSheetByName('Games Library');
  if (!sheet) sheet = ss.insertSheet('🎲 Games Library');

  // Clear rows 2+ (keep title row 1)
  const lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange(2, 1, lastRow - 1, 10).clearContent();

  // New headers
  sheet.getRange('A2:H2').setValues([[
    'Game Name', 'Min Players', 'Max Players',
    'Expansion Min', 'Expansion Max',
    'Owners', 'Genre', 'Rules URL'
  ]]);

  // 8 real games
  const games = [
    ['Catan',            3, 4, '', '', 'Dave, Leanna',        'Resource Management', 'https://www.catan.com/sites/default/files/2021-06/catan_base_rules_2020_200707.pdf'],
    ['Ticket to Ride',   2, 5, '', '', 'Dave, Leanna',        'Route Building',      'https://ncdn0.daysofwonder.com/tickettoride/en/img/tt_rules_2015_en.pdf'],
    ['Pandemic',         2, 4, '', '', 'Dave, Leanna',        'Cooperative',         'https://www.ultraboardgames.com/pandemic/game-rules.php'],
    ['Terraforming Mars',1, 5, '', '', 'Peter',               'Engine Building',     'https://fryxgames.se/wp-content/uploads/2023/04/TMRULESFINAL.pdf'],
    ['Wingspan',         1, 5, '', '', 'Peter',               'Engine Building',     'https://www.dropbox.com/scl/fo/cfbnrvnwwms1fz7589byc/AI8I9LEYzDESkEkm_s3FhSo?rlkey=cykjw2zk47cehkebrl3a5wl7b&dl=0'],
    ['7 Wonders',        2, 7, 2, 8, 'Dave, Leanna',         'Civilization',        ''],
    ['Expeditions',      1, 5, '', '', 'Dave, Leanna, Mark',  'Adventure',           ''],
    ['Arcs',             2, 4, '', '', 'Dave, Leanna',        'Space Strategy',      ''],
  ];
  sheet.getRange(3, 1, games.length, 8).setValues(games);
}

function setupPlayLog(ss) {
  let sheet = ss.getSheetByName('📅 Play Log');
  if (!sheet) sheet = ss.getSheetByName('Play Log');
  if (!sheet) sheet = ss.insertSheet('📅 Play Log');

  // Clear rows 2+
  const lastRow = Math.max(sheet.getLastRow(), 2);
  sheet.getRange(2, 1, lastRow - 1, 15).clearContent();

  // New headers
  sheet.getRange('A2:M2').setValues([[
    'Date', 'Game',
    'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6',
    '1st Place', '2nd Place', '3rd Place',
    'Duration', 'Notes'
  ]]);

  // 2 real sessions (oldest first)
  const sessions = [
    ['2026-05-14', 'Arcs',        'Peter', 'Mark', 'Dave', 'Leanna', '',       '',  'DNF',   '',      '',      240, "Mark's first time playing; Dave, Leanna & Peter hadn't played in a long time — most of the session was spent relearning the rules."],
    ['2026-05-21', 'Expeditions', 'Peter', 'Dave', 'Leanna','Mark',  'Nathan', '',  'Peter', 'Mark',  'Dave',  210, ''],
  ];
  sheet.getRange(3, 1, sessions.length, 13).setValues(sessions);
}


// ============================================================
// STEP 2 — Deploy doGet() as a Web App for the dashboard
// ============================================================

function doGet(e) {
  // ── Log a session via URL (used by the iPhone Claude workflow) ──
  if (e.parameter.action === 'log') {
    return logSession(e.parameter);
  }

  // ── Log a team session ──
  if (e.parameter.action === 'logTeam') {
    return logTeamSession(e.parameter);
  }

  // ── Add a new game to the Games Library ──
  if (e.parameter.action === 'addGame') {
    return addGame(e.parameter);
  }

  // ── Default: return JSON data for the dashboard ──
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const output = {
    games:        getGames(ss),
    sessions:     getSessions(ss),
    expansions:   getExpansions(ss),
    teamSessions: getTeamSessions(ss)
  };
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Add a game to the Games Library ─────────────────────────
function addGame(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('🎲 Games Library');
  if (!sheet) sheet = ss.getSheetByName('Games Library');

  if (!p.name) {
    return ContentService
      .createTextOutput('Error: game name required')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  const name    = p.name;
  const min     = p.min    ? Number(p.min)    : '';
  const max     = p.max    ? Number(p.max)    : '';
  const expMin  = p.expMin ? Number(p.expMin) : '';
  const expMax  = p.expMax ? Number(p.expMax) : '';
  const owners  = p.owners  || '';
  const genre   = p.genre   || '';
  const rulesUrl = p.rulesUrl || '';

  sheet.appendRow([name, min, max, expMin, expMax, owners, genre, rulesUrl]);
  sortGamesLibrary(ss);

  return ContentService
    .createTextOutput(`✅ Added!\n\n${name}\n${min}–${max} players`)
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── Log a session appended to the Play Log ──────────────────
function logSession(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('📅 Play Log');
  if (!sheet) sheet = ss.getSheetByName('Play Log');

  const date     = p.date || Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
  const game     = p.game  || '';
  const players  = [p.p1, p.p2, p.p3, p.p4, p.p5, p.p6].map(v => v || '');
  const duration = p.duration ? Number(p.duration) : '';
  const notes    = p.notes || '';

  let first = '', second = '', third = '';
  if      (p.result === 'DNF')       { first = 'DNF'; }
  else if (p.result === 'coop_win')  { first = 'Everyone!'; }
  else if (p.result === 'coop_loss') { first = 'Loss'; }
  else {
    first  = p.first  || '';
    second = p.second || '';
    third  = p.third  || '';
  }

  sheet.appendRow([date, game, ...players, first, second, third, duration, notes]);

  const podium = first === 'DNF'       ? 'DNF'
               : first === 'Everyone!' ? 'Co-op win 🎉'
               : first === 'Loss'      ? 'Co-op loss'
               : [first, second, third].filter(Boolean).join(' › ');

  const durationStr = duration ? ` · ${Math.floor(duration/60) > 0 ? Math.floor(duration/60) + 'h ' : ''}${duration%60 > 0 ? duration%60 + 'm' : ''}`.trim() : '';

  return ContentService
    .createTextOutput(`✅ Logged!\n\n${game} · ${date}${durationStr}\n${players.filter(Boolean).join(', ')}\n${podium}`)
    .setMimeType(ContentService.MimeType.TEXT);
}

function getExpansions(ss) {
  let sheet = ss.getSheetByName('🎲 Expansions');
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const expansions = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] || !row[1]) continue;
    expansions.push({
      game:  String(row[0]),
      name:  String(row[1]),
      owned: row[2] === true || String(row[2]).toUpperCase() === 'TRUE',
      owner: row[3] ? String(row[3]).trim() : ''
    });
  }
  return expansions;
}

function getGames(ss) {
  let sheet = ss.getSheetByName('🎲 Games Library');
  if (!sheet) sheet = ss.getSheetByName('Games Library');
  const data = sheet.getDataRange().getValues();

  // Find header row (has 'Game Name' in col A)
  let headerRow = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === 'Game Name') { headerRow = i; break; }
  }
  if (headerRow === -1) return [];

  const games = [];
  for (let i = headerRow + 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    games.push({
      name:         row[0],
      min:          row[1] !== '' ? Number(row[1]) : null,
      max:          row[2] !== '' ? Number(row[2]) : null,
      expansionMin: row[3] !== '' ? Number(row[3]) : null,
      expansionMax: row[4] !== '' ? Number(row[4]) : null,
      owners:       row[5] ? String(row[5]).split(',').map(s => s.trim()) : [],
      genre:        row[6] || null,
      rulesUrl:     row[7] || null
    });
  }
  return games;
}

function getSessions(ss) {
  let sheet = ss.getSheetByName('📅 Play Log');
  if (!sheet) sheet = ss.getSheetByName('Play Log');
  const data = sheet.getDataRange().getValues();

  // Find header row (has 'Date' in col A)
  let headerRow = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === 'Date') { headerRow = i; break; }
  }
  if (headerRow === -1) return [];

  const sessions = [];
  for (let i = headerRow + 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;

    // Format date (handles both Date objects and strings)
    let dateStr = '';
    const dateVal = row[0];
    if (dateVal instanceof Date) {
      dateStr = Utilities.formatDate(dateVal, 'UTC', 'yyyy-MM-dd');
    } else {
      dateStr = String(dateVal);
    }

    // Players (cols 2-7), filter blanks
    const players = [row[2], row[3], row[4], row[5], row[6], row[7]]
      .filter(p => p !== null && p !== '');

    // Places (cols 8-10), filter blanks
    const places = [row[8], row[9], row[10]]
      .filter(p => p !== null && p !== '');

    sessions.push({
      date:     dateStr,
      game:     row[1],
      players:  players,
      places:   places,
      duration: row[11] !== '' ? Number(row[11]) : null,
      notes:    row[12] || null
    });
  }
  return sessions;
}


// ============================================================
// STEP 3 — Run batchAddNewGames() to add shelf games
// ============================================================

function batchAddNewGames() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('🎲 Games Library');
  if (!sheet) sheet = ss.getSheetByName('Games Library');

  const own = 'Dave, Leanna';

  // [name, min, max, expMin, expMax, owners, genre, rulesUrl]
  const games = [
    ['Happy Salmon',                         3,  6,  '', '', own, '', ''],
    ['Vantage',                              1,  5,  '', '', own, '', ''],
    ['BombBusters',                          2,  6,  '', '', own, '', ''],
    ['Oath: Chronicles of Empire & Exile',   1,  6,  '', '', own, '', ''],
    ['Small World',                          2,  5,  '', '', own, '', ''],
    ['Champions of Midgard',                 2,  4,  '', '', own, '', ''],
    ['Scythe',                               1,  5,  '', '', own, '', ''],
    ['Spirit Island',                        1,  4,  '', '', own, '', ''],
    ['Ticket to Ride: Europe',               2,  5,  '', '', own, '', ''],
    ['Lords of Waterdeep',                   2,  5,  '', '', own, '', ''],
    ['Race for the Galaxy',                  2,  4,  '', '', own, '', ''],
    ['Le Havre',                             1,  5,  '', '', own, '', ''],
    ['Sequence',                             2, 12,  '', '', own, '', ''],
    ['Vast: Mysterious Manor',               2,  5,  '', '', own, '', ''],
    ['Dune: Imperium',                       1,  4,  '', '', own, '', ''],
    ['Tokaido',                              2,  5,  '', '', own, '', ''],
    ['Mysterium',                            2,  7,  '', '', own, '', ''],
    ['Brass: Birmingham',                    2,  4,  '', '', own, '', ''],
    ['Quest for El Dorado',                  2,  4,  '', '', own, '', ''],
    ['Camel Up',                             3,  8,  '', '', own, '', ''],
    ['Raiders of the North Sea',             2,  4,  '', '', own, '', ''],
    ['The Night Cage',                       1,  5,  '', '', own, '', ''],
    ['Ahoy',                                 2,  4,  '', '', own, '', ''],
    ['Risk: Game of Thrones',                3,  6,  '', '', own, '', ''],
    ['Stardew Valley: The Board Game',       1,  4,  '', '', own, '', ''],
    ['Earthborne Rangers',                   1,  4,  '', '', own, '', ''],
    ['12 Rivers',                            2,  4,  '', '', own, '', ''],
    ['Iris',                                 2,  5,  '', '', own, '', ''],
    ['Cyclades',                             2,  5,  '', '', own, '', ''],
    ['The Alpha',                            2,  6,  '', '', own, '', ''],
    ['Hunt a Killer',                        1,  6,  '', '', own, '', ''],
    ['Unsolved Case Files',                  1,  4,  '', '', own, '', ''],
  ];

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, games.length, games[0].length).setValues(games);
  sortGamesLibrary(ss);
  Logger.log('✅ Added ' + games.length + ' games to the library (sorted alphabetically).');
}

// ── Remove duplicate games, keeping the most complete row ─────
function removeDuplicateGames() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('🎲 Games Library');
  if (!sheet) sheet = ss.getSheetByName('Games Library');
  if (!sheet) { Logger.log('❌ Games Library sheet not found.'); return; }

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) { Logger.log('✅ Nothing to deduplicate.'); return; }

  // Rows 1 = title, 2 = headers, 3+ = data
  const data = sheet.getRange(3, 1, lastRow - 2, 8).getValues();

  // For each game name, track the best row index (most fields filled)
  const seen   = {}; // normalised name → index in data[]
  const remove = []; // indices in data[] to delete

  for (let i = 0; i < data.length; i++) {
    const name = String(data[i][0]).trim();
    if (!name) continue;
    const key = name.toLowerCase();

    if (!(key in seen)) {
      seen[key] = i;
    } else {
      const existingScore = data[seen[key]].filter(c => c !== '' && c !== null).length;
      const newScore      = data[i].filter(c => c !== '' && c !== null).length;
      if (newScore > existingScore) {
        remove.push(seen[key]); // replace existing with better new row
        seen[key] = i;
      } else {
        remove.push(i); // existing is fine, drop the new one
      }
    }
  }

  if (remove.length === 0) {
    Logger.log('✅ No duplicates found.');
    return;
  }

  // Delete from bottom to top so row numbers don't shift
  remove.sort((a, b) => b - a);
  for (const idx of remove) {
    sheet.deleteRow(idx + 3); // +3 because data starts at sheet row 3
  }

  sortGamesLibrary(ss);
  Logger.log('✅ Removed ' + remove.length + ' duplicate(s). Library re-sorted.');
}

// ── Sort the Games Library alphabetically by game name ────────
function sortGamesLibrary(ss) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('🎲 Games Library');
  if (!sheet) sheet = ss.getSheetByName('Games Library');
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 4) return; // fewer than 2 data rows, nothing to sort

  // Row 1 = title, row 2 = headers, row 3+ = data
  sheet.getRange(3, 1, lastRow - 2, 8).sort({ column: 1, ascending: true });
  Logger.log('✅ Games Library sorted alphabetically (' + (lastRow - 2) + ' games).');
}

// ── Run once to append new expansions to the Expansions sheet ─
function addNewExpansions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('🎲 Expansions');
  if (!sheet) {
    Logger.log('❌ Expansions sheet not found. Run setupExpansionsSheet() first.');
    return;
  }

  const newExpansions = [
    ['Spirit Island',        'Jagged Earth',       true],
    ['Champions of Midgard', 'The Dark Mountains', true],
    ['Champions of Midgard', 'Valhalla',           true],
    ['Cyclades',             'Hades',              true],
    ['Dune: Imperium',       'Rise of Ix',         true],
  ];

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, newExpansions.length, newExpansions[0].length).setValues(newExpansions);
  Logger.log('✅ Added ' + newExpansions.length + ' new expansions.');
}

// ── Run once to append the full expansion library scrub ───────
function addMoreExpansions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('🎲 Expansions');
  if (!sheet) { Logger.log('❌ Expansions sheet not found.'); return; }

  const e = [
    // Ticket to Ride: Europe
    ['Ticket to Ride: Europe', '1912 Europe',                  false],
    ['Ticket to Ride: Europe', 'Team Asia & Legendary Asia',   false],
    // Terraforming Mars
    ['Terraforming Mars',      'Prelude 2',                    false],
    // Wingspan
    ['Wingspan',               'Americas Expansion',           false],
    // 7 Wonders
    ['7 Wonders',              'Wonder Pack',                  false],
    // Expeditions
    ['Expeditions',            'Gears of Corruption',          false],
    // Arcs
    ['Arcs',                   'Leaders & Lore',               false],
    // Scythe
    ['Scythe',                 'Invaders from Afar',           false],
    ['Scythe',                 'The Wind Gambit',              false],
    ['Scythe',                 'The Rise of Fenris',           false],
    // Spirit Island
    ['Spirit Island',          'Branch & Claw',                false],
    ['Spirit Island',          'Nature Incarnate',             false],
    // Tokaido
    ['Tokaido',                'Crossroads',                   false],
    ['Tokaido',                'Matsuri',                      false],
    // Mysterium
    ['Mysterium',              'Hidden Signs',                 false],
    ['Mysterium',              'Secrets & Lies',               false],
    // Quest for El Dorado
    ['Quest for El Dorado',    'The Golden Temples',           false],
    ['Quest for El Dorado',    'The Fountains of Youth',       false],
    ['Quest for El Dorado',    'Dangers & Demons',             false],
    // Camel Up
    ['Camel Up',               'Off Season',                   false],
    // Raiders of the North Sea
    ['Raiders of the North Sea', 'Fields of Fame',             false],
    ['Raiders of the North Sea', 'Hall of Heroes',             false],
    ['Raiders of the North Sea', 'Outsiders',                  false],
    // Champions of Midgard
    ['Champions of Midgard',   'The Highlands',                false],
    ['Champions of Midgard',   'Jarl: The Hunting Party',      false],
    // Cyclades
    ['Cyclades',               'Titans',                       false],
    ['Cyclades',               'Monuments',                    false],
    ['Cyclades',               'Hecatomb',                     false],
    // Dune: Imperium
    ['Dune: Imperium',         'Immortality',                  false],
    // Race for the Galaxy
    ['Race for the Galaxy',    'The Gathering Storm',          false],
    ['Race for the Galaxy',    'Rebel vs Imperium',            false],
    ['Race for the Galaxy',    'The Brink of War',             false],
    ['Race for the Galaxy',    'Alien Artifacts',              false],
    ['Race for the Galaxy',    'Xeno Invasion',                false],
    // Lords of Waterdeep
    ['Lords of Waterdeep',     'Scoundrels of Skullport',      false],
    // Le Havre
    ['Le Havre',               'The Interior',                 false],
    // Small World
    ['Small World',            'Necromancer Island',           false],
    ['Small World',            'Be Not Afraid',                false],
    ['Small World',            'Grand Dames of Small World',   false],
    ['Small World',            'Royal Bonus',                  false],
    ['Small World',            "Cursed!",                      false],
    ['Small World',            'Tales & Legends',              false],
    ['Small World',            "A Spider's Web",               false],
    ['Small World',            'Sky Islands',                  false],
    ['Small World',            'River World',                  false],
  ];

  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, e.length, e[0].length).setValues(e);
  Logger.log('✅ Added ' + e.length + ' expansions.');
}

// ── Run once to fix Dune: Imperium owner data ─────────────────
function fixDuneImperiumData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Games Library: update Dune: Imperium owners to include Peter
  const gamesSheet = ss.getSheetByName('🎲 Games Library');
  if (gamesSheet) {
    const data = gamesSheet.getDataRange().getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'Dune: Imperium') {
        gamesSheet.getRange(i + 1, 6).setValue('Dave, Leanna, Peter');
        Logger.log('✅ Games Library: Dune: Imperium owners updated to Dave, Leanna, Peter (row ' + (i + 1) + ')');
        break;
      }
    }
  }

  // 2. Expansions: Rise of Ix — set owner to "Loftes"
  // 3. Expansions: Immortality — mark owned, set owner to "Peter"
  const expSheet = ss.getSheetByName('🎲 Expansions');
  if (expSheet) {
    const expData = expSheet.getDataRange().getValues();
    for (let i = 0; i < expData.length; i++) {
      const game = expData[i][0];
      const name = expData[i][1];
      if (game === 'Dune: Imperium' && name === 'Rise of Ix') {
        expSheet.getRange(i + 1, 4).setValue('Loftes');
        Logger.log('✅ Expansions: Rise of Ix owner set to Loftes (row ' + (i + 1) + ')');
      }
      if (game === 'Dune: Imperium' && name === 'Immortality') {
        expSheet.getRange(i + 1, 3).setValue(true);
        expSheet.getRange(i + 1, 4).setValue('Peter');
        Logger.log('✅ Expansions: Immortality marked owned, owner set to Peter (row ' + (i + 1) + ')');
      }
    }
  }
}

// ── Run once to add Uprising expansion and ensure Codenames is in library ─
function addTeamGameData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Add Dune: Imperium — Uprising to Expansions (skip if already there)
  const expSheet = ss.getSheetByName('🎲 Expansions');
  if (expSheet) {
    const expData = expSheet.getDataRange().getValues();
    const hasUprising = expData.some(r => r[0] === 'Dune: Imperium' && r[1] === 'Uprising');
    if (!hasUprising) {
      expSheet.getRange(expSheet.getLastRow() + 1, 1, 1, 4).setValues([['Dune: Imperium', 'Uprising', true, 'Peter']]);
      Logger.log('✅ Added Dune: Imperium - Uprising (owned, Peter).');
    } else {
      Logger.log('Uprising already exists, skipping.');
    }
  }

  // 2. Ensure Codenames is in the Games Library with correct data
  let gamesSheet = ss.getSheetByName('🎲 Games Library');
  if (!gamesSheet) gamesSheet = ss.getSheetByName('Games Library');
  if (gamesSheet) {
    const data = gamesSheet.getDataRange().getValues();
    let codenamesRow = -1;
    for (let i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === 'codenames') { codenamesRow = i; break; }
    }
    if (codenamesRow === -1) {
      // Not found — append it
      const nextRow = gamesSheet.getLastRow() + 1;
      gamesSheet.getRange(nextRow, 1, 1, 8).setValues([['Codenames', 2, 8, '', '', 'Dave, Leanna', 'Party', '']]);
      Logger.log('✅ Added Codenames to Games Library.');
    } else {
      // Found — make sure player count is correct
      gamesSheet.getRange(codenamesRow + 1, 2, 1, 2).setValues([[2, 8]]);
      Logger.log('✅ Codenames found in row ' + (codenamesRow + 1) + ', player count confirmed.');
    }
    sortGamesLibrary(ss);
  }
}

// ── Set up Team Log sheet ─────────────────────────────────────
function setupTeamLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('🤝 Team Log');
  if (sheet) { Logger.log('Team Log sheet already exists.'); return; }
  sheet = ss.insertSheet('🤝 Team Log');
  sheet.getRange('A1:I1').setValues([[
    'Date', 'Game', 'Team 1', 'Team 2',
    'T1 Score', 'T2 Score', 'Winner', 'Duration (min)', 'Notes'
  ]]);
  Logger.log('✅ Team Log sheet created.');
}

// ── Read team sessions for the dashboard API ──────────────────
function getTeamSessions(ss) {
  let sheet = ss.getSheetByName('🤝 Team Log');
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const sessions = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] || !row[1]) continue;
    let dateStr = '';
    const dateVal = row[0];
    if (dateVal instanceof Date) {
      dateStr = Utilities.formatDate(dateVal, 'UTC', 'yyyy-MM-dd');
    } else {
      dateStr = String(dateVal);
    }
    sessions.push({
      date:       dateStr,
      game:       String(row[1]),
      team1:      String(row[2]).split(',').map(s => s.trim()).filter(Boolean),
      team2:      String(row[3]).split(',').map(s => s.trim()).filter(Boolean),
      team1score: (row[4] !== '' && row[4] !== null) ? Number(row[4]) : null,
      team2score: (row[5] !== '' && row[5] !== null) ? Number(row[5]) : null,
      winner:     String(row[6]).toLowerCase().replace(/\s/g, ''), // 'team1' or 'team2'
      duration:   row[7] !== '' ? Number(row[7]) : null,
      notes:      row[8] || null
    });
  }
  return sessions;
}

// ── Log a team session (called via ?action=logTeam) ───────────
function logTeamSession(p) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('🤝 Team Log');
  if (!sheet) {
    return ContentService
      .createTextOutput('❌ Team Log sheet not found. Run setupTeamLog() first.')
      .setMimeType(ContentService.MimeType.TEXT);
  }
  const date       = p.date || Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
  const game       = p.game   || '';
  const team1      = p.team1  || '';  // comma-separated names
  const team2      = p.team2  || '';
  const team1score = p.t1score || '';
  const team2score = p.t2score || '';
  const winner     = p.winner  || '';  // 'Team 1' or 'Team 2'
  const duration   = p.duration ? Number(p.duration) : '';
  const notes      = p.notes   || '';

  sheet.appendRow([date, game, team1, team2, team1score, team2score, winner, duration, notes]);

  const scoreStr = (team1score && team2score) ? ` · ${team1score}–${team2score}` : '';
  return ContentService
    .createTextOutput(`✅ Team session logged!\n\n${game} · ${date}${scoreStr}\n${team1} vs ${team2}\n${winner} wins`)
    .setMimeType(ContentService.MimeType.TEXT);
}
