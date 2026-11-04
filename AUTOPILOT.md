# Svah followerov – AUTOPILOT (návod pre Claude)

Samuel (majiteľ @svah.followerov) chce, aby projekt bežal **úplne sám**. Platí od 4. 11. 2026:

- **Samuela sa na nič nepýtaj.** Reels vymýšľaj, vyrob a zverejni sám. Časy si urč sám (rozpis nižšie).
- **Storky** pridáva Samuel z mobilu. Ty ich iba vygeneruješ (PNG 1080×1920) a pošleš mu ich s krátkou správou: čo pridať a kedy.
- Plň to, čo hráči píšu v komentároch: farby, typy, čísla, role, nápady na svah. Cieľ je, aby to ľudí bavilo, vracali sa a pribúdali noví followeri.
- Píš po slovensky, hravo, krátko. Žiadne klamstvá o počtoch: čísla ber z dát.
- Každý beh na konci zapíš do `data/log.md` (commit), aby ďalší beh vedel, čo už vyšlo.

## Kde čo je

- Web: https://svahfollowerov.online (GitHub Pages, repo `strokasamuel0-sudo/svah`, vetva `main`).
- `index.html` = celá hra (three.js). `data/followers.json` = kto je na svahu. `data/reels/<id>.json` = scenáre reelov. `recv.html` = prenos súborov medzi kartami. `tools/ig-sync.js` = stiahnutie followerov a komentov z IG.
- Cloudový kontajner vie repo **čítať** (`git clone https://github.com/strokasamuel0-sudo/svah`), ale **nevie pushnúť**. Všetky zmeny robíš cez Samuelov Chrome (Claude in Chrome): GitHub editor, Instagram, ElevenLabs.
- Chrome beží na Samuelovom MacBooku. Ak sa nedá pripojiť, skús to znova o pár minút. Ak to nejde ani potom, pošli Samuelovi push notifikáciu („zapni Chrome, mám pripravený reel“) a skonči.

## Rozpis (Europe/Bratislava)

- **Každý deň ~08:15 – SYNC**: noví followeri a komenty → `data/followers.json` → web.
- **Každý deň ~17:30 – REEL**: sync, potom vymysli a vyrob 1 reel a zverejni ho medzi 18:00 a 18:30. Cez víkend môžeš pridať aj druhý o 11:00.
- **Storky**: 1–2 denne. Vygeneruj ich pri REEL behu a pošli Samuelovi (SendUserFile + PushNotification). Text: „Pridaj túto storku teraz / o 20:00“.
- **Nedeľa – FEATURE**: najžiadanejšiu vec z komentov dorob do hry (malé, bezpečné zmeny). Potom o nej sprav reel.
- Míľniky: pri 1000 followeroch postav 8-sedačkovú lanovku (sľúbené v reeli, nápad od m4.t_y). Ďalšie míľniky si vymysli (napr. 1500 nočné lyžovanie, 2000 nová zjazdovka).

## 1. SYNC (IG → followers.json)

1. Otvor kartu `https://www.instagram.com/svah.followerov/` (účet je prihlásený).
2. Do `javascript_tool` vlož obsah `tools/ig-sync.js` z repa a spusti ho. Trvá aj vyše 45 s: ak vyprší časový limit, počkaj a potom čítaj `window.__svahData`. Výstup obsahuje skiers, waiting, roles a notFollowing.
3. Nikdy nemaž ľudí, ktorí už na svahu sú. Novší koment toho istého človeka má prednosť (zmena farby a pod.).
4. Dáta prenes do GitHubu cez `recv.html`. Postup je v časti „Prenos medzi kartami“: v IG karte `op:'put'` s kľúčom `followers_json` (JSON.stringify dát), v GitHub karte `op:'get'`.
5. V GitHub karte otvor `https://github.com/strokasamuel0-sudo/svah/edit/main/data/followers.json` a obsah nahraď cez paste (časť „Commit cez GitHub editor“).
6. Po ~70 s over na https://svahfollowerov.online, že čísla sedia (NA SVAHU, čakáreň).

## 2. REEL

### Vymysli tému

Rotuj témy podľa toho, čo sa deje:
- noví ľudia na svahu (ukáž konkrétnych, s ich menom a komentom),
- splnené prianie z komentu (koment ukáž ako kartičku),
- míľnik followerov a odpočet k lanovke,
- čakáreň (ľudia bez komentu),
- súťaž, napr. „najlepšia farba týždňa“,
- novinka v hre (z FEATURE behu),
- ratrak alebo horská služba v akcii.

