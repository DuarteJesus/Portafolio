const S = window.SITE, $ = (s, r = document) => r.querySelector(s);
const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const page = document.body.dataset.page, B = document.body.dataset.base || "";
const P = u => u && u.startsWith("/") ? (B || "./") + u.slice(1) : u;
const links = [["#about", "Sobre mí", 1], ["#stack", "Stack", 1], ["#projects", "Proyectos", 1], ["#contact", "Contacto", 1], ["staff/", "Staff"]].map(([h, t, a]) => [(B || "./") + h, t]);
const card = (inner, cls = "", tag = "div", attrs = "") => `<${tag} class="card rv ${cls}" ${attrs}>${inner}</${tag}>`;
const ext = u => /^https?:/.test(u) ? ' target="_blank" rel="noopener noreferrer"' : "";
const views = {
  home: () => `
  <div class="hero" id="inicio"><span class="mono">${esc(S.handle)}</span><h1>${esc(S.name)}<em>.</em></h1>
  <p style="max-width:520px;color:var(--mut);font-size:20px">${esc(S.tagline)}</p>
  <div class="roles">${S.roles.map(r => `<span>${esc(r)}</span>`).join("")}</div>
  <div><a class="btn" href="#projects">Explorar proyectos ↓</a></div></div>
  <div class="marquee" aria-hidden="true"><div>${[...S.roles, ...S.roles, ...S.roles, ...S.roles].map(r => `<span>${esc(r)} ✦</span>`).join("")}</div></div>
  <section id="presence"><span class="mono">01 · Presencia</span><h2>En vivo.</h2>
   ${card(`<div class="pf"><img id="pav" alt="" hidden width="64" height="64"><div><span class="mono">Discord</span><h3 id="pname"><span class="dot"></span>${esc(S.handle)}</h3><p id="pstatus">${S.discordId ? "Consultando estado…" : "Sin Discord configurado."}</p></div></div>`)}</section>
  <section id="about"><span class="mono">02 · Sobre mí</span><h2>${esc(S.about.title)}</h2>
   <div class="grid">${card(`<p style="font-size:18px;color:var(--ink)">${esc(S.about.text)}</p>`, "wide")}${S.about.chips.map(c => card(`<h3>${esc(c)}</h3>`)).join("")}</div></section>
  <section id="projects"><span class="mono">03 · Proyectos</span><h2>Hecho aprendiendo.</h2>
   <div class="grid">${S.projects.map(p => card(`<span class="mono">${esc(p.status)} · ${esc(p.role)}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="row">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>${p.url !== "#" ? '<p style="margin-top:12px;color:var(--acc)">Ver código ↗</p>' : ""}`, "", p.url !== "#" ? "a" : "div", p.url !== "#" ? `href="${esc(p.url)}"${ext(p.url)}` : "")).join("")}</div></section>
  <section id="stack"><span class="mono">04 · Stack</span><h2>Todavía aprendiendo.<br>Siempre construyendo.</h2>
   <div class="grid">${S.stack.map(g => card(`<span class="mono">${esc(g.group)}</span>${g.items.map(([n, d]) => `<h3>${esc(n)}</h3><p>${esc(d)}</p>`).join("")}`)).join("")}</div></section>
  <section id="more"><span class="mono">05 · Fuera del editor</span><h2>Lo que me mueve.</h2>
   <div class="grid">${S.beyond.map(b => card(`<span class="mono">${esc(b.k)}</span><h3>${esc(b.t)}</h3><p>${esc(b.p)}</p>${b.href ? `<p style="margin-top:10px;color:var(--acc)">Ver perfil ↗</p>` : ""}`, "", b.href ? "a" : "div", b.href ? `href="${esc(P(b.href))}"` : "")).join("")}</div>
   <p class="mono" style="margin-top:26px">En el horizonte</p><div class="hz">${S.horizon.map(h => `<span>${esc(h)}</span>`).join("")}</div></section>
  <section id="contact"><span class="mono">06 · Hablemos</span><h2>El siguiente mensaje<br>puede ser tuyo.</h2>
   ${card(`<form id="cf" novalidate><label class="mono" for="cn">Tu nombre (opcional)</label><input id="cn" name="n" maxlength="80" autocomplete="name">
   <label class="mono" for="cm">Tu mensaje</label><textarea id="cm" name="m" maxlength="2000" rows="5" required></textarea><div class="cnt"><span id="cc">0</span> / 2000</div>
   <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button>Enviar mensaje ↗</button><p id="cmsg" role="status"></p></form>
   <p style="margin-top:12px">¿Prefieres el correo? <a href="mailto:${esc(S.email)}" style="color:var(--acc)">${esc(S.email)}</a></p>`)}
   <p class="mono" style="margin:30px 0 12px">Encuéntrame también en</p>
   <div class="grid">${S.socials.map(s => card(`<span class="mono">${esc(s.label)}</span><p>${esc(s.desc)} ↗</p>`, "", "a", `href="${esc(s.url)}"${ext(s.url)}`)).join("")}</div></section>`,
  staff: () => `<section style="padding-top:90px"><span class="mono">Equipo</span><h2>Staff.</h2><div class="grid">${S.staff.map(m => card(`<span class="mono">${esc(m.role)}</span><h3>${esc(m.name)}</h3><p>${esc(m.bio)}</p>`, "", m.url ? "a" : "div", m.url ? `href="${esc(P(m.url))}"` : "")).join("")}</div></section>`,
  dashboard: () => `<section style="padding-top:90px"><span class="mono">Panel</span><h2>Dashboard.</h2><div class="grid">
   ${card(`<span class="mono">Proyectos</span><div class="stat">${S.projects.length}</div>`)}
   ${card(`<span class="mono">Repos públicos</span><div class="stat" id="gr">—</div>`)}
   ${card(`<span class="mono">Seguidores GitHub</span><div class="stat" id="gf">—</div>`)}
   ${card(`<span class="mono">Estado Discord</span><div class="stat" id="dstat">—</div>`)}
   ${card(`<span class="mono">Actividad</span><p id="pstatus">Cargando…</p>`, "wide")}
   ${card(`<span class="mono">Repos recientes</span><div id="rl"><p>Cargando…</p></div>`, "wide")}</div></section>`,
  privacy: () => `<section class="prose"><span class="mono">Legal</span><h2>Privacidad.</h2>
   <p>Última actualización: ${esc(S.updated)}. Este sitio es un portafolio personal sin cuentas de usuario ni publicidad.</p>
   <h3>Qué datos se tratan</h3><ul><li><b>Formulario de contacto:</b> el nombre (opcional) y el mensaje que escribas se usan solo para responderte.</li><li><b>Correo:</b> si me escribes por email, uso tu dirección solo para contestar.</li><li><b>Servicios externos:</b> para mostrar mi estado se consulta Lanyard (api.lanyard.rest) y para el panel, la API pública de GitHub. Tu navegador se conecta a ellos y estos pueden ver tu dirección IP según sus propias políticas.</li></ul>
   <h3>Cookies y analítica</h3><p>Este sitio no usa cookies ni herramientas de analítica propias.</p>
   <h3>Tus derechos</h3><p>Puedes pedirme que revise o elimine cualquier mensaje que me hayas enviado escribiendo a <a href="mailto:${esc(S.email)}" style="color:var(--acc)">${esc(S.email)}</a>.</p>
   <p style="margin-top:20px"><a class="btn" href="${B || "./"}">Volver al inicio</a></p></section>`
};
document.title = page === "home" ? `${S.name} | Portafolio` : `${{ staff: "Staff", dashboard: "Panel", privacy: "Privacidad" }[page]} · ${S.name}`;
document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#main">Saltar al contenido</a><div class="prog" id="prog"></div><main id="main">${views[page]()}<footer><div class="fl"><a href="${B || "./"}">Inicio</a><a href="${B}staff/">Staff</a><a href="${B}privacidad.html">Privacidad</a><a href="#main">Volver arriba ↑</a></div><p style="margin-top:10px">Hecho con curiosidad en Colombia · ${new Date().getFullYear()} · Actualizado ${esc(S.updated)}</p></footer></main><nav class="nav" aria-label="Principal">${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</nav>`);

