// =======================
// THEME (All pages)
// =======================
function applyTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark", savedTheme === "dark");

  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "light" : "dark");
  applyTheme();
}

// =======================
// TOAST
// =======================
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden", "success", "error");
  toast.classList.add(type);

  setTimeout(() => toast.classList.add("hidden"), 1500);
}

// =======================
// USERS STORAGE
// =======================
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setLoggedInUser(email) {
  localStorage.setItem("loggedInUser", email);
}

function getLoggedInUser() {
  return localStorage.getItem("loggedInUser");
}

function requireLogin() {
  const user = getLoggedInUser();
  if (!user) window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("editTaskId");
  window.location.href = "index.html";
}

// =======================
// TASK STORAGE (Per user)
// =======================
function taskKey(email) {
  return `tasks_${email}`;
}

function getTasks(email) {
  return JSON.parse(localStorage.getItem(taskKey(email)) || "[]");
}

function saveTasks(email, tasks) {
  localStorage.setItem(taskKey(email), JSON.stringify(tasks));
}

// =======================
// REGISTER PAGE
// =======================
function initRegisterPage() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value.trim();
    const confirm = document.getElementById("regConfirm").value.trim();

    if (!email || !password || !confirm) {
      showToast("Please fill all fields ❗", "error");
      return;
    }

    if (password.length < 4) {
      showToast("Password must be at least 4 characters ❗", "error");
      return;
    }

    if (password !== confirm) {
      showToast("Passwords do not match ❌", "error");
      return;
    }

    const users = getUsers();

    const already = users.find((u) => u.email === email);
    if (already) {
      showToast("Account already exists ❗ Please login", "error");
      return;
    }

    users.push({ email, password });
    saveUsers(users);

    showToast("Account created successfully ✅", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
}

// =======================
// LOGIN PAGE
// =======================
function initLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    const users = getUsers();

    if (users.length === 0) {
      alert("No users found ❌ Please create account first!");
      window.location.href = "register.html";
      return;
    }

    const found = users.find((u) => u.email === email && u.password === password);

    if (!found) {
      alert("Invalid Email or Password ❌");
      return;
    }

    setLoggedInUser(email);
    window.location.href = "tasks.html";
  });
}

// =======================
// TASKS PAGE
// =======================
let currentFilter = "all";
let searchText = "";

function updatePendingCount() {
  const email = getLoggedInUser();
  if (!email) return;

  const tasks = getTasks(email);
  const pendingCount = tasks.filter((t) => !t.completed).length;

  const taskCountText = document.getElementById("taskCountText");
  if (taskCountText) taskCountText.textContent = `Pending: ${pendingCount}`;
}

function deleteTask(taskId) {
  const email = getLoggedInUser();
  const tasks = getTasks(email).filter((t) => t.id !== taskId);
  saveTasks(email, tasks);

  showToast("Task deleted 🗑️", "success");
  renderTasks();
}

function goEditTask(taskId) {
  localStorage.setItem("editTaskId", String(taskId));
  window.location.href = "add-task.html";
}

function renderTasks() {
  const email = getLoggedInUser();
  if (!email) return;

  const list = document.getElementById("taskList");
  const emptyText = document.getElementById("emptyText");
  if (!list) return;

  let tasks = getTasks(email);

  if (currentFilter === "pending") tasks = tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") tasks = tasks.filter((t) => t.completed);

  if (searchText.trim() !== "") {
    tasks = tasks.filter((t) =>
      t.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  list.innerHTML = "";

  if (tasks.length === 0) {
    emptyText.classList.remove("hidden");
    updatePendingCount();
    return;
  } else {
    emptyText.classList.add("hidden");
  }

  tasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      const allTasks = getTasks(email);
      const idx = allTasks.findIndex((t) => t.id === task.id);
      if (idx !== -1) {
        allTasks[idx].completed = checkbox.checked;
        saveTasks(email, allTasks);
        renderTasks();
      }
    });

    const info = document.createElement("div");

    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.name;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.textContent = `Due: ${task.dueDate} • Status: ${
      task.completed ? "Completed" : "Pending"
    }`;

    info.appendChild(title);
    info.appendChild(meta);

    left.appendChild(checkbox);
    left.appendChild(info);

    const right = document.createElement("div");
    right.className = "task-actions";

    const badge = document.createElement("span");
    badge.className = `badge ${task.priority.toLowerCase()}`;
    badge.textContent = task.priority;

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "✏️";
    editBtn.title = "Edit Task";
    editBtn.addEventListener("click", () => goEditTask(task.id));

    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn";
    delBtn.textContent = "🗑️";
    delBtn.title = "Delete Task";
    delBtn.addEventListener("click", () => deleteTask(task.id));

    right.appendChild(badge);
    right.appendChild(editBtn);
    right.appendChild(delBtn);

    item.appendChild(left);
    item.appendChild(right);

    list.appendChild(item);
  });

  updatePendingCount();
}

function initTasksPage() {
  const taskList = document.getElementById("taskList");
  if (!taskList) return;

  requireLogin();

  const email = getLoggedInUser();

  const welcomeText = document.getElementById("welcomeText");
  if (welcomeText) welcomeText.textContent = `Logged in as: ${email}`;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const addBtn = document.getElementById("goAddTask");
  if (addBtn)
    addBtn.addEventListener("click", () => {
      localStorage.removeItem("editTaskId");
      window.location.href = "add-task.html";
    });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.dataset.filter;
      renderTasks();
    });
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchText = searchInput.value;
      renderTasks();
    });
  }

  renderTasks();
}

// =======================
// ADD / EDIT TASK PAGE
// =======================
function initAddTaskPage() {
  const form = document.getElementById("addTaskForm");
  if (!form) return;

  requireLogin();

  const email = getLoggedInUser();

  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.addEventListener("click", () => (window.location.href = "tasks.html"));

  const editTaskId = localStorage.getItem("editTaskId");

  if (editTaskId) {
    const tasks = getTasks(email);
    const task = tasks.find((t) => String(t.id) === String(editTaskId));

    if (task) {
      document.getElementById("pageTitle").textContent = "Edit Task";
      document.getElementById("pageSub").textContent = "Update your task details";
      document.getElementById("submitBtn").textContent = "Update Task";

      document.getElementById("taskName").value = task.name;
      document.getElementById("priority").value = task.priority;
      document.getElementById("dueDate").value = task.dueDate;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("taskName").value.trim();
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!name || !priority || !dueDate) {
      showToast("Please fill all fields ❗", "error");
      return;
    }

    let tasks = getTasks(email);

    if (editTaskId) {
      tasks = tasks.map((t) => {
        if (String(t.id) === String(editTaskId)) {
          return { ...t, name, priority, dueDate };
        }
        return t;
      });

      saveTasks(email, tasks);
      localStorage.removeItem("editTaskId");

      showToast("Task updated ✅", "success");
      setTimeout(() => (window.location.href = "tasks.html"), 700);
      return;
    }

    tasks.unshift({
      id: Date.now(),
      name,
      priority,
      dueDate,
      completed: false
    });

    saveTasks(email, tasks);

    showToast("Task added successfully ✅", "success");
    setTimeout(() => (window.location.href = "tasks.html"), 700);
  });
}

// =======================
// INIT ALL PAGES
// =======================
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();

  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) toggleBtn.addEventListener("click", toggleTheme);

  initRegisterPage();
  initLoginPage();
  initTasksPage();
  initAddTaskPage();
});