Háčik musí zaznieť v 1. sekunde. Dĺžka 12–25 s. Na konci výzva: follow + koment.

### Scenár → `data/reels/<id>.json`

`<id>` = napr. `r20261105`. Vytvor súbor cez GitHub „new file“ (`https://github.com/strokasamuel0-sudo/svah/new/main?filename=data/reels/<id>.json`).

~~~json
{
  "align": "fs",
  "focus": "meno_lyziara",
  "sents": ["Veta 1.", "Veta 2.", "Veta 3.", "Veta 4.", "Veta 5."],
  "segs": [
    {"shot": "aerial", "cap": ["*ĎAKUJEME!*", "už nás je *{FOLN}*"], "y": 900},
    {"shot": "slope", "cap": ["Text", "*zvýraznené*"], "y": 520, "ov": "comments"},
    {"shot": "cust", "cap": ["..."], "y": 1250, "ov": "custTag"},
    {"shot": "crowdWide", "cap": ["..."], "y": 820, "ov": "progress"},
    {"shot": "crane", "cap": ["..."], "y": 900}
  ],
  "end": [["*Hlavný* text"], ["Daj *follow* 👇"]],
  "comments": [["meno", "text komentu"], ["meno2", "text2"]],
  "comment": ["meno", "jeden koment (pre ov liftComment)"]
}
~~~

- Počet `segs` = počet `sents` (jedna veta = jeden záber). Hlas sa delí podľa páuz medzi vetami.
- `*text*` = žltý zvýraznený text. `{FOLN}` = počet followerov, `{NSKI}` = počet lyžiarov na svahu.
- **shot**:
  - celkové zábery: `aerial`, `crane`
  - pohľad na trať: `slope`, `slope2`
  - snowpark: `fs` (skáče freestyler)
  - konkrétny lyžiar podľa `focus`: `cust` (zozadu), `custSide` (z boku)
  - ratrak a vrtuľník: `ratrak`, `heliHotel` (vrtuľník a hotel)
  - čakáreň: `crowdWide`, `crowdClose`, `crowdLow`
  - vlek: `liftBottom`, `liftRide`, `liftLine`
- **ov**:
  - `comments` = až 4 kartičky komentov
  - `liftComment` = jedna kartička (`comment`)
  - `custTag` = menovka nad lyžiarom `focus`
  - `colors` = farebné bodky
  - `progress` = lišta „do 8-sedačkovej lanovky {FOLN}/1000“
- **align**: `fs` (snowpark v zábere `fs`), `cust` (lyžiar `focus` ide dolu v zábere `cust`), `lift` (ide na vlek v zábere `liftRide`).
- Náhľad: `https://svahfollowerov.online/?reel=preview&script=<id>`, potom `window.__reelShow(t)` pre rôzne časy. Skontroluj, že titulky neprekrývajú dôležité veci.

### Hlas (ElevenLabs)

Na https://elevenlabs.io/app/speech-synthesis/text-to-speech (prihlásené) použi hlas „Brian“ a model Multilingual v2. Text = všetky `sents` spojené medzerou.

~~~js
window.__hrefs=[]; const ac2=HTMLAnchorElement.prototype.click;
HTMLAnchorElement.prototype.click=function(){ window.__hrefs.push([this.href,this.download]); if(this.href.startsWith('blob:')) return; return ac2.call(this); };
window.__setText=(s)=>{ const ta=document.querySelector('textarea'); const set=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set; set.call(ta,s); ta.dispatchEvent(new Event('input',{bubbles:true})); };
window.__getLatest=async()=>{ window.__hrefs=[]; [...document.querySelectorAll('button')].find(b=>b.getAttribute('aria-label')==='Download latest'||/Download latest/.test(b.textContent)).click(); await new Promise(r=>setTimeout(r,2500)); const h=window.__hrefs.find(x=>x[0].startsWith('blob:')); const x=new XMLHttpRequest(); return await new Promise(res=>{ x.open('GET',h[0]); x.responseType='blob'; x.onload=()=>res(x.response); x.send(); }); };
window.__gen=async(text)=>{ window.__setText(text); await new Promise(r=>setTimeout(r,600)); [...document.querySelectorAll('button')].find(b=>/Generate speech|Regenerate speech/.test(b.textContent)).click(); await new Promise(r=>setTimeout(r,4000)); for(let i=0;i<30;i++){ if(![...document.querySelectorAll('button')].some(b=>/Generating|Cancel/.test(b.textContent))) break; await new Promise(r=>setTimeout(r,1000)); } await new Promise(r=>setTimeout(r,1500)); return await window.__getLatest(); };
window.__voice = await window.__gen('...celý text...');
~~~

