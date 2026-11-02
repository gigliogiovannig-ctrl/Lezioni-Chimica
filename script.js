/* =========================================================
   CONFIGURAZIONE — modifica solo questi valori
   ========================================================= */
const CONFIG = {
  // Numero WhatsApp in formato internazionale, solo cifre, senza "+" né spazi.
  // Esempio: +39 333 123 4567  ->  "393331234567"
  WHATSAPP_NUMBER: "393387855476",

  // Email a cui ricevere le richieste
  EMAIL: "gigliogiovanni.g@gmail.com",

  // Oggetto predefinito delle email
  EMAIL_SUBJECT: "Richiesta ripetizioni di chimica",
};

/* =========================================================
   Quiz "Chimica curiosa"
   correct = indice (0, 1, 2) della risposta giusta
   ========================================================= */
const QUIZ = [
  {
    tag: "Acqua",
    question: "Perché il ghiaccio galleggia sull'acqua?",
    options: [
      "Perché è pieno di bollicine d'aria",
      "Perché i legami a idrogeno lo bloccano in una struttura più \"vuota\" e meno densa",
      "Perché il freddo tende sempre a salire",
    ],
    correct: 1,
    explain:
      "Quando l'acqua congela, i legami a idrogeno fissano le molecole in un reticolo esagonale con molto spazio vuoto: il ghiaccio è circa l'8% meno denso dell'acqua liquida. È un comportamento rarissimo, ed è il motivo per cui laghi e mari gelano solo in superficie e la vita sotto sopravvive.",
  },
  {
    tag: "Carbonio",
    question: "Un diamante e la mina di una matita sono fatti…",
    options: [
      "Dello stesso elemento: carbonio puro",
      "Il diamante di carbonio, la mina di piombo",
      "Entrambi di silicio, ma cristallizzato in modo diverso",
    ],
    correct: 0,
    explain:
      "Sono due allotropi del carbonio. Nel diamante ogni atomo è legato ad altri 4 in una rete 3D rigidissima; nella grafite gli atomi formano fogli piatti che scivolano l'uno sull'altro, ed è per questo che la mina \"scrive\". Il piombo nelle matite? Non c'è mai stato!",
  },
  {
    tag: "Mole",
    question: "Quante molecole ci sono, più o meno, in una singola goccia d'acqua?",
    options: [
      "Circa un milione",
      "Circa mille miliardi (10¹²)",
      "Circa 1,7 × 10²¹: mille miliardi di miliardi",
    ],
    correct: 2,
    explain:
      "Una goccia pesa circa 0,05 g. Diviso per la massa molare dell'acqua (18 g/mol) fa ~0,0028 mol; moltiplicato per il numero di Avogadro (6,02 × 10²³) dà ~1,7 × 10²¹ molecole. Miliardi di volte più delle stelle della nostra galassia. Questa è la stechiometria!",
  },
  {
    tag: "Corpo umano",
    question: "Qual è l'elemento più abbondante, in massa, nel corpo umano?",
    options: [
      "Il carbonio",
      "L'ossigeno",
      "L'idrogeno",
    ],
    correct: 1,
    explain:
      "È l'ossigeno: circa il 65% della nostra massa, soprattutto perché siamo fatti per il 60% di acqua (H₂O) e l'ossigeno pesa 16 volte l'idrogeno. L'idrogeno vince invece per numero di atomi: circa 6 atomi su 10!",
  },
];

/* =========================================================
   Da qui in giù non serve modificare nulla
   ========================================================= */
