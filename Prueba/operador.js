document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario || !usuario.nombre || !usuario.rol) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("nombre-usuario").textContent = usuario.nombre;
  document.getElementById("rol-usuario").textContent = usuario.rol;

  document.getElementById("cerrar-sesion").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
  });

  // Funciones para mostrar/ocultar secciones
  function ocultarSecciones() {
    document.getElementById("articulos-section").style.display = "none";
    document.getElementById("prestamos-section").style.display = "none";
  }

  // Mostrar sección según menú
  function mostrarSeccion(id) {
    ocultarSecciones();
    document.getElementById(id).style.display = "block";
  }

  // Inicializa menú (navegación simple)
  const menuLinks = document.querySelectorAll(".nav-menu a");
  menuLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      if (link.textContent === "Artículos") {
        mostrarSeccion("articulos-section");
        cargarCategorias();
        cargarArticulos();
      } else if (link.textContent === "Préstamos") {
        mostrarSeccion("prestamos-section");
        cargarPrestamos();
        cargarArticulosDisponibles();
      } else {
        // Por defecto, muestra articulos
        mostrarSeccion("articulos-section");
        cargarCategorias();
        cargarArticulos();
      }
    });
  });

  // Cargar categorías para el select de artículos
  async function cargarCategorias() {
    const selectCategoria = document.getElementById("categoria-articulo");
    selectCategoria.innerHTML = '<option value="">Seleccione Categoría</option>';

    try {
      const res = await fetch("https://localhost:7236/api/Categoria/listar");
      if (!res.ok) throw new Error("Error al cargar categorías");

      const categorias = await res.json();

      categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.nombre;
        selectCategoria.appendChild(option);
      });
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar las categorías.");
    }
  }

  // Cargar y mostrar artículos
  async function cargarArticulos() {
    const tbody = document.querySelector("#tabla-articulos tbody");
    tbody.innerHTML = "";

    try {
      const res = await fetch("https://localhost:7236/api/Articulos");
      if (!res.ok) throw new Error("Error al cargar artículos");

      const articulos = await res.json();

      articulos.forEach(art => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${art.id}</td>
          <td>${art.codigo}</td>
          <td>${art.nombre}</td>
          <td>${art.ubicacion}</td>
          <td>${art.categoria?.nombre ?? 'Sin categoría'}</td>
          <td>${art.estado?.nombre ?? 'Sin estado'}</td>
        `;
        tbody.appendChild(fila);
      });
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar los artículos.");
    }
  }

  // Crear nuevo artículo
  const formArticulo = document.getElementById("form-crear-articulo");
  formArticulo.addEventListener("submit", async e => {
    e.preventDefault();

    const codigo = document.getElementById("codigo-articulo").value.trim();
    const nombre = document.getElementById("nombre-articulo").value.trim();
    const ubicacion = document.getElementById("ubicacion-articulo").value.trim();
    const categoriaId = document.getElementById("categoria-articulo").value;

    if (!codigo || !nombre || !ubicacion || !categoriaId) {
      return alert("Todos los campos son obligatorios.");
    }

    const nuevoArticulo = {
      codigo,
      nombre,
      ubicacion,
      categoriaId: parseInt(categoriaId),
      estadoId: 1, // Asumimos estado "Disponible" por defecto
    };

    try {
      const res = await fetch("https://localhost:7236/api/Articulos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoArticulo),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.mensaje || "Error al crear artículo");
      }

      alert("Artículo creado exitosamente.");
      formArticulo.reset();
      cargarArticulos();
    } catch (err) {
      console.error(err);
      alert("Error creando artículo: " + err.message);
    }
  });

  // Cargar artículos disponibles para préstamo
  async function cargarArticulosDisponibles() {
    const selectArticulo = document.getElementById("articulo-prestamo");
    selectArticulo.innerHTML = '<option value="">Seleccione Artículo</option>';

    try {
      const res = await fetch("https://localhost:7236/api/Articulos/disponibles");
      if (!res.ok) throw new Error("Error al cargar artículos disponibles");

      const articulos = await res.json();

      articulos.forEach(a => {
        const option = document.createElement("option");
        option.value = a.id;
        option.textContent = a.nombre;
        selectArticulo.appendChild(option);
      });
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar los artículos disponibles.");
    }
  }

  // Cargar y mostrar préstamos
  async function cargarPrestamos() {
    const tbody = document.querySelector("#tabla-prestamos tbody");
    tbody.innerHTML = "";

    try {
      const res = await fetch("https://localhost:7236/api/Prestamos");
      if (!res.ok) throw new Error("Error al cargar préstamos");

      const prestamos = await res.json();

      prestamos.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${p.id}</td>
          <td>${p.articulo?.nombre ?? 'N/A'}</td>
          <td>${new Date(p.fechaEntrega).toLocaleDateString()}</td>
          <td>${p.fechaDevolucion ? new Date(p.fechaDevolucion).toLocaleDateString() : '—'}</td>
          <td>${p.estado}</td>
        `;
        tbody.appendChild(fila);
      });
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar los préstamos.");
    }
  }

  // Crear nuevo préstamo
  const formPrestamo = document.getElementById("form-crear-prestamo");
  formPrestamo.addEventListener("submit", async e => {
    e.preventDefault();

    const articuloId = document.getElementById("articulo-prestamo").value;
    const fechaEntrega = document.getElementById("fecha-entrega-prestamo").value;

    if (!articuloId || !fechaEntrega) {
      return alert("Todos los campos son obligatorios.");
    }

    // Fecha solicitud es hoy
    const fechaSolicitud = new Date().toISOString().split("T")[0];

    if (new Date(fechaEntrega) <= new Date(fechaSolicitud)) {
      return alert("La fecha de entrega debe ser posterior a la fecha de solicitud.");
    }

    const nuevoPrestamo = {
      // No hay usuarioId en el HTML, suponemos usuario actual
      usuarioId: usuario.id ?? 1, // Asumiendo id en usuario almacenado
      articuloId: parseInt(articuloId),
      fechaSolicitud,
      fechaEntrega,
    };

    try {
      const res = await fetch("https://localhost:7236/api/Prestamos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPrestamo),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.mensaje || "Error al crear préstamo");
      }

      alert("Préstamo solicitado exitosamente.");
      formPrestamo.reset();
      cargarPrestamos();
      cargarArticulosDisponibles();
    } catch (err) {
      console.error(err);
      alert("Error creando préstamo: " + err.message);
    }
  });

  // Mostrar sección por defecto
  mostrarSeccion("articulos-section");
  cargarCategorias();
  cargarArticulos();
});