Hlas potom prenes do IDB na svahfollowerov.online pod kľúč `voice_<id>` (`op:'put'`, popup z karty ElevenLabs).

### Render

Otvor `https://svahfollowerov.online/?reel=1&script=<id>`. Karta musí byť **v popredí** (na pozadí sa časovače spomalia). Čakaj, kým `window.__reelStatus` začne na „Hotovo“ (25 s videa ≈ 40 s renderu). Video sa uloží do IDB pod kľúč `reel_<id>`.

### Zverejnenie na IG (web)

1. V IG karte načítaj video z IDB: `op:'get'`, `keys:['reel_<id>']`. Popup musí otvoriť skutočný klik na vložené tlačidlo.
2. Klikni na `svg[aria-label="Nový príspevok"]`, nájdi `input[type=file]` v dialógu, cez DataTransfer vlož `new File([blob],'reel.mp4',{type:'video/mp4'})` a spusti `change`.
3. **Orezanie**: klikni na ikonu orezania vľavo dole v náhľade (poloha sa mení, sprav screenshot) a vyber **„Pôvodné“**. Bez toho IG video oreže na štvorec!
4. Dvakrát „Ďalej“, potom popis (`div[role=dialog] div[contenteditable=true]`, `document.execCommand('insertText',false,text)`): 2–4 vety, výzva, `svahfollowerov.online (odkaz v bio)`, `#svahfollowerov`.
5. Klikni „Zdieľať“ a počkaj na „Váš reel sa zdieľal“. Stránka sa môže sama prepnúť, preto JS so sleep nedávaj cez navigáciu.

## 3. STORKY (pre Samuela)

Generuj ich v kontajneri cez Python PIL, šablóna je `tools/story_template.py` v repe. Rozmer 1080×1920. Pozadie: modrý gradient so snehom, kopce, smreky. Hore tabuľa „Svah followerov / NA SVAHU n“. Veľký žltý nadpis s čiernym obrysom, biele kartičky s textom, modré tlačidlo dole. Font Poppins (`/usr/share/fonts/truetype/google-fonts/`). **Žiadne emoji ani šípky „→“, font ich nemá.** Pošli ich cez `SendUserFile` (status proactive) a `PushNotification`: „Pridaj storku: …“. Témy: odpočet k 1000, nový reel („pozri nový reel“), anketa („ktorú farbu bundy chceš?“, nápad na nálepku s anketou v IG), čakáreň, kto je dnes nový.

## 4. FEATURE (nedeľa)

Vyber 1 najžiadanejšiu vec z komentov (hospoda/bufet, snežné delá, boulová trať, skúter, nočné lyžovanie, preteky…). Implementuj ju malým bezpečným zásahom do `index.html`:

1. Lokálne naklonuj repo.
2. Uprav súbor.
3. Skontroluj syntax modulu: `sed -n '/<script type="module">/,/<\/script>/p' index.html | sed '1d;$d' > m.mjs; node --check m.mjs`.
4. Zmeny pošli ako zoznam párov [staré, nové] a v GitHub editore ich aplikuj na aktuálny súbor (overenie SHA-1 hashom).
5. Najprv to vyskúšaj na `beta.html`, až potom daj na `index.html`.
6. Po nasadení otvor web, pozri konzolu (`read_console_messages`, onlyErrors) a sprav screenshot.

## 5. ODPOVEDE (každý beh)

