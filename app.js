/* ============ StudyGo · Lógica de la aplicación ============ */
"use strict";

/* ---------- Estado y persistencia ---------- */
const STORAGE_KEY = "studygo-state-v1";

const DEFAULT_STATE = {
  user: { name: "", doubleDegree: false, notifications: true },
  theme: "light",
  focusMode: false,
  subscription: false,
  focusSessions: 0,
  pomodoro: { work: 25, short: 5, long: 15 },
  tasks: [],
  notes: [],
  goals: [],
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const st = Object.assign({}, DEFAULT_STATE, parsed);
      if (!Array.isArray(st.tasks) || st.tasks.length === 0) {
        st.tasks = seedTasks();
      }
      return st;
    }
  } catch (e) {
    console.warn("No se pudo leer el estado", e);
  }
  return Object.assign({}, DEFAULT_STATE, { tasks: seedTasks(), notes: seedNotes(), goals: seedGoals() });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- Datos de ejemplo ---------- */
function isoDaysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function todayISO() { return toISODate(new Date()); }

function seedTasks() {
  return [
    { id: uid(), title: "Repasar tema 4 de Matemáticas", subject: "Matemáticas", type: "tarea", date: isoDaysFromNow(0), done: false, priority: "alta", notes: "" },
    { id: uid(), title: "Entregar comentario de texto", subject: "Lengua", type: "trabajo", date: isoDaysFromNow(1), done: false, priority: "media", notes: "" },
    { id: uid(), title: "Examen de Historia (tema 1-3)", subject: "Historia", type: "examen", date: isoDaysFromNow(3), done: false, priority: "alta", notes: "" },
    { id: uid(), title: "Hacer lista de vocabulario", subject: "Inglés", type: "tarea", date: isoDaysFromNow(0), done: true, priority: "baja", notes: "" },
    { id: uid(), title: "Examen de Física", subject: "Física", type: "examen", date: isoDaysFromNow(7), done: false, priority: "media", notes: "" },
    { id: uid(), title: "Leer capítulos 5-6", subject: "Literatura", type: "tarea", date: isoDaysFromNow(2), done: false, priority: "baja", notes: "" },
  ];
}
function seedNotes() {
  return [
    { id: uid(), title: "Esquema: La fotosíntesis", subject: "Biología", content: "1. Captación de luz\n2. Conversión a energía\n3. Producción de oxígeno\n\nClave: el cloroplasto.", updatedAt: Date.now() - 86400000 },
    { id: uid(), title: "Fórmulas de cinemática", subject: "Física", content: "v = v₀ + a·t\nx = x₀ + v₀·t + ½·a·t²", updatedAt: Date.now() - 172800000 },
  ];
}
function seedGoals() {
  return [
    { id: uid(), title: "Aprobar el examen de Historia", target: 100, current: 60 },
    { id: uid(), title: "Estudiar 2h al día esta semana", target: 14, current: 8 },
  ];
}
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------- Utilidades ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const WEEKDAYS_FULL = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function fmtDate(iso) {
  if (!iso) return "Sin fecha";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3).toLowerCase()}`;
}
function fmtDateLong(iso) {
  if (!iso) return "Sin fecha";
  const d = new Date(iso + "T00:00:00");
  return `${WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()].toLowerCase()}`;
}
function relativeDate(iso) {
  const today = todayISO();
  if (iso === today) return "Hoy";
  if (iso === isoDaysFromNow(1)) return "Mañana";
  if (iso < today) return "Atrasada";
  return fmtDate(iso);
}

const TYPE_LABEL = { tarea: "Tarea", examen: "Examen", trabajo: "Trabajo" };
const PRIO_LABEL = { alta: "Alta", media: "Media", baja: "Baja" };

function toast(msg) {
  const wrap = $("#toast-wrap");
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

/* ---------- Navegación ---------- */
const NAV_ITEMS = [
  { view: "home", ico: "🏠", label: "Inicio" },
  { view: "tasks", ico: "📝", label: "Tareas" },
  { view: "calendar", ico: "📅", label: "Calendario" },
  { view: "pomodoro", ico: "🧠", label: "Pomodoro" },
  { view: "notes", ico: "📚", label: "Apuntes" },
  { view: "community", ico: "👥", label: "Comunidad" },
  { view: "progress", ico: "📊", label: "Progreso" },
  { view: "bus", ico: "🚌", label: "Autobuses" },
  { view: "doubles", ico: "🎓", label: "Dobles grados" },
  { view: "ods", ico: "🌍", label: "ODS" },
  { view: "subscription", ico: "🤝", label: "Suscripción" },
  { view: "settings", ico: "⚙️", label: "Ajustes" },
];

const BOTTOM_NAV = [
  { view: "home", ico: "🏠", label: "Inicio" },
  { view: "tasks", ico: "📝", label: "Tareas" },
  { view: "calendar", ico: "📅", label: "Calendario" },
  { view: "pomodoro", ico: "🧠", label: "Pomodoro" },
  { view: "more", ico: "⋯", label: "Más" },
];

let currentView = "home";

function buildNav() {
  const navDesktop = $("#nav-desktop");
  navDesktop.innerHTML = NAV_ITEMS.map((n) => `
    <button class="nav-item" data-action="goto" data-view="${n.view}">
      <span class="ico">${n.ico}</span>${n.label}
    </button>`).join("");

  const bottom = $("#bottomnav");
  bottom.innerHTML = `<div class="bottomnav-inner">` + BOTTOM_NAV.map((n) => `
    <button class="bottomnav-item" data-action="goto" data-view="${n.view}">
      <span class="ico">${n.ico}</span>${n.label}
    </button>`).join("") + `</div>`;
}

function goto(view) {
  if (view === "more") {
    openMoreSheet();
    return;
  }
  currentView = view;
  $$(".view").forEach((v) => v.classList.remove("active"));
  const target = $("#view-" + view);
  if (target) {
    target.classList.add("active");
    $("#view-title").textContent = target.dataset.title || "StudyGo";
  }
  $$(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.view === view));
  $$(".bottomnav-item").forEach((n) => n.classList.toggle("active", n.dataset.view === view));
  updateFabVisibility(view);
  renderCurrent();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateFabVisibility(view) {
  const fab = $("#btn-add-task");
  if (!fab) return;
  if (view === "home" || view === "tasks" || view === "calendar") {
    fab.style.display = "grid";
  } else {
    fab.style.display = "none";
  }
}

function openMoreSheet() {
  // Reutiliza el modal como menú "Más"
  const extra = NAV_ITEMS.filter((n) => !BOTTOM_NAV.some((b) => b.view === n.view));
  openModal("Más opciones", `
    <div class="quick-grid" style="grid-template-columns: repeat(2, 1fr);">
      ${extra.map((n) => `
        <button class="quick-tile" data-action="goto" data-view="${n.view}" data-close-modal="1">
          <span>${n.ico}</span>${n.label}
        </button>`).join("")}
    </div>`);
}

function renderCurrent() {
  switch (currentView) {
    case "home": renderHome(); break;
    case "tasks": renderTasks(); break;
    case "calendar": renderCalendar(); break;
    case "pomodoro": renderPomodoro(); break;
    case "notes": renderNotes(); break;
    case "community": renderCommunity(); break;
    case "progress": renderProgress(); break;
    case "bus": renderBus(); break;
    case "doubles": renderDoubles(); break;
    case "ods": renderODS(); break;
    case "subscription": renderSubscription(); break;
    case "settings": renderSettings(); break;
  }
}

/* ---------- Tareas (CRUD) ---------- */
function tasksForToday() {
  const today = todayISO();
  // Incluye las tareas con fecha de hoy y las pendientes atrasadas
  return state.tasks
    .filter((t) => t.date === today || (!t.done && t.date < today))
    .sort((a, b) => (a.done - b.done) || a.date.localeCompare(b.date));
}
function upcomingExams() {
  const today = todayISO();
  return state.tasks
    .filter((t) => t.type === "examen" && !t.done && t.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
}
function pendingTasks() { return state.tasks.filter((t) => !t.done); }
function doneTasks() { return state.tasks.filter((t) => t.done); }

function renderHome() {
  const d = new Date();
  $("#home-date").textContent = `${WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()].toLowerCase()}`;
  $("#home-name").textContent = state.user.name || "estudiante";

  const today = tasksForToday();
  const pendingToday = today.filter((t) => !t.done);
  $("#home-today-count").textContent = pendingToday.length;
  $("#home-subtitle").innerHTML = pendingToday.length
    ? `Tienes <strong>${pendingToday.length}</strong> tarea${pendingToday.length === 1 ? "" : "s"} para hoy. ¡Vamos a por ell${pendingToday.length === 1 ? "a" : "as"}!`
    : `Hoy tienes el día despejado. ${pendingToday.length === 0 && today.length ? "Todo completado. " : ""}¡Aprovecha para repasar!`;

  // Stats
  const pend = pendingTasks().length;
  const done = doneTasks().length;
  const total = state.tasks.length;
  $("#stat-pending").textContent = pend;
  $("#stat-done").textContent = done;
  $("#stat-progress").textContent = total ? Math.round((done / total) * 100) + "%" : "0%";
  $("#stat-focus").textContent = state.focusSessions;

  // Lista de hoy
  const todayList = $("#home-today-list");
  todayList.innerHTML = today.length
    ? today.map(taskCard).join("")
    : `<div class="empty">
        <p>Nada pendiente para hoy 🎉</p>
        <button class="btn btn-ghost btn-sm" style="margin-top:10px;" data-action="new-task">＋ Añadir una tarea</button>
      </div>`;

  // Exámenes
  const exams = upcomingExams();
  const examsList = $("#home-exams-list");
  examsList.innerHTML = exams.length
    ? exams.map(taskCard).join("")
    : `<div class="empty">
        <p>No hay exámenes próximos.</p>
        <button class="btn btn-ghost btn-sm" style="margin-top:10px;" data-action="new-exam">＋ Añadir examen</button>
      </div>`;
}

function taskCard(t) {
  const overdue = !t.done && t.date < todayISO();
  return `
    <div class="card task-item" data-task-id="${t.id}">
      <button class="task-check ${t.done ? "done" : ""}" data-action="toggle-task" data-id="${t.id}" aria-label="${t.done ? "Marcar como pendiente" : "Completar tarea"}" title="${t.done ? "Completada (clic para desmarcar)" : "Clic para completar"}">${t.done ? "✓" : ""}</button>
      <div class="task-body" data-action="edit-task" data-id="${t.id}" title="Haz clic para ver o editar la tarea">
        <div class="task-title ${t.done ? "done" : ""}">${esc(t.title)}</div>
        <div class="task-meta">
          <span class="chip ${t.type}">${TYPE_LABEL[t.type] || t.type}</span>
          <span class="chip prio-${t.priority}">${PRIO_LABEL[t.priority] || t.priority}</span>
          <span>📘 ${esc(t.subject)}</span>
          <span style="${overdue ? "color: var(--danger); font-weight:700;" : ""}">${overdue ? "⚠️ Atrasada (" : "📆 "}${relativeDate(t.date)}${overdue ? ")" : ""}</span>
          ${t.notes ? `<span class="chip chip-notes" title="${esc(t.notes)}">📝 Nota</span>` : ""}
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn" data-action="edit-task" data-id="${t.id}" aria-label="Editar" title="Editar tarea">✏️</button>
        <button class="icon-btn btn-delete" data-action="delete-task" data-id="${t.id}" aria-label="Eliminar" title="Eliminar tarea">🗑️</button>
      </div>
    </div>`;
}

let taskFilter = "todas";
const TASK_FILTERS = [
  { key: "todas", label: "Todas" },
  { key: "pendientes", label: "Pendientes" },
  { key: "completadas", label: "Completadas" },
  { key: "examen", label: "Exámenes" },
  { key: "tarea", label: "Tareas" },
  { key: "trabajo", label: "Trabajos" },
];

function renderTasks() {
  const fc = $("#task-filter");
  fc.innerHTML = TASK_FILTERS.map((f) => `
    <button class="filter-chip ${taskFilter === f.key ? "active" : ""}" data-action="filter-task" data-key="${f.key}">${f.label}</button>`).join("");

  let list = state.tasks.slice();
  if (taskFilter === "pendientes") list = list.filter((t) => !t.done);
  else if (taskFilter === "completadas") list = list.filter((t) => t.done);
  else if (taskFilter !== "todas") list = list.filter((t) => t.type === taskFilter);

  list.sort((a, b) => (a.done - b.done) || a.date.localeCompare(b.date));
  const el = $("#tasks-list");
  el.innerHTML = list.length
    ? list.map(taskCard).join("")
    : `<div class="empty">
        <p>No hay tareas en esta vista.</p>
        <button class="btn btn-ghost btn-sm" style="margin-top:10px;" data-action="new-task">＋ Añadir tarea</button>
      </div>`;
}

function openTaskModal(task) {
  const isEdit = !!(task && task.id);
  const t = Object.assign({ title: "", subject: "", type: "tarea", date: todayISO(), priority: "media", notes: "" }, task || {});
  openModal(isEdit ? "Editar tarea" : (t.type === "examen" ? "Nuevo examen" : "Nueva tarea"), `
    <div class="field"><label>Título</label><input type="text" id="f-title" class="input" value="${esc(t.title)}" placeholder="Ej. Repasar tema 4" /></div>
    <div class="row-2">
      <div class="field"><label>Asignatura</label><input type="text" id="f-subject" class="input" value="${esc(t.subject)}" placeholder="Matemáticas" /></div>
      <div class="field"><label>Tipo</label>
        <select id="f-type" class="input">
          <option value="tarea" ${t.type === "tarea" ? "selected" : ""}>Tarea</option>
          <option value="examen" ${t.type === "examen" ? "selected" : ""}>Examen</option>
          <option value="trabajo" ${t.type === "trabajo" ? "selected" : ""}>Trabajo</option>
        </select>
      </div>
    </div>
    <div class="row-2">
      <div class="field"><label>Fecha</label><input type="date" id="f-date" class="input" value="${t.date || todayISO()}" /></div>
      <div class="field"><label>Prioridad</label>
        <select id="f-priority" class="input">
          <option value="alta" ${t.priority === "alta" ? "selected" : ""}>Alta</option>
          <option value="media" ${t.priority === "media" ? "selected" : ""}>Media</option>
          <option value="baja" ${t.priority === "baja" ? "selected" : ""}>Baja</option>
        </select>
      </div>
    </div>
    <div class="field"><label>Notas (opcional)</label><textarea id="f-notes" class="input" placeholder="Detalles…">${esc(t.notes)}</textarea></div>
    <button class="btn btn-primary btn-block" data-action="save-task" data-id="${isEdit ? t.id : ""}">Guardar</button>
  `);
}

function saveTask(id) {
  const title = $("#f-title").value.trim();
  if (!title) { toast("Pon un título a la tarea"); return; }
  const data = {
    title,
    subject: $("#f-subject").value.trim() || "General",
    type: $("#f-type").value,
    date: $("#f-date").value || todayISO(),
    priority: $("#f-priority").value,
    notes: $("#f-notes").value.trim(),
  };
  if (id) {
    const t = state.tasks.find((x) => x.id === id);
    Object.assign(t, data);
    toast("Tarea actualizada");
  } else {
    state.tasks.push(Object.assign({ id: uid(), done: false }, data));
    toast("Tarea añadida");
  }
  saveState();
  closeModal();
  renderCurrent();
}

function toggleTask(id) {
  const t = state.tasks.find((x) => x.id === id);
  if (t) {
    t.done = !t.done;
    if (t.done) toast("¡Bien hecho! 🎉");
    saveState();
    renderCurrent();
  }
}
function deleteTask(id) {
  const t = state.tasks.find((x) => x.id === id);
  if (!t) return;
  confirmDialog(`¿Eliminar "${t.title}"?`, () => {
    state.tasks = state.tasks.filter((x) => x.id !== id);
    saveState();
    toast("Tarea eliminada");
    renderCurrent();
  });
}

/* ---------- Calendario ---------- */
let calCursor = new Date();
let calSelected = todayISO();

function renderCalendar() {
  const year = calCursor.getFullYear();
  const month = calCursor.getMonth();
  $("#cal-title").textContent = `${MONTHS[month]} ${year}`;

  const first = new Date(year, month, 1);
  // Lunes como primer día de la semana
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = "";
  // Celdas vacías iniciales
  for (let i = 0; i < startOffset; i++) html += `<div class="cal-day out"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toISODate(new Date(year, month, d));
    const dayTasks = state.tasks.filter((t) => t.date === iso);
    const dots = dayTasks.slice(0, 3).map((t) => `<span class="dot ${t.type}"></span>`).join("");
    const cls = [iso === todayISO() ? "today" : "", iso === calSelected ? "selected" : ""].join(" ").trim();
    html += `<div class="cal-day ${cls}" data-action="cal-select" data-date="${iso}">
      <span class="cal-num">${d}</span>
      <div class="cal-dots">${dots}</div>
    </div>`;
  }
  $("#cal-grid").innerHTML = html;

  renderCalDayList();
}

