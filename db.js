import { db }                                        from './firebase.js';
import { doc, getDoc, setDoc, updateDoc }            from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getCurrentUser }                            from './auth.js';
import { setSyncStatus }                             from './app.js';

export function blankProfile(name, subject) {
  return {
    name,
    subject,
    streak:         0,
    lastDoneDate:   null,
    todayDone:      false,
    lastOpenDate:   null,
    levels:         { math: 0, read: 0 },
    attempts:       { math: 0, read: 0 },
    currentSession: null,
    failedQuestions:{},
    history:        []
  };
}

function userDoc() {
  const user = getCurrentUser();
  return doc(db, 'students', user.uid);
}

export async function loadProfile() {
  setSyncStatus('syncing', 'Cargando...');
  try {
    const snap = await getDoc(userDoc());
    if (snap.exists()) {
      const data = snap.data();
      data.currentSession    = data.currentSession    || null;
      data.failedQuestions   = data.failedQuestions   || {};
      data.history           = data.history           || [];
      setSyncStatus('ok', 'Sincronizado');
      return data;
    }
    setSyncStatus('ok', 'Sincronizado');
    return null;
  } catch(e) {
    setSyncStatus('offline', 'Sin conexión');
    return null;
  }
}

export async function saveProfile(D) {
  setSyncStatus('syncing', 'Guardando...');
  try {
    await setDoc(userDoc(), D);
    setSyncStatus('ok', 'Guardado');
  } catch(e) {
    setSyncStatus('offline', 'Error al guardar');
  }
}

export async function patchProfile(D, fields) {
  Object.assign(D, fields);
  setSyncStatus('syncing', 'Guardando...');
  try {
    await updateDoc(userDoc(), fields);
    setSyncStatus('ok', 'Guardado');
  } catch(e) {
    await saveProfile(D);
  }
}