const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .12 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));
document.addEventListener("pointermove", e => { const c = e.target.closest?.(".card"); if (c) { const r = c.getBoundingClientRect(); c.style.setProperty("--x", e.clientX - r.left + "px"); c.style.setProperty("--y", e.clientY - r.top + "px"); } });
const here = location.pathname.replace(/\/$/, ""); document.querySelectorAll(".nav a").forEach(a => { if (!a.hash && a.pathname.replace(/\/$/, "") === here) a.classList.add("on"); });
addEventListener("scroll", () => { const h = document.documentElement; $("#prog").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + "%"; }, { passive: true });

if (S.discordId) fetch(`https://api.lanyard.rest/v1/users/${S.discordId}`).then(r => r.json()).then(({ data }) => {
  if (!data) throw 0; const st = data.discord_status, u = data.discord_user, act = data.activities.find(a => a.type !== 4);
  const d = $("#pname .dot"); if (d) d.className = "dot " + st;
  const n = $("#pname"); if (n && u) n.lastChild.textContent = u.global_name || u.username;
  const av = $("#pav"); if (av && u?.avatar) { av.src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`; av.hidden = false; }
  const s = $("#dstat"); if (s) s.textContent = { online: "En línea", idle: "Ausente", dnd: "No molestar", offline: "Desconectado" }[st] || st;
  const p = $("#pstatus"); if (p) p.textContent = data.listening_to_spotify ? `Escuchando ${data.spotify.song} — ${data.spotify.artist}` : act ? `${act.name}${act.details ? " · " + act.details : ""}` : "Sin actividad ahora mismo.";
}).catch(() => { const p = $("#pstatus"); if (p) p.textContent = "Estado no disponible (únete al servidor de Lanyard para activarlo)."; });
else $("#pstatus") && ($("#pstatus").textContent = "Sin Discord configurado.");

if (page === "dashboard") {
  fetch(`https://api.github.com/users/${S.githubUser}`).then(r => r.json()).then(u => { $("#gr").textContent = u.public_repos ?? "—"; $("#gf").textContent = u.followers ?? "—"; }).catch(() => {});
  fetch(`https://api.github.com/users/${S.githubUser}/repos?sort=updated&per_page=5`).then(r => r.json()).then(rs => { $("#rl").innerHTML = Array.isArray(rs) && rs.length ? rs.map(r => `<a class="up" href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer"><b>${esc(r.name)}</b><span>${esc(r.language || "—")} · ${new Date(r.updated_at).toLocaleDateString("es-CO")}</span></a>`).join("") : "<p>Sin datos.</p>"; }).catch(() => { $("#rl").innerHTML = "<p>No se pudo cargar GitHub.</p>"; });
}

const cf = $("#cf");
if (cf) {
  cf.m.addEventListener("input", () => $("#cc").textContent = cf.m.value.length);
  cf.addEventListener("submit", async e => {
    e.preventDefault(); const m = $("#cmsg"), msg = cf.m.value.trim();
    if (cf.website.value) return;
    if (msg.length < 5) return void (m.textContent = "Escribe un mensaje un poco más largo.");
    const name = cf.n.value.trim();
    if (!S.contactEndpoint) { location.href = `mailto:${S.email}?subject=${encodeURIComponent("Mensaje desde tu portafolio")}&body=${encodeURIComponent((name ? name + ":\n\n" : "") + msg)}`; return void (m.textContent = "Abriendo tu app de correo…"); }
    try { const r = await fetch(S.contactEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, message: msg }) }); if (!r.ok) throw 0; m.textContent = "¡Enviado! Gracias ✓"; cf.reset(); $("#cc").textContent = 0; } catch { m.textContent = `No se pudo enviar. Escríbeme a ${S.email}.`; }
  });
}
