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

  function ocultarSecciones() {
    document.getElementById("categorias-section").style.display = "none";
    document.getElementById("articulos-section").style.display = "none";
    document.getElementById("prestamos-section").style.display = "none";
    document.getElementById("multas-section").style.display = "none";
  }

  async function cargarCategorias() {
    const tbody = document.querySelector("#tabla-categorias tbody");
    tbody.innerHTML = "";

    try {
      const res = await fetch("https://localhost:7236/api/Categoria/listar");
      if (!res.ok) throw new Error("Error al cargar categorías");

      const categorias = await res.json();

      categorias.forEach(cat => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${cat.id}</td>
          <td>${cat.nombre}</td>
        `;
        tbody.appendChild(fila);
      });
      const selectCategoria = document.getElementById("categoria-articulo");
      selectCategoria.innerHTML = '<option value="">Seleccione Categoría</option>';
      categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.nombre;
        selectCategoria.appendChild(option);
      });

    } catch (err) {
      console.error("Error al obtener categorías", err);
      alert("No se pudieron cargar las categorías.");
    }
  }

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
          <td>
            <button class="accion-btn" onclick="editarArticulo(${art.id})">Editar</button>
            <button class="accion-btn" onclick="eliminarArticulo(${art.id})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);
      });
    } catch (err) {
      console.error("Error al obtener artículos", err);
      alert("No se pudieron cargar los artículos.");
    }
  }

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
        <td>${p.usuario?.nombre ?? 'N/A'}</td>
        <td>${p.articulo?.nombre ?? 'N/A'}</td>
        <td>${new Date(p.fechaSolicitud).toLocaleString()}</td>
        <td>${new Date(p.fechaEntrega).toLocaleString()}</td>
        <td>${p.fechaDevolucion ? new Date(p.fechaDevolucion).toLocaleString() : '—'}</td>
        <td>${p.estado}</td>
        <td>
          ${
            (p.estado === "Pendiente" || p.estado === "Aprobado")
              ? `<button class="accion-btn" onclick="marcarDevuelto(${p.id})">Marcar Devuelto</button>`
              : "—"
          }
        </td>
      `;
      tbody.appendChild(fila);
    });
    } catch (err) {
      console.error("Error al obtener préstamos", err);
      alert("No se pudieron cargar los préstamos.");
    }
  }

  // Manejo menú
  function initMenu() {
    document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const secciones = document.querySelectorAll("main section");
      secciones.forEach(sec => sec.style.display = "none");

      const texto = link.textContent.trim();

      switch (texto) {
        case "Categorías":
          document.getElementById("categorias-section").style.display = "block";
          break;
        case "Artículos":
          document.getElementById("articulos-section").style.display = "block";
          //cargarArticulos();
          break;
        case "Préstamos":
          document.getElementById("prestamos-section").style.display = "block";
          //cargarPrestamos();
          break;
        case "Multas":
          document.getElementById("multas-section").style.display = "block";
          cargarMultas();
          break;
        case "Reportes":
          document.getElementById("reportes-section").style.display = "block";
          break;
      }
    });
  });

    const categoriasLink = Array.from(document.querySelectorAll(".nav-menu a"))
      .find(a => a.textContent === "Categorías");
    if (categoriasLink) {
      categoriasLink.addEventListener("click", e => {
        e.preventDefault();
        ocultarSecciones();
        document.getElementById("categorias-section").style.display = "block";
        cargarCategorias();
      });
    }

    const multasLink = Array.from(document.querySelectorAll(".nav-menu a"))
    .find(a => a.textContent === "Multas");
      if (multasLink) {
        multasLink.addEventListener("click", e => {
          e.preventDefault();
          ocultarSecciones();
          document.getElementById("multas-section").style.display = "block";
          cargarMultas();  
        });
    }

    const articulosLink = Array.from(document.querySelectorAll(".nav-menu a"))
      .find(a => a.textContent === "Artículos");
    if (articulosLink) {
      articulosLink.addEventListener("click", e => {
        e.preventDefault();
        ocultarSecciones();
        document.getElementById("articulos-section").style.display = "block";
        cargarArticulos();
        cargarCategorias(); 
      });
    }

    const prestamosLink = Array.from(document.querySelectorAll(".nav-menu a"))
      .find(a => a.textContent === "Préstamos");
    if (prestamosLink) {
      prestamosLink.addEventListener("click", e => {
        e.preventDefault();
        ocultarSecciones();
        document.getElementById("prestamos-section").style.display = "block";
        cargarPrestamos();
        cargarUsuarios();
        cargarArticulosDisponibles();
      });
    }
  }

  // Crear categoría
  const formCategoria = document.getElementById("form-crear-categoria");
  formCategoria.addEventListener("submit", async e => {
    e.preventDefault();

    const nombre = document.getElementById("nombre-categoria").value.trim();
    if (!nombre) return alert("El nombre es obligatorio.");

    try {
      const res = await fetch("https://localhost:7236/api/Categoria/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.mensaje || "Error al crear categoría");
      }

      alert("✅ Categoría creada exitosamente.");
      document.getElementById("nombre-categoria").value = "";
      cargarCategorias();

    } catch (err) {
      console.error("Error creando categoría:", err);
      alert("❌ " + err.message);
    }
  });

  const formArticulo = document.getElementById("form-crear-articulo");
  formArticulo.addEventListener("submit", async e => {
    e.preventDefault();

    const codigo = document.getElementById("codigo-articulo").value.trim();
    const nombre = document.getElementById("nombre-articulo").value.trim();
    const ubicacion = document.getElementById("ubicacion-articulo").value.trim();
    const categoriaId = document.getElementById("categoria-articulo").value;

    if (!codigo || !nombre || !ubicacion || !categoriaId ) {
      return alert("Todos los campos son obligatorios.");
    }

    const nuevoArticulo = {
      codigo,
      nombre,
      ubicacion,
      categoriaId: parseInt(categoriaId),
      estadoId: 1,
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

      alert("✅ Artículo creado exitosamente.");
      formArticulo.reset();
      cargarArticulos();

    } catch (err) {
      console.error("Error creando artículo:", err);
      alert("❌ " + err.message);
    }
  });

  async function cargarUsuarios() {
    const selectUsuario = document.getElementById("usuario-prestamo");
    selectUsuario.innerHTML = '<option value="">Seleccione Usuario</option>';

    try {
      const res = await fetch("https://localhost:7236/api/Cuenta/listar");
      if (!res.ok) throw new Error("Error al cargar usuarios");

      const usuarios = await res.json();

      usuarios.forEach(u => {
        const option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.nombre;
        selectUsuario.appendChild(option);
      });

    } catch (err) {
      console.error("Error al cargar usuarios", err);
      alert("No se pudieron cargar los usuarios.");
    }
  }

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
      console.error("Error al cargar artículos disponibles", err);
      alert("No se pudieron cargar los artículos disponibles.");
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const fechaSolicitudInput = document.getElementById("fecha-solicitud-prestamo");
    const hoy = new Date().toISOString().split("T")[0];
    fechaSolicitudInput.value = hoy;
    fechaSolicitudInput.readOnly = true;  
  });

  const formPrestamo = document.getElementById("form-crear-prestamo");
  formPrestamo.addEventListener("submit", async e => {
    e.preventDefault();

    const usuarioId = document.getElementById("usuario-prestamo").value;
    const articuloId = document.getElementById("articulo-prestamo").value;
    const fechaSolicitud = document.getElementById("fecha-solicitud-prestamo").value;
    const fechaEntrega = document.getElementById("fecha-entrega-prestamo").value;

    if (!usuarioId || !articuloId || !fechaSolicitud || !fechaEntrega) {
      return alert("Todos los campos son obligatorios.");
    }

    if (new Date(fechaEntrega) <= new Date(fechaSolicitud)) {
      return alert("La fecha de entrega debe ser posterior a la fecha de solicitud.");
    }

    const nuevoPrestamo = {
      usuarioId: parseInt(usuarioId),
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
        const errorText = await res.text(); 
        let errorMsg = "Error al crear préstamo";

        try {
          const errorJson = JSON.parse(errorText);
          errorMsg = errorJson.mensaje || errorMsg;
        } catch {
          errorMsg = errorText; 
        }

        throw new Error(errorMsg);
      }


      alert("✅ Préstamo creado exitosamente.");
      formPrestamo.reset();

      cargarPrestamos();
      cargarArticulosDisponibles();

    } catch (err) {
      console.error("Error creando préstamo:", err);
      alert("❌ " + err.message);
    }
  });


  async function cargarMultas() {
    try {
      const response = await fetch('https://localhost:7236/api/Multas');
      if (!response.ok) throw new Error('Error al obtener multas');

      const multas = await response.json();
      const tbody = document.querySelector('#tabla-multas tbody');
      tbody.innerHTML = ''; 

      multas.forEach(multa => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${multa.id}</td>
          <td>${multa.prestamoId}</td>
          <td>$${multa.monto.toFixed(2)}</td>
          <td>${new Date(multa.fechaRegistro).toLocaleString()}</td>
          <td>${multa.pagado ? 'Sí' : 'No'}</td>
          <td>
            ${multa.pagado ? '' : `<button class="accion-btn" onclick="pagarMulta(${multa.id})">Pagar</button>`}
          </td>
        `;

        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar las multas');
    }
  }

  
  

  
document.getElementById("btn-exportar-articulos-pdf").addEventListener("click", async () => {
  try {
    const res = await fetch("https://localhost:7236/api/Articulos");
    if (!res.ok) throw new Error("Error al obtener artículos");

    const articulos = await res.json();

    const tabla = document.createElement("table");
    tabla.border = "1";
    tabla.cellPadding = "8";
    tabla.cellSpacing = "0";
    tabla.style.width = "100%";
    tabla.style.fontSize = "12px";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Código</th>
        <th>Nombre</th>
        <th>Ubicación</th>
        <th>Categoría</th>
        <th>Estado</th>
      </tr>
    `;
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");

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

    tabla.appendChild(tbody);

    const wrapper = document.createElement("div");
    wrapper.appendChild(tabla);

    const opt = {
      margin: 0.5,
      filename: "Listado_Articulos.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(wrapper).save();
  } catch (err) {
    console.error("Error exportando PDF:", err);
    alert("❌ " + err.message);
  }
});



document.getElementById("btn-exportar-prestamos-excel").addEventListener("click", () => {
  const tabla = document.getElementById("tabla-prestamos");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(tabla);
  XLSX.utils.book_append_sheet(wb, ws, "Prestamos");

  XLSX.writeFile(wb, "Listado_Prestamos.xlsx");
});

  initMenu();
  ocultarSecciones();
  
});

