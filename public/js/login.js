document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  const message = document.getElementById("message");

  if (data.success) {
    message.textContent = "Inicio de sesión exitoso";
    message.style.color = "green";
    // Redirige al home
    window.location.href = "home.html";
  } else {
    message.textContent = data.error || "Error en el inicio de sesión";
    message.style.color = "red";
  }
});

// Registrar usuario y redirigir al home
document.getElementById("registerBtn").addEventListener("click", async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Por favor ingresa un usuario y una contraseña para registrar.");
    return;
  }

  try {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.message) {
      alert("✅ " + data.message);
      // Redirige automáticamente al home
      window.location.href = "home.html";
    } else {
      alert("⚠️ " + (data.error || "No se pudo registrar el usuario"));
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    alert("Ocurrió un error al registrar el usuario.");
  }
});