(function () {
  "use strict";

  const waLink = (text) =>
    `https://wa.me/${CONFIG.WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

  const mailLink = (body) =>
    `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(CONFIG.EMAIL_SUBJECT)}${
      body ? `&body=${encodeURIComponent(body)}` : ""
    }`;

  /* ---------- Link WhatsApp ed email ---------- */
  document.querySelectorAll(".js-wa").forEach((a) => {
    a.href = waLink(a.dataset.waText || "Ciao Giovanni! Vorrei informazioni sulle ripetizioni di chimica.");
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll(".js-email").forEach((a) => {
    a.href = mailLink();
  });

  /* ---------- Anno nel footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Tema chiaro/scuro ---------- */
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : media.matches);
  const themeBtn = document.querySelector(".theme-toggle");
  const syncThemeLabel = () =>
    themeBtn.setAttribute("aria-label", isDark() ? "Passa al tema chiaro" : "Passa al tema scuro");
  syncThemeLabel();
  themeBtn.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* storage non disponibile */ }
    syncThemeLabel();
  });
  media.addEventListener?.("change", syncThemeLabel);

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? "Chiudi il menu" : "Apri il menu";
    menu.classList.toggle("open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Header con ombra + bottone WhatsApp fluttuante ---------- */
  const header = document.querySelector(".site-header");
  const floatBtn = document.querySelector(".wa-float");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 8);
    floatBtn.classList.toggle("show", y > window.innerHeight * 0.8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Quiz ---------- */
  const grid = document.getElementById("quiz-grid");
  const scoreEl = document.getElementById("quiz-score");
  let answered = 0;
  let right = 0;
  const letters = ["A", "B", "C"];

  QUIZ.forEach((q, qi) => {
    const card = document.createElement("article");
    card.className = "quiz reveal";
    const qid = `quiz-q-${qi}`;
    card.innerHTML = `
      <p class="quiz-tag">${q.tag}</p>
      <h3 id="${qid}">${q.question}</h3>
      <ul class="quiz-options" role="list" aria-labelledby="${qid}">
        ${q.options
          .map(
            (o, i) =>
              `<li><button type="button" class="quiz-opt" data-i="${i}"><span class="quiz-letter" aria-hidden="true">${letters[i]}</span><span>${o}</span></button></li>`
          )
          .join("")}
      </ul>
      <div class="quiz-explain"><div><div class="quiz-explain-inner" aria-live="polite"></div></div></div>`;
    grid.appendChild(card);

    const buttons = card.querySelectorAll(".quiz-opt");
    const explain = card.querySelector(".quiz-explain-inner");

    buttons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const chosen = Number(btn.dataset.i);
        const ok = chosen === q.correct;
        buttons.forEach((b, i) => {
          b.disabled = true;
          if (i === q.correct) b.classList.add("correct");
          else if (i === chosen) b.classList.add("wrong");
          else b.classList.add("dim");
        });
        explain.innerHTML = `
          <p class="quiz-verdict ${ok ? "ok" : "ko"}">${ok ? "Esatto! 🎉" : "Quasi! La risposta giusta è la " + letters[q.correct] + "."}</p>
          <p>${q.explain}</p>`;
        card.classList.add("answered");

        answered++;
        if (ok) right++;
        if (answered === QUIZ.length) {
          scoreEl.textContent =
            right === QUIZ.length
              ? `Punteggio pieno: ${right}/${QUIZ.length}! Hai la chimica nel sangue 🧬`
              : `Hai fatto ${right}/${QUIZ.length}. Con un po' di lezioni diventa ${QUIZ.length}/${QUIZ.length} 😉`;
        }
      })
    );
  });

  /* ---------- Animazioni "reveal" allo scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Form contatti ---------- */
  const form = document.getElementById("contact-form");
  const nome = form.elements.nome;
  const livello = form.elements.livello;

  const setError = (field, show) => {
    field.setAttribute("aria-invalid", String(show));
    const err = document.getElementById(`${field.id}-err`);
    if (err) err.hidden = !show;
    if (show) field.setAttribute("aria-describedby", err.id);
    else field.removeAttribute("aria-describedby");
  };

  const validate = () => {
    const okNome = nome.value.trim().length > 0;
    const okLivello = livello.value !== "";
    setError(nome, !okNome);
    setError(livello, !okLivello);
    if (!okNome) nome.focus();
    else if (!okLivello) livello.focus();
    return okNome && okLivello;
  };

  [nome, livello].forEach((f) =>
    f.addEventListener("input", () => { if (f.getAttribute("aria-invalid") === "true") setError(f, false); })
  );

  const buildMessage = () => {
    const d = new FormData(form);
    const lines = [
      `Ciao Giovanni! Sono ${d.get("nome").trim()} e vorrei prenotare la lezione di prova gratuita.`,
      "",
      `• Livello: ${d.get("livello")}`,
    ];
    const materia = (d.get("materia") || "").trim();
    if (materia) lines.push(`• Materia/esame: ${materia}`);
    lines.push(`• Modalità: ${d.get("modalita")}`);
    const msg = (d.get("messaggio") || "").trim();
    if (msg) lines.push("", msg);
    return lines.join("\n");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) return;
    window.open(waLink(buildMessage()), "_blank", "noopener");
  });

  document.getElementById("send-email").addEventListener("click", () => {
    if (!validate()) return;
    window.location.href = mailLink(buildMessage());
  });
})();
