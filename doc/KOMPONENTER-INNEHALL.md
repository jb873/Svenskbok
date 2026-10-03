# Komponenter — HTML-strukturer för innehållsproducenter (SVENSKA)

> Kanonisk dokumentation av återanvändbara HTML-komponenter och
> avsnittsmallar i Alphaskolans lärplattform — Svenskbokens version.
> Bilaga till `LEVERANSGUIDE-INNEHALL.md`.
>
> Innehållssessioner ser inte CSS — bara HTML. För att producera
> fungerande markup måste de exakta klassnamnen vara dokumenterade.

**Senast uppdaterad:** 2026-10-03 (v1.0 Svenska)
**Version:** 1.0 (Svenska)
**DELAD-BAS:** v1.4 — måste matcha över alla ämnen
**Ärvd från:** KOMPONENTER-INNEHALL-GEOGRAFI v1.6
**Källa för alla mallar:** Geografis v1.6 (DOM-verifierad hero-banner) + Historias mappstruktur

---

## LÄS DETTA FÖRST — vad som är nytt i svenska

Svenska ärver hela den delade basen. Fem saker skiljer, och alla är dokumenterade nedan:

1. **Mappstruktur** — svenska använder historias fyra-nivåers djup, inte geografis platta (DEL 0)
2. **Signaturfärg** — dämpad vintage-vin `#8c3448` (DEL 1)
3. **En textnivå** — svenska har inga nivåer och ingen nivåväljare (DEL 1, DEL 2)
4. **Brödsmulor under heron** — inte i hero-bannern som i övriga ämnen (DEL 1)
5. **Öva-fliken** — en egen ordklassövning (`js/ordklass-ova.js`), inte flipcards (DEL 8)

Allt annat ärvs oförändrat. **Uppfinn inte om det som redan finns.**

### Svenska har en scaffold

Geografis v1.6 innehåller två motstridiga scaffolds: DEL 1:s "kompletta scaffold-mall"
(ljus header, `<div class="sida">`, brödsmulor i sidan) och DEL 4.5 (hero-banner,
`<main class="sida">`, brödsmulor i headern). v1.6-noten erkänner att den första är
inaktuell men lämnar kvar koden.

**Svenska har en scaffold.** Den ljusa header-varianten existerar inte i detta dokument
och ska inte produceras. Finns tvekan — det som står i DEL 1 här är facit.

> **Dokumentets ursprung.** Svenskboken startade som en kopia av Kemiboken, och det här
> dokumentet var länge Kemibokens text med svenskans namn på. Kemispåren rensades
> 2026-10-03; kvar står svenskans egna beslut plus den **delade** basen, som är ordagrant
> densamma i alla ämnen. Kopieringen är i sig det A1 varnar för (DEL 6) — den delade basen
> ska synkas, aldrig kopieras.

---

## Sektions-typ: DELAD vs ÄMNESEGET

Dokumentet innehåller både **delad plattform** (identisk över alla ämnen — gör att eleven
känner igen *plattformen*) och **ämneseget** (får skilja sig per ämne — gör att eleven
känner igen *ämnet*).

- 🔗 **DELAD** — synka över alla ämnen. Ändrar du här: ändra i ALLA ämnens KOMPONENTER
  samtidigt **och höj DELAD-BAS-versionen**.
- 🎨 **ÄMNESEGET** — får skilja sig per ämne. Ändra fritt.

**DELAD-BAS: v1.4** — höj (i alla ämnen samtidigt) närhelst en 🔗-sektion ändras.

### Sektionskarta

| Sektion | Typ |
|---|---|
| DEL 0 — Placering och sökvägar | 🎨 ÄMNESEGET |
| Princip / Dokumentationsprincip | 🔗 DELAD |
| DEL 1 — Scaffold: hero-banner (struktur) | 🔗 DELAD |
| DEL 1 — Scaffold: signaturfärg, brödsmulornas plats, en nivå | 🎨 ÄMNESEGET |
| DEL 1 — Scaffold: flikrad och nedåt | 🔗 DELAD |
| DEL 2 — Brödtext-principer per nivå | 🔗 DELAD (svenska använder en nivå) |
| DEL 3 — Bildstöd: Enkel + Standard | 🔗 DELAD (svenska har inga bilder ännu) |
| DEL 4.1–4.4 — fordj-kort, brodtext-bild, karnpunkter, bildguide | 🔗 DELAD |
| DEL 4.5 — hero-banner | 🔗 struktur / 🎨 färg |
| DEL 5 — Ej dokumenterade (boklokal lista) | 🎨 ÄMNESEGET |
| DEL 6 — Process och verifieringsregler | 🔗 DELAD |
| DEL 7 — Föreläsning | 🔗 DELAD |
| DEL 8 — Öva-fliken: ordklassövningen | 🎨 ÄMNESEGET |
| DEL 9 — Arbetsmodell och leveransflöde | 🎨 ÄMNESEGET |
| DEL 10 — Framtida: klickbara begreppsord | 🔗 plattformsfråga |
| Bilagor / Revisionshistorik | 🎨 boklokal |

**Ändring mot geografi:** DEL 3 var tidigare 🔗 DELAD i sin helhet. Den är nu **splittrad** —
Enkel och Standard förblir delade, fördjupningsnivåns bildregel är ämnesegen. DELAD-BAS är
**oförändrad (v1.4)**: ingen delad komponent har ändrats, bara sektionens räckvidd.

---

## Princip
**🔗 DELAD**

Plattformskomponenter har **exakta klassnamn och struktur** som CSS:n kräver.
Innehållsproducenten:

- Kopierar mallen rakt av
- Byter bara innehållet (text, länkar, ikoner)
- Ändrar INTE klassnamn, element-typer eller nesting-struktur

Vid tveksamhet — fråga. Gissa aldrig.

### Dokumentationsprincip

Komponentstrukturer dokumenteras enligt **vad CSS:n faktiskt stilsätter och JS:n läser**,
inte enligt vad som råkar finnas i HTML-källkod. CSS + JS är det som avgör vad eleven ser.

Verifieringskrav: HTML + CSS + renderad sida måste stämma innan dokumentation skrivs.

---


---

