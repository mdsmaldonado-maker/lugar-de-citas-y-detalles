/* ============================================================
   script.js
   Lógica de toda la plataforma "Juntos".
   Un solo archivo compartido por todas las páginas: cada función
   de inicialización revisa si sus elementos existen antes de
   hacer algo, así es seguro llamarlas todas desde cualquier página.
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     0. RUTAS RELATIVAS SEGÚN LA PROFUNDIDAD DE LA PÁGINA
     ============================================================ */

  const IN_PAGES = /\/pages\//.test(location.pathname);
  const IN_ADMIN = /\/admin\//.test(location.pathname);
  const PAGES_DIR = IN_PAGES ? "" : IN_ADMIN ? "../pages/" : "pages/";

  function ideaDetailHref(id) {
    return `${PAGES_DIR}detalle.html?id=${id}`;
  }
  function plannerHref(id) {
    return `${PAGES_DIR}planificador.html?id=${id}`;
  }

  /* ============================================================
     1. ETIQUETAS Y CONSTANTES COMPARTIDAS
     ============================================================ */

  const LABELS = {
    categoria: { parejas: "❤️ Parejas", amigos: "👥 Amigos" },
    tipo: {
      salida: "Salida", detalle: "Detalle", regalo: "Regalo",
      manualidad: "Manualidad", cita: "Cita", sorpresa: "Sorpresa",
      actividad: "Actividad", juego: "Juego", reunion: "Reunión",
      "plan-economico": "Plan económico", experiencia: "Experiencia"
    },
    ocasion: {
      aniversario: "Aniversario", cumpleanos: "Cumpleaños",
      "san-valentin": "San Valentín", cita: "Cita",
      reconciliacion: "Reconciliación", reunion: "Reunión",
      celebracion: "Celebración", "dia-especial": "Día especial",
      "sin-ocasion": "Sin ocasión"
    },
    presupuesto: { gratis: "Gratis", economico: "Económico", medio: "Medio", alto: "Alto" },
    tiempo: {
      "menos-1h": "Menos de 1 hora", "1-2h": "1–2 horas",
      "medio-dia": "Medio día", "todo-el-dia": "Todo el día"
    },
    dificultad: { facil: "Fácil", intermedia: "Intermedia", dificil: "Difícil" },
    personas: { "2": "2 personas", "3-5": "3–5 personas", "6-10": "6–10 personas", "mas-10": "Más de 10" }
  };

  const OCASION_EMOJI = {
    aniversario: "❤️", cumpleanos: "🎂", "san-valentin": "💘",
    cita: "💑", reconciliacion: "🤝", reunion: "👥",
    celebracion: "🎉", "dia-especial": "✨", "sin-ocasion": "🙂"
  };

  const ESTADO_LABELS = {
    aprobada: "🟢 Aprobada", pendiente: "🟡 Pendiente", rechazada: "🔴 Rechazada"
  };

  const STORAGE_KEYS = {
    PLANS: "juntos:plans",
    SAVED: "juntos:saved-ideas",
    EXTRA_IDEAS: "juntos:extra-ideas",
    OVERRIDES: "juntos:idea-overrides",
    DELETED: "juntos:deleted-ideas"
  };

  /* ============================================================
     2. UTILIDADES GENERALES
     ============================================================ */

  function pad(n) { return String(n).padStart(2, "0"); }

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  function formatDateReadable(dateStr) {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${d} ${MESES_CORTOS[m - 1]} ${y}`;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function slugify(str) {
    return String(str)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 30);
  }

  function truncate(str, n) {
    return str && str.length > n ? str.slice(0, n - 1).trim() + "…" : str;
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* almacenamiento no disponible */ }
  }

  /* ============================================================
     3. "BASE DE DATOS" SIMULADA (localStorage sobre data.js)
     ============================================================ */

  function getOverrides() { return readJSON(STORAGE_KEYS.OVERRIDES, {}); }
  function saveOverrides(obj) { writeJSON(STORAGE_KEYS.OVERRIDES, obj); }
  function setIdeaOverride(id, partial) {
    const ov = getOverrides();
    ov[id] = { ...(ov[id] || {}), ...partial };
    saveOverrides(ov);
  }

  function getExtraIdeas() { return readJSON(STORAGE_KEYS.EXTRA_IDEAS, []); }
  function saveExtraIdeas(list) { writeJSON(STORAGE_KEYS.EXTRA_IDEAS, list); }
  function addExtraIdea(idea) {
    const list = getExtraIdeas();
    list.push(idea);
    saveExtraIdeas(list);
  }
  function nextExtraId() {
    const list = getExtraIdeas();
    return list.reduce((max, i) => Math.max(max, i.id), 999) + 1;
  }

  function getDeletedIds() { return readJSON(STORAGE_KEYS.DELETED, []); }
  function markIdeaDeleted(id) {
    const list = getDeletedIds();
    if (!list.includes(id)) list.push(id);
    writeJSON(STORAGE_KEYS.DELETED, list);
  }
  function deleteIdea(id) {
    const extra = getExtraIdeas();
    if (extra.some((i) => i.id === id)) {
      saveExtraIdeas(extra.filter((i) => i.id !== id));
    } else {
      markIdeaDeleted(id);
    }
  }

  function getAllIdeas() {
    const overrides = getOverrides();
    const deleted = getDeletedIds();
    const base = (window.IDEAS_DATA || []).map((idea) =>
      overrides[idea.id] ? { ...idea, ...overrides[idea.id] } : idea
    );
    const extra = getExtraIdeas().map((idea) =>
      overrides[idea.id] ? { ...idea, ...overrides[idea.id] } : idea
    );
    return [...base, ...extra].filter((idea) => !deleted.includes(idea.id));
  }

  function getSavedIdeaIds() { return readJSON(STORAGE_KEYS.SAVED, []); }
  function toggleSavedIdea(id) {
    let saved = getSavedIdeaIds();
    saved = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    writeJSON(STORAGE_KEYS.SAVED, saved);
  }

  function getPlans() { return readJSON(STORAGE_KEYS.PLANS, []); }
  function savePlans(list) { writeJSON(STORAGE_KEYS.PLANS, list); }
  function addPlan(plan) { const list = getPlans(); list.push(plan); savePlans(list); return plan; }
  function updatePlan(id, partial) {
    const list = getPlans();
    const idx = list.findIndex((p) => p.id === id);
    if (idx > -1) { list[idx] = { ...list[idx], ...partial }; savePlans(list); }
  }
  function deletePlan(id) { savePlans(getPlans().filter((p) => p.id !== id)); }
  function nextPlanId() { return Date.now(); }

  /* ============================================================
     4. TARJETA DE IDEA (usada en home, listados y relacionadas)
     ============================================================ */

  function createIdeaCardHTML(idea) {
    const emoji = idea.categoria === "parejas" ? "❤️" : "👥";
    const pills = [
      LABELS.ocasion[idea.ocasion] || idea.ocasion,
      LABELS.presupuesto[idea.presupuesto] || idea.presupuesto,
      idea.duracion,
      LABELS.dificultad[idea.dificultad] || idea.dificultad
    ];
    return `
      <article class="idea-card">
        <div class="idea-card-top">
          <span class="idea-card-emoji" aria-hidden="true">${emoji}</span>
          <span class="idea-card-category">${LABELS.categoria[idea.categoria]}</span>
        </div>
        <h3 class="idea-card-title">${escapeHtml(idea.nombre)}</h3>
        <p class="idea-card-desc">${escapeHtml(truncate(idea.descripcion, 100))}</p>
        <div class="idea-card-pills">
          ${pills.map((p) => `<span class="pill">${escapeHtml(p)}</span>`).join("")}
        </div>
        <div class="idea-card-actions">
          <a href="${ideaDetailHref(idea.id)}" class="btn btn--text btn--small">Ver idea</a>
          <a href="${plannerHref(idea.id)}" class="btn btn--primary btn--small">Planificar</a>
        </div>
      </article>
    `;
  }

  /* ============================================================
     5. NAVEGACIÓN Y BUSCADOR
     ============================================================ */

  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function initAdminSidebar() {
    const toggle = document.getElementById("admin-sidebar-toggle");
    const sidebar = document.querySelector(".admin-sidebar");
    if (!toggle || !sidebar) return;
    toggle.addEventListener("click", () => sidebar.classList.toggle("is-open"));
  }

  function initSearchIcon() {
    const btn = document.getElementById("open-search");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const heroInput = document.getElementById("hero-search");
      if (heroInput) {
        heroInput.focus();
        heroInput.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const homeHref = document.querySelector(".logo").getAttribute("href");
      const sep = homeHref.includes("?") ? "&" : "?";
      window.location.href = homeHref + sep + "focus=search";
    });
  }

  function matchesQuery(idea, q) {
    const hay = `${idea.nombre} ${idea.descripcion} ${LABELS.tipo[idea.tipo] || ""} ${LABELS.ocasion[idea.ocasion] || ""} ${idea.categoria}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function initHeroSearch() {
    const form = document.getElementById("hero-search-form");
    if (!form) return;
    const input = document.getElementById("hero-search");
    const grid = document.getElementById("recommendations-grid");

    document.querySelectorAll(".chip[data-query]").forEach((chip) => {
      chip.addEventListener("click", () => {
        input.value = chip.dataset.query;
        form.requestSubmit();
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q || !grid) return;
      const results = getAllIdeas().filter((i) => i.estado === "aprobada" && matchesQuery(i, q));
      grid.innerHTML = results.length
        ? results.map(createIdeaCardHTML).join("")
        : `<p class="grid-empty-state">No encontramos ideas para "${escapeHtml(q)}". Prueba con otra palabra.</p>`;
      grid.dataset.loading = "false";
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (new URLSearchParams(location.search).get("focus") === "search") {
      input.focus();
    }
  }

  function initRecommendations() {
    const grid = document.getElementById("recommendations-grid");
    if (!grid) return;
    const ideas = getAllIdeas().filter((i) => i.estado === "aprobada");
    const picks = [...ideas].sort((a, b) => b.vistas - a.vistas).slice(0, 6);
    grid.innerHTML = picks.map(createIdeaCardHTML).join("");
    grid.dataset.loading = "false";
  }

  /* ============================================================
     6. FILAS REPETIBLES (actividades / materiales / pasos)
     ============================================================ */

  function initRepeatableRows({ listId, addBtnId, createRow }) {
    const list = document.getElementById(listId);
    const addBtn = document.getElementById(addBtnId);
    if (!list || !addBtn) return;
    addBtn.addEventListener("click", () => list.appendChild(createRow()));
    list.addEventListener("click", (e) => {
      if (!e.target.classList.contains("activity-remove")) return;
      const row = e.target.closest(".activity-row");
      if (list.children.length > 1) row.remove();
      else row.querySelectorAll("input").forEach((i) => (i.value = ""));
    });
  }

  function createActivityRow(hora = "", nombre = "") {
    const div = document.createElement("div");
    div.className = "activity-row";
    div.setAttribute("data-activity-row", "");
    div.innerHTML = `
      <input type="time" name="actividad-hora" class="activity-hora" aria-label="Hora de la actividad" value="${hora}">
      <input type="text" name="actividad-nombre" class="activity-nombre" placeholder="Ej. Cena, película, regalo…" aria-label="Nombre de la actividad" value="${escapeHtml(nombre)}">
      <button type="button" class="activity-remove" aria-label="Eliminar actividad">✕</button>
    `;
    return div;
  }

  function createMaterialRow(value = "") {
    const div = document.createElement("div");
    div.className = "activity-row";
    div.setAttribute("data-material-row", "");
    div.innerHTML = `
      <input type="text" name="material" class="activity-nombre" placeholder="Ej. Cartulina, velas, globos…" aria-label="Material" value="${escapeHtml(value)}">
      <button type="button" class="activity-remove" aria-label="Eliminar material">✕</button>
    `;
    return div;
  }

  function createStepRow(value = "") {
    const div = document.createElement("div");
    div.className = "activity-row";
    div.setAttribute("data-step-row", "");
    div.innerHTML = `
      <input type="text" name="paso" class="activity-nombre" placeholder="Ej. Reserva el lugar con anticipación…" aria-label="Paso" value="${escapeHtml(value)}">
      <button type="button" class="activity-remove" aria-label="Eliminar paso">✕</button>
    `;
    return div;
  }

  /* ============================================================
     7. LISTADOS CON FILTROS (parejas.html / amigos.html)
     ============================================================ */

  function initBrowsePage() {
    const grid = document.getElementById("ideas-grid");
    if (!grid) return;

    const categoria = grid.dataset.categoria;
    const form = document.getElementById("filters-form");
    const resultsCount = document.getElementById("results-count");
    const sortSelect = document.getElementById("sort-select");
    const filtersCount = document.getElementById("filters-count");
    const filtersToggle = document.getElementById("filters-toggle");
    const filtersPanel = document.getElementById("filters-panel");
    const clearBtn = document.getElementById("filters-clear");

    const ORDER_PRESUPUESTO = { gratis: 0, economico: 1, medio: 2, alto: 3 };
    const ORDER_TIEMPO = { "menos-1h": 0, "1-2h": 1, "medio-dia": 2, "todo-el-dia": 3 };
    const ORDER_DIFICULTAD = { facil: 0, intermedia: 1, dificil: 2 };

    function getSelected(name) {
      return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((i) => i.value);
    }

    function applyFilters() {
      let ideas = getAllIdeas().filter((i) => i.categoria === categoria && i.estado === "aprobada");

      const tipos = getSelected("tipo");
      const ocasiones = getSelected("ocasion");
      const presupuestos = getSelected("presupuesto");
      const tiempos = getSelected("tiempo");
      const dificultades = getSelected("dificultad");
      const personas = getSelected("personas");

      if (tipos.length) ideas = ideas.filter((i) => tipos.includes(i.tipo));
      if (ocasiones.length) ideas = ideas.filter((i) => ocasiones.includes(i.ocasion));
      if (presupuestos.length) ideas = ideas.filter((i) => presupuestos.includes(i.presupuesto));
      if (tiempos.length) ideas = ideas.filter((i) => tiempos.includes(i.tiempo));
      if (dificultades.length) ideas = ideas.filter((i) => dificultades.includes(i.dificultad));
      if (personas.length) ideas = ideas.filter((i) => personas.includes(i.personas));

      switch (sortSelect.value) {
        case "presupuesto-asc":
          ideas.sort((a, b) => ORDER_PRESUPUESTO[a.presupuesto] - ORDER_PRESUPUESTO[b.presupuesto]);
          break;
        case "tiempo-asc":
          ideas.sort((a, b) => ORDER_TIEMPO[a.tiempo] - ORDER_TIEMPO[b.tiempo]);
          break;
        case "dificultad-asc":
          ideas.sort((a, b) => ORDER_DIFICULTAD[a.dificultad] - ORDER_DIFICULTAD[b.dificultad]);
          break;
      }

      grid.innerHTML = ideas.length
        ? ideas.map(createIdeaCardHTML).join("")
        : '<p class="grid-empty-state">No encontramos ideas con estos filtros. Prueba quitando alguno.</p>';
      grid.dataset.loading = "false";

      resultsCount.textContent = `${ideas.length} idea${ideas.length === 1 ? "" : "s"} encontrada${ideas.length === 1 ? "" : "s"}`;

      const activeCount = tipos.length + ocasiones.length + presupuestos.length + tiempos.length + dificultades.length + personas.length;
      filtersCount.hidden = activeCount === 0;
      filtersCount.textContent = activeCount;
    }

    form.addEventListener("change", applyFilters);
    sortSelect.addEventListener("change", applyFilters);
    clearBtn.addEventListener("click", () => { form.reset(); applyFilters(); });
    filtersToggle.addEventListener("click", () => {
      const isOpen = filtersPanel.classList.toggle("is-open");
      filtersToggle.setAttribute("aria-expanded", String(isOpen));
    });

    applyFilters();
  }

  /* ============================================================
     8. DETALLE DE UNA IDEA
     ============================================================ */

  function initIdeaDetail() {
    const container = document.getElementById("idea-detail");
    if (!container) return;

    const id = Number(new URLSearchParams(location.search).get("id"));
    const idea = getAllIdeas().find((i) => i.id === id);
    const notFound = document.getElementById("idea-not-found");

    if (!idea) {
      container.hidden = true;
      if (notFound) notFound.hidden = false;
      return;
    }

    document.title = `${idea.nombre} | Juntos`;
    document.documentElement.dataset.theme = idea.categoria === "parejas" ? "couple" : "friends";

    const breadcrumbCategory = document.getElementById("breadcrumb-category");
    breadcrumbCategory.textContent = idea.categoria === "parejas" ? "Parejas" : "Amigos";
    breadcrumbCategory.href = idea.categoria === "parejas" ? "parejas.html" : "amigos.html";
    document.getElementById("breadcrumb-current").textContent = idea.nombre;

    document.getElementById("idea-title").textContent = idea.nombre;
    document.getElementById("idea-description").textContent = idea.descripcion;

    const tags = [
      LABELS.categoria[idea.categoria],
      LABELS.ocasion[idea.ocasion],
      LABELS.presupuesto[idea.presupuesto],
      idea.duracion,
      LABELS.dificultad[idea.dificultad]
    ];
    if (idea.personas) tags.push(LABELS.personas[idea.personas] || idea.personas);
    document.getElementById("idea-tags").innerHTML = tags.map((t) => `<span class="pill">${escapeHtml(t)}</span>`).join("");

    document.getElementById("idea-materials").innerHTML = (idea.materiales || []).map((m) => `<li>${escapeHtml(m)}</li>`).join("");
    document.getElementById("idea-steps").innerHTML = (idea.instrucciones || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("");

    document.getElementById("pinterest-link").href = idea.pinterest || "#";
    document.getElementById("tiktok-link").href = idea.tiktok || "#";
    document.getElementById("instagram-link").href = idea.instagram || "#";

    document.getElementById("plan-idea-btn").href = `planificador.html?id=${idea.id}`;

    const backLink = document.getElementById("back-link");
    backLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (document.referrer && document.referrer.includes(location.host)) history.back();
      else window.location.href = idea.categoria === "parejas" ? "parejas.html" : "amigos.html";
    });

    const saveBtn = document.getElementById("save-idea-btn");
    function refreshSaveBtn() {
      const saved = getSavedIdeaIds().includes(idea.id);
      const label = saveBtn.querySelector("[data-save-label]");
      if (label) label.textContent = saved ? "Guardada" : "Guardar idea";
      saveBtn.classList.toggle("is-saved", saved);
    }
    saveBtn.addEventListener("click", () => { toggleSavedIdea(idea.id); refreshSaveBtn(); });
    refreshSaveBtn();

    const relatedGrid = document.getElementById("related-grid");
    const related = getAllIdeas()
      .filter((i) => i.id !== idea.id && i.estado === "aprobada" && (i.tipo === idea.tipo || i.categoria === idea.categoria))
      .slice(0, 3);
    relatedGrid.innerHTML = related.map(createIdeaCardHTML).join("");
  }

  /* ============================================================
     9. PLANIFICADOR
     ============================================================ */

  function fillFormFromPlan(form, plan) {
    form.nombre.value = plan.nombre || "";
    form.para.value = plan.para || "";
    form.ocasion.value = plan.ocasion || "";
    form.fecha.value = plan.fecha || "";
    form.hora.value = plan.hora || "";
    form.lugar.value = plan.lugar || "";
    form.presupuesto.value = plan.presupuesto || "economico";
    form.notas.value = plan.notas || "";
  }

  function buildGoogleCalendarLink({ nombre, fecha, hora, lugar, notas }) {
    const [y, m, d] = fecha.split("-").map(Number);
    const [hh, mm] = hora.split(":").map(Number);
    const start = new Date(y, m - 1, d, hh, mm);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // duración por defecto: 2 horas
    const fmt = (dt) => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: nombre,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: notas || "",
      location: lugar || ""
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function initPlanner() {
    const form = document.getElementById("plan-form");
    if (!form) return;

    const params = new URLSearchParams(location.search);
    const ideaId = params.has("id") ? Number(params.get("id")) : null;
    const editId = params.has("planId") ? Number(params.get("planId")) : null;

    let sourceIdea = null;
    if (ideaId) {
      sourceIdea = getAllIdeas().find((i) => i.id === ideaId);
      if (sourceIdea) {
        const originBox = document.getElementById("planner-origin");
        originBox.hidden = false;
        document.getElementById("planner-origin-name").textContent = sourceIdea.nombre;
        document.getElementById("planner-origin-link").href = `detalle.html?id=${sourceIdea.id}`;
        form.nombre.value = sourceIdea.nombre;
        form.para.value = sourceIdea.categoria === "parejas" ? "pareja" : "amigos";
        form.ocasion.value = sourceIdea.ocasion;
        form.presupuesto.value = sourceIdea.presupuesto;
      }
    }

    let editingPlan = null;
    if (editId) {
      editingPlan = getPlans().find((p) => p.id === editId);
      if (editingPlan) fillFormFromPlan(form, editingPlan);
    }

    initRepeatableRows({ listId: "activities-list", addBtnId: "add-activity-btn", createRow: createActivityRow });
    if (editingPlan && editingPlan.actividades && editingPlan.actividades.length) {
      const list = document.getElementById("activities-list");
      list.innerHTML = "";
      editingPlan.actividades.forEach((act) => list.appendChild(createActivityRow(act.hora, act.nombre)));
    }

    const checklistList = document.getElementById("checklist-list");
    const addChecklistBtn = document.getElementById("checklist-add-btn");
    const newItemInput = document.getElementById("checklist-new-item");

    function updateChecklistProgress() {
      const items = checklistList.querySelectorAll('input[type="checkbox"]');
      const total = items.length;
      const done = Array.from(items).filter((i) => i.checked).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      document.getElementById("checklist-progress-fill").style.width = pct + "%";
      document.getElementById("checklist-progress-text").textContent = `${done}/${total} tareas completadas`;
    }
    checklistList.addEventListener("change", updateChecklistProgress);
    addChecklistBtn.addEventListener("click", () => {
      const text = newItemInput.value.trim();
      if (!text) return;
      const li = document.createElement("li");
      li.className = "checklist-item";
      li.innerHTML = `<label><input type="checkbox" name="checklist" value="${slugify(text)}"> ${escapeHtml(text)}</label>`;
      checklistList.appendChild(li);
      newItemInput.value = "";
      updateChecklistProgress();
    });

    if (editingPlan && editingPlan.checklist) {
      checklistList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        const item = editingPlan.checklist.find((c) => c.key === input.value);
        if (item) input.checked = item.done;
      });
    }
    updateChecklistProgress();

    const gcalBtn = document.getElementById("gcal-btn");
    function updateGcalLink() {
      const nombre = form.nombre.value.trim();
      const fecha = form.fecha.value;
      const hora = form.hora.value;
      if (nombre && fecha && hora) {
        gcalBtn.href = buildGoogleCalendarLink({
          nombre, fecha, hora,
          lugar: form.lugar.value.trim(),
          notas: form.notas.value.trim()
        });
        gcalBtn.removeAttribute("aria-disabled");
        gcalBtn.classList.remove("is-disabled");
      } else {
        gcalBtn.href = "#";
        gcalBtn.setAttribute("aria-disabled", "true");
        gcalBtn.classList.add("is-disabled");
      }
    }
    ["nombre", "fecha", "hora", "lugar", "notas"].forEach((field) => form[field].addEventListener("input", updateGcalLink));
    updateGcalLink();
    gcalBtn.addEventListener("click", (e) => { if (gcalBtn.getAttribute("aria-disabled") === "true") e.preventDefault(); });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const actividades = Array.from(document.querySelectorAll("#activities-list [data-activity-row]"))
        .map((row) => ({
          hora: row.querySelector(".activity-hora").value,
          nombre: row.querySelector(".activity-nombre").value.trim()
        }))
        .filter((a) => a.nombre);

      const checklist = Array.from(checklistList.querySelectorAll('input[type="checkbox"]')).map((input) => ({
        key: input.value,
        texto: input.closest("label").textContent.trim(),
        done: input.checked
      }));

      const planData = {
        nombre: form.nombre.value.trim(),
        para: form.para.value,
        ocasion: form.ocasion.value,
        fecha: form.fecha.value,
        hora: form.hora.value,
        lugar: form.lugar.value.trim(),
        presupuesto: form.presupuesto.value,
        notas: form.notas.value.trim(),
        actividades,
        checklist,
        completado: editingPlan ? editingPlan.completado : false,
        ideaOrigenId: sourceIdea ? sourceIdea.id : editingPlan ? editingPlan.ideaOrigenId : null
      };

      if (editingPlan) {
        updatePlan(editingPlan.id, planData);
      } else {
        planData.id = nextPlanId();
        addPlan(planData);
      }

      window.location.href = "mis-planes.html";
    });
  }

  /* ============================================================
     10. MIS PLANES
     ============================================================ */

  function showPlanSummary(plan) {
    const actividades = (plan.actividades || []).map((a) => `${a.hora || "—"} — ${a.nombre}`).join("\n");
    alert(
      `${plan.nombre}\n${formatDateReadable(plan.fecha)} · ${plan.hora || ""}\n${plan.lugar ? "📍 " + plan.lugar : ""}` +
      (actividades ? `\n\nActividades:\n${actividades}` : "")
    );
  }

  function initMyPlans() {
    const grid = document.getElementById("plans-grid");
    if (!grid) return;

    const emptyState = document.getElementById("plans-empty");
    const template = document.getElementById("plan-card-template");
    const tabs = document.querySelectorAll(".plans-tab");
    let currentFilter = "todos";

    function render() {
      const plans = getPlans().sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));
      const today = todayISO();

      if (!plans.length) {
        grid.hidden = true;
        emptyState.hidden = false;
        return;
      }
      grid.hidden = false;
      emptyState.hidden = true;

      let filtered = plans;
      if (currentFilter === "proximos") filtered = plans.filter((p) => !p.completado && p.fecha >= today);
      if (currentFilter === "completados") filtered = plans.filter((p) => p.completado);

      grid.innerHTML = "";
      if (!filtered.length) {
        grid.innerHTML = '<p class="grid-empty-state">No hay planes en esta categoría.</p>';
        return;
      }

      filtered.forEach((plan) => {
        const node = template.content.cloneNode(true);
        const article = node.querySelector("[data-plan-card]");

        article.querySelector('[data-field="emoji"]').textContent = OCASION_EMOJI[plan.ocasion] || "🗓️";
        article.querySelector('[data-field="nombre"]').textContent = plan.nombre;
        article.querySelector('[data-field="fecha"]').textContent = formatDateReadable(plan.fecha);
        article.querySelector('[data-field="hora"]').textContent = plan.hora || "—";
        article.querySelector('[data-field="lugar"]').textContent = plan.lugar || "—";

        const total = (plan.checklist || []).length;
        const done = (plan.checklist || []).filter((c) => c.done).length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        article.querySelector('[data-field="progress-fill"]').style.width = pct + "%";
        article.querySelector('[data-field="progress-text"]').textContent = `${done}/${total} tareas completadas`;

        if (plan.completado) article.classList.add("is-completed");

        article.querySelector('[data-action="ver"]').addEventListener("click", () => showPlanSummary(plan));
        article.querySelector('[data-action="editar"]').addEventListener("click", () => {
          window.location.href = `planificador.html?planId=${plan.id}`;
        });
        article.querySelector('[data-action="completar"]').addEventListener("click", () => {
          updatePlan(plan.id, { completado: !plan.completado });
          render();
        });
        article.querySelector('[data-action="eliminar"]').addEventListener("click", () => {
          if (confirm(`¿Eliminar el plan "${plan.nombre}"?`)) { deletePlan(plan.id); render(); }
        });

        grid.appendChild(node);
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        currentFilter = tab.dataset.filter;
        render();
      });
    });

    render();

    document.querySelectorAll(".reminder-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const isOn = btn.dataset.reminderState === "on";
        btn.dataset.reminderState = isOn ? "off" : "on";
        btn.textContent = isOn ? "Activar recordatorio" : "Recordatorio activado ✓";
        btn.classList.toggle("is-active", !isOn);
      });
    });
  }

  /* ============================================================
     11. CALENDARIO
     ============================================================ */

  const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  function initCalendarPage() {
    const grid = document.getElementById("calendar-grid");
    if (!grid) return;

    const monthLabel = document.getElementById("calendar-month-label");
    const prevBtn = document.getElementById("cal-prev-month");
    const nextBtn = document.getElementById("cal-next-month");
    const agendaList = document.getElementById("agenda-list");
    const agendaEmpty = document.getElementById("agenda-empty");
    const agendaTemplate = document.getElementById("agenda-day-template");

    const today = new Date();
    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth();

    function plansByDate() {
      const map = {};
      getPlans().forEach((p) => {
        if (!p.fecha) return;
        (map[p.fecha] = map[p.fecha] || []).push(p);
      });
      return map;
    }

    function renderGrid() {
      const map = plansByDate();
      monthLabel.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
      grid.innerHTML = "";
      grid.dataset.state = "ready";

      const firstDay = new Date(viewYear, viewMonth, 1);
      const startOffset = (firstDay.getDay() + 6) % 7; // semana empieza en lunes
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

      for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-day calendar-day--empty";
        grid.appendChild(empty);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        if (dateStr === todayISO()) cell.classList.add("is-today");

        const num = document.createElement("span");
        num.className = "calendar-day-number";
        num.textContent = String(day);
        cell.appendChild(num);

        const plansToday = map[dateStr] || [];
        if (plansToday.length) {
          const dots = document.createElement("span");
          dots.className = "calendar-day-dots";
          plansToday.slice(0, 3).forEach((p) => {
            const dot = document.createElement("span");
            dot.className = `calendar-dot ${p.para === "pareja" ? "calendar-dot--couple" : "calendar-dot--friends"}`;
            dots.appendChild(dot);
          });
          cell.appendChild(dots);
        }
        grid.appendChild(cell);
      }
    }

    function renderAgenda() {
      const map = plansByDate();
      const todayStr = todayISO();
      const dates = Object.keys(map).filter((d) => d >= todayStr).sort();

      if (!dates.length) {
        agendaList.innerHTML = "";
        agendaEmpty.hidden = false;
        return;
      }
      agendaEmpty.hidden = true;
      agendaList.innerHTML = "";

      dates.slice(0, 8).forEach((dateStr) => {
        const plans = map[dateStr];
        const node = agendaTemplate.content.cloneNode(true);
        const [, m, d] = dateStr.split("-");

        node.querySelector('[data-field="dia"]').textContent = d;
        node.querySelector('[data-field="mes"]').textContent = MONTH_NAMES[Number(m) - 1].slice(0, 3).toUpperCase();

        const mainPlan = plans[0];
        node.querySelector('[data-field="ocasion"]').textContent =
          `${OCASION_EMOJI[mainPlan.ocasion] || "🗓️"} ${LABELS.ocasion[mainPlan.ocasion] || mainPlan.nombre}`;

        const activities = [];
        plans.forEach((p) => {
          if (p.actividades && p.actividades.length) {
            p.actividades.forEach((a) => activities.push(`${a.hora || "—"} — ${a.nombre}`));
          } else {
            activities.push(`${p.hora || "—"} — ${p.nombre}`);
          }
        });
        node.querySelector('[data-field="actividades"]').innerHTML = activities.map((a) => `<li>${escapeHtml(a)}</li>`).join("");

        agendaList.appendChild(node);
      });
    }

    prevBtn.addEventListener("click", () => {
      viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      renderGrid();
    });
    nextBtn.addEventListener("click", () => {
      viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      renderGrid();
    });

    renderGrid();
    renderAgenda();
  }

  /* ============================================================
     12. SUGERIR UNA IDEA
     ============================================================ */

  function initSuggestForm() {
    const form = document.getElementById("suggest-form");
    if (!form) return;
    const confirmation = document.getElementById("suggest-confirmation");

    initRepeatableRows({ listId: "materials-list", addBtnId: "add-material-btn", createRow: createMaterialRow });
    initRepeatableRows({ listId: "steps-list", addBtnId: "add-step-btn", createRow: createStepRow });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const materiales = Array.from(form.querySelectorAll("#materials-list .activity-nombre")).map((i) => i.value.trim()).filter(Boolean);
      const instrucciones = Array.from(form.querySelectorAll("#steps-list .activity-nombre")).map((i) => i.value.trim()).filter(Boolean);
      const nombre = form.nombre.value.trim();

      const idea = {
        id: nextExtraId(),
        nombre,
        descripcion: form.descripcion.value.trim(),
        categoria: form.categoria.value,
        tipo: form.tipo.value,
        ocasion: form.ocasion.value,
        presupuesto: form.presupuesto.value,
        duracion: LABELS.tiempo[form.tiempo.value] || form.tiempo.value,
        tiempo: form.tiempo.value,
        dificultad: "facil",
        personas: null,
        materiales,
        instrucciones,
        pinterest: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(nombre)}`,
        tiktok: `https://www.tiktok.com/search?q=${encodeURIComponent(nombre)}`,
        instagram: `https://www.instagram.com/explore/tags/${slugify(nombre)}/`,
        estado: "pendiente",
        autor: form.autor.value.trim() || "Anónimo",
        fecha: todayISO(),
        vistas: 0
      };

      addExtraIdea(idea);
      form.hidden = true;
      confirmation.hidden = false;
      confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ============================================================
     13. ADMIN — DASHBOARD
     ============================================================ */

  function buildRecentActivity(ideas) {
    const items = [];
    ideas.filter((i) => i.estado === "pendiente").slice(0, 3).forEach((i) => {
      items.push({ icon: "🟡", text: `Nueva idea sugerida: "${i.nombre}" por ${i.autor}` });
    });
    [...ideas].filter((i) => i.estado === "aprobada").sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 2).forEach((i) => {
      items.push({ icon: "🟢", text: `Idea publicada: "${i.nombre}"` });
    });
    const plans = getPlans();
    if (plans.length) items.push({ icon: "🗓️", text: `Se crearon ${plans.length} planes de demostración desde este navegador` });
    return items.length ? items : [{ icon: "ℹ️", text: "Sin actividad reciente." }];
  }

  function initAdminDashboard() {
    const statPublicadas = document.getElementById("stat-publicadas");
    if (!statPublicadas) return;

    const ideas = getAllIdeas();
    statPublicadas.textContent = String(ideas.filter((i) => i.estado === "aprobada").length);
    document.getElementById("stat-pendientes").textContent = String(ideas.filter((i) => i.estado === "pendiente").length);
    document.getElementById("stat-usuarios").textContent = String(window.APP_STATS.usuarios);
    document.getElementById("stat-planes").textContent = String(window.APP_STATS.planesCreados + getPlans().length);

    const topList = document.getElementById("top-ideas-list");
    const top = [...ideas].sort((a, b) => b.vistas - a.vistas).slice(0, 5);
    topList.innerHTML = top.map((idea, i) => `
      <li class="top-ideas-item">
        <span class="top-ideas-rank">${i + 1}</span>
        <span class="top-ideas-name">${escapeHtml(idea.nombre)}</span>
        <span class="category-tag">${LABELS.categoria[idea.categoria]}</span>
        <span class="top-ideas-views">${idea.vistas} vistas</span>
      </li>
    `).join("");

    document.getElementById("admin-activity-list").innerHTML = buildRecentActivity(ideas)
      .map((a) => `<li class="admin-activity-item"><span aria-hidden="true">${a.icon}</span> ${escapeHtml(a.text)}</li>`)
      .join("");
  }

  /* ============================================================
     14. ADMIN — GESTIÓN DE IDEAS
     ============================================================ */

  function initAdminIdeasTable() {
    const tbody = document.getElementById("ideas-table-body");
    if (!tbody) return;

    const template = document.getElementById("idea-row-template");
    const tabs = document.querySelectorAll(".admin-filter-tab");
    const searchInput = document.getElementById("admin-ideas-search");
    let currentFilter = "todas";

    function render() {
      let ideas = getAllIdeas();
      if (currentFilter !== "todas") ideas = ideas.filter((i) => i.estado === currentFilter);
      const q = searchInput.value.trim().toLowerCase();
      if (q) ideas = ideas.filter((i) => i.nombre.toLowerCase().includes(q) || (i.autor || "").toLowerCase().includes(q));

      tbody.innerHTML = "";
      if (!ideas.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="admin-table-empty">No hay ideas que coincidan.</td></tr>';
        return;
      }

      ideas.forEach((idea) => {
        const node = template.content.cloneNode(true);
        const row = node.querySelector("[data-idea-row]");

        row.querySelector('[data-field="nombre"]').textContent = idea.nombre;

        const catEl = row.querySelector('[data-field="categoria"]');
        catEl.textContent = LABELS.categoria[idea.categoria];
        catEl.classList.add(idea.categoria === "parejas" ? "category-tag--couple" : "category-tag--friends");

        row.querySelector('[data-field="autor"]').textContent = idea.autor;

        const estadoEl = row.querySelector('[data-field="estado"]');
        estadoEl.textContent = ESTADO_LABELS[idea.estado];
        estadoEl.classList.add(`status-pill--${idea.estado}`);

        row.querySelector('[data-field="fecha"]').textContent = formatDateReadable(idea.fecha);

        row.querySelector('[data-action="ver"]').addEventListener("click", () => {
          window.open(`${PAGES_DIR}detalle.html?id=${idea.id}`, "_blank", "noopener,noreferrer");
        });
        row.querySelector('[data-action="editar"]').addEventListener("click", () => {
          window.location.href = `crear-idea.html?editId=${idea.id}`;
        });
        row.querySelector('[data-action="aprobar"]').addEventListener("click", () => {
          setIdeaOverride(idea.id, { estado: "aprobada" });
          render();
        });
        row.querySelector('[data-action="rechazar"]').addEventListener("click", () => {
          setIdeaOverride(idea.id, { estado: "rechazada" });
          render();
        });
        row.querySelector('[data-action="eliminar"]').addEventListener("click", () => {
          if (confirm(`¿Eliminar la idea "${idea.nombre}"? Esta acción no se puede deshacer.`)) {
            deleteIdea(idea.id);
            render();
          }
        });

        tbody.appendChild(node);
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        currentFilter = tab.dataset.filter;
        render();
      });
    });
    searchInput.addEventListener("input", render);

    render();
  }

  /* ============================================================
     15. ADMIN — CREAR / EDITAR IDEA
     ============================================================ */

  function fillAdminFormFromIdea(form, idea) {
    form.nombre.value = idea.nombre;
    form.descripcion.value = idea.descripcion;
    form.categoria.value = idea.categoria;
    form.ocasion.value = idea.ocasion;
    form.presupuesto.value = idea.presupuesto;
    form.duracion.value = idea.duracion;
    form.dificultad.value = idea.dificultad;
    form.pinterest.value = idea.pinterest || "";
    form.tiktok.value = idea.tiktok || "";
    form.instagram.value = idea.instagram || "";

    const matList = document.getElementById("admin-materials-list");
    matList.innerHTML = "";
    (idea.materiales.length ? idea.materiales : [""]).forEach((m) => matList.appendChild(createMaterialRow(m)));

    const stepList = document.getElementById("admin-steps-list");
    stepList.innerHTML = "";
    (idea.instrucciones.length ? idea.instrucciones : [""]).forEach((s) => stepList.appendChild(createStepRow(s)));
  }

  function initAdminCreateIdea() {
    const form = document.getElementById("admin-create-form");
    if (!form) return;

    const confirmation = document.getElementById("admin-create-confirmation");

    initRepeatableRows({ listId: "admin-materials-list", addBtnId: "admin-add-material-btn", createRow: createMaterialRow });
    initRepeatableRows({ listId: "admin-steps-list", addBtnId: "admin-add-step-btn", createRow: createStepRow });

    const params = new URLSearchParams(location.search);
    const editId = params.has("editId") ? Number(params.get("editId")) : null;
    let editingIdea = null;
    if (editId) {
      editingIdea = getAllIdeas().find((i) => i.id === editId);
      if (editingIdea) fillAdminFormFromIdea(form, editingIdea);
    }

    function collectIdeaFromForm(estado) {
      const materiales = Array.from(form.querySelectorAll("#admin-materials-list .activity-nombre")).map((i) => i.value.trim()).filter(Boolean);
      const instrucciones = Array.from(form.querySelectorAll("#admin-steps-list .activity-nombre")).map((i) => i.value.trim()).filter(Boolean);
      return {
        nombre: form.nombre.value.trim(),
        descripcion: form.descripcion.value.trim(),
        categoria: form.categoria.value,
        tipo: editingIdea ? editingIdea.tipo : "experiencia",
        ocasion: form.ocasion.value,
        presupuesto: form.presupuesto.value,
        duracion: form.duracion.value.trim() || "1 hora",
        tiempo: editingIdea ? editingIdea.tiempo : "menos-1h",
        dificultad: form.dificultad.value,
        personas: editingIdea ? editingIdea.personas : null,
        materiales,
        instrucciones,
        pinterest: form.pinterest.value.trim(),
        tiktok: form.tiktok.value.trim(),
        instagram: form.instagram.value.trim(),
        estado,
        autor: editingIdea ? editingIdea.autor : "Equipo Juntos",
        fecha: editingIdea ? editingIdea.fecha : todayISO(),
        vistas: editingIdea ? editingIdea.vistas : 0
      };
    }

    function saveIdea(estado) {
      const data = collectIdeaFromForm(estado);
      if (editingIdea) {
        setIdeaOverride(editingIdea.id, data);
      } else {
        data.id = nextExtraId();
        addExtraIdea(data);
      }
      document.getElementById("admin-create-confirmation-text").textContent =
        estado === "aprobada" ? "La idea ya está disponible en las recomendaciones." : "La idea quedó guardada como pendiente de revisión.";
      form.hidden = true;
      confirmation.hidden = false;
      confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    form.addEventListener("submit", (e) => { e.preventDefault(); saveIdea("aprobada"); });
    document.getElementById("admin-save-draft-btn").addEventListener("click", () => saveIdea("pendiente"));
    document.getElementById("admin-create-another-btn").addEventListener("click", () => {
      window.location.href = "crear-idea.html";
    });
  }

  /* ============================================================
     16. ARRANQUE
     ============================================================ */

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initAdminSidebar();
    initSearchIcon();
    initHeroSearch();
    initRecommendations();
    initBrowsePage();
    initIdeaDetail();
    initPlanner();
    initMyPlans();
    initCalendarPage();
    initSuggestForm();
    initAdminDashboard();
    initAdminIdeasTable();
    initAdminCreateIdea();
  });
})();
