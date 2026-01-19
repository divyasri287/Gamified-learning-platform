import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbtHgEsMuwLMC7qOwp_qx4Cd7BSd_-JX0",
  authDomain: "gamified-learning-platfo-5db53.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// URL-la irundhu oobCode edukkurom
const params = new URLSearchParams(window.location.search);
const oobCode = params.get("oobCode");

window.resetPassword = () => {
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;

  if (newPass !== confirmPass) {
    alert("Passwords do not match");
    return;
  }

  confirmPasswordReset(auth, oobCode, newPass)
    .then(() => {
      alert("Password changed successfully");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};
