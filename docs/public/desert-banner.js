/* Desert Mode info banner for shuhaibnc.github.io home page.
   Client-side only. Shows on page open; dismissal is remembered. */
(function () {
  'use strict';
  var KEY = 'desert-mode-banner-dismissed';
  var CSS =
    '#desert-mode-banner{background:linear-gradient(135deg,rgba(245,158,11,.12),rgba(245,158,11,.04));border-bottom:1px solid var(--vp-c-divider);}' +
    '.desert-banner-inner{max-width:1152px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;}' +
    '.desert-banner-emoji{font-size:22px;line-height:1;}' +
    '.desert-banner-text{font-size:14px;color:var(--vp-c-text-1);}' +
    '.desert-banner-btn{display:inline-block;padding:6px 18px;border-radius:20px;background:var(--vp-c-brand-2);color:#fff !important;font-size:13px;font-weight:600;text-decoration:none;white-space:nowrap;}' +
    '.desert-banner-btn:hover{background:var(--vp-c-brand-1);color:#fff !important;text-decoration:none;}' +
    '.desert-banner-close{background:none;border:none;color:var(--vp-c-text-2);cursor:pointer;font-size:13px;padding:4px 8px;line-height:1;}' +
    '.desert-banner-close:hover{color:var(--vp-c-text-1);}';

  function isHome() {
    var p = window.location.pathname;
    return p === '/' || p === '/index.html';
  }
  function isDismissed() {
    try { return !!window.localStorage.getItem(KEY); } catch (e) { return false; }
  }
  function build() {
    var existing = document.getElementById('desert-mode-banner');
    if (existing) return existing;
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    var b = document.createElement('div');
    b.id = 'desert-mode-banner';
    b.style.display = 'none';
    b.innerHTML =
      '<div class="desert-banner-inner">' +
      '<span class="desert-banner-emoji">\uD83C\uDFDC\uFE0F</span>' +
      '<span class="desert-banner-text"><strong>New: Desert Mode</strong> &mdash; wander this site as a 3D desert. Drive the car, tap the cacti.</span>' +
      '<a class="desert-banner-btn" href="/desert/" target="_blank" rel="noopener">Enter Desert</a>' +
      '<button class="desert-banner-close" type="button" aria-label="Dismiss">\u2715</button>' +
      '</div>';
    b.querySelector('.desert-banner-close').addEventListener('click', function () {
      b.remove();
      try { window.localStorage.setItem(KEY, '1'); } catch (e) {}
    });
    document.body.appendChild(b);
    return b;
  }
  function place() {
    var b = document.getElementById('desert-mode-banner');
    if (!isHome() || isDismissed()) { if (b) b.remove(); return; }
    var home = document.querySelector('.VPHome');
    if (!home) return;
    b = build();
    if (home.firstChild !== b) home.insertBefore(b, home.firstChild);
    b.style.display = 'block';
  }
  function init() {
    place();
    if ('MutationObserver' in window) {
      var scheduled = false;
      var obs = new MutationObserver(function () {
        if (scheduled) return;
        scheduled = true;
        setTimeout(function () { scheduled = false; place(); }, 300);
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
