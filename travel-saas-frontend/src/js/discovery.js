/**
 * discovery.js — enhancement module for the four public discovery pages.
 * Loaded ONLY by deals.html, deal-details.html, compare.html, coupons.html.
 * main.js and ui.js are NOT modified.
 *
 * Responsibilities per page (dispatched via data-page attribute):
 *   deals        → filter/sort/reset cards, URL state, empty/count
 *   deal-details → ?id= swap from inline catalog, not-found fallback
 *   compare      → ?destination= context echo + offer-set swap, sort/filter
 *   coupons      → filter/reset cards, URL state, empty/count
 */
(function () {
  'use strict';

  /* ── Shared utilities ──────────────────────────────────────────────────── */

  /** Read all current query params as a plain object. */
  function getParams() {
    var params = {};
    new URLSearchParams(window.location.search).forEach(function (v, k) {
      params[k] = v;
    });
    return params;
  }

  /** Push updated params to the URL without reloading. */
  function setParams(obj) {
    var sp = new URLSearchParams();
    Object.keys(obj).forEach(function (k) {
      if (obj[k] !== '' && obj[k] !== null && obj[k] !== undefined) {
        sp.set(k, obj[k]);
      }
    });
    var qs = sp.toString();
    history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
  }

  /** Update the aria-live result count element. */
  function updateCount(visible, total) {
    var el = document.querySelector('[data-result-count]');
    if (!el) return;
    el.textContent = visible === total
      ? 'عرض ' + total + ' نتيجة'
      : 'عرض ' + visible + ' من ' + total + ' نتيجة';
  }

  /** Show or hide the empty state. */
  function toggleEmpty(show) {
    var el = document.querySelector('[data-empty-state]');
    if (!el) return;
    el.hidden = !show;
  }

  /** Normalize an Arabic string for fuzzy matching (trim + lowercase). */
  function normalize(str) {
    return (str || '').trim().toLowerCase()
      .replace(/[ً-ٟ]/g, ''); /* strip harakat */
  }

  /** Render star rating as text (★ chars). */
  function starsText(rating) {
    var full = Math.floor(rating);
    var out = '';
    for (var i = 0; i < 5; i++) out += i < full ? '★' : '☆';
    return out;
  }

  /* ── US1 — Deals listing (deals.html) ─────────────────────────────────── */

  function initDeals() {
    var cards = Array.prototype.slice.call(
      document.querySelectorAll('[data-card]')
    );
    if (!cards.length) return;

    var filterForm = document.querySelector('[data-filter-form]');
    var sortSelect = document.querySelector('[data-sort]');
    var resetBtn   = document.querySelector('[data-filter-reset]');
    var total      = cards.length;

    /* Restore from URL on load */
    var p = getParams();
    if (filterForm) {
      if (p.source)   { var s = filterForm.querySelector('[name="source"]');   if (s) s.value = p.source; }
      if (p.region)   { var r = filterForm.querySelector('[name="region"]');   if (r) r.value = p.region; }
      if (p.priceMax) { var pm = filterForm.querySelector('[name="priceMax"]'); if (pm) pm.value = p.priceMax; }
    }
    if (sortSelect && p.sort) sortSelect.value = p.sort;

    function applyFiltersSort() {
      var source   = filterForm ? (filterForm.querySelector('[name="source"]')   || {}).value || '' : '';
      var region   = filterForm ? (filterForm.querySelector('[name="region"]')   || {}).value || '' : '';
      var priceMax = filterForm ? (filterForm.querySelector('[name="priceMax"]') || {}).value || '' : '';
      var sort     = sortSelect ? sortSelect.value : '';

      /* Filter */
      var visible = cards.filter(function (card) {
        var ok = true;
        if (source   && card.dataset.source   !== source)                           ok = false;
        if (region   && card.dataset.region   !== region)                           ok = false;
        if (priceMax && parseInt(card.dataset.price, 10) > parseInt(priceMax, 10)) ok = false;
        card.hidden = !ok;
        return ok;
      });

      /* Sort visible cards */
      if (sort && visible.length > 1) {
        var parent = cards[0].parentNode;
        visible.sort(function (a, b) {
          if (sort === 'price-asc')    return parseInt(a.dataset.price,  10) - parseInt(b.dataset.price,  10);
          if (sort === 'price-desc')   return parseInt(b.dataset.price,  10) - parseInt(a.dataset.price,  10);
          if (sort === 'rating-desc')  return parseFloat(b.dataset.rating)   - parseFloat(a.dataset.rating);
          return 0;
        });
        visible.forEach(function (c) { parent.appendChild(c); });
      }

      updateCount(visible.length, total);
      toggleEmpty(visible.length === 0);

      /* Sync URL */
      setParams({ source: source, region: region, priceMax: priceMax, sort: sort });
    }

    /* Initial apply */
    applyFiltersSort();

    /* Listeners */
    if (filterForm) {
      filterForm.addEventListener('change', applyFiltersSort);
      filterForm.addEventListener('input',  applyFiltersSort);
      filterForm.addEventListener('submit', function (e) { e.preventDefault(); });
    }
    if (sortSelect) sortSelect.addEventListener('change', applyFiltersSort);

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (filterForm) filterForm.reset();
        if (sortSelect) sortSelect.value = '';
        applyFiltersSort();
      });
    }
  }

  /* ── US2 — Deal details (?id= swap) ───────────────────────────────────── */

  function initDealDetails() {
    var catalogEl = document.getElementById('deals-catalog');
    if (!catalogEl) return;

    var catalog;
    try { catalog = JSON.parse(catalogEl.textContent); } catch (e) { return; }

    var id = getParams().id || '';
    if (!id) return; /* keep static default deal */

    var deal = catalog.find(function (d) { return d.id === id; });
    if (!deal) {
      /* Show not-found panel, hide main content */
      var notFound = document.querySelector('[data-not-found]');
      var mainContent = document.querySelector('[data-deal-main]');
      if (notFound)    notFound.hidden = false;
      if (mainContent) mainContent.hidden = true;
      return;
    }

    /* Swap fields */
    var swap = {
      '[data-deal-title]':       deal.title,
      '[data-deal-location]':    deal.location,
      '[data-deal-price]':       deal.priceFrom ? deal.priceFrom.toLocaleString('ar-SA') + ' ' + (deal.currency || '') : '',
      '[data-deal-rating]':      deal.rating ? starsText(deal.rating) + ' (' + deal.rating + ')' : '',
      '[data-deal-reviews]':     deal.reviewsCount ? '(' + deal.reviewsCount.toLocaleString('ar-SA') + ' تقييم)' : '',
      '[data-deal-source]':      deal.source || '',
      '[data-deal-terms]':       deal.terms || ''
    };

    Object.keys(swap).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.textContent = swap[sel];
    });

    /* Swap image */
    var img = document.querySelector('[data-deal-img]');
    if (img && deal.image) {
      img.setAttribute('src', deal.image);
      img.setAttribute('alt', deal.imageAlt || deal.title);
    }

    /* Swap source badge class */
    var badge = document.querySelector('[data-deal-badge]');
    if (badge && deal.badgeClass) {
      badge.className = badge.className.replace(/badge-source-\w+/g, '') + ' ' + deal.badgeClass;
    }

    /* Swap highlights */
    var highlightsList = document.querySelector('[data-deal-highlights]');
    if (highlightsList && deal.highlights && deal.highlights.length) {
      highlightsList.innerHTML = deal.highlights
        .map(function (h) { return '<li>' + h + '</li>'; })
        .join('');
    }

    /* Update page <title> and h1 */
    var h1 = document.querySelector('[data-deal-title]');
    if (h1 && deal.title) document.title = deal.title + ' — رحلاتي';
  }

  /* ── US3 — Compare offers ──────────────────────────────────────────────── */

  function initCompare() {
    var contextBanner = document.querySelector('[data-trip-context]');
    var offersGrid    = document.querySelector('[data-offers-grid]');
    var filterForm    = document.querySelector('[data-filter-form]');
    var sortSelect    = document.querySelector('[data-sort]');
    var resetBtn      = document.querySelector('[data-filter-reset]');

    /* Read trip context from URL */
    var p           = getParams();
    var destination = p.destination || '';
    var dates       = p.dates       || '';
    var travelers   = p.travelers   || '';

    /* Echo context */
    if (contextBanner && destination) {
      var contextText = 'عروض مقارنة لـ: ' + destination;
      if (dates)     contextText += ' • ' + dates;
      if (travelers) contextText += ' • ' + travelers + ' مسافر';
      contextBanner.textContent = contextText;
      contextBanner.hidden = false;
    }

    /* Try to load the compare-offers catalog (inline JSON) */
    var catalogEl = document.getElementById('compare-catalog');
    if (!catalogEl || !offersGrid) return;

    var catalog;
    try { catalog = JSON.parse(catalogEl.textContent); } catch (e) { return; }

    /* Fuzzy-match destination to a key */
    var destNorm   = normalize(destination);
    var matchedKey = 'default';
    if (destNorm) {
      Object.keys(catalog).forEach(function (key) {
        if (key !== 'default' && normalize(key).indexOf(destNorm) !== -1) {
          matchedKey = key;
        }
      });
    }

    /* Restore sort/source filter from URL */
    if (filterForm && p.source)  { var sf = filterForm.querySelector('[name="source"]');  if (sf) sf.value = p.source; }
    if (sortSelect && p.sort)    sortSelect.value = p.sort;

    var currentKey = matchedKey;

    function renderOffers(key) {
      var set = catalog[key] || catalog['default'];
      var source = filterForm ? (filterForm.querySelector('[name="source"]') || {}).value || '' : '';
      var sort   = sortSelect ? sortSelect.value : '';

      var filtered = (set.offers || []).filter(function (o) {
        return !source || o.source === source;
      });

      if (sort === 'price-asc')   filtered.sort(function (a, b) { return a.priceFrom - b.priceFrom; });
      if (sort === 'price-desc')  filtered.sort(function (a, b) { return b.priceFrom - a.priceFrom; });
      if (sort === 'rating-desc') filtered.sort(function (a, b) { return b.rating - a.rating; });

      /* Count */
      var countEl = document.querySelector('[data-result-count]');
      if (countEl) countEl.textContent = 'عرض ' + filtered.length + ' عرض مقارنة';

      /* Empty state */
      toggleEmpty(filtered.length === 0);

      /* Re-render cards */
      offersGrid.innerHTML = filtered.map(function (offer, i) {
        var priceFmt = offer.priceFrom.toLocaleString('ar-SA');
        var stars    = starsText(offer.rating);
        var incl     = (offer.inclusions || []).map(function (inc) {
          return '<span class="badge badge-neutral text-xs">' + inc + '</span>';
        }).join('');
        var rankLabel = i === 0 ? '<span class="badge badge-success ms-2 text-xs">الأفضل سعراً</span>' : '';
        return [
          '<article class="compare-offer-card card" data-source="' + offer.source + '"',
          '  data-price="' + offer.priceFrom + '" data-rating="' + offer.rating + '">',
          '  <div class="card-body">',
          '    <div class="flex items-start justify-between gap-3 mb-3">',
          '      <h3 class="card-title text-base font-bold text-ink-800">' + offer.provider + '</h3>',
          '      <span class="badge ' + badgeClass(offer.source) + ' flex-none">' + offer.source + '</span>',
          '    </div>',
          '    <div class="flex items-baseline gap-2 mb-2">',
          '      <span class="text-xs text-ink-400">ابتداءً من</span>',
          '      <strong class="text-2xl font-extrabold text-lagoon-700">' + priceFmt + '</strong>',
          '      <span class="text-sm text-ink-400">' + offer.currency + '</span>',
          '      ' + rankLabel,
          '    </div>',
          '    <p class="text-sm text-amber-500 mb-3" aria-label="التقييم: ' + offer.rating + ' من 5">' + stars + ' <span class="text-ink-500">(' + offer.rating + ')</span></p>',
          '    <div class="flex flex-wrap gap-1.5 mb-4">' + incl + '</div>',
          '    <a href="deal-details.html?id=' + offer.id + '" class="btn btn-primary w-full justify-center">',
          '      ' + offer.cta.label,
          '    </a>',
          '  </div>',
          '</article>'
        ].join('\n');
      }).join('');

      /* Sync URL */
      setParams({ destination: destination, dates: dates, travelers: travelers,
                  source: source, sort: sort });
    }

    renderOffers(currentKey);

    if (filterForm) {
      filterForm.addEventListener('change', function () { renderOffers(currentKey); });
      filterForm.addEventListener('submit', function (e) { e.preventDefault(); });
    }
    if (sortSelect) sortSelect.addEventListener('change', function () { renderOffers(currentKey); });
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (filterForm) filterForm.reset();
        if (sortSelect) sortSelect.value = '';
        renderOffers(currentKey);
      });
    }
  }

  function badgeClass(source) {
    var map = {
      'Partner':     'badge-source-partner',
      'Affiliate':   'badge-source-affiliate',
      'Manual Deal': 'badge-source-manual',
      'API Ready':   'badge-source-api-ready'
    };
    return map[source] || 'badge-neutral';
  }

  /* ── US4 — Coupons listing (coupons.html) ──────────────────────────────── */

  function initCoupons() {
    var cards = Array.prototype.slice.call(
      document.querySelectorAll('[data-card]')
    );
    if (!cards.length) return;

    var filterForm = document.querySelector('[data-filter-form]');
    var resetBtn   = document.querySelector('[data-filter-reset]');
    var total      = cards.length;

    /* Restore from URL */
    var p = getParams();
    if (filterForm) {
      if (p.source)   { var s = filterForm.querySelector('[name="source"]');   if (s) s.value = p.source; }
      if (p.category) { var c = filterForm.querySelector('[name="category"]'); if (c) c.value = p.category; }
    }

    function applyFilters() {
      var source   = filterForm ? (filterForm.querySelector('[name="source"]')   || {}).value || '' : '';
      var category = filterForm ? (filterForm.querySelector('[name="category"]') || {}).value || '' : '';

      var visible = cards.filter(function (card) {
        var ok = true;
        if (source   && card.dataset.source   !== source)   ok = false;
        if (category && card.dataset.category !== category) ok = false;
        card.hidden = !ok;
        return ok;
      });

      updateCount(visible.length, total);
      toggleEmpty(visible.length === 0);
      setParams({ source: source, category: category });
    }

    applyFilters();

    if (filterForm) {
      filterForm.addEventListener('change', applyFilters);
      filterForm.addEventListener('input',  applyFilters);
      filterForm.addEventListener('submit', function (e) { e.preventDefault(); });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (filterForm) filterForm.reset();
        applyFilters();
      });
    }
  }

  /* ── Page dispatch ─────────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.documentElement.dataset.page || '';
    if (page === 'deals')        initDeals();
    if (page === 'deal-details') initDealDetails();
    if (page === 'compare')      initCompare();
    if (page === 'coupons')      initCoupons();
  });

})();
