import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth }        from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore }   from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            "AIzaSyC7Y16Bs_lcuKCwA64-_g_yC20XP1S1804",
  authDomain:        "aprenderycrecer-58788.firebaseapp.com",
  projectId:         "aprenderycrecer-58788",
  storageBucket:     "aprenderycrecer-58788.firebasestorage.app",
  messagingSenderId: "424388306703",
  appId:             "1:424388306703:web:4e28145e3426241364c07a"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { auth, db };