async function pagarMulta(id) {
  if (!confirm("¿Confirmas el pago de esta multa?")) return;

  try {
    const res = await fetch(`https://localhost:7236/api/Multas/${id}/pagar`, {
      method: "PUT",
    });

    if (!res.ok) {
      let errorMsg = "Error al pagar la multa.";
      try {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errJson = await res.json();
          errorMsg = errJson.mensaje || errorMsg;
        } else {
          const errText = await res.text();
          errorMsg = errText || errorMsg;
        }
      } catch {
      }
      throw new Error(errorMsg);
    }

    const data = await res.json();
    alert("✅ " + data.mensaje);

    cargarMultas();

  } catch (err) {
    console.error("Error al pagar multa:", err);
    alert("❌ " + err.message);
  }
}

async function cargarMultas() {
    try {
      const response = await fetch('https://localhost:7236/api/Multas');
      if (!response.ok) throw new Error('Error al obtener multas');

      const multas = await response.json();
      const tbody = document.querySelector('#tabla-multas tbody');
      tbody.innerHTML = '';

      multas.forEach(multa => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${multa.id}</td>
          <td>${multa.prestamoId}</td>
          <td>$${multa.monto.toFixed(2)}</td>
          <td>${new Date(multa.fechaRegistro).toLocaleString()}</td>
          <td>${multa.pagado ? 'Sí' : 'No'}</td>
          <td>
            ${multa.pagado ? '' : `<button class="accion-btn" onclick="pagarMulta(${multa.id})">Pagar</button>`}
          </td>
        `;

        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar las multas');
    }
  }

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
        <td>${p.usuario?.nombre ?? 'N/A'}</td>
        <td>${p.articulo?.nombre ?? 'N/A'}</td>
        <td>${new Date(p.fechaSolicitud).toLocaleString()}</td>
        <td>${new Date(p.fechaEntrega).toLocaleString()}</td>
        <td>${p.fechaDevolucion ? new Date(p.fechaDevolucion).toLocaleString() : '—'}</td>
        <td>${p.estado}</td>
        <td>
          ${
            (p.estado === "Pendiente" || p.estado === "Aprobado")
              ? `<button class="accion-btn" onclick="marcarDevuelto(${p.id})">Marcar Devuelto</button>`
              : "—"
          }
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error("Error al obtener préstamos", err);
    alert("No se pudieron cargar los préstamos.");
  }
}


async function eliminarArticulo(id) {
  if (!confirm("¿Estás seguro de eliminar este artículo?")) return;

  try {
    const res = await fetch(`https://localhost:7236/api/Articulos/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.mensaje || "Error al eliminar artículo");
    }

    alert("✅ Artículo eliminado correctamente.");
    cargarArticulos();

  } catch (err) {
    console.error("Error eliminando artículo:", err);
    alert("❌ " + err.message);
  }
}

