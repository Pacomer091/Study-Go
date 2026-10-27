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

/* ---------- Utilidades de iconos (Vectores SVG Premium) ---------- */
const ICONS = {
  home: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  tasks: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  calendar: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  pomodoro: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  notes: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/></svg>`,
  community: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  progress: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20v-6"/><path d="M6 20V10"/><path d="M18 20V4"/></svg>`,
  bus: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/></svg>`,
  doubles: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  ods: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  subscription: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  settings: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  more: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>`,
  check: `<svg class="icon-svg" style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
  book: `<svg class="icon-svg" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>`,
  calMini: `<svg class="icon-svg" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  alert: `<svg class="icon-svg" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;color:var(--danger);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
  fileText: `<svg class="icon-svg" style="width:13px;height:13px;vertical-align:-2px;margin-right:3px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>`,
  edit: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  trash: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  sun: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></svg>`,
  moon: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  play: `<svg class="icon-svg" style="width:15px;height:15px;fill:currentColor;" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>`,
  pause: `<svg class="icon-svg" style="width:15px;height:15px;fill:currentColor;" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  clock: `<svg class="icon-svg" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  users: `<svg class="icon-svg" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
  pin: `<svg class="icon-svg" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  bulb: `<svg class="icon-svg" style="width:15px;height:15px;vertical-align:-2px;margin-right:6px;color:var(--amber);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  target: `<svg class="icon-svg" style="width:15px;height:15px;vertical-align:-2px;margin-right:6px;color:var(--primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  userAvatar: `<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  calc: `<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`,
  flag: `<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
  atom: `<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(150 12 12)"/></svg>`,
  columns: `<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="4" y1="4" y2="20"/><line x1="20" x2="20" y1="4" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/><line x1="2" x2="22" y1="4" y2="4"/><line x1="2" x2="22" y1="20" y2="20"/></svg>`
};

/* ---------- Navegación ---------- */
const NAV_ITEMS = [
  { view: "home", ico: ICONS.home, label: "Inicio" },
  { view: "tasks", ico: ICONS.tasks, label: "Tareas" },
  { view: "calendar", ico: ICONS.calendar, label: "Calendario" },
  { view: "pomodoro", ico: ICONS.pomodoro, label: "Pomodoro" },
  { view: "notes", ico: ICONS.notes, label: "Apuntes" },
  { view: "community", ico: ICONS.community, label: "Comunidad" },
  { view: "progress", ico: ICONS.progress, label: "Progreso" },
  { view: "bus", ico: ICONS.bus, label: "Autobuses" },
  { view: "doubles", ico: ICONS.doubles, label: "Dobles grados" },
  { view: "ods", ico: ICONS.ods, label: "ODS" },
  { view: "subscription", ico: ICONS.subscription, label: "Suscripción" },
  { view: "settings", ico: ICONS.settings, label: "Ajustes" },
];

const BOTTOM_NAV = [
  { view: "home", ico: ICONS.home, label: "Inicio" },
  { view: "tasks", ico: ICONS.tasks, label: "Tareas" },
  { view: "calendar", ico: ICONS.calendar, label: "Calendario" },
  { view: "pomodoro", ico: ICONS.pomodoro, label: "Pomodoro" },
  { view: "more", ico: ICONS.more, label: "Más" },
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
  
  const hour = d.getHours();
  const greeting = hour < 12 ? "¡Buenos días" : hour < 20 ? "¡Buenas tardes" : "¡Buenas noches";
  const name = state.user.name || "estudiante";
  const homeH2 = $("#view-home h2");
  if (homeH2) homeH2.innerHTML = `${greeting}, <span id="home-name">${esc(name)}</span>!`;

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
        <p>Nada pendiente para hoy. ¡Todo al día!</p>
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
      <button class="task-check ${t.done ? "done" : ""}" data-action="toggle-task" data-id="${t.id}" aria-label="${t.done ? "Marcar como pendiente" : "Completar tarea"}" title="${t.done ? "Completada (clic para desmarcar)" : "Clic para completar"}">${t.done ? ICONS.check : ""}</button>
      <div class="task-body" data-action="edit-task" data-id="${t.id}" title="Haz clic para ver o editar la tarea">
        <div class="task-title ${t.done ? "done" : ""}">${esc(t.title)}</div>
        <div class="task-meta">
          <span class="chip ${t.type}">${TYPE_LABEL[t.type] || t.type}</span>
          <span class="chip prio-${t.priority}">${PRIO_LABEL[t.priority] || t.priority}</span>
          <span>${ICONS.book}${esc(t.subject)}</span>
          <span style="${overdue ? "color: var(--danger); font-weight:700;" : ""}">${overdue ? `${ICONS.alert}Atrasada (` : ICONS.calMini}${relativeDate(t.date)}${overdue ? ")" : ""}</span>
          ${t.notes ? `<span class="chip chip-notes" title="${esc(t.notes)}">${ICONS.fileText}Nota</span>` : ""}
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn" data-action="edit-task" data-id="${t.id}" aria-label="Editar" title="Editar tarea">${ICONS.edit}</button>
        <button class="icon-btn btn-delete" data-action="delete-task" data-id="${t.id}" aria-label="Eliminar" title="Eliminar tarea">${ICONS.trash}</button>
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

/* ---------- Efectos de sonido y Confetti ---------- */
function playChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // Tono 1 (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.28);

    // Tono 2 (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.1);
    gain2.gain.setValueAtTime(0.14, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.42);
  } catch (e) {
    // Si el navegador bloquea el audio o no está disponible
  }
}

function fireConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const count = 75;
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];
  const particles = Array.from({ length: count }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 180,
    y: canvas.height * 0.42,
    w: Math.random() * 8 + 6,
    h: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -12 - 4,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 12,
    gravity: 0.45,
    alpha: 1,
  }));

  let animId;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rot += p.rotSpeed;
      p.alpha -= 0.014;
      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });
    if (alive) {
      animId = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animId);
    }
  }
  update();
}

function toggleTask(id) {
  const t = state.tasks.find((x) => x.id === id);
  if (t) {
    t.done = !t.done;
    if (t.done) {
      toast("¡Bien hecho! Tarea completada");
      fireConfetti();
      playChime();
    }
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
  $("#pomo-toggle").innerHTML = pomoRunning ? `<span class="btn-ico">${ICONS.pause}</span> Pausar` : `<span class="btn-ico">${ICONS.play}</span> Iniciar`;
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
        toast("¡Sesión completada! Tómate un descanso");
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
      <span class="note-meta">${ICONS.clock}${new Date(n.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>
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
      <button class="btn btn-ghost" data-action="delete-note" data-id="${isEdit ? n.id : ""}" aria-label="Eliminar apunte">${ICONS.trash}</button>
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
  { name: "Matemáticas II — refuerzo", members: 8, subject: "Matemáticas", color: "#6366f1", icon: ICONS.calc },
  { name: "Inglés: preparación examen", members: 5, subject: "Inglés", color: "#ec4899", icon: ICONS.flag },
  { name: "Historia de España", members: 12, subject: "Historia", color: "#f59e0b", icon: ICONS.columns },
  { name: "Física y Química juntos", members: 6, subject: "Física", color: "#10b981", icon: ICONS.atom },
];
const PEOPLE = [
  { name: "Lucía Martín", role: "1º Bachillerato · Ciencias", color: "#6366f1", icon: ICONS.userAvatar },
  { name: "Javier Ruiz", role: "Doble grado Derecho + ADE", color: "#10b981", icon: ICONS.userAvatar },
  { name: "Sara Gómez", role: "4º ESO", color: "#ec4899", icon: ICONS.userAvatar },
  { name: "Hugo López", role: "2º Bachillerato · Letras", color: "#f59e0b", icon: ICONS.userAvatar },
];

function renderCommunity() {
  const q = ($("#comm-search").value || "").toLowerCase();
  const groups = GROUPS.filter((g) => !q || g.name.toLowerCase().includes(q) || g.subject.toLowerCase().includes(q));
  const people = PEOPLE.filter((p) => !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));

  $("#groups-list").innerHTML = groups.map((g) => `
    <div class="card">
      <div class="avatar" style="background:${g.color}">${g.icon}</div>
      <div class="task-body">
        <div class="task-title">${esc(g.name)}</div>
        <div class="task-meta"><span>${ICONS.users}${g.members} miembros</span><span>${ICONS.book}${esc(g.subject)}</span></div>
      </div>
      <button class="btn btn-ghost" data-action="join-group" data-name="${esc(g.name)}">Unirme</button>
    </div>`).join("") || `<div class="empty">No se encontraron grupos.</div>`;

  $("#people-list").innerHTML = people.map((p) => `
    <div class="card">
      <div class="avatar" style="background:${p.color}">${p.icon}</div>
      <div class="task-body">
        <div class="task-title">${esc(p.name)}</div>
        <div class="task-meta"><span>${ICONS.doubles}${esc(p.role)}</span></div>
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
        <div class="goal-title">${ICONS.target} ${esc(g.title)}</div>
        <div class="goal-track"><div class="goal-fill" style="width:${gp}%"></div></div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="goal-pct">${gp}%</span>
        <button class="icon-btn" data-action="delete-goal" data-id="${g.id}" aria-label="Eliminar objetivo">${ICONS.trash}</button>
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
        <div class="task-meta"><span>${ICONS.pin}${esc(b.dest)}</span><span>${ICONS.clock}Frecuencia ${esc(b.freq)}</span></div>
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
        <div class="task-title">${ICONS.bulb} ${esc(t.title)}</div>
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
  $("#sub-status").textContent = state.subscription ? "Estado: suscripción solidaria activa" : "Estado: plan gratuito";
  $("#btn-subscribe").textContent = state.subscription ? "Ya eres parte de la suscripción solidaria" : "Unirme a la suscripción solidaria";
}
function subscribe() {
  state.subscription = true;
  saveState();
  toast("¡Gracias por unirte a la causa solidaria!");
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
  const isDark = state.theme === "dark";
  const ico = isDark ? ICONS.sun : ICONS.moon;
  $("#btn-theme").innerHTML = ico;
  $("#btn-theme-sidebar").innerHTML = `<span class="ico">${ico}</span> ${isDark ? "Modo claro" : "Modo oscuro"}`;
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
  if (on) toast("Modo concentración activado");
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
  else if (action === "join-group") toast(`Te has unido a "${el.dataset.name}"`);
  else if (action === "connect") toast(`Solicitud enviada a ${el.dataset.name}`);

  // Progreso
  else if (action === "delete-goal") deleteGoal(id);
  else if (action === "save-goal") saveGoal();

  // Autobuses
  else if (action === "bus-route") toast(`Línea ${el.dataset.line}: consulta el horario en tu parada`);

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
  $("#set-double").addEventListener("change", (e) => { state.user.doubleDegree = e.target.checked; saveState(); toast(e.target.checked ? "Dobles grados activado" : "Dobles grados desactivado"); });
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
