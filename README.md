# Nickell's Botanical Ready Reference

A scan of _J. M. Nickell's Botanical Ready Reference_ is available at the [Internet Archive](https://archive.org/download/jmnickellsbotani00nick). Nickell originally published the book around 1881. His organization published this edition in 1911. The book is out of copyright according to the [Biodiversity Heritage Lab](https://www.biodiversitylibrary.org/bibliography/4299).

The book provides an indexed reference to the then-known list of botanical drugs with their botanical (Latin) and common (English) names. Nickell's preface states his aim was to facilitate sales, ensuring the druggist could locate the requested botanical even if the customer only knew it by a common name. In addition to the names, Nickell generally describes how the plant is conditioned (for example, capsules) or which part is used (for example, root, leaves, or (whole) plant), a list of abbreviations of its medical properties, and other parenthetical information.

The Internet Archive holds scanned copies of the book and the Optical Character Recognition (OCR) files. Unfortunately, the OCR process doesn't seem to have included manual correction. The text is riddled with missing bits, typos, and random garbage the OCR software failed to interpret. Perhaps, as described in [this page about correcting OCR errors](https://learn.scds.ca/text-analysis-1/lessons/ocr-correction.html), "Presently, the only way to achieve 100% accuracy with OCR text output is to manually correct each misspelled word."

The [manually "corrected" OCR text file](./jmnickellsbotani00nick_edited.txt) removes covers, front matter, indexes (including the index of German names), and back matter suggestions for gathering and preparing botanicals and advertisements. It also removes the numbers of the entries, as they're only really useful with the indexes. In the reference, each entry starts with the Latin name(s), optionally followed by common English name(s), the part(s) of the plant used with abbreviations for the part's medical properties, and other information.

If Nickell were distributing this information today, he might offer a web page or mobile application to facilitate full-text search. The application could show the available information by type, such as "Botanical name(s)", "English name(s)", "Part(s) used with their medical properties", and "Additional information". The web page or mobile application could use a lookahead search to find and display entries that match what the user types.

Restoring the German names to the entries from the German name index in the original book is left for a later time.

## Web application (static JS + JSON)

The application:

- `parser/generate_json.js` — Node.js parser that reads jmnickellsbotani00nick_edited.txt, splits entries on blank lines, extracts fields and maps medical-property abbreviations to full names (`propertiesMap`), and writes `web/entries.json`.
- `web/index.html`, `web/app.js`, `web/styles.css` — a small static frontend that loads entries.json and provides client-side full-text search using [Fuse.js](https://www.fusejs.io); shows botanical and common names, parts, and expanded property names.
- `package.json` with a "build" script that runs the parser and generates `web/entries.json`.

Build & preview (local)
1. Ensure Node.js is installed (node >= 14).
2. From the repository root run:
   ```
   npm run build
   ```
   This runs `parser/generate_json.js` and writes `web/entries.json`.

3. Serve the `web/` folder (example):
   ```
   cd web && npx serve
   ```
   Open <http://localhost:3000> in your browser.

## Deploy to a self-hosted VPS (example)

1. Copy site files to the web root on your VPS (replace user@vps and path):
   ```
   rsync -avz --delete web/ user@your-vps:/var/www/nickells/
   ```

2. Example nginx server block (replace example.com and path):
   ```
   server {
     listen 80;
     server_name example.com;
     root /var/www/nickells;
     index index.html;
     location / { try_files $uri $uri/ =404; }
   }
   ```

3. Reload nginx:
   ```
   sudo systemctl reload nginx
   ```

##  Notes & next steps
- The site is fully static; search runs in the browser (Fuse.js).
- The parser makes simple heuristics — OCR artifacts may require improving extraction rules. Suggestions: tighten token matching for properties (handle OCR variants), extract multi-line English names, or split entries into more structured fields.
- If you want, next actions can include UI improvements (badges, filters), CI for automated builds and deploys, or parser refinement.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
