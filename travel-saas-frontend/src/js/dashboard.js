/**
 * dashboard.js — Merchant Dashboard enhancement module
 * Dispatch condition: <html data-page="merchant-dashboard">
 * Additive IIFE — does NOT modify main.js / ui.js / discovery.js / content.js / member.js.
 * No browser alert() / confirm() / prompt(). All state is frontend/session-only.
 */
(function (global) {
  'use strict';

  // ─── Guard: run on all merchant dashboard pages ─────────────────────────────
  var _DASH_PAGES = [
    'merchant-dashboard','merchant-deals','merchant-create-deal',
    'merchant-edit-deal','merchant-coupons','merchant-create-coupon',
    'merchant-analytics','merchant-integrations','merchant-settings'
  ];
  var _currentPage = document.documentElement.dataset && document.documentElement.dataset.page;
  if (!_currentPage || _DASH_PAGES.indexOf(_currentPage) === -1) {
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {

    // ─── Helpers ────────────────────────────────────────────────────────────

    var _prm = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function prefersReducedMotion() {
      return _prm;
    }

    /** Announce a message to screen readers via aria-live */
    var _announcer = document.getElementById('dash-announcer');
    function announce(msg) {
      if (!_announcer) return;
      _announcer.textContent = '';
      // Force reflow so repeated announcements fire
      void _announcer.offsetHeight;
      _announcer.textContent = msg;
    }

    function toast(msg, type) {
      if (global.TUI && TUI.toast) {
        TUI.toast(msg, { type: type || 'info', duration: 4000 });
      }
    }

    function comingSoonToast() {
      toast('هذه الصفحة قيد الإنشاء — قابل للربط لاحقاً', 'info');
    }

    // ─── Dropdown Controller ─────────────────────────────────────────────────
    /**
     * Generic ARIA dropdown: trigger + menu panel.
     * Handles toggle, aria-expanded, outside-click, Escape close, roving focus.
     */
    function DropdownController(triggerEl, menuEl) {
      if (!triggerEl || !menuEl) return;
      var self = this;
      self.trigger = triggerEl;
      self.menu = menuEl;
      self.isOpen = false;

      triggerEl.setAttribute('aria-expanded', 'false');
      if (!triggerEl.getAttribute('aria-controls')) {
        triggerEl.setAttribute('aria-controls', menuEl.id || '');
      }
      menuEl.setAttribute('aria-hidden', 'true');

      function open() {
        self.isOpen = true;
        triggerEl.setAttribute('aria-expanded', 'true');
        menuEl.removeAttribute('hidden');
        menuEl.setAttribute('aria-hidden', 'false');
        menuEl.classList.add('is-open');
        if (!prefersReducedMotion()) {
          menuEl.classList.add('dd-animate');
        }
        var firstItem = menuEl.querySelector('[role="menuitem"], a, button');
        if (firstItem) firstItem.focus();
      }

      function close() {
        self.isOpen = false;
        triggerEl.setAttribute('aria-expanded', 'false');
        menuEl.setAttribute('aria-hidden', 'true');
        menuEl.classList.remove('is-open', 'dd-animate');
        menuEl.setAttribute('hidden', '');
      }

      function toggle() {
        if (self.isOpen) { close(); } else { open(); }
      }

      triggerEl.addEventListener('click', function (e) {
        e.stopPropagation();
        // Close all other dropdowns first
        document.dispatchEvent(new CustomEvent('dash:dropdown-close-all', { detail: { except: self } }));
        toggle();
      });

      document.addEventListener('dash:dropdown-close-all', function (e) {
        if (e.detail && e.detail.except === self) return;
        close();
      });

      document.addEventListener('click', function (e) {
        if (!menuEl.contains(e.target) && e.target !== triggerEl) {
          if (self.isOpen) close();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && self.isOpen) {
          close();
          triggerEl.focus();
        }
      });

      // Roving focus within menu
      menuEl.addEventListener('keydown', function (e) {
        if (!self.isOpen) return;
        var items = Array.from(menuEl.querySelectorAll('[role="menuitem"], a, button'));
        if (!items.length) return;
        var idx = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[(idx + 1) % items.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[(idx - 1 + items.length) % items.length].focus();
        }
      });

      self.open = open;
      self.close = close;
      self.toggle = toggle;
    }

    // ─── Row Action Menu Controller ──────────────────────────────────────────
    /**
     * Manages per-row popup menus in the bookings table.
     * Only one open at a time; closes on outside click / Escape.
     */
    var _openRowMenu = null;

    function openRowMenu(menuEl, triggerEl) {
      if (_openRowMenu && _openRowMenu !== menuEl) {
        closeRowMenu(_openRowMenu);
      }
      menuEl.classList.add('is-open');
      menuEl.removeAttribute('hidden');
      triggerEl.setAttribute('aria-expanded', 'true');
      var first = menuEl.querySelector('button, a');
      if (first) first.focus();
      _openRowMenu = menuEl;
    }

    function closeRowMenu(menuEl) {
      if (!menuEl) return;
      menuEl.classList.remove('is-open');
      menuEl.setAttribute('hidden', '');
      var trigger = document.querySelector('[aria-controls="' + menuEl.id + '"]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (_openRowMenu === menuEl) _openRowMenu = null;
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _openRowMenu) {
        closeRowMenu(_openRowMenu);
      }
    });

    document.addEventListener('click', function (e) {
      if (_openRowMenu && !_openRowMenu.contains(e.target)) {
        var trigger = document.querySelector('[aria-controls="' + _openRowMenu.id + '"]');
        if (trigger && trigger.contains(e.target)) return;
        closeRowMenu(_openRowMenu);
      }
    });

    // ─── Form Submit Wrapper (frontend-only) ─────────────────────────────────
    /**
     * TUI.validateForm wrapper: validates, shows inline errors, fires success callback.
     * No real server action. Extends window.TUI.validateForm if present.
     */
    function validateAndSubmit(form, rules, onSuccess) {
      if (!form) return false;
      var valid = true;
      var firstInvalid = null;

      // Clear previous errors
      form.querySelectorAll('.field-error').forEach(function (el) {
        el.textContent = '';
        el.hidden = true;
      });
      form.querySelectorAll('[aria-invalid]').forEach(function (el) {
        el.removeAttribute('aria-invalid');
      });

      Object.keys(rules || {}).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        var rule = rules[name];
        var val = field.value ? field.value.trim() : '';
        var errorEl = form.querySelector('[data-error-for="' + name + '"]');

        if (rule.required && !val) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          if (errorEl) { errorEl.textContent = rule.requiredMsg || 'هذا الحقل مطلوب'; errorEl.hidden = false; }
          if (!firstInvalid) firstInvalid = field;
        }
        if (rule.minLength && val.length > 0 && val.length < rule.minLength) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          if (errorEl) { errorEl.textContent = rule.minLengthMsg || 'الحد الأدنى ' + rule.minLength + ' أحرف'; errorEl.hidden = false; }
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        return false;
      }

      if (typeof onSuccess === 'function') onSuccess(form);
      return true;
    }

    // ─── Sidebar / Drawer ────────────────────────────────────────────────────

    var sidebarDrawer = document.getElementById('sidebar-drawer');
    var sidebarScrim  = document.getElementById('sidebar-scrim');
    var menuBtn       = document.getElementById('btn-mobile-menu');

    function openSidebar() {
      if (!sidebarDrawer) return;
      sidebarDrawer.classList.add('is-open');
      sidebarDrawer.removeAttribute('inert');
      if (sidebarScrim) {
        sidebarScrim.classList.add('is-visible');
        sidebarScrim.removeAttribute('hidden');
      }
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
      // Focus first link
      var first = sidebarDrawer.querySelector('a, button');
      if (first) first.focus();
      document.body.classList.add('sidebar-open');
      announce('القائمة الجانبية مفتوحة');
    }

    function closeSidebar() {
      if (!sidebarDrawer) return;
      sidebarDrawer.classList.remove('is-open');
      sidebarDrawer.setAttribute('inert', '');
      if (sidebarScrim) {
        sidebarScrim.classList.remove('is-visible');
        sidebarScrim.setAttribute('hidden', '');
      }
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
      document.body.classList.remove('sidebar-open');
      announce('القائمة الجانبية مغلقة');
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        if (sidebarDrawer && sidebarDrawer.classList.contains('is-open')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (sidebarScrim) {
      sidebarScrim.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebarDrawer && sidebarDrawer.classList.contains('is-open')) {
        closeSidebar();
      }
    });

    // ─── Topbar Dropdowns ────────────────────────────────────────────────────

    var _dropdowns = [];

    function initDropdown(triggerId, menuId) {
      var trigger = document.getElementById(triggerId);
      var menu    = document.getElementById(menuId);
      if (trigger && menu) {
        _dropdowns.push(new DropdownController(trigger, menu));
      }
    }

    initDropdown('btn-notifications', 'dropdown-notifications');
    initDropdown('btn-quick-add',     'dropdown-quick-add');
    initDropdown('btn-user-menu',     'dropdown-user-menu');

    // ─── Global Search Mock ──────────────────────────────────────────────────

    var searchForm   = document.getElementById('topbar-search-form');
    var searchInput  = document.getElementById('topbar-search-input');

    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = searchInput ? searchInput.value.trim() : '';
        if (q) {
          toast('بحث تجريبي عن: «' + q + '» — واجهة أمامية فقط', 'info');
        } else {
          toast('أدخل كلمة للبحث', 'warning');
        }
        if (searchInput) { searchInput.value = ''; searchInput.blur(); }
      });
    }

    // ─── Logout ──────────────────────────────────────────────────────────────

    var logoutBtns = document.querySelectorAll('[data-action="logout"]');
    logoutBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        toast('تم تسجيل الخروج (واجهة أمامية فقط — لا حساب حقيقي)', 'success');
        setTimeout(function () {
          global.location.href = '../pages/index.html';
        }, 1800);
      });
    });

    // ─── Row Action Menus ────────────────────────────────────────────────────

    var rowActionTriggers = document.querySelectorAll('[data-row-action-trigger]');
    rowActionTriggers.forEach(function (trigger) {
      var menuId = trigger.getAttribute('aria-controls');
      if (!menuId) return;
      var menu = document.getElementById(menuId);
      if (!menu) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        if (menu.classList.contains('is-open')) {
          closeRowMenu(menu);
        } else {
          openRowMenu(menu, trigger);
        }
      });
    });

    // Row action button handlers
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-row-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-row-action');
      var row    = btn.closest('[data-booking-row]');

      // Close the menu
      var menu = btn.closest('.row-action-menu');
      if (menu) closeRowMenu(menu);

      if (action === 'change-status') {
        var modal = document.getElementById('modal-status-change');
        if (modal && row) {
          var ref  = row.dataset.bookingRef  || '';
          var stat = row.dataset.bookingStatus || '';
          var refInput  = modal.querySelector('[name="booking-ref"]');
          var statSel   = modal.querySelector('[name="new-status"]');
          if (refInput) refInput.value = ref;
          if (statSel && stat) statSel.value = stat;
          if (global.TUI && TUI.modal) TUI.modal.open('modal-status-change');
        }
      } else if (action === 'add-note') {
        var noteModal = document.getElementById('modal-add-note');
        if (noteModal && row) {
          var noteRef = row.dataset.bookingRef || '';
          var noteRefInput = noteModal.querySelector('[name="note-booking-ref"]');
          if (noteRefInput) noteRefInput.value = noteRef;
          if (global.TUI && TUI.modal) TUI.modal.open('modal-add-note');
        }
      } else if (action === 'contact') {
        var custName = row ? (row.querySelector('.booking-customer-name') || {}).textContent : '';
        toast('جارٍ التواصل مع ' + (custName || 'العميل') + ' — بيانات تجريبية، لا اتصال حقيقي', 'info');
      } else if (action === 'assign') {
        toast('تعيين مستخدم — واجهة أمامية فقط / قابل للربط لاحقاً', 'info');
      } else if (action === 'view-details') {
        comingSoonToast();
      }
    });

    // ─── Status Change Modal ─────────────────────────────────────────────────

    var statusForm = document.getElementById('form-status-change');
    if (statusForm) {
      statusForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = validateAndSubmit(statusForm, {
          'new-status': { required: true, requiredMsg: 'اختر الحالة الجديدة' }
        }, function (form) {
          var ref    = (form.elements['booking-ref']  || {}).value || '';
          var newStat = (form.elements['new-status']   || {}).value || '';

          // Optimistically update the row badge
          var row = document.querySelector('[data-booking-ref="' + ref + '"]');
          if (row) {
            var badge = row.querySelector('.booking-status-badge');
            if (badge && newStat) {
              var statMap = {
                'New': 'جديد', 'Contacted': 'تم التواصل', 'Pending Payment': 'بانتظار الدفع',
                'Confirmed': 'مؤكد', 'Cancelled': 'ملغى', 'Completed': 'مكتمل'
              };
              badge.textContent = statMap[newStat] || newStat;
              badge.className = 'badge booking-status-badge status-' + newStat.toLowerCase().replace(/\s+/g, '-');
              row.setAttribute('data-booking-status', newStat);
            }
          }
          if (global.TUI && TUI.modal) TUI.modal.close('modal-status-change');
          toast('تم تحديث حالة الطلب ' + ref + ' — واجهة أمامية فقط، لا تنفيذ حقيقي', 'success');
          announce('تم تحديث حالة الطلب ' + ref);
          form.reset();
        });
        return ok;
      });
    }

    // ─── Add Note Modal ──────────────────────────────────────────────────────

    var noteForm = document.getElementById('form-add-note');
    if (noteForm) {
      noteForm.addEventListener('submit', function (e) {
        e.preventDefault();
        validateAndSubmit(noteForm, {
          'note-text': { required: true, requiredMsg: 'الملاحظة مطلوبة', minLength: 5, minLengthMsg: 'الملاحظة قصيرة جداً' }
        }, function (form) {
          var ref = (form.elements['note-booking-ref'] || {}).value || '';
          if (global.TUI && TUI.modal) TUI.modal.close('modal-add-note');
          toast('تمت إضافة الملاحظة على الطلب ' + ref + ' — بيانات تجريبية فقط', 'success');
          announce('تمت إضافة الملاحظة');
          form.reset();
        });
      });
    }

    // ─── Onboarding Checklist ────────────────────────────────────────────────

    var onboardingContainer = document.getElementById('onboarding-checklist');

    function updateOnboardingProgress() {
      if (!onboardingContainer) return;
      var total    = onboardingContainer.querySelectorAll('[data-onboarding-item]').length;
      var done     = onboardingContainer.querySelectorAll('[data-onboarding-item].is-done').length;
      var progressBar  = document.getElementById('onboarding-progress-bar');
      var progressText = document.getElementById('onboarding-progress-text');
      var pct = total > 0 ? Math.round((done / total) * 100) : 0;
      if (progressBar) {
        progressBar.style.width = pct + '%';
        progressBar.setAttribute('aria-valuenow', done);
        progressBar.setAttribute('aria-valuemax', total);
      }
      if (progressText) {
        progressText.textContent = done + ' / ' + total + ' (' + pct + '%)';
      }
      announce('التقدم: ' + done + ' من ' + total + ' مهام مكتملة');
    }

    if (onboardingContainer) {
      onboardingContainer.addEventListener('change', function (e) {
        var checkbox = e.target.closest('[data-onboarding-item] input[type="checkbox"]');
        if (!checkbox) return;
        var item = checkbox.closest('[data-onboarding-item]');
        if (!item) return;
        var checked = checkbox.checked;
        item.classList.toggle('is-done', checked);
        checkbox.setAttribute('aria-checked', checked ? 'true' : 'false');
        updateOnboardingProgress();
        var label = item.querySelector('.onboarding-label');
        var msg = checked
          ? 'تم إتمام: ' + (label ? label.textContent : 'المهمة')
          : 'تم إلغاء: ' + (label ? label.textContent : 'المهمة');
        toast(msg + ' — واجهة أمامية فقط', checked ? 'success' : 'info');
      });
      // Initial progress
      updateOnboardingProgress();
    }

    // ─── Integration / Alert / Quick-Action Buttons ──────────────────────────

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-integration-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-integration-action');
      var name   = btn.closest('[data-integration-name]')
        ? btn.closest('[data-integration-name]').getAttribute('data-integration-name')
        : 'التكامل';
      if (action === 'coming-soon') {
        toast(name + ' — قابل للربط لاحقاً / لا يوجد تكامل مفعّل فعلياً', 'info');
      } else if (action === 'setup') {
        toast('إعداد ' + name + ' — قابل للربط لاحقاً', 'info');
      } else if (action === 'test') {
        toast('اختبار ' + name + ' — واجهة أمامية فقط', 'info');
      }
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-alert-action]');
      if (!btn) return;
      toast(btn.getAttribute('data-alert-msg') || 'إجراء تجريبي — قابل للربط لاحقاً', 'info');
    });

    // ─── Initialise ──────────────────────────────────────────────────────────

    // Remove inert from sidebar on desktop (lg+) and add on mobile
    function handleResize() {
      var isDesktop = global.matchMedia('(min-width: 1024px)').matches;
      if (sidebarDrawer) {
        if (isDesktop) {
          sidebarDrawer.removeAttribute('inert');
          sidebarDrawer.classList.remove('is-open');
          if (sidebarScrim) { sidebarScrim.classList.remove('is-visible'); sidebarScrim.setAttribute('hidden', ''); }
          document.body.classList.remove('sidebar-open');
        } else {
          // On mobile default sidebar is closed/inert unless opened
          if (!sidebarDrawer.classList.contains('is-open')) {
            sidebarDrawer.setAttribute('inert', '');
          }
        }
      }
    }

    handleResize();
    var mq = global.matchMedia('(min-width: 1024px)');
    if (mq.addEventListener) {
      mq.addEventListener('change', handleResize);
    } else if (mq.addListener) {
      mq.addListener(handleResize);
    }

    // ─── Shared primitives (used by all new page controllers) ───────────────

    function slugify(str) {
      return (str || '').toLowerCase()
        .replace(/[\s_]+/g, '-')
        .replace(/[^؀-ۿ\w-]/g, '')
        .replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    }

    function generateCode(len) {
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      var out = '';
      for (var i = 0; i < (len || 8); i++) {
        out += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return out;
    }

    function confirmModal(modalId, onConfirm) {
      var modal = document.getElementById(modalId);
      if (!modal) { if (typeof onConfirm === 'function') onConfirm(); return; }
      if (global.TUI && TUI.modal) {
        TUI.modal.open(modalId);
        var confirmBtn = modal.querySelector('[data-modal-confirm]');
        if (confirmBtn) {
          var _h = function () {
            confirmBtn.removeEventListener('click', _h);
            TUI.modal.close(modalId);
            if (typeof onConfirm === 'function') onConfirm();
          };
          confirmBtn.addEventListener('click', _h);
        }
      }
    }

    function makeRepeater(listEl) {
      if (!listEl) return;
      listEl.addEventListener('click', function (e) {
        var removeBtn = e.target.closest('[data-repeater-remove]');
        if (removeBtn) {
          var item = removeBtn.closest('[data-repeater-item]');
          if (item && listEl.querySelectorAll('[data-repeater-item]').length > 1) {
            item.remove();
          } else {
            toast('يجب الإبقاء على عنصر واحد على الأقل', 'warning');
          }
          return;
        }
        var addBtn = e.target.closest('[data-repeater-add]');
        if (addBtn) {
          var items = listEl.querySelectorAll('[data-repeater-item]');
          if (!items.length) return;
          var clone = items[items.length - 1].cloneNode(true);
          clone.querySelectorAll('input, textarea').forEach(function (f) { f.value = ''; });
          listEl.appendChild(clone);
          var newInput = clone.querySelector('input, textarea');
          if (newInput) newInput.focus();
        }
      });
    }

    // ─── Page dispatch ───────────────────────────────────────────────────────
    if (_currentPage === 'merchant-deals')         { initMerchantDeals(); }
    if (_currentPage === 'merchant-create-deal')   { initMerchantCreateDeal(); }
    if (_currentPage === 'merchant-edit-deal')     { initMerchantEditDeal(); }
    if (_currentPage === 'merchant-coupons')       { initMerchantCoupons(); }
    if (_currentPage === 'merchant-create-coupon') { initMerchantCreateCoupon(); }
    if (_currentPage === 'merchant-analytics')     { initMerchantAnalytics(); }
    if (_currentPage === 'merchant-integrations')  { initMerchantIntegrations(); }
    if (_currentPage === 'merchant-settings')      { initMerchantSettings(); }

    // ─── merchant-deals controller (T012) ────────────────────────────────────
    function initMerchantDeals() {
      var rows       = Array.from(document.querySelectorAll('[data-deal-row]'));
      var tableWrap  = document.querySelector('.deals-table-wrap');
      var emptyState = document.getElementById('deals-empty-state');
      var countText  = document.getElementById('deals-result-count');
      var chipsBar   = document.getElementById('deals-chips-bar');
      var searchInp  = document.getElementById('deals-search');
      var sortSel    = document.getElementById('deals-sort');
      var filterForm = document.getElementById('deals-filter-form');

      var state = {
        search: '', status: '', destination: '', dealType: '',
        sourceType: '', expiryStatus: '', priceMin: '', priceMax: '',
        featuredOnly: false
      };

      var today = new Date(); today.setHours(0, 0, 0, 0);
      var in30  = new Date(today.getTime() + 30 * 86400000);

      function expiryCategory(dateStr) {
        if (!dateStr) return 'unknown';
        var d = new Date(dateStr);
        if (isNaN(d)) return 'unknown';
        if (d < today) return 'expired';
        if (d <= in30) return 'near';
        return 'active';
      }

      function matchesFilters(row) {
        var title    = (row.getAttribute('data-title')       || '').toLowerCase();
        var dest     = (row.getAttribute('data-destination') || '').toLowerCase();
        var prov     = (row.getAttribute('data-provider')    || '').toLowerCase();
        var rowStatus= (row.getAttribute('data-status')      || '').toLowerCase();
        var source   = (row.getAttribute('data-source')      || '').toLowerCase();
        var dtype    = (row.getAttribute('data-type')        || '').toLowerCase();
        var price    = parseFloat(row.getAttribute('data-price')    || '0');
        var featured = row.getAttribute('data-featured') === 'true';
        var expiry   = row.getAttribute('data-expiry') || '';

        if (state.search) {
          var q = state.search.toLowerCase();
          if (title.indexOf(q) === -1 && dest.indexOf(q) === -1 && prov.indexOf(q) === -1) return false;
        }
        if (state.status      && rowStatus !== state.status.toLowerCase()) return false;
        if (state.destination && dest.indexOf(state.destination.toLowerCase()) === -1) return false;
        if (state.dealType    && dtype !== state.dealType.toLowerCase()) return false;
        if (state.sourceType  && source !== state.sourceType.toLowerCase()) return false;
        if (state.priceMin    && !isNaN(parseFloat(state.priceMin)) && price < parseFloat(state.priceMin)) return false;
        if (state.priceMax    && !isNaN(parseFloat(state.priceMax)) && price > parseFloat(state.priceMax)) return false;
        if (state.featuredOnly && !featured) return false;
        if (state.expiryStatus) {
          var cat = expiryCategory(expiry);
          if (state.expiryStatus === 'near'    && cat !== 'near')    return false;
          if (state.expiryStatus === 'expired' && cat !== 'expired') return false;
          if (state.expiryStatus === 'active'  && cat !== 'active')  return false;
        }
        return true;
      }

      function compareRows(a, b) {
        var sortKey = sortSel ? sortSel.value : 'updated-desc';
        switch (sortKey) {
          case 'price-asc':
            return parseFloat(a.getAttribute('data-price')||0) - parseFloat(b.getAttribute('data-price')||0);
          case 'price-desc':
            return parseFloat(b.getAttribute('data-price')||0) - parseFloat(a.getAttribute('data-price')||0);
          case 'clicks-desc':
            return parseInt(b.getAttribute('data-clicks')||0) - parseInt(a.getAttribute('data-clicks')||0);
          case 'inquiries-desc':
            return parseInt(b.getAttribute('data-inquiries')||0) - parseInt(a.getAttribute('data-inquiries')||0);
          case 'expiry-asc': {
            var da = new Date(a.getAttribute('data-expiry')||'2099-12-31');
            var db = new Date(b.getAttribute('data-expiry')||'2099-12-31');
            return da - db;
          }
          default: {
            var ua = new Date(a.getAttribute('data-updated')||'2000-01-01');
            var ub = new Date(b.getAttribute('data-updated')||'2000-01-01');
            return ub - ua;
          }
        }
      }

      var CHIP_LABELS = {
        status: 'الحالة', destination: 'الوجهة', dealType: 'النوع',
        sourceType: 'المصدر', expiryStatus: 'الانتهاء',
        priceMin: 'الحد الأدنى', priceMax: 'الحد الأقصى',
        featuredOnly: 'المميزة فقط', search: 'البحث'
      };

      function renderChips() {
        if (!chipsBar) return;
        chipsBar.innerHTML = '';
        var keys = Object.keys(state);
        keys.forEach(function (key) {
          var val = state[key];
          if (!val) return;
          var label = CHIP_LABELS[key] || key;
          if (key !== 'featuredOnly') label += ': ' + val;
          var el = document.createElement('button');
          el.type = 'button';
          el.className = 'filter-chip';
          el.setAttribute('aria-label', 'إزالة فلتر ' + label);
          el.dataset.chipKey = key;
          el.innerHTML = '<span>' + label + '</span><span aria-hidden="true" class="chip-x">×</span>';
          chipsBar.appendChild(el);
        });
      }

      function applyAndRender() {
        var sorted = rows.slice().sort(compareRows);
        var tbody = rows.length ? rows[0].parentNode : null;
        var visible = 0;

        sorted.forEach(function (row) {
          var show = matchesFilters(row);
          row.style.display = show ? '' : 'none';
          if (show) visible++;
        });

        if (tbody) sorted.forEach(function (row) { tbody.appendChild(row); });

        if (countText) {
          countText.textContent = 'عرض ' + visible + ' من ' + rows.length + ' عرض';
        }
        announce('عرض ' + visible + ' عرض من أصل ' + rows.length);

        if (emptyState) emptyState.hidden = (visible > 0);
        if (tableWrap)  tableWrap.classList.toggle('table-empty', visible === 0);

        renderChips();
      }

      function resetFilters() {
        state = {
          search: '', status: '', destination: '', dealType: '',
          sourceType: '', expiryStatus: '', priceMin: '', priceMax: '',
          featuredOnly: false
        };
        if (searchInp)  searchInp.value = '';
        if (sortSel && sortSel.options.length) sortSel.value = sortSel.options[0].value;
        if (filterForm) filterForm.reset();
        applyAndRender();
      }

      if (searchInp) {
        searchInp.addEventListener('input', function () {
          state.search = this.value.trim();
          applyAndRender();
        });
      }

      if (filterForm) {
        filterForm.addEventListener('change', function (e) {
          var el = e.target, name = el.name || '';
          if (name === 'filter-status')      state.status = el.value;
          if (name === 'filter-destination') state.destination = el.value;
          if (name === 'filter-type')        state.dealType = el.value;
          if (name === 'filter-source')      state.sourceType = el.value;
          if (name === 'filter-expiry')      state.expiryStatus = el.value;
          if (name === 'filter-price-min')   state.priceMin = el.value;
          if (name === 'filter-price-max')   state.priceMax = el.value;
          if (name === 'filter-featured')    state.featuredOnly = el.checked;
          applyAndRender();
        });
      }

      if (sortSel) sortSel.addEventListener('change', applyAndRender);

      if (chipsBar) {
        chipsBar.addEventListener('click', function (e) {
          var chip = e.target.closest('[data-chip-key]');
          if (!chip) return;
          var key = chip.dataset.chipKey;
          if (key === 'featuredOnly') state.featuredOnly = false;
          else state[key] = '';
          var fieldNames = {
            status: 'filter-status', destination: 'filter-destination',
            dealType: 'filter-type', sourceType: 'filter-source',
            expiryStatus: 'filter-expiry', priceMin: 'filter-price-min',
            priceMax: 'filter-price-max', featuredOnly: 'filter-featured'
          };
          var fn = fieldNames[key];
          if (fn) {
            var field = (filterForm && filterForm.elements[fn]) || document.getElementById(fn);
            if (field) { if (field.type === 'checkbox') field.checked = false; else field.value = ''; }
          }
          if (key === 'search' && searchInp) searchInp.value = '';
          applyAndRender();
        });
      }

      document.querySelectorAll('[data-deals-reset]').forEach(function (btn) {
        btn.addEventListener('click', resetFilters);
      });

      // Toast on export/import buttons
      document.querySelectorAll('[data-deals-toast]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          toast(this.getAttribute('data-deals-toast') || 'إجراء تجريبي — واجهة أمامية فقط', 'info');
        });
      });

      applyAndRender();

      // ─── T014: Row menus + row/bulk actions ─────────────────────────────────

      // Populate row action menus (same 7 items per row, deal-id injected)
      rows.forEach(function (row) {
        var id = row.getAttribute('data-id') || '';
        var menuEl = document.getElementById('row-menu-' + id);
        if (!menuEl) return;
        var eyeSvg   = '<svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        var editSvg  = '<svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
        var dupSvg   = '<svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
        var pauseSvg = '<svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        var starSvg  = '<svg width="14" height="14" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
        var archSvg  = '<svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>';
        var trashSvg = '<svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>';
        menuEl.innerHTML =
          '<a href="../pages/deal-details.html?id=' + id + '" role="menuitem" class="rmi" data-row-action="view" data-deal-id="' + id + '">' + eyeSvg + ' عرض الصفحة العامة</a>' +
          '<a href="edit-deal.html?id=' + id + '" role="menuitem" class="rmi" data-row-action="edit" data-deal-id="' + id + '">' + editSvg + ' تعديل</a>' +
          '<button type="button" role="menuitem" class="rmi" data-row-action="duplicate" data-deal-id="' + id + '">' + dupSvg + ' تكرار العرض</button>' +
          '<button type="button" role="menuitem" class="rmi" data-row-action="toggle-pause" data-deal-id="' + id + '">' + pauseSvg + ' إيقاف / تفعيل</button>' +
          '<button type="button" role="menuitem" class="rmi" data-row-action="toggle-featured" data-deal-id="' + id + '">' + starSvg + ' تمييز / إلغاء التمييز</button>' +
          '<div class="row-menu-sep" role="separator"></div>' +
          '<button type="button" role="menuitem" class="rmi" data-row-action="archive" data-deal-id="' + id + '">' + archSvg + ' أرشفة</button>' +
          '<button type="button" role="menuitem" class="rmi is-danger" data-row-action="delete" data-deal-id="' + id + '">' + trashSvg + ' حذف</button>';
      });

      // Simple modal open/close (no TUI.modal dependency for deals)
      function openDealModal(modalId, onConfirm) {
        var overlay = document.getElementById(modalId);
        if (!overlay) { if (typeof onConfirm === 'function') onConfirm(); return; }
        overlay.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        var confirmBtn = overlay.querySelector('[data-modal-confirm]');
        var cancelBtns = overlay.querySelectorAll('[data-modal-cancel]');
        function closeModal() {
          overlay.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
        function doConfirm() { cleanUp(); closeModal(); if (typeof onConfirm === 'function') onConfirm(); }
        function doCancel()  { cleanUp(); closeModal(); }
        function onKey(e) { if (e.key === 'Escape') { cleanUp(); closeModal(); } }
        function onBg(e) { if (e.target === overlay) { cleanUp(); closeModal(); } }
        function cleanUp() {
          if (confirmBtn) confirmBtn.removeEventListener('click', doConfirm);
          cancelBtns.forEach(function (b) { b.removeEventListener('click', doCancel); });
          document.removeEventListener('keydown', onKey);
          overlay.removeEventListener('click', onBg);
        }
        if (confirmBtn) confirmBtn.addEventListener('click', doConfirm);
        cancelBtns.forEach(function (b) { b.addEventListener('click', doCancel); });
        document.addEventListener('keydown', onKey);
        overlay.addEventListener('click', onBg);
        var focusEl = overlay.querySelector('[data-modal-cancel], [data-modal-confirm]');
        if (focusEl) setTimeout(function () { focusEl.focus(); }, 40);
      }

      // Bulk selection
      var bulkBar       = document.getElementById('deals-bulk-bar');
      var bulkCountEl   = document.getElementById('deals-bulk-count');
      var selectAllCb   = document.getElementById('deals-select-all');

      function getCheckedRows() {
        return rows.filter(function (r) {
          var cb = r.querySelector('.deal-row-cb');
          return cb && cb.checked && r.style.display !== 'none';
        });
      }

      function updateBulkBar() {
        var checked = getCheckedRows();
        var n = checked.length;
        if (bulkCountEl) bulkCountEl.textContent = n + ' عرض محدد';
        if (bulkBar)     bulkBar.classList.toggle('is-visible', n > 0);
        if (selectAllCb) {
          var visible = rows.filter(function (r) { return r.style.display !== 'none'; });
          selectAllCb.checked       = visible.length > 0 && n === visible.length;
          selectAllCb.indeterminate = n > 0 && n < visible.length;
        }
        announce(n > 0 ? n + ' عرض محدد' : 'لا توجد عروض محددة');
      }

      if (selectAllCb) {
        selectAllCb.addEventListener('change', function () {
          rows.filter(function (r) { return r.style.display !== 'none'; }).forEach(function (r) {
            var cb = r.querySelector('.deal-row-cb');
            if (cb) cb.checked = selectAllCb.checked;
          });
          updateBulkBar();
        });
      }

      document.addEventListener('change', function (e) {
        if (e.target.classList.contains('deal-row-cb')) updateBulkBar();
      });

      // Row action handler (deal-specific — delegates to deal rows only)
      document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-row-action][data-deal-id]');
        if (!btn) return;
        var action = btn.getAttribute('data-row-action');
        var dealId = btn.getAttribute('data-deal-id');
        var row = document.querySelector('[data-deal-row][data-id="' + dealId + '"]');
        var menu = btn.closest('.row-action-menu');
        if (menu) closeRowMenu(menu);

        if (action === 'view' || action === 'edit') return; // href handles navigation

        if (action === 'duplicate') {
          if (row) {
            var clone = row.cloneNode(true);
            var titleEl = clone.querySelector('.deal-title-main');
            if (titleEl) {
              var orig = titleEl.childNodes[0];
              if (orig && orig.nodeType === 3) {
                orig.textContent = orig.textContent.replace(' (نسخة تجريبية)', '') + ' (نسخة تجريبية)';
              } else {
                titleEl.textContent = titleEl.textContent.replace(' (نسخة تجريبية)', '') + ' (نسخة تجريبية)';
              }
            }
            var newId = dealId + '-copy';
            clone.setAttribute('data-id', newId);
            var cloneMenu = clone.querySelector('.row-action-menu');
            if (cloneMenu) { cloneMenu.id = 'row-menu-' + newId; cloneMenu.innerHTML = ''; }
            var trigger = clone.querySelector('[data-row-action-trigger]');
            if (trigger) { trigger.setAttribute('aria-controls', 'row-menu-' + newId); }
            var cbClone = clone.querySelector('.deal-row-cb');
            if (cbClone) cbClone.checked = false;
            row.parentNode.insertBefore(clone, row.nextSibling);
            rows.push(clone);
          }
          toast('تم تكرار العرض — نسخة تجريبية / session فقط', 'success');
          return;
        }

        if (action === 'toggle-pause') {
          if (!row) return;
          var cur = row.getAttribute('data-status');
          var nStatus = (cur === 'active') ? 'paused' : 'active';
          var nLabel  = (nStatus === 'active') ? 'نشط' : 'موقوف';
          var nClass  = (nStatus === 'active') ? 'badge-active' : 'badge-paused';
          var nDot    = (nStatus === 'active') ? '#15803D' : '#A16207';
          row.setAttribute('data-status', nStatus);
          var sbadge = row.querySelector('td[data-label="الحالة"] .badge');
          if (sbadge) {
            sbadge.className = 'badge ' + nClass;
            sbadge.innerHTML = '<span class="badge-dot" style="background:' + nDot + '"></span>' + nLabel;
          }
          toast((nStatus === 'active' ? 'تم تفعيل' : 'تم إيقاف') + ' العرض — إجراء تجريبي / session فقط', 'info');
          applyAndRender();
          return;
        }

        if (action === 'toggle-featured') {
          if (!row) return;
          var isFeat = row.getAttribute('data-featured') === 'true';
          row.setAttribute('data-featured', (!isFeat).toString());
          var tm = row.querySelector('.deal-title-main');
          if (isFeat) {
            var fb = tm && tm.querySelector('.badge-featured');
            if (fb) fb.remove();
          } else if (tm) {
            var nb = document.createElement('span');
            nb.className = 'badge badge-featured';
            nb.style.marginInlineStart = '.375rem';
            nb.textContent = '★ مميز';
            tm.appendChild(nb);
          }
          toast((isFeat ? 'تم إلغاء تمييز' : 'تم تمييز') + ' العرض — إجراء تجريبي', 'success');
          return;
        }

        if (action === 'archive') {
          openDealModal('modal-deal-archive', function () {
            if (row) {
              row.setAttribute('data-status', 'archived');
              var sb = row.querySelector('td[data-label="الحالة"] .badge');
              if (sb) { sb.className = 'badge badge-archived'; sb.innerHTML = '<span class="badge-dot" style="background:#7C3AED"></span>مؤرشف'; }
              row.style.opacity = '.6';
              applyAndRender();
            }
            toast('تمت أرشفة العرض — إجراء تجريبي / session فقط', 'info');
          });
          return;
        }

        if (action === 'delete') {
          openDealModal('modal-deal-delete', function () {
            if (row) {
              row.style.transition = 'opacity .25s, transform .25s';
              row.style.opacity = '0';
              row.style.transform = 'translateX(1rem)';
              setTimeout(function () {
                row.remove();
                rows = rows.filter(function (r) { return r !== row; });
                applyAndRender();
              }, 260);
            }
            toast('تم حذف العرض — إجراء تجريبي / session فقط', 'warning');
          });
          return;
        }
      });

      // Bulk action handler
      document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-bulk-action]');
        if (!btn) return;
        var action  = btn.getAttribute('data-bulk-action');
        var checked = getCheckedRows();
        if (!checked.length && action !== 'export') {
          toast('حدد عروضاً أولاً', 'warning');
          return;
        }

        function uncheckAll() {
          rows.forEach(function (r) { var cb = r.querySelector('.deal-row-cb'); if (cb) cb.checked = false; });
          if (selectAllCb) { selectAllCb.checked = false; selectAllCb.indeterminate = false; }
          updateBulkBar();
        }

        if (action === 'activate' || action === 'pause') {
          var nSt = (action === 'activate') ? 'active' : 'paused';
          var nLbl = (nSt === 'active') ? 'نشط' : 'موقوف';
          var nCls = (nSt === 'active') ? 'badge-active' : 'badge-paused';
          var nDotC = (nSt === 'active') ? '#15803D' : '#A16207';
          checked.forEach(function (r) {
            r.setAttribute('data-status', nSt);
            var b = r.querySelector('td[data-label="الحالة"] .badge');
            if (b) { b.className = 'badge ' + nCls; b.innerHTML = '<span class="badge-dot" style="background:' + nDotC + '"></span>' + nLbl; }
          });
          toast((nSt === 'active' ? 'تم تفعيل ' : 'تم إيقاف ') + checked.length + ' عروض — إجراء تجريبي', 'success');
          uncheckAll();
          applyAndRender();
          return;
        }

        if (action === 'archive') {
          openDealModal('modal-deal-archive', function () {
            checked.forEach(function (r) {
              r.setAttribute('data-status', 'archived');
              var b = r.querySelector('td[data-label="الحالة"] .badge');
              if (b) { b.className = 'badge badge-archived'; b.innerHTML = '<span class="badge-dot" style="background:#7C3AED"></span>مؤرشف'; }
              r.style.opacity = '.6';
            });
            toast('تمت أرشفة ' + checked.length + ' عروض — إجراء تجريبي', 'info');
            uncheckAll();
            applyAndRender();
          });
          return;
        }

        if (action === 'bulk-delete') {
          var bodyEl = document.getElementById('modal-bulk-delete-body');
          if (bodyEl) bodyEl.textContent = 'سيتم حذف ' + checked.length + ' عرض محدد. هذا الإجراء لا يمكن التراجع عنه — بيانات تجريبية فقط.';
          openDealModal('modal-deals-bulk-delete', function () {
            checked.forEach(function (r) {
              r.remove();
              rows = rows.filter(function (x) { return x !== r; });
            });
            toast('تم حذف ' + checked.length + ' عروض — إجراء تجريبي', 'warning');
            uncheckAll();
            applyAndRender();
          });
          return;
        }

        if (action === 'export') {
          toast('تصدير ' + checked.length + ' عروض — تجريبي / لا يُصدر ملف حقيقي', 'info');
          uncheckAll();
          return;
        }
      });

    }

  }); // end DOMContentLoaded

})(window);

