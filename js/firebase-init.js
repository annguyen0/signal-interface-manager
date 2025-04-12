import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyA58YN3Qg1Fyom3Q8cA2RI7Crq1sh5mC6c",
    authDomain: "data-signal-5fe29.firebaseapp.com",
    databaseURL: "https://data-signal-5fe29-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "data-signal-5fe29",
    storageBucket: "data-signal-5fe29.firebasestorage.app",
    messagingSenderId: "486540033020",
    appId: "1:486540033020:web:8324c5a98c94aa3e119079",
    measurementId: "G-Z1172NT138"
  };

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };