// ordklass-ova.js — Öva-fliken för ordklassavsnitt och blandade övningar
// (ÄMNESEGET, Svenska).
//
//   Datadriven övning i två steg: (1) hitta orden i texten, (2) böj dem i en
//   tabell. Allt innehåll – meningar, facit, rubriker, instruktioner och
//   elevtexter – kommer från JSON-filen i data-fil. Inget här är knutet till
//   en viss ordklass. Enda UI-texten utanför JSON: "Här övar du:" (arbetsorder 03).
//
//   Två JSON-former (arbetsorder 03 §4):
//     Form A – ett avsnitt (Substantiv): { avsnitt, ordklass, rubrik_steg1, … , versioner }
//     Form B – flera delar (Blandad övning): { sida, titel, ovar, antal_versioner, delar[] }
//   Formen avgörs av om `delar` finns. Efter validering normaliseras båda till
//   samma interna struktur (en sida med en eller flera delar), så att resten av
//   motorn är formoberoende. Form A:s lagringsnycklar är oförändrade sedan
//   arbetsorder 02.
//
//   Montering:
//     <div class="ordova" data-fil="../../data/ova/{fil}.json"></div>
//     <script src="../../../../js/ordklass-ova.js" defer></script>
//
//   Sparande (localStorage, varje läsning/skrivning i try/catch):
//     Form A: svenska-ova-{avsnitt}-v{N}            + svenska-ova-{avsnitt}-vald
//     Form B: svenska-ova-{sida}-v{N}-{ordklass}    + svenska-ova-{sida}-vald, -del
//
//   Krockar inte med avsnitt.js: inga av dess klasser (.flik, .flik-innehall,
//   .underdel-*, .niva-*) används, och location.hash rörs inte.
(function () {
  'use strict';

  var ORDREGEX = /\p{L}+/gu;                 // ett ord = en följd av bokstäver (unicode)
  var FELTID = 900;                          // ms som felmarkeringen syns
  var OVAR_TEXT = 'Här övar du: ';           // enda UI-texten utanför JSON

  // ---------- Hjälpare ----------
  function el(tag, klass, text) {
    var e = document.createElement(tag);
    if (klass) { e.className = klass; }
    if (text !== undefined && text !== null) { e.textContent = text; }
    return e;
  }
  function harEgen(obj, nyckel) { return Object.prototype.hasOwnProperty.call(obj, nyckel); }
  function arObjekt(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function norm(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function lista(v) { return Array.isArray(v) ? v : [v]; }
  function storForsta(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function fyll(mall, ord) { return String(mall).replace(/\{ord\}/g, storForsta(ord)); }
  function tom(obj) { return !obj || Object.keys(obj).length === 0; }

  function lasLagring(nyckel) {
    try { var s = localStorage.getItem(nyckel); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }
  function skrivLagring(nyckel, varde) {
    try { localStorage.setItem(nyckel, JSON.stringify(varde)); } catch (e) {}
  }
  function raderaLagring(nyckel) {
    try { localStorage.removeItem(nyckel); } catch (e) {}
  }

  // ---------- Validering ----------
  var MEDD_A = ['ratt', 'ratt_namn', 'ratt_genitiv', 'ratt_genitiv_namn', 'redan', 'fel'];
  var MEDD_B = ['ratt', 'ratt_namn', 'ratt_genitiv', 'ratt_genitiv_namn', 'ratt_exempel', 'ratt_valfri', 'redan', 'fel'];
  var FALT_A = ['avsnitt', 'rubrik_steg1', 'rubrik_steg2', 'instruktion_steg1', 'instruktion_steg2',
    'kolumn_hittat', 'kolumner', 'meddelanden', 'fel_sarskilda', 'tips_tabell', 'versioner'];
  var FALT_B_SIDA = ['sida', 'titel', 'ovar', 'antal_versioner', 'delar'];
  var FALT_B_DEL = ['ordklass', 'flik', 'visning', 'rubrik_steg1', 'rubrik_steg2', 'instruktion_steg1',
    'instruktion_steg2', 'kolumn_hittat', 'kolumner', 'exempel', 'exempel_lemma', 'meddelanden',
    'fel_sarskilda', 'ratt_sarskilda', 'tips_tabell', 'versioner'];
  var VERSION_A = ['sentences', 'names', 'genitiv', 'lemmas', 'tokens'];
  var VERSION_B = ['sentences', 'names', 'genitiv', 'valfria', 'neutrala', 'tokens', 'lemmas'];

  // Fält som får vara null i form B (men måste finnas)
  var NULLBARA_B = { exempel: true, exempel_lemma: true };

  function saknas(obj, falt, nullbara) {
    return falt.filter(function (k) {
      if (!harEgen(obj, k)) { return true; }
      return obj[k] === null && !(nullbara && nullbara[k]);
    });
  }

  // Delens innehåll som är gemensamt för båda formerna (efter formspecifika krav)
  function valideraDel(d, namn, medd, versionFalt, fel) {
    if (!Array.isArray(d.kolumner) || !d.kolumner.length) { fel.push(namn + ': kolumner ska vara en lista'); }
    if (!arObjekt(d.meddelanden)) { fel.push(namn + ': meddelanden ska vara ett objekt'); return; }
    medd.forEach(function (k) { if (!harEgen(d.meddelanden, k)) { fel.push(namn + ': saknar meddelanden.' + k); } });
    if (!arObjekt(d.tips_tabell)) { fel.push(namn + ': tips_tabell ska vara ett objekt'); }
    if (!arObjekt(d.fel_sarskilda)) { fel.push(namn + ': fel_sarskilda ska vara ett objekt'); }
    if (d.exempel !== undefined && d.exempel !== null &&
        (!Array.isArray(d.exempel) || d.exempel.length !== d.kolumner.length)) {
      fel.push(namn + ': exempel ska ha lika många värden som kolumner');
    }
    if (!Array.isArray(d.versioner) || !d.versioner.length) { fel.push(namn + ': versioner ska vara en lista'); return; }
    d.versioner.forEach(function (v, i) {
      var vn = namn + ', version ' + (i + 1);
      var s = saknas(v, versionFalt);
      if (s.length) { fel.push(vn + ': saknar ' + s.join(', ')); return; }
      if (!Array.isArray(v.sentences)) { fel.push(vn + ': sentences ska vara en lista'); }
      if (!Array.isArray(v.names)) { fel.push(vn + ': names ska vara en lista'); }
    });
  }

  // Null-meddelanden: en version får inte ha data som kräver ett meddelande som är null.
  function valideraMeddelanden(d, namn, fel) {
    var m = d.meddelanden;
    d.versioner.forEach(function (v, i) {
      var vn = namn + ', version ' + (i + 1);
      var kraver = function (villkor, nyckel, vad) {
        if (villkor && (m[nyckel] === null || m[nyckel] === undefined)) { fel.push(vn + ': ' + vad + ' kräver meddelanden.' + nyckel); }
      };
      var namnGenitiv = Object.keys(v.genitiv || {}).some(function (w) { return (v.names || []).indexOf(w) !== -1; });
      kraver((v.names || []).length > 0, 'ratt_namn', 'names');
      kraver(!tom(v.genitiv), 'ratt_genitiv', 'genitiv');
      kraver(namnGenitiv, 'ratt_genitiv_namn', 'namn i genitiv');
      kraver(!!d.exempel_lemma, 'ratt_exempel', 'exempel_lemma');
      kraver(!tom(v.valfria), 'ratt_valfri', 'valfria');
      kraver(!tom(v.tokens), 'ratt', 'tokens');
    });
  }

  function validera(d) {
    var fel = [];
    if (!arObjekt(d)) { return ['filen är inte ett JSON-objekt']; }
    if (!harEgen(d, 'delar')) {
      // ---- Form A (oförändrade krav från arbetsorder 02) ----
      var sA = saknas(d, FALT_A);
      if (sA.length) { return ['saknar ' + sA.join(', ')]; }
      valideraDel(d, 'avsnitt ' + d.avsnitt, MEDD_A, VERSION_A, fel);
      if (fel.length) { return fel; }
      MEDD_A.forEach(function (k) { if (typeof d.meddelanden[k] !== 'string') { fel.push('meddelanden.' + k + ' ska vara text'); } });
      ['tom', 'grundform_fel_kolumn'].forEach(function (k) { if (typeof d.tips_tabell[k] !== 'string') { fel.push('saknar tips_tabell.' + k); } });
      return fel;
    }
    // ---- Form B ----
    var sB = saknas(d, FALT_B_SIDA);
    if (sB.length) { return ['saknar ' + sB.join(', ')]; }
    if (!Array.isArray(d.delar) || !d.delar.length) { return ['delar ska vara en lista']; }
    if (!Array.isArray(d.ovar)) { fel.push('ovar ska vara en lista'); }
    d.delar.forEach(function (del, i) {
      var namn = 'del ' + (arObjekt(del) && del.flik ? del.flik : (i + 1));
      var s = saknas(del, FALT_B_DEL, NULLBARA_B);
      if (s.length) { fel.push(namn + ': saknar ' + s.join(', ')); return; }
      if (del.visning !== 'meningar' && del.visning !== 'lopande') { fel.push(namn + ': visning ska vara "meningar" eller "lopande"'); }
      if (!arObjekt(del.ratt_sarskilda)) { fel.push(namn + ': ratt_sarskilda ska vara ett objekt'); }
      valideraDel(del, namn, MEDD_B, VERSION_B, fel);
      if (Array.isArray(del.versioner) && del.versioner.length !== d.antal_versioner) {
        fel.push(namn + ': har ' + del.versioner.length + ' versioner, antal_versioner är ' + d.antal_versioner);
      }
    });
    if (fel.length) { return fel; }
    d.delar.forEach(function (del) { valideraMeddelanden(del, 'del ' + del.flik, fel); });
    return fel;
  }

  // ---------- Normalisering till intern struktur ----------
  // { id, ovar|null, formB, antalVersioner, delar: [{ ordklass, flik, visning, rubrik…, versioner }] }
  function normalisera(d) {
    if (!harEgen(d, 'delar')) {
      var m = {};
      MEDD_B.forEach(function (k) { m[k] = harEgen(d.meddelanden, k) ? d.meddelanden[k] : null; });
      return {
        id: d.avsnitt, ovar: null, formB: false, antalVersioner: d.versioner.length,
        delar: [{
          ordklass: d.ordklass, flik: null, visning: 'meningar',
          rubrik_steg1: d.rubrik_steg1, rubrik_steg2: d.rubrik_steg2,
          instruktion_steg1: d.instruktion_steg1, instruktion_steg2: d.instruktion_steg2,
          kolumn_hittat: d.kolumn_hittat, kolumner: d.kolumner,
          exempel: d.exempel || null, exempel_lemma: null,
          meddelanden: m, fel_sarskilda: d.fel_sarskilda, ratt_sarskilda: {}, tips_tabell: d.tips_tabell,
          versioner: d.versioner.map(function (v) {
            return { sentences: v.sentences, names: v.names, genitiv: v.genitiv, valfria: {}, neutrala: {}, tokens: v.tokens, lemmas: v.lemmas };
          })
        }]
      };
    }
    return { id: d.sida, ovar: d.ovar, formB: true, antalVersioner: d.antal_versioner, delar: d.delar };
  }

  // ---------- Övningen ----------
  function initOrdova(mount) {
    var FIL = mount.getAttribute('data-fil');
    var sida = null;

    function visaFel(text) {
      mount.innerHTML = '';
      mount.appendChild(el('p', 'ordova-laddfel', text));
      console.warn('ordklass-ova:', text);
    }

    if (!FIL) { visaFel('Övningen saknar data-fil.'); return; }

    fetch(FIL)
      .then(function (r) { if (!r.ok) { throw new Error('HTTP ' + r.status); } return r.json(); })
      .then(function (d) {
        var fel = validera(d);
        if (fel.length) { throw new Error('ogiltig övningsfil (' + FIL + '): ' + fel.join('; ')); }
        sida = normalisera(d);
        starta();
      })
      .catch(function (e) { visaFel('Övningen kunde inte laddas: ' + e.message); });

    // ----- tillstånd -----
    var version = 0;                     // index i versioner
    var delIndex = 0;                    // index i sida.delar
    var lage = null;                     // aktiv dels läge: { hittade: [{k,w,orig}], neutrala: [k], varden: {lemma: [str]} }
    var lagen = {};                      // minnescache per nyckel – byten fungerar utan lagring

    function nyckelLage(n, di) {
      return 'svenska-ova-' + sida.id + '-v' + (n + 1) + (sida.formB ? '-' + sida.delar[di].ordklass : '');
    }
    function nyckelVald() { return 'svenska-ova-' + sida.id + '-vald'; }
    function nyckelDel() { return 'svenska-ova-' + sida.id + '-del'; }

    function lasLage(n, di) {
      var nyckel = nyckelLage(n, di);
      if (lagen[nyckel]) { return lagen[nyckel]; }
      var s = lasLagring(nyckel);
      if (!s || !Array.isArray(s.hittade) || !arObjekt(s.varden)) { s = { hittade: [], neutrala: [], varden: {} }; }
      if (!Array.isArray(s.neutrala)) { s.neutrala = []; }
      lagen[nyckel] = s;
      return s;
    }
    function sparaLage() { skrivLagring(nyckelLage(version, delIndex), lage); }

    function aktivDel() { return sida.delar[delIndex]; }
    function aktivVersion() { return aktivDel().versioner[version]; }

    // ----- ordklassning -----
    // Typ avgör grön/räknas/rad (arbetsorder 03 §5). Meddelandet väljs separat.
    // Returnerar { typ, lemma } eller null när ordet inte är rätt.
    function typa(v, w) {
      var iNamn = v.names.indexOf(w) !== -1;
      var iGenitiv = harEgen(v.genitiv, w);
      if (iNamn && iGenitiv) { return { typ: 'genitiv_namn', lemma: null }; }
      if (iGenitiv) { return { typ: 'genitiv', lemma: v.genitiv[w] }; }
      if (iNamn) { return { typ: 'namn', lemma: null }; }
      if (harEgen(v.tokens, w)) { return { typ: 'token', lemma: v.tokens[w] }; }
      if (harEgen(v.valfria, w)) { return { typ: 'valfri', lemma: v.valfria[w] }; }
      return null;
    }
    function raknas(t) { return t.typ === 'token' || t.typ === 'namn' || t.typ === 'genitiv' || t.typ === 'genitiv_namn'; }
    function gerRad(del, t) {
      if (t.typ === 'token') { return !!t.lemma && t.lemma !== del.exempel_lemma; }
      if (t.typ === 'genitiv' || t.typ === 'valfri') { return !!t.lemma; }
      return false;
    }
    // Meddelande för en träff – första regel som gäller vinner (§5).
    function meddelandeFor(del, v, w, t) {
      var m = del.meddelanden;
      if (harEgen(del.ratt_sarskilda, w)) { return del.ratt_sarskilda[w]; }
      if (del.exempel_lemma && t.lemma === del.exempel_lemma && t.typ === 'token') { return m.ratt_exempel; }
      if (t.typ === 'genitiv_namn') { return m.ratt_genitiv_namn; }
      if (t.typ === 'genitiv') { return m.ratt_genitiv; }
      if (t.typ === 'namn') { return m.ratt_namn; }
      if (t.typ === 'valfri') { return m.ratt_valfri; }
      return m.ratt;
    }

    function ordILopande(v) {
      var alla = [];
      v.sentences.forEach(function (s) { (s.match(ORDREGEX) || []).forEach(function (o) { alla.push(o.toLowerCase()); }); });
      return alla;
    }
    // Y: alla förekomster som räknas.
    function antalAttHitta(v) {
      return ordILopande(v).filter(function (w) { var t = typa(v, w); return t && raknas(t); }).length;
    }
    function antalHittade() {
      var v = aktivVersion();
      return lage.hittade.filter(function (f) { var t = typa(v, f.w); return t && raknas(t); }).length;
    }
    function antalExtra() {
      var v = aktivVersion();
      return lage.hittade.filter(function (f) { var t = typa(v, f.w); return t && t.typ === 'valfri'; }).length;
    }

    // Tabellrader: ett lemma per rad i den ordning det först hittades.
    function rader(del, v) {
      var ordning = [], ord = {};
      lage.hittade.forEach(function (f) {
        var t = typa(v, f.w);
        if (!t || !gerRad(del, t)) { return; }
        if (!ord[t.lemma]) { ord[t.lemma] = []; ordning.push(t.lemma); }
        var visat = f.orig.toLowerCase();
        if (ord[t.lemma].indexOf(visat) === -1) { ord[t.lemma].push(visat); }
      });
      return { ordning: ordning, ord: ord };
    }

    // ----- DOM-referenser (byggs om vid render) -----
    var ref = {};

    function starta() {
      var vald = lasLagring(nyckelVald());
      if (typeof vald === 'number' && vald >= 0 && vald < sida.antalVersioner) { version = vald; }
      if (sida.formB) {
        var del = lasLagring(nyckelDel());
        if (typeof del === 'number' && del >= 0 && del < sida.delar.length) { delIndex = del; }
      }
      render();
    }

    function render() {
      lage = lasLage(version, delIndex);
      var del = aktivDel(), v = aktivVersion();
      mount.innerHTML = '';

      // Sidhuvud (form B)
      if (sida.ovar) {
        mount.appendChild(el('p', 'ordova-ovar', OVAR_TEXT + sida.ovar.join(', ')));
      }

      // Versionsväljare (en för hela sidan)
      var valjare = el('div', 'ordova-valjare');
      valjare.setAttribute('role', 'group');
      valjare.setAttribute('aria-label', 'Version');
      for (var i = 0; i < sida.antalVersioner; i++) {
        valjare.appendChild(valKnapp('ordova-version', 'Version ' + (i + 1), i === version, i, function (n) {
          version = n; skrivLagring(nyckelVald(), version); render();
        }));
      }
      mount.appendChild(valjare);

      // Delflikar (form B)
      if (sida.formB) {
        var flikar = el('div', 'ordova-delar');
        flikar.setAttribute('role', 'group');
        flikar.setAttribute('aria-label', 'Del');
        sida.delar.forEach(function (d, di) {
          flikar.appendChild(valKnapp('ordova-del', d.flik, di === delIndex, di, function (n) {
            delIndex = n; skrivLagring(nyckelDel(), delIndex); render();
          }));
        });
        mount.appendChild(flikar);
      }

      // Steg 1
      var steg1 = el('section', 'ordova-steg');
      steg1.appendChild(el('h2', 'ordova-rubrik', del.rubrik_steg1));
      steg1.appendChild(el('p', 'ordova-instruktion', del.instruktion_steg1));
      steg1.appendChild(byggText(del, v));
      var status = el('div', 'ordova-status');
      ref.meddelande = el('p', 'ordova-meddelande');
      ref.meddelande.setAttribute('aria-live', 'polite');
      ref.raknare = el('p', 'ordova-raknare');
      status.appendChild(ref.meddelande);
      status.appendChild(ref.raknare);
      steg1.appendChild(status);
      mount.appendChild(steg1);

      // Steg 2
      var steg2 = el('section', 'ordova-steg');
      steg2.appendChild(el('h2', 'ordova-rubrik', del.rubrik_steg2));
      steg2.appendChild(el('p', 'ordova-instruktion', del.instruktion_steg2));
      ref.tabellHall = el('div', 'ordova-tabell');
      steg2.appendChild(ref.tabellHall);
      var knappar = el('div', 'ordova-knappar');
      var ratta = el('button', 'ordova-ratta', 'Rätta tabellen');
      ratta.type = 'button';
      ratta.addEventListener('click', rattaTabell);
      var borjaOm = el('button', 'ordova-borja-om', 'Börja om');
      borjaOm.type = 'button';
      borjaOm.addEventListener('click', function () {
        var vad = 'version ' + (version + 1) + (sida.formB ? ' (' + del.flik + ')' : '');
        if (window.confirm('Radera allt du gjort i ' + vad + '?')) {
          raderaLagring(nyckelLage(version, delIndex));
          delete lagen[nyckelLage(version, delIndex)];
          render();
        }
      });
      knappar.appendChild(ratta);
      knappar.appendChild(borjaOm);
      steg2.appendChild(knappar);
      ref.resultat = el('p', 'ordova-resultat');
      ref.resultat.setAttribute('aria-live', 'polite');
      steg2.appendChild(ref.resultat);
      mount.appendChild(steg2);

      byggTabell(del, v);
      uppdateraRaknare(v);
    }

    function valKnapp(klass, text, aktiv, index, vidVal) {
      var b = el('button', klass + (aktiv ? ' aktiv' : ''), text);
      b.type = 'button';
      b.setAttribute('aria-pressed', aktiv ? 'true' : 'false');
      b.addEventListener('click', function () { if (!aktiv) { vidVal(index); } });
      return b;
    }

    // ----- Steg 1: texten -----
    // visning "meningar": numrerad lista. "lopande": alla meningar som ett stycke.
    function byggText(del, v) {
      var lopande = del.visning === 'lopande';
      var behallare = el(lopande ? 'p' : 'ol', lopande ? 'ordova-lopande' : 'ordova-meningar');
      var hittadeNycklar = {}, neutralaNycklar = {};
      lage.hittade.forEach(function (f) { hittadeNycklar[f.k] = true; });
      lage.neutrala.forEach(function (k) { neutralaNycklar[k] = true; });
      v.sentences.forEach(function (mening, i) {
        var mal = lopande ? behallare : el('li');
        var j = 0, sist = 0, m;
        ORDREGEX.lastIndex = 0;
        while ((m = ORDREGEX.exec(mening)) !== null) {
          if (m.index > sist) { mal.appendChild(document.createTextNode(mening.slice(sist, m.index))); }
          var orig = m[0], k = i + '-' + j++, w = orig.toLowerCase();
          var b = el('button', 'ordova-ord' + (hittadeNycklar[k] ? ' hittad' : '') + (neutralaNycklar[k] ? ' neutral' : ''), orig);
          b.type = 'button';
          b.setAttribute('data-nyckel', k);
          b.addEventListener('click', (function (knapp, nyckel, ordLc, ordOrig) {
            return function () { klickOrd(del, v, knapp, nyckel, ordLc, ordOrig); };
          })(b, k, w, orig));
          mal.appendChild(b);
          sist = m.index + orig.length;
        }
        if (sist < mening.length) { mal.appendChild(document.createTextNode(mening.slice(sist))); }
        if (lopande) {
          if (i < v.sentences.length - 1) { behallare.appendChild(document.createTextNode(' ')); }
        } else {
          behallare.appendChild(mal);
        }
      });
      return behallare;
    }

    function sag(text) { ref.meddelande.textContent = text; }

    function klickOrd(del, v, knapp, k, w, orig) {
      var redan = lage.hittade.some(function (f) { return f.k === k; });
      if (redan) { sag(fyll(del.meddelanden.redan, orig)); return; }
      var t = typa(v, w);
      if (t) {
        lage.hittade.push({ k: k, w: w, orig: orig });
        knapp.classList.add('hittad');
        sag(fyll(meddelandeFor(del, v, w, t), orig));
        sparaLage();
        byggTabell(del, v);
        uppdateraRaknare(v);
        return;
      }
      // Neutralt ord: grå, sparas, räknas inte, ingen rad. Visar sitt meddelande varje gång.
      if (harEgen(v.neutrala, w)) {
        if (lage.neutrala.indexOf(k) === -1) { lage.neutrala.push(k); sparaLage(); }
        knapp.classList.add('neutral');
        sag(fyll(v.neutrala[w], orig));
        return;
      }
      // Fel: kort markering, meddelande. Räknas inte, sparas inte.
      knapp.classList.remove('fel');
      void knapp.offsetWidth;   // starta om övergången
      knapp.classList.add('fel');
      setTimeout(function () { knapp.classList.remove('fel'); }, FELTID);
      sag(harEgen(del.fel_sarskilda, w) ? fyll(del.fel_sarskilda[w], orig) : fyll(del.meddelanden.fel, orig));
    }

    function uppdateraRaknare(v) {
      var extra = antalExtra();
      ref.raknare.textContent = 'Hittade ' + antalHittade() + ' av ' + antalAttHitta(v) + (extra > 0 ? ' (+' + extra + ' extra)' : '');
    }

    // ----- Steg 2: tabellen -----
    function byggTabell(del, v) {
      var r = rader(del, v);
      ref.tabellHall.innerHTML = '';
      ref.resultat.textContent = '';
      ref.resultat.classList.remove('alla-ratt');

      var wrapper = el('div', 'vintage-tabell-wrapper');
      var tabell = el('table', 'vintage-tabell');
      var thead = el('thead'), trh = el('tr');
      trh.appendChild(el('th', null, del.kolumn_hittat));
      del.kolumner.forEach(function (kol) { trh.appendChild(el('th', null, kol)); });
      thead.appendChild(trh);
      tabell.appendChild(thead);

      var tbody = el('tbody');
      if (del.exempel) {
        var trx = el('tr', 'ordova-exempel');
        trx.appendChild(el('td', 'ordova-hittat', 'Exempel'));
        del.exempel.forEach(function (form) { trx.appendChild(el('td', null, form)); });
        tbody.appendChild(trx);
      }
      if (!r.ordning.length) {
        var trt = el('tr', 'ordova-tom');
        var tdt = el('td', null, 'Orden du hittar i steg 1 hamnar här.');
        tdt.colSpan = del.kolumner.length + 1;
        trt.appendChild(tdt);
        tbody.appendChild(trt);
      }
      r.ordning.forEach(function (lemma) {
        var tr = el('tr');
        tr.appendChild(el('td', 'ordova-hittat', r.ord[lemma].join(', ')));
        del.kolumner.forEach(function (kol, ci) {
          var td = el('td');
          var falt = el('input', 'ordova-falt');
          falt.type = 'text';
          falt.autocomplete = 'off';
          falt.spellcheck = false;
          falt.setAttribute('data-lemma', lemma);
          falt.setAttribute('data-kolumn', String(ci));
          falt.setAttribute('aria-label', kol + ' för ' + r.ord[lemma][0]);
          falt.value = (lage.varden[lemma] && lage.varden[lemma][ci]) || '';
          falt.addEventListener('input', function () {
            if (!lage.varden[lemma]) { lage.varden[lemma] = []; }
            lage.varden[lemma][ci] = falt.value;
            falt.classList.remove('ratt', 'fel');
            var tips = td.querySelector('.ordova-tips');
            if (tips) { tips.remove(); }
            sparaLage();
          });
          falt.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); rattaTabell(); }
          });
          td.appendChild(falt);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      tabell.appendChild(tbody);
      wrapper.appendChild(tabell);
      ref.tabellHall.appendChild(wrapper);
    }

    // Tips vid fel svar – bara nycklar som finns i delens tips_tabell (§5).
    function tipsFor(del, v, r, lemma, ci, svar) {
      var tips = del.tips_tabell;
      if (!svar) { return tips.tom || ''; }
      if (ci > 0 && tips.grundform_fel_kolumn && lista(v.lemmas[lemma][0]).map(norm).indexOf(svar) !== -1) { return tips.grundform_fel_kolumn; }
      if (tips.dom && svar === 'dom') { return tips.dom; }
      if (ci === 0 && tips.positiv_grundform && r.ord[lemma].map(norm).indexOf(svar) !== -1) { return tips.positiv_grundform; }
      return '';
    }

    function rattaTabell() {
      var del = aktivDel(), v = aktivVersion();
      var r = rader(del, v);
      var falten = ref.tabellHall.querySelectorAll('.ordova-falt');
      var antalRatt = 0;
      Array.prototype.forEach.call(falten, function (falt) {
        var lemma = falt.getAttribute('data-lemma');
        var ci = parseInt(falt.getAttribute('data-kolumn'), 10);
        var svar = norm(falt.value);
        var td = falt.parentNode;
        var gammalt = td.querySelector('.ordova-tips');
        if (gammalt) { gammalt.remove(); }
        var facit = lista(v.lemmas[lemma][ci]).map(norm);
        var ratt = facit.indexOf(svar) !== -1;
        falt.classList.toggle('ratt', ratt);
        falt.classList.toggle('fel', !ratt);
        if (ratt) { antalRatt++; return; }
        var tips = tipsFor(del, v, r, lemma, ci, svar);
        if (tips) { td.appendChild(el('span', 'ordova-tips', tips)); }
      });

      var kvar = antalAttHitta(v) - antalHittade();
      var text;
      if (!falten.length) {
        text = 'Hitta orden i steg 1 först.';
      } else if (antalRatt === falten.length && kvar === 0) {
        text = 'Alla rätt – snyggt jobbat!';
      } else {
        text = antalRatt + ' av ' + falten.length + ' rutor rätt.';
        if (kvar > 0) { text += ' Det finns ' + kvar + ' ord kvar att hitta i steg 1.'; }
      }
      ref.resultat.textContent = text;
      ref.resultat.classList.toggle('alla-ratt', falten.length > 0 && antalRatt === falten.length);
    }
  }

  function init() {
    document.querySelectorAll('.ordova').forEach(initOrdova);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