// ─── T021: merchant-edit-deal controller ─────────────────────────────────────
function initMerchantEditDeal() {
  var form = document.getElementById('form-edit-deal');
  if (!form) return;

  // ── Load inline JSON + resolve ?id ────────────────────────────────────────
  var dataEl = document.getElementById('merchant-deals-data');
  var deals  = [];
  try { deals = JSON.parse(dataEl ? dataEl.textContent : '[]'); } catch(e) {}

  var urlId  = (new URLSearchParams(window.location.search)).get('id') || 'deal-001';
  var deal   = deals.filter(function(d){ return d.id === urlId; })[0];

  // Unknown id → fall back to static default (deal-001 already in HTML)
  if (deal && deal.id !== 'deal-001') {
    prefillEditForm(form, deal);
  } else if (!deal) {
    deal = deals.filter(function(d){ return d.id === 'deal-001'; })[0];
  }

  // Update header stats + links for whatever deal is shown
  var activeDeal = (deals.filter(function(d){ return d.id === urlId; })[0]) || deal;
  if (activeDeal) updateEditHeader(activeDeal);

  // ── Prefill helper ────────────────────────────────────────────────────────
  function prefillEditForm(f, d) {
    function setVal(name, val) {
      var el = f.elements[name];
      if (!el) return;
      if (el.type === 'checkbox') { el.checked = !!val; }
      else { el.value = val != null ? val : ''; }
    }
    setVal('title', d.title);
    setVal('dealType', d.dealType);
    setVal('destination', d.destination);
    setVal('country', d.country);
    setVal('city', d.city);
    setVal('region', d.region);
    setVal('shortDescription', d.shortDescription || '');
    setVal('priceBefore', d.priceBefore || '');
    setVal('priceFrom', d.priceFrom);
    setVal('currency', d.currency || 'ر.س');
    setVal('sourceType', d.sourceType);
    setVal('providerName', d.providerName);
    setVal('expiryDate', d.expiryDate);
    setVal('availability', d.availability);
    setVal('cancellation', d.cancellation || '');
    setVal('seoTitle', d.seoTitle || '');
    setVal('metaDescription', d.metaDescription || '');
    setVal('slug', d.slug || '');
    setVal('status', d.status || 'Draft');
    setVal('featured', d.featured);
    if (document.getElementById('slug-preview-val')) {
      document.getElementById('slug-preview-val').textContent = d.slug
        ? 'rihlaty.example.com/deals/' + d.slug
        : 'rihlaty.example.com/deals/...';
    }
    // Rebuild repeaters
    rebuildRepeater('highlights-list', d.highlights);
    rebuildRepeater('included-list', d.includedItems);
    rebuildRepeater('not-included-list', d.notIncludedItems);
  }

  function rebuildRepeater(listId, items) {
    var list = document.getElementById(listId);
    if (!list || !Array.isArray(items)) return;
    var existingItems = list.querySelectorAll('[data-repeater-item]');
    var addBtn = list.querySelector('[data-repeater-add]');
    existingItems.forEach(function(item){ item.remove(); });
    items.forEach(function(val) {
      var row = document.createElement('div');
      row.setAttribute('data-repeater-item', '');
      row.className = 'repeater-item';
      var inp = document.createElement('input');
      inp.type = 'text'; inp.className = 'field-input'; inp.dir = 'auto';
      inp.name = 'repeater-item'; inp.value = val;
      var btn = document.createElement('button');
      btn.type = 'button'; btn.setAttribute('data-repeater-remove', '');
      btn.className = 'repeater-remove'; btn.setAttribute('aria-label', 'حذف');
      btn.textContent = '×';
      row.appendChild(inp); row.appendChild(btn);
      list.insertBefore(row, addBtn || null);
    });
  }

  function updateEditHeader(d) {
    var refEl   = document.getElementById('edit-deal-ref');
    var badge   = document.getElementById('edit-status-badge');
    var sidebar = document.getElementById('sidebar-status-badge');
    var pubLink = document.getElementById('edit-public-preview-link');
    var sbPub   = document.getElementById('sidebar-public-link');
    var updEl   = document.getElementById('edit-last-updated');
    var byEl    = document.getElementById('edit-created-by');
    var clkEl   = document.getElementById('edit-clicks');
    var inqEl   = document.getElementById('edit-inquiries');

    if (refEl) refEl.textContent = d.id;
    if (updEl) updEl.textContent = d.lastUpdated || '—';
    if (byEl)  byEl.textContent  = d.createdBy   || '—';
    if (clkEl) clkEl.textContent = (d.clicks || 0).toLocaleString('ar');
    if (inqEl) inqEl.textContent = (d.inquiries || 0).toLocaleString('ar');

    var statusBadgeClass = {
      'Active':'badge-active','Draft':'badge-draft','Scheduled':'badge-scheduled',
      'Paused':'badge-paused','Expired':'badge-expired','Archived':'badge-archived'
    }[d.status] || 'badge-draft';
    var statusLabel = { 'Active':'نشط','Draft':'مسودة','Scheduled':'مجدول','Paused':'موقوف','Expired':'منتهي','Archived':'مؤرشف' }[d.status] || d.status;
    var dotColor = { 'Active':'#15803D','Draft':'#94A3B8','Scheduled':'#1D4ED8','Paused':'#A16207','Expired':'#DC2626','Archived':'#7C3AED' }[d.status] || '#94A3B8';
    [badge, sidebar].forEach(function(el){
      if (el) { el.className = 'badge ' + statusBadgeClass; el.innerHTML = '<span class="badge-dot" style="background:' + dotColor + '"></span>' + statusLabel; }
    });

    var url = d.publicUrl || ('../pages/deal-details.html?id=' + d.id);
    if (pubLink) pubLink.href = url;
    if (sbPub)   sbPub.href  = url;

    var toggleLbl = document.getElementById('toggle-pause-label');
    if (toggleLbl) toggleLbl.textContent = (d.status === 'Active') ? 'إيقاف مؤقت' : 'تفعيل';

    var editPreviewLink = document.getElementById('edit-preview-link');
    if (editPreviewLink) editPreviewLink.href = url;
  }

  // ── Shared interactions (same as create-deal) ─────────────────────────────
  var slugInp = form.elements['slug'];
  var slugPreview = document.getElementById('slug-preview-val');
  var slugEdited = !!(slugInp && slugInp.value);

  var titleInp = form.elements['title'];
  if (titleInp) {
    titleInp.addEventListener('input', function() {
      if (!slugEdited && slugInp) { slugInp.value = slugify(this.value); updateSlugPreview(); }
    });
  }
  if (slugInp) {
    slugInp.addEventListener('input', function() {
      slugEdited = !!this.value;
      this.value = slugify(this.value);
      updateSlugPreview();
    });
  }
  function updateSlugPreview() {
    if (slugPreview) slugPreview.textContent = slugInp && slugInp.value ? 'rihlaty.example.com/deals/' + slugInp.value : 'rihlaty.example.com/deals/...';
  }

  var srcSel = form.elements['sourceType'];
  var apiMsg = document.getElementById('source-api-msg');
  var scrapedMsg = document.getElementById('source-scraped-msg');
  function updateSourceConditionals() {
    var v = srcSel ? srcSel.value : '';
    if (apiMsg) apiMsg.hidden = (v !== 'API Ready');
    if (scrapedMsg) scrapedMsg.hidden = (v !== 'Scraped Pending Review');
  }
  if (srcSel) srcSel.addEventListener('change', updateSourceConditionals);
  updateSourceConditionals();

  var flexCb = form.elements['flexibleDates'];
  var flexWrap = document.getElementById('flexible-note-wrap');
  if (flexCb) flexCb.addEventListener('change', function(){ if (flexWrap) flexWrap.hidden = !this.checked; });

  var statusSel = form.elements['status'];
  var schedWrap = document.getElementById('schedule-date-wrap');
  if (statusSel) statusSel.addEventListener('change', function(){ if (schedWrap) schedWrap.hidden = (this.value !== 'Scheduled'); });

  makeRepeater(document.getElementById('highlights-list'));
  makeRepeater(document.getElementById('included-list'));
  makeRepeater(document.getElementById('not-included-list'));

  var coverInput = document.getElementById('deal-cover-image');
  var coverPrev  = document.getElementById('cover-preview');
  if (coverInput && coverPrev) {
    coverInput.addEventListener('change', function() {
      var file = this.files && this.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      var reader = new FileReader();
      reader.onload = function(e){ coverPrev.src = e.target.result; coverPrev.style.display = 'block'; };
      reader.readAsDataURL(file);
      toast('تمت المعاينة — لا يتم رفع ملفات حقيقية الآن', 'info');
    });
  }

  // ── Modal helper ──────────────────────────────────────────────────────────
  function openEditModal(modalId, onConfirm) {
    var overlay = document.getElementById(modalId);
    if (!overlay) { if (typeof onConfirm === 'function') onConfirm(); return; }
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    function close(){ overlay.setAttribute('hidden',''); document.body.style.overflow = ''; }
    function doConfirm(){ cleanup(); close(); if (typeof onConfirm === 'function') onConfirm(); }
    function doCancel(){ cleanup(); close(); }
    function onKey(e){ if (e.key === 'Escape'){ cleanup(); close(); } }
    function onBg(e){ if (e.target === overlay){ cleanup(); close(); } }
    function cleanup(){
      overlay.querySelectorAll('[data-modal-cancel]').forEach(function(b){ b.removeEventListener('click', doCancel); });
      var cb = overlay.querySelector('[data-modal-confirm]');
      if (cb) cb.removeEventListener('click', doConfirm);
      document.removeEventListener('keydown', onKey);
      overlay.removeEventListener('click', onBg);
    }
    overlay.querySelectorAll('[data-modal-cancel]').forEach(function(b){ b.addEventListener('click', doCancel); });
    var confirmBtn = overlay.querySelector('[data-modal-confirm]');
    if (confirmBtn) confirmBtn.addEventListener('click', doConfirm);
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', onBg);
    var focus = overlay.querySelector('[data-modal-cancel]');
    if (focus) setTimeout(function(){ focus.focus(); }, 40);
  }

  // ── Preview modal ─────────────────────────────────────────────────────────
  function openPreviewModal() {
    var title  = (form.elements['title'] && form.elements['title'].value) || '—';
    var dest   = (form.elements['destination'] && form.elements['destination'].value) || '—';
    var price  = (form.elements['priceFrom'] && form.elements['priceFrom'].value) || '';
    var pBefore= (form.elements['priceBefore'] && form.elements['priceBefore'].value) || '';
    var curr   = (form.elements['currency'] && form.elements['currency'].value) || 'ر.س';
    var src    = (form.elements['sourceType'] && form.elements['sourceType'].value) || '';
    var srcMap = { 'Manual Deal':'badge-source-manual','Partner Link':'badge-source-partner','Affiliate':'badge-source-affiliate','API Ready':'badge-source-api','Scraped Pending Review':'badge-source-scraped' };
    var el = function(id){ return document.getElementById(id); };
    if (el('edit-preview-title-val')) el('edit-preview-title-val').textContent = title;
    if (el('edit-preview-dest'))      el('edit-preview-dest').textContent      = dest;
    if (el('edit-preview-price'))     el('edit-preview-price').textContent     = price ? price + ' ' + curr : '—';
    if (el('edit-preview-price-before')) el('edit-preview-price-before').textContent = pBefore ? pBefore + ' ' + curr : '';
    if (el('edit-preview-source'))    el('edit-preview-source').innerHTML      = src ? '<span class="badge ' + (srcMap[src]||'badge-source-manual') + '">' + src + '</span>' : '';
    openEditModal('modal-edit-preview');
  }

  // ── Form submit + action wiring ───────────────────────────────────────────
  var validationRules = {
    'title':            { required: true, requiredMsg: 'عنوان العرض مطلوب' },
    'dealType':         { required: true, requiredMsg: 'نوع العرض مطلوب' },
    'destination':      { required: true, requiredMsg: 'الوجهة مطلوبة' },
    'shortDescription': { required: true, requiredMsg: 'الوصف المختصر مطلوب' },
    'priceFrom':        { required: true, requiredMsg: 'السعر الأساسي مطلوب' },
    'expiryDate':       { required: true, requiredMsg: 'تاريخ انتهاء العرض مطلوب' },
    'sourceType':       { required: true, requiredMsg: 'مصدر العرض مطلوب' }
  };

  function doSaveChanges() {
    var ok = validateAndSubmit(form, validationRules, function() {
      toast('تم حفظ التغييرات — إجراء تجريبي / session فقط / لا حفظ حقيقي', 'success');
    });
    if (!ok) toast('يرجى تصحيح الحقول المطلوبة أولاً', 'warning');
  }

  function doDraft() { toast('تم الحفظ كمسودة — إجراء تجريبي / session فقط', 'info'); }

  function doDuplicate() { toast('تم تكرار العرض — نسخة تجريبية / session فقط', 'success'); }

  function doPauseActivate() {
    var badge   = document.getElementById('edit-status-badge');
    var sidebar = document.getElementById('sidebar-status-badge');
    var btnLbl  = document.getElementById('toggle-pause-label');
    if (!badge) return;
    var isCurrActive = badge.classList.contains('badge-active');
    var nClass = isCurrActive ? 'badge-paused' : 'badge-active';
    var nLabel = isCurrActive ? 'موقوف' : 'نشط';
    var nDot   = isCurrActive ? '#A16207' : '#15803D';
    var inner  = '<span class="badge-dot" style="background:' + nDot + '"></span>' + nLabel;
    [badge, sidebar].forEach(function(el){ if (el) { el.className = 'badge ' + nClass; el.innerHTML = inner; } });
    if (btnLbl) btnLbl.textContent = isCurrActive ? 'تفعيل' : 'إيقاف مؤقت';
    toast((isCurrActive ? 'تم إيقاف' : 'تم تفعيل') + ' العرض — إجراء تجريبي', 'info');
  }

  function doArchive() {
    openEditModal('modal-edit-archive', function() {
      var badge = document.getElementById('edit-status-badge');
      var sb    = document.getElementById('sidebar-status-badge');
      var inner = '<span class="badge-dot" style="background:#7C3AED"></span>مؤرشف';
      [badge, sb].forEach(function(el){ if (el) { el.className = 'badge badge-archived'; el.innerHTML = inner; } });
      toast('تمت أرشفة العرض — إجراء تجريبي / session فقط', 'info');
    });
  }

  function doDelete() {
    openEditModal('modal-edit-delete', function() {
      toast('تم حذف العرض — إجراء تجريبي / session فقط', 'warning');
      setTimeout(function(){ window.location.href = 'deals.html'; }, 1500);
    });
  }

  form.addEventListener('submit', function(e){ e.preventDefault(); doSaveChanges(); });

  ['btn-save-changes-top','btn-save-changes-form','btn-save-changes-sidebar'].forEach(function(id){
    var b = document.getElementById(id); if (b) b.addEventListener('click', doSaveChanges);
  });
  ['btn-save-draft-top','btn-save-draft-form','btn-save-draft-sidebar'].forEach(function(id){
    var b = document.getElementById(id); if (b) b.addEventListener('click', doDraft);
  });
  ['btn-preview-top','btn-preview-form','btn-preview-sidebar'].forEach(function(id){
    var b = document.getElementById(id); if (b) b.addEventListener('click', openPreviewModal);
  });

  var dupBtn  = document.getElementById('btn-duplicate');
  var archBtn = document.getElementById('btn-archive');
  var delBtn  = document.getElementById('btn-delete');
  var togBtn  = document.getElementById('btn-toggle-pause');
  if (dupBtn)  dupBtn.addEventListener('click', doDuplicate);
  if (archBtn) archBtn.addEventListener('click', doArchive);
  if (delBtn)  delBtn.addEventListener('click', doDelete);
  if (togBtn)  togBtn.addEventListener('click', doPauseActivate);
}

