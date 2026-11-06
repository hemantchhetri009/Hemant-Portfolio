/* ── Helpers ─────────────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const R = (a, b) => a + Math.random() * (b - a);
const H = () => Math.round(R(0, 360));

/* ── Post data ───────────────────────────────────────────────────────────── */
const P = [
  { t:"Me",        k:"me",    img:"images/post_me.jpg",    fx:"grayscale(1) contrast(1.15)", f:"Inkwell",   w:"27 Oct 2026", l:41,
    d:"Hello from Chennai! I'm Hemant, a second-year BCA student at SRM University, originally from Nepal. I spend my days between code editors, security labs and video timelines, and this page is where all three meet.",
    g:"#bca #chennai #nepal #developer" },

  { t:"CyberShield", k:"cyber", img:"images/post_cyber.jpg", fx:"contrast(1.1) saturate(1.3)", f:"X-Pro II", w:"University project", l:63,
    d:"CyberShield is my network security monitoring and intrusion-detection system, written as a multi-module Python command-line tool. I hand-wrote the data structures, analysed the complexity of every algorithm and covered it all with a full unittest suite.",
    g:"#python #cybersecurity #ids #unittest" },

  { t:"Scanner", k:"scan", img:"images/post_scan.jpg", fx:"sepia(.2) contrast(1.1) saturate(1.2)", f:"Hudson", w:"In progress", l:52,
    d:"Next up: a connected web vulnerability scanner. It grew out of CyberShield into a multi-module tool that checks web targets for common weaknesses. It's meant for authorised testing and learning only.",
    g:"#python #appsec #scanner #learning" },

  { t:"Civizen", k:"civic", img:"images/post_civic.jpg", fx:"sepia(.3) saturate(1.5) brightness(1.05)", f:"Valencia", w:"Hackathon", l:77,
    d:"Civizen is a civic issue reporting app I built as a hackathon prototype. Citizens report a problem, follow it through every stage until it's fixed, and earn Civic Karma points for helping. Built with HTML, CSS, JavaScript, PHP and MySQL.",
    g:"#php #mysql #javascript #hackathon" },

  { t:"PulseChat", k:"chat", img:"images/post_chat.jpg", fx:"contrast(1.05) saturate(1.3)", f:"Nashville", w:"Personal project", l:58,
    d:"PulseChat is an Omegle-style anonymous chat where two strangers talk one-to-one in real time. It runs on Node.js, Express and Socket.IO, with typing indicators, an emoji picker and rate limiting.",
    g:"#nodejs #socketio #realtime #chat" },

  { t:"Café", k:"cafe", img:"images/post_cafe.jpg", fx:"sepia(.35) saturate(1.3) contrast(1.05)", f:"Earlybird", w:"Prototype", l:47,
    d:"A prototype for a café management system, designed around a Nepali café chain. One dashboard holds the point of sale, the kitchen display, table management and inventory.",
    g:"#saas #dashboard #cafe #nepal" },

  { t:"Radio", k:"radio", img:"images/post_radio.jpg", fx:"sepia(.45) contrast(.95) brightness(1.05)", f:"Lo-Fi", w:"Personal project", l:39,
    d:"My personal music radio site: a looping background video, a hidden YouTube audio player and a pill-shaped control bar docked at the bottom. I redesigned the player several times until it felt right.",
    g:"#css #youtubeapi #music #webdesign" },

  { t:"Cut", k:"edit", img:"images/post_edit.jpg", fx:"contrast(1.2) saturate(.9)", f:"Brannan", w:"Always", l:66,
    d:"Video editing is the other half of me next to code. It taught me about rhythm: when to cut, when to hold a shot and how sound carries a scene. I bring that thinking into my interfaces.",
    g:"#videoediting #reels #cuts #creative" },

  { t:"Home", k:"nepal", img:"images/post_nepal.jpg", fx:"sepia(.25) saturate(1.4) contrast(1.05)", f:"Sierra", w:"2024 – now", l:71,
    d:"Nepal in my heart, Chennai on my timetable. I'm studying BCA at SRM University here, learning something new every week and building things on the side.",
    g:"#nepal #chennai #srm #bca" }
];

/* ── Random-person generator (for follower sheet & comments) ─────────────── */
const FN = "Aayush Sita Rohan Anjali Bibek Priya Sujan Kavya Nirmala Arjun Pooja Sandesh Meera Dipesh Ritika Suresh Divya Prabin Sneha Kiran Nisha Rahul Aditi Sagar Lakshmi Anil Deepa Manish Tara Binita Milan Roshan Samjhana Utsav".split(" ");
const LN = "Sharma Thapa Gurung Rai Karki Shrestha Basnet Tamang Adhikari Bista Poudel Gautam Bhattarai Khadka KC Kunwar Magar Lama Gurung Oli Rijal".split(" ");
const CM = [
  "Dammi kaam! 🔥",
  "Yo post ekdam man paryo 😍",
  "Ekdam clean cha 👏",
  "Yo kasari banako? Sikau na 🙌",
  "Ramailo lagyo, keep it up! 😊",
  "Proud of you hai! 🇳🇵",
  "Wow, ekdam impressive cha! ✨"
];

