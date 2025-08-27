document.addEventListener("DOMContentLoaded", () => {
    const formReserva = document.getElementById("formReserva");
    const resumenReserva = document.getElementById("resumenReserva");
    const fechaInput = document.getElementById("fecha");
  
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    const maxDate = new Date(hoy);
    maxDate.setDate(hoy.getDate() + 10);
  
    const formatoFecha = fecha => fecha.toISOString().split("T")[0];
    fechaInput.min = formatoFecha(mañana);
    fechaInput.max = formatoFecha(maxDate);

    function calcularPrecio(duracion, modalidad) {
      duracion = parseInt(duracion);
      let precio = 0;
  
      if (duracion === 30) precio = 15000;
      if (duracion === 60) precio = 30000;
      if (duracion === 90) precio = 45000 * 0.9; 
  
      if (duracion === 30 && modalidad.toLowerCase() === "domicilio") precio += 2000;
  
      return precio;
    }

    formReserva.addEventListener("submit", e => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value;
      const tipo = document.getElementById("tipo").value;
      const duracion = document.getElementById("duracion").value;
      const modalidad = document.getElementById("modalidad").value;
      const fecha = document.getElementById("fecha").value;
  
      const precioFinal = calcularPrecio(duracion, modalidad);
      const codigoReserva = Math.floor(Math.random() * 100000);
  
      const reserva = { codigo: codigoReserva, nombre, tipo, duracion, modalidad, fecha, precio: precioFinal };
  
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
        <p><strong>Precio final:</strong> $${precioFinal}</p>
      `;
  
      formReserva.reset();
    });
  });

  function consultarReserva() {
    const codigo = document.getElementById("codigoReserva").value;
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const reserva = reservas.find(r => r.codigo == codigo);
  
    const resultado = document.getElementById("resultadoReserva");
    if (reserva) {
      resultado.innerHTML = `
        <h3>🔎 Reserva encontrada</h3>
        <p><strong>Nombre:</strong> ${reserva.nombre}</p>
        <p><strong>Tipo:</strong> ${reserva.tipo}</p>
        <p><strong>Duración:</strong> ${reserva.duracion} minutos</p>
        <p><strong>Modalidad:</strong> ${reserva.modalidad}</p>
        <p><strong>Fecha:</strong> ${reserva.fecha}</p>
        <p><strong>Precio:</strong> $${reserva.precio}</p>
      `;
    } else {
      resultado.innerHTML = `<p style="color:red;">❌ No se encontró ninguna reserva con ese código.</p>`;
    }
  }