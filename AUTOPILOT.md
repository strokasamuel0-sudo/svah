# Svah followerov – AUTOPILOT (návod pre Claude)

Samuel (majiteľ @svah.followerov) chce, aby projekt bežal **úplne sám**. Platí od 4. 11. 2026:

- **Samuela sa na nič nepýtaj.** Reels vymýšľaj, vyrob a zverejni sám. Časy si urč sám (rozpis nižšie).
- **Storky** pridáva Samuel z mobilu. Ty ich iba vygeneruješ (PNG 1080×1920) a pošleš mu ich s krátkou správou: čo pridať a kedy.
- Plň to, čo hráči píšu v komentároch: farby, typy, čísla, role, nápady na svah. Cieľ je, aby to ľudí bavilo, vracali sa a pribúdali noví followeri.
- Píš po slovensky, hravo, krátko. Žiadne klamstvá o počtoch: čísla ber z dát.
- Každý beh na konci zapíš do `data/log.md` (commit), aby ďalší beh vedel, čo už vyšlo.

## ⭐ AKTUÁLNY REŽIM (od 4. 11. 2026, 16:45) – má prednosť pred starším rozpisom nižšie

Samuel: „Zapneš sa dvakrát za deň a urobíš všetko, čo treba. Každý deň 100 % aktualizované, videá správne, nech ľudia stále majú záujem.“

**Dva behy denne: ~11:40 a ~18:40.** Každý beh = celý cyklus, v tomto poradí:

1. **Príprava:** `git clone` repa, prečítaj tento súbor a `data/log.md` (ciele, sľuby, čo už vyšlo, `POSLEDNÝ_KOMENT_TS`). Ak je pripojených viac Chrome, vyber ten, kde je prihlásený IG (videá v IDB sú v ňom). Ak `find` hlási limit, klikaj súradnicami (`getBoundingClientRect`).
2. **Sync followerov a komentov** (sekcia 1, `tools/ig-sync.js` – číta aj odpovede, roly ratrak/rescue/hotel/lift/mascot/snow/coach/skuter, „svah N“ → pole `r`). **Vždy prejdi VŠETKY komentáre zo VŠETKÝCH reelov (staré aj nové)** – Samuel 12. 11.: aj keď niekto nový napíše pod staré video, pridaj ho na svah s tým, čo chce. Každý komentujúci follower s voľbou musí byť medzi lyžiarmi; ak má novší koment ako `POSLEDNÝ_KOMENT_TS` (`per.last`), jeho najnovšia voľba vyhráva. Zlúč so súčasným `followers.json` – zachovaj VŠETKY kľúče (skiers, waiting, roles, chatky, notFollowing), odhlásených odstráň, novších followerov bez komentu daj do čakárne; commitni.
3. **Správy:** prijmi všetky žiadosti o správy a odpíš **všetkým** novým správam. **Zmeny cez DM NEROBÍME** (Samuel 12. 11.): kto v správe chce niečo zmeniť alebo pridať (bunda, lyže, rola, svah…), tomu vždy odpíš, že to musí napísať ako komentár pod ktorýkoľvek reel a pri večernej úprave sa to zmení. Časy zo Zjazdu na čas (DM aj označenia v storkách) zapíš do rebríčka v logu.
4. **Komentáre: NEODPISUJ** (Samuel 4. 11. 17:16 – platí namiesto všetkých starších pravidiel o komentároch). Jediná výnimka: kto v komente niečo chce (bunda, lyže, snowboard, rola, svah…), ale NESLEDUJE profil – tomu krátko odpíš, že musí dať follow @svah.followerov a potom ho pridáme. Každému najviac raz. Nikomu inému na komenty neodpisuj. Požiadavky followerov z komentov ale vždy splň (zapíš na stránku). Na svahu sú iba followeri.
5. **Splň zadania:** dátové veci hneď (krok 2–3). Nápady na svah (budovy, roly, mechaniky): v každom behu postav aspoň 1 najžiadanejšiu vec, ktorá ešte nie je (beta.html → test konzoly a screenshotu → index.html). Nové roly pridaj do `ROLES` v index.html aj do `tools/ig-sync.js`.
6. **Ciele:** v logu je aktuálny cieľ (teraz: **pri 3500 followeroch predĺžime svah až na Mount Everest**). Keď je splnený, postav ho a hneď stanov ďalší (zapíš do logu a ohlás v najbližšom videu).
7. **Video (1 za beh, zverejni v tom istom behu):**
   - obed: noví ľudia + splnené priania (kartičky reálnych komentov, kto čo chcel) alebo súťaž/rebríček;
   - večer: novinka dňa alebo hecovanie k cieľu / hlasovanie.
   - Kvalita: háčik v 1. sekunde, 15–28 s, skutočné čísla z dát, kartička komentu pri každej splnenej veci, výzva na konci. Pred renderom pozri náhľad (`?reel=preview&script=<id>` + `__reelShow(t)`) aspoň pre každý záber – titulky nesmú zakrývať postavu. Hlas ElevenLabs (Brian, Multilingual v2), render `?reel=1&script=<id>` (karta v popredí), IG orezanie **„Pôvodné“**.
   - Zábery: aerial, crane, slope, slope2, fs, cust, custSide, liftRide, liftBottom, liftLine, chairRide, chairLine, chairTop, ratrak, heliHotel, crowdWide/Close/Low, **game / gameFront / gameHigh** (pretekár `SC.racer`, `SC.hideCrowd`), **tagCam** (`tag`, `dist`, `ang` – kamera okolo človeka v role), **skuter**, **cafe**. Overlaye: comments, liftComment, custTag, colors, progress, **goal** (`SC.goal=[cieľ,"text"]`), **tapRace**, **runPick**, v každom zábere `comment:[meno,text]` (+`cy`) a `tag:"meno"`.