function renderCalDayList() {
  const dayTasks = state.tasks.filter((t) => t.date === calSelected);
  const el = $("#cal-day-list");
  el.innerHTML = dayTasks.length
    ? `<div class="section-head" style="margin-top:0"><h4 style="font-size:14px">${fmtDateLong(calSelected)}</h4></div>` + dayTasks.map(taskCard).join("")
    : `<div class="empty">No hay eventos el ${fmtDateLong(calSelected)}.</div>`;
}

/* ---------- Pomodoro ---------- */
const POMO = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
let pomoMode = "work";
let pomoRemaining = POMO.work;
let pomoRunning = false;
let pomoTimer = null;
const RING_CIRC = 603.2;
const PROG_CIRC = 314.16;

function pomoMinutes() {
  return { work: Number($("#set-work").value) || 25, short: Number($("#set-short").value) || 5, long: Number($("#set-long").value) || 15 };
}
function pomoDuration(mode) {
  const m = pomoMinutes();
  return (m[mode] || 25) * 60;
}

function renderPomodoro() {
  updatePomoRing();
  $("#pomo-time").textContent = fmtPomoTime(pomoRemaining);
  $("#pomo-toggle").textContent = pomoRunning ? "⏸ Pausar" : "▶ Iniciar";
  $$(".pomo-mode").forEach((b) => b.classList.toggle("active", b.dataset.mode === pomoMode));
  $("#pomo-hint").textContent = pomoMode === "work"
    ? "Concéntrate en una sola tarea. Sin distracciones."
    : pomoMode === "short" ? "Descanso breve. Estira y respira." : "Descanso largo. Recarga energía.";
}

function fmtPomoTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function updatePomoRing() {
  const total = pomoDuration(pomoMode) || 1;
  const frac = pomoRemaining / total;
  $("#pomo-ring-fg").style.strokeDashoffset = String(RING_CIRC * (1 - frac));
}

function setPomoMode(mode) {
  pomoMode = mode;
  pomoRemaining = pomoDuration(mode);
  stopPomo();
  renderPomodoro();
}
function startPomo() {
  if (pomoRunning) { stopPomo(); return; }
  pomoRunning = true;
  pomoTimer = setInterval(() => {
    if (pomoRemaining <= 0) {
      clearInterval(pomoTimer);
      pomoRunning = false;
      if (pomoMode === "work") {
        state.focusSessions++;
        saveState();
        toast("¡Sesión completada! Tómate un descanso 🎉");
        setPomoMode("short");
      } else {
        setPomoMode("work");
      }
      return;
    }
    pomoRemaining--;
    renderPomodoro();
  }, 1000);
  renderPomodoro();
}
function stopPomo() {
  if (pomoTimer) clearInterval(pomoTimer);
  pomoRunning = false;
  renderPomodoro();
}
function resetPomo() {
  stopPomo();
  pomoRemaining = pomoDuration(pomoMode);
  renderPomodoro();
}

