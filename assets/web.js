// Drub Tech · comportamiento común de la web (sin dependencias).
document.documentElement.classList.remove("no-js");

// Las secciones aparecen suavemente al hacer scroll.
(() => {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
})();

// Año del pie.
document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

// ---------------------------------------------------------------------------------------------
// «¿Cuántos vatios admite tu móvil?» — usa el mismo catálogo que la app, publicado en GitHub.
// ---------------------------------------------------------------------------------------------
(() => {
  const tool = document.getElementById("watts-tool");
  if (!tool) return;
  const CATALOG = "https://raw.githubusercontent.com/Deividru/vatio-catalog/main/catalog.json";
  const input = tool.querySelector("input");
  const list = tool.querySelector("datalist");
  const suggest = tool.querySelector(".suggest");
  const result = tool.querySelector(".result");
  const note = tool.querySelector(".note");
  let devices = [];

  // «Samsung Galaxy S24», pero «POCO F6» y no «POCO POCO F6».
  const label = d => (d.name.toLowerCase().startsWith(d.brand.toLowerCase()) ? d.name : `${d.brand} ${d.name}`).replace(/\s+/g, " ").trim();
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();

  function find(text) {
    const q = norm(text);
    if (!q) return null;
    return devices.find(d => norm(label(d)) === q || norm(d.name) === q)
      || (q.length >= 4 ? devices.find(d => norm(label(d)).includes(q)) : null);
  }

  function animateNumber(el, to) {
    const start = performance.now(), dur = 900;
    const step = t => {
      const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function show(d) {
    const w = Math.round(d.maxWatts);
    const speed = w >= 60 ? "Carga ultrarrápida" : w >= 30 ? "Carga muy rápida" : w >= 18 ? "Carga rápida" : "Carga normal";
    result.querySelector("[data-name]").textContent = label(d);
    result.querySelector("[data-speed]").textContent = speed;
    result.querySelector("[data-protocol]").textContent = d.protocolLabel || "—";
    result.querySelector("[data-battery]").textContent = d.capacityMah ? `${d.capacityMah.toLocaleString("es-ES")} mAh` : "—";
    result.querySelector("[data-port]").textContent = d.port || "USB-C";
    result.querySelector("[data-max]").textContent = `${w} W`;
    result.querySelector("[data-advice]").textContent = d.advice || "";
    // Arco: 270° que se llenan en proporción a 120 W.
    const arc = result.querySelector(".gauge .fill");
    const len = arc.getTotalLength();
    arc.style.strokeDasharray = len;
    arc.style.strokeDashoffset = len;
    requestAnimationFrame(() => {
      arc.style.transition = "stroke-dashoffset 0.9s cubic-bezier(.2,.7,.2,1)";
      arc.style.strokeDashoffset = len * (1 - Math.min(1, w / 120));
    });
    animateNumber(result.querySelector("[data-watts]"), w);
    result.classList.add("show");
  }

  function update() {
    const d = find(input.value);
    if (d) show(d);
  }

  input.addEventListener("change", update);
  input.addEventListener("input", () => { if (find(input.value) && list.querySelector(`option[value="${CSS.escape(input.value)}"]`)) update(); });
  input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); update(); } });

  fetch(CATALOG, { cache: "no-cache" })
    .then(r => r.json())
    .then(cat => {
      devices = (cat.devices || []).filter(d => d.maxWatts).sort((a, b) => label(a).localeCompare(label(b)));
      list.innerHTML = devices.map(d => `<option value="${label(d)}"></option>`).join("");
      note.textContent = `${devices.length} móviles en el catálogo de Vatio, actualizado ${cat.updatedAt ? "el " + new Date(cat.updatedAt).toLocaleDateString("es-ES") : "a diario"}. ¿No está el tuyo? Vatio lo mide igual.`;
      // Sugerencias rápidas: un móvil de cada marca.
      const seen = new Set();
      const picks = devices.filter(d => !seen.has(d.brand) && seen.add(d.brand)).slice(0, 6);
      suggest.innerHTML = picks.map(d => `<button type="button">${label(d)}</button>`).join("");
      suggest.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { input.value = b.textContent; update(); }));
    })
    .catch(() => {
      note.textContent = "No se ha podido cargar el catálogo ahora mismo. Inténtalo de nuevo en un momento.";
    });
})();
