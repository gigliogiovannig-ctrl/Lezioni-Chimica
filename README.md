# Ripetizioni di Chimica · Giovanni Giglio

Sito statico single-page, mobile-first, in italiano. HTML + CSS + JavaScript vanilla: **nessun build step**, basta caricare i file.

```
ripetizioni-chimica/
├── index.html          ← tutte le sezioni (hero, per chi, come funziona, prezzi, quiz, chi sono, contatti)
├── styles.css          ← stile, dark mode, animazioni
├── script.js           ← CONFIG (WhatsApp/email) in cima + quiz + form
├── favicon.svg
├── qr-code.svg         ← QR code per il cartello A4
├── robots.txt, sitemap.xml
├── img/
│   ├── og-image.png        ← anteprima quando condividi il link (WhatsApp, Instagram, Facebook…)
│   ├── apple-touch-icon.png
│   ├── giovanni.svg        ← foto segnaposto
│   └── hex-pattern.svg
└── tools/              ← script OPZIONALI per rigenerare QR e immagini (non servono al sito)
```

---

## 1. Prima di pubblicare: personalizza

### Numero WhatsApp ed email
Apri `script.js` e modifica le prime righe:

```js
const CONFIG = {
  WHATSAPP_NUMBER: "393331234567",   // +39 333 123 4567 → solo cifre, con prefisso 39, senza "+"
  EMAIL: "tuaemail@example.com",
  EMAIL_SUBJECT: "Richiesta ripetizioni di chimica",
};
```

Tutti i pulsanti WhatsApp (hero, prezzi, quiz, bottone fluttuante, form) usano questi valori.

### La tua foto
Metti una foto quadrata (circa 600×600 px, JPG, < 150 KB) in `img/giovanni.jpg`, poi in `index.html` cambia:

```html
<img src="img/giovanni.svg" ...>   →   <img src="img/giovanni.jpg" ...>
```

### I quiz
Le domande sono nell'array `QUIZ` in `script.js`: puoi modificarle o aggiungerne altre (`correct` è l'indice della risposta giusta: 0, 1 o 2).

---

## 2. Pubblicare il sito

### Opzione A — Cloudflare Pages (consigliata, gratis, la più semplice)
1. Vai su <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Upload assets** (*Direct Upload*).
2. Dai un nome al progetto, es. `chimica-giglio` → il sito sarà su `https://chimica-giglio.pages.dev`.
3. Trascina la cartella `ripetizioni-chimica` (puoi escludere `tools/`) e clicca **Deploy**.

In alternativa, se il codice è su GitHub: **Create → Pages → Connect to Git**, scegli il repository, *Framework preset*: **None**, *Build command*: vuoto, *Build output directory*: `/`. Ogni `git push` ripubblica il sito.

### Opzione B — GitHub Pages
1. Crea un repository su GitHub (es. `ripetizioni-chimica`) e caricaci i file (anche via web: **Add file → Upload files**).
2. **Settings → Pages** → *Source*: **Deploy from a branch** → branch `main`, cartella `/ (root)` → **Save**.
3. Dopo un minuto il sito è su `https://TUO-UTENTE.github.io/ripetizioni-chimica/`.

### Dominio personalizzato (facoltativo)
Puoi comprare un dominio (es. `chimicacongiovanni.it`, ~10 €/anno) e collegarlo da **Custom domains** (Cloudflare) o **Settings → Pages → Custom domain** (GitHub).

---

## 3. Dopo la pubblicazione: aggiorna l'indirizzo del sito ⚠️

Nei file c'è come indirizzo provvisorio `https://gigliogiovannig-ctrl.github.io/Lezioni-Chimica/`. Se l'indirizzo reale è diverso:

1. **Cerca e sostituisci** `https://gigliogiovannig-ctrl.github.io/Lezioni-Chimica/` con il tuo indirizzo in `index.html`, `robots.txt` e `sitemap.xml`.
   (Serve perché l'anteprima di WhatsApp vuole l'indirizzo completo dell'immagine.)
2. **Rigenera il QR code** (serve [Node.js](https://nodejs.org)):
   ```bash
   cd tools
   npm install
   node genera-asset.mjs https://il-tuo-indirizzo/
   ```
   Lo script ricrea `qr-code.svg`, `img/og-image.png` e `img/apple-touch-icon.png`.
   Senza Node puoi usare un qualsiasi generatore di QR online che esporti in SVG.
3. Ripubblica.

> **Il QR incluso punta a `https://gigliogiovannig-ctrl.github.io/Lezioni-Chimica/`**: prima di stampare il cartello, verifica che sia l'indirizzo giusto e scansionalo col telefono.

### Il cartello A4
`qr-code.svg` è vettoriale: inseriscilo in Word/Canva/Google Docs a 6–8 cm di lato, resta nitido a qualsiasi dimensione. Ha correzione d'errore alta, quindi regge anche stampe non perfette.

### Controllare l'anteprima WhatsApp
WhatsApp mette in cache le anteprime. Per verificarle usa <https://developers.facebook.com/tools/debug/> (stesso sistema di Meta) e clicca **Scrape Again** dopo ogni modifica.

---

## 4. Provare il sito in locale
Apri semplicemente `index.html` nel browser, oppure:

```bash
npx serve .
```

## Note tecniche
- **Accessibilità**: HTML semantico, link "Vai al contenuto", focus visibile, contrasti AA, `prefers-reduced-motion` rispettato, errori del form annunciati.
- **Prestazioni**: nessuna libreria, un solo CSS e un JS (`defer`), immagini SVG leggere, font Google con `display=swap`.
- **Dark mode**: segue il sistema; il pulsante luna/sole forza la scelta e la ricorda.
- **Privacy**: il form non invia dati a nessun server, prepara solo il messaggio in WhatsApp o nell'app email. Nessun cookie, nessun tracker.
