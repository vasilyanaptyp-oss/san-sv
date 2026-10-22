(function () {
  'use strict';
  var root = document.documentElement;
  var D = {};
  try { D = JSON.parse(document.getElementById('i18n').textContent); } catch (e) { D = {}; }
  var cur = 'lv';

  /* ---------- language: LV in the HTML, ?lang=ru switches to RU ---------- */
  function apply(lang) {
    var t = D[lang];
    if (!t) { root.classList.remove('ru-pending'); return; }
    cur = lang;
    [].forEach.call(document.querySelectorAll('[data-i]'), function (el) {
      var k = el.getAttribute('data-i');
      if (t[k] != null) el.innerHTML = t[k];
    });
    [].forEach.call(document.querySelectorAll('[data-a]'), function (el) {
      el.getAttribute('data-a').split('|').forEach(function (pair) {
        var p = pair.split(':');
        if (t[p[1]] != null) el.setAttribute(p[0], t[p[1]]);
      });
    });
    root.lang = t._lang;
    document.title = t._title;
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t._desc);
    root.classList.remove('ru-pending');
  }
  function setUrl(lang) {
    try {
      var u = new URL(location.href);
      if (lang === 'ru') u.searchParams.set('lang', 'ru'); else u.searchParams.delete('lang');
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch (e) {}
  }
  var want = /[?&]lang=ru(&|$)/.test(location.search) ? 'ru' : 'lv';
  if (want === 'ru') apply('ru'); else root.classList.remove('ru-pending');
  var lb = document.getElementById('lang');
  if (lb) lb.addEventListener('click', function () {
    var next = cur === 'ru' ? 'lv' : 'ru';
    apply(next); setUrl(next);
  });

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector('.burger'), mnav = document.getElementById('mnav'), hdr = document.getElementById('hdr');
  function setMenu(open) {
    hdr.classList.toggle('open', open);
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger) burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  if (mnav) mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 980) setMenu(false); });

  /* header shadow after scroll */
  function onScroll() { hdr.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- form: opens the visitor's mail program ---------- */
  var f = document.getElementById('cform');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = D[cur] || {};
    var name = f.elements.name.value.trim(), contact = f.elements.contact.value.trim(), msg = f.elements.msg.value.trim();
    var err = f.querySelector('.f-err');
    [f.elements.name, f.elements.contact, f.elements.msg].forEach(function (el) {
      el.setAttribute('aria-invalid', el.value.trim() ? 'false' : 'true');
    });
    if (!name || !contact || !msg) { err.hidden = false; return; }
    err.hidden = true;
    var body = msg + '\n\n' + (t.f_l1 || 'Vārds') + ': ' + name + '\n' + (t.f_l2 || 'Kontakts') + ': ' + contact;
    location.href = 'mailto:sansv@inbox.lv?subject=' + encodeURIComponent(t.f_subj || '') + '&body=' + encodeURIComponent(body);
  });
})();