## DEL 0 — Placering och sökvägar
**🎨 ÄMNESEGET**

### Mappstruktur

Svenska använder **historias fyra-nivåers djup**:

```
kapitel/{kapitel}/delkapitel/{delkapitel}/avsnitt-{n}-{slug}.html
```

Så ser det ut i dag:

```
kapitel/grammatik/
├── index.html                                   Kapitel: Grammatik
├── data/ova/                                    Övningsdata (DEL 8)
│   ├── avsnitt-1-substantiv.json
│   └── blandad-ordklasser.json
└── delkapitel/
    ├── ordklasser/
    │   ├── index.html                           Delkapitel: 10 avsnittskort
    │   ├── avsnitt-1-substantiv.html … avsnitt-10-rakneord.html
    │   └── blandad-ovning.html                  Delkapitlets egen övningssida
    └── satsdelar/
        ├── index.html                           Delkapitel: 6 avsnittskort
        └── avsnitt-1-subjekt.html … avsnitt-6-attribut.html
```

**Strukturens namn i svenska:** Grammatik är **kapitel**, Ordklasser och Satsdelar är
**delkapitel**, varje ordklass och varje satsdel är ett **avsnitt**, och avsnittets delar är
**underdelar A–F**. Mappnamnen är bokstavligen `kapitel/` och `delkapitel/` — samma ord som i
historia och geografi, så att eleven känner igen sig mellan ämnen.

### Varför fyra nivåer överallt

Grammatik ryms i dag på ett plan, men djupet är ändå enhetligt. Får djupet variera per kapitel
måste Code avgöra vilket djup som gäller var, och då uppstår tolkningsutrymme. Ett litet
kapitel får hellre ett enda delkapitel än att svenska har två filformer.

Priset är en pro forma-nivå i början. Vinsten är att sökvägen är identisk i varenda fil
från fil ett, och att svällning inte kräver flytt av filer.

### Sökvägsdjup — kritiskt

| Vad | Djup | Exempel |
|---|---|---|
| CSS + JS | **fyra nivåer upp** | `../../../../css/svenska.css` |
| Data-filer | **två nivåer upp** | `../../data/ova/avsnitt-1-substantiv.json` |

> ⚠️ **Den vanligaste förväxlingen.** Geografis DEL 4.5-mall är skriven med `../../`
> eftersom geografi är platt. Klistras den in rakt av i svenskans fyra-nivåers struktur bryts
> alla CSS- och script-länkar. Felet ser ut som *"sidan renderar ostylad"* — inte som ett
> sökvägsfel. Använd alltid svenskans egen scaffold i DEL 1.

Övningsdata ligger på **kapitel-nivån** (`kapitel/{kapitel}/data/ova/`), vilket ger
`../../data/ova/` från avsnittsfilen. Verifierat i drift.

### Brödsmulor

Fyra nivåer: **Svenska › Kapitel › Delkapitel › Avsnitt**. Aktuell crumb visar nummerprefix:
`{{N}}. {{Avsnittstitel}}`. **I svenska ligger brödsmulorna först i `.sida`, inte i
hero-bannern** (DEL 1).

---

## DEL 1 — Avsnitts-scaffold (kanonisk)
**🔀 BLANDAD** — header-regionens färg, brödsmulornas plats och antalet textnivåer är
🎨 ämnesegna; struktur och allt från flikraden och nedåt är 🔗 delat.

> Detta är **facit** för flik- och underdels-strukturen på en avsnittssida.
> Klipp och fyll i.

### Signaturfärg
**🎨 ÄMNESEGET**

**Dämpad vintage-vin `#8c3448`** — rödvinston med bruten mättnad. Läser som språk och
litteratur, och bryter rent mot historias guld och geografins blå.

**Detta är svenskans enda ämnesegna färg.** Allt annat formspråk (typsnitt, komponenter,
layout) är 🔗 DELAT och ärvs oförändrat. **Code väljer aldrig färg.**

Sätts som `--accent` i `css/svenska.css`, tillsammans med de härledda värdena:

| Token | Värde | Not |
|---|---|---|
| `--accent` | `#8c3448` | signaturfärgen |
| `--accent-text` | `#8c3448` | 6,0:1 mot `--paper` — duger som textfärg |
| `--accent-hover` | `#6d2838` | |
| `--accent-tint` | `rgba(140, 52, 72, 0.12)` | hover-ytor |
| `--accent-ram` | `rgba(140, 52, 72, 0.35)` | ramar på väljare |
| `--accent-2` | `#b8902a` | mässing, sekundär — som geografi |

### Hero-banner och brödsmulor
**🎨 ÄMNESEGET** (strukturen är delad, se DEL 4.5)

Beslutad stilbild (Joachim 2026-09-16):

- Hero: **enfärgad varm svart `#17130d`** — ingen gradient.
- Hero-etiketten (`.avsnitt-label`) i `--accent`.
- Hero-rubriken i EB Garamond. Sammansatta titlar sätter efterleden kursiv i vinrött:
  `<h1>Ord<em>klasser</em></h1>`.
- **Brödsmulorna ligger först i `.sida`**, vänsterställda, i vinrött — inte i hero-bannern.

> 🔵 **Känd avvägning:** vinrött mot `#17130d` ger ≈ 2,4:1 (etiketten och `<em>` i rubriken).
> Följer stilbilden medvetet; dokumenterad i `css/svenska.css` och tas upp separat.

### En textnivå — ingen nivåväljare
**🎨 ÄMNESEGET**

Svenska publicerar **lärarens text ordagrant, i en enda nivå**. Det finns ingen
nivåväljare (`.niva-valjare`) på någon svensk sida, och inga `📗 Enkel` / `📕 Fördjupning`.
Varje underdel har exakt ett `.niva-innehall.brodtext` med `data-niva="standard"`.

Klassnamnet `standard` behålls därför att `avsnitt.js` och `geografi.css` läser det — det är
plattformens namn på "den synliga texten", inte ett påstående om att svenska har nivåer.
`avsnitt.js` hoppar över nivålogiken helt när `.niva-valjare` saknas.

### Aktiv-markering — källan till alla tidigare buggar

- **KNAPPAR** markeras aktiva med klassen `aktiv`
- **INNEHÅLL** (paneler, underdel-text) markeras aktivt genom **frånvaro** av `dold`
- `js/avsnitt.js` togglar `dold` på innehåll och `aktiv` på knappar

### Fyra fällor — gör ALDRIG så här

1. **Underdels-sektioner har klass `underdel-text`** — aldrig bara `underdel`. Bar
   `.underdel` blir scope-rot i `avsnitt.js` och bryter flik-logiken.

2. **`data-niva="standard"`** på textblocket — aldrig `"1"` eller ett eget namn.
   `avsnitt.js` startar på `'standard'`; fel värde → ingen text syns om en nivåväljare
   någon gång läggs till.

3. **Ett avsnitt med en enda del har ingen `.underdel-valjare`** — bara en
   `.underdel-text` utan `dold`. `avsnitt.js` returnerar tidigt när inga
   `.underdel-knapp` finns.

4. **Använd aldrig `.underdel-knapp`, `.flik` eller `.niva-valjare` för något annat
   än sitt syfte.** `avsnitt.js` fångar alla tre på hela sidan. Nya kontroller får egna
   klassnamn med eget prefix (se DEL 8).

### Ankarpunkter

Underdels-sektioner behöver **ingen `id`**. `avsnitt.js` läser `location.hash`
(`#a`/`#b`/`#c`) och aktiverar via `data-underdel`.

### Komplett scaffold-mall

```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{Avsnittstitel}} – {{Delkapitel}} – Svenska</title>
  <link rel="stylesheet" href="../../../../css/geografi.css">
  <link rel="stylesheet" href="../../../../css/svenska.css">
  <link rel="stylesheet" href="../../../../css/fonts.css">
</head>
<body>

  <!-- ===== HERO-BANNER (enfärgad #17130d, etikett i vinrött) ===== -->
  <header class="hero-banner">
    <div class="hero-inner">
      <span class="avsnitt-label">Avsnitt {{n}}</span>
      <h1>{{Avsnittstitel}}</h1>
    </div>
  </header>

  <main class="sida">

    <!-- ===== BRÖDSMULOR — i sidan, inte i heron ===== -->
    <nav class="brodsmulor" aria-label="Brödsmulor">
      <a href="../../../../index.html">Svenska</a>
      <span class="skiljare" aria-hidden="true">›</span>
      <a href="../../index.html">{{Kapitel}}</a>
      <span class="skiljare" aria-hidden="true">›</span>
      <a href="index.html">{{Delkapitel}}</a>
      <span class="skiljare" aria-hidden="true">›</span>
      <span class="aktuell" aria-current="page">{{N}}. {{Avsnittstitel}}</span>
    </nav>

    <!-- ===== FLIKRAD ===== -->
    <div class="flikar-rad" role="tablist">
      <button type="button" class="flik aktiv" data-flik="las" role="tab">Läs</button>
      <button type="button" class="flik" data-flik="ova" role="tab">Öva</button>
      <button type="button" class="flik" data-flik="elevboken" role="tab">Elevboken</button>
    </div>

    <!-- ===== LÄS (aktiv panel = utan dold) ===== -->
    <section class="flik-innehall" data-flik="las" role="tabpanel">

      <!-- Underdelsväljare — utelämnas helt om avsnittet har en enda del -->
      <div class="underdel-valjare" role="tablist" aria-label="Textval">
        <button type="button" class="underdel-knapp aktiv" data-underdel="a" role="tab">
          <span class="underdel-bokstav">A</span>
          <span class="underdel-titel">{{Underdel A-titel}}</span>
        </button>
        <button type="button" class="underdel-knapp" data-underdel="b" role="tab">
          <span class="underdel-bokstav">B</span>
          <span class="underdel-titel">{{Underdel B-titel}}</span>
        </button>
      </div>

      <!-- UNDERDEL A (aktiv = utan dold) -->
      <div class="underdel-text" data-underdel="a">
        <!-- En textnivå: lärarens text, ordagrant. Ingen nivåväljare. -->
        <div class="niva-innehall brodtext" data-niva="standard">
          <h2>{{Rubrik}}</h2>
          <p>{{Lärarens text}}</p>
          <!-- Exempelrader sätts som kursiva stycken: <p><em>…</em></p> -->
          <!-- Mellanrubrik i en underdel: <h3>Exempel</h3> -->
        </div>
      </div>

      <!-- UNDERDEL B (dold tills vald) -->
      <div class="underdel-text dold" data-underdel="b">
        <div class="niva-innehall brodtext" data-niva="standard">
          <h2>{{Rubrik}}</h2>
          <p>{{…}}</p>
        </div>
      </div>

    </section>

    <!-- ===== ÖVA — monteringen byggs av ordklass-ova.js (DEL 8).
         Finns ingen övning: <p class="brodtext">Övningarna läggs in här.</p>
         och skripttaggen för ordklass-ova.js utelämnas. ===== -->
    <section class="flik-innehall dold" data-flik="ova" role="tabpanel">
      <div class="ordova" data-fil="../../data/ova/avsnitt-{{N}}-{{slug}}.json"></div>
    </section>

    <!-- ===== ELEVBOKEN — platshållare tills elevboken byggs ===== -->
    <section class="flik-innehall dold" data-flik="elevboken" role="tabpanel">
      <p class="brodtext">Elevbokens frågor läggs in här.</p>
    </section>

  </main>

  <!-- AVSNITT_ID-block FÖRE de externa skripten -->
  <script>
    const AVSNITT_ID = 'a{{N}}_{{slug}}';
    const KAPITEL_ID = '{{kapitel}}';
    const DELKAPITEL_ID = '{{delkapitel}}';
  </script>

  <script src="../../../../js/avsnitt.js"></script>
  <script src="../../../../js/ordklass-ova.js" defer></script>
  <script src="../../../../js/elevfeedback.js" defer></script>
</body>
</html>
```

**Ingen `tidslinje.js`** och ingen sticky tidslinje-header — det är enbart Historia.
**Ingen Föreläsning-flik** — svenska har inga föreläsningar ännu (DEL 7).

### Delkapitel- och kapitelsidor

