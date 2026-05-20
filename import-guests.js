#!/usr/bin/env node
//
// Import guest list from a CSV and generate SHA-256 hashes grouped by invite group.
//
// Usage:
//   node import-guests.js guests.csv
//
// Expected CSV columns: "First Name", "Last Name", "Email", "Invite Group"
// Guests with the same Invite Group number are treated as a couple/pair.
//
// Output is ready to paste into the GUEST_HASHES set in script.js

const crypto = require('crypto');
const fs = require('fs');

function hash(val) {
  return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

function parseCSV(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) {
    console.error('CSV must have a header row and at least one data row.');
    process.exit(1);
  }

  const headers = parseRow(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseRow(line);
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (values[i] || '').trim());
    return obj;
  });
}

function parseRow(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

const csvPath = process.argv[2];
if (!csvPath) {
  console.log('Usage: node import-guests.js guests.csv');
  process.exit(1);
}

const rows = parseCSV(fs.readFileSync(csvPath, 'utf8'));

const firstHeader = Object.keys(rows[0]);
const findCol = (names) => firstHeader.find(h => names.includes(h.toLowerCase()));
const fnCol = findCol(['first name', 'first_name', 'firstname']);
const lnCol = findCol(['last name', 'last_name', 'lastname']);
const emailCol = findCol(['email', 'email address']);
const groupCol = findCol(['invite group', 'invite_group', 'invitegroup', 'group']);

if (!fnCol || !lnCol || !emailCol || !groupCol) {
  console.error('Could not find required columns. Found:', firstHeader.join(', '));
  console.error('Need: First Name, Last Name, Email, Invite Group');
  process.exit(1);
}

const groups = {};
for (const row of rows) {
  const group = row[groupCol];
  if (!group) continue;
  if (!groups[group]) groups[group] = [];
  groups[group].push(row);
}

console.log('// Paste these into GUEST_HASHES in script.js:\n');

for (const [groupId, members] of Object.entries(groups)) {
  const labels = members.map(m => `${m[fnCol]} ${m[lnCol]}`).join(' & ');
  console.log(`    // Group ${groupId}: ${labels}`);
  for (const member of members) {
    const fullName = `${member[fnCol]} ${member[lnCol]}`.trim();
    const email = member[emailCol];
    if (fullName) console.log(`    '${hash(fullName)}',`);
    if (email) console.log(`    '${hash(email)}',`);
  }
}

const total = Object.values(groups).reduce((sum, g) => sum + g.length, 0);
console.log(`\n// ${total} guests in ${Object.keys(groups).length} invite groups`);
