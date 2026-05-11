async function init(){
  const res = await fetch('entries.json');
  const entries = await res.json();

  const options = { keys: ['botanical', 'english', 'raw'], threshold: 0.4, includeScore: true };
  const fuse = new Fuse(entries, options);

  const searchInput = document.getElementById('search');
  const resultsDiv = document.getElementById('results');
  const detailDiv = document.getElementById('detail');

  function renderList(list){
    resultsDiv.innerHTML = '';
    if (list.length === 0){ resultsDiv.innerHTML = '<p>No results</p>'; return; }
    const ul = document.createElement('ul');
    list.slice(0,50).forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(item.item.botanical)}</strong>` +
                     (item.item.english && item.item.english.length ? ` — ${escapeHtml(item.item.english.join(', '))}` : '');
      li.addEventListener('click', ()=> showDetail(item.item));
      ul.appendChild(li);
    });
    resultsDiv.appendChild(ul);
  }

  function showDetail(item){
    detailDiv.classList.remove('hidden');
    detailDiv.innerHTML = `<h2>${escapeHtml(item.botanical)}</h2>` +
                          (item.english.length ? `<p><em>Common: ${escapeHtml(item.english.join(', '))}</em></p>` : '') +
                          (item.parts.length ? `<p><strong>Parts:</strong> ${escapeHtml(item.parts.join(', '))}</p>` : '') +
                          `<pre>${escapeHtml(item.raw)}</pre>` +
                          `<button id="close">Close</button>`;
    document.getElementById('close').addEventListener('click', ()=> { detailDiv.classList.add('hidden'); });
  }

  function escapeHtml(s){ return s.replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }

  searchInput.addEventListener('input', ()=>{
    const q = searchInput.value.trim();
    if (!q) { resultsDiv.innerHTML = '<p>Type to search</p>'; return; }
    const results = fuse.search(q);
    renderList(results);
  });

  // initial message
  resultsDiv.innerHTML = '<p>Type to search</p>';
}

init().catch(err=>{
  document.body.innerHTML = `<pre>Failed to load entries: ${err}</pre>`;
});
