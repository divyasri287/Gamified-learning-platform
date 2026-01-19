import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbtHgEsMuwLMC7qOwp_qx4Cd7BSd_-JX0",
  authDomain: "gamified-learning-platfo-5db53.firebaseapp.com",
  projectId: "gamified-learning-platfo-5db53",
  storageBucket: "gamified-learning-platfo-5db53.appspot.com", // ✅ FIXED
  messagingSenderId: "554803489563",
  appId: "1:554803489563:web:a6602a9fab40f3a21041be"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