Sidordningen är låst (Joachim 2026-09-16): **brödsmulor → korten → eventuellt övningsblock →
kapitel- eller delkapiteltexten sist.** Eleven ska nå avsnitten utan att scrolla. Luften under
korten sätts i `css/svenska.css`, eftersom `kapitelstart.css` förutsätter text ovanför listan.

Korten är `.kapitel-kort` i `.innehallsforteckning`; ett planerat avsnitt är ett
`<span class="kapitel-kort kap-N dimmad">`, ett publicerat ett
`<a class="kapitel-kort kap-N" href="…">`. Titeln är `<span class="kap-titel">` och
beskrivningen `<p class="kap-beskrivning">` — aldrig `<span>` på beskrivningen, då flyter de
ihop till en mening.

Ett delkapitel med en egen övningssida får ett verktygsblock efter korten, med plattformens
oförändrade klasser:

```html
<section class="sektion-avgransare">
  <div class="litet-ornament" aria-hidden="true">✦</div>
  <span class="sektion-label">Delkapitlets övningar</span>
  <div class="resurser-rad">
    <a class="resurs-kort" href="blandad-ovning.html">
      <span class="ikon" aria-hidden="true"><svg …>…</svg></span>
      <span class="resurs-text">
        <h4>{{Titel}}</h4>
        <p class="resurs-beskrivning">{{En mening.}}</p>
      </span>
    </a>
  </div>
</section>
```

---

## DEL 2 — Brödtext-principer per nivå
**🔗 DELAD**

### 📗 Enkel

**Brödtext = LÖPANDE PROSA.** Hela meningar i stycken.

**Använd INTE punktlistor för själva brödtexten.** Mycket punktform blir en tröskel eleven
måste ta sig över — inte en hjälp.

**Punktlistor hör bara hemma i:**
- `.karnpunkter` (kärnpunkter-blocket)
- `.bildguide` (advance organizer)

**Volym:** ~250–400 ord prosa per underdel
**Ton:** Vardagsspråk, tydlig kausalitet

### 📘 Standard (default)

Standardförklaring med flerdimensionalitet. Också prosa, men med större vokabulär och fler
analytiska kopplingar än Enkel.

**Volym:** ~500–700 ord per underdel
**Ton:** Pedagogisk men inte förenklad

### 📕 Fördjupning

**Volym:** ~800–1100 ord per underdel
**Ton:** Akademisk men begriplig för åk 9

> Volymerna följer DELAD-basen oförändrat.

---


### 🎨 Svenska: en nivå

Volymerna och tonen ovan är den delade basen och står oförändrade. **Svenska använder i dag
bara en nivå** — lärarens text ordagrant, utan nivåväljare (DEL 1). Spannen är därför
riktmärken för den enda texten, inte tre texter att skriva. Skulle svenska någon gång införa
nivåer gäller basen som den står.

---

## DEL 3 — Bildstöd-mönstret per nivå
**🔗 DELAD** (3.1–3.3) / **🎨 ÄMNESEGET** (3.4)

Svenska har inga bilder i dag; mönstret nedan gäller den dag en bild kommer in (se 3.4).

### 3.1 📗 Enkel
**🔗 DELAD**

- **Bild:** SAMMA bild som Standard (identisk `src` + identisk `alt`-text)
- **Föregås av:** `<div class="bildguide">` med "👁 Titta efter" och 2–5 observationspunkter
- **Bildtext:** Kort och orienterande
- **Layout:** `<figure class="brodtext-bild enkel">`

### 3.2 📘 Standard
**🔗 DELAD**

- **Bild:** SAMMA bild som Enkel (identisk `src` + identisk `alt`-text)
- **Föregås av:** ingen bildguide (eleven förväntas tolka själv)
- **Bildtext:** Längre och analytisk
- **Layout:** `<figure class="brodtext-bild standard">`

### 3.3 Princip — varför samma bild
**🔗 DELAD**

Eleven känner igen bilden från Enkel när hen byter till Standard. Det skapar **kontinuitet**
mellan nivåerna. `alt`-texten måste vara identisk för att skärmläsare ska behandla dem som
samma resurs.


### 3.4 🎨 Svenska: inga bilder ännu

Svenskboken har i dag **inga bilder** i brödtexten — grammatiken illustreras med tabeller
(`.vintage-tabell` i `.vintage-tabell-wrapper`) och med kursiva exempelrader. Mönstret i
3.1–3.3 gäller den dag en bild kommer in; fördjupningsnivåns bildregel är ämnesegen och
oskriven för svenska, eftersom svenska inte har fördjupningsnivå.

**Tabeller i brödtext:** `.vintage-tabell-wrapper` saknas i geografi.css:s läsbreddsregel (B2)
och kompenseras i `css/svenska.css`, så att tabellen ligger i läsbredd (770 px) och inte i
full sidbredd. 🔵-loggad som plattformskandidat.

---

## DEL 4 — HTML-komponenter

### 4.1 fordj-kort (djupdykningskort)
**🔗 DELAD**

Klickbara kort längst ner på en avsnittssida (i Läs-fliken). Synliga oavsett vald underdel
eller textnivå. Frivillig fördjupning.

```html
<section class="djupdykningar">
  <span class="sektion-label">Vill du veta mer?</span>
  <div class="fordj-kort-grid">

    <a class="fordj-kort" href="djupdykning-{slug}.html">
      <span class="fordj-kort-ikon" aria-hidden="true">🧪</span>
      <span class="fordj-kort-text">
        <span class="fordj-kort-titel">{Titel på djupdykningen}</span>
        <span class="fordj-kort-sammanfattning">{1-3 meningar som lockar.}</span>
      </span>
    </a>

  </div>
</section>
```

**Regler:**
- Rubriken är **`<span class="sektion-label">`** — inte `<h2>`
- Griden heter **`fordj-kort-grid`** — inte `kort-grid`
- Allt textinnehåll inuti `<a>` är **inline `<span>`** — inga `<h3>`, `<p>` eller block
- `aria-hidden="true"` på ikon-spannet
- Sektionen har **ingen `id`**

**Antal per avsnitt i svenska:** inga. Svenska har inga djupdykningssidor i dag — komponenten
står här därför att den är delad och kan användas när en frivillig fördjupningssida skrivs.

---


### 4.2 brodtext-bild
**🔗 DELAD**

