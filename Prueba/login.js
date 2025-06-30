document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://localhost:7236/api/Cuenta/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("usuario", JSON.stringify(data));
      if (data.rol === "Administrador") {
        window.location.href = "inventario.html";
      } else if (data.rol === "Operador") {
        window.location.href = "operador.html";
      } else {
        alert("Rol no reconocido. Contacte al administrador.");
      }
    } else {
      alert("Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error al conectar:", error);
    alert("Error al conectar con el servidor.");
  }
});

