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

## Setup RSVP Form (Free)

The RSVP form uses [Formspree](https://formspree.io) (free for up to 50 submissions/month):

1. Sign up at https://formspree.io
2. Create a new form
3. Copy your form endpoint (looks like `https://formspree.io/f/xabcdefg`)
4. In `index.html`, replace `YOUR_FORM_ID` in the form action with your ID

**Alternative:** Use [Google Forms](https://forms.google.com) and embed or link to it instead.

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
