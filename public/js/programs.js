// public/js/programs.js
document.getElementById('postSqlForm-programs')?.addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    social_program_id: formData.get('social_program_id') || formData.get('id_programs'),
    beneficiary_id: formData.get('beneficiary_id') || formData.get('program_beneficiary_id') || formData.get('beneficiary')
  };

  console.log('[DEBUG] programs data:', data);

  try {
    const response = await fetch('/sql/post-program-beneficiary', { // main route
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    
    if (!response.ok) {
      console.warn('Primary route failed, trying /sql/post-programs alias');
      const response2 = await fetch('/sql/post-programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const msg2 = await response2.text();
      document.getElementById('postSqlResult').innerText = msg2;
      return;
    }

    const message = await response.text();
    document.getElementById('postSqlResult').innerText = message;
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('postSqlResult').innerText = 'Error sending the form.';
  }
});
