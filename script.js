/* ============================================================
   BIRTHDAY SURPRISE - script.js
   Logika Countdown, Fase, Konfeti ✨
   ============================================================ */

/* ============================================================
   🎀 KONFIGURASI - UBAH SESUAI KEBUTUHAN
   ============================================================ */
const BIRTHDAY_CONFIG = {
  // ⬇️ Ganti dengan tanggal & waktu ulang tahun (format: 'YYYY-MM-DDTHH:MM:SS')
  // Contoh: '2025-08-17T00:00:00' = 17 Agustus 2025 jam 00:00
  birthdayDate: "2026-03-30T00:00:00+08:00",

  // ⬇️ Nama penerima (tampil di judul)
  recipientName: "Dincil",
};

/* ============================================================
   STATE
   ============================================================ */
let countdownInterval = null;
let envelopeOpened = false;
let confettiRunning = false;

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Update nama di judul countdown
  const nameEl = document.querySelector(".name-highlight");
  if (nameEl) nameEl.textContent = `${BIRTHDAY_CONFIG.recipientName}! 🎀`;

  // Cek apakah sudah waktunya
  const targetDate = new Date(BIRTHDAY_CONFIG.birthdayDate);
  const now = new Date();

  if (now >= targetDate) {
    // Sudah melewati tanggal ulang tahun → langsung ke fase 2
    skipToPhase2();
  } else {
    // Mulai countdown
    startCountdown(targetDate);
  }
});

/* ============================================================
   FASE 1: COUNTDOWN
   ============================================================ */
function startCountdown(targetDate) {
  updateDisplay(targetDate);
  countdownInterval = setInterval(() => {
    const remaining = updateDisplay(targetDate);
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      skipToPhase2();
    }
  }, 1000);
}

function updateDisplay(targetDate) {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    setTimerValues(0, 0, 0, 0);
    return 0;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  setTimerValues(days, hours, minutes, seconds);
  return diff;
}

function setTimerValues(d, h, m, s) {
  const prevSeconds = document.getElementById("seconds").textContent;

  document.getElementById("days").textContent = String(d).padStart(2, "0");
  document.getElementById("hours").textContent = String(h).padStart(2, "0");
  document.getElementById("minutes").textContent = String(m).padStart(2, "0");
  document.getElementById("seconds").textContent = String(s).padStart(2, "0");

  // Pop animation on seconds change
  if (prevSeconds !== String(s).padStart(2, "0")) {
    tickElement(document.getElementById("seconds"));
    // Also tick minutes when seconds reset
    if (s === 59) tickElement(document.getElementById("minutes"));
  }
}

function tickElement(el) {
  el.classList.remove("tick");
  // Force reflow
  void el.offsetWidth;
  el.classList.add("tick");
}

/* ============================================================
   TRANSISI FASE
   ============================================================ */
function switchPhase(fromId, toId, delay = 0) {
  const fromEl = document.getElementById(fromId);
  const toEl = document.getElementById(toId);

  if (!fromEl || !toEl) return;

  fromEl.classList.add("fade-out");

  setTimeout(() => {
    fromEl.classList.remove("active", "fade-out");
    toEl.classList.add("active");
  }, delay || 800);
}

function skipToPhase2() {
  if (countdownInterval) clearInterval(countdownInterval);
  switchPhase("phase-countdown", "phase-envelope");
}

function goToPhase3() {
  switchPhase("phase-envelope", "phase-slideshow");

  // Launch a smaller confetti burst on transition
  setTimeout(() => {
    launchMiniConfetti();
  }, 900);
}

function restartExperience() {
  envelopeOpened = false;

  // Reset envelope to original state
  document.getElementById("envelopeFlap").classList.remove("open");
  document.getElementById("letter").classList.remove("revealed");
  document.getElementById("envelope").style.display = "";
  document.getElementById("clickHint").style.opacity = "1";
  document.getElementById("clickHint").style.pointerEvents = "auto";

  // Switch back to countdown (or phase 2 if birthday already passed)
  const targetDate = new Date(BIRTHDAY_CONFIG.birthdayDate);
  const now = new Date();

  if (now >= targetDate) {
    switchPhase("phase-slideshow", "phase-envelope");
  } else {
    switchPhase("phase-slideshow", "phase-countdown");
    startCountdown(targetDate);
  }
}

