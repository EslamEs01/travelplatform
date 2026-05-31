/**
 * TUI — Travel UI interaction utilities
 * Exposes window.TUI; no framework, no CDN, no browser dialog functions.
 */
(function (global) {
  'use strict';

  // ─── helpers ────────────────────────────────────────────────────────────────

  function prefersReducedMotion() {
    return global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function warn(msg) {
    if (global.console && global.console.warn) {
      global.console.warn('[TUI] ' + msg);
    }
  }

  // ─── toast ──────────────────────────────────────────────────────────────────

  var _toastRoot = null;
  var _toastCounter = 0;

  function _ensureToastRoot() {
    if (!_toastRoot) {
      _toastRoot = document.getElementById('toast-root');
      if (!_toastRoot) {
        warn('No #toast-root found. Toast will not display.');
        return null;
      }
    }
    return _toastRoot;
  }

  /**
   * Show a transient, non-blocking toast notification.
   * @param {string} message
   * @param {{ type?: 'info'|'success'|'error'|'warning', duration?: number, dismissible?: boolean }} opts
   * @returns {{ id: string, close: Function }}
   */
  function toast(message, opts) {
    opts = opts || {};
    var type = opts.type || 'info';
    var duration = opts.duration !== undefined ? opts.duration : 4000;
    var dismissible = opts.dismissible !== undefined ? opts.dismissible : true;

    var root = _ensureToastRoot();
    if (!root) return { id: '', close: function () {} };

    var id = 'toast-' + ++_toastCounter;
    var el = document.createElement('div');
    el.id = id;
    el.className = 'toast toast-' + type;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');

    var iconMap = {
      success: '#icon-check-circle',
      error: '#icon-close',
      warning: '#icon-alert-triangle',
      info: '#icon-info',
    };

    el.innerHTML =
      '<svg class="toast-icon" aria-hidden="true"><use href="' +
      (iconMap[type] || iconMap.info) +
      '"/></svg>' +
      '<span class="toast-msg">' +
      _escHtml(message) +
      '</span>' +
      (dismissible
        ? '<button class="toast-close" aria-label="إغلاق الإشعار" type="button">' +
          '<svg aria-hidden="true"><use href="#icon-close"/></svg></button>'
        : '');

    root.appendChild(el);

    // animate in
    requestAnimationFrame(function () {
      el.classList.add('toast-visible');
    });

    function close() {
      if (!el.parentNode) return;
      el.classList.remove('toast-visible');
      el.classList.add('toast-hiding');
      var delay = prefersReducedMotion() ? 0 : 300;
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, delay);
    }

    if (dismissible) {
      var btn = el.querySelector('.toast-close');
      if (btn) btn.addEventListener('click', close);
    }

    if (duration > 0) {
      setTimeout(close, duration);
    }

    return { id: id, close: close };
  }

  // ─── modal ───────────────────────────────────────────────────────────────────

  var _modalState = {};

  function _getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
          'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function _trapFocus(container, e) {
    var focusable = _getFocusable(container);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  var modal = {
    /**
     * Open a modal dialog.
     * @param {string} targetId — matches [data-modal="<id>"]
     * @param {{ onClose?: Function }} opts
     */
    open: function (targetId, opts) {
      opts = opts || {};
      var el = document.querySelector('[data-modal="' + targetId + '"]');
      if (!el) {
        warn('modal.open: no element with data-modal="' + targetId + '"');
        return;
      }

      el.removeAttribute('hidden');
      el.removeAttribute('inert');
      document.body.setAttribute('inert', '');
      el.removeAttribute('inert');

      var panel = el.querySelector('.modal-panel');
      var trigger = document.activeElement;
      _modalState[targetId] = { trigger: trigger, onClose: opts.onClose };

      // move focus in
      var focusable = _getFocusable(panel || el);
      if (focusable.length) {
        setTimeout(
          function () {
            focusable[0].focus();
          },
          prefersReducedMotion() ? 0 : 50
        );
      }

      function onKey(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
          modal.close(targetId);
        }
        if (e.key === 'Tab') {
          _trapFocus(panel || el, e);
        }
      }
      _modalState[targetId].keyHandler = onKey;
      document.addEventListener('keydown', onKey);
    },

    /** Close a modal dialog. */
    close: function (targetId) {
      var el = document.querySelector('[data-modal="' + targetId + '"]');
      if (!el) {
        warn('modal.close: no element with data-modal="' + targetId + '"');
        return;
      }

      el.setAttribute('hidden', '');
      document.body.removeAttribute('inert');

      var state = _modalState[targetId];
      if (state) {
        if (state.keyHandler) document.removeEventListener('keydown', state.keyHandler);
        if (state.trigger && state.trigger.focus) state.trigger.focus();
        if (state.onClose) state.onClose();
        delete _modalState[targetId];
      }
    },
  };

  // ─── drawer ──────────────────────────────────────────────────────────────────

  var _drawerState = {};

  var drawer = {
    /** Open an off-canvas drawer. */
    open: function (targetId) {
      var el = document.querySelector('[data-drawer="' + targetId + '"]');
      if (!el) {
        warn('drawer.open: no element with data-drawer="' + targetId + '"');
        return;
      }

      el.removeAttribute('hidden');
      el.setAttribute('aria-hidden', 'false');
      document.body.setAttribute('inert', '');
      el.removeAttribute('inert');

      var trigger = document.activeElement;
      _drawerState[targetId] = { trigger: trigger };

      var panel = el.querySelector('.drawer-panel');
      var focusable = _getFocusable(panel || el);
      if (focusable.length) {
        setTimeout(
          function () {
            focusable[0].focus();
          },
          prefersReducedMotion() ? 0 : 50
        );
      }

      function onKey(e) {
        if (e.key === 'Escape' || e.key === 'Esc') drawer.close(targetId);
        if (e.key === 'Tab') _trapFocus(panel || el, e);
      }
      _drawerState[targetId].keyHandler = onKey;
      document.addEventListener('keydown', onKey);

      // animate
      if (!prefersReducedMotion()) {
        requestAnimationFrame(function () {
          el.classList.add('drawer-open');
        });
      } else {
        el.classList.add('drawer-open');
      }
    },

    /** Close an off-canvas drawer. */
    close: function (targetId) {
      var el = document.querySelector('[data-drawer="' + targetId + '"]');
      if (!el) {
        warn('drawer.close: no element with data-drawer="' + targetId + '"');
        return;
      }

      el.classList.remove('drawer-open');
      document.body.removeAttribute('inert');

      var delay = prefersReducedMotion() ? 0 : 300;
      setTimeout(function () {
        el.setAttribute('hidden', '');
        el.setAttribute('aria-hidden', 'true');
      }, delay);

      var state = _drawerState[targetId];
      if (state) {
        if (state.keyHandler) document.removeEventListener('keydown', state.keyHandler);
        if (state.trigger && state.trigger.focus) state.trigger.focus();
        delete _drawerState[targetId];
      }
    },

    /** Toggle an off-canvas drawer open/closed. */
    toggle: function (targetId) {
      var el = document.querySelector('[data-drawer="' + targetId + '"]');
      if (!el) {
        warn('drawer.toggle: no element with data-drawer="' + targetId + '"');
        return;
      }
      if (el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') {
        drawer.open(targetId);
      } else {
        drawer.close(targetId);
      }
    },
  };

  // ─── validateForm ────────────────────────────────────────────────────────────

  /**
   * Validate a form element against HTML constraints + optional custom rules.
   * Renders inline valid/invalid/error/success states; sets aria-invalid / aria-describedby.
   * @param {HTMLFormElement} formEl
   * @param {{ rules?: Object }} opts — optional custom validators: { fieldName: fn(value) → string|null }
   * @returns {{ valid: boolean, errors: Object }}
   */
  function validateForm(formEl, opts) {
    opts = opts || {};
    var rules = opts.rules || {};
    var errors = {};
    var valid = true;

    var fields = formEl.querySelectorAll('input, textarea, select');
    Array.prototype.forEach.call(fields, function (field) {
      var name = field.name || field.id;
      if (!name) return;

      var fieldWrap = field.closest('.field') || field.parentElement;
      var errorEl = fieldWrap && fieldWrap.querySelector('.field-error');

      // reset state
      field.removeAttribute('aria-invalid');
      if (fieldWrap) {
        fieldWrap.classList.remove('is-valid', 'is-invalid', 'is-success');
      }
      if (errorEl) {
        errorEl.setAttribute('hidden', '');
        errorEl.textContent = '';
      }

      var msg = null;

      // HTML constraint validation
      if (!field.checkValidity()) {
        msg = field.validationMessage || 'هذا الحقل مطلوب.';
      }

      // custom rules (override built-in message if desired)
      if (rules[name]) {
        var customMsg = rules[name](field.value, field);
        if (customMsg) msg = customMsg;
      }

      if (msg) {
        valid = false;
        errors[name] = msg;
        field.setAttribute('aria-invalid', 'true');
        if (fieldWrap) fieldWrap.classList.add('is-invalid');
        if (errorEl) {
          errorEl.textContent = msg;
          errorEl.removeAttribute('hidden');
          field.setAttribute('aria-describedby', errorEl.id || name + '-err');
        }
      } else if (field.value) {
        if (fieldWrap) fieldWrap.classList.add('is-valid');
      }
    });

    return { valid: valid, errors: errors };
  }

  // ─── copyToClipboard ─────────────────────────────────────────────────────────

  /**
   * Copy text to clipboard; show a success or error toast. Never uses browser dialogs.
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () {
          toast('تم النسخ بنجاح', { type: 'success', duration: 2500 });
          return true;
        },
        function () {
          toast('تعذّر النسخ، يرجى المحاولة يدويًا.', { type: 'error', duration: 4000 });
          return false;
        }
      );
    }
    // legacy fallback
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) {
        toast('تم النسخ بنجاح', { type: 'success', duration: 2500 });
      } else {
        toast('تعذّر النسخ، يرجى المحاولة يدويًا.', { type: 'error', duration: 4000 });
      }
      return Promise.resolve(ok);
    } catch (e) {
      toast('تعذّر النسخ، يرجى المحاولة يدويًا.', { type: 'error', duration: 4000 });
      return Promise.resolve(false);
    }
  }

  // ─── private helper ──────────────────────────────────────────────────────────

  function _escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ─── initialise #toast-root ───────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    _toastRoot = document.getElementById('toast-root');
  });

  // ─── export ──────────────────────────────────────────────────────────────────

  global.TUI = {
    toast: toast,
    modal: modal,
    drawer: drawer,
    validateForm: validateForm,
    copyToClipboard: copyToClipboard,
    prefersReducedMotion: prefersReducedMotion,
  };
})(window);
