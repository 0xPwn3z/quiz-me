import type { GlobalStats, QuestionStats, StoredDeck } from "../types";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fmtPct(n: number): string {
  return n.toFixed(1) + "%";
}

function fmtMs(ms: number): string {
  const t = Math.floor(ms / 1000);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

export function generateProgressHtml(
  decks: StoredDeck[],
  stats: GlobalStats,
  questionStats: QuestionStats[],
): string {
  const totalAttempts = questionStats.reduce((s, qs) => s + qs.attempts, 0);
  const totalCorrect = questionStats.reduce((s, qs) => s + qs.correct, 0);
  const accuracy = totalAttempts
    ? fmtPct((totalCorrect / totalAttempts) * 100)
    : "—";
  const avgScore = stats.completed
    ? (stats.totalCorrect / stats.completed).toFixed(1)
    : "—";
  const avgTime = stats.completed ? fmtMs(stats.totalTimeMs / stats.completed) : "—";
  const bestStr = stats.completed
    ? `${stats.bestScore} / ${stats.bestTotal || "?"}`
    : "—";
  const topWrong = questionStats
    .filter((s) => s.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 10);

  const now = new Date().toLocaleString("it-IT");

  function summaryCard(label: string, value: string, bgLight: string, txtLight: string, bgDark: string, txtDark: string) {
    const cls = "sc" + label.replace(/[^a-zA-Z0-9]/g, "");
    return `<div style="border-radius:14px;padding:24px 20px;text-align:center;background:${bgLight};
      border:1px solid rgba(0,0,0,0.04)" class="${cls}">
      <style>.${cls}{background:${bgLight};color:${txtLight}}@media(prefers-color-scheme:dark){.${cls}{background:${bgDark}!important;color:${txtDark}!important}}</style>
      <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;font-weight:700;margin-bottom:8px">${esc(label)}</div>
      <div style="font-size:2rem;font-weight:800;line-height:1.15">${esc(value)}</div>
    </div>`;
  }

  function deckRow(d: StoredDeck): string {
    const deckStats = questionStats.filter((qs) => qs.deckId === d.id);
    const da = deckStats.reduce((s, qs) => s + qs.attempts, 0);
    const dc = deckStats.reduce((s, qs) => s + qs.correct, 0);
    const dw = deckStats.reduce((s, qs) => s + qs.wrong, 0);
    const dp = da > 0 ? fmtPct((dc / da) * 100) : "—";
    return `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;font-weight:600">${esc(d.name)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;text-align:center">${d.questions.length}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;text-align:center">${da}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;text-align:center">${dc}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;text-align:center">${dw}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;text-align:center">${dp}</td>
    </tr>`;
  }

  function topWrongRow(s: QuestionStats, i: number): string {
    const rate = s.attempts > 0 ? fmtPct((s.correct / s.attempts) * 100) : "—";
    return `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(s.q)}">${i + 1}.</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(s.q)}">${esc(s.q)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;text-align:center;color:#dc2626;font-weight:700">${s.wrong}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e2e4ea;text-align:center">${rate}</td>
    </tr>`;
  }

  function allStatsRow(s: QuestionStats): string {
    const rate = s.attempts > 0 ? fmtPct((s.correct / s.attempts) * 100) : "—";
    return `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e4ea;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(s.q)}">${esc(s.q)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e4ea;text-align:center">${s.attempts}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e4ea;text-align:center;color:#16a34a;font-weight:600">${s.correct}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e4ea;text-align:center;color:#dc2626;font-weight:600">${s.wrong}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e4ea;text-align:center">${rate}</td>
    </tr>`;
  }

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QuizMe — Progressi</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
    line-height:1.55;background:#f6f7f9;color:#111318;padding:24px}
  @media(prefers-color-scheme:dark){
    body{background:#0b0d12;color:#f2f3f7}
    table{--border:#2b2f3b}
    th{background:#151821}
  }
  :root{--border:#e2e4ea}
  .card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:24px}
  @media(prefers-color-scheme:dark){.card{background:#151821}}
  h1{font-size:1.5rem;font-weight:800;letter-spacing:-0.03em}
  .sub{color:#5d6370;font-size:0.9rem;margin-top:4px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px}
  table{width:100%;border-collapse:collapse;font-size:0.95rem}
  th{background:#f6f7f9;padding:10px 14px;text-align:left;font-size:0.8rem;color:#5d6370;font-weight:600}
  @media(prefers-color-scheme:dark){th{background:#0b0d12}}
  td{padding:10px 14px;border-bottom:1px solid var(--border)}
  .section-title{font-size:1.1rem;font-weight:700;margin-bottom:16px}
  .tag{display:inline-block;background:#e2e4ea;border-radius:6px;padding:2px 8px;font-size:0.75rem;font-weight:600}
  @media(prefers-color-scheme:dark){.tag{background:#2b2f3b}}
  .details-summary{cursor:pointer;font-weight:600;color:#4f46e5;margin-bottom:12px}
  .details-summary:focus-visible{outline:3px solid #f59e0b;outline-offset:2px}
  @media print{body{background:#fff;padding:0}.card{break-inside:avoid;border:1px solid #ddd}}
</style>
</head>
<body>
<div class="card">
  <h1>QuizMe</h1>
  <p class="sub">Report progressi — ${esc(now)}</p>
</div>

<div class="grid">
  ${summaryCard("Quiz completati", String(stats.completed), "#eef2ff", "#4338ca", "#1e1b4b", "#a5b4fc")}
  ${summaryCard("Domande totali", String(totalAttempts), "#fefce8", "#a16207", "#422006", "#fde047")}
  ${summaryCard("Accuracy", accuracy, "#f0fdf4", "#16a34a", "#052e16", "#86efac")}
  ${summaryCard("Media punteggi", avgScore, "#fef2f2", "#dc2626", "#450a0a", "#fca5a5")}
  ${summaryCard("Miglior punteggio", bestStr, "#f5f3ff", "#7c3aed", "#2e1065", "#c4b5fd")}
  ${summaryCard("Tempo medio", avgTime, "#fff7ed", "#ea580c", "#431407", "#fdba74")}
</div>

<div class="card">
  <h2 class="section-title">Mazzi</h2>
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th style="text-align:center">Domande</th>
        <th style="text-align:center">Tentativi</th>
        <th style="text-align:center">Corrette</th>
        <th style="text-align:center">Errori</th>
        <th style="text-align:center">Successo</th>
      </tr>
    </thead>
    <tbody>
      ${decks.length ? decks.map(deckRow).join("") : '<tr><td colspan="6" style="text-align:center;padding:32px;color:#5d6370">Nessun mazzo presente.</td></tr>'}
    </tbody>
  </table>
</div>

<div class="card">
  <h2 class="section-title">Top 10 domande più sbagliate</h2>
  ${topWrong.length
    ? `<table>
        <thead><tr><th>#</th><th>Domanda</th><th style="text-align:center">Errori</th><th style="text-align:center">Successo</th></tr></thead>
        <tbody>${topWrong.map((s, i) => topWrongRow(s, i)).join("")}</tbody>
      </table>`
    : '<p style="text-align:center;padding:32px;color:#5d6370">Non hai ancora sbagliato domande. Ottimo lavoro!</p>'}
</div>

<div class="card">
  <details>
    <summary class="details-summary">Statistiche complete per domanda (${questionStats.length})</summary>
    ${questionStats.length
      ? `<table>
          <thead><tr><th>Domanda</th><th style="text-align:center">Tentativi</th><th style="text-align:center">Corrette</th><th style="text-align:center">Errori</th><th style="text-align:center">Successo</th></tr></thead>
          <tbody>${questionStats.map(allStatsRow).join("")}</tbody>
        </table>`
      : '<p style="text-align:center;padding:16px;color:#5d6370">Nessuna statistica.</p>'}
  </details>
</div>

<p style="text-align:center;color:#5d6370;font-size:0.85rem;margin-top:16px">Generato da QuizMe</p>
</body>
</html>`;
}