/* ---------- Apuntes ---------- */
function renderNotes() {
  const q = ($("#notes-search").value || "").toLowerCase();
  const list = state.notes.filter((n) => !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  const grid = $("#notes-grid");
  grid.innerHTML = list.map((n) => `
    <div class="note-card" data-action="edit-note" data-id="${n.id}">
      <div><span class="note-subject">${esc(n.subject)}</span></div>
      <h4>${esc(n.title)}</h4>
      <p>${esc(n.content).slice(0, 120)}${n.content.length > 120 ? "…" : ""}</p>
      <span class="note-meta">🕐 ${new Date(n.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>
    </div>`).join("");
  $("#notes-empty").hidden = list.length > 0;
}

function openNoteModal(note) {
  const isEdit = !!note;
  const n = note || { title: "", subject: "", content: "" };
  openModal(isEdit ? "Editar apunte" : "Nuevo apunte", `
    <div class="field"><label>Título</label><input type="text" id="n-title" class="input" value="${esc(n.title)}" placeholder="Título del apunte" /></div>
    <div class="field"><label>Asignatura</label><input type="text" id="n-subject" class="input" value="${esc(n.subject)}" placeholder="Biología, Física…" /></div>
    <div class="field"><label>Contenido</label><textarea id="n-content" class="input" placeholder="Escribe, organiza y guarda tus apuntes, esquemas y mapas conceptuales…">${esc(n.content)}</textarea></div>
    <div class="row-2">
      <button class="btn btn-ghost" data-action="delete-note" data-id="${isEdit ? n.id : ""}">🗑️</button>
      <button class="btn btn-primary" data-action="save-note" data-id="${isEdit ? n.id : ""}">Guardar</button>
    </div>
  `);
}

function saveNote(id) {
  const title = $("#n-title").value.trim();
  if (!title) { toast("Pon un título al apunte"); return; }
  const data = { title, subject: $("#n-subject").value.trim() || "General", content: $("#n-content").value };
  if (id) {
    const n = state.notes.find((x) => x.id === id);
    Object.assign(n, data, { updatedAt: Date.now() });
    toast("Apunte actualizado");
  } else {
    state.notes.push(Object.assign({ id: uid(), updatedAt: Date.now() }, data));
    toast("Apunte guardado");
  }
  saveState();
  closeModal();
  renderNotes();
}
function deleteNote(id) {
  state.notes = state.notes.filter((x) => x.id !== id);
  saveState();
  closeModal();
  toast("Apunte eliminado");
  renderNotes();
}

/* ---------- Comunidad ---------- */
const GROUPS = [
  { name: "Matemáticas II — refuerzo", members: 8, subject: "Matemáticas", color: "#6d5dfc", emoji: "🧮" },
  { name: "Inglés: preparación examen", members: 5, subject: "Inglés", color: "#ff6d8d", emoji: "🇬🇧" },
  { name: "Historia de España", members: 12, subject: "Historia", color: "#f5a524", emoji: "🏛️" },
  { name: "Física y Química juntos", members: 6, subject: "Física", color: "#22c58b", emoji: "⚛️" },
];
const PEOPLE = [
  { name: "Lucía Martín", role: "1º Bachillerato · Ciencias", color: "#6d5dfc", emoji: "🦊" },
  { name: "Javier Ruiz", role: "Doble grado Derecho + ADE", color: "#22c58b", emoji: "🐼" },
  { name: "Sara Gómez", role: "4º ESO", color: "#ff6d8d", emoji: "🐰" },
  { name: "Hugo López", role: "2º Bachillerato · Letras", color: "#f5a524", emoji: "🦁" },
];

function renderCommunity() {
  const q = ($("#comm-search").value || "").toLowerCase();
  const groups = GROUPS.filter((g) => !q || g.name.toLowerCase().includes(q) || g.subject.toLowerCase().includes(q));
  const people = PEOPLE.filter((p) => !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));

  $("#groups-list").innerHTML = groups.map((g) => `
    <div class="card">
      <div class="avatar" style="background:${g.color}">${g.emoji}</div>
      <div class="task-body">
        <div class="task-title">${esc(g.name)}</div>
        <div class="task-meta"><span>👥 ${g.members} miembros</span><span>📘 ${esc(g.subject)}</span></div>
      </div>
      <button class="btn btn-ghost" data-action="join-group" data-name="${esc(g.name)}">Unirme</button>
    </div>`).join("") || `<div class="empty">No se encontraron grupos.</div>`;

  $("#people-list").innerHTML = people.map((p) => `
    <div class="card">
      <div class="avatar" style="background:${p.color}">${p.emoji}</div>
      <div class="task-body">
        <div class="task-title">${esc(p.name)}</div>
        <div class="task-meta"><span>🎓 ${esc(p.role)}</span></div>
      </div>
      <button class="btn btn-ghost" data-action="connect" data-name="${esc(p.name)}">Conectar</button>
    </div>`).join("") || `<div class="empty">No se encontraron compañeros.</div>`;
}

