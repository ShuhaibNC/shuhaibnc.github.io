# How I Uploaded Fullscreen Profile Picture To WhatsApp Account

## A Comprehensive Guide 

:::info
**Why this is possible?**
The WhatsApp server doesn't have server-side checking of the ratio or resolution of the uploaded picture.
WhatsApp puts client-side restrictions that are useless and can be altered/modified.
:::

### There Are Two Ways To Do This
- [Modifying WhatsApp App](./fullscreenpfp.md#)
- [Pre-built Userbot (Made for only this Purpose)[EASY]](./fullscreenpfp.md#pre-built-userbot-website)

### Modifying WhatsApp App
:::warning
Only consider doing this when you know what your'e doing, Otherwise you should consider the [Easy Way](./fullscreenpfp.md#pre-built-userbot-website)
:::

- Download the latest whatsapp apk from apkmirror
- Decompile the apk using any tool (You can use MT/NP/Apktool)
- Decompile Dex / Open Dex Editor
- Open `com.whatsapp.crop.CropImage` class
- Find `aspectX` and `aspectY`
- Change their result to `0x0`
- Recompile, Sign, Install

### Pre-built Userbot Website

- Open [Levanter Site](https://levanter.site/) and goto `Profile Picture` section 
- Upload Image (PFP/DP)
- Enter phone number and login through code
- The profile picture will be automatically updated
- Then you can logout from devices