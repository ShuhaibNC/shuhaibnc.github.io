# Shell Upgrade and Stabilization

> You will be familiar with reverse shells from previous tasks or rooms; however, the shells you have been taught so far have had several fatal flaws. For example, pressing Ctrl + C killed the shell entirely. You could not use the arrow keys to see your shell history, and TAB autocompletes didn’t work. Stabilizing shells is an important skill to learn as it fixes all of these problems, providing a much nicer working environment.

### TLDR
```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'

(inside the nc session) CTRL+Z;stty raw -echo; fg; ls; export SHELL=/bin/bash; export TERM=screen; stty rows 38 columns 116; reset;

```

### [**Spawn shells**](https://book.hacktricks.wiki/en/generic-hacking/reverse-shells/full-ttys.html#spawn-shells)

- `python -c 'import pty; pty.spawn("/bin/sh")'`
- `echo os.system('/bin/bash')`
- `/bin/sh -i`
- `script -qc /bin/bash /dev/null`
- `perl -e 'exec "/bin/sh";'`
- perl: `exec "/bin/sh";`
- ruby: `exec "/bin/sh"`
- lua: `os.execute('/bin/sh')`
- IRB: `exec "/bin/sh"`
- vi: `:!bash`
- vi: `:set shell=/bin/bash:shell`
- nmap: `!sh`
### Working inside the reverse shell:

The first thing to do is use 
```bash
python3 -c 'import pty;pty.spawn("/bin/bash")'
```

which uses Python to spawn a better-featured bash shell. At this point, our shell will look a bit prettier, but we still won’t be able to use tab autocomplete or the arrow keys, and Ctrl + C will still kill the shell.
  Step two is: 
  ```bash
  export TERM=xterm
  ```
  
this will give us access to term commands such as clear.
Finally (and most importantly) 

we will background the shell using Ctrl + Z. Back in our own terminal we use ```
```bash
stty raw -echo; fg
```

This does two things: first, it turns off our own terminal echo (which gives us access to tab autocompletes, the arrow keys, and Ctrl + C to kill processes). It then foregrounds the shell, thus completing the process.

To reset your terminal run
```bash
reset
```
