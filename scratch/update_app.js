const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

// 1. Definición de ICONS
const iconsDef = `/* ---------- Utilidades de iconos (Vectores SVG Premium) ---------- */
const ICONS = {
  home: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>\`,
  tasks: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>\`,
  calendar: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>\`,
  pomodoro: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>\`,
  notes: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/></svg>\`,
  community: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>\`,
  progress: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20v-6"/><path d="M6 20V10"/><path d="M18 20V4"/></svg>\`,
  bus: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/></svg>\`,
  doubles: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>\`,
  ods: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>\`,
  subscription: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>\`,
  settings: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>\`,
  more: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>\`,
  check: \`<svg class="icon-svg" style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>\`,
  book: \`<svg class="icon-svg" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>\`,
  calMini: \`<svg class="icon-svg" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>\`,
  alert: \`<svg class="icon-svg" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;color:var(--danger);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>\`,
  fileText: \`<svg class="icon-svg" style="width:13px;height:13px;vertical-align:-2px;margin-right:3px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>\`,
  edit: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>\`,
  trash: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>\`,
  sun: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" x2="12" y1="1" y2="3"/><line x1="12" x2="12" y1="21" y2="23"/><line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/><line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/><line x1="1" x2="3" y1="12" y2="12"/><line x1="21" x2="23" y1="12" y2="12"/><line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/><line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/></svg>\`,
  moon: \`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>\`,
  play: \`<svg class="icon-svg" style="width:15px;height:15px;fill:currentColor;" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>\`,
  pause: \`<svg class="icon-svg" style="width:15px;height:15px;fill:currentColor;" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>\`,
  clock: \`<svg class="icon-svg" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>\`,
  users: \`<svg class="icon-svg" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>\`,
  pin: \`<svg class="icon-svg" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>\`,
  bulb: \`<svg class="icon-svg" style="width:15px;height:15px;vertical-align:-2px;margin-right:6px;color:var(--amber);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>\`,
  target: \`<svg class="icon-svg" style="width:15px;height:15px;vertical-align:-2px;margin-right:6px;color:var(--primary);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>\`,
  userAvatar: \`<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>\`,
  calc: \`<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>\`,
  flag: \`<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>\`,
  atom: \`<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(150 12 12)"/></svg>\`,
  columns: \`<svg class="icon-svg" style="width:20px;height:20px;color:#fff;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="4" y1="4" y2="20"/><line x1="20" x2="20" y1="4" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/><line x1="2" x2="22" y1="4" y2="4"/><line x1="2" x2="22" y1="20" y2="20"/></svg>\`
};
`;

code = code.replace('/* ---------- Navegación ---------- */', iconsDef + '\n/* ---------- Navegación ---------- */');

// 2. NAV_ITEMS y BOTTOM_NAV
const oldNav = `const NAV_ITEMS = [
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
];`;

const newNav = `const NAV_ITEMS = [
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
];`;

code = code.replace(oldNav, newNav);

// 3. renderHome greeting
const oldGreeting = `  const hour = d.getHours();
  const greeting = hour < 12 ? "¡Buenos días" : hour < 20 ? "¡Buenas tardes" : "¡Buenas noches";
  const name = state.user.name || "estudiante";
  const emoji = hour < 12 ? "☀️" : hour < 20 ? "🌤️" : "🌙";
  const homeH2 = $("#view-home h2");
  if (homeH2) homeH2.innerHTML = \`\${greeting}, <span id="home-name">\${esc(name)}</span>! \${emoji}\`;`;

const newGreeting = `  const hour = d.getHours();
  const greeting = hour < 12 ? "¡Buenos días" : hour < 20 ? "¡Buenas tardes" : "¡Buenas noches";
  const name = state.user.name || "estudiante";
  const homeH2 = $("#view-home h2");
  if (homeH2) homeH2.innerHTML = \`\${greeting}, <span id="home-name">\${esc(name)}</span>!\`;`;

