/* MyCampus Web: app logic. Plain JS, no build step.
 * Demo mode by default: nothing is sent anywhere, nothing is stored
 * except a session flag and the visitor's own theme choices
 * (localStorage). Set WORKER_URL below to the deployed Cloudflare
 * Worker URL to enable live portal login; credentials then go only to
 * that Worker, and the session token lives in sessionStorage. */
'use strict';

(function () {
  var D = MC_DATA;
  var $ = function (id) { return document.getElementById(id); };

  /* ---- live mode (Cloudflare Worker) ----
   * Set WORKER_URL to the deployed Worker URL (https://...) to enable
   * real portal login. While it is '' the app is demo-only, exactly as
   * today: nothing is sent anywhere. HTTP is refused except localhost.
   * The Worker logs in to cev.etlab.in for the visitor; the token is
   * kept in sessionStorage and cleared on sign out. */
  var WORKER_URL = 'https://mycampus-worker.shuhaib.workers.dev';
  var LIVE_TOKEN_KEY = 'mycampus-live-token';
  var liveMode = false;
  var liveToken = null;
  var liveCache = {};

  function workerUrlOk(u) {
    if (!u) return false;
    try {
      var p = new URL(u);
      return p.protocol === 'https:' ||
        (p.protocol === 'http:' && (p.hostname === 'localhost' || p.hostname === '127.0.0.1'));
    } catch (e) { return false; }
  }
  if (WORKER_URL) WORKER_URL = WORKER_URL.replace(/\/$/, '');
  var LIVE_ENABLED = workerUrlOk(WORKER_URL);

  /* ---- decorative inline SVG icons (Lucide-style line icons) ----
   * Reused by the JS-rendered empty states and the timetable heading.
   * Static HTML carries its own copies. All are aria-hidden. */
  var IC = {
    calLine: '<span class="h-icon muted" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg></span>',
    gradCap: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>',
    inbox: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
    calH2: '<span class="h-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg></span>'
  };

  /* ================= themes ================= */
  var PREFS_KEY = 'shuhaib-site-prefs-v1';
  var MC_KEY = 'mycampus-prefs-v1';

  var THEMES = [
    { id: 'default', name: 'Default', desc: 'The current look', swatch: ['#ffffff', '#3451b2'] },
    { id: 'amoled', name: 'AMOLED', desc: 'Pure black, high contrast', swatch: ['#000000', '#64b5f6'] },
    { id: 'midnight', name: 'Midnight', desc: 'Deep navy dark', swatch: ['#0a1128', '#7cb3ff'] },
    { id: 'forest', name: 'Forest', desc: 'Deep green dark', swatch: ['#0a1a12', '#4ade80'] },
    { id: 'mocha', name: 'Catppuccin Mocha', desc: 'Warm dark, mauve accent', swatch: ['#1e1e2e', '#cba6f7'] },
    { id: 'paper', name: 'Paper', desc: 'Warm light, amber accent', swatch: ['#faf7f0', '#b45309'] },
    { id: 'nord', name: 'Nord', desc: 'Cool arctic dark', swatch: ['#2e3440', '#88c0d0'] },
    { id: 'dracula', name: 'Dracula', desc: 'Dark purple, pink accent', swatch: ['#282a36', '#ff79c6'] },
    { id: 'solarized', name: 'Solarized Dark', desc: 'Classic low-contrast dark', swatch: ['#002b36', '#268bd2'] },
    { id: 'rosepine', name: 'Rose Pine', desc: 'Muted plum dark', swatch: ['#191724', '#ebbcba'] },
    { id: 'gruvbox', name: 'Gruvbox', desc: 'Warm retro dark', swatch: ['#282828', '#fabd2f'] },
    { id: 'ocean', name: 'Ocean', desc: 'Deep blue dark', swatch: ['#0b1e33', '#38bdf8'] }
  ];

  var ACCENTS = [
    { id: 'default', name: 'Theme default', value: '' },
    { id: 'blue', name: 'Blue', value: '#3b82f6' },
    { id: 'sky', name: 'Sky', value: '#0284c7' },
    { id: 'violet', name: 'Violet', value: '#8b5cf6' },
    { id: 'pink', name: 'Pink', value: '#ec4899' },
    { id: 'green', name: 'Green', value: '#22c55e' },
    { id: 'teal', name: 'Teal', value: '#14b8a6' },
    { id: 'amber', name: 'Amber', value: '#f59e0b' },
    { id: 'red', name: 'Red', value: '#ef4444' }
  ];

  var DEFAULT_PREFS = { theme: 'default', accent: '', fontSize: 'default', density: 'comfortable', radius: 'default' };
  var DEFAULT_MC = { font: 'inter', width: 'narrow' };

  function loadPrefs() {
    try {
      var p = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}') || {};
      return {
        theme: THEMES.some(function (t) { return t.id === p.theme; }) ? p.theme : 'default',
        accent: typeof p.accent === 'string' ? p.accent : '',
        fontSize: (p.fontSize === 'small' || p.fontSize === 'large') ? p.fontSize : 'default',
        density: p.density === 'compact' ? 'compact' : 'comfortable',
        radius: (p.radius === 'sharp' || p.radius === 'rounded') ? p.radius : 'default'
      };
    } catch (e) { return Object.assign({}, DEFAULT_PREFS); }
  }

  function loadMcPrefs() {
    try {
      var p = JSON.parse(localStorage.getItem(MC_KEY) || '{}') || {};
      return {
        font: ['inter', 'system', 'serif', 'mono'].indexOf(p.font) >= 0 ? p.font : 'inter',
        width: p.width === 'wide' ? 'wide' : 'narrow'
      };
    } catch (e) { return Object.assign({}, DEFAULT_MC); }
  }

  function mix(hex, target, amount) {
    var n = parseInt(hex.slice(1), 16);
    var c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    var out = c.map(function (v, i) { return Math.round(v + (target[i] - v) * amount); });
    return 'rgb(' + out.join(', ') + ')';
  }

  function applyPrefs(prefs) {
    var root = document.documentElement;
    root.dataset.siteTheme = prefs.theme;
    root.dataset.fontSize = prefs.fontSize;
    root.dataset.density = prefs.density;
    root.dataset.radius = prefs.radius;
    if (prefs.accent) {
      var a = prefs.accent;
      root.style.setProperty('--vp-c-brand-1', a);
      root.style.setProperty('--vp-c-brand-2', mix(a, [0, 0, 0], 0.18));
      root.style.setProperty('--vp-c-brand-3', mix(a, [0, 0, 0], 0.35));
      root.style.setProperty('--vp-c-brand-soft', mix(a, [255, 255, 255], 0.86));
      root.style.setProperty('--accent', a);
    } else {
      root.style.removeProperty('--vp-c-brand-1');
      root.style.removeProperty('--vp-c-brand-2');
      root.style.removeProperty('--vp-c-brand-3');
      root.style.removeProperty('--vp-c-brand-soft');
      root.style.removeProperty('--accent');
    }
  }

  function applyMcPrefs(mc) {
    var root = document.documentElement;
    root.dataset.mcFont = mc.font;
    root.dataset.mcWidth = mc.width;
  }

  var prefs = loadPrefs();
  var mcPrefs = loadMcPrefs();
  applyPrefs(prefs);
  applyMcPrefs(mcPrefs);

  function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) {}
    applyPrefs(prefs);
    renderThemePanel();
  }
  function saveMcPrefs() {
    try { localStorage.setItem(MC_KEY, JSON.stringify(mcPrefs)); } catch (e) {}
    applyMcPrefs(mcPrefs);
    renderThemePanel();
  }

  /* ---------- theme panel ---------- */
  var panel = $('themePanel');
  var paletteBtn = $('paletteBtn');

  function segRow(title, options, current, onPick) {
    var html = '<p class="theme-panel-title">' + title + '</p><div class="seg-row" role="group" aria-label="' + title + '">';
    options.forEach(function (o) {
      html += '<button type="button" data-seg="' + title + ':' + o.id + '"' +
        (o.id === current ? ' class="active"' : '') + '>' + o.name + '</button>';
    });
    html += '</div>';
    return html;
  }

  function renderThemePanel() {
    var html = '<p class="theme-panel-title">Theme</p><div class="theme-grid">';
    THEMES.forEach(function (t) {
      html += '<button type="button" class="theme-card' + (prefs.theme === t.id ? ' active' : '') + '" data-theme="' + t.id + '">' +
        '<span class="theme-swatch" style="background:' + t.swatch[0] + ';--sw-accent:' + t.swatch[1] + '"><span class="theme-swatch-dot"></span></span>' +
        '<span class="theme-name">' + t.name + '</span>' +
        '<span class="theme-desc">' + t.desc + '</span>' +
        (t.id === 'default' ? '<span class="theme-default-badge">Default</span>' : '') +
        '</button>';
    });
    html += '</div>';

    html += '<p class="theme-panel-title">Accent colour</p><div class="accent-row">';
    ACCENTS.forEach(function (a) {
      html += '<button type="button" class="accent-swatch' + (prefs.accent === a.value ? ' active' : '') + '" data-accent="' + a.value + '"' +
        ' title="' + a.name + '" aria-label="' + a.name + '"' +
        (a.value ? ' style="background:' + a.value + '"' : '') + '>' +
        (a.value ? '' : '<span class="accent-none">&#10005;</span>') + '</button>';
    });
    html += '<label class="accent-custom" title="Custom accent colour"><input type="color" id="accentCustom" value="' + (prefs.accent || '#3b82f6') + '" aria-label="Custom accent colour" /><span>+</span></label></div>';

    html += segRow('Text size', [
      { id: 'small', name: 'Small' }, { id: 'default', name: 'Default' }, { id: 'large', name: 'Large' }
    ], prefs.fontSize);
    html += segRow('Density', [
      { id: 'comfortable', name: 'Comfortable' }, { id: 'compact', name: 'Compact' }
    ], prefs.density);
    html += segRow('Corners', [
      { id: 'default', name: 'Default' }, { id: 'sharp', name: 'Sharp' }, { id: 'rounded', name: 'Rounded' }
    ], prefs.radius);
    html += segRow('Font family', [
      { id: 'inter', name: 'Inter' }, { id: 'system', name: 'System' },
      { id: 'serif', name: 'Serif' }, { id: 'mono', name: 'Mono' }
    ], mcPrefs.font);
    html += segRow('Content width', [
      { id: 'narrow', name: 'Narrow' }, { id: 'wide', name: 'Wide' }
    ], mcPrefs.width);

    html += '<button type="button" class="theme-reset" id="themeReset">Reset to default</button>' +
      '<p class="theme-note">Saved on this device. The theme follows you to the main site and the Patches page; font and width are MyCampus-only.</p>';
    panel.innerHTML = html;

    panel.querySelectorAll('[data-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () { prefs.theme = btn.dataset.theme; savePrefs(); });
    });
    panel.querySelectorAll('[data-accent]').forEach(function (btn) {
      btn.addEventListener('click', function () { prefs.accent = btn.dataset.accent; savePrefs(); });
    });
    var custom = $('accentCustom');
    if (custom) custom.addEventListener('input', function () { prefs.accent = custom.value; savePrefs(); });
    panel.querySelectorAll('[data-seg]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parts = btn.dataset.seg.split(':');
        var group = parts[0], value = parts[1];
        if (group === 'Text size') { prefs.fontSize = value; savePrefs(); }
        else if (group === 'Density') { prefs.density = value; savePrefs(); }
        else if (group === 'Corners') { prefs.radius = value; savePrefs(); }
        else if (group === 'Font family') { mcPrefs.font = value; saveMcPrefs(); }
        else if (group === 'Content width') { mcPrefs.width = value; saveMcPrefs(); }
      });
    });
    var reset = $('themeReset');
    if (reset) reset.addEventListener('click', function () {
      prefs = Object.assign({}, DEFAULT_PREFS);
      mcPrefs = Object.assign({}, DEFAULT_MC);
      savePrefs();
      saveMcPrefs();
    });
  }
  renderThemePanel();

  function togglePanel(force) {
    var show = typeof force === 'boolean' ? force : panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !show);
    paletteBtn.setAttribute('aria-expanded', String(show));
  }
  paletteBtn.addEventListener('click', function (e) { e.stopPropagation(); togglePanel(); });
  document.addEventListener('click', function (e) {
    if (!panel.classList.contains('hidden') && !panel.contains(e.target) && e.target !== paletteBtn) togglePanel(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') togglePanel(false); });
  $('profileOpenThemes').addEventListener('click', function () { togglePanel(true); });

  /* ================= login: demo + live (Worker) ================= */
  var SESSION_KEY = 'mycampus-demo-session';
  var displayName = D.PROFILE.name;

  function showApp() {
    $('loginView').classList.add('hidden');
    $('appView').classList.remove('hidden');
    $('navLogoutBtn').classList.remove('hidden');
    renderAll();
  }
  function showLogin() {
    $('appView').classList.add('hidden');
    $('loginView').classList.remove('hidden');
    $('navLogoutBtn').classList.add('hidden');
  }

  var DEMO_FOOT = 'MyCampus Web 1.0 · Demo mode, sample data, nothing is sent anywhere · Live login works in the Android app · ';
  var LIVE_FOOT = 'MyCampus Web 1.0 · Live data from cev.etlab.in via the MyCampus Worker · Signing out clears your session · ';
  var DEMO_ABOUT = 'MyCampus Web 1.0 is a browser port of the MyCampus Android app, a direct client for the CEV Etlab portal. This web version runs in demo mode with sample data; a browser cannot log in to cev.etlab.in, so live portal login works in the Android app only. Source: ';
  var LIVE_ABOUT = 'MyCampus Web 1.0 is a browser port of the MyCampus Android app, a direct client for the CEV Etlab portal. You are signed in to the live portal through the MyCampus Worker, which logs in to cev.etlab.in for you; your password was sent only to the Worker and is not stored. Source: ';

  /* Swap every "Demo" badge for "Live" (and back), plus footer/About copy. */
  function setModeBadge(live) {
    document.querySelectorAll('.demo-tag').forEach(function (el) {
      if (!el.dataset.demoText) el.dataset.demoText = el.textContent;
      el.textContent = live ? el.dataset.demoText.replace('Demo', 'Live') : el.dataset.demoText;
      el.classList.toggle('live-tag', live);
    });
    var foot = $('siteFoot');
    if (foot && foot.firstChild && foot.firstChild.nodeType === 3) {
      foot.firstChild.textContent = live ? LIVE_FOOT : DEMO_FOOT;
    }
    var about = $('aboutText');
    if (about && about.firstChild && about.firstChild.nodeType === 3) {
      about.firstChild.textContent = live ? LIVE_ABOUT : DEMO_ABOUT;
    }
  }

  function showLoginError(msg) {
    var el = $('loginError');
    if (!el) return;
    if (msg) { el.textContent = msg; el.classList.remove('hidden'); }
    else { el.textContent = ''; el.classList.add('hidden'); }
  }

  function setLoginBusy(busy) {
    var btn = $('loginForm').querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = busy;
    /* Update only the label span: setting textContent on the button
     * itself would wipe its log-in icon. */
    var label = btn.querySelector('.btn-label');
    var text = busy ? 'Signing in…' : (LIVE_ENABLED ? 'Sign in' : 'Sign in to demo');
    if (label) label.textContent = text;
    else btn.textContent = text;
  }

  function enterDemo(name) {
    liveMode = false;
    liveToken = null;
    liveCache = {};
    D = MC_DATA;
    displayName = (name || '').trim() || D.PROFILE.name;
    try {
      sessionStorage.setItem(SESSION_KEY, displayName);
      sessionStorage.removeItem(LIVE_TOKEN_KEY);
    } catch (e) {}
    setModeBadge(false);
    showLoginError('');
    showApp();
    window.scrollTo(0, 0);
  }

  /* ---- live mode (Cloudflare Worker) ---- */

  function liveFetch(path, opts) {
    opts = opts || {};
    var headers = { 'Content-Type': 'application/json' };
    if (liveToken) headers.Authorization = 'Bearer ' + liveToken;
    return fetch(WORKER_URL + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var err = new Error((data && data.error) || 'Request failed.');
          err.status = res.status;
          throw err;
        }
        return data;
      });
    });
  }

  function rowsFromAttendance(att) {
    var rows = [];
    Object.keys(att || {}).forEach(function (k) {
      var s = att[k];
      if (s && typeof s === 'object' && s.present_hours !== undefined) {
        rows.push({
          code: k,
          present: parseInt(s.present_hours, 10) || 0,
          total: parseInt(s.total_hours, 10) || 0
        });
      }
    });
    return rows;
  }

  function liveSlotType(codeOrName) {
    if (/lab|project/i.test(MC_DATA.subjectName(codeOrName))) return 'lab';
    return 'theory';
  }

  /* Adapt a Worker monthly response ({month, days, requestedMonth?,
   * servedMonth?}) into the MC_DATA monthly shape. Shared by the
   * initial live load and month navigation. */
  function adaptMonthly(monthlyRes) {
    var monthParts = String((monthlyRes && monthlyRes.month) || '').split(' ');
    var monthName = monthParts[0] || '';
    var year = parseInt(monthParts[1], 10) || new Date().getFullYear();
    var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    var monthIndex = MONTH_NAMES.indexOf(monthName);
    if (monthIndex < 0) monthIndex = new Date().getMonth();
    return {
      month: (monthlyRes && monthlyRes.month) || '',
      year: year,
      monthIndex: monthIndex,
      days: ((monthlyRes && monthlyRes.days) || []).map(function (day) {
        var date = new Date(year, monthIndex, day.d);
        var allHoliday = day.periods.length > 0 &&
          day.periods.every(function (p) { return p.s === 'H' && !p.sub; });
        return {
          d: day.d,
          label: day.d + ' ' + monthName + ' ' + year,
          weekday: date.toLocaleDateString('en-GB', { weekday: 'long' }),
          holiday: allHoliday ? 'Holiday' : '',
          periods: day.periods
        };
      }),
      requestedMonth: (monthlyRes && monthlyRes.requestedMonth) || '',
      servedMonth: (monthlyRes && monthlyRes.servedMonth) || ''
    };
  }

  /* Build a MC_DATA-shaped object from Worker responses so every render
   * function works unchanged in live mode. */
  function buildLiveData(profileRes, attRes, monthlyRes, ttRes, resRes) {
    var pd = (profileRes && profileRes.profile_details) || {};
    var att = attRes || {};
    var rows = rowsFromAttendance(att);

    var monthly = adaptMonthly(monthlyRes);
    var initialMonthKey = monthKeyOf(monthly.year, monthly.monthIndex);
    var liveMonths = {};
    liveMonths[initialMonthKey] = monthly;

    var tt = {};
    var rawTt = ttRes || {};
    MC_DATA.DAY_NAMES.forEach(function (dayKey) {
      var dayObj = rawTt[dayKey] || {};
      var slots = Object.keys(dayObj)
        .map(function (k) { return { n: parseInt(k.replace('period-', ''), 10) || 0, slot: dayObj[k] }; })
        .sort(function (a, b) { return a.n - b.n; })
        .map(function (item) {
          var name = (item.slot && item.slot.name) || '';
          var code = /[0-9]{2}[A-Z]{2,}[0-9]+/.exec(name.toUpperCase());
          return code ? code[0] : name;
        });
      tt[dayKey] = slots;
    });

    return {
      PROFILE: {
        name: pd.name || '',
        roll: att.roll_no || '',
        course: 'MCA',
        semester: 3,
        college: 'College of Engineering Vadakara (CEV)',
        university: 'APJ Abdul Kalam Technological University (KTU)',
        scheme: 'MCA 2020 scheme',
        portal: 'https://cev.etlab.in',
        dob: pd.dob || '',
        admissionNo: pd.admission_no || '',
        universityRegNo: pd.university_roll_no || ''
      },
      SUBJECTS: MC_DATA.SUBJECTS,
      subjectName: function (code) { return MC_DATA.subjectName(code); },
      ATTENDANCE: { 3: rows },
      overallPct: function (sem) {
        var r = this.ATTENDANCE[sem] || [];
        var p = 0, t = 0;
        r.forEach(function (row) { p += row.present; t += row.total; });
        return t === 0 ? 0 : (p * 100 / t);
      },
      PERIOD_TIMES: MC_DATA.PERIOD_TIMES,
      TIMETABLE: tt,
      slotType: liveSlotType,
      DAY_NAMES: MC_DATA.DAY_NAMES,
      DAY_LABELS: MC_DATA.DAY_LABELS,
      RESULTS: { 3: (resRes && resRes.series) || [] },
      STATUS_COLORS: MC_DATA.STATUS_COLORS,
      STATUS_WORDS: MC_DATA.STATUS_WORDS,
      MONTHLY: monthly,
      MONTHS: liveMonths,
      MONTH_ORDER: [initialMonthKey],
      findDay: function (date) {
        var m = liveMonths[monthKeyOf(date.getFullYear(), date.getMonth())];
        if (!m) return null;
        var dom = date.getDate();
        for (var i = 0; i < m.days.length; i++) {
          if (m.days[i].d === dom) return m.days[i];
        }
        return null;
      }
    };
  }

  function loadLiveData() {
    return Promise.all([
      liveFetch('/api/profile'),
      liveFetch('/api/attendance?sem=3'),
      liveFetch('/api/monthly'),
      liveFetch('/api/timetable'),
      liveFetch('/api/results?sem=3')
    ]).then(function (parts) {
      D = buildLiveData(parts[0], parts[1], parts[2], parts[3], parts[4]);
      displayName = D.PROFILE.name || displayName;
      liveMode = true;
      liveCache = { 3: { att: D.ATTENDANCE[3], res: D.RESULTS[3] } };
      setModeBadge(true);
    });
  }

  function enterLive(username, password) {
    showLoginError('');
    setLoginBusy(true);
    liveFetch('/api/login', { method: 'POST', body: { username: username, password: password } })
      .then(function (data) {
        liveToken = data.token;
        try { sessionStorage.setItem(LIVE_TOKEN_KEY, liveToken); } catch (e) {}
        return loadLiveData();
      })
      .then(function () {
        setLoginBusy(false);
        showApp();
        window.scrollTo(0, 0);
      })
      .catch(function (err) {
        liveToken = null;
        try { sessionStorage.removeItem(LIVE_TOKEN_KEY); } catch (e) {}
        setLoginBusy(false);
        showLoginError(err.status === 401
          ? 'Invalid username or password. Check for typos, or explore the demo below.'
          : (err.message || 'Could not reach the Worker. Check your connection, or explore the demo below.'));
      });
  }

  /* Fetch one semester's attendance + results from the Worker (cached). */
  function loadLiveSem(sem) {
    if (liveCache[sem]) {
      D.ATTENDANCE[sem] = liveCache[sem].att;
      D.RESULTS[sem] = liveCache[sem].res;
      return Promise.resolve();
    }
    return Promise.all([
      liveFetch('/api/attendance?sem=' + sem),
      liveFetch('/api/results?sem=' + sem)
    ]).then(function (parts) {
      var att = rowsFromAttendance(parts[0]);
      var res = (parts[1] && parts[1].series) || [];
      liveCache[sem] = { att: att, res: res };
      D.ATTENDANCE[sem] = att;
      D.RESULTS[sem] = res;
    }).catch(function (err) {
      if (err.status === 401) signOutToLogin('Session expired. Please sign in again.');
      else {
        D.ATTENDANCE[sem] = [];
        D.RESULTS[sem] = [];
      }
    });
  }

  function signOutToLogin(msg) {
    liveMode = false;
    liveToken = null;
    liveCache = {};
    D = MC_DATA;
    displayName = D.PROFILE.name;
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(LIVE_TOKEN_KEY);
    } catch (e) {}
    setModeBadge(false);
    showLogin();
    if (msg) showLoginError(msg);
    window.scrollTo(0, 0);
  }

  $('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (LIVE_ENABLED) enterLive($('loginName').value, $('loginPass').value);
    else enterDemo($('loginName').value);
  });
  $('demoBtn').addEventListener('click', function () { enterDemo(''); });
  $('signOutBtn').addEventListener('click', function () { signOutToLogin(''); });
  $('navLogoutBtn').addEventListener('click', function () { signOutToLogin(''); });

  /* ================= tabs ================= */
  var currentTab = 'home';
  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-page').forEach(function (sec) {
      sec.classList.toggle('hidden', sec.id !== 'tab-' + tab);
    });
    document.querySelectorAll('[data-tab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    togglePanel(false);
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('[data-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () { switchTab(btn.dataset.tab); });
  });

  /* ================= helpers ================= */
  function fmtDate(d) {
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  /* 'YYYY-MM' key for a (year, 0-based monthIndex) pair. */
  function monthKeyOf(year, monthIndex) {
    return year + '-' + String(monthIndex + 1).padStart(2, '0');
  }
  /* '2026-10' -> 'October 2026', for the live month-fallback note. */
  function monthNameOfKey(key) {
    var parts = String(key || '').split('-');
    var names = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    var mi = parseInt(parts[1], 10) - 1;
    if (parts.length !== 2 || mi < 0 || mi > 11) return key;
    return names[mi] + ' ' + parts[0];
  }
  function pct(present, total) {
    return total === 0 ? 0 : (present * 100 / total);
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function initials(name) {
    var parts = name.trim().split(/\s+/);
    var out = '';
    for (var i = 0; i < Math.min(2, parts.length); i++) {
      if (parts[i]) out += parts[i].charAt(0).toUpperCase();
    }
    return out || 'S';
  }
  function statusChip(s) {
    var light = (s === 'L' || s === 'H');
    return '<span class="status-chip' + (light ? ' light' : '') + '" style="background:' + D.STATUS_COLORS[s] + '">' + s + '</span>';
  }

  /* ================= Home ================= */
  var weekMonday = mondayOf(new Date());
  var selectedDay = new Date();

  function mondayOf(day) {
    var m = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    var dow = (m.getDay() + 6) % 7; /* Mon=0 */
    m.setDate(m.getDate() - dow);
    return m;
  }
  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function renderHome() {
    var now = new Date();
    var h = now.getHours();
    var greet = h < 12 ? 'Good morning' : (h < 17 ? 'Good afternoon' : 'Good evening');
    $('homeGreet').textContent = greet + ', ' + displayName.split(' ')[0].charAt(0).toUpperCase() + displayName.split(' ')[0].slice(1).toLowerCase();
    $('homeDate').textContent = fmtDate(now) + ' · MCA Semester 3 · CEV';

    var sem = 3;
    var overall = D.overallPct(sem);
    var rows = D.ATTENDANCE[sem];
    var pTot = 0, tTot = 0;
    rows.forEach(function (r) { pTot += r.present; tTot += r.total; });
    $('ringPct').textContent = overall.toFixed(1) + '%';
    $('ringFg').style.strokeDashoffset = String(276.5 * (1 - overall / 100));
    $('ringSub').textContent = 'Semester 3 overall';
    $('ringHours').textContent = pTot + ' / ' + tTot + ' hours · ' + rows.length + ' subjects';

    /* Today's classes from the timetable (real weekday). */
    var dayKey = D.DAY_NAMES[(now.getDay() + 6) % 7];
    var dayLabel = D.DAY_LABELS[(now.getDay() + 6) % 7];
    var codes = D.TIMETABLE[dayKey] || [];
    $('todaySub').textContent = dayLabel + ' · ' + (codes.length ? codes.length + ' periods' : 'no classes scheduled');
    var box = $('todayBox');
    if (!codes.length) {
      box.innerHTML = '<p class="muted empty-line">' + IC.calLine + '<span>No classes today. Enjoy the weekend.</span></p>';
    } else {
      var html = '';
      codes.forEach(function (code, i) {
        html += '<div class="class-row"><span class="time">Period ' + (i + 1) + ' · ' + D.PERIOD_TIMES[i] + '</span>' +
          '<span class="subj">' + esc(D.subjectName(code)) + '</span>' +
          '<span class="tag' + (D.slotType(code) === 'lab' ? ' tag-lab' : '') + '">' + (D.slotType(code) === 'lab' ? 'Lab' : 'Theory') + '</span>' +
          '<span class="muted" style="margin-left:auto;font-size:13px;">' + esc(code) + '</span></div>';
      });
      box.innerHTML = html;
    }

    /* Subject bar chart. */
    var chart = '';
    rows.forEach(function (r) {
      var pc = pct(r.present, r.total);
      chart += '<div class="chart-row" data-goto-attendance role="button" tabindex="0">' +
        '<span class="cname" title="' + esc(D.subjectName(r.code)) + '">' + esc(D.subjectName(r.code)) + '</span>' +
        '<span class="bar"><span class="' + (pc < 75 ? 'low' : '') + '" style="width:' + pc.toFixed(1) + '%"></span></span>' +
        '<span class="cpct">' + pc.toFixed(1) + '%</span></div>';
    });
    $('chartBox').innerHTML = chart;
    $('chartBox').querySelectorAll('[data-goto-attendance]').forEach(function (el) {
      el.addEventListener('click', function () { switchTab('attendance'); });
    });

    renderWeek();
    renderQuick();
  }

  function renderQuick() {
    var items = [
      { tab: 'attendance', title: 'Attendance', sub: 'Subject-wise and monthly', icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>' },
      { tab: 'timetable', title: 'Timetable', sub: 'Full week, Periods 1-7', icon: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>' },
      { tab: 'results', title: 'Results', sub: 'Series exam marks', icon: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>' },
      { tab: 'profile', title: 'Profile', sub: 'Details and appearance', icon: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' }
    ];
    var html = '';
    items.forEach(function (it) {
      html += '<button type="button" class="quick-card" data-quick="' + it.tab + '">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + it.icon + '</svg>' +
        it.title + '<span class="sub">' + it.sub + '</span></button>';
    });
    html += '<a class="quick-card" href="https://shuhaibnc.github.io/MCA" target="_blank" rel="noopener">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/></svg>' +
      'Study Materials<span class="sub">MCA Notes Hub, opens in a new tab</span></a>';
    $('quickGrid').innerHTML = html;
    $('quickGrid').querySelectorAll('[data-quick]').forEach(function (el) {
      el.addEventListener('click', function () { switchTab(el.dataset.quick); });
    });
  }

  function renderWeek() {
    var sunday = new Date(weekMonday);
    sunday.setDate(sunday.getDate() + 6);
    var fmt = function (d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
    $('weekLabel').textContent = fmt(weekMonday) + ' – ' + fmt(sunday) + ' ' + sunday.getFullYear();

    var strip = $('weekStrip');
    var today = new Date();
    var html = '';
    for (var i = 0; i < 7; i++) {
      var day = new Date(weekMonday);
      day.setDate(day.getDate() + i);
      var entry = D.findDay(day);
      var dot = '', dotColor = 'transparent';
      if (entry) {
        var anyA = false, anyP = false;
        entry.periods.forEach(function (per) {
          if (per.s === 'A') anyA = true;
          if (per.s === 'P') anyP = true;
        });
        if (anyA) { dot = '●'; dotColor = '#F44336'; }
        else if (anyP) { dot = '●'; dotColor = '#4CAF50'; }
      }
      var ds = day.getFullYear() + '-' + String(day.getMonth() + 1).padStart(2, '0') + '-' + String(day.getDate()).padStart(2, '0');
      html += '<button type="button" class="week-day' + (sameDay(day, selectedDay) ? ' selected' : '') + '" data-day="' + ds + '">' +
        '<span class="wd-name">' + day.toLocaleDateString('en-GB', { weekday: 'short' }) + '</span>' +
        '<span class="wd-num' + (sameDay(day, today) ? ' today' : '') + '">' + day.getDate() + '</span>' +
        '<span class="wd-dot" style="color:' + dotColor + '">' + dot + '</span></button>';
    }
    strip.innerHTML = html;
    strip.querySelectorAll('.week-day').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parts = btn.dataset.day.split('-');
        selectedDay = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        renderWeek();
      });
    });

    /* Selected day detail: one row per period with a status chip. */
    var detail = $('weekDetail');
    var d = D.findDay(selectedDay);
    if (!d) {
      detail.innerHTML = '<p class="muted empty-line">' + IC.calLine + '<span>No classes recorded for this day.</span></p>';
      return;
    }
    var rows = '';
    var anyRow = false;
    d.periods.forEach(function (per) {
      if (!per.sub && per.s === 'H') return;
      anyRow = true;
      rows += '<div class="day-detail-row">' + statusChip(per.s) +
        '<span>Period ' + per.p + (per.sub ? ' · ' + esc(per.sub) + ' ' + esc(D.subjectName(per.sub)) : '') +
        ' · ' + D.STATUS_WORDS[per.s] + '</span></div>';
    });
    if (!anyRow) {
      detail.innerHTML = '<p class="muted empty-line">' + IC.calLine + '<span>No classes recorded for this day' + (d.holiday ? ' (' + esc(d.holiday) + ').' : '.') + '</span></p>';
    } else {
      detail.innerHTML = '<p class="muted" style="margin-bottom:4px;">' + esc(d.weekday) + ', ' + esc(d.label) +
        (d.holiday ? ' · ' + esc(d.holiday) : '') + '</p>' + rows;
    }
  }

  $('weekPrev').addEventListener('click', function () {
    weekMonday.setDate(weekMonday.getDate() - 7);
    selectedDay = new Date(weekMonday);
    renderWeek();
  });
  $('weekNext').addEventListener('click', function () {
    weekMonday.setDate(weekMonday.getDate() + 7);
    selectedDay = new Date(weekMonday);
    renderWeek();
  });
  $('homeGoAttendance').addEventListener('click', function () { switchTab('attendance'); });

  /* ================= Attendance ================= */
  var attSem = 3;
  /* Results has its OWN semester state: the two pickers must never
   * bleed into each other (both default to 3 independently). */
  var resSemVal = 3;
  /* Monthly grid state: monthKeys is the ordered list of available
   * months ('YYYY-MM'), monthKey the displayed one, monthNotice a
   * short note under the grid (live fallback only). */
  var monthKeys = [];
  var monthKey = '';
  var monthNotice = '';

  function fillSemSelect(sel, current) {
    var html = '';
    for (var s = 1; s <= 8; s++) {
      html += '<option value="' + s + '"' + (s === current ? ' selected' : '') + '>Semester ' + s + '</option>';
    }
    sel.innerHTML = html;
  }

  function renderAttendance() {
    fillSemSelect($('attSem'), attSem);
    var rows = D.ATTENDANCE[attSem];
    var box = $('attSubjects');
    if (!rows || !rows.length) {
      $('attOverallPct').textContent = '–';
      $('attOverallHours').textContent = '';
      $('attOverallBar').style.width = '0%';
      $('attSemNote').textContent = liveMode ? 'No attendance data for this semester on the portal.' : 'No attendance data for this semester in demo.';
      box.innerHTML = '<div class="empty-state"><div class="empty-icon">' + IC.inbox + '</div><h3>No data for Semester ' + attSem + '</h3><p>The MCA course has 4 semesters. Semesters 5-8 have no data' + (liveMode ? ' on the portal.' : ' in demo.') + '</p></div>';
      return;
    }
    $('attSemNote').textContent = liveMode ? 'Live data from the portal.' : (attSem === 3 ? 'Overall about 95%, matching the verified Sep 2026 portal check.' : 'Demo figures for this semester.');
    var pTot = 0, tTot = 0;
    rows.forEach(function (r) { pTot += r.present; tTot += r.total; });
    var overall = pct(pTot, tTot);
    $('attOverallPct').textContent = overall.toFixed(1) + '%';
    $('attOverallHours').textContent = pTot + ' / ' + tTot + ' hours';
    $('attOverallBar').style.width = overall.toFixed(1) + '%';
    var html = '';
    rows.forEach(function (r) {
      var pc = pct(r.present, r.total);
      html += '<div class="subj-row"><div class="subj-head">' +
        '<span class="subj-name">' + esc(D.subjectName(r.code)) + '</span>' +
        '<span class="subj-pct">' + pc.toFixed(1) + '%' + (pc < 75 ? '<span class="flag-low">Below 75%</span>' : '') + '</span></div>' +
        '<div class="subj-meta">' + esc(r.code) + ' · ' + r.present + ' / ' + r.total + ' hrs</div>' +
        '<div class="bar"><span class="' + (pc < 75 ? 'low' : '') + '" style="width:' + pc.toFixed(1) + '%"></span></div></div>';
    });
    box.innerHTML = html;
    renderMonthly();
  }

  /* Monthly grid state: monthKeys is D.MONTH_ORDER, monthKey the
   * displayed month. Defaults to the latest available month. */
  function ensureMonthState() {
    var order = (D.MONTH_ORDER || []).slice();
    if (!order.length) { monthKeys = []; monthKey = ''; return; }
    monthKeys = order;
    if (!monthKey || monthKeys.indexOf(monthKey) < 0) monthKey = monthKeys[monthKeys.length - 1];
  }

  function getDisplayedMonth() {
    if (D.MONTHS && monthKey && D.MONTHS[monthKey]) return D.MONTHS[monthKey];
    return D.MONTHLY;
  }

  function renderMonthly() {
    ensureMonthState();
    var m = getDisplayedMonth();
    var grid = $('monthGrid');
    var legend = $('monthLegend');
    var note = $('monthNote');
    if (!m) {
      $('monthTitle').textContent = 'Attendance by date';
      grid.innerHTML = '';
      legend.innerHTML = '';
      if (note) { note.textContent = ''; note.classList.add('hidden'); }
      return;
    }
    $('monthTitle').textContent = m.month;
    var idx = monthKeys.indexOf(monthKey);
    /* Demo months are bounded by MONTH_ORDER. In live mode the portal
     * may hold earlier months, so Prev stays enabled there; Next is
     * disabled at the latest known month in both modes. */
    $('monthPrev').disabled = liveMode ? false : idx <= 0;
    $('monthNext').disabled = idx < 0 || idx >= monthKeys.length - 1;
    var html = '<thead><tr><th>Day</th>';
    for (var p = 1; p <= 7; p++) html += '<th>Period ' + p + '</th>';
    html += '</tr></thead><tbody>';
    m.days.forEach(function (day) {
      html += '<tr><td class="day-col">' + day.d + ' ' + day.weekday.slice(0, 3) + '</td>';
      day.periods.forEach(function (per) {
        if (!per.sub) {
          /* Blank cell: N/A (grey) or Holiday (light). Never Absent. */
          html += '<td class="cell empty" title="' + D.STATUS_WORDS[per.s] + '"></td>';
        } else {
          var dark = (per.s === 'L' || per.s === 'H');
          html += '<td class="cell" style="background:' + D.STATUS_COLORS[per.s] + ';color:' + (dark ? '#212121' : '#fff') + '" title="' + esc(per.sub) + ' · ' + D.STATUS_WORDS[per.s] + '">' + esc(per.sub) + '</td>';
        }
      });
      html += '</tr>';
    });
    html += '</tbody>';
    grid.innerHTML = html;

    var lg = '';
    ['P', 'A', 'L', 'N', 'H', 'D', 'O', 'S', 'V'].forEach(function (s) {
      lg += '<span class="lg"><span class="sw" style="background:' + D.STATUS_COLORS[s] + '"></span>' + s + ' ' + D.STATUS_WORDS[s] + '</span>';
    });
    legend.innerHTML = lg;

    if (note) {
      if (monthNotice) { note.textContent = monthNotice; note.classList.remove('hidden'); }
      else { note.textContent = ''; note.classList.add('hidden'); }
    }
  }

  /* Fetch one live month from the Worker and cache it in D.MONTHS.
   * If the portal cannot serve the requested month, keep showing the
   * current month and say which month the portal actually returned. */
  function loadLiveMonth(key) {
    if (D.MONTHS && D.MONTHS[key]) {
      monthKey = key;
      monthNotice = '';
      renderMonthly();
      return;
    }
    liveFetch('/api/monthly?month=' + key).then(function (res) {
      var adapted = adaptMonthly(res);
      var served = res.servedMonth || monthKeyOf(adapted.year, adapted.monthIndex);
      if (served !== key) {
        monthNotice = 'Portal returned ' + monthNameOfKey(served) + '; previous months may not be selectable on the portal.';
        if (!D.MONTHS) D.MONTHS = {};
        if (!D.MONTH_ORDER) D.MONTH_ORDER = [];
        if (!D.MONTHS[served]) {
          D.MONTHS[served] = adapted;
          if (D.MONTH_ORDER.indexOf(served) < 0) {
            D.MONTH_ORDER.push(served);
            D.MONTH_ORDER.sort();
          }
        }
        renderMonthly();
        return;
      }
      if (!D.MONTHS) D.MONTHS = {};
      if (!D.MONTH_ORDER) D.MONTH_ORDER = [];
      D.MONTHS[key] = adapted;
      if (D.MONTH_ORDER.indexOf(key) < 0) {
        D.MONTH_ORDER.push(key);
        D.MONTH_ORDER.sort();
      }
      monthKey = key;
      monthNotice = '';
      renderMonthly();
    }).catch(function (err) {
      if (err && err.status === 401) { signOutToLogin('Session expired. Please sign in again.'); return; }
      monthNotice = 'Could not load that month. Showing the latest available month.';
      renderMonthly();
    });
  }

  function shiftMonth(delta) {
    if (!monthKey) return;
    var parts = monthKey.split('-');
    var y = parseInt(parts[0], 10);
    var mi = parseInt(parts[1], 10) - 1 + delta;
    while (mi < 0) { mi += 12; y -= 1; }
    while (mi > 11) { mi -= 12; y += 1; }
    var key = y + '-' + String(mi + 1).padStart(2, '0');
    if (liveMode) { loadLiveMonth(key); return; }
    if (monthKeys.indexOf(key) >= 0) {
      monthKey = key;
      monthNotice = '';
      renderMonthly();
    }
  }

  $('monthPrev').addEventListener('click', function () { shiftMonth(-1); });
  $('monthNext').addEventListener('click', function () { shiftMonth(1); });

  $('attSem').addEventListener('change', function () {
    attSem = parseInt($('attSem').value, 10);
    if (liveMode) loadLiveSem(attSem).then(renderAttendance, function () {});
    else renderAttendance();
  });

  /* ================= Timetable ================= */
  function renderTimetable() {
    var html = '<h2>' + IC.calH2 + 'Weekly timetable</h2>';
    for (var i = 0; i < 5; i++) {
      var key = D.DAY_NAMES[i];
      var codes = D.TIMETABLE[key];
      html += '<div class="day-block"><h3>' + D.DAY_LABELS[i] + '</h3>';
      codes.forEach(function (code, p) {
        html += '<div class="class-row"><span class="time">Period ' + (p + 1) + ' · ' + D.PERIOD_TIMES[p] + '</span>' +
          '<span class="subj">' + esc(D.subjectName(code)) + '</span>' +
          '<span class="tag' + (D.slotType(code) === 'lab' ? ' tag-lab' : '') + '">' + (D.slotType(code) === 'lab' ? 'Lab' : 'Theory') + '</span>' +
          '<span class="muted" style="margin-left:auto;font-size:13px;">' + esc(code) + '</span></div>';
      });
      html += '</div>';
    }
    html += '<p class="muted">Saturday and Sunday: no classes. Lunch break 13:15 - 14:00. Teacher names are not shown in demo.</p>';
    $('ttBox').innerHTML = html;
  }

  /* ================= Results ================= */
  function renderResults() {
    fillSemSelect($('resSem'), resSemVal);
    var sem = resSemVal;
    var groups = D.RESULTS[sem] || [];
    var box = $('resultsBox');
    if (!groups.length) {
      var msg = sem === 3
        ? 'The portal shows "No sessional exams yet" for Semester 3.'
        : (liveMode ? 'No series marks for Semester ' + sem + ' on the portal.' : 'No verified series marks for Semester ' + sem + ' in demo.');
      box.innerHTML = '<div class="empty-state"><div class="empty-icon">' + IC.gradCap + '</div><h3>No sessional exams yet</h3><p>' + msg + '</p><p style="margin-top:8px;">Series marks appear here once the college publishes them on the portal.</p></div>';
      return;
    }
    var html = '';
    groups.forEach(function (g) {
      html += '<div class="result-group"><h3>' + esc(g.name) + '</h3>';
      if (g.note) html += '<p class="muted" style="margin-bottom:6px;">' + esc(g.note) + '</p>';
      g.subjects.forEach(function (s) {
        var m = parseFloat(s.marks), mx = parseFloat(s.max);
        var pc = mx > 0 ? (m * 100 / mx) : 0;
        html += '<div class="subj-row"><div class="subj-head">' +
          '<span class="subj-name">' + esc(s.name) + '</span>' +
          '<span class="marks-pill">' + esc(s.marks) + ' / ' + esc(s.max) + '</span></div>' +
          '<div class="subj-meta">' + esc(s.code) + '</div>' +
          '<div class="bar"><span style="width:' + pc.toFixed(1) + '%"></span></div></div>';
      });
      html += '</div>';
    });
    box.innerHTML = html;
  }

  $('resSem').addEventListener('change', function () {
    /* Results keeps its own semester: changing it must not touch
     * the Attendance picker or re-render Attendance. */
    resSemVal = parseInt($('resSem').value, 10);
    if (liveMode) {
      loadLiveSem(resSemVal).then(renderResults, function () {});
    } else {
      renderResults();
    }
  });

  /* ================= Profile ================= */
  function renderProfile() {
    var p = D.PROFILE;
    $('profileAvatar').textContent = initials(displayName);
    $('profileName').textContent = displayName;
    $('profileSub').textContent = p.course + ' · Semester ' + p.semester + ' · Roll ' + p.roll;
    var rows = [
      ['Name', displayName],
      ['Roll number', p.roll],
      ['Course', p.course + ' · Semester ' + p.semester + ' · ' + p.scheme],
      ['College', p.college],
      ['University', p.university],
      ['Admission no.', p.admissionNo || '–'],
      ['University reg no.', p.universityRegNo || '–'],
      ['Date of birth', p.dob || '–'],
      ['Portal', '<a href="' + p.portal + '" target="_blank" rel="noopener">cev.etlab.in</a>']
    ];
    var html = '';
    rows.forEach(function (r) {
      html += '<div class="kv"><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
    });
    $('profileKv').innerHTML = html;
  }

  /* ================= boot ================= */
  function renderAll() {
    renderHome();
    renderAttendance();
    renderTimetable();
    renderResults();
    renderProfile();
    switchTab(currentTab);
  }

  /* ---- boot: live copy + session resume ---- */
  if (LIVE_ENABLED) {
    $('loginPass').placeholder = 'Your CEV Etlab password';
    var submitBtn = $('loginForm').querySelector('button[type="submit"]');
    if (submitBtn) {
      var submitLabel = submitBtn.querySelector('.btn-label');
      if (submitLabel) submitLabel.textContent = 'Sign in';
      else submitBtn.textContent = 'Sign in';
    }
  }

  try {
    var savedToken = LIVE_ENABLED ? sessionStorage.getItem(LIVE_TOKEN_KEY) : null;
    var saved = sessionStorage.getItem(SESSION_KEY);
    if (savedToken) {
      liveToken = savedToken;
      loadLiveData().then(function () {
        showApp();
      }, function (err) {
        liveToken = null;
        try { sessionStorage.removeItem(LIVE_TOKEN_KEY); } catch (e) {}
        if (err && err.status === 401) showLoginError('Session expired. Please sign in again.');
      });
    } else if (saved) { displayName = saved; showApp(); }
  } catch (e) { /* session storage unavailable: stay on login */ }
})();
