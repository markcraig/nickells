async function init() {
  const res = await fetch('entries.json');
  const entries = await res.json();
  const gloss = await fetch('glossary.json');
  const glossary = await gloss.json();

  const options = { keys: ['botanical', 'english', 'properties', 'raw'], threshold: 0.2, distance: 500, includeScore: true };
  const fuse = new Fuse(entries, options);

  const searchInput = document.getElementById('search');
  const resultsDiv = document.getElementById('results');
  const detailDiv = document.getElementById('detail');

  let currentResults = [];
  let currentPage = 0;
  const pageSize = 7;

  function renderList(list) {
    currentResults = list || [];
    currentPage = 0;
    renderPage();
  }

  function renderPage() {
    resultsDiv.innerHTML = '';
    const total = currentResults.length;
    if (total === 0) { resultsDiv.innerHTML = '<p>No results</p>'; return; }

    const start = currentPage * pageSize;
    const end = Math.min(start + pageSize, total);

    const info = document.createElement('div');
    info.className = 'results-info';
    info.innerHTML = `<p>Showing ${start + 1}–${end} of ${total}</p>`;
    resultsDiv.appendChild(info);

    const ul = document.createElement('ul');
    currentResults.slice(start, end).forEach(item => {
      const li = document.createElement('li');
      function previewText(it) {
        if (it.english && it.english.length) return it.english.join(', ');
        const firstLine = (it.raw || '').split('\n')[0] || '';
        const secondLine = (it.raw || '').split('\n')[1]?.trim() || '';
        try {
          const botanicalSafe = it.botanical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const botanicalRegex = new RegExp('^' + botanicalSafe, 'i');
          let after = firstLine.replace(botanicalRegex, '');
          after = after.replace(/^[\s\-—–:;\.,]+/, '');
          after = after.trim();
          if (!after && !secondLine) return '(no preview)';
          const preview = (after && after.length) ? after : secondLine;
          return preview.length > 50 ? preview.slice(0, 50) + '…' : preview;
        } catch (e) {
          const t = firstLine.replace(/^[\s\-—–:;\.,]+/, '').trim();
          return t.length > 50 ? t.slice(0, 50) + '…' : (t || '(no preview)');
        }
      }
      const preview = previewText(item.item);
      li.innerHTML = `<strong>${escapeHtml(item.item.botanical)}</strong>` +
        (item.item.english && item.item.english.length ? ` — ${escapeHtml(item.item.english.join(', '))}` : ` — ${escapeHtml(preview)}`);
      li.addEventListener('click', () => showDetail(item.item));
      ul.appendChild(li);
    });
    resultsDiv.appendChild(ul);

    const controls = document.createElement('div');
    controls.className = 'pagination-controls';
    const prev = document.createElement('button');
    prev.textContent = 'Previous';
    prev.disabled = currentPage === 0;
    prev.addEventListener('click', () => { if (currentPage > 0) { currentPage--; renderPage(); } });
    const next = document.createElement('button');
    next.textContent = 'Next';
    next.disabled = end >= total;
    next.addEventListener('click', () => { if (end < total) { currentPage++; renderPage(); } });
    controls.appendChild(prev);
    controls.appendChild(next);
    resultsDiv.appendChild(controls);
  }

  function renderPart(part) {
    const glossRegExp = new RegExp(`(${Object.keys(glossary).join('|')})`, 'gi');
    return part.replace(glossRegExp, (match) => {
      return (glossary[match]) ? `<abbr title="${escapeHtml(glossary[match])}">${escapeHtml(match)}</abbr>` : match;
    });
  }

  function renderParts(item) {
    if (!item.parts || !item.parts.length) return '';
    return `<p><strong>Part(s) used:</strong> ${item.parts.map(part => renderPart(part)).join(', ')}</p>`;
  }

  function showDetail(item) {
    detailDiv.classList.remove('hidden');
    detailDiv.innerHTML = `<h2>${escapeHtml(item.botanical)}</h2>` +
      (item.english && item.english.length ? `<p><strong>Common name(s):</strong> ${escapeHtml(item.english.join(', '))}</p>` : '') +
      renderParts(item) +
      (item.xrefs && item.xrefs.length ? `<p><strong>Reference(s):</strong> ${escapeHtml(item.xrefs.join(', '))}</p>` : '') +
      (item.infos && item.infos.length ? `<p><strong>Additional information:</strong> ${escapeHtml(item.infos.join('; '))}</p>` : '') +
      `<pre style="display: none;">${escapeHtml(item.raw)}</pre>` +
      `<button id="close">Close</button>`;
    document.getElementById('close').addEventListener('click', () => { detailDiv.classList.add('hidden'); });
  }

  function escapeHtml(s) { return s.replace(/[&<>\"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;' }[c])); }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    if (!q) { const defaultList = entries.map(e => ({ item: e })); renderList(defaultList); return; }
    const results = fuse.search(q);
    renderList(results);
  });

  // initial message
  const defaultList = entries.map(e => ({ item: e })); renderList(defaultList);
}

init().catch(err => {
  document.body.innerHTML = `<pre>Failed to load entries: ${err}</pre>`;
});