code = code.replace(oldGreeting, newGreeting);

// Empty home today
code = code.replace('<p>Nada pendiente para hoy 🎉</p>', '<p>Nada pendiente para hoy. ¡Todo al día!</p>');

// 4. taskCard
const oldTaskCard = `function taskCard(t) {
  const overdue = !t.done && t.date < todayISO();
  return \`
    <div class="card task-item" data-task-id="\${t.id}">
      <button class="task-check \${t.done ? "done" : ""}" data-action="toggle-task" data-id="\${t.id}" aria-label="\${t.done ? "Marcar como pendiente" : "Completar tarea"}" title="\${t.done ? "Completada (clic para desmarcar)" : "Clic para completar"}">\${t.done ? "✓" : ""}</button>
      <div class="task-body" data-action="edit-task" data-id="\${t.id}" title="Haz clic para ver o editar la tarea">
        <div class="task-title \${t.done ? "done" : ""}">\${esc(t.title)}</div>
        <div class="task-meta">
          <span class="chip \${t.type}">\${TYPE_LABEL[t.type] || t.type}</span>
          <span class="chip prio-\${t.priority}">\${PRIO_LABEL[t.priority] || t.priority}</span>
          <span>📘 \${esc(t.subject)}</span>
          <span style="\${overdue ? "color: var(--danger); font-weight:700;" : ""}">\${overdue ? "⚠️ Atrasada (" : "📆 "}\${relativeDate(t.date)}\${overdue ? ")" : ""}</span>
          \${t.notes ? \`<span class="chip chip-notes" title="\${esc(t.notes)}">📝 Nota</span>\` : ""}
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn" data-action="edit-task" data-id="\${t.id}" aria-label="Editar" title="Editar tarea">✏️</button>
        <button class="icon-btn btn-delete" data-action="delete-task" data-id="\${t.id}" aria-label="Eliminar" title="Eliminar tarea">🗑️</button>
      </div>
    </div>\`;
}`;

const newTaskCard = `function taskCard(t) {
  const overdue = !t.done && t.date < todayISO();
  return \`
    <div class="card task-item" data-task-id="\${t.id}">
      <button class="task-check \${t.done ? "done" : ""}" data-action="toggle-task" data-id="\${t.id}" aria-label="\${t.done ? "Marcar como pendiente" : "Completar tarea"}" title="\${t.done ? "Completada (clic para desmarcar)" : "Clic para completar"}">\${t.done ? ICONS.check : ""}</button>
      <div class="task-body" data-action="edit-task" data-id="\${t.id}" title="Haz clic para ver o editar la tarea">
        <div class="task-title \${t.done ? "done" : ""}">\${esc(t.title)}</div>
        <div class="task-meta">
          <span class="chip \${t.type}">\${TYPE_LABEL[t.type] || t.type}</span>
          <span class="chip prio-\${t.priority}">\${PRIO_LABEL[t.priority] || t.priority}</span>
          <span>\${ICONS.book}\${esc(t.subject)}</span>
          <span style="\${overdue ? "color: var(--danger); font-weight:700;" : ""}">\${overdue ? \`\${ICONS.alert}Atrasada (\` : ICONS.calMini}\${relativeDate(t.date)}\${overdue ? ")" : ""}</span>
          \${t.notes ? \`<span class="chip chip-notes" title="\${esc(t.notes)}">\${ICONS.fileText}Nota</span>\` : ""}
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn" data-action="edit-task" data-id="\${t.id}" aria-label="Editar" title="Editar tarea">\${ICONS.edit}</button>
        <button class="icon-btn btn-delete" data-action="delete-task" data-id="\${t.id}" aria-label="Eliminar" title="Eliminar tarea">\${ICONS.trash}</button>
      </div>
    </div>\`;
}`;

code = code.replace(oldTaskCard, newTaskCard);

// 5. toggleTask toast
code = code.replace('toast("¡Bien hecho! 🎉");', 'toast("¡Bien hecho! Tarea completada");');

// 6. renderPomodoro
code = code.replace('$("#pomo-toggle").textContent = pomoRunning ? "⏸ Pausar" : "▶ Iniciar";', '$("#pomo-toggle").innerHTML = pomoRunning ? `<span class="btn-ico">${ICONS.pause}</span> Pausar` : `<span class="btn-ico">${ICONS.play}</span> Iniciar`;');
code = code.replace('toast("¡Sesión completada! Tómate un descanso 🎉");', 'toast("¡Sesión completada! Tómate un descanso");');

// 7. Notes
code = code.replace('<span class="note-meta">🕐 ${new Date(n.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>', '<span class="note-meta">${ICONS.clock}${new Date(n.updatedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>');
code = code.replace('<button class="btn btn-ghost" data-action="delete-note" data-id="${isEdit ? n.id : ""}">🗑️</button>', '<button class="btn btn-ghost" data-action="delete-note" data-id="${isEdit ? n.id : ""}" aria-label="Eliminar apunte">${ICONS.trash}</button>');

// 8. GROUPS & PEOPLE
const oldGroups = `const GROUPS = [
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
];`;

const newGroups = `const GROUPS = [
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
];`;

code = code.replace(oldGroups, newGroups);

// In renderCommunity
const oldCommunityRender = `  $("#groups-list").innerHTML = groups.map((g) => \`
    <div class="card">
      <div class="avatar" style="background:\${g.color}">\${g.emoji}</div>
      <div class="task-body">
        <div class="task-title">\${esc(g.name)}</div>
        <div class="task-meta"><span>👥 \${g.members} miembros</span><span>📘 \${esc(g.subject)}</span></div>
      </div>
      <button class="btn btn-ghost" data-action="join-group" data-name="\${esc(g.name)}">Unirme</button>
    </div>\`).join("") || \`<div class="empty">No se encontraron grupos.</div>\`;

  $("#people-list").innerHTML = people.map((p) => \`
    <div class="card">
      <div class="avatar" style="background:\${p.color}">\${p.emoji}</div>
      <div class="task-body">
        <div class="task-title">\${esc(p.name)}</div>
        <div class="task-meta"><span>🎓 \${esc(p.role)}</span></div>
      </div>
      <button class="btn btn-ghost" data-action="connect" data-name="\${esc(p.name)}">Conectar</button>
    </div>\`).join("") || \`<div class="empty">No se encontraron compañeros.</div>\`;`;

const newCommunityRender = `  $("#groups-list").innerHTML = groups.map((g) => \`
    <div class="card">
      <div class="avatar" style="background:\${g.color}">\${g.icon}</div>
      <div class="task-body">
        <div class="task-title">\${esc(g.name)}</div>
        <div class="task-meta"><span>\${ICONS.users}\${g.members} miembros</span><span>\${ICONS.book}\${esc(g.subject)}</span></div>
      </div>
      <button class="btn btn-ghost" data-action="join-group" data-name="\${esc(g.name)}">Unirme</button>
    </div>\`).join("") || \`<div class="empty">No se encontraron grupos.</div>\`;

  $("#people-list").innerHTML = people.map((p) => \`
    <div class="card">
      <div class="avatar" style="background:\${p.color}">\${p.icon}</div>
      <div class="task-body">
        <div class="task-title">\${esc(p.name)}</div>
        <div class="task-meta"><span>\${ICONS.doubles}\${esc(p.role)}</span></div>
      </div>
      <button class="btn btn-ghost" data-action="connect" data-name="\${esc(p.name)}">Conectar</button>
    </div>\`).join("") || \`<div class="empty">No se encontraron compañeros.</div>\`;`;

code = code.replace(oldCommunityRender, newCommunityRender);

