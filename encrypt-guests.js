#!/usr/bin/env node
//
// Encrypts GUEST_GROUPS names with AES-256-GCM.
// Run: node encrypt-guests.js
// Paste the output into script.js replacing the existing GUEST_GROUPS.
//

const crypto = require('crypto');

const ENC_SALT = 'natalie-brent-2027-rsvp';

const GUEST_GROUPS = {
  '1': { names: ['Sam Bennett', 'Gisela Bennett'] },
  '2': { names: ['Susan Butler'] },
  '3': { names: ['Stephanie Harwood', 'Will Harwood'] },
  '4': { names: ['Alan Butler', 'Amelia Height'] },
  '5': { names: ['Bob Butler'] },
  '6': { names: ['Christoph von Ruexleben', 'Jenn Cizek'] },
  '7': { names: ['Clare Gallagher', 'LT Nickell'] },
  '8': { names: ['Anna Callahan', 'Mike Coyle'] },
  '9': { names: ['Will Buckner'] },
  '10': { names: ['Jesse Pine', 'Hannah Pine'] },
  '11': { names: ['Grace Carpenter', 'Jonathan McLaren'] },
  '12': { names: ['Zach Lovell', 'Syd Knadler'] },
  '13': { names: ['Alex Pollard Lipkis', 'Victoria Arling'] },
  '14': { names: ['Angelina DiFransesco'] },
  '15': { names: ['Keith Mody', 'CC Canepa'] },
  '16': { names: ['Sean Kuusinen', 'Maggie Kuusinen'] },
  '17': { names: ['Zander Buteux'] },
  '18': { names: ['Jeff Dobroni', 'Sam Wilits'] },
  '19': { names: ['Eva Krchova'] },
  '20': { names: ['Kirill Langer', 'Asuka Nosaka'] },
  '21': { names: ['Steve Griffin', 'Taylor Griffin'] },
  '22': { names: ['Jared Carlson', 'Hannah Bare'] },
  '23': { names: ['David Alexander', 'Zoe'] },
  '24': { names: ['Rick Cotton'] },
  '25': { names: ['Laura Boese', 'Arne Boese'] },
  '26': { names: ['Julianna Burrill'] },
  '27': { names: ['Ethan Harden', 'Natalie Harden'] },
  '28': { names: ['Tommy Joyce', 'Brit Joyce'] },
  '29': { names: ['Sarah Yeung', 'Cam Eibl'] },
  '30': { names: ['Andre Shprengel'] },
  '31': { names: ['Taylor Carpenter', 'Alex Carpenter'] },
};

function encrypt(names) {
  const key = crypto.createHash('sha256').update(ENC_SALT).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = JSON.stringify(names);
  let encrypted = cipher.update(data, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();
  // iv (12) + ciphertext + tag (16) — Web Crypto expects ciphertext+tag together
  return Buffer.concat([iv, encrypted, tag]).toString('base64');
}

console.log('  const GUEST_GROUPS = {');
for (const [id, group] of Object.entries(GUEST_GROUPS)) {
  console.log(`    '${id}': '${encrypt(group.names)}',`);
}
console.log('  };');