8. **Storka:** večer 1 PNG pre Samuela (SendUserFile + push), napr. rebríček, nový cieľ alebo novinka.
9. **Log:** dátum, čas, video id, čo si pridal, počty (followeri, lyžiari, čakáreň), rebríček, ciele, `POSLEDNÝ_KOMENT_TS`. Na konci pošli Samuelovi 2–3 vety push.

Kapacita svahov: zjazdovka 250 (CAP), snowpark 60 (FS_CAP); keď sú plné, automaticky pribudne ďalšia zjazdovka – oznám to vo videu.

## Kde čo je

- Web: https://svahfollowerov.online (GitHub Pages, repo `strokasamuel0-sudo/svah`, vetva `main`).
- `index.html` = celá hra (three.js). `data/followers.json` = kto je na svahu. `data/reels/<id>.json` = scenáre reelov. `recv.html` = prenos súborov medzi kartami. `tools/ig-sync.js` = stiahnutie followerov a komentov z IG.
- Cloudový kontajner vie repo **čítať** (`git clone https://github.com/strokasamuel0-sudo/svah`), ale **nevie pushnúť**. Všetky zmeny robíš cez Samuelov Chrome (Claude in Chrome): GitHub editor, Instagram, ElevenLabs.
- Chrome beží na Samuelovom MacBooku. Ak sa nedá pripojiť, skús to znova o pár minút. Ak to nejde ani potom, pošli Samuelovi push notifikáciu („zapni Chrome, mám pripravený reel“) a skonči.

## Rozpis (Europe/Bratislava)

- **Každý deň ~08:15 – SYNC**: noví followeri a komenty → `data/followers.json` → web.
- **Každý deň ~17:30 – SYNC + NOVINKA + REEL**: pridaj nových hráčov, postav do hry 1 vec, ktorú hráči v komentoch chcú najviac a ešte nie je hotová (sekcia 4), a sprav o nej pútavý reel. Zverejni ho medzi 18:00 a 18:30. Samuel nechce na novinky čakať do nedele, majú byť každý večer.
- **Storky**: 1–2 denne. Vygeneruj ich pri REEL behu a pošli Samuelovi (SendUserFile + PushNotification). Text: „Pridaj túto storku teraz / o 20:00“.
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

### PRAVIDLO: každá novinka = vlastný reel s komentmi (Samuelova požiadavka)

Keď na svahu pribudne nová vec (reštika, kaviareň, boulová trať, skúter…), vždy o nej vyjde **samostatný reel**, ktorý ukazuje, **kto ju chcel a čo napísal**:
- Na začiatku háčik (napr. „Chceli ste kaviareň? Máte ju!“).
- Hneď potom záber s `ov:"comments"` a `comments` = 2–4 **skutočné komentáre** (presné meno a text, ako ich napísali) od ľudí, ktorí to žiadali. Vyzerajú ako výstrižky komentárov z IG. Do hlasu daj vetu typu „Viacerí z vás písali, že chcú…“.
- Potom záber na novú vec v hre (pridaj nový `shot` do `index.html` podľa vzoru existujúcich, napr. kamera na novú budovu), nakoniec `crane` a výzva follow + koment.
- V popise reelu poďakuj ľuďom, ktorí to navrhli (@meno, max 3–4), a vyzvi: „Čo postavíme ďalej? Napíš do komentu 👇“.
- Komenty ber z API komentárov pod reelmi (`window.__cm` zo SYNC), vyber tie najvýstižnejšie a najstaršie.

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

## 4. NOVINKA (každý večer)

Vyber 1 najžiadanejšiu vec z komentov (hospoda/bufet, snežné delá, boulová trať, skúter, nočné lyžovanie, preteky…). Implementuj ju malým bezpečným zásahom do `index.html`:

1. Lokálne naklonuj repo.
2. Uprav súbor.
3. Skontroluj syntax modulu: `sed -n '/<script type="module">/,/<\/script>/p' index.html | sed '1d;$d' > m.mjs; node --check m.mjs`.
4. Zmeny pošli ako zoznam párov [staré, nové] a v GitHub editore ich aplikuj na aktuálny súbor (overenie SHA-1 hashom).
5. Najprv to vyskúšaj na `beta.html`, až potom daj na `index.html`.
6. Po nasadení otvor web, pozri konzolu (`read_console_messages`, onlyErrors) a sprav screenshot.