```html
<figure class="brodtext-bild {nivå}">
  <img src="img/{tema}/{bild}.webp" alt="{Lång beskrivning}">
  <figcaption>{Förklarande bildtext}</figcaption>
</figure>
```

`{nivå}` = `enkel` | `standard` | `fordjupning`

**Placering:** bilden sitter **inline vid det stycke den hör till** — aldrig staplad före
brödtexten. Med bildguide (endast Enkel): löpande text → bildguide → bild → texten
fortsätter.

**Balans:** bilden ska vara ett **stöd**, aldrig en **tröskel**. För lite text runt bilden
gör den kontextlös, för mycket dränker den.

---

### 4.3 karnpunkter (Det viktigaste-block)
**🔗 DELAD**

```html
<div class="karnpunkter">
  <div class="karnpunkter-rubrik">🎯 Kärnpunkter</div>
  <ul>
    <li>{Punkt 1 — kort, viktiga ord <strong>fetstilta</strong>}</li>
    <li>{Punkt 2}</li>
    <li>{Punkt 3}</li>
  </ul>
</div>
```

**Regler:**
- Rubriken är `<div class="karnpunkter-rubrik">` (som Historia). `<h3>` fungerar tekniskt men
  träffas av `.brodtext h3` i geografi.css och blir en stor mellanrubrik i stället för en etikett
  (v1.1, verifierat i Chromium)
- 3–5 punkter, max 6
- Fetstil för viktiga begrepp

**Riktmärke:** 1–3 block per textnivå per avsnitt.

---

### 4.4 bildguide (advance organizer)
**🔗 DELAD**

```html
<div class="bildguide">
  <div class="bildguide-rubrik">👁 Titta efter</div>
  <ul>
    <li>{Vad eleven specifikt ska titta efter i bilden}</li>
    <li>{... max 5 punkter}</li>
  </ul>
</div>
```

**Regler:**
- 2–5 specifika observationspunkter
- Placeras **FÖRE** `<figure class="brodtext-bild">`
- **Endast på Enkel-nivå**

---

### 4.5 hero-banner
**🔗 struktur / 🎨 färg**

Se fullständig markup i DEL 1. Struktur delad med alla ämnen; färgen (`#8c3448`) ämnesegen;
sökvägsdjupet fyra nivåer (DEL 0).

---


---

## DEL 5 — Komponenter som inte är dokumenterade ännu
**🎨 ÄMNESEGET**

- `kapitel-kort` (kapitel- och avsnittsöversikt) — används i svenska, se DEL 1, men har
  ingen egen plattformsdokumentation
- `resurs-kort` och `.sektion-avgransare` (verktygs- och övningsrad) — används i svenska,
  se DEL 1, ingen egen plattformsdokumentation
- Kapitelverktygs-sidor (`kapitelelevbok.html`, `kapitelbegreppsbank.html`,
  `sjalvskattning.html` — inte `kapitelsjalvskattning.html` som LEVERANSGUIDE DEL 2 säger;
  Historia använder `sjalvskattning.html` och svenska följer verkligheten) — **finns inte i
  svenska ännu**
- **Klickbara begreppsord i löptext** — se DEL 10, plattformsfråga, inget svenskbygge

**Finns i repot men används inte av någon svensk sida ännu:** `css/flipcards.css` (laddas av
ingen sida; `css/svenska.css` har färgöverskrivningar förberedda för den dagen en
flipcards-vy byggs).

Vid första felmönster: logga som Typ C-ändring i `PLATTFORMS-ANDRINGAR.md`.

---

## DEL 6 — Process när nya komponenter behöver dokumenteras
**🔗 DELAD**

### Verifieringskrav

Innan en komponent dokumenteras **måste minst fyra källor stämma**:

1. **HTML** från referensimplementationen
2. **CSS-regler i `css/svenska.css`** (vad som faktiskt stilsätts)
3. **JS-tillstånd** (vad `avsnitt.js` och andra moduler förväntar sig)
4. **Renderad visuell verifiering i headless Chromium**

Om HTML och CSS är internt motstridiga: **CSS vinner.**

> **Verifiera i headless Chromium — inte node-harness.** Node-harness gav flera falska gröna
> bockar i matematikbygget. Per-item browser-verifierade rapporter.

### Steg

1. Innehållssession eller Code stöter på en odokumenterad komponent
2. **Frågar Joachim istället för att gissa**
3. Joachim ger HTML-fragment från referensimplementation
4. Ramverks-chatten verifierar mot CSS + JS + rendering
5. Komponenten läggs till i denna fil
6. Loggas i `PLATTFORMS-ANDRINGAR.md` som Typ C-ändring

### Verifieringsregler — och vad som vaktar dem

**🔗 DELAD** · DELAD-BAS v1.4 · kanoniserad 2026-10-01, bevisad i matematikbygget (Spår 3) · utökad med V11–V14

**META-PRINCIP: en regel som bara står nedskriven glöms.** Det har hänt sju gånger i
mattearbetet. Varje *bevisad* regel ska vaktas av en **grind eller ett kontrakt**, inte bara
dokumenteras. Dokumentet stoppar *ovetande*; bara enforcement stoppar *regression*. Vid varje
ny regel: fråga **"vad vaktar den?"** — står svaret tomt är regeln ännu inte skyddad.

Kolumnen **Vad vaktar den** är ärlig. Står det ett verktyg finns ett prov som fäller när regeln
bryts. Står cellen tom finns ingen mätning, och regeln bärs bara av att någon minns den.
**En tom cell är en TODO, inte ett klartecken.** Den ska skava.

#### Verifiering — varje ämne med interaktivitet eller JS

