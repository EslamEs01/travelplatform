/**
 * member.js — Member layer enhancements (login, register, saved-deals, price-alerts, profile)
 * Additive IIFE; dispatched by <html data-page>. Does NOT modify main.js/ui.js/discovery.js/content.js.
 * State: frontend/session-only — reload restores mock defaults. No real auth/session/server.
 */
(function (global) {
  'use strict';

  var TUI = global.TUI;

  // ─── Shared helpers ───────────────────────────────────────────────────────

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Announce a message to screen readers via an aria-live region. */
  function announce(msg) {
    var live = document.getElementById('member-live');
    if (!live) {
      live = document.createElement('div');
      live.id = 'member-live';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      live.className = 'sr-only';
      document.body.appendChild(live);
    }
    live.textContent = '';
    requestAnimationFrame(function () { live.textContent = msg; });
  }

  /**
   * Wire a password-visibility toggle button to its sibling input.
   * @param {HTMLButtonElement} btn — carries data-toggle-pw="#fieldId"
   */
  function wirePasswordToggle(btn) {
    var targetSel = btn.getAttribute('data-toggle-pw');
    var input = targetSel ? document.querySelector(targetSel) : null;
    if (!input) return;

    btn.setAttribute('aria-pressed', 'false');

    btn.addEventListener('click', function () {
      var shown = input.type === 'text';
      input.type = shown ? 'password' : 'text';
      btn.setAttribute('aria-pressed', shown ? 'false' : 'true');
      btn.setAttribute('aria-label', shown ? 'إظهار كلمة المرور' : 'إخفاء كلمة المرور');
    });
  }

  /**
   * Wrap a form's submit with TUI.validateForm + a frontend-only success path.
   * @param {HTMLFormElement} form
   * @param {Object} rules — TUI.validateForm rules object
   * @param {Function} onValid — called when form is valid
   */
  function handleFormSubmit(form, rules, onValid) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var result = TUI.validateForm(form, { rules: rules });
      if (result.valid) {
        onValid(form);
      }
    });
  }

  /** Show inline-success block and optionally navigate after a delay. */
  function showSuccess(form, msg, href, delay) {
    var successBlock = form.querySelector('[data-frontend-success]') ||
      form.parentElement && form.parentElement.querySelector('[data-frontend-success]');
    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (TUI && TUI.toast) {
      TUI.toast(msg || 'تمت العملية بنجاح', { type: 'success' });
    }

    if (successBlock) {
      successBlock.hidden = false;
      successBlock.setAttribute('tabindex', '-1');
      setTimeout(function () { successBlock.focus(); }, 50);
    }

    if (href) {
      setTimeout(function () {
        global.location.href = href;
      }, delay || 2000);
    }
  }

  // ─── Page: login ──────────────────────────────────────────────────────────

  function initLogin() {
    // Password visibility
    document.querySelectorAll('[data-toggle-pw]').forEach(function (btn) {
      wirePasswordToggle(btn);
    });

    // Login form — member.js owns the success path (navigate to saved-deals)
    var loginForm = document.getElementById('login-form');
    if (loginForm) {
      handleFormSubmit(loginForm, {}, function (form) {
        showSuccess(form, 'تم تسجيل الدخول بنجاح (واجهة أمامية فقط)', 'saved-deals.html', 2000);
      });
    }

    // Forgot-password modal is wired by data-frontend-form in main.js (simple form).
    // Social-login placeholders are disabled or carry data-toast.
  }

  // ─── Page: register ───────────────────────────────────────────────────────

  function initRegister() {
    document.querySelectorAll('[data-toggle-pw]').forEach(function (btn) {
      wirePasswordToggle(btn);
    });

    var regForm = document.getElementById('register-form');
    if (!regForm) return;

    var pwInput = regForm.querySelector('#reg-password');
    var pwConfirm = regForm.querySelector('#reg-confirm-password');

    handleFormSubmit(regForm, {
      'reg-password': function (val) {
        return val.length < 8 ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' : null;
      },
      'reg-confirm-password': function (val) {
        var pw = pwInput ? pwInput.value : '';
        return val !== pw ? 'كلمات المرور غير متطابقة' : null;
      },
      'terms': function (val, field) {
        return !field.checked ? 'يجب الموافقة على الشروط والأحكام' : null;
      }
    }, function (form) {
      showSuccess(form, 'تم إنشاء الحساب بنجاح (واجهة أمامية فقط)', 'saved-deals.html', 2000);
    });

    // Live password strength hint
    if (pwInput) {
      pwInput.addEventListener('input', function () {
        var rulesPanel = document.getElementById('password-rules');
        if (!rulesPanel) return;
        var minOk = pwInput.value.length >= 8;
        var minEl = rulesPanel.querySelector('[data-rule="min"]');
        if (minEl) minEl.classList.toggle('text-green-600', minOk);
      });
    }
  }

  // ─── Page: saved-deals ────────────────────────────────────────────────────

  function initSavedDeals() {
    initTabs();
    initSavedItemRemove();
    initMockRestore();
  }

  function initTabs() {
    var tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute('aria-controls'));
    });

    function activateTab(idx) {
      tabs.forEach(function (t, i) {
        var active = i === idx;
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.setAttribute('tabindex', active ? '0' : '-1');
        if (panels[i]) panels[i].hidden = !active;
      });
      announce(tabs[idx].textContent.trim() + ' – تم التحديد');
    }

    tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function () { activateTab(idx); });
      tab.addEventListener('keydown', function (e) {
        var next = idx;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = (idx - 1 + tabs.length) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = (idx + 1) % tabs.length;
        if (next !== idx) { activateTab(next); tabs[next].focus(); }
      });
    });
  }

  function initSavedItemRemove() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove-saved]');
      if (!btn) return;

      var item = btn.closest('[data-saved-item]');
      var type = item && item.getAttribute('data-saved-type');
      if (!item) return;

      var panel = item.closest('[role="tabpanel"]');
      item.remove();

      updateSavedStat(type);
      checkEmptyState(panel);

      if (TUI && TUI.toast) {
        TUI.toast('تمت إزالة العنصر من المحفوظات', { type: 'success' });
      }
      announce('تمت إزالة العنصر من المحفوظات');
    });
  }

  function updateSavedStat(type) {
    var typeMap = { deal: 'deals', coupon: 'coupons', destination: 'destinations' };
    var key = typeMap[type];
    if (!key) return;
    var statEl = document.querySelector('[data-stat="saved-' + key + '"]');
    if (!statEl) return;
    var n = parseInt(statEl.textContent, 10);
    if (!isNaN(n) && n > 0) statEl.textContent = n - 1;
  }

  function checkEmptyState(panel) {
    if (!panel) return;
    var remaining = panel.querySelectorAll('[data-saved-item]');
    var emptyState = panel.querySelector('.empty-state');
    if (emptyState) emptyState.hidden = remaining.length > 0;
  }

  function initMockRestore() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-mock-restore]');
      if (!btn) return;
      var panel = btn.closest('[role="tabpanel"]');
      if (!panel) return;

      var items = panel.querySelectorAll('[data-saved-item]');
      var emptyState = panel.querySelector('.empty-state');
      // Re-show hidden items (if they were just hidden vs removed)
      // Since we remove from DOM, signal via toast; full restore requires reload
      if (TUI && TUI.toast) {
        TUI.toast('لإعادة جميع العناصر الافتراضية، يرجى إعادة تحميل الصفحة', { type: 'info', duration: 5000 });
      }
    });
  }

  // ─── Page: price-alerts ───────────────────────────────────────────────────

  var _pendingDeleteId = null;
  var _pendingEditCard = null;
  var _alertCounter = 100;

  function initPriceAlerts() {
    initAlertTypeToggle();
    initNotifyMethodToggle();
    initCreateAlertForm();
    initAlertCardActions();
    initEditAlertModal();
    initDeleteAlertModal();
    updateAlertStats();
  }

  var TYPE_LABELS_AR = {
    flight: 'طيران',
    hotel: 'فندق',
    package: 'باقة',
    destination: 'وجهة'
  };

  var STATUS_LABELS_AR = {
    active: 'نشط',
    paused: 'متوقف',
    triggered: 'مُفعَّل (نموذجي)'
  };

  function initAlertTypeToggle() {
    var typeSelect = document.getElementById('alert-type');
    if (!typeSelect) return;
    var fromGroup = document.getElementById('from-field-group');
    function toggle() {
      var isFlight = typeSelect.value === 'flight';
      if (fromGroup) {
        fromGroup.hidden = !isFlight;
        var fromInput = fromGroup.querySelector('input');
        if (fromInput) fromInput.required = isFlight;
      }
    }
    typeSelect.addEventListener('change', toggle);
    toggle();
  }

  function initNotifyMethodToggle() {
    var methodSelect = document.getElementById('notify-method');
    if (!methodSelect) return;
    var emailGroup = document.getElementById('notify-email-group');
    var phoneGroup = document.getElementById('notify-phone-group');

    function toggle() {
      var method = methodSelect.value;
      if (emailGroup) {
        emailGroup.hidden = method !== 'email';
        var emailInput = emailGroup.querySelector('input');
        if (emailInput) emailInput.required = method === 'email';
      }
      if (phoneGroup) {
        phoneGroup.hidden = method !== 'whatsapp';
        var phoneInput = phoneGroup.querySelector('input');
        if (phoneInput) phoneInput.required = method === 'whatsapp';
      }
    }
    methodSelect.addEventListener('change', toggle);
    toggle();
  }

  function initCreateAlertForm() {
    var form = document.getElementById('create-alert-form');
    if (!form) return;

    var typeSelect = document.getElementById('alert-type');
    var methodSelect = document.getElementById('notify-method');

    handleFormSubmit(form, {
      'alert-to': function (val) { return !val.trim() ? 'يرجى إدخال الوجهة' : null; },
      'alert-budget': function (val) { return (!val || isNaN(val) || Number(val) <= 0) ? 'يرجى إدخال ميزانية صحيحة' : null; },
      'alert-month': function (val) { return !val ? 'يرجى اختيار شهر السفر' : null; },
      'notify-email': function (val, field) {
        if (methodSelect && methodSelect.value === 'email' && !field.disabled) {
          return !val.trim() ? 'يرجى إدخال البريد الإلكتروني' : null;
        }
        return null;
      }
    }, function (form) {
      var toInput = form.querySelector('#alert-to');
      var destination = toInput ? toInput.value : 'وجهة جديدة';
      var type = typeSelect ? typeSelect.value : 'destination';
      var budgetInput = form.querySelector('#alert-budget');
      var budget = budgetInput ? budgetInput.value : '0';

      appendAlertCard({ id: 'alert-' + ++_alertCounter, type: type, destination: destination, maxBudget: Number(budget) });
      updateAlertStats();

      if (TUI && TUI.toast) {
        TUI.toast('تم إنشاء التنبيه بنجاح (واجهة أمامية فقط)', { type: 'success' });
      }
      var successBlock = form.querySelector('[data-frontend-success]');
      if (successBlock) {
        successBlock.hidden = false;
        successBlock.setAttribute('tabindex', '-1');
        setTimeout(function () { successBlock.focus(); }, 50);
      }
      form.reset();
      // re-run toggles after reset
      initAlertTypeToggle();
      initNotifyMethodToggle();
    });
  }

  function appendAlertCard(data) {
    var list = document.getElementById('alerts-list');
    if (!list) return;
    var emptyState = document.getElementById('alerts-empty');

    var typeLabel = TYPE_LABELS_AR[data.type] || data.type;
    var card = document.createElement('article');
    card.className = 'card p-5 space-y-3';
    card.setAttribute('data-alert', data.id);
    card.setAttribute('data-alert-status', 'active');
    card.setAttribute('data-alert-type', data.type);
    card.innerHTML =
      '<div class="flex items-start justify-between gap-3">' +
      '  <div>' +
      '    <span class="badge badge-source-partner text-xs me-2">' + _escHtml(typeLabel) + '</span>' +
      '    <span class="badge badge-active text-xs">نشط</span>' +
      '  </div>' +
      '  <div class="flex gap-2">' +
      '    <button type="button" class="btn btn-ghost btn-sm" data-edit-alert="' + _escHtml(data.id) + '" aria-label="تعديل التنبيه">تعديل</button>' +
      '    <button type="button" class="btn btn-ghost btn-sm" data-pause-alert="' + _escHtml(data.id) + '" aria-label="إيقاف التنبيه">إيقاف</button>' +
      '    <button type="button" class="btn btn-ghost btn-sm text-red-600" data-delete-alert="' + _escHtml(data.id) + '" aria-label="حذف التنبيه">حذف</button>' +
      '  </div>' +
      '</div>' +
      '<h3 class="font-semibold text-ink-700">' + _escHtml(data.destination) + '</h3>' +
      '<p class="text-sm text-ink-400">الميزانية المستهدفة: <strong class="text-lagoon-600">' + _escHtml(String(data.maxBudget)) + ' ر.س</strong></p>' +
      '<p class="text-xs text-amber-600 font-medium">مثال توضيحي — لا رصد حقيقي للأسعار في هذه النسخة</p>';
    list.insertBefore(card, list.firstChild);

    if (emptyState) emptyState.hidden = true;
  }

  function initAlertCardActions() {
    var list = document.getElementById('alerts-list');
    if (!list) return;

    list.addEventListener('click', function (e) {
      var editBtn = e.target.closest('[data-edit-alert]');
      var pauseBtn = e.target.closest('[data-pause-alert]');
      var deleteBtn = e.target.closest('[data-delete-alert]');

      if (editBtn) {
        _pendingEditCard = editBtn.closest('[data-alert]');
        prefillEditModal(_pendingEditCard);
        if (TUI && TUI.modal) TUI.modal.open('edit-alert');
        return;
      }

      if (pauseBtn) {
        var card = pauseBtn.closest('[data-alert]');
        toggleAlertPause(card);
        return;
      }

      if (deleteBtn) {
        _pendingDeleteId = deleteBtn.getAttribute('data-delete-alert');
        var delCard = deleteBtn.closest('[data-alert]');
        _pendingEditCard = delCard;
        if (TUI && TUI.modal) TUI.modal.open('delete-alert');
        return;
      }
    });
  }

  function toggleAlertPause(card) {
    if (!card) return;
    var status = card.getAttribute('data-alert-status');
    var newStatus = status === 'paused' ? 'active' : 'paused';
    card.setAttribute('data-alert-status', newStatus);

    var badge = card.querySelector('.badge-active, .badge-paused');
    if (badge) {
      badge.textContent = newStatus === 'active' ? 'نشط' : 'متوقف';
      badge.className = badge.className.replace(/badge-(active|paused)/, 'badge-' + newStatus);
    }

    var pauseBtn = card.querySelector('[data-pause-alert]');
    if (pauseBtn) pauseBtn.textContent = newStatus === 'active' ? 'إيقاف' : 'تفعيل';

    updateAlertStats();
    if (TUI && TUI.toast) {
      TUI.toast(newStatus === 'active' ? 'تم تفعيل التنبيه' : 'تم إيقاف التنبيه مؤقتاً', { type: 'info' });
    }
    announce(newStatus === 'active' ? 'تم تفعيل التنبيه' : 'تم إيقاف التنبيه مؤقتاً');
  }

  function prefillEditModal(card) {
    if (!card) return;
    var modal = document.getElementById('edit-alert-modal');
    if (!modal) return;
    // Pre-fill destination
    var destInput = modal.querySelector('#edit-destination');
    var h3 = card.querySelector('h3');
    if (destInput && h3) destInput.value = h3.textContent.trim();
  }

  function initEditAlertModal() {
    var form = document.getElementById('edit-alert-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var result = TUI.validateForm(form, {});
      if (!result.valid) return;

      if (_pendingEditCard) {
        var destInput = form.querySelector('#edit-destination');
        var h3 = _pendingEditCard.querySelector('h3');
        if (destInput && h3) h3.textContent = destInput.value;

        var budgetInput = form.querySelector('#edit-budget');
        var budgetEl = _pendingEditCard.querySelector('strong');
        if (budgetInput && budgetEl) budgetEl.textContent = budgetInput.value + ' ر.س';
      }

      if (TUI && TUI.modal) TUI.modal.close('edit-alert');
      if (TUI && TUI.toast) TUI.toast('تم حفظ التعديلات (واجهة أمامية فقط)', { type: 'success' });
      _pendingEditCard = null;
    });

    var cancelBtn = document.querySelector('[data-close-edit-modal]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        if (TUI && TUI.modal) TUI.modal.close('edit-alert');
      });
    }
  }

  function initDeleteAlertModal() {
    var confirmBtn = document.getElementById('delete-alert-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        if (_pendingEditCard) {
          var list = document.getElementById('alerts-list');
          _pendingEditCard.remove();
          _pendingEditCard = null;

          updateAlertStats();
          if (list && list.querySelectorAll('[data-alert]').length === 0) {
            var emptyState = document.getElementById('alerts-empty');
            if (emptyState) emptyState.hidden = false;
          }
        }
        if (TUI && TUI.modal) TUI.modal.close('delete-alert');
        if (TUI && TUI.toast) TUI.toast('تم حذف التنبيه', { type: 'info' });
        announce('تم حذف التنبيه');
      });
    }

    var cancelBtn = document.getElementById('delete-alert-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        if (TUI && TUI.modal) TUI.modal.close('delete-alert');
      });
    }
  }

  function updateAlertStats() {
    var cards = document.querySelectorAll('[data-alert]');
    var active = 0, paused = 0, triggered = 0;
    cards.forEach(function (card) {
      var status = card.getAttribute('data-alert-status');
      if (status === 'active') active++;
      else if (status === 'paused') paused++;
      else if (status === 'triggered') triggered++;
    });
    var activeEl = document.querySelector('[data-stat="active"]');
    var pausedEl = document.querySelector('[data-stat="paused"]');
    var triggeredEl = document.querySelector('[data-stat="triggered"]');
    if (activeEl) activeEl.textContent = active;
    if (pausedEl) pausedEl.textContent = paused;
    if (triggeredEl) triggeredEl.textContent = triggered;
  }

  // ─── Page: profile ────────────────────────────────────────────────────────

  function initProfile() {
    initProfileForms();
    initNotificationToggles();
    initChangePassword();
    initLogout();
  }

  function initProfileForms() {
    var personalForm = document.getElementById('personal-info-form');
    if (personalForm) {
      handleFormSubmit(personalForm, {}, function () {
        if (TUI && TUI.toast) TUI.toast('تم حفظ بيانات الملف الشخصي (واجهة أمامية فقط)', { type: 'success' });
      });
    }

    var prefsForm = document.getElementById('travel-prefs-form');
    if (prefsForm) {
      handleFormSubmit(prefsForm, {}, function () {
        if (TUI && TUI.toast) TUI.toast('تم حفظ تفضيلات السفر (واجهة أمامية فقط)', { type: 'success' });
      });
    }
  }

  function initNotificationToggles() {
    document.querySelectorAll('[data-notify-toggle]').forEach(function (toggle) {
      toggle.addEventListener('change', function () {
        var label = toggle.getAttribute('aria-label') || toggle.getAttribute('data-notify-toggle') || 'الإشعار';
        var msg = toggle.checked ? 'تم تفعيل: ' + label : 'تم إيقاف: ' + label;
        if (TUI && TUI.toast) TUI.toast(msg + ' (واجهة أمامية فقط)', { type: 'info' });
        announce(msg);
      });
    });
  }

  function initChangePassword() {
    var form = document.getElementById('change-password-form');
    if (!form) return;

    var newPw = form.querySelector('#new-password');
    var confirmPw = form.querySelector('#confirm-password');

    handleFormSubmit(form, {
      'new-password': function (val) {
        return val.length < 8 ? 'يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل' : null;
      },
      'confirm-password': function (val) {
        var pw = newPw ? newPw.value : '';
        return val !== pw ? 'كلمات المرور غير متطابقة' : null;
      }
    }, function (form) {
      if (TUI && TUI.toast) {
        TUI.toast('لم يتم تغيير أي كلمة مرور — واجهة أمامية تجريبية فقط', { type: 'info', duration: 6000 });
      }
      form.reset();
    });
  }

  function initLogout() {
    var logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', function () {
      if (TUI && TUI.toast) {
        TUI.toast('تم تسجيل الخروج (لا جلسة حقيقية في هذه النسخة)', { type: 'info', duration: 3000 });
      }
      setTimeout(function () {
        global.location.href = 'index.html';
      }, 1500);
    });
  }

  // ─── HTML-escape helper ───────────────────────────────────────────────────

  function _escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ─── Dispatch ─────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.documentElement.getAttribute('data-page');
    switch (page) {
      case 'login':        initLogin();        break;
      case 'register':     initRegister();     break;
      case 'saved-deals':  initSavedDeals();   break;
      case 'price-alerts': initPriceAlerts();  break;
      case 'profile':      initProfile();      break;
    }
  });

}(window));
