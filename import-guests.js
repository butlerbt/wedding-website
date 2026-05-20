#!/usr/bin/env node
//
// Import guest list from a CSV and generate lookup data grouped by invite group.
//
// Usage:
//   node import-guests.js guests.csv
//
// Expected CSV columns: "First Name", "Last Name", "Email", "Invite Group"
// Guests with the same Invite Group number are treated as a couple/pair.
//
// Output is ready to paste into script.js as GUEST_LOOKUP and GUEST_GROUPS.

const crypto = require('crypto');
const fs = require('fs');

const ENC_SALT = 'natalie-brent-2027-rsvp';

function hash(val) {
  return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

function encryptNames(names) {
  const key = crypto.createHash('sha256').update(ENC_SALT).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(JSON.stringify(names), 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, encrypted, tag]).toString('base64');
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
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { current += ch; }
    } else if (ch === '"') { inQuotes = true; }
    else if (ch === ',') { fields.push(current); current = ''; }
    else { current += ch; }
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

// Output GUEST_GROUPS (AES-256-GCM encrypted)
console.log('  const GUEST_GROUPS = {');
for (const [groupId, members] of Object.entries(groups)) {
  const names = members.map(m => `${m[fnCol]} ${m[lnCol]}`.trim());
  console.log(`    '${groupId}': '${encryptNames(names)}',`);
}
console.log('  };\n');

// Output GUEST_LOOKUP (hash -> groupId)
console.log('  const GUEST_LOOKUP = {');
for (const [groupId, members] of Object.entries(groups)) {
  const firstNames = members.map(m => m[fnCol].trim());
  console.log(`    // Group ${groupId}: ${firstNames.join(' & ')}`);
  for (const member of members) {
    const fullName = `${member[fnCol]} ${member[lnCol]}`.trim();
    const email = member[emailCol];
    if (fullName) console.log(`    '${hash(fullName)}': '${groupId}',`);
    if (email) console.log(`    '${hash(email)}': '${groupId}',`);
  }
}
console.log('  };');

const total = Object.values(groups).reduce((sum, g) => sum + g.length, 0);
console.log(`\n  // ${total} guests in ${Object.keys(groups).length} invite groups`);
