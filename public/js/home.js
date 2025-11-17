// public/js/home.js

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM cargado");

    // ===============================
    // BOTÓN ETL
    // ===============================

    const runETL = document.getElementById("runETL");

    if (!runETL) {
        console.error("❌ ERROR: No se encontró el botón runETL");
    } else {
        runETL.addEventListener("click", async () => {
            console.log("ETL ejecutado");

            try {
                
                const resp = await fetch("/api/firebase/import-homes");
                const data = await resp.json();

                document.getElementById("etlMessage").textContent =
                    data.message || "ETL ejecutado correctamente";

                console.log("ETL RESULT:", data);

            } catch (err) {
                console.error("Error ETL:", err);
                document.getElementById("etlMessage").textContent =
                    "Error al ejecutar ETL";
            }
        });
    }

    // ===============================
    // FORM POST → SQL
    // ===============================

    const form = document.getElementById('postSqlForm-home');

    if (!form) {
        console.error(" ERROR: No se encontró el formulario postSqlForm-home");
        return;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            id_homes: formData.get('id_homes') || undefined,
            address: formData.get('address'),
            social_stratum: formData.get('social_stratum'),
            municipality: formData.get('municipality')
        };

        console.log('[DEBUG] home data:', data);

        try {
            const response = await fetch('/sql/post-home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const message = await response.text();
            document.getElementById('postSqlResult').innerText = message;

        } catch (error) {
            console.error('Error:', error);
            document.getElementById('postSqlResult').innerText = 'Error sending the form.';
        }
    });

});
