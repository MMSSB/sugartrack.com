// // firebase-init.js

// // 1. Load Firebase SDKs from CDN (Compat version for easier syntax)
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// // 2. Your Config (Recovered from your old files)
// const firebaseConfig = {
//   apiKey: "AIzaSyCh2ZVSEBdtBB6RuaQIEpcghyayjRr1SXY",
//   authDomain: "sugartrack-1608f.firebaseapp.com",
//   databaseURL: "https://sugartrack-1608f-default-rtdb.firebaseio.com",
//   projectId: "sugartrack-1608f",
//   storageBucket: "sugartrack-1608f.firebasestorage.app",
//   messagingSenderId: "660274075529",
//   appId: "1:660274075529:web:4b8acaacde0d4199527358",
//   measurementId: "G-C8BV3WJ17L"
// };
// // 3. Initialize
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Export for use in other files
// export { auth, db, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp, onSnapshot };


















// firebase-init.js

// 1. Load Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Your Config
const firebaseConfig = {
  apiKey: "AIzaSyCh2ZVSEBdtBB6RuaQIEpcghyayjRr1SXY",
  authDomain: "sugartrack-1608f.firebaseapp.com",
  databaseURL: "https://sugartrack-1608f-default-rtdb.firebaseio.com",
  projectId: "sugartrack-1608f",
  storageBucket: "sugartrack-1608f.firebasestorage.app",
  messagingSenderId: "660274075529",
  appId: "1:660274075529:web:4b8acaacde0d4199527358",
  measurementId: "G-C8BV3WJ17L"
};

// 3. Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files (FIXED: doc and deleteDoc are now included!)
export { auth, db, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, collection, addDoc, query, where, orderBy, limit, getDocs, Timestamp, onSnapshot, deleteDoc, doc };