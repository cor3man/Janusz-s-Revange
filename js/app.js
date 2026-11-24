// PrizeBlox — a harmless prank page.
// Collects nothing: no forms, no storage, no cookies, no network calls.
// The only outbound navigation is the rickroll at the very end.
(function () {
  "use strict";

  var RICKROLL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  var amount = 10000;
  var timers = [];

  function $(id) { return document.getElementById(id); }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function fmt(n) { return n.toLocaleString("en-US"); }

  function show(id) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.toggle("active", screens[i].id === id);
    }
    window.scrollTo(0, 0);
  }

  // --- Greeting: read-only from the URL, rendered as plain text, never stored or sent.
  function greet() {
    var name = "";
    try { name = (new URLSearchParams(location.search).get("name") || ""); } catch (e) {}
    name = name.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 20);
    $("greeting").textContent = name ? "CONGRATULATIONS, " + name.toUpperCase() + "!" : "CONGRATULATIONS!";
  }

  // --- Fake trust signals (in memory only).
  var countdownLeft = 299;
  var claimed = 2847;
  function startTicker() {
    setInterval(function () {
      countdownLeft = countdownLeft > 0 ? countdownLeft - 1 : 299;
      var m = Math.floor(countdownLeft / 60), s = countdownLeft % 60;
      $("countdown").textContent = "0" + m + ":" + (s < 10 ? "0" : "") + s;
    }, 1000);
    setInterval(function () {
      if (Math.random() < 0.6) {
        claimed += 1 + Math.floor(Math.random() * 3);
        $("claimed").textContent = fmt(claimed);
      }
    }, 1500);
  }

  // --- Sound: synthesized with Web Audio (no files, no requests). Silently skipped if unavailable.
  var ctx = null;
  function audio() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { ctx = null; }
    return ctx;
  }

  function drumroll(seconds) {
    var ac = audio();
    if (!ac) return;
    var len = Math.floor(ac.sampleRate * 0.04);
    var buf = ac.createBuffer(1, len, ac.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var t0 = ac.currentTime + 0.05;
    var hits = Math.floor(seconds * 18);
    for (var h = 0; h < hits; h++) {
      var src = ac.createBufferSource();
      src.buffer = buf;
      var filt = ac.createBiquadFilter();
      filt.type = "bandpass";
      filt.frequency.value = 900;
      var g = ac.createGain();
      g.gain.value = 0.15 + 0.5 * (h / hits); // crescendo
      src.connect(filt); filt.connect(g); g.connect(ac.destination);
      src.start(t0 + h / 18);
    }
  }

  function airhorn() {
    var ac = audio();
    if (!ac) return;
    var t = ac.currentTime;
    var g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.03);
    g.gain.setValueAtTime(0.25, t + 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    g.connect(ac.destination);
    [466, 470, 233].forEach(function (f) {
      var o = ac.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.connect(g);
      o.start(t);
      o.stop(t + 0.95);
    });
  }

  // --- Confetti
  function confetti() {
    var box = $("confetti");
    var colors = ["#00a2ff", "#22c55e", "#ffd60a", "#ff4d8d", "#7c3aed", "#ffffff"];
    for (var i = 0; i < 90; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 1.2 + Math.random() * 1.6 + "s";
      p.style.animationDelay = Math.random() * 0.4 + "s";
      box.appendChild(p);
    }
  }

  // --- Generating sequence -> reveal -> redirect
  var STAGES = [
    "Connecting to the prize server",
    "Verifying your account…",
    "Generating your Blox Bucks…",
    "Almost there…"
  ];

  function generate() {
    show("generating");
    $("gen-title").textContent = "Generating " + fmt(amount) + " Blox Bucks…";
    var fill = $("fill");
    var bar = fill.parentNode;
    drumroll(5);
    STAGES.forEach(function (msg, i) {
      later(function () {
        $("status").textContent = msg;
        var pct = Math.round(((i + 1) / STAGES.length) * 100) - (i === STAGES.length - 1 ? 3 : 0);
        fill.style.width = pct + "%";
        bar.setAttribute("aria-valuenow", String(pct));
      }, i * 1250);
    });
    later(function () {
      fill.style.width = "100%";
      bar.setAttribute("aria-valuenow", "100");
    }, STAGES.length * 1250 - 150);
    later(reveal, STAGES.length * 1250 + 250);
  }

  function reveal() {
    show("reveal");
    airhorn();
    confetti();
    later(function () { location.href = RICKROLL; }, 1200);
  }

  // --- Reset to a clean start (e.g. back button restores page from bfcache)
  function reset() {
    timers.forEach(clearTimeout);
    timers = [];
    amount = 10000;
    $("fill").style.width = "0";
    $("status").textContent = STAGES[0];
    $("confetti").innerHTML = "";
    var robot = $("robot");
    robot.setAttribute("aria-checked", "false");
    robot.disabled = false;
    show("landing");
  }

  // --- Wiring
  document.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    audio(); // unlock audio on first gesture

    if (t.dataset.next) { show(t.dataset.next); return; }
    if (t.dataset.platform) { show("amount"); return; }
    if (t.dataset.amount) { amount = parseInt(t.dataset.amount, 10) || 10000; show("verify"); return; }
    if (t.id === "robot") {
      // Verifies absolutely nothing.
      t.setAttribute("aria-checked", "true");
      t.disabled = true;
      later(generate, 600);
    }
  });

  window.addEventListener("pageshow", function (e) { if (e.persisted) reset(); });

  greet();
  startTicker();
})();