// ─── T018: merchant-create-deal controller ───────────────────────────────────
function initMerchantCreateDeal() {
  var form         = document.getElementById('form-create-deal');
  if (!form) return;

  var titleInp     = form.elements['title'];
  var slugInp      = form.elements['slug'];
  var slugPreview  = document.getElementById('slug-preview-val');
  var sourceTypeSel= form.elements['sourceType'];
  var statusSel    = form.elements['status'];
  var flexCb       = form.elements['flexibleDates'];
  var flexNoteWrap = document.getElementById('flexible-note-wrap');
  var schedWrap    = document.getElementById('schedule-date-wrap');
  var apiMsg       = document.getElementById('source-api-msg');
  var scrapedMsg   = document.getElementById('source-scraped-msg');
  var coverInput   = document.getElementById('deal-cover-image');
  var coverPreview = document.getElementById('cover-preview');
  var fillBar      = document.getElementById('summary-fill');
  var missingEl    = document.getElementById('summary-missing');

  var REQUIRED_FIELDS = ['title','dealType','destination','shortDescription','priceFrom','expiryDate','sourceType'];

  // ── Slug auto-gen from title ──────────────────────────────────────────────
  var slugManuallyEdited = false;
  function updateSlugPreview() {
    var val = slugInp ? slugInp.value : '';
    if (slugPreview) {
      slugPreview.textContent = val ? 'rihlaty.example.com/deals/' + val : 'rihlaty.example.com/deals/...';
    }
  }
  if (titleInp) {
    titleInp.addEventListener('input', function () {
      if (!slugManuallyEdited && slugInp) {
        slugInp.value = slugify(this.value);
        updateSlugPreview();
      }
      updateSummary();
    });
  }
  if (slugInp) {
    slugInp.addEventListener('input', function () {
      slugManuallyEdited = !!this.value;
      this.value = slugify(this.value);
      updateSlugPreview();
    });
  }
  updateSlugPreview();

  // ── Source type conditionals ──────────────────────────────────────────────
  function updateSourceConditionals() {
    if (!sourceTypeSel) return;
    var v = sourceTypeSel.value;
    if (apiMsg)     apiMsg.hidden     = (v !== 'API Ready');
    if (scrapedMsg) scrapedMsg.hidden = (v !== 'Scraped Pending Review');
    updateSummary();
  }
  if (sourceTypeSel) sourceTypeSel.addEventListener('change', updateSourceConditionals);
  updateSourceConditionals();

  // ── Flexible dates conditional ────────────────────────────────────────────
  if (flexCb) {
    flexCb.addEventListener('change', function () {
      if (flexNoteWrap) flexNoteWrap.hidden = !this.checked;
    });
  }

  // ── Status = Scheduled → schedule date ───────────────────────────────────
  if (statusSel) {
    statusSel.addEventListener('change', function () {
      if (schedWrap) schedWrap.hidden = (this.value !== 'Scheduled');
    });
  }

  // ── Summary completion tracker ────────────────────────────────────────────
  function updateSummary() {
    var filled = REQUIRED_FIELDS.filter(function (name) {
      var el = form.elements[name];
      return el && el.value && el.value.trim();
    });
    var pct = Math.round((filled.length / REQUIRED_FIELDS.length) * 100);
    if (fillBar) fillBar.style.width = pct + '%';
    if (missingEl) {
      var missing = REQUIRED_FIELDS.length - filled.length;
      missingEl.innerHTML = missing === 0
        ? '<span style="color:#15803D">✓ جميع الحقول المطلوبة مكتملة</span>'
        : '<span style="color:#DC2626">' + missing + '</span> حقل مطلوب غير مكتمل';
    }
  }
  form.addEventListener('input',  updateSummary);
  form.addEventListener('change', updateSummary);
  updateSummary();

  // ── Repeaters ────────────────────────────────────────────────────────────
  makeRepeater(document.getElementById('highlights-list'));
  makeRepeater(document.getElementById('included-list'));
  makeRepeater(document.getElementById('not-included-list'));

  // ── Mock upload ───────────────────────────────────────────────────────────
  if (coverInput && coverPreview) {
    coverInput.addEventListener('change', function () {
      var file = this.files && this.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        toast('الملف المختار ليس صورة صالحة', 'warning');
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        coverPreview.src = e.target.result;
        coverPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
      toast('تمت المعاينة — لا يتم رفع ملفات حقيقية الآن', 'info');
    });
  }

  // ── Modal open helper ─────────────────────────────────────────────────────
  function openModal(modalId, onClose) {
    var overlay = document.getElementById(modalId);
    if (!overlay) return;
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    function close() { overlay.setAttribute('hidden',''); document.body.style.overflow = ''; if (typeof onClose === 'function') onClose(); }
    function onKey(e) { if (e.key === 'Escape') { cleanup(); close(); } }
    function onBg(e) { if (e.target === overlay) { cleanup(); close(); } }
    function cleanup() {
      overlay.querySelectorAll('[data-modal-cancel],[data-modal-close]').forEach(function(b){ b.removeEventListener('click', doClose); });
      document.removeEventListener('keydown', onKey);
      overlay.removeEventListener('click', onBg);
    }
    function doClose() { cleanup(); close(); }
    overlay.querySelectorAll('[data-modal-cancel],[data-modal-close]').forEach(function(b){ b.addEventListener('click', doClose); });
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', onBg);
    var focusEl = overlay.querySelector('[data-modal-cancel]');
    if (focusEl) setTimeout(function(){ focusEl.focus(); }, 40);
  }

  // ── Preview modal ─────────────────────────────────────────────────────────
  function openPreviewModal() {
    var title  = (form.elements['title'] && form.elements['title'].value) || 'العنوان غير مُدخل';
    var dest   = (form.elements['destination'] && form.elements['destination'].value) || '—';
    var price  = (form.elements['priceFrom'] && form.elements['priceFrom'].value) || '';
    var pBefore= (form.elements['priceBefore'] && form.elements['priceBefore'].value) || '';
    var curr   = (form.elements['currency'] && form.elements['currency'].value) || 'ر.س';
    var src    = (form.elements['sourceType'] && form.elements['sourceType'].value) || '';
    var srcMap = { 'Manual Deal':'badge-source-manual', 'Partner Link':'badge-source-partner', 'Affiliate':'badge-source-affiliate', 'API Ready':'badge-source-api', 'Scraped Pending Review':'badge-source-scraped' };
    var srcCls = srcMap[src] || 'badge-source-manual';
    var srcLbl = src || 'Manual Deal';

    var el = function(id){ return document.getElementById(id); };
    if (el('preview-title'))        el('preview-title').textContent = title;
    if (el('preview-destination'))  el('preview-destination').textContent = dest;
    if (el('preview-price'))        el('preview-price').textContent = price ? price + ' ' + curr : '—';
    if (el('preview-price-before')) el('preview-price-before').textContent = pBefore ? pBefore + ' ' + curr : '';
    if (el('preview-source-badge')) el('preview-source-badge').innerHTML = '<span class="badge ' + srcCls + '">' + srcLbl + '</span>';
    openModal('modal-deal-preview');
  }

  // ── Form validation + publish / draft ────────────────────────────────────
  var validationRules = {
    'title':            { required: true, requiredMsg: 'عنوان العرض مطلوب', minLength: 3, minLengthMsg: 'العنوان قصير جداً' },
    'dealType':         { required: true, requiredMsg: 'نوع العرض مطلوب' },
    'destination':      { required: true, requiredMsg: 'الوجهة مطلوبة' },
    'shortDescription': { required: true, requiredMsg: 'الوصف المختصر مطلوب' },
    'priceFrom':        { required: true, requiredMsg: 'السعر الأساسي مطلوب' },
    'expiryDate':       { required: true, requiredMsg: 'تاريخ انتهاء العرض مطلوب' },
    'sourceType':       { required: true, requiredMsg: 'مصدر العرض مطلوب' }
  };

  function doPublish() {
    var ok = validateAndSubmit(form, validationRules, function () {
      toast('تم النشر التجريبي — واجهة أمامية فقط / لا نشر حقيقي / لا حفظ على خادم', 'success');
    });
    if (!ok) toast('يرجى تصحيح الحقول المطلوبة أولاً', 'warning');
  }

  function doDraft() {
    toast('تم الحفظ كمسودة — إجراء تجريبي / session فقط', 'info');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    doPublish();
  });

  // Wire all publish / draft / preview buttons
  ['btn-publish-top','btn-publish-form','btn-publish-sidebar'].forEach(function(id){
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', doPublish);
  });
  ['btn-save-draft-top','btn-save-draft-form','btn-save-draft-sidebar'].forEach(function(id){
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', doDraft);
  });
  ['btn-preview-top','btn-preview-form','btn-preview-sidebar'].forEach(function(id){
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', openPreviewModal);
  });
}

