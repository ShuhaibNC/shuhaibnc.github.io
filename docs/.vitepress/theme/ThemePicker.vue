<template>
  <div class="theme-picker" ref="rootEl">
    <button
      class="theme-picker-btn"
      type="button"
      aria-label="Theme and customisation"
      title="Theme and customisation"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
        <path d="M12 22C6.5 21.5 4 17.5 5.5 13.5c.8-2.2 2.5-3.5 5-3.5 3.5 0 6 2 6.5 5.5.3 2-.5 4.5-2.5 6.5" />
      </svg>
    </button>

    <div v-if="open" class="theme-panel" role="dialog" aria-label="Theme and customisation">
      <p class="theme-panel-title">Theme</p>
      <div class="theme-grid">
        <button
          v-for="t in THEMES"
          :key="t.id"
          type="button"
          class="theme-card"
          :class="{ active: prefs.theme === t.id }"
          @click="setTheme(t.id)"
        >
          <span class="theme-swatch" :style="{ background: t.swatch[0], '--sw-accent': t.swatch[1] }">
            <span class="theme-swatch-dot" />
          </span>
          <span class="theme-name">{{ t.name }}</span>
          <span class="theme-desc">{{ t.desc }}</span>
          <span v-if="t.id === 'default'" class="theme-default-badge">Default</span>
        </button>
      </div>

      <p class="theme-panel-title">Accent colour</p>
      <div class="accent-row">
        <button
          v-for="a in ACCENTS"
          :key="a.id"
          type="button"
          class="accent-swatch"
          :class="{ active: prefs.accent === a.value }"
          :style="a.value ? { background: a.value } : {}"
          :title="a.name"
          :aria-label="a.name"
          @click="setAccent(a.value)"
        >
          <span v-if="!a.value" class="accent-none">✕</span>
        </button>
        <label class="accent-custom" title="Custom accent colour">
          <input type="color" :value="prefs.accent || '#3b82f6'" aria-label="Custom accent colour" @input="setAccent(($event.target as HTMLInputElement).value)" />
          <span>+</span>
        </label>
      </div>

      <p class="theme-panel-title">Text size</p>
      <div class="seg-row" role="group" aria-label="Text size">
        <button v-for="s in fontSizes" :key="s.id" type="button" :class="{ active: prefs.fontSize === s.id }" @click="setPref('fontSize', s.id)">{{ s.name }}</button>
      </div>

      <p class="theme-panel-title">Density</p>
      <div class="seg-row" role="group" aria-label="Density">
        <button v-for="d in densities" :key="d.id" type="button" :class="{ active: prefs.density === d.id }" @click="setPref('density', d.id)">{{ d.name }}</button>
      </div>

      <p class="theme-panel-title">Corners</p>
      <div class="seg-row" role="group" aria-label="Corner radius">
        <button v-for="r in radii" :key="r.id" type="button" :class="{ active: prefs.radius === r.id }" @click="setPref('radius', r.id)">{{ r.name }}</button>
      </div>

      <button type="button" class="theme-reset" @click="resetAll">Reset to default</button>
      <p class="theme-note">Saved on this device — the same theme follows you to the Patches page.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import {
  ACCENTS,
  DEFAULT_PREFS,
  THEMES,
  applyPrefs,
  loadPrefs,
  savePrefs,
  type SitePrefs
} from './theme-prefs'

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const prefs = reactive<SitePrefs>({ ...DEFAULT_PREFS })

const fontSizes = [
  { id: 'small', name: 'Small' },
  { id: 'default', name: 'Default' },
  { id: 'large', name: 'Large' }
] as const
const densities = [
  { id: 'comfortable', name: 'Comfortable' },
  { id: 'compact', name: 'Compact' }
] as const
const radii = [
  { id: 'default', name: 'Default' },
  { id: 'sharp', name: 'Sharp' },
  { id: 'rounded', name: 'Rounded' }
] as const

function commit() {
  savePrefs({ ...prefs })
}

function setTheme(id: string) {
  prefs.theme = id
  commit()
}
function setAccent(value: string) {
  prefs.accent = value
  commit()
}
function setPref<K extends keyof SitePrefs>(key: K, value: SitePrefs[K]) {
  prefs[key] = value
  commit()
}
function resetAll() {
  Object.assign(prefs, DEFAULT_PREFS)
  commit()
}

function onClickOutside(e: MouseEvent) {
  if (open.value && rootEl.value && !rootEl.value.contains(e.target as Node)) open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  Object.assign(prefs, loadPrefs())
  applyPrefs({ ...prefs })
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.theme-picker {
  position: relative;
  display: flex;
  align-items: center;
}
.theme-picker-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.theme-picker-btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}
.theme-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 304px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-elv);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  z-index: 100;
}
.theme-panel-title {
  margin: 14px 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}
.theme-panel-title:first-child {
  margin-top: 0;
}
.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.theme-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  text-align: left;
}
.theme-card.active {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-1);
}
.theme-swatch {
  position: relative;
  width: 100%;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}
.theme-swatch-dot {
  position: absolute;
  left: 6px;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--sw-accent);
  transform: translateY(-50%);
}
.theme-name {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
}
.theme-desc {
  font-size: 11px;
  line-height: 1.3;
  color: var(--vp-c-text-2);
}
.theme-default-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 10px;
  font-weight: 700;
}
.accent-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.accent-swatch {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
}
.accent-swatch.active {
  border-color: var(--vp-c-text-1);
  box-shadow: 0 0 0 2px var(--vp-c-bg-elv), 0 0 0 3px var(--vp-c-brand-1);
}
.accent-none {
  font-size: 13px;
  line-height: 1;
}
.accent-custom {
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px dashed var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--vp-c-text-2);
  font-size: 16px;
  overflow: hidden;
}
.accent-custom input {
  position: absolute;
  inset: -8px;
  opacity: 0;
  cursor: pointer;
}
.seg-row {
  display: flex;
  gap: 6px;
}
.seg-row button {
  flex: 1;
  padding: 7px 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
}
.seg-row button.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.theme-reset {
  width: 100%;
  margin-top: 16px;
  padding: 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.theme-reset:hover {
  border-color: var(--vp-c-brand-1);
}
.theme-note {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}
</style>
