(function () {
  'use strict';

  /* ─── Guard ────────────────────────────────────────────────────────────── */
  const _ADMIN_PAGES = [
    'admin-overview',
    'admin-companies',
    'admin-company-details',
    'admin-plans',
    'admin-subscriptions',
    'admin-analytics',
    'admin-content',
  ];

  const page = document.documentElement.dataset.page || '';
  if (!_ADMIN_PAGES.includes(page)) return;

  /* ─── Module-level primitives store ────────────────────────────────────── */
  var _P = {};

  /* ─── Entry ─────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initShell();
    initPrimitives();

    switch (page) {
      case 'admin-overview':
        initOverview();
        break;
      case 'admin-companies':
        initCompanies();
        break;
      case 'admin-company-details':
        initCompanyDetails();
        break;
      case 'admin-plans':
        initPlans();
        break;
      case 'admin-subscriptions':
        initSubscriptions();
        break;
      case 'admin-analytics':
        initAnalytics();
        break;
      case 'admin-content':
        initContent();
        break;
    }
  });

  /* ─── Shell init (T004) ─────────────────────────────────────────────────── */
  function initShell() {
    /* 1. data-year: belt-and-suspenders (main.js also handles this) */
    var year = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = year;
    });

    /* 2. DropdownController factory ─────────────────────────────────────── */
    /**
     * DropdownController
     * @param {string} triggerId  — id of the button that opens the panel
     * @param {string} panelId    — id of the dropdown panel element
     * @param {DropdownController[]} siblings — other controllers to close when this one opens
     */
    function DropdownController(triggerId, panelId, siblings) {
      var trigger = document.getElementById(triggerId);
      var panel = document.getElementById(panelId);
      if (!trigger || !panel) return;

      var _siblings = siblings || [];
      var _open = false;
      var _animTimer = null;

      function getFocusableItems() {
        return Array.prototype.slice
          .call(
            panel.querySelectorAll(
              'a[href], button:not([disabled]), [tabindex="0"], input, select, textarea'
            )
          )
          .filter(function (el) {
            return !el.closest('[hidden]') && !el.closest('.hidden');
          });
      }

      function open() {
        if (_open) return;
        _open = true;

        /* close siblings first */
        _siblings.forEach(function (s) {
          if (s && s !== self) s.close();
        });

        panel.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');

        /* animate */
        if (_animTimer) clearTimeout(_animTimer);
        panel.classList.add('dd-animate');
        _animTimer = setTimeout(function () {
          panel.classList.remove('dd-animate');
          _animTimer = null;
        }, 300);

        /* move focus to first item */
        var items = getFocusableItems();
        if (items.length) items[0].focus();
      }

      function close() {
        if (!_open) return;
        _open = false;
        panel.classList.add('hidden');
        panel.classList.remove('dd-animate', 'is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      function toggle() {
        if (_open) {
          close();
        } else {
          open();
        }
      }

      function isOpen() {
        return _open;
      }

      /* trigger click */
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggle();
      });

      /* Esc key */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && _open) {
          close();
          trigger.focus();
        }
      });

      /* outside-click */
      document.addEventListener('click', function (e) {
        if (_open && !panel.contains(e.target) && e.target !== trigger) {
          close();
        }
      });

      /* roving focus: arrow keys within open panel */
      panel.addEventListener('keydown', function (e) {
        if (!_open) return;
        var items = getFocusableItems();
        if (!items.length) return;
        var idx = items.indexOf(document.activeElement);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          var next = (idx + 1) % items.length;
          items[next].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          var prev = (idx - 1 + items.length) % items.length;
          items[prev].focus();
        } else if (e.key === 'Tab') {
          /* let natural tab flow, but close when leaving the panel */
          setTimeout(function () {
            if (!panel.contains(document.activeElement)) close();
          }, 0);
        }
      });

      var self = { open: open, close: close, toggle: toggle, isOpen: isOpen };
      return self;
    }

    /* 3. Instantiate the three topbar dropdowns ─────────────────────────── */
    var ddNotifications = DropdownController('btn-notifications', 'dd-notifications', null);
    var ddUserMenu = DropdownController('btn-user-menu', 'dd-user-menu', null);
    var ddQuickAction = DropdownController('btn-quick-action', 'dd-quick-action', null);

    /* wire one-open-at-a-time by passing each other as siblings */
    var allDropdowns = [ddNotifications, ddUserMenu, ddQuickAction].filter(Boolean);
    allDropdowns.forEach(function (dd) {
      /* inject sibling awareness after all are created */
      /* We close all others in the open() call below by re-wiring triggers */
    });

    /* Re-wrap each trigger click to close siblings before opening */
    [
      { triggerId: 'btn-notifications', dd: ddNotifications },
      { triggerId: 'btn-user-menu', dd: ddUserMenu },
      { triggerId: 'btn-quick-action', dd: ddQuickAction },
    ].forEach(function (entry) {
      if (!entry.dd) return;
      var btn = document.getElementById(entry.triggerId);
      if (!btn) return;
      /* Clone to remove the previous listener attached inside DropdownController */
      var clone = btn.cloneNode(true);
      btn.parentNode.replaceChild(clone, btn);
      clone.addEventListener('click', function (e) {
        e.stopPropagation();
        /* close all others */
        allDropdowns.forEach(function (sibling) {
          if (sibling !== entry.dd && sibling && sibling.isOpen) sibling.close();
        });
        entry.dd.toggle();
      });
    });

    /* Expose DropdownController for initPrimitives */
    _P._DropdownController = DropdownController;

    /* 4. Sidebar drawer ──────────────────────────────────────────────────── */
    var adminSidebar = document.getElementById('admin-sidebar');
    var adminScrim = document.getElementById('admin-scrim');
    var adminMenuBtn = document.getElementById('btn-admin-menu');

    function openAdminSidebar() {
      if (!adminSidebar) return;
      adminSidebar.classList.add('is-open');
      adminSidebar.removeAttribute('hidden');
      adminSidebar.setAttribute('aria-hidden', 'false');
      if (adminScrim) {
        adminScrim.removeAttribute('hidden');
        requestAnimationFrame(function () {
          adminScrim.classList.add('is-active');
        });
        adminScrim.setAttribute('aria-hidden', 'false');
      }
      document.body.classList.add('admin-sidebar-open');
      if (adminMenuBtn) adminMenuBtn.setAttribute('aria-expanded', 'true');
      setTimeout(function () {
        var first = adminSidebar.querySelector('a[href], button:not([disabled])');
        if (first) first.focus();
      }, 50);
    }

    function closeAdminSidebar() {
      if (!adminSidebar) return;
      adminSidebar.classList.remove('is-open');
      if (adminScrim) {
        adminScrim.classList.remove('is-active');
        setTimeout(function () {
          adminScrim.setAttribute('hidden', '');
          adminScrim.setAttribute('aria-hidden', 'true');
        }, 250);
      }
      document.body.classList.remove('admin-sidebar-open');
      if (adminMenuBtn) {
        adminMenuBtn.setAttribute('aria-expanded', 'false');
        adminMenuBtn.focus();
      }
    }

    if (adminMenuBtn) {
      adminMenuBtn.addEventListener('click', function () {
        if (adminSidebar && adminSidebar.classList.contains('is-open')) {
          closeAdminSidebar();
        } else {
          openAdminSidebar();
        }
      });
    }

    if (adminScrim) {
      adminScrim.addEventListener('click', closeAdminSidebar);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && adminSidebar && adminSidebar.classList.contains('is-open')) {
        closeAdminSidebar();
      }
    });

    /* Desktop breakpoint: clear drawer state so sidebar stays visible */
    var _adminMq = window.matchMedia('(min-width: 1024px)');
    function _onAdminBp(mq) {
      if ((mq.matches || mq) && adminSidebar) {
        adminSidebar.classList.remove('is-open');
        if (adminScrim) {
          adminScrim.classList.remove('is-active');
          adminScrim.setAttribute('hidden', '');
        }
        document.body.classList.remove('admin-sidebar-open');
        if (adminMenuBtn) adminMenuBtn.setAttribute('aria-expanded', 'false');
      }
    }
    if (_adminMq.addEventListener) {
      _adminMq.addEventListener('change', _onAdminBp);
    } else if (_adminMq.addListener) {
      _adminMq.addListener(_onAdminBp);
    }
    /* Run once on init to clear any stale state on desktop page load */
    if (_adminMq.matches) _onAdminBp(_adminMq);
  }

  /* ─── Shared primitives (T005) ──────────────────────────────────────────── */
  function initPrimitives() {
    /* 1. _toast ─────────────────────────────────────────────────────────── */
    _P._toast = function (msg, type) {
      if (window.TUI && typeof TUI.toast === 'function') {
        TUI.toast(msg, { type: type || 'info' });
      }
    };

    /* 2. DropdownController — already stored in _P._DropdownController by initShell */

    /* 3. _initRowActionMenus ─────────────────────────────────────────────── */
    _P._initRowActionMenus = function (container) {
      var root = container || document;

      function closeAll() {
        root.querySelectorAll('.row-action-menu.is-open').forEach(function (menu) {
          menu.classList.remove('is-open');
          var btn = menu.previousElementSibling;
          if (btn && btn.classList.contains('row-action-btn')) {
            btn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      function openMenu(menu, btn) {
        closeAll();
        menu.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');

        /* focus first item */
        var first = menu.querySelector('[role="menuitem"]:not([disabled])');
        if (first) first.focus();
      }

      /* Delegate trigger clicks */
      root.addEventListener('click', function (e) {
        var btn = e.target.closest('.row-action-btn');
        if (btn) {
          e.stopPropagation();
          var menu = btn.nextElementSibling;
          if (!menu || !menu.classList.contains('row-action-menu')) {
            /* try sibling search */
            var parent = btn.parentElement;
            menu = parent ? parent.querySelector('.row-action-menu') : null;
          }
          if (!menu) return;
          var isAlreadyOpen = menu.classList.contains('is-open');
          closeAll();
          if (!isAlreadyOpen) openMenu(menu, btn);
          return;
        }
        /* click outside closes all */
        if (!e.target.closest('.row-action-menu')) {
          closeAll();
        }
      });

      /* Esc closes all */
      root.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          var openMenu = root.querySelector('.row-action-menu.is-open');
          if (openMenu) {
            closeAll();
            var btn = openMenu.previousElementSibling;
            if (btn && btn.classList.contains('row-action-btn')) btn.focus();
          }
        }
      });

      /* Keyboard nav within open menus */
      root.addEventListener('keydown', function (e) {
        var menu = e.target.closest('.row-action-menu.is-open');
        if (!menu) return;
        var items = Array.prototype.slice.call(
          menu.querySelectorAll('[role="menuitem"]:not([disabled])')
        );
        if (!items.length) return;
        var idx = items.indexOf(e.target);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          items[(idx + 1) % items.length].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          items[(idx - 1 + items.length) % items.length].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1].focus();
        }
      });
    };

    /* 4. validateAndSubmit ──────────────────────────────────────────────── */
    _P.validateAndSubmit = function (form, rules, onSuccess) {
      if (!form) return false;
      var valid = false;
      if (window.TUI && typeof TUI.validateForm === 'function') {
        valid = TUI.validateForm(form, rules || {});
      } else {
        /* fallback: check required fields */
        valid = true;
        var requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(function (field) {
          if (!field.value || !field.value.trim()) {
            valid = false;
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        });
      }

      if (valid) {
        if (typeof onSuccess === 'function') onSuccess();
        /* close the containing modal if there is one */
        var modalEl = form.closest('.modal');
        if (modalEl && modalEl.id && window.TUI && typeof TUI.modal === 'object') {
          TUI.modal.close(modalEl.id);
        }
        return true;
      } else {
        /* focus first invalid field */
        var firstInvalid = form.querySelector('[aria-invalid="true"], .error, :invalid');
        if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        return false;
      }
    };

    /* 5. _confirmModal ──────────────────────────────────────────────────── */
    _P._confirmModal = function (modalId, message, onConfirm) {
      var modal = document.getElementById(modalId);
      if (!modal) return;

      /* set the confirm message */
      var msgEl = modal.querySelector('[data-confirm-msg]');
      if (msgEl && message != null) msgEl.textContent = message;

      /* open the modal */
      if (window.TUI && typeof TUI.modal === 'object' && typeof TUI.modal.open === 'function') {
        TUI.modal.open(modalId);
      } else {
        modal.classList.remove('hidden');
        modal.removeAttribute('hidden');
      }

      /* wire confirm button — clone to remove any previous listener */
      var okBtn = modal.querySelector('[data-confirm-ok]');
      if (okBtn) {
        var okClone = okBtn.cloneNode(true);
        okBtn.parentNode.replaceChild(okClone, okBtn);
        okClone.addEventListener('click', function () {
          if (typeof onConfirm === 'function') onConfirm();
          if (window.TUI && typeof TUI.modal === 'object') {
            TUI.modal.close(modalId);
          } else {
            modal.classList.add('hidden');
          }
        });
      }

      /* wire cancel button — clone to remove any previous listener */
      var cancelBtn = modal.querySelector('[data-confirm-cancel]');
      if (cancelBtn) {
        var cancelClone = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(cancelClone, cancelBtn);
        cancelClone.addEventListener('click', function () {
          if (window.TUI && typeof TUI.modal === 'object') {
            TUI.modal.close(modalId);
          } else {
            modal.classList.add('hidden');
          }
        });
      }
    };

    /* 6. _filterEngine ──────────────────────────────────────────────────── */
    /**
     * @param {object} opts
     * @param {Element}  opts.listEl         — the table/list container holding rows
     * @param {string}   opts.rowSelector    — CSS selector for each row element
     * @param {string}  [opts.searchInputId] — id of the text search input
     * @param {string[]}[opts.filterIds]     — ids of <select> filter elements
     * @param {string}  [opts.sortSelectId]  — id of the <select> sort element
     * @param {Element} [opts.countEl]       — element to display result count text
     * @param {Element} [opts.chipsEl]       — container for active-filter chips
     * @param {Element} [opts.emptyEl]       — element to show when no results
     * @param {Element[]}[opts.segmentBtns]  — segment preset buttons (data-filter-preset JSON)
     * @returns {{ apply: Function, reset: Function }}
     */
    _P._filterEngine = function (opts) {
      if (!opts || !opts.listEl) return { apply: function () {}, reset: function () {} };

      var listEl = opts.listEl;
      var rowSel = opts.rowSelector || 'tr[data-id], [data-id]';
      var searchInput = opts.searchInputId ? document.getElementById(opts.searchInputId) : null;
      var filterEls = (opts.filterIds || [])
        .map(function (id) {
          return document.getElementById(id);
        })
        .filter(Boolean);
      var sortEl = opts.sortSelectId ? document.getElementById(opts.sortSelectId) : null;
      var countEl = opts.countEl || null;
      var chipsEl = opts.chipsEl || null;
      var emptyEl = opts.emptyEl || null;
      var segmentBtns = opts.segmentBtns || [];

      /* current active filter values: { filterElId: value } */
      var _activeFilters = {};

      function getRows() {
        return Array.prototype.slice.call(listEl.querySelectorAll(rowSel));
      }

      function matchesSearch(row, query) {
        if (!query) return true;
        var q = query.toLowerCase();
        var name = (row.dataset.name || '').toLowerCase();
        var owner = (row.dataset.owner || '').toLowerCase();
        var email = (row.dataset.email || '').toLowerCase();
        return name.indexOf(q) !== -1 || owner.indexOf(q) !== -1 || email.indexOf(q) !== -1;
      }

      function matchesFilters(row) {
        return filterEls.every(function (sel) {
          var val = sel.value;
          if (!val || val === '' || val === 'all') return true;
          /* derive the data-attribute key from the select id or name */
          var key = sel.dataset.filterKey || sel.name || sel.id;
          /* strip common id prefixes like "filter-" */
          key = key.replace(/^filter[-_]/, '').replace(/[-_]/g, '-');
          var rowVal = row.dataset[camelCase(key)] || '';
          return rowVal === val;
        });
      }

      function camelCase(str) {
        return str.replace(/-([a-z])/g, function (_, c) {
          return c.toUpperCase();
        });
      }

      function sortRows(rows) {
        if (!sortEl || !sortEl.value) return rows;
        var sortVal = sortEl.value;
        var attrKey = camelCase(sortVal.replace(/^sort[-_]/, ''));

        return rows.slice().sort(function (a, b) {
          var aVal = a.dataset[attrKey] || a.dataset[sortVal] || '';
          var bVal = b.dataset[attrKey] || b.dataset[sortVal] || '';

          /* numeric sort if both look like numbers */
          var aNum = parseFloat(aVal);
          var bNum = parseFloat(bVal);
          if (!isNaN(aNum) && !isNaN(bNum)) return bNum - aNum;

          /* date sort */
          var aDate = Date.parse(aVal);
          var bDate = Date.parse(bVal);
          if (!isNaN(aDate) && !isNaN(bDate)) return bDate - aDate;

          /* string sort */
          return aVal.localeCompare(bVal, 'ar', { sensitivity: 'base' });
        });
      }

      function renderChips() {
        if (!chipsEl) return;
        chipsEl.innerHTML = '';

        var query = searchInput ? searchInput.value.trim() : '';
        if (query) {
          chipsEl.appendChild(
            makeChip('بحث: ' + query, function () {
              searchInput.value = '';
              apply();
            })
          );
        }

        filterEls.forEach(function (sel) {
          if (!sel.value || sel.value === '' || sel.value === 'all') return;
          var label = sel.options[sel.selectedIndex]
            ? sel.options[sel.selectedIndex].text
            : sel.value;
          var capturedSel = sel;
          chipsEl.appendChild(
            makeChip(label, function () {
              capturedSel.value = '';
              apply();
            })
          );
        });
      }

      function makeChip(label, onRemove) {
        var chip = document.createElement('span');
        chip.className =
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs';
        chip.textContent = label;

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.setAttribute('aria-label', 'إزالة الفلتر: ' + label);
        removeBtn.className = 'ml-1 text-slate-500 hover:text-slate-800 focus:outline-none';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', function () {
          if (typeof onRemove === 'function') onRemove();
        });

        chip.appendChild(removeBtn);
        return chip;
      }

      function apply() {
        var query = searchInput ? searchInput.value.trim() : '';
        var rows = getRows();
        var visible = [];

        rows.forEach(function (row) {
          var show = matchesSearch(row, query) && matchesFilters(row);
          row.style.display = show ? '' : 'none';
          if (show) visible.push(row);
        });

        /* sort visible rows in the DOM */
        var sorted = sortRows(visible);
        if (sorted.length && listEl) {
          /* find the parent of rows (tbody, ul, etc.) */
          var parent = sorted[0].parentElement;
          if (parent) {
            sorted.forEach(function (row) {
              parent.appendChild(row);
            });
          }
        }

        /* update count */
        if (countEl) {
          countEl.textContent = visible.length + ' نتيجة';
          countEl.setAttribute('aria-live', 'polite');
        }

        /* render chips */
        renderChips();

        /* show/hide empty state */
        if (emptyEl) {
          emptyEl.style.display = visible.length === 0 ? '' : 'none';
        }
      }

      function reset() {
        if (searchInput) searchInput.value = '';
        filterEls.forEach(function (sel) {
          sel.value = '';
        });
        if (sortEl) sortEl.value = '';
        apply();
      }

      /* wire up live events */
      if (searchInput) {
        searchInput.addEventListener('input', apply);
      }
      filterEls.forEach(function (sel) {
        sel.addEventListener('change', apply);
      });
      if (sortEl) {
        sortEl.addEventListener('change', apply);
      }

      /* segment buttons: each should have data-filter-preset='{"plan":"enterprise"}' */
      segmentBtns.forEach(function (btn) {
        if (!btn) return;
        btn.addEventListener('click', function () {
          reset();
          try {
            var preset = JSON.parse(btn.dataset.filterPreset || '{}');
            filterEls.forEach(function (sel) {
              var key = sel.dataset.filterKey || sel.name || sel.id;
              key = key.replace(/^filter[-_]/, '');
              if (preset[key] !== undefined) {
                sel.value = preset[key];
              }
            });
          } catch (e) {
            /* malformed preset — ignore */
          }
          apply();
        });
      });

      return { apply: apply, reset: reset };
    };

    /* 7. slugify ─────────────────────────────────────────────────────────── */
    _P.slugify = function (str) {
      return String(str || '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9؀-ۿ-]/g, '');
    };
  }

  /* ─── Per-page controllers (T015/T018/T021/T024/T027/T030/T033) ──────── */

  /* ── T015: admin-overview controller ─────────────────────────────────── */
  function initOverview() {
    var toast = _P._toast;

    /* 1. Row action menus ───────────────────────────────────────────────── */
    _P._initRowActionMenus(document);

    /* After a menu item is clicked, close the menu.
       Suspend items set #suspend-company-name then open the confirm modal. */
    document.addEventListener('click', function (e) {
      var item = e.target.closest('[role="menuitem"]');
      if (!item) return;

      /* Close the open row-action menu */
      var menu = item.closest('.row-action-menu');
      if (menu) {
        menu.classList.remove('is-open');
        var btn = menu.previousElementSibling;
        if (btn && btn.classList.contains('row-action-btn')) {
          btn.setAttribute('aria-expanded', 'false');
        }
      }

      /* Suspend action: populate the confirm modal's company name */
      if (item.dataset.modalOpen === 'modal-suspend-company') {
        var nameEl = document.getElementById('suspend-company-name');
        if (nameEl) nameEl.textContent = item.dataset.companyName || '—';
      }
    });

    /* 2. Suspend confirm button ─────────────────────────────────────────── */
    var btnConfirmSuspend = document.getElementById('btn-confirm-suspend');
    if (btnConfirmSuspend) {
      btnConfirmSuspend.addEventListener('click', function () {
        var nameEl = document.getElementById('suspend-company-name');
        var name = nameEl ? nameEl.textContent : '—';
        /* close modal via TUI or manually */
        if (window.TUI && typeof TUI.modal === 'object' && typeof TUI.modal.close === 'function') {
          TUI.modal.close('modal-suspend-company');
        } else {
          var modal = document.getElementById('modal-suspend-company');
          if (modal) {
            modal.setAttribute('hidden', '');
          }
        }
        toast('إجراء تجريبي — تم تعليق "' + name + '" (لا يحدث فعليًا)', 'warning');
      });
    }

    /* 3. Add-company form ──────────────────────────────────────────────── */
    var formAddCo = document.getElementById('form-add-company');
    if (formAddCo) {
      formAddCo.addEventListener('submit', function (e) {
        e.preventDefault();
        _P.validateAndSubmit(formAddCo, { company_name: true, owner_email: true }, function () {
          toast('إجراء تجريبي — تمت إضافة الشركة (لا يتم الحفظ على خادم)', 'success');
          formAddCo.reset();
        });
      });
      /* btn-add-company-submit also submits via form="" attribute; handled above */
    }

    /* 4. Change-plan form ──────────────────────────────────────────────── */
    var formChangePlan = document.getElementById('form-change-plan');
    if (formChangePlan) {
      formChangePlan.addEventListener('submit', function (e) {
        e.preventDefault();
        _P.validateAndSubmit(formChangePlan, { new_plan: true }, function () {
          toast('إجراء تجريبي — تم تغيير الخطة (لا تُسوَّى مدفوعات)', 'success');
          formChangePlan.reset();
        });
      });
    }

    /* 5. Checklist toggle + aria-live remaining count ───────────────────── */
    var checklist = document.getElementById('overview-checklist');
    var remainingBadge = document.getElementById('checklist-remaining');

    function updateChecklistCount() {
      if (!checklist || !remainingBadge) return;
      var items = checklist.querySelectorAll('input[type="checkbox"]');
      var remaining = 0;
      items.forEach(function (cb) {
        if (!cb.checked) remaining++;
      });
      remainingBadge.textContent = remaining + (remaining === 1 ? ' متبقية' : ' متبقية');
      if (remaining === 0) {
        remainingBadge.className = 'admin-badge badge-active';
        remainingBadge.textContent = 'مكتملة ✓';
      } else {
        remainingBadge.className = 'admin-badge badge-warning';
      }
    }

    if (checklist) {
      checklist.addEventListener('change', function (e) {
        if (e.target.type !== 'checkbox') return;
        var item = e.target.closest('.admin-checklist-item');
        if (item) item.classList.toggle('is-done', e.target.checked);
        updateChecklistCount();
      });
      updateChecklistCount();
    }

    /* 6. data-coming-soon buttons (export, settings) ───────────────────── */
    /* main.js handles [data-coming-soon] globally; no override needed here */

    /* 7. data-toast buttons (integration cards, alert buttons, contact-owner)
          main.js handles [data-toast] declaratively; no override needed.   */

    /* 8. Export button (inside topbar quick-action dropdown) ───────────── */
    document.querySelectorAll('[data-coming-soon]').forEach(function (el) {
      /* Already handled by main.js declarative data-coming-soon.
         No additional wiring needed. */
    });
  }
  /* ── T018: admin-companies controller ───────────────────────────────── */
  function initCompanies() {
    var toast = _P._toast;

    /* ── 1. Row action menus ─────────────────────────────────────────────── */
    _P._initRowActionMenus(document);

    /* ── 2. Filter / Sort / Search engine ────────────────────────────────── */
    var tbody = document.getElementById('co-tbody');
    var searchInput = document.getElementById('co-search');
    var countEl = document.getElementById('co-count');
    var chipsEl = document.getElementById('co-chips');
    var chipsPh = document.getElementById('co-chips-ph');
    var emptyEl = document.getElementById('co-empty');
    var resetBtn = document.getElementById('btn-reset-filters');
    var emptyReset = document.getElementById('btn-empty-reset');

    var filterIds = [
      'f-plan',
      'f-sub-status',
      'f-co-status',
      'f-country',
      'f-activity',
      'f-integrations',
      'f-trial',
      'f-payment',
    ];
    var filterEls = filterIds
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    var sortBtns = document.querySelectorAll('.co-sort-btn');
    var _currentSort = 'newest';

    /* today as YYYY-MM-DD */
    var _today = new Date();
    _today.setHours(0, 0, 0, 0);

    function _daysDiff(dateStr) {
      if (!dateStr) return Infinity;
      var d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      return Math.round((d - _today) / 86400000);
    }

    function matchRow(row) {
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';

      /* full-text search across visible cell text */
      if (q) {
        var nameSp = row.querySelector('.co-company-name');
        var ownerTd = row.querySelector('[data-label="المالك"]');
        var emailTd = row.querySelector('[data-label="البريد الإلكتروني"] span');
        var nameStr = nameSp ? nameSp.textContent.toLowerCase() : '';
        var ownerStr = ownerTd ? ownerTd.textContent.toLowerCase() : '';
        var emailStr = emailTd ? emailTd.textContent.toLowerCase() : '';
        if (nameStr.indexOf(q) === -1 && ownerStr.indexOf(q) === -1 && emailStr.indexOf(q) === -1)
          return false;
      }

      var plan = row.dataset.plan || '';
      var subStatus = row.dataset.subStatus || '';
      var coStatus = row.dataset.coStatus || '';
      var country = row.dataset.country || '';
      var lastActive = row.dataset.lastActive || '';
      var integrations = parseInt(row.dataset.integrations || '0', 10);
      var trialEnds = row.dataset.trialEnds || '';

      /* plan */
      var fPlan = document.getElementById('f-plan');
      if (fPlan && fPlan.value && fPlan.value !== plan) return false;

      /* sub-status */
      var fSub = document.getElementById('f-sub-status');
      if (fSub && fSub.value && fSub.value !== subStatus) return false;

      /* co-status */
      var fCo = document.getElementById('f-co-status');
      if (fCo && fCo.value && fCo.value !== coStatus) return false;

      /* country */
      var fCountry = document.getElementById('f-country');
      if (fCountry && fCountry.value && fCountry.value !== country) return false;

      /* activity */
      var fActivity = document.getElementById('f-activity');
      if (fActivity && fActivity.value && lastActive) {
        var daysSinceActive = -_daysDiff(lastActive);
        if (fActivity.value === 'today' && daysSinceActive > 0) return false;
        if (fActivity.value === 'week' && daysSinceActive > 7) return false;
        if (fActivity.value === 'month' && daysSinceActive > 30) return false;
      }

      /* integrations */
      var fInt = document.getElementById('f-integrations');
      if (fInt && fInt.value) {
        if (fInt.value === 'has-integrations' && integrations === 0) return false;
        if (fInt.value === 'no-integrations' && integrations > 0) return false;
        if (fInt.value === 'all-integrations' && integrations !== 8) return false;
      }

      /* trial ending */
      var fTrial = document.getElementById('f-trial');
      if (fTrial && fTrial.value && trialEnds) {
        var daysUntilTrial = _daysDiff(trialEnds);
        if (fTrial.value === 'ending-week' && (daysUntilTrial < 0 || daysUntilTrial > 7))
          return false;
        if (fTrial.value === 'ending-month' && (daysUntilTrial < 0 || daysUntilTrial > 30))
          return false;
      } else if (fTrial && fTrial.value && !trialEnds) {
        return false;
      }

      /* payment */
      var fPay = document.getElementById('f-payment');
      if (fPay && fPay.value) {
        if (fPay.value === 'overdue' && coStatus !== 'past-due') return false;
        if (fPay.value === 'paid' && coStatus === 'past-due') return false;
      }

      return true;
    }

    var _planOrder = { enterprise: 4, pro: 3, growth: 2, starter: 1 };

    function sortedRows(visible) {
      return visible.slice().sort(function (a, b) {
        switch (_currentSort) {
          case 'last-active':
            return (b.dataset.lastActive || '').localeCompare(a.dataset.lastActive || '');
          case 'booking-requests':
            return (
              parseInt(b.dataset.bookingRequests || '0', 10) -
              parseInt(a.dataset.bookingRequests || '0', 10)
            );
          case 'mrr':
            return parseInt(b.dataset.mrr || '0', 10) - parseInt(a.dataset.mrr || '0', 10);
          case 'trial-ends': {
            var da = _daysDiff(a.dataset.trialEnds);
            var db = _daysDiff(b.dataset.trialEnds);
            if (da === Infinity && db === Infinity) return 0;
            if (da === Infinity) return 1;
            if (db === Infinity) return -1;
            return da - db;
          }
          case 'plan':
            return (_planOrder[b.dataset.plan] || 0) - (_planOrder[a.dataset.plan] || 0);
          default: /* newest — original DOM order */
            return 0;
        }
      });
    }

    function renderChips() {
      if (!chipsEl) return;
      chipsEl.innerHTML = '';

      var any = false;
      var q = searchInput ? searchInput.value.trim() : '';
      if (q) {
        any = true;
        chipsEl.appendChild(
          _makeChip('بحث: ' + q, function () {
            searchInput.value = '';
            applyFilters();
          })
        );
      }
      filterEls.forEach(function (sel) {
        if (!sel || !sel.value) return;
        any = true;
        var label = sel.options[sel.selectedIndex]
          ? sel.options[sel.selectedIndex].text
          : sel.value;
        var cap = sel;
        chipsEl.appendChild(
          _makeChip(label, function () {
            cap.value = '';
            applyFilters();
          })
        );
      });
      if (chipsPh) chipsPh.hidden = any;
    }

    function _makeChip(label, onRemove) {
      var chip = document.createElement('span');
      chip.className = 'admin-chip';
      chip.textContent = label + ' ';
      var x = document.createElement('button');
      x.type = 'button';
      x.className = 'admin-chip-remove';
      x.setAttribute('aria-label', 'إزالة ' + label);
      x.innerHTML = '&times;';
      x.addEventListener('click', onRemove);
      chip.appendChild(x);
      return chip;
    }

    function applyFilters() {
      if (!tbody) return;
      var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr[data-id]'));
      var visible = [];

      rows.forEach(function (row) {
        var show = matchRow(row);
        row.style.display = show ? '' : 'none';
        if (show) visible.push(row);
      });

      /* re-order in DOM */
      var ordered = sortedRows(visible);
      if (ordered.length) {
        ordered.forEach(function (row) {
          tbody.appendChild(row);
        });
      }

      /* count */
      if (countEl) countEl.textContent = 'عرض ' + visible.length + ' شركة';

      /* chips */
      renderChips();

      /* empty state */
      if (emptyEl) emptyEl.hidden = visible.length > 0;
    }

    function resetFilters() {
      if (searchInput) searchInput.value = '';
      filterEls.forEach(function (sel) {
        if (sel) sel.value = '';
      });
      /* reset sort to default */
      _currentSort = 'newest';
      sortBtns.forEach(function (btn) {
        var isDefault = btn.dataset.sort === 'newest';
        btn.classList.toggle('is-active', isDefault);
        btn.setAttribute('aria-pressed', isDefault ? 'true' : 'false');
      });
      /* clear segment active state */
      document.querySelectorAll('.co-segment-card[aria-pressed="true"]').forEach(function (btn) {
        btn.setAttribute('aria-pressed', 'false');
      });
      var segClearBtn = document.getElementById('btn-clear-segment');
      if (segClearBtn) segClearBtn.hidden = true;
      applyFilters();
    }

    /* Wire search + filters */
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    filterEls.forEach(function (sel) {
      if (sel) sel.addEventListener('change', applyFilters);
    });
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (emptyReset) emptyReset.addEventListener('click', resetFilters);

    /* Sort buttons */
    sortBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        _currentSort = btn.dataset.sort || 'newest';
        sortBtns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        applyFilters();
      });
    });

    /* ── 3. Segment filter cards ─────────────────────────────────────────── */
    var segClearBtn = document.getElementById('btn-clear-segment');
    document.querySelectorAll('.co-segment-card').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var seg = btn.dataset.segment;
        var wasActive = btn.getAttribute('aria-pressed') === 'true';

        /* deactivate all */
        document.querySelectorAll('.co-segment-card').forEach(function (b) {
          b.setAttribute('aria-pressed', 'false');
        });

        if (!wasActive) {
          btn.setAttribute('aria-pressed', 'true');
          if (segClearBtn) segClearBtn.hidden = false;

          /* reset filters first, then apply preset */
          if (searchInput) searchInput.value = '';
          filterEls.forEach(function (sel) {
            if (sel) sel.value = '';
          });

          /* apply segment preset */
          var fSub = document.getElementById('f-sub-status');
          var fCo = document.getElementById('f-co-status');
          var fPlan = document.getElementById('f-plan');
          switch (seg) {
            case 'trial-ending':
              if (fSub) fSub.value = 'trial';
              break;
            case 'past-due':
              if (fCo) fCo.value = 'past-due';
              break;
            case 'enterprise':
              if (fPlan) fPlan.value = 'enterprise';
              break;
            case 'needs-review':
              if (fSub) fSub.value = 'manual-review';
              break;
            case 'no-activity': {
              var fAct = document.getElementById('f-activity');
              if (fAct) fAct.value = 'month';
              break;
            }
            case 'integration-issues': {
              var fInt = document.getElementById('f-integrations');
              if (fInt) fInt.value = 'no-integrations';
              break;
            }
            /* high-usage: no direct filter map — just show toast hint */
            default:
              toast('فلتر الشريحة لا يتوافق مع خيار تصفية متاح — استخدم البحث', 'info');
              break;
          }
          applyFilters();
        } else {
          if (segClearBtn) segClearBtn.hidden = true;
          resetFilters();
        }
      });
    });
    if (segClearBtn) {
      segClearBtn.addEventListener('click', function () {
        resetFilters();
        if (segClearBtn) segClearBtn.hidden = true;
      });
    }

    /* initial render */
    applyFilters();

    /* ── 4. Select-all + row checkboxes + bulk bar ───────────────────────── */
    var selectAll = document.getElementById('co-select-all');
    var bulkBar = document.getElementById('co-bulk-bar');
    var bulkCount = document.getElementById('co-bulk-count');
    var selectedLabel = document.getElementById('co-selected-label');

    function getVisibleCheckboxes() {
      if (!tbody) return [];
      return Array.prototype.slice.call(
        tbody.querySelectorAll('tr[data-id]:not([style*="none"]) .co-row-check')
      );
    }

    function getCheckedCheckboxes() {
      if (!tbody) return [];
      return Array.prototype.slice.call(
        tbody.querySelectorAll('tr[data-id] .co-row-check:checked')
      );
    }

    function updateBulkBar() {
      var checked = getCheckedCheckboxes();
      var n = checked.length;
      if (bulkCount) bulkCount.textContent = n;
      if (bulkBar) bulkBar.style.display = n > 0 ? 'flex' : 'none';
      if (selectedLabel) {
        selectedLabel.hidden = n === 0;
        selectedLabel.textContent = n + ' شركات محددة';
      }
      /* update select-all indeterminate state */
      if (selectAll) {
        var total = getVisibleCheckboxes().length;
        selectAll.checked = total > 0 && n === total;
        selectAll.indeterminate = n > 0 && n < total;
      }
      /* update bulk-suspend confirm count */
      var mbs = document.getElementById('mbs-count');
      if (mbs) mbs.textContent = n;
    }

    if (selectAll) {
      selectAll.addEventListener('change', function () {
        var cbs = getVisibleCheckboxes();
        cbs.forEach(function (cb) {
          cb.checked = selectAll.checked;
        });
        updateBulkBar();
      });
    }

    if (tbody) {
      tbody.addEventListener('change', function (e) {
        if (e.target.classList.contains('co-row-check')) {
          /* sync select-all */
          var allVisible = getVisibleCheckboxes();
          var allChecked = allVisible.every(function (cb) {
            return cb.checked;
          });
          if (selectAll) {
            selectAll.checked = allVisible.length > 0 && allChecked;
            selectAll.indeterminate =
              !allChecked &&
              allVisible.some(function (cb) {
                return cb.checked;
              });
          }
          updateBulkBar();
        }
      });
    }

    /* Bulk action buttons */
    var bulkActions = [
      {
        id: 'btn-bulk-plan',
        msg: 'إجراء تجريبي — سيتم تغيير الخطة للشركات المحددة (لا يتم التغيير فعليًا)',
      },
      { id: 'btn-bulk-trial', msg: 'إجراء تجريبي — سيتم تمديد التجربة (لا يتم فعليًا)' },
      { id: 'btn-bulk-note', msg: 'إجراء تجريبي — ستُضاف الملاحظة للمحددة (لا يتم الحفظ)' },
      { id: 'btn-bulk-export', msg: 'إجراء تجريبي — لا يتم إنشاء ملف فعلي' },
    ];
    bulkActions.forEach(function (action) {
      var btn = document.getElementById(action.id);
      if (btn) {
        btn.addEventListener('click', function () {
          toast(action.msg, 'info');
        });
      }
    });

    /* Bulk suspend confirm */
    var btnConfirmBulk = document.getElementById('btn-confirm-bulk-suspend');
    if (btnConfirmBulk) {
      btnConfirmBulk.addEventListener('click', function () {
        var n = getCheckedCheckboxes().length;
        toast('إجراء تجريبي — تم إيقاف ' + n + ' شركات (لا يحدث فعليًا)', 'warning');
        /* uncheck all + hide bulk bar */
        getCheckedCheckboxes().forEach(function (cb) {
          cb.checked = false;
        });
        if (selectAll) {
          selectAll.checked = false;
          selectAll.indeterminate = false;
        }
        updateBulkBar();
      });
    }

    /* ── 5. Row menus → modal population ────────────────────────────────── */
    document.addEventListener('click', function (e) {
      var item = e.target.closest('[role="menuitem"]');
      if (!item) return;

      /* close open row menu */
      var menu = item.closest('.row-action-menu');
      if (menu) {
        menu.classList.remove('is-open');
        var btn = menu.previousElementSibling;
        if (btn && btn.classList.contains('row-action-btn'))
          btn.setAttribute('aria-expanded', 'false');
      }

      var target = item.dataset.modalOpen;

      /* Change Plan — populate company + current plan */
      if (target === 'modal-change-plan') {
        var cpDisp = document.getElementById('mcp-company-display');
        var cpPlan = document.getElementById('mcp-current-plan-display');
        if (cpDisp) cpDisp.textContent = item.dataset.companyName || '—';
        if (cpPlan) cpPlan.textContent = item.dataset.currentPlan || '—';
      }

      /* Suspend / Reactivate — populate company + action label */
      if (target === 'modal-suspend') {
        var msDisp = document.getElementById('ms-company-display');
        var msTitle = document.getElementById('ms-title');
        var msLabel = document.getElementById('ms-action-label');
        var coAction = item.dataset.coAction || 'suspend';
        if (msDisp) msDisp.textContent = item.dataset.companyName || '—';
        if (msTitle)
          msTitle.textContent = coAction === 'reactivate' ? 'إعادة تفعيل الشركة' : 'إيقاف الشركة';
        if (msLabel)
          msLabel.textContent = coAction === 'reactivate' ? 'تفعيل (تجريبي)' : 'إيقاف (تجريبي)';
        if (msDisp) msDisp.dataset.coAction = coAction;
        if (msDisp) msDisp.dataset.coId = item.dataset.companyId || '';
      }

      /* Add Note — populate company */
      if (target === 'modal-add-note') {
        var manDisp = document.getElementById('man-company-display');
        if (manDisp) manDisp.textContent = item.dataset.companyName || '—';
      }

      /* Login-as: show safety toast (item is disabled but handle click defensively) */
      if (item.classList.contains('login-as-disabled')) {
        e.preventDefault();
        toast(
          'لا يتم تسجيل الدخول كالشركة فعليًا — ميزة الانتحال غير مفعّلة في هذه النسخة',
          'warning'
        );
        return;
      }
    });

    /* ── 6. Add Company form ─────────────────────────────────────────────── */
    var formAddCo = document.getElementById('form-add-company');
    if (formAddCo) {
      formAddCo.addEventListener('submit', function (e) {
        e.preventDefault();
        var nameField = formAddCo.querySelector('#mac-company-name');
        var ownerField = formAddCo.querySelector('#mac-owner-name');
        var emailField = formAddCo.querySelector('#mac-owner-email');
        var valid = true;

        [nameField, ownerField].forEach(function (field) {
          if (!field) return;
          var err = document.getElementById(field.id + '-err');
          if (!field.value.trim()) {
            valid = false;
            field.setAttribute('aria-invalid', 'true');
            if (err) {
              err.textContent = 'هذا الحقل مطلوب';
              err.hidden = false;
            }
          } else {
            field.removeAttribute('aria-invalid');
            if (err) err.hidden = true;
          }
        });

        if (emailField) {
          var emailErr = document.getElementById('mac-owner-email-err');
          var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailField.value.trim() || !emailRe.test(emailField.value.trim())) {
            valid = false;
            emailField.setAttribute('aria-invalid', 'true');
            if (emailErr) {
              emailErr.textContent = !emailField.value.trim()
                ? 'هذا الحقل مطلوب'
                : 'بريد إلكتروني غير صالح';
              emailErr.hidden = false;
            }
          } else {
            emailField.removeAttribute('aria-invalid');
            if (emailErr) emailErr.hidden = true;
          }
        }

        if (!valid) return;

        var coName = nameField ? nameField.value.trim() : 'شركة جديدة';
        toast('إجراء تجريبي — تمت إضافة "' + coName + '" (لا يتم الحفظ على خادم)', 'success');
        formAddCo.reset();
        if (window.TUI && TUI.modal) TUI.modal.close('modal-add-company');
      });
    }

    /* ── 7. Change Plan form ─────────────────────────────────────────────── */
    var formChangePlan = document.getElementById('form-change-plan');
    if (formChangePlan) {
      formChangePlan.addEventListener('submit', function (e) {
        e.preventDefault();
        var newPlanSel = document.getElementById('mcp-new-plan');
        if (!newPlanSel || !newPlanSel.value) {
          if (newPlanSel) newPlanSel.setAttribute('aria-invalid', 'true');
          toast('يرجى اختيار الخطة الجديدة', 'error');
          return;
        }
        newPlanSel.removeAttribute('aria-invalid');
        var cpDisp = document.getElementById('mcp-company-display');
        var co = cpDisp ? cpDisp.textContent : '—';
        toast(
          'إجراء تجريبي — تم تغيير خطة "' +
            co +
            '" إلى ' +
            newPlanSel.value +
            ' (لا تُسوَّى مدفوعات)',
          'success'
        );
        formChangePlan.reset();
        if (window.TUI && TUI.modal) TUI.modal.close('modal-change-plan');
      });
    }

    /* ── 8. Suspend / Reactivate form ────────────────────────────────────── */
    var formSuspend = document.getElementById('form-suspend');
    if (formSuspend) {
      formSuspend.addEventListener('submit', function (e) {
        e.preventDefault();
        var reasonField = document.getElementById('ms-reason');
        var reasonErr = document.getElementById('ms-reason-err');
        if (!reasonField || !reasonField.value.trim()) {
          if (reasonField) reasonField.setAttribute('aria-invalid', 'true');
          if (reasonErr) {
            reasonErr.textContent = 'سبب الإجراء مطلوب';
            reasonErr.hidden = false;
          }
          if (reasonField) reasonField.focus();
          return;
        }
        reasonField.removeAttribute('aria-invalid');
        if (reasonErr) reasonErr.hidden = true;

        var msDisp = document.getElementById('ms-company-display');
        var coName = msDisp ? msDisp.textContent : '—';
        var coAction = msDisp ? msDisp.dataset.coAction : 'suspend';
        var actionLabel = coAction === 'reactivate' ? 'إعادة تفعيل' : 'إيقاف';
        toast('إجراء تجريبي — ' + actionLabel + ' "' + coName + '" (لا يحدث فعليًا)', 'warning');
        formSuspend.reset();
        if (window.TUI && TUI.modal) TUI.modal.close('modal-suspend');
      });
    }

    /* ── 9. Add Note form ────────────────────────────────────────────────── */
    var formAddNote = document.getElementById('form-add-note');
    if (formAddNote) {
      formAddNote.addEventListener('submit', function (e) {
        e.preventDefault();
        var noteField = document.getElementById('man-note');
        var noteErr = document.getElementById('man-note-err');
        if (!noteField || !noteField.value.trim()) {
          if (noteField) noteField.setAttribute('aria-invalid', 'true');
          if (noteErr) {
            noteErr.textContent = 'الملاحظة مطلوبة';
            noteErr.hidden = false;
          }
          if (noteField) noteField.focus();
          return;
        }
        noteField.removeAttribute('aria-invalid');
        if (noteErr) noteErr.hidden = true;

        var manDisp = document.getElementById('man-company-display');
        var coName = manDisp ? manDisp.textContent : '—';
        toast(
          'إجراء تجريبي — تمت إضافة ملاحظة لـ"' + coName + '" (لا يتم الحفظ على خادم)',
          'success'
        );
        formAddNote.reset();
        if (window.TUI && TUI.modal) TUI.modal.close('modal-add-note');
      });
    }

    /* ── 10. Export button ───────────────────────────────────────────────── */
    document.querySelectorAll('[data-co-export]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toast('إجراء تجريبي — لا يتم إنشاء ملف فعلي في هذه النسخة', 'info');
      });
    });
  }
  /* ── T021: admin-company-details controller ─────────────────────────── */
  function initCompanyDetails() {
    var toast = _P._toast;

    /* ── helpers ─────────────────────────────────────────────────────────── */
    function closeModal(id) {
      if (window.TUI && TUI.modal && typeof TUI.modal.close === 'function') {
        TUI.modal.close(id);
      } else {
        var m = document.getElementById(id);
        if (m) m.setAttribute('hidden', '');
      }
    }

    function requireField(elId, errId, msg) {
      var el = document.getElementById(elId);
      var err = document.getElementById(errId);
      if (!el || !el.value || !el.value.trim()) {
        if (el) el.setAttribute('aria-invalid', 'true');
        if (err) {
          err.textContent = msg || 'هذا الحقل مطلوب';
          err.hidden = false;
        }
        return false;
      }
      if (el) el.removeAttribute('aria-invalid');
      if (err) err.hidden = true;
      return true;
    }

    function clearField(elId, errId) {
      var el = document.getElementById(elId);
      var err = document.getElementById(errId);
      if (el) {
        el.removeAttribute('aria-invalid');
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
      }
      if (err) err.hidden = true;
    }

    /* ── 1. Optional ?id= param → update company labels ─────────────────── */
    (function () {
      var params = new URLSearchParams(window.location.search);
      var id = params.get('id');
      if (!id) return;
      /* mirror company id in display spans */
      document.querySelectorAll('[data-cd-id]').forEach(function (el) {
        el.textContent = id;
      });
      /* in a real app we'd fetch /api/companies/:id here */
    })();

    /* ── 2. FAQ accordion ────────────────────────────────────────────────── */
    document.querySelectorAll('.admin-faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        /* collapse all others first */
        document.querySelectorAll('.admin-faq-q').forEach(function (other) {
          if (other !== btn) other.setAttribute('aria-expanded', 'false');
        });
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });

    /* ── 3. Invoice actions (view / download / send) ─────────────────────── */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-invoice-view],[data-invoice-download],[data-invoice-send]');
      if (!btn) return;
      var inv = btn.dataset.invoiceView || btn.dataset.invoiceDownload || btn.dataset.invoiceSend;
      if (btn.dataset.invoiceView)
        toast('إجراء تجريبي — عرض الفاتورة ' + inv + ' (لا توجد فاتورة حقيقية)', 'info');
      if (btn.dataset.invoiceDownload)
        toast('إجراء تجريبي — تحميل الفاتورة ' + inv + ' (لا يتم إنشاء ملف فعلي)', 'info');
      if (btn.dataset.invoiceSend)
        toast('إجراء تجريبي — إرسال الفاتورة ' + inv + ' (لا يُرسل بريد إلكتروني فعلي)', 'info');
    });

    /* ── 4. Login-as disabled button → open safety modal ────────────────── */
    document.querySelectorAll('.login-as-disabled').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        /* open the safety info modal instead of just a toast */
        if (window.TUI && TUI.modal && typeof TUI.modal.open === 'function') {
          TUI.modal.open('modal-cd-login-as');
        } else {
          toast('لا يتم تسجيل الدخول كالشركة فعليًا — ميزة الانتحال معطّلة دائمًا', 'warning');
        }
      });
    });

    /* ── 5. Change Plan modal confirm ────────────────────────────────────── */
    var btnChangePlan = document.getElementById('btn-confirm-cd-change-plan');
    if (btnChangePlan) {
      btnChangePlan.addEventListener('click', function () {
        var valid = requireField('mcdcp-new-plan', 'mcdcp-plan-err', 'يرجى اختيار خطة جديدة');
        if (!valid) return;
        var planEl = document.getElementById('mcdcp-new-plan');
        var planName = planEl
          ? (planEl.options[planEl.selectedIndex] || {}).text || planEl.value
          : '—';
        closeModal('modal-cd-change-plan');
        clearField('mcdcp-new-plan', 'mcdcp-plan-err');
        var reasonEl = document.getElementById('mcdcp-reason');
        if (reasonEl) reasonEl.value = '';
        toast(
          'إجراء تجريبي — تم تغيير الخطة إلى "' + planName + '" (لا تُسوَّى مدفوعات حقيقية)',
          'success'
        );
      });
    }

    /* ── 6. Suspend confirm ──────────────────────────────────────────────── */
    var btnSuspend = document.getElementById('btn-confirm-cd-suspend');
    if (btnSuspend) {
      btnSuspend.addEventListener('click', function () {
        var valid = requireField('mcds-reason', 'mcds-reason-err', 'سبب التعليق مطلوب');
        if (!valid) return;
        closeModal('modal-cd-suspend');
        var reasonEl = document.getElementById('mcds-reason');
        if (reasonEl) reasonEl.value = '';
        clearField('mcds-reason', 'mcds-reason-err');
        var notifyEl = document.getElementById('mcds-notify');
        if (notifyEl) notifyEl.checked = false;
        toast('إجراء تجريبي — تم تعليق الشركة (لا يتم تعليق حقيقي في هذه النسخة)', 'warning');
      });
    }

    /* ── 7. Extend trial confirm ─────────────────────────────────────────── */
    var btnExtendTrial = document.getElementById('btn-confirm-cd-extend-trial');
    if (btnExtendTrial) {
      btnExtendTrial.addEventListener('click', function () {
        var valid = requireField('mcdet-days', 'mcdet-days-err', 'يرجى اختيار مدة التمديد');
        if (!valid) return;
        var daysEl = document.getElementById('mcdet-days');
        var days = daysEl ? daysEl.value : '—';
        closeModal('modal-cd-extend-trial');
        if (daysEl) daysEl.selectedIndex = 0;
        clearField('mcdet-days', 'mcdet-days-err');
        var reasonEl = document.getElementById('mcdet-reason');
        if (reasonEl) reasonEl.value = '';
        toast('إجراء تجريبي — تم تمديد فترة التجربة ' + days + ' يومًا (حالة تجريبية)', 'success');
      });
    }

    /* ── 8. Add Note confirm → prepend note card to DOM ─────────────────── */
    var btnAddNote = document.getElementById('btn-confirm-cd-add-note');
    if (btnAddNote) {
      btnAddNote.addEventListener('click', function () {
        var noteEl = document.getElementById('mcdan-note');
        if (!noteEl || !noteEl.value.trim()) {
          noteEl && noteEl.setAttribute('aria-invalid', 'true');
          var noteErr = document.getElementById('mcdan-note-err');
          if (noteErr) {
            noteErr.textContent = 'نص الملاحظة مطلوب';
            noteErr.hidden = false;
          }
          return;
        }
        var noteText = noteEl.value.trim();
        var typeEl = document.getElementById('mcdan-type');
        var typeVal = typeEl ? (typeEl.options[typeEl.selectedIndex] || {}).text || 'عامة' : 'عامة';

        /* prepend new note to list */
        var notesList = document.getElementById('cd-notes-list');
        if (notesList) {
          var now = new Date();
          var dateStr = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
          var div = document.createElement('div');
          div.className = 'cd-note-item';
          div.innerHTML =
            '<div class="cd-note-header">' +
            '<span class="cd-note-type">' +
            typeVal +
            '</span>' +
            '<span class="admin-badge badge-neutral">جديد</span>' +
            '</div>' +
            '<p class="cd-note-text">' +
            noteText.replace(/</g, '&lt;') +
            '</p>' +
            '<div class="cd-note-meta">أحمد الإداري · ' +
            dateStr +
            '</div>';
          notesList.insertBefore(div, notesList.firstChild);
        }

        closeModal('modal-cd-add-note');
        noteEl.value = '';
        noteEl.removeAttribute('aria-invalid');
        var noteErr2 = document.getElementById('mcdan-note-err');
        if (noteErr2) noteErr2.hidden = true;
        if (typeEl) typeEl.selectedIndex = 0;
        var fuEl = document.getElementById('mcdan-followup');
        if (fuEl) fuEl.value = '';
        toast('إجراء تجريبي — تمت إضافة الملاحظة (لا يتم الحفظ على خادم)', 'success');
      });
    }

    /* ── 9. Contact owner confirm ────────────────────────────────────────── */
    var btnContact = document.getElementById('btn-confirm-cd-contact');
    if (btnContact) {
      btnContact.addEventListener('click', function () {
        var subj = requireField('mcdc-subject', 'mcdc-subject-err', 'موضوع الرسالة مطلوب');
        var body = requireField('mcdc-body', 'mcdc-body-err', 'نص الرسالة مطلوب');
        if (!subj || !body) return;
        closeModal('modal-cd-contact');
        var subjectEl = document.getElementById('mcdc-subject');
        var bodyEl = document.getElementById('mcdc-body');
        var channelEl = document.getElementById('mcdc-channel');
        if (subjectEl) subjectEl.value = '';
        if (bodyEl) bodyEl.value = '';
        if (channelEl) channelEl.selectedIndex = 0;
        clearField('mcdc-subject', 'mcdc-subject-err');
        clearField('mcdc-body', 'mcdc-body-err');
        toast(
          'إجراء تجريبي — تم إرسال الرسالة (لا يُرسل بريد إلكتروني حقيقي في هذه النسخة)',
          'success'
        );
      });
    }

    /* ── 10. Reset usage confirm ─────────────────────────────────────────── */
    var btnResetUsage = document.getElementById('btn-confirm-cd-reset-usage');
    if (btnResetUsage) {
      btnResetUsage.addEventListener('click', function () {
        closeModal('modal-cd-reset-usage');
        /* reset all progress bars to 0 visually */
        document.querySelectorAll('#cd-usage-list .cd-usage-bar').forEach(function (bar) {
          bar.style.width = '0%';
          bar.classList.remove('warn', 'danger');
        });
        document.querySelectorAll('#cd-usage-list .cd-usage-nums').forEach(function (el) {
          var limitMatch = el.textContent.match(/\/ (.+)$/);
          if (limitMatch) el.textContent = '0 / ' + limitMatch[1];
        });
        document
          .querySelectorAll('#cd-usage-list .cd-usage-warn, #cd-usage-list .cd-usage-danger')
          .forEach(function (el) {
            el.style.display = 'none';
          });
        document.querySelectorAll('#cd-usage-list [role="progressbar"]').forEach(function (el) {
          el.setAttribute('aria-valuenow', '0');
        });
        toast('إجراء تجريبي — تم إعادة ضبط حدود الاستخدام (لا يتم الحفظ على خادم)', 'warning');
      });
    }
  }
  function initPlans() {
    var toast = _P._toast;

    // ── helpers ───────────────────────────────────────────────────────
    function closeModal(id) {
      if (window.TUI && TUI.modal && typeof TUI.modal.close === 'function') {
        TUI.modal.close(id);
      } else {
        var m = document.getElementById(id);
        if (m) m.setAttribute('hidden', '');
      }
    }
    function fieldErr(inputId, errId, msg) {
      var el = document.getElementById(inputId);
      var er = document.getElementById(errId);
      if (el) el.setAttribute('aria-invalid', 'true');
      if (er) {
        er.textContent = msg;
        er.removeAttribute('hidden');
      }
    }
    function clearErr(inputId, errId) {
      var el = document.getElementById(inputId);
      var er = document.getElementById(errId);
      if (el) el.removeAttribute('aria-invalid');
      if (er) er.setAttribute('hidden', '');
    }

    // mock plan data for pre-fill on edit
    var PLANS = {
      'plan-starter': {
        name: 'Starter',
        monthly: 29,
        yearly: 290,
        desc: 'الباقة المثالية للوكالات الناشئة',
        support: 'standard',
        status: 'active',
      },
      'plan-growth': {
        name: 'Growth',
        monthly: 79,
        yearly: 790,
        desc: 'للوكالات في مرحلة النمو',
        support: 'priority',
        status: 'active',
      },
      'plan-pro': {
        name: 'Pro',
        monthly: 149,
        yearly: 1490,
        desc: 'الباقة الاحترافية الكاملة',
        support: 'priority',
        status: 'active',
      },
      'plan-enterprise': {
        name: 'Enterprise',
        monthly: 349,
        yearly: 3490,
        desc: 'باقة المؤسسات الكبرى',
        support: 'dedicated',
        status: 'active',
      },
    };

    // ── 1. Monthly/yearly billing toggle ─────────────────────────────
    var btnMonthly = document.getElementById('btn-billing-monthly');
    var btnYearly = document.getElementById('btn-billing-yearly');
    var currentBilling = 'monthly';

    function applyBilling(mode) {
      currentBilling = mode;
      // toggle buttons
      if (btnMonthly) {
        btnMonthly.classList.toggle('is-active', mode === 'monthly');
        btnMonthly.setAttribute('aria-pressed', mode === 'monthly' ? 'true' : 'false');
      }
      if (btnYearly) {
        btnYearly.classList.toggle('is-active', mode === 'yearly');
        btnYearly.setAttribute('aria-pressed', mode === 'yearly' ? 'true' : 'false');
      }
      // update every price display
      document.querySelectorAll('.pl-price[data-price-monthly]').forEach(function (el) {
        var val =
          mode === 'yearly'
            ? el.getAttribute('data-price-yearly')
            : el.getAttribute('data-price-monthly');
        el.textContent = val;
      });
      // update period text
      document.querySelectorAll('.pl-price-period').forEach(function (el) {
        el.textContent = mode === 'yearly' ? '/سنة' : '/شهر';
      });
      // toggle note spans
      document.querySelectorAll('[data-monthly-note]').forEach(function (el) {
        el.hidden = mode !== 'monthly';
      });
      document.querySelectorAll('[data-yearly-note]').forEach(function (el) {
        el.hidden = mode !== 'yearly';
      });
    }

    if (btnMonthly)
      btnMonthly.addEventListener('click', function () {
        applyBilling('monthly');
      });
    if (btnYearly)
      btnYearly.addEventListener('click', function () {
        applyBilling('yearly');
      });

    // ── 2. Companies-on-plan filter select ───────────────────────────
    var planFilterSel = document.getElementById('pl-plan-filter-select');
    function applyPlanFilter(planId) {
      document.querySelectorAll('#pl-companies-tbody tr[data-plan-row]').forEach(function (row) {
        row.hidden = planId !== 'all' && row.getAttribute('data-plan-row') !== planId;
      });
    }
    if (planFilterSel) {
      // apply default (growth) on load
      applyPlanFilter(planFilterSel.value);
      planFilterSel.addEventListener('change', function () {
        applyPlanFilter(this.value);
      });
    }

    // ── 3. View-companies-on-plan buttons ────────────────────────────
    document.querySelectorAll('[data-plan-view-companies]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var planId = this.getAttribute('data-plan-view-companies');
        if (planFilterSel) {
          planFilterSel.value = planId;
          applyPlanFilter(planId);
          var section = document.getElementById('pl-companies-section');
          if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        toast('جارٍ تصفية الشركات على الخطة — بيانات تجريبية', 'info');
      });
    });

    // ── 4. Duplicate buttons ─────────────────────────────────────────
    document.querySelectorAll('[data-plan-duplicate]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var planId = this.getAttribute('data-plan-duplicate');
        var p = PLANS[planId] || {};
        // pre-fill create modal with copied data
        var nm = document.getElementById('mpc-name');
        var pm = document.getElementById('mpc-price-monthly');
        var py = document.getElementById('mpc-price-yearly');
        var pd = document.getElementById('mpc-description');
        if (nm) nm.value = p.name ? 'نسخة من ' + p.name : '';
        if (pm) pm.value = p.monthly || '';
        if (py) py.value = p.yearly || '';
        if (pd) pd.value = p.desc || '';
        if (window.TUI && TUI.modal && typeof TUI.modal.open === 'function') {
          TUI.modal.open('modal-plans-create');
        }
        toast('تم تحميل بيانات الخطة للتكرار — إجراء تجريبي', 'info');
      });
    });

    // ── 5. Edit modal pre-fill ────────────────────────────────────────
    document.querySelectorAll('[data-plan-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var planId = this.getAttribute('data-plan-edit');
        var p = PLANS[planId] || {};
        var nm = document.getElementById('mpe-name');
        var pm = document.getElementById('mpe-price-monthly');
        var py = document.getElementById('mpe-price-yearly');
        var pd = document.getElementById('mpe-description');
        var sp = document.getElementById('mpe-support');
        var st = document.getElementById('mpe-status');
        if (nm) nm.value = p.name || '';
        if (pm) pm.value = p.monthly || '';
        if (py) py.value = p.yearly || '';
        if (pd) pd.value = p.desc || '';
        if (sp) sp.value = p.support || '';
        if (st) st.value = p.status || 'active';
      });
    });

    // ── 6. Create plan confirm ────────────────────────────────────────
    var btnCreate = document.getElementById('btn-confirm-plans-create');
    if (btnCreate) {
      btnCreate.addEventListener('click', function () {
        var ok = true;
        var nm = document.getElementById('mpc-name');
        var pm = document.getElementById('mpc-price-monthly');
        var py = document.getElementById('mpc-price-yearly');
        var sp = document.getElementById('mpc-support');
        var st = document.getElementById('mpc-status');
        clearErr('mpc-name', 'mpc-name-err');
        clearErr('mpc-price-monthly', 'mpc-price-monthly-err');
        clearErr('mpc-price-yearly', 'mpc-price-yearly-err');
        clearErr('mpc-support', 'mpc-support-err');
        clearErr('mpc-status', 'mpc-status-err');
        if (!nm || !nm.value.trim()) {
          fieldErr('mpc-name', 'mpc-name-err', 'اسم الخطة مطلوب');
          ok = false;
        }
        if (!pm || pm.value === '' || isNaN(Number(pm.value)) || Number(pm.value) < 0) {
          fieldErr('mpc-price-monthly', 'mpc-price-monthly-err', 'سعر صحيح ≥ 0');
          ok = false;
        }
        if (!py || py.value === '' || isNaN(Number(py.value)) || Number(py.value) < 0) {
          fieldErr('mpc-price-yearly', 'mpc-price-yearly-err', 'سعر صحيح ≥ 0');
          ok = false;
        }
        if (!sp || !sp.value) {
          fieldErr('mpc-support', 'mpc-support-err', 'مستوى الدعم مطلوب');
          ok = false;
        }
        if (!st || !st.value) {
          fieldErr('mpc-status', 'mpc-status-err', 'الحالة مطلوبة');
          ok = false;
        }
        if (!ok) return;
        closeModal('modal-plans-create');
        toast('إجراء تجريبي — لا يتم إنشاء خطة حقيقية في هذه النسخة', 'warning');
      });
    }

    // ── 7. Edit plan confirm ──────────────────────────────────────────
    var btnEdit = document.getElementById('btn-confirm-plans-edit');
    if (btnEdit) {
      btnEdit.addEventListener('click', function () {
        var ok = true;
        var nm = document.getElementById('mpe-name');
        var pm = document.getElementById('mpe-price-monthly');
        var py = document.getElementById('mpe-price-yearly');
        var sp = document.getElementById('mpe-support');
        var st = document.getElementById('mpe-status');
        clearErr('mpe-name', 'mpe-name-err');
        clearErr('mpe-price-monthly', 'mpe-price-monthly-err');
        clearErr('mpe-price-yearly', 'mpe-price-yearly-err');
        clearErr('mpe-support', 'mpe-support-err');
        clearErr('mpe-status', 'mpe-status-err');
        if (!nm || !nm.value.trim()) {
          fieldErr('mpe-name', 'mpe-name-err', 'اسم الخطة مطلوب');
          ok = false;
        }
        if (!pm || pm.value === '' || isNaN(Number(pm.value)) || Number(pm.value) < 0) {
          fieldErr('mpe-price-monthly', 'mpe-price-monthly-err', 'سعر صحيح ≥ 0');
          ok = false;
        }
        if (!py || py.value === '' || isNaN(Number(py.value)) || Number(py.value) < 0) {
          fieldErr('mpe-price-yearly', 'mpe-price-yearly-err', 'سعر صحيح ≥ 0');
          ok = false;
        }
        if (!sp || !sp.value) {
          fieldErr('mpe-support', 'mpe-support-err', 'مستوى الدعم مطلوب');
          ok = false;
        }
        if (!st || !st.value) {
          fieldErr('mpe-status', 'mpe-status-err', 'الحالة مطلوبة');
          ok = false;
        }
        if (!ok) return;
        closeModal('modal-plans-edit');
        toast('إجراء تجريبي — لا يتم تعديل خطط أو أسعار حقيقية في هذه النسخة', 'warning');
      });
    }

    // ── 8. Disable plan confirm ───────────────────────────────────────
    var btnDisable = document.getElementById('btn-confirm-plans-disable');
    if (btnDisable) {
      btnDisable.addEventListener('click', function () {
        closeModal('modal-plans-disable');
        toast('إجراء تجريبي — لا يتم تعطيل خطة حقيقية في هذه النسخة', 'warning');
      });
    }

    // ── 9. FAQ accordion ─────────────────────────────────────────────
    var faq = document.getElementById('pl-faq');
    if (faq) {
      faq.addEventListener('click', function (e) {
        var btn = e.target.closest('.admin-faq-q');
        if (!btn) return;
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        faq.querySelectorAll('.admin-faq-q[aria-expanded="true"]').forEach(function (b) {
          if (b !== btn) b.setAttribute('aria-expanded', 'false');
        });
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    }
  }

  function initSubscriptions() {
    var toast = _P._toast;

    /* ── helpers ─────────────────────────────────────────────────────── */
    function closeModal(id) {
      if (window.TUI && TUI.modal && typeof TUI.modal.close === 'function') {
        TUI.modal.close(id);
      } else {
        var m = document.getElementById(id);
        if (m) m.setAttribute('hidden', '');
      }
    }
    function openModal(id) {
      if (window.TUI && TUI.modal && typeof TUI.modal.open === 'function') {
        TUI.modal.open(id);
      } else {
        var m = document.getElementById(id);
        if (m) m.removeAttribute('hidden');
      }
    }
    function fieldErr(inputId, errId, msg) {
      var el = document.getElementById(inputId);
      var er = document.getElementById(errId);
      if (el) el.setAttribute('aria-invalid', 'true');
      if (er) {
        er.textContent = msg;
        er.removeAttribute('hidden');
      }
    }
    function clearErr(inputId, errId) {
      var el = document.getElementById(inputId);
      var er = document.getElementById(errId);
      if (el) el.removeAttribute('aria-invalid');
      if (er) er.setAttribute('hidden', '');
    }

    /* ── row menu open/close (sub-specific menus) ────────────────────── */
    var openMenuId = null;

    function closeSubMenus() {
      document.querySelectorAll('.sub-row-menu').forEach(function (m) {
        m.classList.add('hidden');
      });
      document.querySelectorAll('[data-sub-menu-trigger]').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
      openMenuId = null;
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-sub-menu-trigger]');
      if (trigger) {
        e.stopPropagation();
        var subId = trigger.getAttribute('data-sub-menu-trigger');
        var menu = document.getElementById('menu-' + subId);
        var isOpen = !menu.classList.contains('hidden');
        closeSubMenus();
        if (!isOpen && menu) {
          menu.classList.remove('hidden');
          trigger.setAttribute('aria-expanded', 'true');
          openMenuId = subId;
          var first = menu.querySelector('[role="menuitem"]');
          if (first) first.focus();
        }
        return;
      }
      if (!e.target.closest('.sub-row-menu')) {
        closeSubMenus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openMenuId) {
        closeSubMenus();
      }
    });

    /* ── filter / sort / search engine ───────────────────────────────── */
    var tbody = document.getElementById('sub-tbody');
    var searchEl = document.getElementById('sub-search');
    var planSel = document.getElementById('sub-filter-plan');
    var statusSel = document.getElementById('sub-filter-status');
    var billingSel = document.getElementById('sub-filter-billing');
    var paymentSel = document.getElementById('sub-filter-payment');
    var sortSel = document.getElementById('sub-sort');
    var resetBtn = document.getElementById('sub-reset-filters');
    var emptyReset = document.getElementById('sub-empty-reset');
    var countEl = document.getElementById('sub-visible-count');
    var chipsRow = document.getElementById('sub-chips-row');
    var emptyRow = document.getElementById('sub-empty-state');
    var bulkBar = document.getElementById('sub-bulk-bar');
    var bulkCount = document.getElementById('sub-bulk-count');

    function getRows() {
      return tbody ? Array.from(tbody.querySelectorAll('tr[data-sub-id]')) : [];
    }

    function buildChips() {
      if (!chipsRow) return;
      chipsRow.innerHTML = '';
      var filters = [
        { key: 'plan', val: planSel ? planSel.value : '', label: 'الخطة' },
        { key: 'status', val: statusSel ? statusSel.value : '', label: 'الحالة' },
        { key: 'billing', val: billingSel ? billingSel.value : '', label: 'الفوترة' },
        { key: 'payment', val: paymentSel ? paymentSel.value : '', label: 'الدفع' },
      ];
      var q = searchEl ? searchEl.value.trim() : '';
      if (q) {
        var chip = _buildChip('search', q, 'بحث: ' + q);
        chipsRow.appendChild(chip);
      }
      filters.forEach(function (f) {
        if (f.val) {
          var displayVal = f.val;
          if (f.key === 'billing') {
            displayVal = f.val === 'monthly' ? 'شهري' : 'سنوي';
          }
          if (f.key === 'payment') {
            displayVal =
              f.val === 'Paid mock' ? 'مدفوع' : f.val === 'Failed mock' ? 'فاشل' : 'معلق';
          }
          chipsRow.appendChild(_buildChip(f.key, f.val, f.label + ': ' + displayVal));
        }
      });
    }

    function _buildChip(filterKey, filterVal, labelText) {
      var span = document.createElement('span');
      span.className = 'sub-chip';
      span.setAttribute('data-chip-filter', filterKey);
      span.setAttribute('data-chip-value', filterVal);
      span.innerHTML =
        labelText +
        '<button type="button" class="sub-chip-remove" aria-label="إزالة مرشح ' +
        labelText +
        '">' +
        '<svg width="10" height="10" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>';
      span.querySelector('.sub-chip-remove').addEventListener('click', function () {
        removeChip(filterKey);
      });
      return span;
    }

    function removeChip(filterKey) {
      if (filterKey === 'search' && searchEl) {
        searchEl.value = '';
      } else if (filterKey === 'plan' && planSel) {
        planSel.value = '';
      } else if (filterKey === 'status' && statusSel) {
        statusSel.value = '';
      } else if (filterKey === 'billing' && billingSel) {
        billingSel.value = '';
      } else if (filterKey === 'payment' && paymentSel) {
        paymentSel.value = '';
      }
      applyFilters();
    }

    /* renewal date string → comparable integer YYYYMMDD */
    function dateKey(str) {
      if (!str) return 0;
      return parseInt(str.replace(/-/g, ''), 10) || 0;
    }

    /* amount from strong text ("$149" → 149) */
    function amountKey(row) {
      var strong = row.querySelector('td:nth-child(4) strong');
      if (!strong) return 0;
      return parseFloat(strong.textContent.replace(/[^0-9.]/g, '')) || 0;
    }

    /* renewal date text from 8th td */
    function renewalKey(row) {
      var td = row.querySelector('td:nth-child(8)');
      return td ? dateKey(td.textContent.trim()) : 0;
    }

    var STATUS_WEIGHT = {
      'Past Due': 0,
      'Manual Review': 1,
      'Expiring Soon': 2,
      Trial: 3,
      Active: 4,
    };

    function sortRows(rows) {
      var mode = sortSel ? sortSel.value : 'renewal-asc';
      rows.sort(function (a, b) {
        var as = a.getAttribute('data-sub-status') || '';
        var bs = b.getAttribute('data-sub-status') || '';
        if (mode === 'renewal-asc') return renewalKey(a) - renewalKey(b);
        if (mode === 'amount-desc') return amountKey(b) - amountKey(a);
        if (mode === 'newest')
          return (b.getAttribute('data-sub-id') || '').localeCompare(
            a.getAttribute('data-sub-id') || ''
          );
        if (mode === 'past-due') return (STATUS_WEIGHT[as] || 99) - (STATUS_WEIGHT[bs] || 99);
        if (mode === 'trial-ending') {
          /* trial rows first, then by trial-end date */
          var aTrial = as === 'Trial' ? 0 : 1;
          var bTrial = bs === 'Trial' ? 0 : 1;
          return aTrial - bTrial;
        }
        return 0;
      });
    }

    function applyFilters() {
      var q = searchEl ? searchEl.value.trim().toLowerCase() : '';
      var plan = planSel ? planSel.value : '';
      var status = statusSel ? statusSel.value : '';
      var billing = billingSel ? billingSel.value : '';
      var payment = paymentSel ? paymentSel.value : '';

      var rows = getRows();
      var visible = [];

      rows.forEach(function (row) {
        var rPlan = row.getAttribute('data-sub-plan') || '';
        var rStatus = row.getAttribute('data-sub-status') || '';
        var rBilling = row.getAttribute('data-sub-billing') || '';
        var rPayment = row.getAttribute('data-sub-payment') || '';
        var rText = (row.textContent || '').toLowerCase();

        var match =
          (!q || rText.indexOf(q) !== -1) &&
          (!plan || rPlan === plan) &&
          (!status || rStatus === status) &&
          (!billing || rBilling === billing) &&
          (!payment || rPayment === payment);

        if (match) visible.push(row);
      });

      sortRows(visible);

      /* reorder visible rows in DOM first, then hide/show */
      visible.forEach(function (row) {
        tbody.appendChild(row);
      });
      rows.forEach(function (row) {
        row.hidden = visible.indexOf(row) === -1;
      });

      /* empty state */
      if (emptyRow) emptyRow.hidden = visible.length > 0;

      /* count */
      if (countEl) countEl.textContent = visible.length;

      buildChips();
      syncSelectAll();
    }

    /* ── event wiring ────────────────────────────────────────────────── */
    if (searchEl) searchEl.addEventListener('input', applyFilters);
    if (planSel) planSel.addEventListener('change', applyFilters);
    if (statusSel) statusSel.addEventListener('change', applyFilters);
    if (billingSel) billingSel.addEventListener('change', applyFilters);
    if (paymentSel) paymentSel.addEventListener('change', applyFilters);
    if (sortSel) sortSel.addEventListener('change', applyFilters);

    function resetFilters() {
      if (searchEl) searchEl.value = '';
      if (planSel) planSel.value = '';
      if (statusSel) statusSel.value = '';
      if (billingSel) billingSel.value = '';
      if (paymentSel) paymentSel.value = '';
      if (sortSel) sortSel.value = 'renewal-asc';
      applyFilters();
    }

    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
    if (emptyReset) emptyReset.addEventListener('click', resetFilters);

    /* ── select-all / bulk ───────────────────────────────────────────── */
    var selectAll = document.getElementById('sub-select-all');
    var SELECTED = new Set();

    function syncSelectAll() {
      var visibleRows = getRows().filter(function (r) {
        return !r.hidden;
      });
      var checks = visibleRows
        .map(function (r) {
          return r.querySelector('.sub-row-check');
        })
        .filter(Boolean);
      if (selectAll) {
        selectAll.checked =
          checks.length > 0 &&
          checks.every(function (c) {
            return c.checked;
          });
        selectAll.indeterminate =
          !selectAll.checked &&
          checks.some(function (c) {
            return c.checked;
          });
      }
    }

    function updateBulk() {
      SELECTED.clear();
      document.querySelectorAll('.sub-row-check:checked').forEach(function (c) {
        var row = c.closest('tr[data-sub-id]');
        if (row) SELECTED.add(row.getAttribute('data-sub-id'));
      });
      var n = SELECTED.size;
      if (bulkBar) bulkBar.hidden = n === 0;
      if (bulkCount) bulkCount.textContent = n + ' محدد' + (n === 1 ? '' : '');
      var bcc = document.getElementById('modal-bulk-cancel-count');
      if (bcc) bcc.textContent = n;
      syncSelectAll();
    }

    if (selectAll) {
      selectAll.addEventListener('change', function () {
        var visibleRows = getRows().filter(function (r) {
          return !r.hidden;
        });
        visibleRows.forEach(function (row) {
          var c = row.querySelector('.sub-row-check');
          if (c) c.checked = selectAll.checked;
        });
        updateBulk();
      });
    }

    document.addEventListener('change', function (e) {
      if (e.target && e.target.classList.contains('sub-row-check')) {
        updateBulk();
      }
    });

    /* ── row actions toast/modal wiring ──────────────────────────────── */
    var ACTION_MSGS = {
      'change-plan': 'تغيير الخطة — إجراء تجريبي، لا يتم تطبيق أي تغيير حقيقي',
      'mark-paid': 'تم التعيين كمدفوع (تجريبي) — لا توجد معاملة حقيقية',
      'send-reminder': 'تم إرسال التذكير (تجريبي) — لا يُرسل أي بريد إلكتروني حقيقي',
      'download-invoice': 'تنزيل الفاتورة (تجريبي) — لا يوجد ملف PDF حقيقي',
      'send-invoice-email': 'تم إرسال الفاتورة بالبريد (تجريبي)',
      'download-invoice-modal': 'تنزيل PDF (تجريبي) — لا يوجد ملف حقيقي',
      'export-all': 'تصدير البيانات (تجريبي) — لا يتم إنشاء ملف فعلي',
    };

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-sub-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-sub-action');
      var msg = ACTION_MSGS[action] || 'إجراء ' + action + ' — تجريبي';
      toast(msg, 'info');
    });

    /* ── extend-trial validation ──────────────────────────────────────── */
    var btnConfirmExtend = document.getElementById('btn-confirm-sub-extend-trial');
    if (btnConfirmExtend) {
      btnConfirmExtend.addEventListener('click', function () {
        var daysEl = document.getElementById('sub-ext-days');
        var days = daysEl ? parseInt(daysEl.value, 10) : NaN;
        if (!daysEl || isNaN(days) || days < 1 || days > 90) {
          fieldErr('sub-ext-days', 'sub-ext-days-err', 'يجب أن يكون بين 1 و90 يومًا');
          return;
        }
        clearErr('sub-ext-days', 'sub-ext-days-err');
        closeModal('modal-sub-extend-trial');
        toast(
          'تم تمديد فترة التجربة ' + days + ' يومًا (تجريبي) — لا يتم تطبيق أي تغيير حقيقي',
          'success'
        );
      });
    }

    /* ── cancel confirm ──────────────────────────────────────────────── */
    var btnConfirmCancel = document.getElementById('btn-confirm-sub-cancel');
    if (btnConfirmCancel) {
      btnConfirmCancel.addEventListener('click', function () {
        closeModal('modal-sub-cancel');
        toast(
          'تم إلغاء الاشتراك (تجريبي) — لا يتم إيقاف أي خدمة حقيقية. الحالة تُعاد عند تحديث الصفحة.',
          'info'
        );
      });
    }

    /* ── bulk cancel confirm ─────────────────────────────────────────── */
    var btnBulkCancel = document.getElementById('btn-confirm-sub-bulk-cancel');
    if (btnBulkCancel) {
      btnBulkCancel.addEventListener('click', function () {
        var n = SELECTED.size;
        closeModal('modal-sub-bulk-cancel');
        toast('تم إلغاء ' + n + ' اشتراك (تجريبي) — لا توجد إلغاءات حقيقية', 'info');
      });
    }

    /* ── bulk action buttons ──────────────────────────────────────────── */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-sub-bulk]');
      if (!btn) return;
      var action = btn.getAttribute('data-sub-bulk');
      if (action === 'export') toast('تصدير المحدد (تجريبي) — لا يتم إنشاء ملف فعلي', 'info');
      else if (action === 'send-reminders')
        toast('تم إرسال التذكيرات (تجريبي) — لا تُرسل رسائل حقيقية', 'info');
      else if (action === 'extend-trials') openModal('modal-sub-extend-trial');
      else if (action === 'mark-review') toast('تم وضع علامة مراجعة (تجريبي)', 'info');
    });

    /* ── FAQ accordion ───────────────────────────────────────────────── */
    var faq = document.getElementById('sub-faq');
    if (faq) {
      faq.addEventListener('click', function (e) {
        var q = e.target.closest('.admin-faq-q');
        if (!q) return;
        var isOpen = q.getAttribute('aria-expanded') === 'true';
        faq.querySelectorAll('.admin-faq-q[aria-expanded="true"]').forEach(function (other) {
          if (other !== q) other.setAttribute('aria-expanded', 'false');
        });
        q.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });
    }

    /* ── initial render ──────────────────────────────────────────────── */
    applyFilters();
  }
  function initAnalytics() {
    var toast = _P._toast;

    /* ── Period preset buttons ─────────────────────────────────────── */
    var periodBtns = document.querySelectorAll('[data-an-period]');
    periodBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        periodBtns.forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        var label = btn.textContent.trim();
        toast('البيانات تجريبية — سيتم جلب بيانات ' + label + ' عند ربط الخلفية', 'info');
      });
    });

    /* ── Apply date-range ──────────────────────────────────────────── */
    var btnApply = document.getElementById('btn-an-apply');
    if (btnApply) {
      btnApply.addEventListener('click', function () {
        var from = (document.getElementById('an-date-from') || {}).value || '';
        var to = (document.getElementById('an-date-to') || {}).value || '';
        if (from && to && from > to) {
          toast('تاريخ البداية يجب أن يكون قبل تاريخ النهاية', 'error');
          return;
        }
        periodBtns.forEach(function (b) {
          b.classList.remove('is-active');
        });
        toast(
          'البيانات تجريبية — الفترة من ' +
            (from || '—') +
            ' إلى ' +
            (to || '—') +
            ' (لا يوجد جلب فعلي)',
          'info'
        );
      });
    }

    /* ── Compare toggle ────────────────────────────────────────────── */
    var btnCompare = document.getElementById('btn-an-compare');
    if (btnCompare) {
      btnCompare.addEventListener('click', function () {
        var pressed = btnCompare.getAttribute('aria-pressed') === 'true';
        btnCompare.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        toast(
          pressed
            ? 'تم إيقاف المقارنة — البيانات تجريبية'
            : 'تم تفعيل المقارنة بالفترة السابقة — البيانات تجريبية وليست مقارنة فعلية',
          'info'
        );
      });
    }

    /* ── Export button → open modal ────────────────────────────────── */
    var btnExport = document.getElementById('btn-an-export');
    if (btnExport) {
      btnExport.addEventListener('click', function () {
        if (window.TUI && window.TUI.modal) {
          window.TUI.modal('modal-an-export', 'open');
        } else {
          var m = document.getElementById('modal-an-export');
          if (m) m.hidden = false;
        }
      });
    }

    /* ── Export modal actions ──────────────────────────────────────── */
    var exportMsgs = {
      csv: 'CSV تجريبي — لا يتم تنزيل ملف فعلي في هذه النسخة',
      pdf: 'PDF تجريبي — لا يتم إنشاء ملف فعلي في هذه النسخة',
      schedule: 'جدولة تجريبية — لا يتم إنشاء مهمة مجدولة فعلية',
      email: 'إرسال تجريبي — لا يتم إرسال بريد إلكتروني فعلي',
    };
    document.addEventListener('click', function (e) {
      var exportBtn = e.target.closest('[data-an-export-action]');
      if (exportBtn) {
        var action = exportBtn.dataset.anExportAction;
        var msg = exportMsgs[action] || 'إجراء تجريبي';
        if (window.TUI && window.TUI.modal) window.TUI.modal('modal-an-export', 'close');
        else {
          var m = document.getElementById('modal-an-export');
          if (m) m.hidden = true;
        }
        toast(msg, 'info');
        return;
      }

      /* ── Table / insight / recommendation action buttons ─────────── */
      var actionBtn = e.target.closest('[data-an-action]');
      if (actionBtn) {
        var act = actionBtn.dataset.anAction;
        var actionMsgs = {
          'view-destination': 'فتح صفحة الوجهة — تجريبي',
          'export-deals': 'تصدير بيانات العروض — لا يتم تصدير فعلي',
          'refresh-integrations': 'تحديث حالة التكاملات — البيانات تجريبية وليست فعلية',
          'escalate-integration': 'تم تسجيل التصعيد — لا يتم إرسال تنبيه فعلي',
          'review-integration': 'فتح قائمة مراجعة التكامل — تجريبي',
          'rec-escalate-duffel': 'تم إرسال طلب تصعيد Duffel API (تجريبي) — لا يتم إجراء فعلي',
          'rec-contact-trial':
            'تم إرسال عرض الترقية لمسافر للسياحة (تجريبي) — لا يتم إرسال بريد فعلي',
          'rec-contact-renewal': 'تم تسجيل طلب التواصل مع قوافل السياحة (تجريبي)',
          'rec-review-queue': 'فتح قائمة انتظار Scraping — تجريبي',
          'rec-send-upgrades': 'تم إرسال عروض الترقية للشركات الثلاث (تجريبي) — لا يتم إرسال فعلي',
        };
        var msg = actionMsgs[act] || 'إجراء تجريبي — لا يتم تنفيذ فعلي';
        toast(msg, act && act.indexOf('escalate') !== -1 ? 'warning' : 'success');
      }
    });

    /* ── FAQ accordion ─────────────────────────────────────────────── */
    var faqEl = document.getElementById('an-faq');
    if (faqEl) {
      faqEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.admin-faq-q');
        if (!btn) return;
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        faqEl.querySelectorAll('.admin-faq-q').forEach(function (q) {
          q.setAttribute('aria-expanded', 'false');
        });
        if (!expanded) btn.setAttribute('aria-expanded', 'true');
      });
    }
  }
  function initContent() {
    var toast = _P._toast;

    /* ── Tab system ──────────────────────────────────────────────────── */
    var tablist = document.getElementById('ct-tablist');
    var tabs = tablist ? tablist.querySelectorAll('[role="tab"]') : [];
    var panels = document.querySelectorAll('[role="tabpanel"]');
    var mainEl = document.getElementById('main-content');

    function activateTab(tabEl) {
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', 'false');
        t.removeAttribute('aria-current');
      });
      panels.forEach(function (p) {
        p.classList.remove('is-active');
      });
      tabEl.setAttribute('aria-selected', 'true');
      tabEl.setAttribute('aria-current', 'true');
      var panel = document.getElementById(tabEl.getAttribute('aria-controls'));
      if (panel) panel.classList.add('is-active');
    }

    if (tablist && tabs.length) {
      /* Mark ready so CSS hides non-active panels */
      if (mainEl) mainEl.classList.add('ct-tabs-ready');

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          activateTab(tab);
        });
      });

      /* Deep-link: #blog / ?tab=blog */
      var hashTab = (location.hash || '').replace('#', '');
      var paramTab = new URLSearchParams(location.search).get('tab');
      var target = paramTab || hashTab;
      if (target) {
        var found = null;
        tabs.forEach(function (t) {
          if (t.getAttribute('aria-controls') === 'panel-' + target) found = t;
        });
        if (found) activateTab(found);
      }
    }

    /* ── Quick-action dropdown create triggers ───────────────────────── */
    document.addEventListener('click', function (e) {
      var createTrigger = e.target.closest('[data-ct-create]');
      if (createTrigger && !createTrigger.closest('[data-modal-open]')) {
        var type = createTrigger.dataset.ctCreate;
        var sel = document.getElementById('ct-content-type');
        if (sel) {
          sel.value = type;
        }
        var title = document.getElementById('modal-ct-create-title');
        var labels = {
          destination: 'وجهة جديدة (تجريبي)',
          article: 'مقالة جديدة (تجريبي)',
          deal: 'عرض مميز (تجريبي)',
          coupon: 'كوبون مميز (تجريبي)',
        };
        if (title) title.textContent = labels[type] || 'إنشاء محتوى تجريبي';
        var modal = document.getElementById('modal-ct-create');
        if (modal) {
          modal.hidden = false;
          var inp = document.getElementById('ct-content-title');
          if (inp)
            setTimeout(function () {
              inp.focus();
            }, 80);
        }
      }
    });

    /* ── Slug auto-fill from title ───────────────────────────────────── */
    var titleInp = document.getElementById('ct-content-title');
    var slugInp = document.getElementById('ct-content-slug');
    if (titleInp && slugInp) {
      titleInp.addEventListener('input', function () {
        if (slugInp.dataset.manualEdit) return;
        slugInp.value = titleInp.value
          .trim()
          .replace(/[\s؀-ۿ]+/g, '-')
          .replace(/[^a-z0-9-]/gi, '')
          .toLowerCase()
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      });
      slugInp.addEventListener('input', function () {
        slugInp.dataset.manualEdit = '1';
      });
    }

    /* ── Create/Edit form validation + submit ────────────────────────── */
    var form = document.getElementById('form-ct-create');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        ['ct-content-type', 'ct-content-title', 'ct-content-status', 'ct-content-slug'].forEach(
          function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            el.classList.remove('has-error');
            if (!el.value.trim()) {
              el.classList.add('has-error');
              ok = false;
            }
          }
        );
        if (slugInp && slugInp.value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugInp.value)) {
          slugInp.classList.add('has-error');
          toast('الـ Slug يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط', 'error');
          return;
        }
        if (!ok) {
          toast('يرجى تعبئة جميع الحقول المطلوبة', 'error');
          return;
        }
        var modal = document.getElementById('modal-ct-create');
        if (modal) modal.hidden = true;
        form.reset();
        if (slugInp) delete slugInp.dataset.manualEdit;
        toast('تم حفظ المحتوى تجريبياً — لا يتم الحفظ على خادم في هذه النسخة', 'success');
      });
    }

    /* ── Shared pending IDs for confirm modals ───────────────────────── */
    var _pendingPublishId = null;
    var _pendingDeleteId = null;

    /* ── All delegated content actions ──────────────────────────────── */
    document.addEventListener('click', function (e) {
      /* Feature toggle */
      var toggleBtn = e.target.closest('[data-ct-action="toggle-feature"]');
      if (toggleBtn) {
        var wasFeatured = toggleBtn.classList.contains('is-featured');
        toggleBtn.classList.toggle('is-featured', !wasFeatured);
        toggleBtn.classList.toggle('not-featured', wasFeatured);
        if (!wasFeatured) {
          toggleBtn.innerHTML =
            '<svg width="10" height="10" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><use href="#icon-check-circle"/>​</svg> مميز';
        } else {
          toggleBtn.textContent = 'غير مميز';
        }
        toast(
          !wasFeatured
            ? 'تم تمييز المحتوى — لا يؤثر فعلياً على الصفحة الرئيسية الآن'
            : 'تم إلغاء تمييز المحتوى — لا يؤثر فعلياً الآن',
          'info'
        );
        _updatePreview();
        return;
      }

      /* Publish → confirm modal */
      var publishBtn = e.target.closest('[data-ct-action="publish-content"]');
      if (publishBtn) {
        _pendingPublishId = publishBtn.dataset.contentId || null;
        var m = document.getElementById('modal-ct-publish');
        if (m) m.hidden = false;
        return;
      }

      /* Delete → confirm modal */
      var deleteBtn = e.target.closest('[data-ct-action="delete-content"]');
      if (deleteBtn) {
        _pendingDeleteId = deleteBtn.dataset.contentId || null;
        var m = document.getElementById('modal-ct-delete');
        if (m) m.hidden = false;
        return;
      }

      /* Publish confirm */
      if (e.target.closest('[data-ct-action="confirm-publish"]')) {
        var m = document.getElementById('modal-ct-publish');
        if (m) m.hidden = true;
        toast('تم تغيير حالة النشر تجريبياً — لا يتم نشر فعلي على الموقع في هذه النسخة', 'success');
        _pendingPublishId = null;
        return;
      }

      /* Delete confirm */
      if (e.target.closest('[data-ct-action="confirm-delete"]')) {
        var m = document.getElementById('modal-ct-delete');
        if (m) m.hidden = true;
        toast('تم الحذف تجريبياً — إعادة التحميل تستعيد البيانات الأصلية', 'success');
        _pendingDeleteId = null;
        return;
      }

      /* Approve pending */
      var approveBtn = e.target.closest('[data-ct-action="approve-content"]');
      if (approveBtn) {
        var row = approveBtn.closest('tr');
        if (row) row.style.opacity = '.45';
        toast('تم قبول المحتوى تجريبياً — لا يتم نشر فعلي في هذه النسخة', 'success');
        return;
      }

      /* Reject pending */
      var rejectBtn = e.target.closest('[data-ct-action="reject-content"]');
      if (rejectBtn) {
        var row = rejectBtn.closest('tr');
        if (row) row.style.opacity = '.45';
        toast('تم رفض المحتوى — لا يتم إشعار المرسِل في هذه النسخة', 'warning');
        return;
      }

      /* Add note */
      if (e.target.closest('[data-ct-action="add-note"]')) {
        toast('ملاحظة تجريبية — لا يتم حفظ ملاحظات فعلية في هذه النسخة', 'info');
        return;
      }

      /* Section: edit / reorder / preview */
      var sectionEdit = e.target.closest('[data-ct-action="edit-section"]');
      if (sectionEdit) {
        var card = sectionEdit.closest('.ct-section-card');
        var nm = card ? (card.querySelector('.ct-section-name') || {}).textContent : '';
        toast('تعديل "' + (nm ? nm.trim() : 'القسم') + '" تجريبي — لا يتم الحفظ الآن', 'info');
        return;
      }
      if (e.target.closest('[data-ct-action="reorder-section"]')) {
        toast('إعادة ترتيب الأقسام تجريبية — لا تؤثر على الموقع الآن', 'info');
        return;
      }
      if (e.target.closest('[data-ct-action="preview-section"]')) {
        toast('معاينة القسم تجريبية — تُحدَّث تلقائياً عند تغيير التمييز', 'info');
        return;
      }

      /* Edit content → open create modal in edit mode */
      if (e.target.closest('[data-ct-action="edit-content"]')) {
        var titleEl = document.getElementById('modal-ct-create-title');
        if (titleEl) titleEl.textContent = 'تعديل المحتوى (تجريبي)';
        var modal = document.getElementById('modal-ct-create');
        if (modal) modal.hidden = false;
        return;
      }

      /* Export */
      if (e.target.closest('[data-ct-action="export"]')) {
        toast('تصدير البيانات تجريبي — لا يتم تنزيل ملف فعلي في هذه النسخة', 'info');
      }
    });

    /* ── Homepage preview: reflect featured state ────────────────────── */
    function _updatePreview() {
      var body = document.getElementById('ct-preview-body');
      if (!body) return;
      var cards = document.querySelectorAll('.ct-section-card');
      var html = '';
      cards.forEach(function (card) {
        var name = (card.querySelector('.ct-section-name') || {}).textContent || '';
        var toggle = card.querySelector('.ct-toggle-btn');
        var featured = toggle && toggle.classList.contains('is-featured');
        html +=
          '<div class="ct-preview-section">' +
          '<span class="ct-preview-section-name">' +
          name.trim() +
          '</span>' +
          (featured
            ? '<span class="ct-preview-tag">مميز</span>'
            : '<span class="ct-preview-tag ct-preview-tag-draft">مخفي</span>') +
          '</div>';
      });
      if (html) body.innerHTML = html;
    }

    /* ── FAQ accordion ───────────────────────────────────────────────── */
    var faqEl = document.getElementById('ct-faq');
    if (faqEl) {
      faqEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.admin-faq-q');
        if (!btn) return;
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        faqEl.querySelectorAll('.admin-faq-q').forEach(function (q) {
          q.setAttribute('aria-expanded', 'false');
        });
        if (!expanded) btn.setAttribute('aria-expanded', 'true');
      });
    }
  }
})();
