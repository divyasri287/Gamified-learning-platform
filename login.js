import { signInWithEmailAndPassword } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { doc, getDoc } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userCred = await signInWithEmailAndPassword(
    auth,
    email.value,
    password.value
  );

  const uid = userCred.user.uid;
  const snap = await getDoc(doc(db, "users", uid));

  if (snap.exists()) {
    const role = snap.data().role;

    if (role === "teacher") {
      window.location.href = "teacher-dashboard.html";
    } else {
      window.location.href = "student-dashboard.html";
    }
  }
});
