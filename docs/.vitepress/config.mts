import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ShuhaibNC",
  description: "Personal Notes",
  base: "/",
  head: [
    ['meta', { name: 'theme-color', content: '#7bc5e4' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['link', { rel: 'icon', href: '/icon.png' }],
    // PWA
    ['link', { rel: 'icon', href: '/icon.png', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/icon.png' }],
    ['link', { rel: 'mask-icon', href: '/icon.png', color: '#7bc5e4' }],
    ['meta', { name: 'keywords', content: "ShuhaibNC Shuhaib N C" }],
    ['meta', { name: 'description', content : 'Personal website of Shuhaib NC. Cybersecurity, Linux, digital forensics, and technical experiments.'}],
    ['link', { rel: 'apple-touch-icon', href: '/icon.png', sizes: '192x192' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '✨ Portfolio', link: '/portfolio', target: '_blank' },
      { text: '💰 Donate', link: '/upi', target: '_blank' },
      
    ],

    footer: {
      message: `Made by ShuhaibNC with ❤️`,
      copyright:
        `© ${new Date().getFullYear()}, 2019`
    },
    

    sidebar: [
      {
        text: 'Notes',
        items: [
          { text: '🧑🏻‍💻 Coding', link: '/coding' },
          { text: '🔐 Cyber Security', link: '/cybersecurity' },
          { text: '🧬 Science', link: '/science' },
          { text: '🎬 Movies', link: '/movies' },
          { text: '📝 Notes', link: '/notes' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ShuhaibNC' },
      { icon: 'telegram', link: 'https://t.me/ShuhaibNC' }
    ],
     logo: {
      src: '/icon.png',
      alt: 'ShuhaibNC',
    },
  }
})
