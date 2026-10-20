# AuthStack website

Plain HTML, CSS and JavaScript. No build step, no framework.

```
index.html          the page (content is pre-rendered, so it works and indexes without JS)
style.css           theme colours (light + dark) and animations
app.js              interactions: theme toggle, film controls, stats, integrations, tabs, booking, FAQ

authstack-film.*    the hero film (MP4 + WebM) and its poster
metropolis-*.woff2  the brand font files
netlify.toml        Netlify settings
```

## Deploy (GitHub → Netlify)

1. Create a new GitHub repo and upload every file in this folder (there are no subfolders, so the normal file picker works).
2. In Netlify: **Add new site → Import an existing project → GitHub** → pick the repo.
3. Leave **Build command** empty and set **Publish directory** to `.` (netlify.toml already does this) → **Deploy**.
4. **Domain management → Add a domain** to connect your own domain.

Every push to GitHub redeploys the site automatically.

## Booking form

Bookings are sent to **Netlify Forms** (form name: `booking`).
- See submissions in Netlify: **Site → Forms → booking**.
- Get an email for each booking: **Site configuration → Notifications → Emails and webhooks → Form submission notifications**.
- Booking forms only work on the deployed Netlify site, not when opening index.html from your computer.

## Before going live

- **Social and WhatsApp links:** search `index.html` for `href="#top"` and replace them with the real Instagram, WhatsApp (`https://wa.me/92XXXXXXXXXX`) and LinkedIn links.
- **Testimonials:** the six reviews are sample content. Replace them with real client reviews (with permission).
- **Time slots / days:** edit `SLOTS` and the Sunday rule in `app.js` if your availability changes.
