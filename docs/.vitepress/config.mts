import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Shuhaib N C",
  description: "Personal Notes",
  base: "/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Portfolio', link: '/portfolio' },
      { text: 'Notes', link: '/notes' },
      { text: 'UPI', link: '/upi' },
      
    ],

    sidebar: [
      {
        text: 'Notes',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Apktoolm', link: '/apktoolm' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shuhaibnc' }
    ]
  }
})
