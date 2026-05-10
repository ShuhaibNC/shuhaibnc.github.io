import DefaultTheme from 'vitepress/theme'
import { VPFeatures } from 'vitepress/theme'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('VPFeatures', VPFeatures)
  }
} satisfies Theme