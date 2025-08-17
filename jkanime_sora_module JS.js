
// Módulo JkAnime para Sora
// Permite buscar, listar episodios, obtener info y streams de JkAnime.net

async function search(query) {
    const url = `https://jkanime.net/search?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const results = [];
    doc.querySelectorAll('.ListAnimes li a').forEach(el => {
        results.push({
            title: el.querySelector('h3')?.textContent.trim() || '',
            url: el.href,
            image: el.querySelector('img')?.src || ''
        });
    });
    return results;
}

async function episodes(animeUrl) {
    const res = await fetch(animeUrl);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const eps = [];
    doc.querySelectorAll('.EpisodesList li a').forEach(el => {
        eps.push({
            title: el.textContent.trim(),
            url: el.href
        });
    });
    return eps.reverse(); // poner en orden cronológico
}

async function info(animeUrl) {
    const res = await fetch(animeUrl);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return {
        title: doc.querySelector('.AnimeTitle h1')?.textContent.trim() || '',
        synopsis: doc.querySelector('.AnimeSynopsis')?.textContent.trim() || '',
        image: doc.querySelector('.AnimeCover img')?.src || '',
        genres: Array.from(doc.querySelectorAll('.AnimeGenres a')).map(g => g.textContent.trim())
    };
}

async function stream(episodeUrl) {
    const res = await fetch(episodeUrl);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const videoEl = doc.querySelector('video source');
    if(videoEl) {
        return { url: videoEl.src, type: 'mp4' };
    }
    return null;
}
