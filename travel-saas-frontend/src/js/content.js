/* content.js — additive enhancement for the four SEO/content pages
   Loaded only by destinations.html, destination-details.html, blog.html, article.html.
   main.js / ui.js / discovery.js remain UNCHANGED. */
(function () {
  'use strict';

  /* ── Shared helpers ─────────────────────────────────────────────────────── */

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function setParams(params) {
    var url = window.location.pathname;
    var qs = params.toString();
    history.replaceState(null, '', qs ? url + '?' + qs : url);
  }

  function normalize(str) {
    return (str || '').trim().toLowerCase().replace(/[ً-ٟ]/g, ''); // strip Arabic diacritics
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (prefersReducedMotion()) {
      el.scrollIntoView();
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function updateResultCount(container, count) {
    var el = container && container.querySelector('[data-result-count]');
    if (el) el.textContent = count;
  }

  function toggleEmptyState(container, isEmpty) {
    var empty = container && container.querySelector('[data-empty-state]');
    var grid = container && container.querySelector('[data-cards-grid]');
    if (empty) empty.hidden = !isEmpty;
    if (grid) grid.setAttribute('aria-hidden', isEmpty ? 'true' : 'false');
  }

  /* ── Page dispatch ───────────────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.documentElement.dataset.page;

    if (page === 'destinations') {
      initDestinations();
    } else if (page === 'destination-details') {
      initDestinationDetails();
    } else if (page === 'blog') {
      initBlog();
    } else if (page === 'article') {
      initArticle();
    }
  });

  /* ════════════════════════════════════════════════════════════════════════
     US1 — destinations.html
  ════════════════════════════════════════════════════════════════════════ */
  function initDestinations() {
    var root = document.getElementById('destinations-section');
    var searchEl = document.querySelector('[data-search-input]');
    var resetBtn = document.querySelector('[data-filter-reset]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    function getActiveChips() {
      var region = null,
        style = null;
      document
        .querySelectorAll('[data-filter="region"][aria-pressed="true"]')
        .forEach(function (b) {
          region = b.dataset.value;
        });
      document.querySelectorAll('[data-filter="style"][aria-pressed="true"]').forEach(function (b) {
        style = b.dataset.value;
      });
      return { region: region, style: style };
    }

    function applyFilters() {
      var q = normalize(searchEl ? searchEl.value : '');
      var chips = getActiveChips();
      var visible = 0;

      cards.forEach(function (card) {
        var haystack =
          normalize(card.dataset.search || '') + ' ' + normalize(card.dataset.destination || '');
        var matchQ = !q || haystack.indexOf(q) !== -1;
        var matchR =
          !chips.region || normalize(card.dataset.region || '') === normalize(chips.region);
        var matchS =
          !chips.style ||
          normalize(card.dataset.style || '').indexOf(normalize(chips.style)) !== -1;
        var show = matchQ && matchR && matchS;
        card.hidden = !show;
        if (show) visible++;
      });

      updateResultCount(root, visible);
      toggleEmptyState(root, visible === 0);

      var params = new URLSearchParams();
      if (chips.region) params.set('region', chips.region);
      if (chips.style) params.set('style', chips.style);
      if (q) params.set('q', q);
      setParams(params);
    }

    function restoreFromUrl() {
      var p = getParams();
      var region = p.get('region'),
        style = p.get('style'),
        q = p.get('q');

      if (region) {
        var rb = document.querySelector('[data-filter="region"][data-value="' + region + '"]');
        if (rb) rb.setAttribute('aria-pressed', 'true');
      }
      if (style) {
        var sb = document.querySelector('[data-filter="style"][data-value="' + style + '"]');
        if (sb) sb.setAttribute('aria-pressed', 'true');
      }
      if (q && searchEl) searchEl.value = q;
    }

    // Chip toggles
    document.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.dataset.filter;
        var pressed = btn.getAttribute('aria-pressed') === 'true';

        // "الكل" resets the facet
        if (btn.dataset.value === 'all') {
          document.querySelectorAll('[data-filter="' + group + '"]').forEach(function (b) {
            b.setAttribute('aria-pressed', 'false');
          });
          btn.setAttribute('aria-pressed', 'true');
        } else {
          // Deactivate "الكل" button in same group
          var allBtn = document.querySelector('[data-filter="' + group + '"][data-value="all"]');
          if (allBtn) allBtn.setAttribute('aria-pressed', 'false');

          // Toggle this chip (exclusive within group)
          document.querySelectorAll('[data-filter="' + group + '"]').forEach(function (b) {
            b.setAttribute('aria-pressed', 'false');
          });
          btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        }
        applyFilters();
      });
    });

    // Search
    if (searchEl) {
      searchEl.addEventListener('input', applyFilters);
    }

    // Reset
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        document.querySelectorAll('[data-filter]').forEach(function (b) {
          b.setAttribute('aria-pressed', 'false');
        });
        var allBtns = document.querySelectorAll('[data-filter][data-value="all"]');
        allBtns.forEach(function (b) {
          b.setAttribute('aria-pressed', 'true');
        });
        if (searchEl) searchEl.value = '';
        applyFilters();
      });
    }

    // Save / favorite toggles
    document.querySelectorAll('[data-save-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        if (window.TUI && window.TUI.toast) {
          window.TUI.toast(
            pressed ? 'تمت إزالة الوجهة من المحفوظات' : 'تمت إضافة الوجهة إلى المحفوظات'
          );
        }
      });
    });

    restoreFromUrl();
    applyFilters();
  }

  /* ════════════════════════════════════════════════════════════════════════
     US2 — destination-details.html
  ════════════════════════════════════════════════════════════════════════ */
  function initDestinationDetails() {
    var catalogEl = document.getElementById('destinations-catalog');
    if (!catalogEl) return;

    var catalog;
    try {
      catalog = JSON.parse(catalogEl.textContent);
    } catch (e) {
      return;
    }

    var params = getParams();
    var id = params.get('id') || params.get('destination') || 'dest-dubai';
    var dest = null;

    for (var i = 0; i < catalog.length; i++) {
      if (catalog[i].id === id || catalog[i].slug === id) {
        dest = catalog[i];
        break;
      }
    }
    if (!dest) {
      // Fallback: find dest-dubai
      for (var j = 0; j < catalog.length; j++) {
        if (catalog[j].id === 'dest-dubai') {
          dest = catalog[j];
          break;
        }
      }
    }
    if (!dest) return; // static default remains

    // Swap [data-dest-*] targets
    function swap(attr, value) {
      document.querySelectorAll('[data-dest-' + attr + ']').forEach(function (el) {
        el.textContent = value;
      });
    }
    function swapAttr(attr, attrName, value) {
      document.querySelectorAll('[data-dest-' + attr + ']').forEach(function (el) {
        el.setAttribute(attrName, value);
      });
    }

    if (dest.name) {
      swap('name', dest.name);
    }
    if (dest.country) {
      swap('country', dest.country);
    }
    if (dest.region) {
      swap('region', dest.region);
    }
    if (dest.description) {
      swap('description', dest.description);
    }
    if (dest.priceFrom) {
      swap('price', dest.priceFrom.toLocaleString('ar-SA') + ' ' + (dest.currency || 'ر.س'));
    }
    if (dest.bestSeason) {
      swap('season', dest.bestSeason);
    }
    if (dest.image) {
      swapAttr('img', 'src', dest.image);
    }
    if (dest.imageAlt) {
      swapAttr('img', 'alt', dest.imageAlt);
    }

    // Update page title and breadcrumb
    var titleEl = document.querySelector('[data-dest-page-title]');
    if (titleEl && dest.name && dest.country) {
      document.title = dest.name + '، ' + dest.country + ' — رحلاتي';
      titleEl.textContent = dest.name + '، ' + dest.country;
    }

    // Save toggle
    document.querySelectorAll('[data-save-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        if (window.TUI && window.TUI.toast) {
          window.TUI.toast(pressed ? 'تمت إزالة الوجهة من المحفوظات' : 'تمت حفظ الوجهة بنجاح');
        }
      });
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     US3 — blog.html
  ════════════════════════════════════════════════════════════════════════ */
  function initBlog() {
    var root = document.getElementById('blog-section');
    var searchEl = document.querySelector('[data-search-input]');
    var resetBtn = document.querySelector('[data-filter-reset]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    function applyFilters() {
      var q = normalize(searchEl ? searchEl.value : '');
      var cat = null;
      document
        .querySelectorAll('[data-filter="category"][aria-pressed="true"]')
        .forEach(function (b) {
          if (b.dataset.value !== 'all') cat = b.dataset.value;
        });
      var visible = 0;

      cards.forEach(function (card) {
        var matchQ = !q || normalize(card.dataset.search || '').indexOf(q) !== -1;
        var matchC = !cat || normalize(card.dataset.category || '') === normalize(cat);
        var show = matchQ && matchC;
        card.hidden = !show;
        if (show) visible++;
      });

      updateResultCount(root, visible);
      toggleEmptyState(root, visible === 0);

      var params = new URLSearchParams();
      if (cat) params.set('category', cat);
      if (q) params.set('q', q);
      setParams(params);
    }

    function restoreFromUrl() {
      var p = getParams();
      var cat = p.get('category'),
        q = p.get('q');
      if (cat) {
        var cb = document.querySelector('[data-filter="category"][data-value="' + cat + '"]');
        if (cb) cb.setAttribute('aria-pressed', 'true');
      }
      if (q && searchEl) searchEl.value = q;
    }

    document.querySelectorAll('[data-filter="category"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pressed = btn.getAttribute('aria-pressed') === 'true';
        document.querySelectorAll('[data-filter="category"]').forEach(function (b) {
          b.setAttribute('aria-pressed', 'false');
        });
        btn.setAttribute('aria-pressed', pressed && btn.dataset.value !== 'all' ? 'false' : 'true');
        if (btn.dataset.value === 'all') {
          document
            .querySelectorAll('[data-filter="category"][data-value="all"]')
            .forEach(function (b) {
              b.setAttribute('aria-pressed', 'true');
            });
        }
        applyFilters();
      });
    });

    if (searchEl) {
      searchEl.addEventListener('input', applyFilters);
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        document.querySelectorAll('[data-filter="category"]').forEach(function (b) {
          b.setAttribute('aria-pressed', 'false');
        });
        var allBtn = document.querySelector('[data-filter="category"][data-value="all"]');
        if (allBtn) allBtn.setAttribute('aria-pressed', 'true');
        if (searchEl) searchEl.value = '';
        applyFilters();
      });
    }

    document.querySelectorAll('[data-save-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        if (window.TUI && window.TUI.toast) {
          window.TUI.toast(pressed ? 'تمت إزالة المقال من المحفوظات' : 'تم حفظ المقال');
        }
      });
    });

    restoreFromUrl();
    applyFilters();
  }

  /* ════════════════════════════════════════════════════════════════════════
     US4 — article.html
  ════════════════════════════════════════════════════════════════════════ */
  function initArticle() {
    // Inline catalog swap
    var catalogEl = document.getElementById('articles-catalog');
    if (catalogEl) {
      var catalog;
      try {
        catalog = JSON.parse(catalogEl.textContent);
      } catch (e) {
        catalog = null;
      }

      if (catalog) {
        var params = getParams();
        var id = params.get('id') || params.get('article') || 'art-cheap-dubai-deals';
        var art = null;

        for (var i = 0; i < catalog.length; i++) {
          if (catalog[i].id === id) {
            art = catalog[i];
            break;
          }
        }
        if (!art) {
          for (var j = 0; j < catalog.length; j++) {
            if (catalog[j].id === 'art-cheap-dubai-deals') {
              art = catalog[j];
              break;
            }
          }
        }

        if (art) {
          function swap(attr, val) {
            document.querySelectorAll('[data-article-' + attr + ']').forEach(function (el) {
              el.textContent = val;
            });
          }
          if (art.title) {
            swap('title', art.title);
            document.title = art.title + ' — رحلاتي';
          }
          if (art.excerpt) {
            swap('excerpt', art.excerpt);
          }
          if (art.author) {
            swap('author', art.author);
          }
          if (art.category) {
            swap('category', art.category);
          }
          if (art.readingTime) {
            swap('reading-time', art.readingTime);
          }
          if (art.relatedDestination) {
            swap('destination', art.relatedDestination);
          }
        }
      }
    }

    // TOC smooth-scroll (anchors work without JS; JS adds smooth behavior)
    document.querySelectorAll('[data-toc-link]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        e.preventDefault();
        scrollToSection(href.slice(1));
        history.replaceState(null, '', href);
      });
    });

    // Share buttons → toast
    document.querySelectorAll('[data-share-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var msg = btn.dataset.shareMsg || 'تم نسخ رابط المقال — شاركه مع أصدقائك';
        if (window.TUI && window.TUI.toast) {
          window.TUI.toast(msg);
        }
      });
    });

    // Save toggle
    document.querySelectorAll('[data-save-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        if (window.TUI && window.TUI.toast) {
          window.TUI.toast(pressed ? 'تمت إزالة المقال من المحفوظات' : 'تم حفظ المقال بنجاح');
        }
      });
    });
  }
})();
