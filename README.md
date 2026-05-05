# Wedding Website

A simple, elegant wedding website built with plain HTML, CSS, and JavaScript. Free to host on GitHub Pages.

## Quick Start (Local Preview)

Open `index.html` in your browser, or run a local server:

```bash
# Python 3
python3 -m http.server 8000

# Then open http://localhost:8000
```

## Deploy to GitHub Pages

1. **Create a GitHub repo** — go to https://github.com/new and create a repo (e.g. `wedding-website`). It can be public or private (GitHub Pages works on both with a free account for public repos).

2. **Push this code:**
   ```bash
   cd wedding-website
   git add .
   git commit -m "Initial wedding website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/wedding-website.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repo → **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

4. Your site will be live at `https://YOUR_USERNAME.github.io/wedding-website/` within a few minutes.

## Custom Domain (Optional, ~$10-12/year)

1. Buy a domain (e.g. from [Namecheap](https://namecheap.com) or [Cloudflare](https://cloudflare.com))
2. In your repo → **Settings** → **Pages** → **Custom domain**, enter your domain
3. Add DNS records at your registrar:
   - For apex domain (`janeandjohn.com`): Add `A` records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - For subdomain (`www.janeandjohn.com`): Add a `CNAME` record pointing to `YOUR_USERNAME.github.io`
4. Check "Enforce HTTPS" in the Pages settings

## Setup RSVP Form with Google Sheets (Free)

RSVP responses are sent to a Google Sheet via a Google Apps Script. Here's how to set it up:

### 1. Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Wedding RSVPs"
3. In **Row 1**, add these headers (must match exactly):

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | Timestamp | Name | Email | Guests | Attending | Dietary | Message |

### 2. Create the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var p = e.parameter;

  sheet.appendRow([
    new Date(),
    p.name,
    p.email,
    p.guests,
    p.attending,
    p.dietary,
    p.message
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy → New deployment**
4. Choose type: **Web app**
5. Set "Execute as" to **Me** and "Who has access" to **Anyone**
6. Click **Deploy** and authorize when prompted
7. Copy the **Web app URL**

### 3. Connect it to your site

In `script.js`, replace `YOUR_GOOGLE_SCRIPT_URL` with the URL you copied:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ABC.../exec';
```

That's it! Every RSVP submission will add a new row to your Google Sheet.

## Customize

### Your Details
- **Names & date**: Search for "Jane" and "John" in `index.html` and replace
- **Wedding date**: Update the date in `script.js` (line 4) for the countdown timer
- **Venue details**: Edit the ceremony/reception cards in the Details section
- **FAQ answers**: Edit the FAQ section to match your situation

### Photos
Replace the gallery placeholder `<div>` elements with actual images:
```html
<div class="gallery-item" style="background-image: url('photos/photo1.jpg');"></div>
```
Put your photos in a `photos/` folder.

### Colors
Edit the CSS variables at the top of `style.css`:
```css
:root {
  --color-accent: #8b7355;       /* Main accent (buttons, headings) */
  --color-accent-light: #c4a97d; /* Lighter accent */
  --color-accent-dark: #6b5740;  /* Darker accent */
}
```

### Hero Background
To add a photo background to the hero section, add to `.hero` in `style.css`:
```css
.hero {
  background: url('photos/hero.jpg') center/cover no-repeat;
}
```

## Files

```
index.html  — Main page with all sections
style.css   — All styles
script.js   — Countdown timer, form handling, scroll animations
README.md   — This file
```
