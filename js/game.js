import { D, LN, SL, PASS_ACC, ERR_REPEAT, show, goHome, todayStr, fmtMs, checkNewDay } from './app.js';
import { saveProfile, patchProfile }  from './db.js';
import { MATH_GENERATORS, sh }        from './questions/math.js';
import { READ_GENERATORS }            from './questions/read.js';

// ── SESSION STATE ─────────────────────────────────────────────
let GS     = {};
let _timer = null;

// ── QUESTION BUILDER ──────────────────────────────────────────
function genLevel(subj, lvl) {
  const g = { math: MATH_GENERATORS, read: READ_GENERATORS };
  return g[subj][Math.min(lvl, g[subj].length-1)]();
}

function buildSessionQuestions(subj, lvl) {
  const fresh  = genLevel(subj, lvl);
  const key    = `${subj}-${lvl}`;
  const failed = (D.failedQuestions || {})[key] || [];
  const retries = failed.map(q => Object.assign({}, q, { opts: sh(q.opts), _retry: true }));
  return [...fresh, ...retries];
}

// ── START SESSION ─────────────────────────────────────────────
export async function startSession(subj) {
  const lvl = D.levels[subj] || 0;
  let questions, qi, correct, errors, totalAnswered, retryCount, t0;

  if (D.currentSession && D.currentSession.subj === subj && D.currentSession.lvl === lvl) {
    const cs  = D.currentSession;
    questions     = cs.questions;
    qi            = cs.qi;
    correct       = cs.correct;
    errors        = cs.errors;
    totalAnswered = cs.totalAnswered;
    retryCount    = cs.retryCount;
    t0            = Date.now() - cs.elapsedMs;
  } else {
    questions     = buildSessionQuestions(subj, lvl);
    qi            = 0; correct = 0; errors = 0; totalAnswered = 0; retryCount = 0;
    t0            = Date.now();
  }

  GS = { subj, lvl, questions, qi, correct, errors, totalAnswered, retryCount, answered: false, t0 };

  document.getElementById('g-subj').textContent = SL[subj];
  document.getElementById('g-lvl').textContent  = `Nivel ${lvl+1} — ${LN[subj][Math.min(lvl, LN[subj].length-1)]}`;

  clearInterval(_timer);
  _timer = setInterval(() => {
    const s = Math.floor((Date.now()-GS.t0)/1000);
    document.getElementById('g-timer').textContent = `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
    if (s > 0 && s % 30 === 0) saveCurrentSession();
  }, 1000);

  show('game');
  renderQ();
}

// ── AUTO-SAVE MID-SESSION ─────────────────────────────────────
async function saveCurrentSession() {
  if (!GS.subj) return;
  const cs = {
    subj: GS.subj, lvl: GS.lvl, questions: GS.questions, qi: GS.qi,
    correct: GS.correct, errors: GS.errors,
    totalAnswered: GS.totalAnswered, retryCount: GS.retryCount,
    elapsedMs: Date.now() - GS.t0, savedAt: new Date().toISOString()
  };
  await patchProfile(D, { currentSession: cs });
}

// ── RENDER QUESTION ───────────────────────────────────────────
function renderQ() {
  const q = GS.questions[GS.qi], total = GS.questions.length;
  GS.answered = false;

  const retryTag = q._retry
    ? ' <span style="color:var(--amber);font-size:10px;font-weight:700;background:var(--amber-l);padding:1px 6px;border-radius:4px;border:1px solid #E8C97A">REPASO</span>'
    : '';
  document.getElementById('q-num').innerHTML  = `Pregunta ${GS.qi+1} de ${total}${retryTag}`;
  document.getElementById('g-prog').style.width = Math.round(GS.qi/total*100) + '%';
  document.getElementById('q-fb').style.display  = 'none';
  document.getElementById('next-btn').style.display = 'none';

  let body = '';
  if (q.type === 'count') {
    body = `<div class="q-text">${q.q}</div><div class="q-count-area">${q.pic.join(' ')}</div>`;
  } else if (q.type === 'calc') {
    body = `<div class="q-big">${q.q}</div>`;
  } else {
    body = `<div class="q-text">${q.q}</div>`;
    if (q.hint) body += `<div class="q-hint">${q.hint}</div>`;
  }
  document.getElementById('q-body').innerHTML = body;

  const el = document.getElementById('q-opts'); el.innerHTML = '';
  q.opts.forEach(o => {
    const b = document.createElement('button'); b.className = 'opt'; b.textContent = String(o);
    b.onclick = () => checkAns(b, String(o), String(q.answer));
    el.appendChild(b);
  });
}

// ── CHECK ANSWER ──────────────────────────────────────────────
function checkAns(btn, chosen, correct) {
  if (GS.answered) return;
  GS.answered = true;
  GS.totalAnswered++;
  document.querySelectorAll('.opt').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.className = 'opt correct';
  });

  const fb = document.getElementById('q-fb');
  if (chosen === correct) {
    GS.correct++; btn.className = 'opt correct';
    fb.innerHTML = '<div class="feedback-row ok">✓ Correcto</div>';
  } else {
    GS.errors++; btn.className = 'opt wrong';
    const fq = GS.questions[GS.qi];
    GS.questions.push(Object.assign({}, fq, { opts: sh(fq.opts), _retry: true }));
    GS.retryCount++;
    const key = `${GS.subj}-${GS.lvl}`;
    D.failedQuestions = D.failedQuestions || {};
    D.failedQuestions[key] = D.failedQuestions[key] || [];
    if (!D.failedQuestions[key].some(q => q.q === fq.q)) D.failedQuestions[key].push(fq);
    fb.innerHTML = `<div class="feedback-row fail">✗ Incorrecto — respuesta: <strong>${correct}</strong> · Volverá al final</div>`;
  }

  fb.style.display = 'block';
  const nb = document.getElementById('next-btn'); nb.style.display = 'block';
  nb.textContent = GS.qi < GS.questions.length-1 ? 'Siguiente' : 'Ver resultado';
}

// ── NEXT QUESTION ─────────────────────────────────────────────
export function nextQ() {
  if (GS.qi < GS.questions.length-1) { GS.qi++; renderQ(); }
  else finishSession();
}

// ── EXIT MID-SESSION ──────────────────────────────────────────
export async function confirmExit() {
  if (confirm('¿Salir? Se guardará tu progreso hasta aquí.')) {
    clearInterval(_timer);
    await saveCurrentSession();
    goHome();
  }
}

// ── FINISH SESSION ────────────────────────────────────────────
async function finishSession() {
  clearInterval(_timer);
  const timeMs  = Date.now() - GS.t0;
  const total   = GS.totalAnswered;
  const correct = GS.correct, errors = GS.errors;
  const acc     = correct / total, errRate = errors / total;
  const passed  = acc >= PASS_ACC;
  const avgSec  = (timeMs / total / 1000).toFixed(1);

  const key = `${GS.subj}-${GS.lvl}`;
  if (passed) { D.failedQuestions = D.failedQuestions || {}; delete D.failedQuestions[key]; }

  D.history = D.history || [];
  D.history.push({ date: todayStr(), subject: GS.subj, level: GS.lvl, correct, total, timeMs, passed });
  if (D.history.length > 60) D.history = D.history.slice(-60);

  if (passed) {
    const maxLvl = LN[GS.subj].length - 1;
    if (GS.lvl < maxLvl) D.levels[GS.subj] = GS.lvl + 1;
    D.attempts[GS.subj] = 0;
    D.todayDone    = true;
    D.lastDoneDate = todayStr();
  } else {
    D.attempts[GS.subj] = (D.attempts[GS.subj] || 0) + 1;
  }

  D.currentSession = null;
  await saveProfile(D);

  // Render results screen
  const accPct = Math.round(acc * 100);
  document.getElementById('r-icon').textContent = passed ? '✓' : '✗';
  document.getElementById('r-icon').style.color = passed ? 'var(--green)' : 'var(--red)';
  document.getElementById('r-title').textContent = passed ? 'Nivel superado' : 'Repetir nivel';
  document.getElementById('r-sub').textContent   = `${accPct}% de precisión · ${fmtMs(timeMs)}`;
  document.getElementById('r-cor').textContent   = correct;
  document.getElementById('r-err').textContent   = errors;
  document.getElementById('r-time').textContent  = fmtMs(timeMs);
  document.getElementById('r-spd').textContent   = avgSec + 's';
  document.getElementById('rs-cor').className = acc>=0.9?'res-stat good':acc>=0.8?'res-stat warn':'res-stat bad';
  document.getElementById('rs-err').className = errRate===0?'res-stat good':errRate<=ERR_REPEAT?'res-stat warn':'res-stat bad';
  document.getElementById('rs-spd').className = parseFloat(avgSec)<12?'res-stat good':'res-stat warn';

  const vd = document.getElementById('r-verdict');
  if (passed) {
    vd.className = 'verdict pass';
    document.getElementById('rv-title').textContent = 'Dominio alcanzado — nivel superado';
    const nxt = Math.min(GS.lvl+1, LN[GS.subj].length-1);
    document.getElementById('rv-sub').textContent = `Próximo: Nivel ${nxt+1} — ${LN[GS.subj][nxt]}`;
  } else {
    vd.className = 'verdict repeat';
    document.getElementById('rv-title').textContent = errRate > ERR_REPEAT
      ? `${Math.round(errRate*100)}% de errores — nivel bloqueado`
      : `Precisión ${accPct}% — se requiere ${Math.round(PASS_ACC*100)}%`;
    document.getElementById('rv-sub').textContent = `Intento ${D.attempts[GS.subj]} · Se requiere 80% para avanzar`;
  }

  const ab = document.getElementById('r-act-btn');
  if (passed) { ab.textContent = 'Siguiente nivel →'; ab.className = 'btn success'; }
  else        { ab.textContent = 'Repetir nivel ↺';  ab.className = 'btn danger';  }

  show('results');
}

// Called from results screen button
export function doResultAction() { startSession(GS.subj); }

// Expose current subject for result action
export function getCurrentSubj() { return GS.subj; }
