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

const knownParts = [
  'algæ',
  'balsam',
  'bark and fruit',
  'bark and leaves',
  'bark and oil',
  'bark and pith',
  'bark and root',
  'bark and twig',
  'bark and wood',
  'bark of root',
  'bark',
  'berries',
  'buds and flowers',
  'buds',
  'bulb',
  'capsules',
  'down and leaves',
  'down',
  'extract (from the seed)',
  'extract',
  'fecula of root',
  'fecula',
  'flower and bark',
  'flower and seed',
  'flower and stem',
  'flower',
  'flowers and leaves',
  'flowers and unripe fruit',
  'flowers',
  'fresh leaves',
  'fruit (rind)',
  'fruit (seed)',
  'fruit and bark',
  'fruit and juice',
  'fruit-pulp',
  'fruit',
  'fungus',
  'galls',
  'gum-re',
  'gum',
  'hairs of pods',
  'herb and flowers',
  'herb and root',
  'herb and seed',
  'herb',
  'juice of leaves',
  'juice of root',
  'juice',
  'kernels of fruit',
  'kernels',
  'leaf',
  'leaves and bark',
  'leaves and berries',
  'leaves and buds',
  'leaves and flower',
  'leaves and flowers',
  'leaves and fruit',
  'leaves and juice',
  'leaves and kernels',
  'leaves and oil',
  'leaves and root',
  'leaves and seed',
  'leaves and tops',
  'leaves and twigs',
  'leaves and wood',
  'leaves',
  'lichen',
  'milk',
  'nuts',
  'oil',
  'ol-re',
  'peel and seed',
  'peel',
  'petals',
  'pith',
  'plant and flower',
  'plant and flowers',
  'plant and fruit',
  'plant and oil',
  'plant and root',
  'plant and seed',
  'plant',
  'plants',
  'pods',
  'pollen',
  'powder of fruit',
  'powder',
  'pulp',
  'resin',
  'root and bark',
  'root and berries',
  'root and catkins',
  'root and extract',
  'root and flowers',
  'root and gum',
  'root and herb',
  'root and leaves',
  'root and plant',
  'root and seed',
  'root and stem',
  'root and tops',
  'root and twig',
  'root pulp',
  'root',
  'roots',
  'sap',
  'seaweed',
  'seed and bark',
  'seed and pods',
  'seed and root',
  'seed and tops',
  'seed',
  'seeds',
  'stem and leaves',
  'stem',
  'tops and roots',
  'tops and seed',
  'tops of plant',
  'tops',
  'tuber',
  'twig',
  'unexpanded flowers',
  'unripe fruit',
  'wood'
];

const propertiesMap = {
  "a-aph": "Anti-aphrodisiac",
  "a-bil": "Anti-bilious",
  "a-eme": "Anti-emetic",
  "a-epi": "Anti-epileptic",
  "a-hys": "Anti-hysteric",
  "a-lit": "Anthilitic",
  "a-per": "Anti-periodic",
  "a-phl": "Anti-phlogistic",
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
  ade: "Adenagic",
  ale: "Alexipharmic",
  alt: "Alterative",
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
  edi: "Edible",
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
  her: "Herpatic",
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

// In the edited source, expect these at the end of the second line.
const xrefRegExps = [
  new RegExp('Analogous to.+$'),
  new RegExp('Milder than.+$'),
  new RegExp('Poison Variety of.+$'),
  new RegExp('Species of.+$'),
  new RegExp('Varieties.+$'),
  new RegExp('Variety of.+$')
];

// In the edited source, expect these at the start of the second line when no parts are mentioned.
const infoRegExps = [
  new RegExp('^Antidote to[^\\.]+'),
  new RegExp('^As[^\\.]+'),
  new RegExp('^In[^\\.]+'),
  new RegExp('^Used[^\\.]+'),
  new RegExp('^Yields[^\\.]+')
];

function extract(entry) {
  const raw = entry.replace(/\r/g, '').trim();
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const first = lines[0] || '';
  const botanicalMatch = first.match(/^([^;—–\(\.,:]+)/);
  const botanical = botanicalMatch ? botanicalMatch[1].trim() : first.trim();
  const english = first.replace(new RegExp(`^${botanical}\\.?`), '').trim().split(/\./).map(s => s.trim()).filter(Boolean) || [];
  let second = lines[1] || '';
  const xrefs = [];
  const infos = [];
  if (second) {
    xrefRegExps.forEach(s => {
      second.match(s)?.forEach(m => {
        xrefs.push(m.trim());
        second = second.replace(m, '').trim();
      });
    });
    infoRegExps.forEach(s => {
      second.match(s)?.forEach(m => {
        infos.push(m.trim());
        second = second.replace(m, '').trim();
      });
    });
  }
  second = second.replace(/\.$/, '').trim();
  const parts = [];
  if (second) {
    const partsRegExp = new RegExp(`(${knownParts.join('|')})\\.\\s`, 'gi');
    const partsSplit = second.split(partsRegExp).filter(Boolean).map(s => s.trim());
    // partsSplit can be like [part1, props1, part2, props2, ...] or [part1, part2, ...].
    for (let i = 0; i < partsSplit.length; i += 2) {
      let partString = partsSplit[i];
      let rest = partsSplit[i + 1]?.split('.').map(s => s.trim()).filter(Boolean);
      if (!rest || !rest.length) {
        // No properties, just parts
        parts.push(partString);
        continue;
      } else if (knownParts.includes(rest[0].toLowerCase())) {
        // [part1, part2, ...], step back to re-process the next part in the next iteration.
        i -= 1;
      } else {
        partString += ` (${rest.map(r => (propertiesMap[r] || r)).join('; ')})`;
      }
      parts.push(partString);
    }
  }

  return {
    botanical,
    english,
    parts: Array.from(new Set(parts)),
    xrefs: Array.from(new Set(xrefs)),
    infos: Array.from(new Set(infos)),
    raw
  };
}

const entries = rawEntries.map((e, i) => {
  const r = extract(e);
  const slug = r.botanical.replace(/[^a-z0-9]+/ig, '-').replace(/^-|-$/g, '').toLowerCase();
  r.id = slug || `entry-${i + 1}`;
  r.index = i + 1;
  return r;
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(entries, null, 2), 'utf8');
console.log(`Wrote ${entries.length} entries to ${outPath}`);