| # | Regel | Vad vaktar den (svenska) |
|---|---|---|
| V1 | **Verifiera i headless Chromium**, inte enbart node-harness — harness ger falska gröna bockar. Skalet puppeterar motorns **publika kontroller**, aldrig internt state (testa som en elev). |  |
| V2 | **En grind ska negativt verifieras** — återinför felet och se att den fäller. En grind som aldrig fällt är inte bevisad. |  |
| V3 | **Mät effekten, inte attributet.** Ett kontrakt som mäter *formen* blir ett hinder för allt som gör rätt på annat sätt. |  |
| V4 | **Mät det eleven ser**, inte det första som råkar matcha i DOM-ordningen. |  |
| V5 | **Synlighet hör till beviset.** Ett grönt logikprov kan dölja en tom rendering. |  |
| V6 | **Ett bevis på en vy säger inget om de andra.** Mät per flik, per blad, per årskurs/sida. |  |
| V7 | **Mät innan du tror på utfallet.** Grinden har flera gånger fällt något som var rätt. |  |
| V8 | **Kör grindarna en i taget.** Parallella körningar ger falska träffar. |  |
| V9 | **Nya sidor måste in i grindarnas listor** — annars växer material utanför mätningen. |  |
| V10 | **Generatorer: äkta oberoende slump**, verifierad med runs-test/autokorrelation — inte bara "inga dubbletter" (gäller varje ämne med slumpade uppgifter: matte, flipcards, tidslinjeövningar). |  |
| V11 | **En grind får inte ha en väg ut som hoppar mätningen.** En early-return, en vakt eller ett undantag som avslutar grinden *utan att mäta* ger grönt utan bevis. Belagt: `if(vs.length < 2) return` i slumpfuzzen lät alla tre injicerade felen passera — grinden mätte inte, och grönt såg ut som ett godkännande. | **—** *byggs* |
| V12 | **Kör den negativa verifieringen i exakt det läge grinden ska köras i.** Annars godkänner provet ett läge som aldrig prövas. Belagt: samma fel som V11 — den negativa verifieringen kördes med en omgång och grinden med tre, och blev falskt grön i båda ändar. | *disciplin* — kan inte vaktas mekaniskt. Står i grindens huvud och bärs av praxis |
| V13 | **Mät aldrig något som beror på vem eller var provet körs.** En miljö- eller maskinberoende kontroll är grön där någon tittar och säger ingenting om elevens vy. Mät den renderade elevvyn, inte körmiljön. Belagt: `document.fonts.check` svarar ja om typsnittet är installerat på maskinen — grönt hos byggaren, rött hos eleven. Skärpning av V3 och V4. | **—** *byggs* |
| V14 | **En sida i grindens lista måste ge minst en mätpunkt.** Ger den noll — noll blad, noll rader, noll ytor — är grinden röd, utom där ett dokumenterat skäl säger annat, och skälet prövas av grinden. V9 garanterar att en sida ligger i listan; V14 garanterar att en sida i listan faktiskt mäts. Belagt: `ak7/k3/d4-ekvationer` kom in i nämnar-grindens lista, gav noll blad, fick inte ens en utskriven rad — och grinden slutade "GRÖN · 107 blad mätta". Ett undantag duger bara som rad i en lista med ett skäl grinden kan verifiera, aldrig som tyst noll. | **—** *byggs* |

#### Arkitektur — alla ämnen

| # | Regel | Vad vaktar den (svenska) |
|---|---|---|
| A1 | **Delade moduler, inte kopior.** En kopia driver isär även när den är märkt som kopia. DELAD-basen ärvs/synkas; kopieras aldrig. |  |

**Ingen av de femton raderna har ett verktyg i det här repot.** Reglerna gäller ändå; de bärs i dag bara av att någon minns dem. Tomheten är en TODO, inte ett klartecken — utom V12, som inte kan vaktas mekaniskt och är disciplin.

> **Vad den här sektionen ersätter.** Av de elva reglerna stod **en** nedskriven förut: V1,
> som prosa i DEL 6 i Kemiboken och Svenskboken. Det blockcitatet står kvar ordagrant där
> det står — den här sektionen utökar det, ersätter det inte. Geografiboken och Historiaboken
> hade inte ens den. **V10 fanns inte nedskriven någonstans.** De övriga nio
> bars av praxis i mattearbetet utan att vara kanon i något ämne.

> **Tillägget 2026-10-01: V11–V13.** Tre regler till, och alla tre är belagda i samma
> arbetspass som skrev dem — de kommer ur fel som faktiskt gjordes, inte ur en genomgång av
> vad som *kunde* gå fel. Två av dem (V11, V12) föddes ur ett och samma fel: en grind som var
> grön för tre injicerade fel därför att den hoppade över mätningen, och en negativ
> verifiering som kördes i ett annat läge än grinden. **Regel före vakt** — de canoniseras nu
> med ärlig vaktkolumn, och vakterna byggs i en senare omgång. V12 får ingen: den kan inte
> vaktas mekaniskt.

> **V14 (2026-10-01).** Komplementet till V9, och belagt av samma tråd som V11 och V12: grön
> medan noll mäts. V9 stängde hålet att en sida kan stå utanför listan; V14 stänger hålet att
> en sida kan stå i listan och ändå inte mätas. Vakten tvingar fram ett val som förut gjordes
> av tystnaden: en **avsiktlig** nolla (grinden mäter en sorts rad sidan inte har) skrivs som
> skäl med bevis, en **oavsiktlig** nolla är ett fynd att utreda. Förut var båda tyst gröna.

---


---

## DEL 7 — Föreläsnings-komponenten
**🔗 DELAD**

Ärvs oförändrat från geografi v1.6. Sammanfattat:

- Föreläsning är **alltid första fliken**
- `<div class="forelasningar-lista">` är **tom** — JS fyller på från JSON
- **Ingen statisk HTML** för föreläsningskort
- Flikknappen sätts **disabled** av JS när ingen föreläsning matchar avsnittet

### JSON-schema (`data/forelasningar.json`)

En central fil per kapitel: `kapitel/{kapitel}/data/forelasningar.json`

```json
{
  "delkapitel": "{kapitel-id}",
  "forelasningar": [
    {
      "id": "f_{kortord}",
      "avsnitt_id": "a{N}_{slug}",
      "titel": "{Titel som visas i kortet}",
      "youtube_id": "{id-delen ur youtu.be/<id>}",
      "langd": "14:02"
    }
  ]
}
```

