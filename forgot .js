import { auth } from "./firebase.js";
import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.getElementById("forgotForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Please enter email");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("✅ Password reset link sent. Check Inbox / Spam.");

    // ❌ redirect REMOVE pannunga
    // window.location.href = "index.html";

  } catch (error) {
    alert("❌ " + error.message);
    console.error(error);
  }
});
