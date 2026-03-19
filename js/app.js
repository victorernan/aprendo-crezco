// ── SHARED STATE ─────────────────────────────────────────────
export let D = null;
export function setD(profile) { D = profile; }

// ── CONSTANTS ─────────────────────────────────────────────────
export const PASS_ACC   = 0.80;
export const ERR_REPEAT = 0.20;

export const LN = {
  math: [
    'Números hasta 100','Decenas y unidades','Comparar números',
    'Sumas sin llevar','Sumas con llevada',
    'Restas sin llevar','Restas con préstamo',
    'Tablas del 2 y del 5','Tabla del 10','División básica',
    'Longitud y peso','Tiempo y dinero',
    'Problemas con sumas','Problemas con restas',
    'Figuras geométricas','Secuencias y patrones'
  ],
  read: [
    'Vocales','Sílabas','Palabras','Completar frases','Comprensión',
    'Sinónimos','Antónimos','Identificar sílabas','Lectura y preguntas','Vocabulario'
  ]
};
export const SL = { math: 'Matemáticas', read: 'Lectura' };

// ── SCREENS ───────────────────────────────────────────────────
export function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}
export function goHome() { updateHome(); show('home'); }

// ── SYNC STATUS ───────────────────────────────────────────────
export function setSyncStatus(status, msg) {
  const dot = document.getElementById('sync-dot');
  const txt = document.getElementById('sync-msg');
  if (!dot) return;
  dot.className = 'sync-dot' + (status === 'syncing' ? ' syncing' : status === 'offline' ? ' offline' : '');
  txt.textContent = msg;
}

// ── DATE UTILS ────────────────────────────────────────────────
export function todayStr() { return new Date().toISOString().slice(0, 10); }

export function fmtDate(ds) {
  const dn = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const mn = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const d  = new Date(ds + 'T12:00:00');
  return `${dn[d.getDay()]} ${d.getDate()} ${mn[d.getMonth()]}`;
}

export function fmtMs(ms) {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
}

export function checkNewDay() {
  const today = todayStr();
  if (D.lastOpenDate !== today) {
    if (D.lastOpenDate) {
      const diff = Math.round(
        (new Date(today+'T12:00:00') - new Date(D.lastOpenDate+'T12:00:00')) / 86400000
      );
      if (diff === 1 && D.todayDone) D.streak = (D.streak || 0) + 1;
      else if (diff > 1) D.streak = 0;
    } else {
      D.streak = 0;
    }
    D.todayDone    = false;
    D.lastOpenDate = today;
  }
}

// ── HOME ──────────────────────────────────────────────────────
export function updateHome() {
  checkNewDay();
  const today = todayStr(), hist = D.history || [];

  document.getElementById('h-name').textContent    = D.name;
  document.getElementById('h-date').textContent    = fmtDate(today);
  document.getElementById('h-streak').textContent  = `${D.streak} día${D.streak!==1?'s':''} seguidos`;
  document.getElementById('h-sessions').textContent = hist.length;

  if (hist.length) {
    const avgA = Math.round(hist.reduce((a,h) => a + h.correct/h.total, 0) / hist.length * 100);
    const avgS = (hist.reduce((a,h) => a + h.timeMs/h.total, 0) / hist.length / 1000).toFixed(1);
    document.getElementById('h-acc').textContent = avgA + '%';
    document.getElementById('h-spd').textContent = avgS + 's';
  } else {
    document.getElementById('h-acc').textContent = '—';
    document.getElementById('h-spd').textContent = '—';
  }

  // 7-day bar
  const bar = document.getElementById('day-bar');
  const lbl = document.getElementById('day-labels');
  bar.innerHTML = ''; lbl.innerHTML = '';
  const sd = ['D','L','M','X','J','V','S'];
  for (let i = 6; i >= 0; i--) {
    const d  = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0,10);
    const isToday = ds === today;
    const done = isToday ? D.todayDone : hist.some(h => h.date === ds && h.passed);
    const dot  = document.createElement('div');
    dot.className = 'day-dot' + (isToday
      ? (D.todayDone ? ' today-done' : ' today-pending')
      : (done ? ' done' : ''));
    bar.appendChild(dot);
    const sp = document.createElement('span'); sp.textContent = sd[d.getDay()]; lbl.appendChild(sp);
  }

  // Banner
  const bn = document.getElementById('h-banner');
  if (D.currentSession) {
    bn.className = 'session-banner pending';
    const cs = D.currentSession;
    document.getElementById('h-banner-title').textContent = 'Sesión en curso — retomar';
    document.getElementById('h-banner-sub').textContent   =
      `${SL[cs.subj]} · Nivel ${cs.lvl+1} · Pregunta ${cs.qi+1}/${cs.questions.length}`;
  } else if (D.todayDone) {
    bn.className = 'session-banner done';
    document.getElementById('h-banner-title').textContent = 'Sesión de hoy completada';
    document.getElementById('h-banner-sub').textContent   = `Racha: ${D.streak} día${D.streak!==1?'s':''}`;
  } else {
    bn.className = 'session-banner pending';
    document.getElementById('h-banner-title').textContent = 'Sesión pendiente';
    document.getElementById('h-banner-sub').textContent   = 'Completa tu práctica de hoy';
  }

  // Subject button
  const s   = D.subject, lvl = D.levels[s]||0, names = LN[s], att = D.attempts[s]||0;
  const pct = Math.round(lvl / names.length * 100);
  const resumeLabel = D.currentSession && D.currentSession.subj === s ? ' · Reanudar' : '';
  document.getElementById('subj-area').innerHTML = `
    <button class="subj-btn" id="btn-start-subj">
      <div class="sb-left">
        <div style="font-size:26px">${s==='math'?'🔢':'📖'}</div>
        <div>
          <span class="sb-name">${SL[s]}</span>
          <span class="sb-level">Nivel ${lvl+1} — ${names[Math.min(lvl,names.length-1)]}${att>0?' · Intento '+att:''}${resumeLabel}</span>
          <div class="lvl-bar"><div class="lvl-fill" style="width:${pct}%"></div></div>
        </div>
      </div>
      <span class="sb-arrow">›</span>
    </button>`;
}

// ── HISTORY ───────────────────────────────────────────────────
export function showHistory() {
  const hist = [...(D.history||[])].reverse();
  const el   = document.getElementById('hist-list');
  el.innerHTML = hist.length
    ? hist.map(h => {
        const acc = Math.round(h.correct/h.total*100);
        const cls = acc >= 80 ? 'hr-acc-good' : 'hr-acc-bad';
        return `<div class="history-row">
          <div>
            <div style="font-weight:700">${SL[h.subject]} — Nv.${h.level+1}${h.passed?' ✓':' ✗'}</div>
            <div class="hr-date">${fmtDate(h.date)}</div>
          </div>
          <div class="hr-stats">
            <span class="${cls}">${acc}%</span>
            <span class="hr-time">${fmtMs(h.timeMs)}</span>
          </div>
        </div>`;
      }).join('')
    : '<p style="text-align:center;padding:20px;color:var(--muted)">Sin sesiones aún</p>';
  show('history');
}
