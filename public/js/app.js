// app.js (frontend Firebase)

// Base de todas las rutas Firebase
const base = "/api/firebase";

// Crear casa
document.getElementById('createHouseForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('houseId').value.trim();
  const address = document.getElementById('address').value.trim();
  const municipality = document.getElementById('municipality').value.trim();
  const social_stratum = parseInt(document.getElementById('stratum').value) || null;

  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, address, municipality, social_stratum })
  });

  const data = await res.json();
  document.getElementById('createMsg').innerText = data.message || JSON.stringify(data);
});

// Listar casas
document.getElementById('loadHouses').addEventListener('click', async () => {
  const res = await fetch(base);
  const list = await res.json();

  const container = document.getElementById('housesList');
  container.innerHTML = '';

  list.forEach(h => {
    const li = document.createElement('li');
    li.innerText = `${h.id}: ${h.address} (${h.municipality || ''})`;
    container.appendChild(li);
  });
});

// Agregar beneficiario
document.getElementById('addBenefForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const houseId = document.getElementById('houseForBenef').value.trim();
  const name = document.getElementById('bName').value.trim();
  const age = parseInt(document.getElementById('bAge').value) || null;

  const res = await fetch(`${base}/${houseId}/beneficiaries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, age })
  });

  const data = await res.json();
  alert(data.ok ? "Beneficiario agregado" : JSON.stringify(data));
});

// Cargar beneficiarios
document.getElementById('loadBenefs').addEventListener('click', async () => {
  const houseId = document.getElementById('houseForBenef').value.trim();
  if (!houseId) return alert('Ingrese ID de la casa');

  const res = await fetch(`${base}/${houseId}/beneficiaries`);
  const list = await res.json();

  const container = document.getElementById('benefList');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = "<li>No hay beneficiarios registrados</li>";
    return;
  }

  list.forEach(b => {
    const li = document.createElement('li');
    li.innerText = `${b.name} (${b.age || 'sin edad'})`;
    container.appendChild(li);
  });
});
