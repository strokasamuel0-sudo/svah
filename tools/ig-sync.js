/* Svah followerov – synchronizácia z Instagramu.
   Spúšťa sa v karte instagram.com (prihlásený účet @svah.followerov).
   Načíta sledovateľov a komentáre pod reelmi a zostaví dáta pre svah (window.__svahData). */
(async () => {
  const H = { 'X-IG-App-ID': '936619743392459', 'X-Requested-With': 'XMLHttpRequest' };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const toId = s => { let n = 0n; for (const c of s) n = n * 64n + BigInt(A.indexOf(c)); return n.toString(); };
  const OWNER = 'svah.followerov';

  // reely účtu
  const prof = await fetch('/api/v1/users/web_profile_info/?username=' + OWNER, { headers: H, credentials: 'include' }).then(r => r.json()).catch(() => null);
  let uid = prof && prof.data && prof.data.user && prof.data.user.id;
  const reelCodes = [...new Set([...document.querySelectorAll('a[href*="/reel/"]')].map(a => (a.getAttribute('href').match(/reel\/([^/]+)/) || [])[1]).filter(Boolean))];
  if (!uid && reelCodes.length) { const j = await fetch('/api/v1/media/' + toId(reelCodes[0]) + '/info/', { headers: H, credentials: 'include' }).then(r => r.json()); uid = j.items[0].user.pk; }

  // komentáre
  const comments = [];
  for (const sc of reelCodes) {
    const id = toId(sc); let min = null, pages = 0;
    do {
      const r = await fetch('/api/v1/media/' + id + '/comments/?can_support_threading=true&permalink_enabled=false' + (min ? '&min_id=' + encodeURIComponent(min) : ''), { headers: H, credentials: 'include' });
      if (!r.ok) break; const j = await r.json();
      for (const c of j.comments || []) comments.push({ u: c.user && c.user.username, t: c.text || '', ts: c.created_at, reel: sc });
      min = j.next_min_id; pages++; await sleep(500);
    } while (min && pages < 60);
  }

  // sledovatelia
  const followers = []; let max = null, pages = 0;
  do {
    const r = await fetch('/api/v1/friendships/' + uid + '/followers/?count=200' + (max ? '&max_id=' + encodeURIComponent(max) : ''), { headers: H, credentials: 'include' });
    if (!r.ok) break; const j = await r.json();
    for (const u of j.users || []) followers.push(u.username);
    max = j.next_max_id; pages++; await sleep(800);
  } while (max && pages < 100);
  const fol = new Set(followers);

  // parser
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const COLORS = [
    [/^(svetlo|bledo|pastel)\w*\s*ruz|^(svetlo|bledo|pastel)\w*ruz/, '#F7A8C8'], [/^(svetlo|bledo)\w*\s*modr|^(svetlo|bledo)modr/, '#8EC5F0'],
    [/^(svetlo|bledo)\w*\s*zelen/, '#A6E3A1'], [/^(svetlo|bledo|pastel)\w*\s*fial/, '#C9A7EB'], [/^tmavo\w*\s*modr|^tmavomodr/, '#123A75'], [/^tmavo\w*\s*zelen/, '#1F5F3A'],
    [/^(ruz|pink|tuzov|ruzov)/, '#E84A8A'], [/^(cerven|red\b|cerveno)/, '#C8102E'], [/^(modr|blue)/, '#1E5AA8'],
    [/^citron/, '#F7E35A'], [/^(zlt|zlut|zut|yellow)/, '#F2B705'], [/^fosfor/, '#B6F03C'], [/^(pistac|postac|pisrac)/, '#93C572'],
    [/^(zelen|green)/, '#2E9E5B'], [/^(fial|fual|filal|purple|lila)/, '#7A3FB8'], [/^(oranz|orandz|orange)/, '#F26B21'], [/^tyrkys/, '#0FA3B1'],
    [/^(ciern|cern|black)/, '#2B2D31'], [/^(biel|bil|white)/, '#F4F4F4'], [/^(hned|brown)/, '#6D4C41'], [/^(siv|sed|gray|grey)/, '#8A9099'],
    [/^(zlat|gold)/, '#D4AF37'], [/^(striebr|stribr|silver)/, '#C0C0C0'], [/^bezov/, '#D9C2A0'], [/^bordo/, '#7B1E3A'], [/^khaki/, '#7D7A3B']
  ];
  const colorOf = (w, prev) => {
    const two = (prev ? prev + ' ' : '') + w;
    for (const [re, hex] of COLORS.slice(0, 6)) if (re.test(two) || re.test(w)) return hex;
    for (const [re, hex] of COLORS.slice(6)) if (re.test(w)) return hex;
    return null;
  };
  const isSnow = w => /^(snow|snou|snov|snob|snb$|nowboar|sno?w?b)/.test(w) && !/^snez/.test(w);
  const isSki = w => /^(lyz|liz|lyž|lxz|ski$|lyzi|lyzar)/.test(w);
  const isSled = w => /^(sank|sane$|sanki|snky|sáne)/.test(w);
  const isBob = w => /^bob(y|ov)?$/.test(w);
  const ROLE = [[/rolb|ratrak|rolovat|upravova|lobar/, 'ratrak'], [/horsk\w* sluzb|zachran/, 'rescue'], [/hotel|kuchar/, 'hotel'], [/vlekar|lanovkar|budk/, 'lift'], [/maskot/, 'mascot'], [/zasnez|starat o sn|obsluh\w* del/, 'snow'], [/trener|instrukt/, 'coach'], [/skut(r|er)|snowmobil/, 'skuter']];
  const FREE = /freest|snowpark|snow park|skok|skak|trik|jump|red ?bul|pasaz/;

  const per = new Map();
  comments.sort((a, b) => a.ts - b.ts);
  for (const c of comments) {
    if (!c.u || c.u === OWNER) continue;
    const t = norm(c.t); const words = t.replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
    const e = per.get(c.u) || { u: c.u, ts: c.ts, texts: [] };
    e.texts.push(c.t.replace(/\s+/g, ' ').trim());
    for (const [re, role] of ROLE) if (re.test(t)) e.role = e.role || role;
    if (FREE.test(t)) e.f = 1;
    const num = t.match(/(?:cislo|cisl|number|c\.)\s*(\d{1,3})/); if (num && +num[1] > 0 && +num[1] !== 69) e.n = +num[1];
    const found = [];
    words.forEach((w, i) => {
      const col = colorOf(w, words[i - 1]);
      if (col) found.push({ i, col });
      if (isSnow(w)) e.t = 'snowboardista'; else if (isSled(w)) e.t = e.t || 'sankar'; else if (isBob(w)) e.t = e.t || 'bobista';
      else if (/skialp/.test(w)) e.t = 'skialpinista'; else if (/telemark/.test(w)) e.t = 'telemark'; else if (isSki(w) && !e.t) e.t = 'lyziar';
    });
    for (const f of found) {
      const next = words[f.i + 1] || '', prev2 = words[f.i - 1] || '';
      if (/^(nohav|kalhot)/.test(next)) e.p = f.col;
      else if (/^(helm|ciapk|cepic|cepk|prilb)/.test(next)) e.h = f.col;
      else if ((/^(lyz|liz)/.test(next) || /^(snow|snou|snov)/.test(next)) && (found.length > 1 || /bund/.test(t) || f.col === '#D4AF37' || f.col === '#C0C0C0')) e.s = f.col;
      else if (!e.c || /^bund/.test(next) || /^bund/.test(prev2)) e.c = f.col;
    }
    if (!e.c && /farebn|barevn/.test(t)) e.c = 'rainbow';
    per.set(c.u, e);
  }

  // zostavenie
  const out = [{ u: OWNER, g: 'ski', t: 'lyziar', c: '#1E5AA8', k: 'Prvá stopa je moja. Kto ide so mnou?' }];
  const roles = { ratrak: [], rescue: [], hotel: [], lift: [], mascot: [], snow: [], coach: [], skuter: [] };
  const notFollowing = [];
  for (const e of [...per.values()].sort((a, b) => a.ts - b.ts)) {
    if (!fol.has(e.u)) { notFollowing.push(e.u); continue; }
    if (e.role) roles[e.role].push(e.u);
    const signed = e.c || e.t;
    if (!signed) continue;
    const o = { u: e.u, g: 'ski', t: e.t || '', c: e.c || '', k: e.texts[0].slice(0, 90) };
    if (!e.t || !e.c) o.auto = 1;
    for (const key of ['n', 'h', 'p', 's', 'f']) if (e[key] !== undefined) o[key] = e[key];
    out.push(o);
  }
  const inData = new Set(out.map(o => o.u));
  for (const list of Object.values(roles)) for (const u of list) inData.add(u);
  const waiting = followers.filter(u => !inData.has(u) && u !== OWNER).sort();
  const data = { updated: new Date().toISOString(), followers: followers.length, skiers: out, waiting, roles, notFollowing: notFollowing.length };
  window.__svahData = data; window.__svahPer = per;
  return { followers: followers.length, comments: comments.length, skiers: out.length, auto: out.filter(o => o.auto).length, freestyle: out.filter(o => o.f).length, waiting: waiting.length, roles: Object.fromEntries(Object.entries(roles).map(([k, v]) => [k, v.length])), notFollowing: notFollowing.length };
})();