// ─── T025: merchant-coupons controller ───────────────────────────────────────
function initMerchantCoupons() {
  var rows       = Array.from(document.querySelectorAll('[data-coupon-row]'));
  var tableWrap  = document.querySelector('.coupons-table-wrap');
  var emptyState = document.getElementById('coupons-empty-state');
  var countText  = document.getElementById('coupons-result-count');
  var chipsBar   = document.getElementById('coupons-chips-bar');
  var sortSel    = document.getElementById('coupons-sort');

  var state = {
    search: '', status: '', discountType: '',
    provider: '', sourceType: '', category: '',
    relatedDeal: '', expiryStatus: ''
  };

  var today = new Date(); today.setHours(0,0,0,0);
  var in30  = new Date(today.getTime() + 30 * 86400000);

  function toast(msg, type) {
    if (window.TUI && TUI.toast) TUI.toast(msg, { type: type || 'info', duration: 4000 });
  }

  function announce(msg) {
    var a = document.getElementById('dash-announcer');
    if (!a) return;
    a.textContent = '';
    void a.offsetHeight;
    a.textContent = msg;
  }

  function expiryCategory(dateStr) {
    if (!dateStr) return 'unknown';
    var d = new Date(dateStr);
    if (d < today) return 'expired';
    if (d <= in30) return 'near';
    return 'active';
  }

  function rowMatches(row) {
    var ds   = (row.dataset.status || '').toLowerCase();
    var dsrc = (row.dataset.source || '').toLowerCase();
    var ddt  = (row.dataset.discountType || '').toLowerCase();
    var dpv  = (row.dataset.provider || '').toLowerCase();
    var dcat = (row.dataset.category || '').toLowerCase();
    var drel = (row.dataset.related || '').toLowerCase();
    var dexp = row.dataset.expiry || '';
    var dcode= (row.dataset.code || '').toLowerCase();
    var dtxt = dcode + ' ' + dpv + ' ' + drel;

    if (state.search && dtxt.indexOf(state.search.toLowerCase()) === -1) return false;
    if (state.status && ds !== state.status) return false;
    if (state.discountType && ddt !== state.discountType) return false;
    if (state.provider && dpv.indexOf(state.provider.toLowerCase()) === -1) return false;
    if (state.sourceType && dsrc !== state.sourceType) return false;
    if (state.category && dcat !== state.category) return false;
    if (state.relatedDeal && drel.indexOf(state.relatedDeal.toLowerCase()) === -1) return false;
    if (state.expiryStatus) {
      var ec = expiryCategory(dexp);
      if (state.expiryStatus !== ec) return false;
    }
    return true;
  }

  function sortRows(matched) {
    var val = sortSel ? sortSel.value : 'updated-desc';
    var copy = matched.slice();
    if (val === 'expiry-asc') {
      copy.sort(function(a,b){ return new Date(a.dataset.expiry||0) - new Date(b.dataset.expiry||0); });
    } else if (val === 'copies-desc') {
      copy.sort(function(a,b){ return (+b.dataset.copies||0) - (+a.dataset.copies||0); });
    } else if (val === 'used-desc') {
      copy.sort(function(a,b){ return (+b.dataset.used||0) - (+a.dataset.used||0); });
    }
    return copy;
  }

  function chipLabel(key, val) {
    var map = { search:'بحث', status:'الحالة', discountType:'نوع الخصم', provider:'المزود', sourceType:'المصدر', category:'الفئة', relatedDeal:'العرض', expiryStatus:'الانتهاء' };
    return (map[key] || key) + ': ' + val;
  }

  function applyFilters() {
    var matched = rows.filter(rowMatches);
    var sorted  = sortRows(matched);
    var tbody   = tableWrap ? tableWrap.querySelector('tbody') : null;

    rows.forEach(function(r){ r.hidden = true; });
    sorted.forEach(function(r){ r.hidden = false; if (tbody) tbody.appendChild(r); });

    var vis = sorted.length;
    if (countText) countText.textContent = 'عرض ' + vis + ' من ' + rows.length + ' كوبون';
    if (emptyState) emptyState.hidden = vis > 0;

    if (chipsBar) {
      chipsBar.innerHTML = '';
      Object.keys(state).forEach(function(k){
        if (!state[k]) return;
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'filter-chip';
        chip.setAttribute('aria-label', 'إزالة فلتر: ' + chipLabel(k, state[k]));
        chip.innerHTML = chipLabel(k, state[k]) + ' <span class="chip-x" aria-hidden="true">×</span>';
        chip.addEventListener('click', function(){ state[k]=''; syncForm(); applyFilters(); });
        chipsBar.appendChild(chip);
      });
    }
    announce(vis + ' كوبون يطابق الفلاتر');
  }

  function syncForm() {
    var get = function(id){ var e=document.getElementById(id); if(e) e.value=state[{ 'coupons-search':'search','filter-coupon-status':'status','filter-discount-type':'discountType','filter-coupon-provider':'provider','filter-coupon-source':'sourceType','filter-coupon-category':'category','filter-related-deal':'relatedDeal','filter-coupon-expiry':'expiryStatus' }[id]]||''; };
    ['coupons-search','filter-coupon-status','filter-discount-type','filter-coupon-provider','filter-coupon-source','filter-coupon-category','filter-related-deal','filter-coupon-expiry'].forEach(get);
  }

  function readForm() {
    function v(id){ var e=document.getElementById(id); return e ? e.value.trim() : ''; }
    state.search       = v('coupons-search');
    state.status       = v('filter-coupon-status');
    state.discountType = v('filter-discount-type');
    state.provider     = v('filter-coupon-provider');
    state.sourceType   = v('filter-coupon-source');
    state.category     = v('filter-coupon-category');
    state.relatedDeal  = v('filter-related-deal');
    state.expiryStatus = v('filter-coupon-expiry');
  }

  var filterForm = document.getElementById('coupons-filter-form');
  if (filterForm) {
    filterForm.addEventListener('input',  function(){ readForm(); applyFilters(); });
    filterForm.addEventListener('change', function(){ readForm(); applyFilters(); });
  }
  if (sortSel) sortSel.addEventListener('change', applyFilters);

  function doReset() {
    Object.keys(state).forEach(function(k){ state[k]=''; });
    syncForm();
    applyFilters();
    toast('تم مسح الفلاتر', 'info');
  }
  document.querySelectorAll('[data-coupons-reset]').forEach(function(b){ b.addEventListener('click', doReset); });
  document.querySelectorAll('[data-coupons-toast]').forEach(function(b){
    b.addEventListener('click', function(){ toast(this.dataset.couponsToast || 'إجراء تجريبي', 'info'); });
  });

  // ── Copy code ─────────────────────────────────────────────────────────────
  function copyCode(code) {
    if (!code) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(function(){ toast('تم نسخ الكود: ' + code + ' — إجراء تجريبي', 'success'); }).catch(function(){ toast('تعذّر النسخ', 'warning'); });
    } else { toast('المتصفح لا يدعم النسخ التلقائي', 'warning'); }
  }

  // ── Delete modal ──────────────────────────────────────────────────────────
  var _delTarget = null;
  var delModal   = document.getElementById('modal-coupon-delete');
  var delConfBtn = document.getElementById('modal-coupon-delete-confirm');

  function openDeleteModal(row) {
    _delTarget = row;
    if (!delModal) { row.remove(); rows.splice(rows.indexOf(row),1); toast('تم الحذف التجريبي','success'); applyFilters(); return; }
    delModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    var cancel = delModal.querySelector('[data-modal-cancel]');
    if (cancel) setTimeout(function(){ cancel.focus(); }, 40);
  }
  function closeDeleteModal() {
    if (delModal) delModal.setAttribute('hidden','');
    document.body.style.overflow = '';
    _delTarget = null;
  }
  if (delConfBtn) {
    delConfBtn.addEventListener('click', function(){
      if (_delTarget) { var i=rows.indexOf(_delTarget); if(i>-1) rows.splice(i,1); _delTarget.remove(); toast('تم الحذف التجريبي — لا حذف حقيقي على الخادم','success'); }
      closeDeleteModal(); applyFilters();
    });
  }
  if (delModal) {
    delModal.querySelectorAll('[data-modal-cancel],[data-modal-close]').forEach(function(b){ b.addEventListener('click', closeDeleteModal); });
    delModal.addEventListener('click', function(e){ if(e.target===delModal) closeDeleteModal(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && delModal && !delModal.hidden) closeDeleteModal(); });
  }

  // ── Row action menus ──────────────────────────────────────────────────────
  var _openMenu = null;

  function closeAllMenus() {
    document.querySelectorAll('.row-action-menu').forEach(function(m){ m.setAttribute('hidden',''); });
    document.querySelectorAll('[data-row-coupon-trigger]').forEach(function(t){ t.setAttribute('aria-expanded','false'); });
    _openMenu = null;
  }

  function buildMenuHTML(row) {
    var status = (row.dataset.status||'').toLowerCase();
    var isPaused = status === 'paused';
    var code = row.dataset.code || '';
    var toggleLabel = isPaused ? 'تفعيل الكوبون' : 'إيقاف مؤقت';
    var toggleIcon  = isPaused
      ? '<svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
      : '<svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    return '<button type="button" class="rmi" data-mcopy="'+code+'" role="menuitem"><svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> نسخ الكود</button>'
      + '<button type="button" class="rmi" data-coming-soon role="menuitem"><svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> تعديل</button>'
      + '<button type="button" class="rmi" data-mdup role="menuitem"><svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> تكرار</button>'
      + '<button type="button" class="rmi" data-mtoggle role="menuitem">' + toggleIcon + ' ' + toggleLabel + '</button>'
      + '<button type="button" class="rmi" data-coming-soon role="menuitem"><svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> عرض الصفحة</button>'
      + '<div class="row-menu-sep"></div>'
      + '<button type="button" class="rmi is-danger" data-mdel role="menuitem"><svg width="14" height="14" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg> حذف</button>';
  }

  document.addEventListener('click', function(e){
    var trigger = e.target.closest('[data-row-coupon-trigger]');
    if (trigger) {
      var row = trigger.closest('[data-coupon-row]');
      var menu = trigger.nextElementSibling;
      if (!menu) return;
      var isOpen = !menu.hasAttribute('hidden');
      closeAllMenus();
      if (!isOpen && row) {
        menu.innerHTML = buildMenuHTML(row);
        menu.removeAttribute('hidden');
        trigger.setAttribute('aria-expanded','true');
        _openMenu = menu;
        var first = menu.querySelector('[role="menuitem"]');
        if (first) first.focus();

        var copyBtn = menu.querySelector('[data-mcopy]');
        if (copyBtn) copyBtn.addEventListener('click', function(){ copyCode(this.dataset.mcopy); closeAllMenus(); });

        var dupBtn = menu.querySelector('[data-mdup]');
        if (dupBtn) dupBtn.addEventListener('click', function(){ toast('تم إنشاء نسخة تجريبية من الكوبون — إجراء تجريبي','success'); closeAllMenus(); });

        var togBtn = menu.querySelector('[data-mtoggle]');
        if (togBtn) togBtn.addEventListener('click', function(){
          var st = (row.dataset.status||'').toLowerCase();
          var ns = st === 'paused' ? 'active' : 'paused';
          row.dataset.status = ns;
          var badge = row.querySelector('.badge-active,.badge-paused,.badge-draft,.badge-scheduled,.badge-expired,.badge-archived');
          if (badge) {
            var lbl = ns === 'active' ? 'نشط' : 'موقوف';
            var dot = badge.querySelector('.badge-dot');
            badge.className = 'badge badge-' + ns;
            badge.innerHTML = (dot ? '<span class="badge-dot" style="background:' + (ns==='active'?'#15803D':'#A16207') + '"></span>' : '') + lbl;
          }
          toast(ns === 'active' ? 'تم تفعيل الكوبون تجريبياً' : 'تم إيقاف الكوبون تجريبياً','info');
          closeAllMenus();
        });

        var delBtn = menu.querySelector('[data-mdel]');
        if (delBtn) delBtn.addEventListener('click', function(){ openDeleteModal(row); closeAllMenus(); });
      }
      return;
    }
    if (!e.target.closest('.row-action-menu')) closeAllMenus();
  });

  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && _openMenu) closeAllMenus(); });

  // ── Bulk selection ────────────────────────────────────────────────────────
  var selectAll = document.getElementById('coupons-select-all');
  var bulkBar   = document.getElementById('coupons-bulk-bar');
  var bulkCount = document.getElementById('coupons-bulk-count');

  function updateBulkBar() {
    var checked = document.querySelectorAll('.coupon-row-cb:checked');
    var n = checked.length;
    if (bulkBar) { if(n>0) bulkBar.classList.add('is-visible'); else bulkBar.classList.remove('is-visible'); }
    if (bulkCount) bulkCount.textContent = n + (n===1?' كوبون محدد':' كوبونات محددة');
    if (selectAll) {
      var visible = rows.filter(function(r){ return !r.hidden; }).length;
      selectAll.indeterminate = n > 0 && n < visible;
      if (n > 0 && n >= visible) selectAll.checked = true;
      if (n === 0) selectAll.checked = false;
    }
  }

  if (selectAll) {
    selectAll.addEventListener('change', function(){
      rows.forEach(function(r){ if(!r.hidden){ var cb=r.querySelector('.coupon-row-cb'); if(cb) cb.checked=selectAll.checked; } });
      updateBulkBar();
    });
  }
  document.addEventListener('change', function(e){ if(e.target && e.target.classList.contains('coupon-row-cb')) updateBulkBar(); });

  document.querySelectorAll('[data-bulk-coupon-action]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var action = this.dataset.bulkCouponAction;
      var checked = Array.from(document.querySelectorAll('.coupon-row-cb:checked')).map(function(cb){ return cb.closest('[data-coupon-row]'); }).filter(Boolean);
      if (!checked.length) return;
      if (action === 'activate') {
        checked.forEach(function(r){ r.dataset.status='active'; });
        toast('تم تفعيل ' + checked.length + ' كوبون تجريبياً','success');
      } else if (action === 'pause') {
        checked.forEach(function(r){ r.dataset.status='paused'; });
        toast('تم إيقاف ' + checked.length + ' كوبون تجريبياً','info');
      } else if (action === 'bulk-delete') {
        checked.forEach(function(r){ var i=rows.indexOf(r); if(i>-1) rows.splice(i,1); r.remove(); });
        toast('تم حذف ' + checked.length + ' كوبون تجريبياً','success');
        applyFilters();
      } else if (action === 'export') {
        toast('تصدير تجريبي — لا يتم تصدير ملف حقيقي في هذه النسخة','info');
      }
      if (selectAll) selectAll.checked = false;
      updateBulkBar();
    });
  });

  applyFilters();
}

