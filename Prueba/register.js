document.getElementById('register-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nombre = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden.');
    return;
  }
  const data = { nombre, email, password };
  try {
    const response = await fetch('https://localhost:7236/api/Cuenta/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      window.location.href = 'login.html'; 
    } else {
      const errorData = await response.json();
      alert('Error en el registro: ' + (errorData.message || 'Revise sus datos'));
    }
  } catch (error) {
    alert('Error al conectar con el servidor.');
    console.error(error);
  }
});