/* ============================================================
   FASE 2: ENVELOPE LOGIC
   ============================================================ */
function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // 1. Open the flap
  document.getElementById("envelopeFlap").classList.add("open");

  // 2. Hide click hint
  const hint = document.getElementById("clickHint");
  hint.style.opacity = "0";
  hint.style.pointerEvents = "none";

  // 3. CONFETTI EXPLOSION! 🎉
  setTimeout(() => {
    launchBigConfetti();
  }, 400);

  // 4. After flap opens, reveal the letter
  setTimeout(() => {
    const envelope = document.getElementById("envelope");
    envelope.style.display = "none";

    const letter = document.getElementById("letter");
    letter.classList.add("revealed");
  }, 700);
}

/* ============================================================
   KONFETI 🎊
   ============================================================ */
function launchBigConfetti() {
  if (typeof confetti === "undefined") return;

  const colors = [
    "#FFB3C6",
    "#D4B8E0",
    "#B8EBD4",
    "#B8DEFF",
    "#FFF0A0",
    "#FF85A1",
    "#B48FCA",
    "#7DD4AD",
    "#FFDD57",
    "#FF6B9D",
  ];

  // First burst — center explosion
  confetti({
    particleCount: 120,
    angle: 90,
    spread: 100,
    startVelocity: 55,
    origin: { x: 0.5, y: 0.6 },
    colors,
    shapes: ["circle", "square"],
    scalar: 1.2,
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      startVelocity: 50,
      origin: { x: 0, y: 0.7 },
      colors,
    });
  }, 200);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      startVelocity: 50,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 350);

  // Stars burst
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 90,
      spread: 360,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.5 },
      colors,
      shapes: ["star"],
      scalar: 1.5,
    });
  }, 500);

  // Trailing sparkle
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 90,
      spread: 60,
      startVelocity: 25,
      origin: { x: 0.5, y: 0.4 },
      colors,
      ticks: 300,
      gravity: 0.5,
      scalar: 0.8,
      drift: 1,
    });
  }, 800);
}

function launchMiniConfetti() {
  if (typeof confetti === "undefined") return;

  const colors = ["#FFB3C6", "#D4B8E0", "#B8EBD4", "#FFDD57", "#FF85A1"];

  confetti({
    particleCount: 50,
    angle: 90,
    spread: 80,
    startVelocity: 35,
    origin: { x: 0.5, y: 0.6 },
    colors,
    scalar: 0.9,
  });
}

/* ============================================================
   UTILITIES
   ============================================================ */

// Expose to HTML onclick attributes
window.skipToPhase2 = skipToPhase2;
window.openEnvelope = openEnvelope;
window.goToPhase3 = goToPhase3;
window.restartExperience = restartExperience;

// Optional: keyboard shortcut for dev (press Space to advance phases)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.shiftKey) {
    const countdown = document.getElementById("phase-countdown");
    const envelope = document.getElementById("phase-envelope");
    const slideshow = document.getElementById("phase-slideshow");

    if (countdown.classList.contains("active")) skipToPhase2();
    else if (envelope.classList.contains("active")) {
      if (!envelopeOpened) openEnvelope();
      else goToPhase3();
    } else if (slideshow.classList.contains("active")) restartExperience();
  }
});

// Auto-confetti rain on page load if it's already the birthday
(function checkBirthdayToday() {
  const target = new Date(BIRTHDAY_CONFIG.birthdayDate);
  const now = new Date();
  const sameDay =
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth() &&
    now.getDate() === target.getDate();

  if (sameDay) {
    // Gentle rain of confetti every 8 seconds
    setTimeout(() => {
      if (typeof confetti !== "undefined") {
        const interval = setInterval(() => {
          confetti({
            particleCount: 20,
            angle: 60,
            spread: 50,
            origin: { x: 0, y: 0 },
            colors: ["#FFB3C6", "#D4B8E0", "#FFF0A0"],
          });
          confetti({
            particleCount: 20,
            angle: 120,
            spread: 50,
            origin: { x: 1, y: 0 },
            colors: ["#B8EBD4", "#B8DEFF", "#FFDD57"],
          });
        }, 8000);

        // Stop after 1 minute
        setTimeout(() => clearInterval(interval), 60000);
      }
    }, 2000);
  }
})();
