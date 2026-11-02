// Rigenera QR code, immagine di anteprima (Open Graph) e icona Apple.
// Uso (dalla cartella tools/):
//   npm install
//   node genera-asset.mjs https://il-tuo-dominio.it/
import { readFile, writeFile } from "node:fs/promises";
import QRCode from "qrcode";
import { Resvg } from "@resvg/resvg-js";

const url = process.argv[2] || "https://gigliogiovannig-ctrl.github.io/Lezioni-Chimica/";
const out = (p) => new URL(`../${p}`, import.meta.url);

// QR code vettoriale per il cartello A4 (correzione d'errore alta: resiste a stampe imperfette)
const qr = await QRCode.toString(url, {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 4,
  color: { dark: "#0b2747", light: "#ffffff" },
});
await writeFile(out("qr-code.svg"), qr);

const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { loadSystemFonts: true } }).render().asPng();

// Immagine Open Graph 1200×630 (WhatsApp non supporta SVG, serve un PNG)
const og = await readFile(new URL("og-image.svg", import.meta.url), "utf8");
await writeFile(out("img/og-image.png"), render(og, 1200));

// Icona per la schermata Home di iOS
const icon = await readFile(out("favicon.svg"), "utf8");
await writeFile(out("img/apple-touch-icon.png"), render(icon, 180));

console.log(`Fatto! QR code -> ${url}`);
