import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { db } from "./firebase.js";
import { doc, setDoc } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const role = roleSelect.value; // teacher / student

  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    email: email,
    role: role
  });

  alert("Account created");
});
