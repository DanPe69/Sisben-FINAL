// public/js/person.js
document.getElementById("personForm")?.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  try {
    const response = await fetch("/sql/post-person", {
      method: "POST",
      body: formData
    });

    const message = await response.text();
    const resultElement = document.getElementById("postSqlResult");
    resultElement.innerText = message;

    if (message.includes("Persona registrada correctamente")) {
      setTimeout(() => {
        window.location.href = "programs.html";
      }, 1500); //redirige 1.5 segundos
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("postSqlResult").innerText = "Error enviando el formulario.";
  }
});
