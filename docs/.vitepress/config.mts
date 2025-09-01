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
          { text: 'Coding', link: '/coding' },
          { text: 'Cyber Security API Examples', link: '/cybersecurity' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shuhaibnc' }
    ]
  }
})