/* ---------- Progreso ---------- */
function renderProgress() {
  const done = doneTasks().length;
  const total = state.tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("#prog-pct").textContent = pct + "%";
  $("#prog-ring").style.strokeDashoffset = String(PROG_CIRC * (1 - pct / 100));
  $("#prog-summary").textContent = total
    ? `Has completado ${done} de ${total} tareas (${pct}%).`
    : "Añade tareas para empezar a medir tu progreso.";

  // Por asignatura
  const bySubject = {};
  state.tasks.forEach((t) => {
    if (!bySubject[t.subject]) bySubject[t.subject] = { total: 0, done: 0 };
    bySubject[t.subject].total++;
    if (t.done) bySubject[t.subject].done++;
  });
  const subjects = Object.entries(bySubject);
  $("#subject-bars").innerHTML = subjects.length ? subjects.map(([subj, s]) => {
    const sp = s.total ? Math.round((s.done / s.total) * 100) : 0;
    return `<div class="bar-row">
      <span class="bar-name">${esc(subj)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${sp}%"></div></div>
      <span class="bar-val">${sp}%</span>
    </div>`;
  }).join("") : `<div class="empty">Sin datos por asignatura todavía.</div>`;

  // Objetivos
  $("#goals-list").innerHTML = state.goals.length ? state.goals.map((g) => {
    const gp = g.target ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
    return `<div class="card goal-row">
      <div class="task-body">
        <div class="goal-title">🎯 ${esc(g.title)}</div>
        <div class="goal-track"><div class="goal-fill" style="width:${gp}%"></div></div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="goal-pct">${gp}%</span>
        <button class="icon-btn" data-action="delete-goal" data-id="${g.id}" aria-label="Eliminar objetivo">🗑️</button>
      </div>
    </div>`;
  }).join("") : `<div class="empty">No tienes objetivos. ¡Crea uno!</div>`;
}