async function marcarDevuelto(id) {
  if (!confirm("¿Confirmas marcar como devuelto?")) return;

  try {
    const res = await fetch(`https://localhost:7236/api/Prestamos/${id}/devolver`, {
      method: "PUT",
    });

    if (!res.ok) {
      let mensajeError = "Error al marcar devolución";
      try {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errJson = await res.json();
          mensajeError = errJson.mensaje || mensajeError;
        } else {
          const errText = await res.text();
          mensajeError = errText || mensajeError;
        }
      } catch (_) {
        
      }

      throw new Error(mensajeError);
    }

    alert("✅ Préstamo marcado como devuelto.");
    cargarPrestamos(); 
    cargarArticulosDisponibles();

  } catch (err) {
    console.error("Error al marcar devuelto:", err);
    alert("❌ " + err.message);
  }
}

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
          <td>
            <button class="accion-btn" onclick="editarArticulo(${art.id})">Editar</button>
            <button class="accion-btn" onclick="eliminarArticulo(${art.id})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);
      });


    } catch (err) {
      console.error("Error al obtener artículos", err);
      alert("No se pudieron cargar los artículos.");
    }
  }


  async function editarArticulo(id) {
  try {
    const res = await fetch(`https://localhost:7236/api/Articulos/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener el artículo");

    const articulo = await res.json();
    document.getElementById("codigo-articulo").value = articulo.codigo;
    document.getElementById("nombre-articulo").value = articulo.nombre;
    document.getElementById("ubicacion-articulo").value = articulo.ubicacion;
    document.getElementById("categoria-articulo").value = articulo.categoriaId;

    const btnGuardar = document.querySelector("#form-crear-articulo button[type='submit']");
    const btnCancelar = document.getElementById("btn-cancelar");

    btnGuardar.textContent = "Actualizar";
    btnCancelar.style.display = "inline-block";

    const formArticulo = document.getElementById("form-crear-articulo");
    formArticulo.removeEventListener("submit", crearArticuloHandler);

    function actualizarArticuloHandler(e) {
      e.preventDefault();

      // Validar campos y construir objeto actualizado
      const codigo = document.getElementById("codigo-articulo").value.trim();
      const nombre = document.getElementById("nombre-articulo").value.trim();
      const ubicacion = document.getElementById("ubicacion-articulo").value.trim();
      const categoriaId = document.getElementById("categoria-articulo").value;

      if (!codigo || !nombre || !ubicacion || !categoriaId) {
        return alert("Todos los campos son obligatorios.");
      }

      const articuloActualizado = {
        codigo,
        nombre,
        ubicacion,
        categoriaId: parseInt(categoriaId),
        estadoId: articulo.estadoId,
      };

      fetch(`https://localhost:7236/api/Articulos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articuloActualizado),
      })
        .then(res => {
          if (!res.ok) return res.json().then(err => Promise.reject(err));
          return res.json();
        })
        .then(() => {
          alert("✅ Artículo actualizado correctamente.");
          formArticulo.reset();
          btnGuardar.textContent = "Guardar";
          btnCancelar.style.display = "none";

          formArticulo.removeEventListener("submit", actualizarArticuloHandler);
          formArticulo.addEventListener("submit", crearArticuloHandler);

          cargarArticulos();
        })
        .catch(err => {
          alert("❌ " + (err.mensaje || "Error al actualizar artículo"));
          console.error(err);
        });
    }

    formArticulo.addEventListener("submit", actualizarArticuloHandler);

    btnCancelar.onclick = () => {
      formArticulo.reset();
      btnGuardar.textContent = "Guardar";
      btnCancelar.style.display = "none";

      formArticulo.removeEventListener("submit", actualizarArticuloHandler);
      formArticulo.addEventListener("submit", crearArticuloHandler);
    };

  } catch (err) {
    alert("❌ " + err.message);
  }
}



const formArticulo = document.getElementById("form-crear-articulo");

function crearArticuloHandler(e) {
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
    estadoId: 1,
  };

  fetch("https://localhost:7236/api/Articulos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoArticulo),
  })
    .then(res => {
      if (!res.ok) return res.json().then(err => Promise.reject(err));
      return res.json();
    })
    .then(() => {
      alert("✅ Artículo creado exitosamente.");
      formArticulo.reset();
      cargarArticulos();
    })
    .catch(err => {
      alert("❌ " + (err.mensaje || "Error al crear artículo"));
      console.error(err);
    });
}

formArticulo.addEventListener("submit", crearArticuloHandler);

const btnCancelar = document.getElementById("btn-cancelar");
btnCancelar.style.display = "inline-block";

btnCancelar.onclick = () => {
  formArticulo.reset();
  btnGuardar.textContent = "Guardar";
  btnCancelar.style.display = "none";

  formArticulo.removeEventListener("submit", actualizarArticuloHandler);
  formArticulo.addEventListener("submit", crearArticuloHandler);
};

btnCancelar.style.display = "none";