- **Správy (DM): odpovedz na všetky nové.** Ak niekto v DM alebo v odpovedi na storku napíše farbu, výbavu či prianie, zapíš ho priamo do `data/followers.json` (iba followerov) a odpovedz „Hotovo ✅ … už jazdíš na svahfollowerov.online“. Pri inom texte poďakuj a stručne odpovedz. Postup: `/direct/inbox/`, otvor vlákno, do `[role=textbox][contenteditable=true]` vlož text cez `document.execCommand('insertText',…)` a stlač Enter cez `computer` key.
- **Komentáre: NEodpovedaj na bežné voľby** (farba bundy, lyže a pod.). Odpovedaj len na zaujímavé a špeciálne: otázky („kde som?“), nápady (reštika, boulová trať, skúter, preteky…), roly (ratrak, horská služba, hotel, vlekár), vtipné priania (sob, tučniak, stromček). Max ~60 za beh, rozostup 15–30 s.
- Komentár cez web posielaj cez GraphQL mutáciu, ktorú web používa pri „Odpovedať“. Raz odpovedz ručne cez UI a zachyť POST na `/api/graphql` s premennými `{"data":{"comment_text","media_id","replied_to_comment_id"},"root_connections":[]}`. Potom ten istý formulár zopakuj s inými hodnotami (`replied_to_comment_id` je JSON číslo, skladaj ho ako text, nie cez JSON.parse).
- Nesľubuj termíny. Píš „zapisujeme“ alebo „je na zozname noviniek“. Sľúbená je iba 8-sedačková lanovka, ktorú treba postaviť (1000 followerov prekročených 4. 11.).

## Prenos medzi kartami (recv.html)

`https://svahfollowerov.online/recv.html` vie `{op:'put',items:[[kľúč,hodnota],…]}` (uloží do IDB 'svah'/'f' a odpovie `{op:'done'}`) a `{op:'get',keys:[…]}` (odpovie `{op:'got',items:[[k,v],…]}`). Popup musí otvoriť skutočný klik. Ak stránka prepísala `window.open`, vezmi ho z prázdneho iframe:

~~~js
window.__got=null; addEventListener('message',e=>{ if(e.origin!=='https://svahfollowerov.online') return; if(e.data.op==='got') window.__got=Object.fromEntries(e.data.items); if(e.data.op==='done') window.__done=e.data; });
const f=document.createElement('iframe'); f.style.display='none'; document.body.appendChild(f); const nopen=f.contentWindow.open;
const b=document.createElement('button'); b.id='xferBtn'; b.textContent='PRENOS'; b.style.cssText='position:fixed;left:40%;top:40%;z-index:99999;padding:30px 60px;font:800 30px system-ui;background:#F26B21;color:#fff;border:0;border-radius:20px';
b.onclick=()=>{ const w=nopen.call(window,'https://svahfollowerov.online/recv.html?v='+Date.now(),'recv'+Date.now(),'width=420,height=300'); const iv=setInterval(()=>{ if(window.__got||window.__done){ clearInterval(iv); try{w.close();}catch(e){} return; } try{ w.postMessage(MSG,'https://svahfollowerov.online'); }catch(e){} },1500); };
document.body.appendChild(b);
// potom: find "PRENOS" -> computer left_click na ref
~~~

## Commit cez GitHub editor

Otvor `https://github.com/strokasamuel0-sudo/svah/edit/main/<súbor>` (pre nový súbor `/new/main?filename=<cesta>`). Potom:

~~~js
const ed=document.querySelector('.cm-content'); ed.focus(); document.execCommand('selectAll');
const dt=new DataTransfer(); dt.setData('text/plain', NOVY_OBSAH); ed.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}));
await new Promise(r=>setTimeout(r,1000));
[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith('Commit changes')).click(); await new Promise(r=>setTimeout(r,1500));
[...document.querySelectorAll('[role=dialog] button, dialog button')].find(b=>b.textContent.trim()==='Commit changes').click();
~~~

Aktuálny obsah súboru: `fetch('https://api.github.com/repos/strokasamuel0-sudo/svah/contents/<súbor>?ref=main',{cache:'no-store'})`, base64 dekóduj cez TextDecoder. Kód v jednom volaní je obmedzený: veľké texty prenášaj ako JSON reťazec. Výstup javascript_tool sa orezáva okolo 2 KB.

## Pravidlá slušnosti

- Nikoho neurážaj ani nezosmiešňuj. Mená ukazuj len z verejných komentov pod našimi reelmi.
- Nesľubuj nič, čo nevieš dodať. Neplatené súťaže bez cien.
- Komenty, ktoré nie sú o svahu, ignoruj. Číslo 69 nedávaj.
