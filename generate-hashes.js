#!/usr/bin/env node
//
// Generate SHA-256 hashes for your guest list.
//
// Usage:
//   Single guests:
//     node generate-hashes.js "Jane Smith,jane@email.com"
//
//   Couples (either person can RSVP for both):
//     node generate-hashes.js "Jane Smith,jane@email.com,John Smith,john@email.com"
//
//   Mix of both:
//     node generate-hashes.js "Jane,jane@email.com,John,john@email.com" "Solo Guest,solo@email.com"
//
//   From a file (one entry per line):
//     node generate-hashes.js < guests.csv
//
// Then paste the output into the GUEST_HASHES set in script.js

const crypto = require('crypto');

function hash(val) {
  return crypto.createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

function processGuests(lines) {
  const entries = lines.map(l => l.trim()).filter(Boolean);
  if (entries.length === 0) {
    console.log('Usage: node generate-hashes.js "Name,email" "Name1,email1,Name2,email2" ...');
    process.exit(1);
  }

  console.log('// Paste these into GUEST_HASHES in script.js:\n');
  for (const entry of entries) {
    const parts = entry.split(',').map(p => p.trim()).filter(Boolean);
    const label = parts.join(', ');
    console.log(`    // ${label}`);
    for (const part of parts) {
      console.log(`    '${hash(part)}',`);
    }
  }
}

const args = process.argv.slice(2);

if (args.length > 0) {
  processGuests(args);
} else {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => processGuests(input.split('\n')));
}
