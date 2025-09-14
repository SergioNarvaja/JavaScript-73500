document.addEventListener("DOMContentLoaded", () => {
  const formReserva = document.getElementById("formReserva");
  const resumenReserva = document.getElementById("resumenReserva");
  const fechaInput = document.getElementById("fecha");
  const btnConsultar = document.getElementById("btnConsultar");
  const resultadoReserva = document.getElementById("resultadoReserva");
  const editarReserva = document.getElementById("editarReserva");

  let servicios = [];

  axios.get("./data/servicios.json")
    .then(response => {
      servicios = response.data;
      const tipoSelect = document.getElementById("tipo");
      servicios.forEach(servicio => {
        const option = document.createElement("option");
        option.value = servicio.tipo;
        option.textContent = "Masaje " + servicio.tipo.charAt(0).toUpperCase() + servicio.tipo.slice(1);
        tipoSelect.appendChild(option);
      });
    })
    .catch(error => console.error("Error cargando JSON:", error));

  const hoy = new Date();
  const mañana = new Date(hoy);
  mañana.setDate(hoy.getDate() + 1);

  const maxDate = new Date(hoy);
  maxDate.setDate(hoy.getDate() + 10);

  const formatoFecha = (fecha) => fecha.toISOString().split("T")[0];
  fechaInput.min = formatoFecha(mañana);
  fechaInput.max = formatoFecha(maxDate);

  function calcularPrecio(tipo, duracion, modalidad) {
    const servicio = servicios.find(s => s.tipo === tipo);
    if (!servicio) return 0;

    let precioBase = servicio.precioPorMinuto * parseInt(duracion);

    if (duracion == 90) {
      precioBase *= 0.9;
    }
    if (duracion == 30 && modalidad === "Domicilio") {
      precioBase += 2000;
    }

    return precioBase;
  }

  formReserva.addEventListener("submit", e => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const tipo = document.getElementById("tipo").value;
    const duracion = document.getElementById("duracion").value;
    const modalidad = document.getElementById("modalidad").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    const precioFinal = calcularPrecio(tipo, duracion, modalidad);
    const codigoReserva = Math.floor(Math.random() * 100000);

    const reserva = { 
      codigo: codigoReserva, 
      nombre, 
      tipo, 
      duracion, 
      modalidad, 
      fecha, 
      hora,
      precio: precioFinal 
    };

    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas.push(reserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    resumenReserva.innerHTML = `
      <h3>✅ Reserva confirmada</h3>
      <p><strong>Código:</strong> ${codigoReserva}</p>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Tipo:</strong> ${tipo}</p>
      <p><strong>Duración:</strong> ${duracion} minutos</p>
      <p><strong>Modalidad:</strong> ${modalidad}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Hora:</strong> ${hora}</p>
      <p><strong>Precio final:</strong> $${precioFinal}</p>
    `;

    formReserva.reset();
  });

  btnConsultar.addEventListener("click", () => {
    const codigo = document.getElementById("codigoReserva").value;
    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const reserva = reservas.find(r => r.codigo == codigo);

    if (reserva) {
      resultadoReserva.innerHTML = `
        <h3>🔎 Reserva encontrada</h3>
        <p><strong>Nombre:</strong> ${reserva.nombre}</p>
        <p><strong>Tipo:</strong> ${reserva.tipo}</p>
        <p><strong>Duración:</strong> ${reserva.duracion} minutos</p>
        <p><strong>Modalidad:</strong> ${reserva.modalidad}</p>
        <p><strong>Fecha:</strong> ${reserva.fecha}</p>
        <p><strong>Hora:</strong> ${reserva.hora}</p>
        <p><strong>Precio:</strong> $${reserva.precio}</p>
      `;

      editarReserva.innerHTML = `
        <h3>✏️ Editar / Cancelar Reserva</h3>
        <label>Nueva fecha:</label>
        <input type="date" id="nuevaFecha" value="${reserva.fecha}">
        <label>Nueva hora:</label>
        <input type="time" id="nuevaHora" min="09:00" max="20:00" value="${reserva.hora}">
        <button id="btnGuardarCambios">Guardar cambios</button>
        <button id="btnCancelarReserva" style="background:red; color:white;">Cancelar reserva</button>
      `;

      document.getElementById("btnGuardarCambios").addEventListener("click", () => {
        const nuevaFecha = document.getElementById("nuevaFecha").value;
        const nuevaHora = document.getElementById("nuevaHora").value;

        reserva.fecha = nuevaFecha;
        reserva.hora = nuevaHora;

        localStorage.setItem("reservas", JSON.stringify(reservas));

        resultadoReserva.innerHTML = `<p style="color:green;">✅ Reserva actualizada correctamente.</p>`;
        editarReserva.innerHTML = "";
      });

      document.getElementById("btnCancelarReserva").addEventListener("click", () => {
        reservas = reservas.filter(r => r.codigo != codigo);
        localStorage.setItem("reservas", JSON.stringify(reservas));

        resultadoReserva.innerHTML = `<p style="color:red;">❌ Reserva cancelada.</p>`;
        editarReserva.innerHTML = "";
      });

    } else {
      resultadoReserva.innerHTML = `<p style="color:red;">❌ No se encontró ninguna reserva con ese código.</p>`;
      editarReserva.innerHTML = "";
    }
  });
});