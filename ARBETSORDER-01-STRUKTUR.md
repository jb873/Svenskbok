# Arbetsorder 01: Svenskbok, grundstruktur

**Till:** Claude Code (Spår 3)
**Från:** Joachim, via designchatten
**Datum:** 2026-09-16
**Omfång:** Repo + struktur + ett avsnitt (Substantiv, Läs-fliken). Inget annat.

---

## 0. Läs först

1. `doc/KOMPONENTER-INNEHALL.md`
2. `doc/LEVERANSGUIDE-INNEHALL.md`
3. `doc/PLATTFORMS-ANDRINGAR.md`

Ingen HTML ändras innan dessa är lästa.

## 1. Underlag

`Svenskbok.zip` (bifogad) innehåller en färdig, browser-verifierad struktur. Den är **facit**. Code bygger inte om, skriver inte om och "förbättrar" inte. Code flyttar in, kontrollerar och publicerar.

```
Svenskbok/
├── index.html                                  Bokens startsida (Svenska)
├── .nojekyll
├── css/  geografi.css fonts.css kapitelstart.css flipcards.css   (DELAD, från Kemibok)
│         svenska.css                                             (ÄMNESEGET)
├── fonts/                                      (DELAD, självhostade)
├── js/   avsnitt.js elevfeedback.js            (DELAD, från Kemibok)
├── doc/  KOMPONENTER-INNEHALL.md LEVERANSGUIDE-INNEHALL.md PLATTFORMS-ANDRINGAR.md
└── kapitel/grammatik/
    ├── index.html                              Kapitel: Grammatik
    └── delkapitel/
        ├── ordklasser/
        │   ├── index.html                      Delkapitel: 10 avsnittskort (1 aktivt, 9 dimmade)
        │   └── avsnitt-1-substantiv.html       Läs/Öva/Elevboken, underdelar A–E
        └── satsdelar/
            └── index.html                      Delkapitel: 6 dimmade avsnittskort
```

## 2. Uppgift, i ordning (git-commit per steg)

**Steg 1: Inventera och rapportera. Bygg ingenting.**
- Jämför varje DELAD fil i zippen byte för byte mot `jb873/Kemibok` main. Rapportera avvikelser.
- Kontrollera att alla relativa sökvägar (css/js/fonts/länkar) löser sig.
- Rapportera. **Vänta på Joachims godkännande innan steg 2.**

**Steg 2: Skapa repot**
- Nytt repo `jb873/Svenskbok`, public.
- Lägg in zippens innehåll oförändrat. Commit: `Svenskbok: grundstruktur (arbetsorder 01)`.

**Steg 3: Verifiera i headless Chromium** (inte node-harness), vid 1366×768:
- Alla fem sidor laddar utan konsolfel.
- Brödsmulor och alla länkar fungerar åt båda håll.
- Substantiv: underdelsknapparna A–E visar rätt text. Flikarna Läs/Öva/Elevboken växlar.
- Tabellerna ligger i läsbredd (770 px), inte full sidbredd.
- Inga anrop till externa domäner (fonts.googleapis.com m.fl.).
- Rapportera **per sida** med skärmbild.

**Steg 4: Publicera**
- Aktivera GitHub Pages (main, root).
- Verifiera att den publicerade adressen fungerar och rapportera länken.

## 3. Låsta beslut, får inte ändras

| Beslut | Värde |
|---|---|
| Signaturfärg | `#8c3448`, enda ÄMNESEGET-färgen |
| Hero | Mörk vinröd gradient `#1c1116 → #301c24` (godkänd) |
| Hero-etiketter | Behåller geografis mässing (vinrött ger 2,4:1 mot heron) |
| Sidordning | Kort **överst**, kapitel-/delkapiteltext **under** korten (eleven ska inte behöva scrolla) |
| Texter | Lärarens texter **ordagrant**, inklusive stavfel. Inga nivåer, ingen nivåväljare |
| Struktur | Grammatik = kapitel, Ordklasser/Satsdelar = delkapitel, ordklass/satsdel = avsnitt, avsnittets delar = underdelar A–E |
| Komponenter | Endast befintliga plattformskomponenter. Inga nya |

Öppet förslag, **rörs inte**: `--accent-hover #6d2838`.

## 4. Utanför omfånget

- Öva-fliken och Elevboken (platshållare ligger kvar)
- Text till övriga ordklasser och satsdelar
- Rättning av textfel (lärarens beslut)
- Kapitlets verktyg (begreppsbank, elevbok, självskattning)
- Ändringar i `geografi.css` eller andra DELADE filer

## 5. Kända avvikelser att logga, inte åtgärda

- 🔵 `geografi.css` B2 (läsbredd) saknar `.vintage-tabell-wrapper`. Kompenseras i `svenska.css`. Loggas i PLATTFORMS-ANDRINGAR som plattformskandidat.
- 🔵 `kapitelstart.css` förutsätter text ovanför listan. Luften för text-under-kort sätts i `svenska.css`. Loggas som plattformskandidat, eftersom samma princip bör gälla alla böcker.

## 6. Regler

- **Gissa aldrig. Är något oklart: fråga.**
- Inventera och föreslå före bygge.
- Headless Chromium, rapport per sida.
- `Arkiv/` rörs aldrig.
