/**
 * main.js — page initialiser
 * Wires declarative data-* attributes to TUI methods via event delegation.
 * No inline JS needed in page markup.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // inject SVG sprite so <use href="#icon-*"> works from any directory
    var spriteHref = document.currentScript
      ? document.currentScript.src.replace(/main\.js$/, '../../assets/icons/sprite.svg')
      : '../assets/icons/sprite.svg';

    fetch(spriteHref)
      .then(function (r) {
        return r.text();
      })
      .then(function (svg) {
        var div = document.createElement('div');
        div.setAttribute('aria-hidden', 'true');
        div.style.display = 'none';
        div.innerHTML = svg;
        document.body.insertBefore(div, document.body.firstChild);
      })
      .catch(function () {
        // sprite inline-inject failed — icons fall back to missing (non-fatal)
      });

    // ── Event delegation ───────────────────────────────────────────────────

    document.addEventListener('click', function (e) {
      var target = e.target.closest(
        '[data-coming-soon], [data-drawer-open], [data-drawer-close], [data-modal-open], [data-modal-close], [data-copy], [data-toast]'
      );
      if (!target) return;

      // data-coming-soon — prevent navigation + show info toast
      if (target.hasAttribute('data-coming-soon')) {
        e.preventDefault();
        if (window.TUI) {
          TUI.toast('هذه الصفحة قيد الإنشاء', { type: 'info', duration: 3000 });
        }
        return;
      }

      // data-drawer-open="<id>"
      if (target.hasAttribute('data-drawer-open')) {
        e.preventDefault();
        var drawerId = target.getAttribute('data-drawer-open');
        if (window.TUI && drawerId) TUI.drawer.open(drawerId);
        return;
      }

      // data-drawer-close (no value needed — closes nearest drawer)
      if (target.hasAttribute('data-drawer-close')) {
        e.preventDefault();
        var drawerEl = target.closest('[data-drawer]');
        if (drawerEl && window.TUI) {
          TUI.drawer.close(drawerEl.getAttribute('data-drawer'));
        }
        return;
      }

      // data-modal-open="<id>"
      if (target.hasAttribute('data-modal-open')) {
        e.preventDefault();
        var modalId = target.getAttribute('data-modal-open');
        if (window.TUI && modalId) TUI.modal.open(modalId);
        return;
      }

      // data-modal-close
      if (target.hasAttribute('data-modal-close')) {
        e.preventDefault();
        var modalEl = target.closest('[data-modal]');
        if (modalEl && window.TUI) {
          TUI.modal.close(modalEl.getAttribute('data-modal'));
        }
        return;
      }

      // data-copy="<value>" | data-copy-target="#sel"
      if (target.hasAttribute('data-copy') || target.hasAttribute('data-copy-target')) {
        e.preventDefault();
        var copyText = '';
        if (target.hasAttribute('data-copy')) {
          copyText = target.getAttribute('data-copy');
        } else {
          var sel = target.getAttribute('data-copy-target');
          var copyEl = sel ? document.querySelector(sel) : null;
          if (copyEl) copyText = copyEl.textContent || copyEl.value || '';
        }
        if (window.TUI && copyText) TUI.copyToClipboard(copyText);
        return;
      }

      // data-toast="<msg>" [data-toast-type="success|error|info|warning"]
      if (target.hasAttribute('data-toast')) {
        var msg = target.getAttribute('data-toast');
        var type = target.getAttribute('data-toast-type') || 'info';
        if (window.TUI && msg) TUI.toast(msg, { type: type });
        return;
      }
    });

    // ── Form validation wiring ─────────────────────────────────────────────

    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form || !form.hasAttribute('data-validate')) return;
      if (!window.TUI) return;
      var result = TUI.validateForm(form);
      if (!result.valid) {
        e.preventDefault();
        // focus first invalid field
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      }
    });

    // ── Copyright year auto-fill ───────────────────────────────────────────
    var yearEls = document.querySelectorAll('[data-year]');
    Array.prototype.forEach.call(yearEls, function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