function openGoalModal() {
  openModal("Nuevo objetivo", `
    <div class="field"><label>Objetivo</label><input type="text" id="g-title" class="input" placeholder="Ej. Aprobar Historia" /></div>
    <div class="row-2">
      <div class="field"><label>Meta (ej. 100)</label><input type="number" id="g-target" class="input" min="1" value="100" /></div>
      <div class="field"><label>Progreso actual</label><input type="number" id="g-current" class="input" min="0" value="0" /></div>
    </div>
    <button class="btn btn-primary btn-block" data-action="save-goal">Guardar objetivo</button>
  `);
}
function saveGoal() {
  const title = $("#g-title").value.trim();
  if (!title) { toast("Escribe el objetivo"); return; }
  state.goals.push({
    id: uid(),
    title,
    target: Math.max(1, Number($("#g-target").value) || 1),
    current: Math.max(0, Number($("#g-current").value) || 0),
  });
  saveState();
  closeModal();
  toast("Objetivo añadido");
  renderProgress();
}
function deleteGoal(id) {
  state.goals = state.goals.filter((g) => g.id !== id);
  saveState();
  renderProgress();
}

/* ---------- Autobuses Granada ---------- */
const BUS_LINES = [
  { line: "LAC", name: "Línea de Alta Capacidad", dest: "Centro ↔ Chana", freq: "5-7 min" },
  { line: "SN1", name: "Línea Norte-Sur", dest: "Campus Cartuja ↔ Zaidín", freq: "8-10 min" },
  { line: "4", name: "Zaidín", dest: "Estación de autobuses", freq: "10 min" },
  { line: "8", name: "Chana", dest: "Camino de Ronda", freq: "12 min" },
  { line: "11", name: "Zaidín", dest: "Palacio de Deportes", freq: "10 min" },
  { line: "33", name: "Beiro", dest: "Campus de la Salud", freq: "15 min" },
  { line: "U1", name: "Universitario", dest: "Campus Fuentenueva ↔ Cartuja", freq: "8 min" },
  { line: "U2", name: "Universitario", dest: "Campus Aynadamar", freq: "15 min" },
];

function renderBus() {
  const q = ($("#bus-search").value || "").toLowerCase();
  const list = BUS_LINES.filter((b) => !q || b.line.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || b.dest.toLowerCase().includes(q));
  $("#bus-list").innerHTML = list.map((b) => `
    <div class="card">
      <span class="bus-badge">${esc(b.line)}</span>
      <div class="task-body">
        <div class="task-title">${esc(b.name)}</div>
        <div class="task-meta"><span>📍 ${esc(b.dest)}</span><span>⏱️ Frecuencia ${esc(b.freq)}</span></div>
      </div>
      <button class="btn btn-ghost" data-action="bus-route" data-line="${esc(b.line)}">Ver</button>
    </div>`).join("") || `<div class="empty">Sin resultados.</div>`;
}

/* ---------- Dobles grados ---------- */
const DOUBLES_TIPS = [
  { title: "Prioriza lo urgente", text: "Ordena las asignaturas por fecha de examen, no por dificultad." },
  { title: "Detecta semanas críticas", text: "Marca en el calendario las semanas con exámenes de ambas carreras." },
  { title: "Calendario conjunto", text: "Un único calendario para las dos titulaciones evita solapamientos." },
  { title: "Equilibrio", text: "Reparte las horas de estudio entre las dos carreras de forma realista." },
  { title: "Reserva descanso", text: "Programa descansos: rendirás más y evitarás el agotamiento." },
];

function renderDoubles() {
  $("#doubles-tips").innerHTML = DOUBLES_TIPS.map((t) => `
    <div class="card">
      <div class="task-body">
        <div class="task-title">💡 ${esc(t.title)}</div>
        <div class="task-meta">${esc(t.text)}</div>
      </div>
    </div>`).join("");
  // Si ya hay resultado calculado, re-renderizarlo
}

