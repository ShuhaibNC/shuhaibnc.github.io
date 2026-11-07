/* Early theme init — runs in <head> before first paint so a saved theme
 * never flashes the default first. Plain JS (no imports): keep in sync
 * with docs/.vitepress/theme/theme-prefs.ts, which owns the same logic
 * for the picker UI. Shared storage key with the /patches/ page. */
(function () {
  var prefs = {};
  try {
    prefs = JSON.parse(localStorage.getItem('shuhaib-site-prefs-v1') || '{}') || {};
  } catch (e) { prefs = {}; /* corrupt storage: fall back to the default theme */ }
  try {
    var root = document.documentElement;
    root.dataset.siteTheme = prefs.theme || 'default';
    root.dataset.fontSize = prefs.fontSize || 'default';
    root.dataset.density = prefs.density || 'comfortable';
    root.dataset.radius = prefs.radius || 'default';
    if (prefs.accent) {
      var a = prefs.accent;
      var n = parseInt(a.slice(1), 16);
      var rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      var mix = function (target, amount) {
        return 'rgb(' + rgb.map(function (v, i) { return Math.round(v + (target[i] - v) * amount); }).join(', ') + ')';
      };
      root.style.setProperty('--vp-c-brand-1', a);
      root.style.setProperty('--vp-c-brand-2', mix([0, 0, 0], 0.18));
      root.style.setProperty('--vp-c-brand-3', mix([0, 0, 0], 0.35));
      root.style.setProperty('--vp-c-brand-soft', mix([255, 255, 255], 0.86));
      root.style.setProperty('--accent', a);
    }
  } catch (e) { /* storage/DOM unavailable: fall back to the default theme */ }
})();
