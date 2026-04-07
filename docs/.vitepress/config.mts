import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ShuhaibNC (Shuhaib N C) - Official Website",
  description: "Personal Notes",
  cleanUrls: true,
  base: "/",
  sitemap: {
    hostname: 'https://shuhaibnc.github.io'
  },
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
    search: {
  provider: 'local',
  options: {
    detailedView: true,
    translations: {
      button: {
        buttonText: 'Search Docs',
        buttonAriaLabel: 'Search'
      },
      modal: {
        noResultsText: 'No results found',
        resetButtonTitle: 'Clear search',
        footer: {
          selectText: 'to select',
          navigateText: 'to navigate',
          closeText: 'to close'
        }
      }
    }
  }
},

    nav: [
      { text: 'Portfolio', link: '/portfolio', target: '_blank' },
      { text: 'Donate', link: '/upi', target: '_blank' },
      
    ],

    footer: {
      message: `Made by ShuhaibNC with ❤️`,
      copyright:
        `© ${new Date().getFullYear()}, 2019`
    },
    

    sidebar: [
      {
        text: 'Sections',
        items: [
          { text: '🔐 Cyber Security', link: '/cybersecurity',
            items: [

              
      {
        text: 'Writeups',
        link: '/cybersecurity/writeups'
      },
  
    
      {
        text: 'Foundations',
        items: [
          { text: 'Useful Linux Commands', link: '/cybersecurity/linuxcommands' },
          { text: 'Shell Upgrade and Stabilization', link: '/cybersecurity/shellupgrade' },
          { text: 'Google Dork', link: '/cybersecurity/googledork' },
          { text: 'Search Engines', link: '/cybersecurity/cyberengines' },
          { text: 'OSINT King', link: '/cybersecurity/osint' }
        ]
      },
      {
        text: 'Learning & Practice',
        items: [
          { text: 'CTF Starter Pack Full', link: '/cybersecurity/ctfstarter' },
          { text: 'Best CTF Websites', link: '/cybersecurity/cyberskills' },
          { text: 'Practice Pentesting', link: '/cybersecurity/pentesting' },
          { text: 'TryHackMe Rooms', link: '/cybersecurity/tryhackme' }
        ]
      },
      {
        text: 'Tools & Resources',
        items: [
          { text: 'All Tools', link: '/cybersecurity/tools' },
          { text: 'Hackers Resources', link: '/cybersecurity/hackersres' },
          { text: 'Ethical Hacking Learning Resources', link: '/cybersecurity/learningresources' }
        ]
      },
      {
        text: 'Advanced Topics',
        items: [
          { text: 'Malware Analysis', link: '/cybersecurity/malware' },
          { text: 'Privacy Guides', link: '/cybersecurity/privacy' }
        ]
      }
    
  
],
          collapsed: true
           },
          { text: '🧑🏻‍💻 Programming', link: '/coding',
           },
          { text: '🌠 Science', link: '/science' },
          { text: '🎬 Movies', link: '/movies' },
          { text: '📝 Notes', link: '/notes',
            items: [

      { text: 'JustAsk', link: '/notes/justask' },
      { text: 'WhatsApp Deeplinks', link: '/notes/deeplink' },
      { text: 'Best Torrent Search Engines of all time', link: '/notes/Best-Torrent-Search-Engines-of-all%20time' },
      { text: 'Best Compressions', link: '/notes/compressions' }
],
          collapsed: false
           },
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