function renderSplit(a, b, hours) {
  const half = Math.round(hours / 2);
  const el = $("#split-result");
  el.innerHTML = `
    <div class="section-head" style="margin-top:0"><h3>Resultado</h3></div>
    <div class="split-item"><span>${esc(a)}</span><div class="bar-track"><div class="bar-fill" style="width:50%"></div></div><strong>${half}h</strong></div>
    <div class="split-item"><span>${esc(b)}</span><div class="bar-track"><div class="bar-fill" style="width:50%"></div></div><strong>${hours - half}h</strong></div>
    <p class="muted" style="font-size:13px">Consejo: ajusta según la carga real de cada semana. Reserva al menos 2-3 horas de descanso.</p>`;
}

/* ---------- ODS ---------- */
const ODS = [
  { num: "ODS 3", title: "Salud y bienestar", text: "Reduce el estrés académico con planificación equilibrada, descansos y modo concentración.", color: "#4c9f38" },
  { num: "ODS 4", title: "Educación de calidad", text: "Facilita el estudio, ofrece recursos y ayuda a organizarse y aprender de forma eficaz.", color: "#c5192d" },
  { num: "ODS 10", title: "Reducción de desigualdades", text: "El 50% de los ingresos de la suscripción solidaria apoya la igualdad educativa.", color: "#dd1367" },
  { num: "ODS 11", title: "Ciudades sostenibles", text: "Fomenta el uso del transporte público con información de las líneas de Granada.", color: "#fd9d24" },
  { num: "ODS 17", title: "Alianzas", text: "Colabora con centros educativos, asociaciones y servicios de transporte.", color: "#19486a" },
];

function renderODS() {
  $("#ods-grid").innerHTML = ODS.map((o) => `
    <div class="ods-card" style="border-top:4px solid ${o.color}">
      <div class="ods-num">${o.num}</div>
      <h4>${esc(o.title)}</h4>
      <p>${esc(o.text)}</p>
    </div>`).join("");
}

/* ---------- Suscripción ---------- */
function renderSubscription() {
  $("#sub-status").textContent = state.subscription ? "Estado: suscripción solidaria activa 💚" : "Estado: plan gratuito";
  $("#btn-subscribe").textContent = state.subscription ? "✅ Ya eres parte de la suscripción solidaria" : "Unirme a la suscripción solidaria";
}
function subscribe() {
  state.subscription = true;
  saveState();
  toast("¡Gracias por unirte! 💚");
  renderSubscription();
}

/* ---------- Ajustes ---------- */
function renderSettings() {
  $("#set-name").value = state.user.name || "";
  $("#set-double").checked = state.user.doubleDegree;
  $("#set-notif").checked = state.user.notifications;
  $("#set-theme").checked = state.theme === "dark";
  $("#set-focus").checked = state.focusMode;
}

/* ---------- Tema ---------- */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const ico = state.theme === "dark" ? "☀️" : "🌙";
  $("#btn-theme").textContent = ico;
  $("#btn-theme-sidebar").innerHTML = `<span class="ico">${ico}</span> ${state.theme === "dark" ? "Modo claro" : "Modo oscuro"}`;
}
function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  applyTheme();
}

/* ---------- Modo concentración ---------- */
function setFocusMode(on) {
  state.focusMode = on;
  saveState();
  $("#focus-overlay").hidden = !on;
  $("#set-focus").checked = on;
  if (on) toast("Modo concentración activado 🧘");
}

/* ---------- Modal ---------- */
function openModal(title, bodyHtml) {
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML = bodyHtml;
  $("#modal").hidden = false;
}
function closeModal() {
  $("#modal").hidden = true;
}
function confirmDialog(message, onConfirm) {
  window.__confirmCb = onConfirm;
  openModal("Confirmar", `
    <p style="margin-bottom:18px; color: var(--text-2);">${esc(message)}</p>
    <div class="row-2">
      <button class="btn btn-ghost" data-action="confirm-cancel">Cancelar</button>
      <button class="btn btn-primary" data-action="confirm-ok">Confirmar</button>
    </div>`);
}