// ─── T028: merchant-create-coupon controller ──────────────────────────────────
function initMerchantCreateCoupon() {
  var form = document.getElementById('form-create-coupon');
  if (!form) return;

  // ── Helpers ──────────────────────────────────────────────────────────────
  function toast(msg, type) {
    if (window.TUI && TUI.toast) TUI.toast(msg, { type: type || 'info', duration: 4000 });
  }

  function slugify(str) {
    return (str || '').toLowerCase()
      .replace(/[^a-z0-9؀-ۿ\s-]/g, '')
      .trim().replace(/\s+/g, '-')
      .replace(/-+/g, '-').substring(0, 80);
  }

  function generateRandomCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // ── Element refs ──────────────────────────────────────────────────────────
  var codeInp         = form.elements['code'];
  var categoryEl      = form.elements['category'];
  var discTypeEl      = form.elements['discountType'];
  var discValueEl     = form.elements['discountValue'];
  var currencyEl      = form.elements['currency'];
  var expiryEl        = form.elements['expiryDate'];
  var sourceTypeEl    = form.elements['sourceType'];
  var statusEl        = form.elements['status'];
  var providerEl      = form.elements['provider'];
  var slugInp         = form.elements['slug'];
  var currencyWrap    = document.getElementById('currency-wrap');
  var schedWrap       = document.getElementById('schedule-date-wrap');
  var scrapedWarn     = document.getElementById('scraped-warning-wrap');
  var slugPreview     = document.getElementById('slug-preview-val');
  var fillBar         = document.getElementById('summary-fill');
  var missingEl       = document.getElementById('summary-missing');

  // Preview elements
  var previewCode     = document.getElementById('preview-code');
  var previewDiscount = document.getElementById('preview-discount');
  var previewProvider = document.getElementById('preview-provider');
  var previewCategory = document.getElementById('preview-category');
  var previewSource   = document.getElementById('preview-source-badge');
  var previewExpiry   = document.getElementById('preview-expiry');

  var REQUIRED_FIELDS = ['code','category','discountType','discountValue','expiryDate','sourceType'];

  // ── Generate random code ──────────────────────────────────────────────────
  var genBtn  = document.getElementById('btn-generate-code');
  var copyBtn = document.getElementById('btn-copy-code');

  if (genBtn) {
    genBtn.addEventListener('click', function () {
      var code = generateRandomCode();
      if (codeInp) {
        codeInp.value = code;
        codeInp.dispatchEvent(new Event('input', { bubbles: true }));
      }
      toast('تم توليد كود: ' + code + ' — بيانات تجريبية', 'success');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var code = codeInp ? codeInp.value.trim() : '';
      if (!code) { toast('لا يوجد كود لنسخه — يرجى إدخال أو توليد كود أولاً', 'warning'); return; }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function () {
          toast('تم نسخ الكود: ' + code + ' — إجراء تجريبي', 'success');
        }).catch(function () { toast('تعذّر النسخ — حاول مرة أخرى', 'warning'); });
      } else {
        toast('المتصفح لا يدعم النسخ التلقائي', 'warning');
      }
    });
  }

  // ── Code → uppercase enforcement ─────────────────────────────────────────
  if (codeInp) {
    codeInp.addEventListener('input', function () {
      var pos = this.selectionStart;
      this.value = this.value.toUpperCase();
      try { this.setSelectionRange(pos, pos); } catch(e) {}
      updateSlugPreview();
      updateLivePreview();
      updateSummary();
    });
  }

  // ── Discount type → currency + preview ───────────────────────────────────
  function updateDiscountConditionals() {
    if (!discTypeEl) return;
    var v = discTypeEl.value;
    if (currencyWrap) currencyWrap.hidden = (v !== 'Fixed amount');
    if (currencyEl)   currencyEl.required = (v === 'Fixed amount');
    updateLivePreview();
    updateSummary();
  }
  if (discTypeEl) discTypeEl.addEventListener('change', updateDiscountConditionals);
  updateDiscountConditionals();

  // ── Source type → scraped warning ─────────────────────────────────────────
  function updateSourceConditionals() {
    if (!sourceTypeEl) return;
    var v = sourceTypeEl.value;
    if (scrapedWarn) scrapedWarn.hidden = (v !== 'Scraped Pending Review');
    updateLivePreview();
    updateSummary();
  }
  if (sourceTypeEl) sourceTypeEl.addEventListener('change', updateSourceConditionals);
  updateSourceConditionals();

  // ── Status → schedule date ────────────────────────────────────────────────
  if (statusEl) {
    statusEl.addEventListener('change', function () {
      if (schedWrap) schedWrap.hidden = (this.value !== 'Scheduled');
    });
  }

  // ── Slug auto-gen from code ────────────────────────────────────────────────
  var slugManuallyEdited = false;
  function updateSlugPreview() {
    var val = slugInp ? slugInp.value : '';
    if (slugPreview) {
      slugPreview.textContent = val || '…';
    }
  }

  if (slugInp) {
    slugInp.addEventListener('input', function () {
      slugManuallyEdited = !!this.value;
      this.value = slugify(this.value);
      updateSlugPreview();
    });
  }

  // Auto-populate slug from code
  if (codeInp) {
    codeInp.addEventListener('input', function () {
      if (!slugManuallyEdited && slugInp) {
        slugInp.value = slugify(this.value.toLowerCase());
        updateSlugPreview();
      }
    });
  }
  updateSlugPreview();

  // ── Live preview card ──────────────────────────────────────────────────────
  var srcBadgeMap = {
    'Manual': 'badge-source-manual',
    'Affiliate': 'badge-source-affiliate',
    'Coupon API': 'badge-source-api',
    'Scraped Pending Review': 'badge-source-scraped'
  };

  function updateLivePreview() {
    var code       = codeInp     ? codeInp.value.trim()     || 'CODE'  : 'CODE';
    var dt         = discTypeEl  ? discTypeEl.value          : '';
    var dv         = discValueEl ? discValueEl.value.trim()  : '';
    var curr       = currencyEl  ? currencyEl.value          : 'ر.س';
    var provider   = providerEl  ? providerEl.value.trim()   || '—'    : '—';
    var category   = categoryEl  ? (categoryEl.options[categoryEl.selectedIndex] || {}).text || '—' : '—';
    var srcType    = sourceTypeEl? sourceTypeEl.value        : '';
    var expiry     = expiryEl    ? expiryEl.value            : '';

    // Code
    if (previewCode) previewCode.textContent = code;

    // Discount
    var discTxt = '—';
    if (dv) {
      if (dt === 'Percentage')    discTxt = dv + '%';
      else if (dt === 'Fixed amount') discTxt = dv + ' ' + curr;
      else if (dt === 'Free service') discTxt = 'مجاني';
      else if (dt === 'Custom offer') discTxt = 'عرض مخصص';
      else discTxt = dv;
    }
    if (previewDiscount) previewDiscount.textContent = discTxt;

    if (previewProvider) previewProvider.textContent = provider;
    if (previewCategory) previewCategory.textContent = category === 'اختر الفئة…' ? '—' : category;

    // Source badge
    if (previewSource) {
      var cls = srcBadgeMap[srcType] || 'badge-source-manual';
      previewSource.className = 'badge ' + cls;
      previewSource.textContent = srcType || 'Manual';
    }

    // Expiry
    if (previewExpiry) {
      previewExpiry.textContent = expiry ? 'ينتهي: ' + expiry : '';
    }
  }

  form.addEventListener('input',  function () { updateLivePreview(); updateSummary(); });
  form.addEventListener('change', function () { updateLivePreview(); updateSummary(); });
  updateLivePreview();

  // ── Summary completion tracker ────────────────────────────────────────────
  function updateSummary() {
    var requiredNow = REQUIRED_FIELDS.slice();
    if (discTypeEl && discTypeEl.value === 'Fixed amount') {
      requiredNow.push('currency');
    }
    var filled = requiredNow.filter(function (name) {
      var el = form.elements[name];
      return el && el.value && el.value.trim();
    });
    var pct = Math.round((filled.length / requiredNow.length) * 100);
    if (fillBar) fillBar.style.width = pct + '%';
    if (missingEl) {
      var missing = requiredNow.length - filled.length;
      missingEl.innerHTML = missing === 0
        ? '<span style="color:#15803D">✓ جميع الحقول المطلوبة مكتملة</span>'
        : '<span style="color:#DC2626">' + missing + '</span> حقل مطلوب غير مكتمل';
    }
  }
  updateSummary();

  // ── Form validation helpers ───────────────────────────────────────────────
  function setFieldError(name, errorId, show) {
    var el  = form.elements[name];
    var err = document.getElementById(errorId);
    if (el)  el.setAttribute('aria-invalid', show ? 'true' : 'false');
    if (err) err.hidden = !show;
  }

  function validateForm() {
    var ok = true;
    var requiredNow = [
      { name:'code',          errId:'code-error' },
      { name:'category',      errId:'category-error' },
      { name:'discountType',  errId:'discount-type-error' },
      { name:'discountValue', errId:'discount-value-error' },
      { name:'expiryDate',    errId:'expiry-error' },
      { name:'sourceType',    errId:'source-type-error' }
    ];
    if (discTypeEl && discTypeEl.value === 'Fixed amount') {
      requiredNow.push({ name:'currency', errId:'currency-error' });
    }
    requiredNow.forEach(function (f) {
      var el = form.elements[f.name];
      var empty = !el || !el.value.trim();
      setFieldError(f.name, f.errId, empty);
      if (empty) ok = false;
    });
    return ok;
  }

  // ── Publish + draft ───────────────────────────────────────────────────────
  function doPublish() {
    var ok = validateForm();
    if (!ok) {
      toast('يرجى تصحيح الحقول المطلوبة أولاً', 'warning');
      var firstErr = form.querySelector('[aria-invalid="true"]');
      if (firstErr) firstErr.focus();
      return;
    }
    toast('تم النشر التجريبي — واجهة أمامية فقط / لا تفعيل حقيقي للكوبون / لا حفظ على خادم', 'success');
  }

  function doDraft() {
    toast('تم الحفظ كمسودة — إجراء تجريبي / session فقط', 'info');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    doPublish();
  });

  ['btn-publish-top','btn-publish-form','btn-publish-sidebar'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', doPublish);
  });
  ['btn-save-draft-top','btn-save-draft-form','btn-save-draft-sidebar'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', doDraft);
  });
}

