import DefaultTheme from 'vitepress/theme'
import { VPFeatures } from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'
import ThemePicker from './ThemePicker.vue'
import './style.css'
import './themes.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(ThemePicker)
    })
  },
  enhanceApp({ app }) {
    app.component('VPFeatures', VPFeatures)
  }
} satisfies Theme
