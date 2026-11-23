# Divya Foundation — Website Redesign

A redesigned, mobile-first version of [divyafoundation-ngo.org](https://divyafoundation-ngo.org) — the website of Divya Foundation, an NGO in Nashik working since 2006 on education, healthcare and community relief.

All original content and pages are kept; the UI/UX has been rebuilt in the style of leading NGO websites (clear calls to donate, trust signals, storytelling with imagery, and fast, accessible pages).

> **Note:** This is an independent redesign concept. It is not the official Divya Foundation website.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Our Work | `our-work.html` |
| Modus Operandi | `modus-operandi.html` |
| Get Involved | `get-involved.html` |
| Events & Recent Drives | `events.html` |
| Gallery Album | `gallery.html` |
| Contact | `contact.html` |
| Site Map | `sitemap.html` |
| 404 | `404.html` |

## What's improved

- **Donate everywhere:** "Support Us" popup (Full Name + Phone, same as the original) reachable from the header, footer, every page, and a sticky button on mobile. Adds phone validation and an optional cause picker.
- **Trust signals:** Since 2006, Charity Commissioner registration, 100% transparency — shown up front.
- **Contact page** with a real contact form and map (the original page had none).
- **Gallery lightbox** with keyboard and swipe navigation.
- **Events** redesigned as story cards with date, location and impact.
- Responsive layout, accessible markup (skip link, focus states, ARIA dialogs, reduced-motion support), SEO meta tags and schema.org NGO data.
- No frameworks or build step — plain HTML, CSS and JavaScript.

## Look & feel

- **Homepage animation (always dark, like pitchless.eu):** a glowing arch opens onto a globe that turns to India and zooms into Maharashtra, ending on a single glowing dot at Nashik. A Replay button plays it again.
- **Light mode:** the rest of the site uses mossy green (#A6B143) and sky blue (#C5DAFF) in roughly equal measure: sky-blue bands, cards and accents with moss-green buttons, text and icons.
- **Dark mode:** the whole site turns near-black with teal glow (the ChessPress look). Use the moon/sun button in the header; the choice is remembered, and the site follows the device setting until then.
- The globe is drawn live with d3 (`assets/js/globe.js`). Map data: Natural Earth via world-atlas; India state boundaries via udit-001/india-maps-data.


## Settings you can edit: `site-config.js`

- **Announcement ribbon:** the strip at the top of every page. Add, edit or remove lines in `announcements`. Leave the list empty to hide the ribbon.
- **Form destination:** paste the Google Apps Script web app URL into `formEndpoint` to save every form to a Google Sheet. See `SETUP-google-sheet.md`. While it's empty, forms open the visitor's email app instead.

## Apply for Support

`apply.html` is the online version of the foundation's Common Application Form for Assistance. It covers the type of assistance, applicant details, the need, the declaration, consent and the final acknowledgement. Each applicant gets an application number like `DF-261123-AB12`. If the applicant is under 18, the form asks for a parent or guardian. The printable PDF (`Divya-Foundation-Application-Form.pdf`) is linked for anyone who prefers paper.

## Forms

GitHub Pages has no server, so by default form submissions open the visitor's email app pre-filled to `divyafoundation.nsk@gmail.com`.

To receive submissions directly instead, create a free form endpoint (e.g. Formspree, Web3Forms) and paste its URL into `FORM_ENDPOINT` at the top of `assets/js/main.js`.

## Running locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

## Images

Photos are the same Unsplash images used on the original site. Replace them with the foundation's own photos for the best result.