// ─── merchant-analytics controller (T014) ────────────────────────────────────
function initMerchantAnalytics() {

  // ── Date-range chips ──────────────────────────────────────────────────────
  var chips = document.querySelectorAll('.date-chip[data-range]');
  var customRegion = document.getElementById('custom-range-region');
  var dateFrom = document.getElementById('date-from');
  var dateTo   = document.getElementById('date-to');
  var applyBtn = document.getElementById('btn-apply-range');
  var dateErr  = document.getElementById('date-range-error');

  var RANGE_LABELS = {
    today: 'اليوم',
    '7d':  'آخر 7 أيام',
    '30d': 'آخر 30 يوم',
    month: 'هذا الشهر',
    '90d': 'آخر 90 يوم'
  };

  function setActiveChip(key) {
    chips.forEach(function (c) {
      var isActive = c.dataset.range === key;
      c.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      c.classList.toggle('is-active', isActive);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var range = chip.dataset.range;
      setActiveChip(range);

      if (range === 'custom') {
        if (customRegion) { customRegion.hidden = false; }
        if (dateFrom) dateFrom.focus();
        announce('حدد نطاق التاريخ المخصص');
      } else {
        if (customRegion) { customRegion.hidden = true; }
        if (dateErr) dateErr.hidden = true;
        var label = RANGE_LABELS[range] || range;
        announce('تم تحديد الفترة: ' + label + ' — البيانات تجريبية ثابتة');
        toast('الفترة: ' + label + ' — بيانات تجريبية ثابتة / لا استعلام حقيقي', 'info');
      }
    });
  });

  // ── Custom range apply ────────────────────────────────────────────────────
  if (applyBtn) {
    applyBtn.addEventListener('click', function () {
      if (dateErr) dateErr.hidden = true;
      var from = dateFrom ? dateFrom.value : '';
      var to   = dateTo   ? dateTo.value   : '';

      if (!from || !to) {
        if (dateErr) { dateErr.textContent = 'يرجى تحديد تاريخَي البداية والنهاية'; dateErr.hidden = false; }
        if (!from && dateFrom) dateFrom.focus();
        return;
      }
      if (from > to) {
        if (dateErr) { dateErr.textContent = 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية'; dateErr.hidden = false; }
        if (dateFrom) dateFrom.focus();
        return;
      }
      announce('تم تطبيق النطاق المخصص من ' + from + ' إلى ' + to + ' — بيانات تجريبية ثابتة');
      toast('نطاق مخصص: ' + from + ' → ' + to + ' — بيانات تجريبية ثابتة', 'success');
    });
  }

  // ── Compare toggle ────────────────────────────────────────────────────────
  var compareToggle = document.getElementById('compare-toggle');
  if (compareToggle) {
    compareToggle.addEventListener('change', function () {
      var on = compareToggle.checked;
      compareToggle.setAttribute('aria-checked', on ? 'true' : 'false');
      announce(on ? 'المقارنة مفعّلة — بيانات تجريبية' : 'المقارنة معطّلة');
      toast(on ? 'المقارنة بالفترة السابقة مفعّلة — بيانات تجريبية' : 'تم إيقاف المقارنة', 'info');
    });
  }

  // ── Export buttons (PDF / CSV / schedule) ────────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-analytics-export]');
    if (!btn) return;
    var fmt = btn.getAttribute('data-analytics-export');
    var msgs = {
      pdf:      'تصدير PDF تجريبي — لا يتم إنشاء ملف فعلي في هذه النسخة',
      csv:      'تصدير CSV تجريبي — لا يتم إنشاء ملف فعلي في هذه النسخة',
      schedule: 'جدولة التقارير — قابل للربط لاحقاً / لا يتم إرسال تقرير حقيقي'
    };
    toast(msgs[fmt] || 'تصدير تجريبي — لا يتم إنشاء ملف فعلي', 'info');

    // Close export modal if open
    var modal = document.getElementById('modal-export');
    if (modal && !modal.hidden) {
      modal.hidden = true;
      document.getElementById('btn-export-report') && document.getElementById('btn-export-report').focus();
    }
  });

  // ── Open export modal from header button ─────────────────────────────────
  var exportHeaderBtn = document.getElementById('btn-export-report');
  if (exportHeaderBtn) {
    exportHeaderBtn.addEventListener('click', function () {
      var modal = document.getElementById('modal-export');
      if (modal && global.TUI && TUI.modal) {
        TUI.modal.open('modal-export');
      } else if (modal) {
        modal.hidden = false;
        var first = modal.querySelector('button, a');
        if (first) first.focus();
      }
    });
  }

  // Close modal via data-modal-close
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-modal-close]');
    if (!btn) return;
    var modalId = btn.getAttribute('data-modal-close');
    var modal = modalId ? document.getElementById(modalId) : btn.closest('.modal-overlay');
    if (modal) {
      modal.hidden = true;
      if (exportHeaderBtn) exportHeaderBtn.focus();
    }
  });

  // Close modal on overlay click
  var exportModal = document.getElementById('modal-export');
  if (exportModal) {
    exportModal.addEventListener('click', function (e) {
      if (e.target === exportModal) {
        exportModal.hidden = true;
        if (exportHeaderBtn) exportHeaderBtn.focus();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !exportModal.hidden) {
        exportModal.hidden = true;
        if (exportHeaderBtn) exportHeaderBtn.focus();
      }
    });
  }

  // ── Coupon copy buttons ───────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy-coupon]');
    if (!btn) return;
    var code = btn.getAttribute('data-copy-coupon');
    if (!code) return;

    // Try Clipboard API, fallback gracefully
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function () {
        toast('تم نسخ كود «' + code + '» — بيانات تجريبية', 'success');
        announce('تم نسخ الكود ' + code);
      }).catch(function () {
        toast('كود الكوبون: ' + code + ' (انسخه يدوياً)', 'info');
      });
    } else {
      toast('كود الكوبون: ' + code + ' (انسخه يدوياً)', 'info');
    }
  });

  // ── Recommendation action toasts ─────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-analytics-toast]');
    if (!btn) return;
    toast(btn.getAttribute('data-analytics-toast'), 'info');
  });
}

// ─── merchant-integrations controller (stub — implemented in T018) ───────────
function initMerchantIntegrations() {
  // Filled in by T018 (Phase 4 US2).
  // Reuses: DropdownController, validateAndSubmit, confirmModal, toast, announce (closure).
  // Handles: category tabs filter, configure modals, Save/Test toasts, enable/disable toggles.
}

// ─── merchant-settings controller (stub — implemented in T023) ───────────────
function initMerchantSettings() {
  // Filled in by T023 (Phase 5 US3).
  // Reuses: DropdownController, validateAndSubmit, confirmModal, toast, announce (closure).
  // Handles: tab/anchor nav, form validation, branding live preview, notification toggles,
  // invite/change-role/disable-remove modals, change-password, 2FA, upgrade coming-soon, danger zone.
}
