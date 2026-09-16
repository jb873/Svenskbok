// ordklass-ova.js — Öva-fliken för ordklassavsnitt (ÄMNESEGET, Svenska).
//
//   Datadriven övning i två steg: (1) hitta orden i meningarna, (2) böj dem i
//   en tabell. Allt innehåll – meningar, facit, rubriker, instruktioner och
//   elevtexter – kommer från JSON-filen i data-fil. Inget här är knutet till
//   en viss ordklass; samma motor kör verb, pronomen och adjektiv med en ny fil.
//
//   Montering (avsnittssidan, Öva-panelen):
//     <div class="ordova" data-fil="../../data/ova/avsnitt-N-{slug}.json"></div>
//     <script src="../../../../js/ordklass-ova.js" defer></script>
//
//   Sparande: localStorage, nyckel svenska-ova-{avsnitt}-v{N} per version
//   (+ svenska-ova-{avsnitt}-vald för senast valda version). Varje läsning och
//   skrivning i try/catch – sidan fungerar utan lagring.
//
//   Krockar inte med avsnitt.js: inga av dess klasser (.flik, .underdel-*,
//   .niva-*) används, och location.hash rörs inte.
(function () {
  'use strict';

  var ORDREGEX = /\p{L}+/gu;                 // ett ord = en följd av bokstäver (unicode)
  var FELTID = 900;                          // ms som felmarkeringen syns

  var KRAVS = ['avsnitt', 'rubrik_steg1', 'rubrik_steg2', 'instruktion_steg1',
    'instruktion_steg2', 'kolumn_hittat', 'kolumner', 'meddelanden',
    'fel_sarskilda', 'tips_tabell', 'versioner'];
  var KRAVS_MEDD = ['ratt', 'ratt_namn', 'ratt_genitiv', 'ratt_genitiv_namn', 'redan', 'fel'];
  var KRAVS_TIPS = ['tom', 'grundform_fel_kolumn'];
  var KRAVS_VERSION = ['sentences', 'names', 'genitiv', 'lemmas', 'tokens'];

  // ---------- Hjälpare ----------
  function el(tag, klass, text) {
    var e = document.createElement(tag);
    if (klass) { e.className = klass; }
    if (text !== undefined && text !== null) { e.textContent = text; }
    return e;
  }
  function harEgen(obj, nyckel) { return Object.prototype.hasOwnProperty.call(obj, nyckel); }
  function norm(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function lista(v) { return Array.isArray(v) ? v : [v]; }
  function storForsta(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function fyll(mall, ord) { return String(mall).replace(/\{ord\}/g, storForsta(ord)); }

  function lasLagring(nyckel) {
    try { var s = localStorage.getItem(nyckel); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }
  function skrivLagring(nyckel, varde) {
    try { localStorage.setItem(nyckel, JSON.stringify(varde)); } catch (e) {}
  }
  function raderaLagring(nyckel) {
    try { localStorage.removeItem(nyckel); } catch (e) {}
  }

  // ---------- Validering av JSON ----------
  function validera(d) {
    var fel = [];
    if (!d || typeof d !== 'object') { return ['filen är inte ett JSON-objekt']; }
    KRAVS.forEach(function (k) { if (!harEgen(d, k) || d[k] === null) { fel.push('saknar ' + k); } });
    if (fel.length) { return fel; }
    if (!Array.isArray(d.kolumner) || !d.kolumner.length) { fel.push('kolumner ska vara en lista'); }
    KRAVS_MEDD.forEach(function (k) { if (typeof d.meddelanden[k] !== 'string') { fel.push('saknar meddelanden.' + k); } });
    KRAVS_TIPS.forEach(function (k) { if (typeof d.tips_tabell[k] !== 'string') { fel.push('saknar tips_tabell.' + k); } });
    if (d.exempel !== undefined && d.exempel !== null &&
        (!Array.isArray(d.exempel) || d.exempel.length !== d.kolumner.length)) {
      fel.push('exempel ska ha lika många värden som kolumner');
    }
    if (!Array.isArray(d.versioner) || !d.versioner.length) { fel.push('versioner ska vara en lista'); return fel; }
    d.versioner.forEach(function (v, i) {
      KRAVS_VERSION.forEach(function (k) { if (!harEgen(v, k) || v[k] === null) { fel.push('version ' + (i + 1) + ' saknar ' + k); } });
    });
    return fel;
  }

  // ---------- Övningen ----------
  function initOrdova(mount) {
    var FIL = mount.getAttribute('data-fil');
    var data = null;

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
        data = d;
        starta();
      })
      .catch(function (e) { visaFel('Övningen kunde inte laddas: ' + e.message); });

    // ----- tillstånd -----
    var version = 0;                     // index i data.versioner
    var lage = null;                     // { hittade: [{k, w, orig}], varden: { lemma: [str...] } }
    var lagen = {};                      // minnescache per version – versionsbyte fungerar utan lagring

    function nyckelFor(n) { return 'svenska-ova-' + data.avsnitt + '-v' + (n + 1); }
    function nyckelVald() { return 'svenska-ova-' + data.avsnitt + '-vald'; }

    function lasLage(n) {
      if (lagen[n]) { return lagen[n]; }
      var s = lasLagring(nyckelFor(n));
      if (!s || !Array.isArray(s.hittade) || typeof s.varden !== 'object' || s.varden === null) {
        s = { hittade: [], varden: {} };
      }
      lagen[n] = s;
      return s;
    }
    function sparaLage() { skrivLagring(nyckelFor(version), lage); }

    // ----- ordklassning -----
    // Ett ord är "rätt" om det finns i tokens, names eller genitiv.
    // Returnerar { meddelande, lemma } eller null om ordet inte är rätt.
    function klassa(v, w) {
      var iNamn = v.names.indexOf(w) !== -1;
      var iGenitiv = harEgen(v.genitiv, w);
      var iToken = harEgen(v.tokens, w);
      if (iNamn && iGenitiv) { return { meddelande: 'ratt_genitiv_namn', lemma: null }; }
      if (iGenitiv) { return { meddelande: 'ratt_genitiv', lemma: v.genitiv[w] }; }
      if (iNamn) { return { meddelande: 'ratt_namn', lemma: null }; }
      if (iToken) { return { meddelande: 'ratt', lemma: v.tokens[w] }; }
      return null;
    }

    // Alla förekomster som ska hittas i en version (Y i räknaren).
    function antalAttHitta(v) {
      var n = 0;
      v.sentences.forEach(function (s) {
        (s.match(ORDREGEX) || []).forEach(function (ord) { if (klassa(v, ord.toLowerCase())) { n++; } });
      });
      return n;
    }

    // Tabellrader: ett lemma per rad i den ordning det först hittades,
    // med de ord eleven hittat för lemmat.
    function rader(v) {
      var ordning = [], ord = {};
      lage.hittade.forEach(function (f) {
        var k = klassa(v, f.w);
        if (!k || !k.lemma) { return; }
        if (!ord[k.lemma]) { ord[k.lemma] = []; ordning.push(k.lemma); }
        var visat = f.orig.toLowerCase();
        if (ord[k.lemma].indexOf(visat) === -1) { ord[k.lemma].push(visat); }
      });
      return { ordning: ordning, ord: ord };
    }

    // ----- DOM-referenser (byggs om vid render) -----
    var ref = {};

    function starta() {
      var vald = lasLagring(nyckelVald());
      if (typeof vald === 'number' && vald >= 0 && vald < data.versioner.length) { version = vald; }
      render();
    }

    function render() {
      lage = lasLage(version);
      var v = data.versioner[version];
      mount.innerHTML = '';

      // Versionsväljare
      var valjare = el('div', 'ordova-valjare');
      valjare.setAttribute('role', 'group');
      valjare.setAttribute('aria-label', 'Version');
      data.versioner.forEach(function (_, i) {
        var b = el('button', 'ordova-version' + (i === version ? ' aktiv' : ''), 'Version ' + (i + 1));
        b.type = 'button';
        b.setAttribute('aria-pressed', i === version ? 'true' : 'false');
        b.addEventListener('click', function () {
          if (i === version) { return; }
          version = i;
          skrivLagring(nyckelVald(), version);
          render();
        });
        valjare.appendChild(b);
      });
      mount.appendChild(valjare);

      // Steg 1
      var steg1 = el('section', 'ordova-steg');
      steg1.appendChild(el('h2', 'ordova-rubrik', data.rubrik_steg1));
      steg1.appendChild(el('p', 'ordova-instruktion', data.instruktion_steg1));
      steg1.appendChild(byggMeningar(v));
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
      steg2.appendChild(el('h2', 'ordova-rubrik', data.rubrik_steg2));
      steg2.appendChild(el('p', 'ordova-instruktion', data.instruktion_steg2));
      ref.tabellHall = el('div', 'ordova-tabell');
      steg2.appendChild(ref.tabellHall);
      var knappar = el('div', 'ordova-knappar');
      var ratta = el('button', 'ordova-ratta', 'Rätta tabellen');
      ratta.type = 'button';
      ratta.addEventListener('click', rattaTabell);
      var borjaOm = el('button', 'ordova-borja-om', 'Börja om');
      borjaOm.type = 'button';
      borjaOm.addEventListener('click', function () {
        if (window.confirm('Radera allt du gjort i version ' + (version + 1) + '?')) {
          raderaLagring(nyckelFor(version));
          delete lagen[version];
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

      byggTabell(v);
      uppdateraRaknare(v);
    }

    // ----- Steg 1: meningarna -----
    function byggMeningar(v) {
      var ol = el('ol', 'ordova-meningar');
      var hittadeNycklar = {};
      lage.hittade.forEach(function (f) { hittadeNycklar[f.k] = true; });
      v.sentences.forEach(function (mening, i) {
        var li = el('li');
        var j = 0, sist = 0, m;
        ORDREGEX.lastIndex = 0;
        while ((m = ORDREGEX.exec(mening)) !== null) {
          if (m.index > sist) { li.appendChild(document.createTextNode(mening.slice(sist, m.index))); }
          var orig = m[0], k = i + '-' + j++, w = orig.toLowerCase();
          var b = el('button', 'ordova-ord' + (hittadeNycklar[k] ? ' hittad' : ''), orig);
          b.type = 'button';
          b.setAttribute('data-nyckel', k);
          b.addEventListener('click', (function (knapp, nyckel, ordLc, ordOrig) {
            return function () { klickOrd(v, knapp, nyckel, ordLc, ordOrig); };
          })(b, k, w, orig));
          li.appendChild(b);
          sist = m.index + orig.length;
        }
        if (sist < mening.length) { li.appendChild(document.createTextNode(mening.slice(sist))); }
        ol.appendChild(li);
      });
      return ol;
    }

    function sag(text) { ref.meddelande.textContent = text; }

    function klickOrd(v, knapp, k, w, orig) {
      var redan = lage.hittade.some(function (f) { return f.k === k; });
      if (redan) { sag(fyll(data.meddelanden.redan, orig)); return; }
      var klass = klassa(v, w);
      if (klass) {
        lage.hittade.push({ k: k, w: w, orig: orig });
        knapp.classList.add('hittad');
        sag(fyll(data.meddelanden[klass.meddelande], orig));
        sparaLage();
        byggTabell(v);
        uppdateraRaknare(v);
        return;
      }
      // Fel: kort markering, meddelande. Räknas inte, sparas inte.
      knapp.classList.remove('fel');
      void knapp.offsetWidth;   // starta om övergången
      knapp.classList.add('fel');
      setTimeout(function () { knapp.classList.remove('fel'); }, FELTID);
      sag(harEgen(data.fel_sarskilda, w) ? data.fel_sarskilda[w] : fyll(data.meddelanden.fel, orig));
    }

    function uppdateraRaknare(v) {
      ref.raknare.textContent = 'Hittade ' + lage.hittade.length + ' av ' + antalAttHitta(v);
    }

    // ----- Steg 2: tabellen -----
    function byggTabell(v) {
      var r = rader(v);
      ref.tabellHall.innerHTML = '';
      ref.resultat.textContent = '';

      var wrapper = el('div', 'vintage-tabell-wrapper');
      var tabell = el('table', 'vintage-tabell');
      var thead = el('thead'), trh = el('tr');
      trh.appendChild(el('th', null, data.kolumn_hittat));
      data.kolumner.forEach(function (kol) { trh.appendChild(el('th', null, kol)); });
      thead.appendChild(trh);
      tabell.appendChild(thead);

      var tbody = el('tbody');
      if (data.exempel) {
        var trx = el('tr', 'ordova-exempel');
        trx.appendChild(el('td', 'ordova-hittat', 'Exempel'));
        data.exempel.forEach(function (form) { trx.appendChild(el('td', null, form)); });
        tbody.appendChild(trx);
      }
      if (!r.ordning.length) {
        var trt = el('tr', 'ordova-tom');
        var tdt = el('td', null, 'Orden du hittar i steg 1 hamnar här.');
        tdt.colSpan = data.kolumner.length + 1;
        trt.appendChild(tdt);
        tbody.appendChild(trt);
      }
      r.ordning.forEach(function (lemma) {
        var tr = el('tr');
        tr.appendChild(el('td', 'ordova-hittat', r.ord[lemma].join(', ')));
        data.kolumner.forEach(function (kol, ci) {
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

    function rattaTabell() {
      var v = data.versioner[version];
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
        var tips = '';
        if (!svar) { tips = data.tips_tabell.tom; }
        else if (ci > 0 && svar === norm(lemma)) { tips = data.tips_tabell.grundform_fel_kolumn; }
        if (tips) { td.appendChild(el('span', 'ordova-tips', tips)); }
      });

      var kvar = antalAttHitta(v) - lage.hittade.length;
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