| Fält | Krävs | Beskrivning |
|---|---|---|
| `delkapitel` (rot) | ✅ | Kapitel-id, samma som mappnamn |
| `forelasningar[]` | ✅ | Lista över alla föreläsningar |
| `id` | ✅ | Stabilt id — `f_{kortord}` |
| `avsnitt_id` | ✅ | Matchar `AVSNITT_ID` i avsnitts-HTML |
| `titel` | ✅ | Titel som visas på kortet |
| `youtube_id` | ✅ | **Bara id-delen**, inte hela URL:en |
| `langd` | ❌ | Frivillig text |

**Ignoreras av plattformen:** `beskrivning`, `thumbnail`, `varaktighet`, `kategori`, `taggar`.

---


---

## DEL 8 — Öva-fliken: ordklassövningen
**🎨 ÄMNESEGET**

Svenskans Öva-flik är en egen, datadriven övning i två steg — **inte** flipcards. Motorn är
`js/ordklass-ova.js`; allt innehåll (meningar, facit, rubriker, instruktioner och varje
elevtext) kommer ur en JSON-fil. Samma motor kör vilken ordklass som helst med en ny fil,
utan kodändring.

### Montering

```html
<div class="ordova" data-fil="../../data/ova/avsnitt-{{N}}-{{slug}}.json"></div>
…
<script src="../../../../js/ordklass-ova.js" defer></script>
```

Saknas monteringen ska skripttaggen också utelämnas. Sidor utan övning visar
`<p class="brodtext">Övningarna läggs in här.</p>`.

### Steg 1 Hitta, steg 2 Böj

- Varje ord i texten är en `<button class="ordova-ord">` — tangentbord och fokus fungerar
  utan extra attribut.
- Rätt ord blir gröna och läggs till i tabellen; fel ord får en kort röd markering
  (ca 1 s) som varken räknas eller sparas; **neutrala** ord blir grå och räknas inte.
- Räknaren visar *Hittade X av Y*, med *(+N extra)* när eleven hittat valfria ord.
- Steg 2 är en `.vintage-tabell` med ett lemma per rad och ett `<input class="ordova-falt">`
  per form. **Rätta tabellen** jämför efter trim, gemener och hopslagna mellanslag; ett
  facitvärde som är en lista godkänner alla varianter.
- Rätt fält grönt, fel rött, med tips ur `tips_tabell` (`tom`, `grundform_fel_kolumn`,
  `dom`, `positiv_grundform`).

### Egna klasser — rör inte plattformens

`avsnitt.js` fångar `.flik`, `.flik-innehall`, `.underdel-knapp`, `.underdel-text`,
`.niva-valjare` och `.niva-knapp` på hela sidan. Övningen använder därför **eget prefix**:

`.ordova` · `.ordova-ovar` · `.ordova-valjare` / `.ordova-version` · `.ordova-delar` /
`.ordova-del` · `.ordova-steg` · `.ordova-rubrik` · `.ordova-instruktion` ·
`.ordova-meningar` / `.ordova-lopande` · `.ordova-ord` (`.hittad`, `.fel`, `.neutral`) ·
`.ordova-status` / `.ordova-meddelande` / `.ordova-raknare` · `.ordova-tabell` ·
`.ordova-hittat` · `.ordova-exempel` · `.ordova-falt` (`.ratt`, `.fel`) · `.ordova-tips` ·
`.ordova-knappar` / `.ordova-ratta` / `.ordova-borja-om` · `.ordova-resultat`

Uttrycken är lånade från plattformen (versionsväljaren från `.niva-valjare`, delflikarna från
`.flikar-rad`, fälten från `.egen-fraga-input`, knapparna från `.lagg-till-fraga-knapp` och
`.egen-fraga-ta-bort-knapp`). Rätt/fel-färgerna är plattformens självskattningsfärger
`#4a6d2a` och `#b04a2a` med flipcards ljusa fyllningar `#e4ecdd` och `#f3e0d9`. Allt ligger i
`css/svenska.css` sektion 8.

### Två JSON-former

Formen avgörs av om fältet `delar` finns.

**Form A — ett avsnitt.** `avsnitt`, `ordklass`, `rubrik_steg1`, `rubrik_steg2`,
`instruktion_steg1`, `instruktion_steg2`, `kolumn_hittat`, `kolumner[]`, `exempel`,
`meddelanden{}`, `fel_sarskilda{}`, `tips_tabell{}`, `versioner[]`. Varje version har
`sentences[]`, `names[]`, `genitiv{}`, `tokens{}`, `lemmas{}`.

**Form B — flera delar i en övning** (delkapitlets blandade övning). Toppnivå: `sida`,
`titel`, `ovar[]`, `antal_versioner`, `delar[]`. Varje del har form A:s fält plus `flik`,
`visning` (`"meningar"` eller `"lopande"`), `exempel_lemma`, `ratt_sarskilda{}`, och varje
version dessutom `valfria{}` och `neutrala{}`.

Ordet klassas i tur och ordning: `ratt_sarskilda` → `exempel_lemma` → namn i genitiv →
genitiv → namn → valfritt → token. Typen avgör om ordet räknas och ger tabellrad; namn ger
aldrig rad, valfria räknas inte men ger rad.

> **Alla fält är obligatoriska, även när värdet är tomt eller `null`.** Saknas ett fält, eller
> har en version data som kräver ett meddelande som står `null`, visar sidan ett laddningsfel
> med delens och versionens namn. **Motorn gissar aldrig.**

### Sparande

`localStorage`, varje läsning och skrivning i try/catch — sidan fungerar utan lagring.

| Form | Nyckel |
|---|---|
| A | `svenska-ova-{avsnitt}-v{N}` + `svenska-ova-{avsnitt}-vald` |
| B | `svenska-ova-{sida}-v{N}-{ordklass}` + `-vald` + `-del` |

**Form A:s nycklar får aldrig ändras** — där ligger elevernas sparade arbete.

### Inte med

Facitknapp, tidtagning, poäng, slumpning och AI är medvetet bortvalda.

---

## DEL 9 — Arbetsmodell och leveransflöde
**🎨 ÄMNESEGET**

### Vem gör vad

| Steg | Vem |
|---|---|
| Brödtexten | **Läraren** skriver |
| Strukturskiss (underdelar A–F) | **Läraren**, i leveransen |
| Övningsmeningar och facit | **Läraren**, levereras som JSON |
| Sidbygge | **Code** |

### Lärarens text är facit