// 9. Goals
const oldGoal = `<div class="goal-title">🎯 \${esc(g.title)}</div>
        <div class="goal-track"><div class="goal-fill" style="width:\${gp}%"></div></div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="goal-pct">\${gp}%</span>
        <button class="icon-btn" data-action="delete-goal" data-id="\${g.id}" aria-label="Eliminar objetivo">🗑️</button>`;

const newGoal = `<div class="goal-title">\${ICONS.target} \${esc(g.title)}</div>
        <div class="goal-track"><div class="goal-fill" style="width:\${gp}%"></div></div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <span class="goal-pct">\${gp}%</span>
        <button class="icon-btn" data-action="delete-goal" data-id="\${g.id}" aria-label="Eliminar objetivo">\${ICONS.trash}</button>`;

code = code.replace(oldGoal, newGoal);

// 10. Bus
const oldBus = `        <div class="task-title">\${esc(b.name)}</div>
        <div class="task-meta"><span>📍 \${esc(b.dest)}</span><span>⏱️ Frecuencia \${esc(b.freq)}</span></div>`;

const newBus = `        <div class="task-title">\${esc(b.name)}</div>
        <div class="task-meta"><span>\${ICONS.pin}\${esc(b.dest)}</span><span>\${ICONS.clock}Frecuencia \${esc(b.freq)}</span></div>`;

code = code.replace(oldBus, newBus);

// 11. Doubles tips
code = code.replace('<div class="task-title">💡 ${esc(t.title)}</div>', '<div class="task-title">${ICONS.bulb} ${esc(t.title)}</div>');

// 12. Subscription
code = code.replace('$("#sub-status").textContent = state.subscription ? "Estado: suscripción solidaria activa 💚" : "Estado: plan gratuito";', '$("#sub-status").textContent = state.subscription ? "Estado: suscripción solidaria activa" : "Estado: plan gratuito";');
code = code.replace('$("#btn-subscribe").textContent = state.subscription ? "✅ Ya eres parte de la suscripción solidaria" : "Unirme a la suscripción solidaria";', '$("#btn-subscribe").textContent = state.subscription ? "Ya eres parte de la suscripción solidaria" : "Unirme a la suscripción solidaria";');
code = code.replace('toast("¡Gracias por unirte! 💚");', 'toast("¡Gracias por unirte a la causa solidaria!");');

// 13. Theme
const oldTheme = `function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const ico = state.theme === "dark" ? "☀️" : "🌙";
  $("#btn-theme").textContent = ico;
  $("#btn-theme-sidebar").innerHTML = \`<span class="ico">\${ico}</span> \${state.theme === "dark" ? "Modo claro" : "Modo oscuro"}\`;
}`;

const newTheme = `function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  const isDark = state.theme === "dark";
  const ico = isDark ? ICONS.sun : ICONS.moon;
  $("#btn-theme").innerHTML = ico;
  $("#btn-theme-sidebar").innerHTML = \`<span class="ico">\${ico}</span> \${isDark ? "Modo claro" : "Modo oscuro"}\`;
}`;

code = code.replace(oldTheme, newTheme);

// 14. Remaining toasts
code = code.replace('if (on) toast("Modo concentración activado 🧘");', 'if (on) toast("Modo concentración activado");');
code = code.replace('toast(`Te has unido a "${el.dataset.name}" 🎉`);', 'toast(`Te has unido a "${el.dataset.name}"`);');
code = code.replace('toast(`Solicitud enviada a ${el.dataset.name} 🤝`);', 'toast(`Solicitud enviada a ${el.dataset.name}`);');
code = code.replace('toast(`Línea ${el.dataset.line}: consulta el horario en tu parada 🚌`);', 'toast(`Línea ${el.dataset.line}: consulta el horario en tu parada`);');
code = code.replace('toast(e.target.checked ? "Dobles grados activado 🎓" : "Dobles grados desactivado");', 'toast(e.target.checked ? "Dobles grados activado" : "Dobles grados desactivado");');

fs.writeFileSync('app.js', code, 'utf8');
console.log('app.js updated successfully!');
