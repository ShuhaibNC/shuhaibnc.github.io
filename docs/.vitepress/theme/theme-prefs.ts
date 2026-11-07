// Shared theme + customisation preferences for shuhaibnc.github.io.
//
// One storage key is shared by the VitePress site and the standalone
// /patches/ page, so a theme picked on one page follows the visitor to
// the other. "default" always means "the look the site already had" —
// VitePress default on the main site, the #121212 dark look on /patches/.
// Keep this in sync with docs/public/theme-init.js (the no-flash script
// that applies the same prefs before first paint) and with the theme
// blocks in morphe-patches-site/build-patches-page.py.

export const PREFS_KEY = 'shuhaib-site-prefs-v1'

export interface SitePrefs {
  theme: string
  /** '' = the theme's own accent colour; otherwise a #rrggbb hex value. */
  accent: string
  fontSize: 'small' | 'default' | 'large'
  density: 'comfortable' | 'compact'
  radius: 'default' | 'sharp' | 'rounded'
}

export const DEFAULT_PREFS: SitePrefs = {
  theme: 'default',
  accent: '',
  fontSize: 'default',
  density: 'comfortable',
  radius: 'default'
}

export interface ThemeDef {
  id: string
  name: string
  desc: string
  /** [background, accent] swatch shown in the picker. */
  swatch: [string, string]
}

export const THEMES: ThemeDef[] = [
  { id: 'default', name: 'Default', desc: 'The current look', swatch: ['#ffffff', '#3451b2'] },
  { id: 'amoled', name: 'AMOLED', desc: 'Pure black, high contrast', swatch: ['#000000', '#64b5f6'] },
  { id: 'midnight', name: 'Midnight', desc: 'Deep navy dark', swatch: ['#0a1128', '#7cb3ff'] },
  { id: 'forest', name: 'Forest', desc: 'Deep green dark', swatch: ['#0a1a12', '#4ade80'] },
  { id: 'mocha', name: 'Catppuccin Mocha', desc: 'Warm dark, mauve accent', swatch: ['#1e1e2e', '#cba6f7'] },
  { id: 'paper', name: 'Paper', desc: 'Warm light, amber accent', swatch: ['#faf7f0', '#b45309'] }
]

export interface AccentDef {
  id: string
  name: string
  /** '' = theme default. */
  value: string
}

export const ACCENTS: AccentDef[] = [
  { id: 'default', name: 'Theme default', value: '' },
  { id: 'blue', name: 'Blue', value: '#3b82f6' },
  { id: 'sky', name: 'Sky', value: '#0284c7' },
  { id: 'violet', name: 'Violet', value: '#8b5cf6' },
  { id: 'pink', name: 'Pink', value: '#ec4899' },
  { id: 'green', name: 'Green', value: '#22c55e' },
  { id: 'teal', name: 'Teal', value: '#14b8a6' },
  { id: 'amber', name: 'Amber', value: '#f59e0b' },
  { id: 'red', name: 'Red', value: '#ef4444' }
]

function mix(hex: string, target: [number, number, number], amount: number): string {
  const n = parseInt(hex.slice(1), 16)
  const c: [number, number, number] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  const out = c.map((v, i) => Math.round(v + (target[i] - v) * amount))
  return `rgb(${out[0]}, ${out[1]}, ${out[2]})`
}

export function loadPrefs(): SitePrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    const parsed = JSON.parse(raw) as Partial<SitePrefs>
    return {
      theme: THEMES.some((t) => t.id === parsed.theme) ? parsed.theme! : 'default',
      accent: typeof parsed.accent === 'string' ? parsed.accent : '',
      fontSize: parsed.fontSize === 'small' || parsed.fontSize === 'large' ? parsed.fontSize : 'default',
      density: parsed.density === 'compact' ? 'compact' : 'comfortable',
      radius: parsed.radius === 'sharp' || parsed.radius === 'rounded' ? parsed.radius : 'default'
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function applyPrefs(prefs: SitePrefs): void {
  const root = document.documentElement
  root.dataset.siteTheme = prefs.theme
  root.dataset.fontSize = prefs.fontSize
  root.dataset.density = prefs.density
  root.dataset.radius = prefs.radius
  const style = root.style
  if (prefs.accent) {
    const a = prefs.accent
    style.setProperty('--vp-c-brand-1', a)
    style.setProperty('--vp-c-brand-2', mix(a, [0, 0, 0], 0.18))
    style.setProperty('--vp-c-brand-3', mix(a, [0, 0, 0], 0.35))
    style.setProperty('--vp-c-brand-soft', mix(a, [255, 255, 255], 0.86))
    // Standalone pages (e.g. /patches/) read --accent instead.
    style.setProperty('--accent', a)
  } else {
    style.removeProperty('--vp-c-brand-1')
    style.removeProperty('--vp-c-brand-2')
    style.removeProperty('--vp-c-brand-3')
    style.removeProperty('--vp-c-brand-soft')
    style.removeProperty('--accent')
  }
}

export function savePrefs(prefs: SitePrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // Private mode / storage blocked: prefs just won't persist.
  }
  applyPrefs(prefs)
}
