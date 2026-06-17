import type { GlobalStats, QuestionStats, StoredDeck } from "../types";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

function fmtMs(ms: number): string {
  const t = Math.floor(ms / 1000);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

/** JSON.stringify + esc so numbers are safe to inline into a <script>. */
function js(value: unknown): string {
  return JSON.stringify(value);
}

export function generateProgressHtml(
  decks: StoredDeck[],
  stats: GlobalStats,
  questionStats: QuestionStats[],
): string {
  const totalAttempts = questionStats.reduce((s, qs) => s + qs.attempts, 0);
  const totalCorrect = questionStats.reduce((s, qs) => s + qs.correct, 0);
  const totalWrong = questionStats.reduce((s, qs) => s + qs.wrong, 0);
  const accuracyNum = totalAttempts ? (totalCorrect / totalAttempts) * 100 : 0;
  const avgScore = stats.completed ? (stats.totalCorrect / stats.completed).toFixed(1) : "—";
  const avgTime = stats.completed ? fmtMs(stats.totalTimeMs / stats.completed) : "—";
  const bestStr = stats.completed ? `${stats.bestScore} / ${stats.bestTotal || "?"}` : "—";
  const bestPct = stats.completed ? stats.bestPercent.toFixed(1) + "%" : "—";

  const topWrong = questionStats
    .filter((s) => s.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 10);
  const maxWrong = topWrong.length ? topWrong[0].wrong : 1;

  const deckStats = decks.map((d) => {
    const ds = questionStats.filter((qs) => qs.deckId === d.id);
    const da = ds.reduce((s, qs) => s + qs.attempts, 0);
    const dc = ds.reduce((s, qs) => s + qs.correct, 0);
    const dw = ds.reduce((s, qs) => s + qs.wrong, 0);
    return {
      name: d.name,
      total: d.questions.length,
      attempts: da,
      correct: dc,
      wrong: dw,
      pct: da > 0 ? (dc / da) * 100 : 0,
    };
  });

  const now = new Date().toLocaleString("it-IT");

  // Data payload for the inline script (count-ups + bars)
  const data = {
    accuracy: totalAttempts ? Math.round(accuracyNum * 10) / 10 : 0,
    completed: stats.completed,
    totalAttempts,
    totalCorrect,
    totalWrong,
    avgScore: stats.completed ? Math.round((stats.totalCorrect / stats.completed) * 10) / 10 : 0,
    hasAvgScore: !!stats.completed,
    hasCompleted: !!stats.completed,
    bestPctNum: stats.completed ? Math.round(stats.bestPercent * 10) / 10 : 0,
  };

  const summaryCards = [
    { label: "Quiz completati", value: data.completed, suffix: "", accent: "a", raw: String(stats.completed) },
    { label: "Domande totali", value: data.totalAttempts, suffix: "", accent: "b", raw: String(totalAttempts) },
    { label: "Risposte corrette", value: data.totalCorrect, suffix: "", accent: "c", raw: String(totalCorrect) },
    { label: "Risposte errate", value: data.totalWrong, suffix: "", accent: "d", raw: String(totalWrong) },
    { label: "Media punteggi", value: data.avgScore, suffix: "", accent: "e", raw: avgScore, hide: !data.hasAvgScore },
    { label: "Miglior punteggio", value: 0, suffix: "", accent: "f", raw: bestStr + " · " + bestPct, static: true },
  ];

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QuizMe — Dashboard progressi</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --accent:#6d28d9;--accent2:#db2777;--accent3:#2563eb;
    --success:#16a34a;--error:#dc2626;--warn:#b45309;
    --bg:#f7f7fb;--surface:rgba(255,255,255,0.72);--solid:#fff;
    --text:#0f1020;--muted:#5d6370;--border:rgba(15,18,40,0.08);
    --shadow:0 1px 2px rgba(15,23,42,.05),0 18px 50px -16px rgba(15,23,42,.18);
  }
  @media(prefers-color-scheme:dark){
    :root{
      --bg:#07070f;--surface:rgba(23,24,38,.72);--solid:#171826;
      --text:#f3f4fb;--muted:#a0a6bd;--border:rgba(255,255,255,.08);
      --shadow:0 1px 2px rgba(0,0,0,.3),0 22px 60px -16px rgba(0,0,0,.55);
    }
  }
  html{scroll-behavior:smooth}
  body{
    font-family:"Inter",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    color:var(--text);line-height:1.55;
    background:var(--bg);background-attachment:fixed;
    background-image:
      radial-gradient(55rem 55rem at 110% -10%,rgba(219,39,119,.12),transparent 60%),
      radial-gradient(50rem 50rem at -10% 0%,rgba(109,40,217,.14),transparent 55%),
      radial-gradient(40rem 40rem at 50% 120%,rgba(37,99,235,.1),transparent 60%);
    min-height:100vh;
  }
  h1,h2,h3{font-family:"Space Grotesk","Inter",sans-serif;letter-spacing:-.02em}
  ::selection{background:rgba(109,40,237,.28)}
  .wrap{max-width:1040px;margin:0 auto;padding:32px 20px 64px}
  .card{
    background:var(--surface);
    -webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);
    border:1px solid var(--border);border-radius:24px;
    padding:28px;box-shadow:var(--shadow);
  }
  /* Hero */
  .hero{position:relative;overflow-hidden;padding:40px 32px;margin-bottom:28px}
  .hero .blob{position:absolute;border-radius:999px;filter:blur(60px);opacity:.5;pointer-events:none}
  .hero .b1{top:-80px;right:-40px;width:340px;height:340px;background:radial-gradient(circle,var(--accent2),transparent 65%);animation:float 16s ease-in-out infinite}
  .hero .b2{top:-40px;left:-60px;width:300px;height:300px;background:radial-gradient(circle,var(--accent),transparent 65%);animation:float2 20s ease-in-out infinite}
  @keyframes float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(4%,-6%) scale(1.12)}}
  @keyframes float2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-5%,5%) scale(1.08)}}
  .brand{display:flex;align-items:center;gap:12px;position:relative}
  .logo{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:14px;
    background:linear-gradient(135deg,var(--accent),var(--accent2),var(--accent3));
    box-shadow:0 8px 24px -8px rgba(109,40,237,.6);font-family:"Space Grotesk";font-weight:700;font-size:22px;color:#fff}
  .brand h1{font-size:26px;font-weight:700}
  .grad{background:linear-gradient(120deg,var(--accent),var(--accent2) 55%,var(--accent3));-webkit-background-clip:text;background-clip:text;color:transparent}
  .hero p{color:var(--muted);margin-top:6px;position:relative}
  .badge{display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:6px 14px;border-radius:999px;
    border:1px solid var(--border);background:var(--surface);font-size:13px;font-weight:600;color:var(--muted);position:relative}
  .badge .dot{width:7px;height:7px;border-radius:999px;background:var(--success);animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}

  /* Accuracy + ring */
  .top{display:grid;grid-template-columns:1fr;gap:24px;margin-bottom:28px}
  .ring-card{display:flex;align-items:center;gap:28px;flex-wrap:wrap}
  .ring{position:relative;width:180px;height:180px;flex:none}
  .ring svg{transform:rotate(-90deg)}
  .ring .label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .ring .num{font-family:"Space Grotesk";font-size:42px;font-weight:700;line-height:1}
  .ring .sub{font-size:12px;font-weight:600;color:var(--muted);margin-top:4px}
  .ring-meta{flex:1;min-width:220px}
  .ring-meta h2{font-size:22px;margin-bottom:6px}
  .ring-meta .muted{color:var(--muted);font-size:14px}
  .kv{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:16px}
  .kv div{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:10px 14px}
  .kv dt{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
  .kv dd{font-family:"Space Grotesk";font-size:18px;font-weight:700;margin-top:2px}

  /* Summary grid */
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-bottom:28px}
  .stat{position:relative;overflow:hidden;border-radius:20px;padding:22px 20px;border:1px solid var(--border);background:var(--surface)}
  .stat .glow{position:absolute;right:-16px;top:-16px;width:70px;height:70px;border-radius:999px;filter:blur(22px);opacity:.18}
  .stat .lbl{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
  .stat .val{font-family:"Space Grotesk";font-size:30px;font-weight:700;margin-top:6px;line-height:1.1}
  .stat.a .glow{background:var(--accent)} .stat.a .val{color:var(--accent)}
  .stat.b .glow{background:var(--warn)} .stat.b .val{color:var(--warn)}
  .stat.c .glow{background:var(--success)} .stat.c .val{color:var(--success)}
  .stat.d .glow{background:var(--error)} .stat.d .val{color:var(--error)}
  .stat.e .glow{background:var(--accent2)} .stat.e .val{color:var(--accent2)}
  .stat.f .glow{background:var(--accent3)} .stat.f .val{color:var(--accent3);font-size:22px}

  /* Section */
  .section{margin-bottom:28px}
  .section h2{font-size:20px;margin-bottom:18px;display:flex;align-items:center;gap:10px}
  .section h2 .ico{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:10px}
  .ico.purple{background:rgba(109,40,237,.14);color:var(--accent)}
  .ico.red{background:rgba(220,38,38,.14);color:var(--error)}
  .ico.blue{background:rgba(37,99,235,.14);color:var(--accent3)}

  /* Bars */
  .row{padding:14px 16px;border:1px solid var(--border);border-radius:16px;background:var(--surface);margin-bottom:10px}
  .row .head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px}
  .row .name{font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .row .pills{display:flex;gap:6px;flex:none;font-size:12px;font-weight:700}
  .pill{padding:2px 8px;border-radius:999px}
  .pill.ok{background:rgba(22,163,74,.15);color:var(--success)}
  .pill.no{background:rgba(220,38,38,.15);color:var(--error)}
  .pill.mute{background:var(--border);color:var(--muted)}
  .track{height:8px;border-radius:999px;background:var(--border);overflow:hidden}
  .track .fill{height:100%;border-radius:999px;width:0;transition:width 1s cubic-bezier(.22,1,.36,1)}
  .fill.grad1{background:linear-gradient(90deg,var(--accent),var(--accent2))}
  .fill.grad2{background:linear-gradient(90deg,var(--accent2),var(--error))}
  .fill.grad3{background:linear-gradient(90deg,var(--accent3),var(--accent))}

  /* Decks table-ish */
  .deckrow{display:grid;grid-template-columns:1.6fr .8fr .8fr;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid var(--border)}
  .deckrow:last-child{border-bottom:0}
  .deckrow .dn{font-weight:600}
  .deckrow .dm{font-size:12px;color:var(--muted);margin-top:2px}
  .deckrow .dbars{display:flex;flex-direction:column;gap:6px;min-width:0}
  .mini-track{height:6px;border-radius:999px;background:var(--border);overflow:hidden}
  .mini-fill{height:100%;border-radius:999px;width:0;transition:width 1s cubic-bezier(.22,1,.36,1)}
  @media(max-width:640px){
    .deckrow{grid-template-columns:1fr;gap:8px}
    .ring-card{gap:18px}
    .ring{width:140px;height:140px}
    .ring .num{font-size:34px}
  }

  .empty{text-align:center;padding:40px 20px;color:var(--muted)}
  .empty .big{font-size:40px;display:block;margin-bottom:8px}
  details{margin-top:10px}
  details summary{cursor:pointer;font-weight:600;color:var(--accent);padding:8px 0}
  details summary:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:6px}
  table{width:100%;border-collapse:collapse;font-size:14px}
  th{text-align:left;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;padding:8px 10px}
  td{padding:8px 10px;border-top:1px solid var(--border)}
  td.num{text-align:center;font-variant-numeric:tabular-nums}
  .tc{max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

  .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
  .reveal.in{opacity:1;transform:none}
  footer{text-align:center;color:var(--muted);font-size:13px;margin-top:32px}
  footer .grad{font-weight:700}
  @media print{
    body{background:#fff;padding:0}
    .reveal{opacity:1!important;transform:none!important}
    .card,.stat,.row{break-inside:avoid;box-shadow:none}
    .blob{display:none}
  }
  @media(prefers-reduced-motion:reduce){
    *{animation:none!important;transition:none!important}
    .reveal{opacity:1!important;transform:none!important}
  }
</style>
</head>
<body>
<div class="wrap">

  <!-- Hero -->
  <div class="card hero reveal">
    <span class="blob b1"></span><span class="blob b2"></span>
    <div class="brand">
      <div class="logo">Q</div>
      <h1>Quiz<span class="grad">Me</span></h1>
    </div>
    <p>Dashboard dei tuoi progressi di studio</p>
    <span class="badge"><span class="dot"></span>Aggiornato ${esc(now)}</span>
  </div>

  <!-- Accuracy ring + key facts -->
  <div class="card section reveal" style="margin-bottom:28px">
    <div class="ring-card">
      <div class="ring">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="var(--accent)"/>
              <stop offset=".5" stop-color="var(--accent2)"/>
              <stop offset="1" stop-color="var(--accent3)"/>
            </linearGradient>
          </defs>
          <circle cx="90" cy="90" r="78" fill="none" stroke="var(--border)" stroke-width="14"/>
          <circle id="ringFill" cx="90" cy="90" r="78" fill="none" stroke="url(#g)" stroke-width="14"
            stroke-linecap="round" stroke-dasharray="490" stroke-dashoffset="490"
            style="filter:drop-shadow(0 0 8px rgba(109,40,237,.4));transition:stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)"/>
        </svg>
        <div class="label">
          <div class="num" id="ringNum">0%</div>
          <div class="sub">accuratezza</div>
        </div>
      </div>
      <div class="ring-meta">
        <h2>${totalAttempts > 0 ? "Stai andando alla grande" : "Inizia ad allenarti"}</h2>
        <p class="muted">${totalAttempts > 0
          ? `Hai risposto a <strong>${totalAttempts}</strong> domande in <strong>${stats.completed}</strong> sessioni.`
          : "Completa qualche quiz per popolare la dashboard con le tue statistiche."}</p>
        <dl class="kv">
          <div><dt>Sessioni</dt><dd>${stats.completed}</dd></div>
          <div><dt>Tempo medio</dt><dd>${avgTime}</dd></div>
          <div><dt>Miglior %</dt><dd>${bestPct}</dd></div>
          <div><dt>Miglior punteggio</dt><dd>${bestStr}</dd></div>
        </dl>
      </div>
    </div>
  </div>

  <!-- Summary grid -->
  <div class="grid reveal">
    ${summaryCards
      .filter((c) => !c.hide)
      .map(
        (c) => `<div class="stat ${c.accent}">
        <span class="glow"></span>
        <div class="lbl">${esc(c.label)}</div>
        <div class="val" ${c.static ? "" : `data-count="${c.value}"`}>${esc(c.raw)}</div>
      </div>`,
      )
      .join("\n    ")}
  </div>

  <!-- Decks -->
  <div class="card section reveal">
    <h2><span class="ico purple">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    </span>Mazzi</h2>
    ${
      deckStats.length === 0
        ? `<div class="empty"><span class="big">📚</span>Nessun mazzo presente.</div>`
        : deckStats
            .map(
              (d) => `<div class="deckrow">
        <div>
          <div class="dn">${esc(d.name)}</div>
          <div class="dm">${d.total} domande · ${d.attempts} tentativi · ${d.pct.toFixed(0)}% successo</div>
        </div>
        <div class="dbars">
          <div class="mini-track"><div class="mini-fill" data-w="${(d.correct / Math.max(1, d.attempts)) * 100}" style="background:linear-gradient(90deg,var(--success),#22c55e)"></div></div>
          <div class="mini-track"><div class="mini-fill" data-w="${(d.wrong / Math.max(1, d.attempts)) * 100}" style="background:linear-gradient(90deg,var(--accent2),var(--error))"></div></div>
        </div>
        <div style="text-align:right">
          <span class="pill ok">${d.correct}</span>
          <span class="pill no">${d.wrong}</span>
        </div>
      </div>`,
            )
            .join("")
    }
  </div>

  <!-- Top wrong -->
  <div class="card section reveal">
    <h2><span class="ico red">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
    </span>Top 10 domande più sbagliate</h2>
    ${
      topWrong.length === 0
        ? `<div class="empty"><span class="big">🎉</span>Non hai ancora sbagliato domande. Ottimo lavoro!</div>`
        : topWrong
            .map((s, i) => {
              const rate = s.attempts > 0 ? (s.correct / s.attempts) * 100 : 0;
              const w = (s.wrong / maxWrong) * 100;
              return `<div class="row">
          <div class="head">
            <span class="name"><span style="color:var(--muted);margin-right:6px">${i + 1}.</span>${esc(s.q)}</span>
            <span class="pills">
              <span class="pill no">${s.wrong} errori</span>
              <span class="pill mute">${rate.toFixed(0)}% ok</span>
            </span>
          </div>
          <div class="track"><div class="fill grad2" data-w="${w}"></div></div>
        </div>`;
            })
            .join("")
    }
  </div>

  <!-- Per-question details -->
  <div class="card section reveal">
    <details>
      <summary>Statistiche complete per domanda (${questionStats.length})</summary>
      ${
        questionStats.length === 0
          ? `<div class="empty" style="padding:20px">Nessuna statistica.</div>`
          : `<table>
          <thead><tr><th>Domanda</th><th style="text-align:center">Tentativi</th><th style="text-align:center">Corrette</th><th style="text-align:center">Errori</th><th style="text-align:center">Successo</th></tr></thead>
          <tbody>
            ${questionStats
              .map((s) => {
                const rate = s.attempts > 0 ? fmtPct((s.correct / s.attempts) * 100) : "—";
                return `<tr>
                <td class="tc" title="${esc(s.q)}">${esc(s.q)}</td>
                <td class="num">${s.attempts}</td>
                <td class="num" style="color:var(--success);font-weight:600">${s.correct}</td>
                <td class="num" style="color:var(--error);font-weight:600">${s.wrong}</td>
                <td class="num">${rate}</td>
              </tr>`;
              })
              .join("")}
          </tbody>
        </table>`
      }
    </details>
  </div>

  <footer>Generato da <span class="grad">QuizMe</span> · impara ripetendo</footer>
</div>

<script>
(function(){
  var DATA = ${js(data)};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ease(t){return 1-Math.pow(1-t,3)}

  function animateCount(el, to, suffix, isFloat){
    if(reduce){ el.textContent = (isFloat?to.toFixed(1):Math.round(to)) + (suffix||""); return; }
    var start=null,dur=1200;
    function step(ts){
      if(!start) start=ts;
      var p=Math.min((ts-start)/dur,1);
      var v=to*ease(p);
      el.textContent=(isFloat?v.toFixed(1):Math.round(v))+(suffix||"");
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateRing(){
    var R=490, val=DATA.accuracy;
    var fill=document.getElementById("ringFill");
    var numEl=document.getElementById("ringNum");
    if(fill){ fill.setAttribute("stroke-dashoffset", R - (val/100)*R); }
    if(!numEl) return;
    if(reduce){ numEl.textContent=Math.round(val)+"%"; return; }
    var start=null,dur=1300;
    function step(ts){
      if(!start) start=ts;
      var p=Math.min((ts-start)/dur,1);
      numEl.textContent=(val*ease(p)).toFixed(0)+"%";
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function run(){
    document.querySelectorAll(".stat .val[data-count]").forEach(function(el){
      var to=parseFloat(el.getAttribute("data-count"));
      var isFloat = (to % 1) !== 0;
      animateCount(el, to, "", isFloat);
    });
    animateRing();
    document.querySelectorAll("[data-w]").forEach(function(el){
      var w=parseFloat(el.getAttribute("data-w"))||0;
      if(reduce){ el.style.width=w+"%"; }
      else { setTimeout(function(){ el.style.width=w+"%"; }, 100); }
    });
  }

  // Reveal on scroll
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add("in");
        if(e.target.querySelector && e.target.querySelector("[data-count],[data-w],#ringFill")){
          setTimeout(run, 60);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

  // Fallback: run animations shortly after load regardless
  window.addEventListener("load", function(){ setTimeout(run, 250); });
})();
</script>
</body>
</html>`;
}
