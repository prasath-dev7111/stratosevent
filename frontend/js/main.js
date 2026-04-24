// StratosEvent — Home Page Logic
let allEvents = [];
let activeCategory = '';

async function loadEvents() {
  try {
    allEvents = await apiFetch('/events');
    document.getElementById('stat-events').textContent = allEvents.length;
    renderEvents(allEvents);
  } catch (err) {
    document.getElementById('events-container').innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">⚠️</div>
        <h3>Could not load events</h3>
        <p>Make sure the backend server is running on port 5000</p>
      </div>`;
  }
}

function renderEvents(events) {
  const container = document.getElementById('events-container');
  if (!events.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="icon">📭</div>
        <h3>No events found</h3>
        <p>Try a different search or category filter</p>
      </div>`;
    return;
  }

  container.innerHTML = events.map(e => {
    const minPrice = e.ticketTiers.length ? Math.min(...e.ticketTiers.map(t => t.price)) : 0;
    const totalSeats = e.ticketTiers.reduce((s, t) => s + t.availableSeats, 0);
    return `
    <div class="event-card" onclick="location.href='pages/event-detail.html?id=${e._id}'">
      <div class="event-card-header ${catClass(e.category)}">
        <span style="font-size:3rem">${catEmoji(e.category)}</span>
        <div class="event-badge">${e.category}</div>
        ${e.isInviteOnly ? '<div class="invite-badge">Invite Only</div>' : ''}
      </div>
      <div class="event-body">
        <div class="event-title">${e.title}</div>
        <div class="event-meta">
          <span>📅 ${formatDate(e.startDate)}</span>
          <span>📍 ${e.venue}</span>
          <span>🎫 ${totalSeats} seats available</span>
        </div>
        <p class="event-desc">${e.description}</p>
        <div class="event-footer">
          <span class="ticket-price ${minPrice === 0 ? 'free' : ''}">${formatCurrency(minPrice)}</span>
          <button class="btn btn-primary btn-sm">View Details</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterEvents() {
  const search = document.getElementById('search-input').value.toLowerCase();
  let filtered = allEvents;
  if (activeCategory) filtered = filtered.filter(e => e.category === activeCategory);
  if (search) filtered = filtered.filter(e =>
    e.title.toLowerCase().includes(search) ||
    e.description.toLowerCase().includes(search) ||
    e.venue.toLowerCase().includes(search)
  );
  renderEvents(filtered);
}

function setCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  filterEvents();
}

document.getElementById('search-input').addEventListener('keyup', filterEvents);

window.addEventListener('DOMContentLoaded', loadEvents);