/* ---------- Delegación de eventos ---------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  const id = el.dataset.id;
  const view = el.dataset.view;

  // Navegación
  if (action === "goto") {
    if (el.dataset.closeModal) closeModal();
    goto(view);
    return;
  }
  if (action === "goto-filter") {
    if (el.dataset.closeModal) closeModal();
    const filter = el.dataset.filter;
    if (filter) taskFilter = filter;
    goto(view || "tasks");
    return;
  }
  if (action === "modal-close") { closeModal(); return; }
  if (action === "confirm-cancel") { window.__confirmCb = null; closeModal(); return; }
  if (action === "confirm-ok") { const cb = window.__confirmCb; window.__confirmCb = null; closeModal(); if (cb) cb(); return; }

  // Tareas
  if (action === "toggle-task") toggleTask(id);
  else if (action === "edit-task") openTaskModal(state.tasks.find((t) => t.id === id));
  else if (action === "delete-task") deleteTask(id);
  else if (action === "filter-task") { taskFilter = el.dataset.key; renderTasks(); }
  else if (action === "save-task") saveTask(id);
  else if (action === "new-task") openTaskModal(null);
  else if (action === "new-exam") openTaskModal({ type: "examen" });

  // Calendario
  else if (action === "cal-select") { calSelected = el.dataset.date; renderCalendar(); }

  // Notas
  else if (action === "edit-note") openNoteModal(state.notes.find((n) => n.id === id));
  else if (action === "save-note") saveNote(id);
  else if (action === "delete-note") deleteNote(id);

  // Comunidad
  else if (action === "join-group") toast(`Te has unido a "${el.dataset.name}" 🎉`);
  else if (action === "connect") toast(`Solicitud enviada a ${el.dataset.name} 🤝`);

  // Progreso
  else if (action === "delete-goal") deleteGoal(id);
  else if (action === "save-goal") saveGoal();

  // Autobuses
  else if (action === "bus-route") toast(`Línea ${el.dataset.line}: consulta el horario en tu parada 🚌`);

  // Suscripción
  else if (action === "subscribe") subscribe();
});

// Clicks en backdrop del modal
$("#modal").addEventListener("click", (e) => {
  if (e.target === $("#modal")) closeModal();
});

/* ---------- Eventos de inputs ---------- */
function bindEvents() {
  // Tema
  $("#btn-theme").addEventListener("click", toggleTheme);
  $("#btn-theme-sidebar").addEventListener("click", toggleTheme);
  $("#set-theme").addEventListener("change", (e) => { state.theme = e.target.checked ? "dark" : "light"; saveState(); applyTheme(); });

  // Navegación extra
  $("#btn-settings").addEventListener("click", () => goto("settings"));
  $("#btn-menu").addEventListener("click", () => openMoreSheet());

  // Concentración
  $("#btn-focus").addEventListener("click", () => setFocusMode(!state.focusMode));
  $("#focus-exit").addEventListener("click", () => setFocusMode(false));
  $("#set-focus").addEventListener("change", (e) => setFocusMode(e.target.checked));

  // Ajustes
  $("#set-name").addEventListener("change", (e) => { state.user.name = e.target.value.trim(); saveState(); });
  $("#set-double").addEventListener("change", (e) => { state.user.doubleDegree = e.target.checked; saveState(); toast(e.target.checked ? "Dobles grados activado 🎓" : "Dobles grados desactivado"); });
  $("#set-notif").addEventListener("change", (e) => { state.user.notifications = e.target.checked; saveState(); });
  $("#btn-reset").addEventListener("click", () => {
    confirmDialog("¿Restablecer todos los datos de demostración? Se borrarán tus tareas y apuntes.", () => {
      localStorage.removeItem(STORAGE_KEY);
      state = Object.assign({}, DEFAULT_STATE, { tasks: seedTasks(), notes: seedNotes(), goals: seedGoals() });
      saveState();
      applyTheme();
      goto("home");
      toast("Datos restablecidos");
    });
  });

  // Añadir tarea
  $("#btn-add-task").addEventListener("click", () => openTaskModal(null));

  // Calendario
  $("#cal-prev").addEventListener("click", () => { calCursor.setMonth(calCursor.getMonth() - 1); renderCalendar(); });
  $("#cal-next").addEventListener("click", () => { calCursor.setMonth(calCursor.getMonth() + 1); renderCalendar(); });

  // Pomodoro
  $("#pomo-toggle").addEventListener("click", startPomo);
  $("#pomo-reset").addEventListener("click", resetPomo);
  $$(".pomo-mode").forEach((b) => b.addEventListener("click", () => setPomoMode(b.dataset.mode)));
  $("#set-work").addEventListener("change", () => { pomoRemaining = pomoDuration(pomoMode); renderPomodoro(); });
  $("#set-short").addEventListener("change", () => { if (pomoMode === "short") { pomoRemaining = pomoDuration("short"); renderPomodoro(); } });
  $("#set-long").addEventListener("change", () => { if (pomoMode === "long") { pomoRemaining = pomoDuration("long"); renderPomodoro(); } });

  // Apuntes
  $("#btn-new-note").addEventListener("click", () => openNoteModal(null));
  $("#notes-search").addEventListener("input", renderNotes);

  // Comunidad
  $("#comm-search").addEventListener("input", renderCommunity);

  // Autobuses
  $("#bus-search").addEventListener("input", renderBus);

  // Dobles grados
  $("#btn-split").addEventListener("click", () => {
    const a = $("#double-a").value.trim() || "Carrera A";
    const b = $("#double-b").value.trim() || "Carrera B";
    const hours = Math.max(1, Number($("#double-hours").value) || 30);
    renderSplit(a, b, hours);
  });

  // Progreso
  $("#btn-add-goal").addEventListener("click", openGoalModal);

  // Suscripción
  $("#btn-subscribe").addEventListener("click", subscribe);
}

/* ---------- Inicio ---------- */
function init() {
  buildNav();
  applyTheme();
  bindEvents();
  if (state.focusMode) $("#focus-overlay").hidden = false;
  goto("home");
}

document.addEventListener("DOMContentLoaded", init);