**Texten publiceras ordagrant — inklusive stavfel och sakfel.** Code rättar aldrig i
lärarens text. Misstänkt fel **rapporteras, rättas inte**: läraren avgör. Flera kända
avvikelser står kvar medvetet i boken av det skälet.

Tillåtna redaktionella grepp, och bara när leveransen säger det: lägga till en rubrik som
saknas, dela en rubrikrad i `<h3>` plus stycke, och rätta ett saknat mellanslag.

### Produktionsordning per avsnitt

1. Läraren levererar Läs-texten som ett färdigt HTML-fragment för Läs-panelen
2. Code bygger sidan som en kopia av närmast liknande avsnitt och byter bara det som
   arbetsordern listar
3. Övningen kommer när den kommer — ett avsnitt kan stå publicerat med bara Läs-fliken
4. Verifiering i headless Chromium, rapport per sida (DEL 6)

### Mall-och-propagera

Bygg **ett** avsnitt komplett, verifiera mot lärarens öga, och propagera först därefter.
Substantiv byggdes först, Verb och Adjektiv skrevs av från det, och ordklasserna 4–10 samt
satsdelarna 1–6 av dem i sin tur. Varje steg har diffats mot sin mall, så att bara de
avsedda raderna skiljer.

---

## DEL 10 — Framtida: klickbara begreppsord
**Ej svenskbygge — plattformsfråga**

Elever har svårt att **packa upp text**. Ett ord eleven tappat stoppar hela meningen.
Klickbara begreppsord i löptexten — klicka, få förklaringen, stanna kvar i meningen — löser
det på ett sätt en faktaruta inte gör: rutan hjälper bara där en ruta råkar ligga, klickbara
ord hjälper i varje mening.

**Varför det inte byggs nu:**

1. **Plattformen har det halvvägs redan.** Begreppsbanken och flipcardsens `begreppskort`
   innehåller exakt sådana förklaringar, med `kallfil` som enda sanningskälla. Ett klickbart
   ord ska hämta därifrån — inte ha egna definitioner. Byggs det med egen text får
   plattformen två uppsättningar förklaringar som glider isär.

2. **Det rör alla ämnen**, inte bara svenska. Hör hemma i lärplattformens spår.

**Sparsamhet är ett designkrav, inte en tumregel.** Varje markerat ord känns motiverat när
man skriver det; utan spärr blir texten tät, och eleven slutar läsa meningar och börjar
klicka sig igenom. Två regler gör sparsamheten självbevakande när komponenten byggs:

- **Ett ord markeras en gång per avsnitt** — inte vid varje förekomst
- **Tak per underdel: 3–4 ord.** Blir det fler är det inte ett ordproblem, det är att texten
  behöver skrivas om.

---

## Bilagor — referensimplementationer
**🎨 boklokal**

- **Ärvd bas:** `KOMPONENTER-INNEHALL-GEOGRAFI.md` v1.6 (2026-07-03)
- **Scaffold-struktur:** Geografis DEL 4.5 (DOM-verifierad hero-banner) + Historias sökvägsdjup
- **Mappstruktur:** `kapitel/{kapitel}/delkapitel/{delkapitel}/`
- **Referensavsnitt:** `kapitel/grammatik/delkapitel/ordklasser/avsnitt-1-substantiv.html`
  (Läs med underdelar A–E + Öva, form A)
- **Referens utan övning:** `…/ordklasser/avsnitt-6-prepositioner.html` (en underdel, Öva som
  platshållare)
- **Referens för flerdelad övning:** `…/ordklasser/blandad-ovning.html` + `blandad-ordklasser.json`
  (form B)

**CSS-referens:** `css/geografi.css` (delad plattform) + `css/svenska.css` (bokens accenter).
Denna kombination avgör vad som faktiskt renderas.
**JS-referens:** `js/avsnitt.js` (delad) + `js/ordklass-ova.js` (ämneseget).

När osäker — kolla referensimplementationen **plus** CSS:n **plus** JS:n. **Gissa aldrig.**

---

## Öppna punkter — kräver beslut eller verifiering

| # | Punkt | Vem |
|---|---|---|
| 1 | Vakter till V1–V14 — ingen regel vaktas av ett verktyg i det här repot (DEL 6) | Code |
| 2 | Kontrasten vinrött mot `#17130d` ≈ 2,4:1 i hero-etikett och `<em>` (DEL 1) | Joachim |
| 3 | `.vintage-tabell-wrapper` saknas i geografi.css läsbreddsregel B2 — kompenseras i svenska.css | Ramverks-chatt |
| 4 | `kapitelstart.css` förutsätter text ovanför kortlistan — luften för text-under-kort sätts i svenska.css | Ramverks-chatt |
| 5 | Elevboken och kapitelverktygen är platshållare — ingen data, ingen sida | Joachim |
| 6 | Övningar för ordklasserna 4–10 och för satsdelarna | Joachim |

---

## Revisionshistorik
**🎨 boklokal**

- **v1.0 Svenska (2026-10-03):** Dokumentet rensat från Kemiboken. Svenskboken skapades som
  en kopia av Kemiboken, och det här dokumentet var fram till nu Kemibokens text med
  svenskans namn i två tabellceller. Borttaget: kemins fördjupningsnivå, de tre bildsorterna
  och fördjupningsbilden, faktarutan, formler och notation (MathJax, mhchem, `\ce{}`,
  strukturformler), CPK-färgkonventionen och bildkonventionerna, kemins Öva-lager med
  flipcards och kortsvar, kemins arbetsmodell, kemins bilagor och revisionshistorik.
  Ersatt med svenskans egna: signaturfärg `#8c3448`, hero och brödsmulor enligt beslutad
  stilbild, en textnivå, strukturen Grammatik → Ordklasser/Satsdelar → avsnitt → underdelar,
  och ordklassövningen (DEL 8). **Den delade basen är oförändrad:** Princip, DEL 1:s
  struktur från flikraden och nedåt, DEL 2, DEL 3.1–3.3, DEL 4.1–4.5, DEL 6 med
  verifieringsreglerna V1–V14 och arkitekturregeln A1, och DEL 7 står ordagrant kvar.
  DELAD-BAS oförändrad (v1.4).

