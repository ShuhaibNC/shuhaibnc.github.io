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
      { text: 'Simple Notes', link: '/notes' },
      { text: 'Donate', link: '/upi' },
      
    ],

    sidebar: [
      {
        text: 'Notes',
        items: [
          { text: 'Coding', link: '/coding' },
          { text: 'Cyber Security', link: '/cybersecurity' },
          { text: 'Science', link: '/science' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shuhaibnc' }
    ]
  }
})
