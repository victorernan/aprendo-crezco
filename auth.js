import { auth }                                                       from './firebase.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged,
         signOut as fbSignOut }                                        from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { loadProfile, blankProfile, saveProfile }                     from './db.js';
import { show, goHome, todayStr, checkNewDay }                        from './app.js';

let _currentUser = null;

export function getCurrentUser() { return _currentUser; }

export async function signInGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch(e) {
    alert('Error al iniciar sesión: ' + e.message);
  }
}

export async function signOut() {
  if (!confirm('¿Cerrar sesión?')) return;
  await fbSignOut(auth);
}

// Called once from app.js to wire up the auth listener
export function initAuth(onReady) {
  onAuthStateChanged(auth, async (user) => {
    _currentUser = user;
    if (!user) { show('login'); return; }

    show('loading');
    document.getElementById('loading-msg').textContent = 'Cargando progreso...';

    const profile = await loadProfile();
    onReady(user, profile);
  });
}
