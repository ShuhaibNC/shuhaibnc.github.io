import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Shuhaib N C",
  description: "Personal Notes",
  base: "/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '📰 Portfolio', link: '/portfolio', target: '_blank' },
      { text: '🗒️ Simple Notes', link: '/notes', target: '_blank' },
      { text: '💰 Donate', link: '/upi', target: '_blank' },
      
    ],

    sidebar: [
      {
        text: 'Notes',
        items: [
          { text: '🧑🏻‍💻 Coding', link: '/coding' },
          { text: '🔐 Cyber Security', link: '/cybersecurity' },
          { text: '🧬 Science', link: '/science' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ShuhaibNC' },
      { icon: 'telegram', link: 'https://t.me/ShuhaibNC' },
      { icon: 'instagram', link: 'https://instagram.com/realshuhaib' }
    ]
  }
})
