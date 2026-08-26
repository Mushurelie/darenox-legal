/* Darenox — pages légales.
 *
 * Tout ce qui suit est une amélioration progressive : sans JavaScript, la page
 * reste entièrement lisible, le sommaire fonctionne (ce sont des ancres) et le
 * thème suit celui du système. Un document légal doit rester consultable même
 * quand tout le reste échoue.
 */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ── Thème ──────────────────────────────────────────────────────────────
     Le choix explicite l'emporte sur celui du système, et il est mémorisé :
     quelqu'un qui bascule en clair pour lire ce texte veut le retrouver clair
     sur l'autre page. Le stockage peut être refusé (navigation privée,
     réglages restrictifs) — on continue sans, plutôt que d'échouer. */

  var STORE = 'darenox-legal-theme';

  function stored() {
    try {
      return localStorage.getItem(STORE);
    } catch (e) {
      return null;
    }
  }

  function systemIsLight() {
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    var toLight = theme === 'dark';
    btn.setAttribute('aria-label', toLight ? 'Passer au thème clair' : 'Passer au thème sombre');
    btn.querySelector('[data-theme-label]').textContent = toLight ? 'Clair' : 'Sombre';
    btn.querySelector('[data-theme-icon]').textContent = toLight ? '☀' : '☾';
  }

  var initial = stored();
  apply(initial === 'light' || initial === 'dark' ? initial : systemIsLight() ? 'light' : 'dark');

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try {
        localStorage.setItem(STORE, next);
      } catch (e) {
        /* Rien à faire : la bascule vaut pour cette page, c'est déjà l'essentiel. */
      }
    });
  }

  /* ── Sommaire replié sur petit écran ────────────────────────────────────
     L'accordéon n'existe que sur téléphone. Refermé là-bas puis rouvert sur un
     grand écran — rotation, fenêtre agrandie — le sommaire resterait clos sans
     que rien ne permette de le rouvrir, puisque le résumé y est masqué. */

  var box = document.querySelector('.rail__box');
  if (box) {
    var wide = window.matchMedia('(min-width: 941px)');
    var sync = function () {
      if (wide.matches) box.open = true;
    };
    sync();
    wide.addEventListener('change', sync);
  }

  /* ── Ancres sur les titres ──────────────────────────────────────────────
     Pouvoir renvoyer quelqu'un à l'article 5 plutôt qu'au document entier est
     la première chose qu'on demande à une page juridique. */

  document.querySelectorAll('.doc h2[id], .doc h3[id]').forEach(function (h) {
    var a = document.createElement('a');
    a.className = 'anchor';
    a.href = '#' + h.id;
    a.textContent = '#';
    a.setAttribute('aria-label', 'Lien vers cette section');
    h.appendChild(a);
  });

  /* ── Barre de progression ───────────────────────────────────────────────
     Calculée sur demande d'image d'animation : lié directement à l'événement de
     défilement, le calcul de mise en page s'exécuterait des dizaines de fois
     par seconde et ferait saccader le défilement sur un téléphone. */

  var bar = document.querySelector('.progress__bar');
  if (bar) {
    var ticking = false;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
      ticking = false;
    };
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ── Suivi de position dans le sommaire ─────────────────────────────────
     La marge haute négative fait basculer la section active quand son titre
     atteint le premier tiers de l'écran, et non quand il touche le bord : c'est
     là que l'œil se trouve réellement pendant la lecture. */

  var links = Array.prototype.slice.call(document.querySelectorAll('.rail__list a[href^="#"]'));
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var current = null;

    var mark = function (id) {
      if (id === current) return;
      current = id;
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };

    var seen = new Map();
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          seen.set(e.target.id, e.isIntersecting);
        });
        // La première section visible dans l'ordre du document fait foi : sans
        // cette règle, deux sections courtes visibles ensemble se disputeraient
        // la surbrillance à chaque image.
        for (var i = 0; i < sections.length; i++) {
          if (seen.get(sections[i].id)) {
            mark(sections[i].id);
            return;
          }
        }
      },
      { rootMargin: '-33% 0px -55% 0px' }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
  }
})();
