# HF2019 Hacker Fest 2019 VulnHub Writeup

## Reconnaissance

I performed an initial port scan and identified four open ports on the target system.

![nmap](/images/hf_nmap.png)

## Service Enumeration

### FTP (Port 21)

I conducted a service and version scan using `-A` and discovered that the FTP service allows anonymous login.

After logging in as `anonymous`, I found several PHP files. However, none of them appeared to be useful for further exploitation.

![nmap_ftp](/images/hf_nmap_ftp.png)

## Web Enumeration

During the scan, I also identified the presence of **Webmin**. I searched for available exploits in Metasploit and found a known backdoor module. However, attempts to exploit it were unsuccessful.

Further enumeration of the web application revealed that it is running **WordPress**.

Using WPScan, I identified a vulnerable plugin:
- **Google Maps Plugin**

![wp](/images/hf_wpscan.png)

## Exploitation

I searched for exploits related to the Google Maps plugin in Metasploit and found an auxiliary module.

![msf](/images/hf_msf.png)

![msf_options](/images/hf_msf_options.png)

After executing the module, I obtained:
![webmaster](/images/hf_webmaster.png)
- **Username:** `webmaster`
- **Password Hash**

I proceeded to crack the hash and successfully recovered the password:
![pass](/images/hf_pass.png)
- **Password:** `kittykat1`

## Initial Access and Privilege Escalation

Using the obtained credentials, I established an SSH connection to the target system as the `webmaster` user.

After gaining access, I checked the user's privileges and found that `webmaster` is included in the sudoers file.

This allowed me to execute commands with elevated privileges and access all flags on the system.

![flag](/images/hf_flag.png)