## 5. ODPOVEDE (každý beh)

- **Správy (DM): odpovedz na všetky nové.** Ak niekto v DM alebo v odpovedi na storku napíše farbu, výbavu či prianie, NEZAPISUJ ho – odpíš, že to treba napísať ako komentár pod ktorýkoľvek reel (napr. „modrá bunda a snowboard“) a pri večernej úprave sa to zmení (Samuel 12. 11.). Pri inom texte poďakuj a stručne odpovedz. Postup: `/direct/inbox/`, otvor vlákno, do `[role=textbox][contenteditable=true]` vlož text cez `document.execCommand('insertText',…)` a stlač Enter cez `computer` key.
- **Komentáre: NEodpovedaj na bežné voľby** (farba bundy, lyže a pod.). Odpovedaj len na zaujímavé a špeciálne: otázky („kde som?“), nápady (reštika, boulová trať, skúter, preteky…), roly (ratrak, horská služba, hotel, vlekár), vtipné priania (sob, tučniak, stromček). Max ~60 za beh, rozostup 15–30 s.
- Komentár cez web posielaj cez GraphQL mutáciu, ktorú web používa pri „Odpovedať“. Raz odpovedz ručne cez UI a zachyť POST na `/api/graphql` s premennými `{"data":{"comment_text","media_id","replied_to_comment_id"},"root_connections":[]}`. Potom ten istý formulár zopakuj s inými hodnotami (`replied_to_comment_id` je JSON číslo, skladaj ho ako text, nie cez JSON.parse).
- Nesľubuj termíny. Píš „zapisujeme“ alebo „je na zozname noviniek“. Sľúbená je iba 8-sedačková lanovka, ktorú treba postaviť (1000 followerov prekročených 4. 11.).

### PRAVIDLO: hecovanie a míľniky (Samuelova požiadavka)

Nie každý reel má hneď dodať novinku. Striedaj ich:
- **Teaser alebo míľnik**: „Keď nás bude 2000, postavíme hore kaviareň“ alebo „pri 2500 predĺžime svah až na Mount Everest“ (nápad z komentov). Pridaj `progress` lištu (ak treba, uprav text a cieľ v `index.html`) a kartičky komentov, kto to chcel.
- **Novinka**: keď sa cieľ splní, vyjde reel „Splnili ste to!“.
- **Hlasovanie**: „Čo postavíme pri 2000? Napíš do komentu: kaviareň, Everest alebo skúter“. Výsledok potom oznám v ďalšom reeli.
- **Súťaže a výzvy**: najrýchlejší zjazd dňa, najkrajšia bunda týždňa, kto nájde maskota.
- Pomer: zhruba 1 teaser alebo hlasovanie na 1 novinku. Míľniky a sľuby si zapisuj do `data/log.md` a vždy ich dodrž.

## 6. ROADMAP – interaktívnosť a dizajn (stavaj postupne vo večerných behoch, každá vec = vlastný reel)

1. **„Moja fotka“**: tlačidlo na karte lyžiara vygeneruje obrázok 1080×1920 (jeho lyžiar, meno, číslo, svah), ktorý si stiahne a pridá do storky s @svah.followerov. Bez servera, cez canvas a download. Najväčší rast followerov.
2. **„Zjazd na čas“**: hráč si sám zjazdí so svojím lyžiarom (šípky alebo naklonenie mobilu), prejde bránkami a dostane čas. Rekord sa uloží v prehliadači a výsledok si stiahne ako obrázok. Najlepšie časy z obrázkov, ktoré ľudia pošlú do DM, vyhlás v reeli.
3. **Povzbuď kamoša**: zdieľateľný odkaz `svahfollowerov.online/#lyziar-N`, ktorý otvorí rovno toho lyžiara (už funguje), plus tlačidlo „Pošli kamošovi“ (navigator.share).
4. **Reálny deň a noc a počasie**: obloha podľa času v Bratislave, večer svetlá na zjazdovkách a nočné lyžovanie, občas sneženie.
5. **Úlohy a easter eggy**: nájdi maskota, nájdi zlatého lyžiara, ťukni na ratrak (zatrúbi), vrtuľník zamáva. Malé odmeny (odznak v karte, uložený v localStorage).
6. **Dizajn**:
   - krajšie postavy (zaoblené tvary, okuliare, šál), tiene, hmla a jemný gradient oblohy,
   - krajšie menovky a karty (sklenený vzhľad),
   - minimapa, rýchlejšie načítanie na mobile, ambientný zvuk (vietor, vlek).
7. Väčšie veci pri míľnikoch: kaviareň hore, Everest (predĺženie svahu), nočné lyžovanie, preteky.

Pri každej novinke najprv `beta.html`, otestuj na mobilnom rozmere (resize_window 390×844) aj na desktope, skontroluj FPS a až potom `index.html`.

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
