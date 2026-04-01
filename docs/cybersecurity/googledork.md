# Useful Google Dorks for Bug Bounty

## Top 7 Google Dorks

### Cache
Shows cached version of a website  
- `cache:example.com`

### After
Shows results after a specific year (use with site)  
- `after:2019 site:example.com`
- `after:2016 site:example.com`

### Allintext
Search for specific text in page content  
- `allintext:admin`

### Allinurl
Search for keywords in URL  
- `allinurl:"password"`

### Anchor Text
Search for specific anchor text  
- `"Some_Text" filetype:php`

### Filetype / Ext
Search for specific file types  
- `"python" ext:pdf`
- `filetype:pdf "python"`

### Allinurl (again usage)
- `allinurl:"login"`

---

## Usage Note
Use these with `site:target.com` and optionally exclude cache.

---

## 1. Discovering Exposed Files
- `intitle:"index of" site:target.com`
- `filetype:log inurl:log site:target.com`
- `filetype:sql inurl:sql site:target.com`
- `filetype:env inurl:.env site:target.com`

## 2. Finding Sensitive Directories
- `inurl:/phpinfo.php site:target.com`
- `inurl:/admin site:target.com`
- `inurl:/backup site:target.com`
- `inurl:wp- site:target.com`

## 3. Exposed Configuration Files
- `filetype:config inurl:config site:target.com`
- `filetype:ini inurl:wp-config.php site:target.com`
- `filetype:json inurl:credentials site:target.com`

## 4. Discovering Usernames and Passwords
- `intext:"password" filetype:log site:target.com`
- `intext:"username" filetype:log site:target.com`
- `filetype:sql "password" site:target.com`

## 5. Finding Database Files
- `filetype:sql inurl:db site:target.com`
- `filetype:sql inurl:dump site:target.com`
- `filetype:bak inurl:db site:target.com`

## 6. Exposed Git Repositories
- `inurl:".git" site:target.com`
- `inurl:"/.git/config" site:target.com`
- `intitle:"index of" ".git" site:target.com`

## 7. Finding Publicly Exposed Emails
- `intext:"email" site:target.com`
- `inurl:"contact" intext:"@target.com" -www.target.com`
- `filetype:xls inurl:"email" site:target.com`

## 8. Discovering Vulnerable Web Servers
- `intitle:"Apache2 Ubuntu Default Page: It works" site:target.com`
- `intitle:"Index of /" "Apache Server" site:target.com`
- `intitle:"Welcome to nginx" site:target.com`

## 9. Finding API Keys
- `filetype:env "DB_PASSWORD" site:target.com`
- `intext:"api_key" filetype:env site:target.com`
- `intext:"AWS_ACCESS_KEY_ID" filetype:env site:target.com`

## 10. Exposed Backup Files
- `filetype:bak inurl:backup site:target.com`
- `filetype:zip inurl:backup site:target.com`
- `filetype:tgz inurl:backup site:target.com`

Replace `target.com` with your target domain.