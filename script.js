/* ============================================
   AGUA CLARA — JavaScript
   Nav, form→WhatsApp, scroll animations, lead counter
   ============================================ */

const WA_PHONE = '5219622151185';

/* ---- Lead Counter (localStorage + admin panel) ---- */
const LEAD_KEY = 'aguaclara_leads';

function getLeads() {
  try { return JSON.parse(localStorage.getItem(LEAD_KEY)) || []; }
  catch { return []; }
}

function saveLead(type, detail) {
  const leads = getLeads();
  leads.push({
    type,
    detail,
    date: new Date().toISOString(),
    id: leads.length + 1
  });
  localStorage.setItem(LEAD_KEY, JSON.stringify(leads));
}

// Track all WA link clicks (except form, which is tracked separately)
document.addEventListener('click', e => {
  const link = e.target.closest('a[href*="wa.me"]');
  if (link && !link.closest('#quoteForm')) {
    const url = new URL(link.href);
    const text = decodeURIComponent(url.searchParams.get('text') || '');
    const type = '💬 WhatsApp Click';
    saveLead(type, text.substring(0, 80));
  }
});

// Track phone call clicks
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="tel:"]');
  if (link) saveLead('📞 Llamada', link.href);
});

/* ---- Admin Stats Panel (access via ?stats in URL) ---- */
if (window.location.search.includes('stats')) {
  const leads = getLeads();
  const panel = document.createElement('div');
  panel.id = 'adminPanel';
  panel.innerHTML = `
    <style>
      #adminPanel {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(8, 47, 73, .95); backdrop-filter: blur(12px);
        color: #fff; font-family: 'Inter', sans-serif;
        overflow-y: auto; padding: 2rem;
      }
      #adminPanel h2 { font-size: 2rem; margin-bottom: .5rem; }
      #adminPanel .stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: 1rem; margin: 1.5rem 0; }
      #adminPanel .stat-box { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 1.5rem; text-align: center; }
      #adminPanel .stat-num { font-size: 2.5rem; font-weight: 800; color: #0ea5e9; }
      #adminPanel .stat-label { font-size: .8rem; color: rgba(255,255,255,.5); margin-top: .3rem; }
      #adminPanel table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
      #adminPanel th, #adminPanel td { padding: .7rem 1rem; text-align: left; border-bottom: 1px solid rgba(255,255,255,.08); font-size: .85rem; }
      #adminPanel th { color: rgba(255,255,255,.4); font-size: .75rem; letter-spacing: 1px; text-transform: uppercase; }
      #adminPanel .close-btn { position: fixed; top: 1rem; right: 1.5rem; background: #ef4444; color: #fff; border: none; padding: .5rem 1.2rem; border-radius: 100px; cursor: pointer; font-weight: 700; font-size: .9rem; }
      #adminPanel .clear-btn { background: rgba(255,255,255,.08); color: rgba(255,255,255,.5); border: 1px solid rgba(255,255,255,.1); padding: .5rem 1.2rem; border-radius: 100px; cursor: pointer; font-weight: 600; font-size: .8rem; margin-left: 1rem; }
    </style>
    <button class="close-btn" onclick="document.getElementById('adminPanel').remove(); history.replaceState(null,'',location.pathname);">✕ Cerrar</button>
    <h2>📊 Panel de Leads — Agua Clara</h2>
    <p style="color:rgba(255,255,255,.5)">Datos almacenados localmente en este navegador. Último reset: nunca.</p>
    <div class="stat-grid">
      <div class="stat-box">
        <div class="stat-num">${leads.length}</div>
        <div class="stat-label">Total Leads</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">${leads.filter(l => l.type.includes('WhatsApp')).length}</div>
        <div class="stat-label">💬 WhatsApp</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">${leads.filter(l => l.type.includes('Formulario')).length}</div>
        <div class="stat-label">📋 Formulario</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">${leads.filter(l => l.type.includes('Llamada')).length}</div>
        <div class="stat-label">📞 Llamadas</div>
      </div>
    </div>
    <h3 style="margin-top:2rem;">Historial de clicks</h3>
    <button class="clear-btn" onclick="localStorage.removeItem('${LEAD_KEY}');location.reload();">Reiniciar contador</button>
    <table>
      <thead><tr><th>#</th><th>Fecha</th><th>Tipo</th><th>Detalle</th></tr></thead>
      <tbody>
        ${leads.slice().reverse().map(l => `<tr>
          <td>${l.id}</td>
          <td>${new Date(l.date).toLocaleString('es-MX')}</td>
          <td>${l.type}</td>
          <td>${l.detail || '—'}</td>
        </tr>`).join('')}
        ${leads.length === 0 ? '<tr><td colspan="4" style="text-align:center;color:rgba(255,255,255,.3);padding:2rem;">Sin leads aún. Los clicks en WhatsApp se registrarán aquí.</td></tr>' : ''}
      </tbody>
    </table>
  `;
  document.body.appendChild(panel);
}

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ---- Mobile nav toggle ---- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

/* ---- Form → WhatsApp ---- */
const form = document.getElementById('quoteForm');

form.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const service = document.getElementById('fservice').value;
  const desc = document.getElementById('fdesc').value.trim();

  if (!name || !phone || !service) {
    alert('Por favor llena los campos obligatorios: nombre, teléfono y servicio.');
    return;
  }

  const prefix = '📋 Nuevo Pedido Agua Clara';

  const msg = [
    `AGUACLARA: ${prefix}`,
    ``,
    `👤 Nombre: ${name}`,
    `📞 Teléfono: ${phone}`,
    `🛠 Servicio: ${service}`,
    desc ? `📍 Dirección/Referencias: ${desc}` : '',
  ].filter(Boolean).join('\n');

  // Track as form lead
  saveLead('📋 Formulario', `${name} — ${service}`);

  const encoded = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${WA_PHONE}?text=${encoded}`;
  window.open(waUrl, '_blank');
});

/* ---- Scroll-reveal ---- */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.service-card, .step-card, .testimonial-card, .tag').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

/* ---- WA Float: hide at footer ---- */
const waFloat = document.getElementById('waFloat');
const footer = document.querySelector('.footer');

const footerObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    waFloat.style.opacity = e.isIntersecting ? '0' : '1';
    waFloat.style.pointerEvents = e.isIntersecting ? 'none' : 'auto';
  });
});
footerObs.observe(footer);