const person = () => {
  const a = pick(FN), b = pick(LN);
  return { n: a + " " + b, u: (a + "." + b).toLowerCase() + Math.round(R(1, 99)), c: `hsl(${H()},45%,48%)` };
};

/* ── Build thumbnail HTML ────────────────────────────────────────────────── */
const picture = p =>
  `<div class="ph"><img src="${p.img}" alt="${p.t}" style="filter:${p.fx}"></div>`;

/* ── Seed grid ───────────────────────────────────────────────────────────── */
const grid = $("posts");
const mod   = $("mod");
const media = $("media");
let cur = null, last = null;
const liked = {};

// Follower / following counts
const nf = Math.round(R(640, 1380)), ng = Math.round(R(110, 260));
$("nfers").textContent = nf.toLocaleString("en-US");
$("nfing").textContent = ng;
$("wa").src = document.querySelector(".ava").src;

P.forEach((p, i) => {
  const b = document.createElement("button");
  b.className = "tile";
  b.setAttribute("aria-label", "Open post: " + p.t);
  b.innerHTML = picture(p) + `<span class="hov">♥ ${p.l}</span>`;
  b.onclick = () => openPost(i, b);
  grid.appendChild(b);
});

/* ── Like state ──────────────────────────────────────────────────────────── */
function stat(i) {
  const n = P[i].l + (liked[i] ? 1 : 0);
  const hb = $("hb");
  $("lk").textContent = n + " likes";
  hb.textContent = liked[i] ? "♥" : "♡";
  hb.classList.toggle("on", !!liked[i]);
  hb.setAttribute("aria-pressed", !!liked[i]);
}

/* ── Open post modal ─────────────────────────────────────────────────────── */
function openPost(i, el) {
  cur = i; last = el;
  const p = P[i];
  media.querySelectorAll(".ph").forEach(n => n.remove());
  media.insertAdjacentHTML("afterbegin", picture(p));
  const c1 = person(), c2 = person();
  $("cm").innerHTML =
    `<p class="comment-heading">💬 Comment haru</p>
     <p><b>hemant chhetri</b> ${p.d}</p>
     <p class="tags">${p.g}</p>
     <p style="color:var(--muted)">Filter: ${p.f}</p>
     <p><b>${c1.u}</b> ${pick(CM)}</p>
     <p><b>${c2.u}</b> ${pick(CM)}</p>`;
  $("wt").textContent = p.w;
  $("dt").textContent = p.w;
  stat(i);
  mod.hidden = false;
  document.body.style.overflow = "hidden";
  $("x").focus();
}

/* ── Like actions ────────────────────────────────────────────────────────── */
function like(on) {
  if (cur === null) return;
  liked[cur] = on ?? !liked[cur];
  stat(cur);
  if (liked[cur]) {
    const e = $("pop");
    e.classList.remove("go");
    void e.offsetWidth;
    e.classList.add("go");
  }
}

$("hb").onclick = () => like();
media.ondblclick  = () => like(true);

/* ── Close modals ────────────────────────────────────────────────────────── */
function closeAll() {
  const was = !mod.hidden || !$("dlg").hidden;
  mod.hidden = true;
  $("dlg").hidden = true;
  document.body.style.overflow = "";
  if (was && last) last.focus();
}
$("x").onclick  = closeAll;
$("dx").onclick = closeAll;
[mod, $("dlg")].forEach(m => m.onclick = e => { if (e.target === m) closeAll(); });
addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });

/* ── Generic dialog (followers / following) ──────────────────────────────── */
function dlg(title, html, from) {
  last = from;
  $("dtl").textContent = title;
  $("db").innerHTML    = html;
  $("dlg").hidden      = false;
  document.body.style.overflow = "hidden";
  $("dx").focus();
}

$("fers").onclick = e => {
  let h = "";
  for (let i = 0; i < 30; i++) {
    const q = person();
    h += `<div class="u"><span class="av" style="background:${q.c}">${q.n[0]}</span>
           <div><b>${q.u}</b><span>${q.n}</span></div>
           <button>Follow</button></div>`;
  }
  h += `<p class="msg" style="font-size:13px;color:var(--muted)">…and ${(nf - 30).toLocaleString("en-US")} more</p>`;
  dlg("Followers", h, e.currentTarget);
  $("db").querySelectorAll(".u button").forEach(b => b.onclick = () => {
    b.classList.toggle("on");
    b.textContent = b.classList.contains("on") ? "Following" : "Follow";
  });
};

$("fing").onclick = e =>
  dlg("Following",
    `<div class="msg"><i>😄</i>Don't worry — your spot on my following list is still open.<br><br>Follow me on Instagram!</div>`,
    e.currentTarget);

/* ── Tab switching ───────────────────────────────────────────────────────── */
function go(id) {
  ["posts","about","skills","contact"].forEach(k => {
    $(k).hidden = k !== id;
    $("t-" + k).setAttribute("aria-selected", k === id);
  });
}
document.querySelectorAll("[data-go]")
  .forEach(e => e.addEventListener("click", () => go(e.dataset.go)));
