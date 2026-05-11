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
const propertiesMap = {
  "a-aph": "Anti-aphrodisiac",
  "a-bil": "Anti-bilious",
  "a-eme": "Anti-emetic",
  "a-epi": "Anti-epileptic",
  "a-hys": "Anti-hysteric",
  "a-lit": "Anthilitic",
  "a-per": "Anti-periodic",
  "a-phy": "Anti-phlogistic",
  "a-rhe": "Anti-rheumatic",
  "a-sco": "Anti-scorbutic",
  "a-sep": "Anti-septic",
  "a-spa": "Anti-spasmotic",
  "a-syp": "Anti-syphilitic",
  "a-ven": "Anti-venomous",
  "c-irr": "Counter-irritant",
  "d-pil": "Depilatory",
  "d-ter": "Detersive",
  "e-sch": "Escharotic",
  "f-com": "Female complaints",
  abo: "Abortive",
  aci: "Acidulous",
  acr: "Acrid",
  adr: "Adenagic",
  ale: "Alexipharmic",
  alr: "Alterative",
  ano: "Anodyne",
  ant: "Anthelmintic",
  ape: "Aperient",
  aph: "Aphrodisiac",
  aro: "Aromatic",
  ast: "Astringent",
  bal: "Balsamic",
  bit: "Bitter",
  car: "Carminative",
  cat: "Cathartic",
  cau: "Caustic",
  cep: "Cephalic",
  cho: "Cholagogue",
  con: "Condiment",
  cor: "Cordial",
  cos: "Cosmetic",
  dem: "Demulcent",
  deo: "Deobstruent",
  dep: "Depurative",
  des: "Dessicative",
  det: "Detergent",
  dia: "Diaphoretic",
  dis: "Discutient",
  diu: "Diuretic",
  dra: "Drastic",
  eme: "Emetic",
  emm: "Emmenagogue",
  emo: "Emollient",
  esc: "Esculent",
  exa: "Exanthematous",
  exc: "Excitant",
  exp: "Expectorant",
  far: "Farinaceous",
  feb: "Febrifuge",
  fœt: "Fœtid",
  for: "Forage",
  fum: "Fumigating",
  gal: "Galactagogue",
  hep: "Hepatic",
  hyd: "Hydragogue",
  hyp: "Hypnotic",
  ins: "Insecticide",
  irr: "Irritant",
  lax: "Laxative",
  len: "Lenitive",
  lit: "Lithontryptic",
  mat: "Maturating",
  muc: "Mucilaginous",
  nar: "Narcotic",
  nau: "Nauseant",
  nep: "Nephreticum",
  ner: "Nervine",
  nut: "Nutritious",
  opt: "Opthalmicum",
  orn: "Ornamental",
  par: "Parturient",
  pec: "Pectoral",
  per: "Perfume",
  poi: "Poison",
  pun: "Pungent",
  pur: "Purgative",
  ref: "Refrigerant",
  res: "Resolvent",
  rub: "Rubefacient",
  sac: "Saccharine",
  sad: "Salad",
  sal: "Saline",
  sap: "Saponaceous",
  sed: "Sedative",
  sia: "Sialogogue",
  ste: "Sternutatory",
  sti: "Stimulant",
  sto: "Stomachic",
  sty: "Styptic",
  sud: "Sudorific",
  ton: "Tonic",
  ver: "Vermifuge",
  ves: "Vesicant",
  vis: "Viscid",
  vul: "Vulnerary"
};

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

  // extract property abbreviations and map to full names using propertiesMap
  const cleaned = raw.replace(/[\.(),]/g, ' ').toLowerCase();
  const tokens = cleaned.split(/\s+/).map(t => t.replace(/[^a-z0-9\-œ]/gi, '')).filter(Boolean);
  const properties = [];
  tokens.forEach(t => {
    if (propertiesMap[t]) properties.push(propertiesMap[t]);
  });

  return { botanical, english, parts: Array.from(new Set(parts)), properties: Array.from(new Set(properties)), raw };
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
