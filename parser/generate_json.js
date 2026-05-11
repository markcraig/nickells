const fs = require('fs');
const path = require('path');

const inPath = path.resolve(__dirname, '..', 'jmnickellsbotani00nick_edited.txt');
const outPath = path.resolve(__dirname, '..', 'web', 'entries.json');

if (!fs.existsSync(inPath)) {
  console.error('Source file not found:', inPath);
  process.exit(1);
}

const text = fs.readFileSync(inPath, 'utf8');
const rawEntries = text.split(/\n{2,}/).map(e => e.trim()).filter(Boolean);

const knownParts = ['root','roots','leaf','leaves','bark','flower','flowers','seed','seeds','fruit','fruits','stem','stems','whole plant','capsule','capsules','radix','folia','herb','rhizome','root,'];

function extract(entry) {
  const raw = entry.replace(/\r/g,'').trim();
  const lines = raw.split('\n').map(l=>l.trim()).filter(Boolean);
  const first = lines[0] || '';
  const botanicalMatch = first.match(/^([^;—–\(\.,:]+)/);
  const botanical = botanicalMatch ? botanicalMatch[1].trim() : first.trim();
  let english = [];
  const paren = first.match(/\(([^)]+)\)/);
  if (paren) english = paren[1].split(/[;,\/]| and /).map(s=>s.trim()).filter(Boolean);
  else {
    const semi = first.split(';');
    if (semi.length>1) english = semi.slice(1).join(';').split(/[;,\/]| and /).map(s=>s.trim()).filter(Boolean);
  }
  const parts = [];
  const lower = raw.toLowerCase();
  knownParts.forEach(p => { if (lower.includes(p)) parts.push(p.replace(/,$/,'')); });
  return { botanical, english, parts: Array.from(new Set(parts)), raw };
}

const entries = rawEntries.map((e,i)=> {
  const r = extract(e);
  const slug = r.botanical.replace(/[^a-z0-9]+/ig,'-').replace(/^-|-$/g,'').toLowerCase();
  r.id = slug || `entry-${i+1}`;
  r.index = i+1;
  return r;
});

fs.mkdirSync(path.dirname(outPath), {recursive:true});
fs.writeFileSync(outPath, JSON.stringify(entries, null, 2), 'utf8');
console.log(`Wrote ${entries.length} entries to ${outPath}`);
