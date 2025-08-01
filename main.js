const tiposMasaje = ["relajante", "descontracturante", "personalizado"];
const duraciones = [30, 60, 90];
const modalidades = ["gabinete", "domicilio"];
const preciosPorMinuto = {
  relajante: 500,
  descontracturante: 600,
  personalizado: 700,
};

const reservas = [];

function generarNumeroReserva() {
  const numero = Math.floor(Math.random() * 9000) + 1000;
  return `${numero}`;
}

function obtenerPrecioBase(tipo, duracion) {
  if (preciosPorMinuto[tipo]) {
    return preciosPorMinuto[tipo] * duracion;
  } else {
    alert("Tipo de masaje no válido");
    return 0;
  }
}

function simularTurno() {
  alert("Bienvenido al simulador de turnos de SerZen");

  const nombre = prompt("¿Cuál es tu nombre?");
  if (!nombre) return alert("No ingresaste tu nombre. Fin del proceso.");

  let tipo = prompt(
    `Hola ${nombre}! ¿Qué tipo de masaje querés? (relajante / descontracturante / personalizado)`
  ).toLowerCase();
  while (!tiposMasaje.includes(tipo)) {
    tipo = prompt(
      "Tipo no válido. Elegí: relajante / descontracturante / personalizado"
    ).toLowerCase();
  }

  let duracion = parseInt(prompt("¿Cuántos minutos? (30, 60 o 90)"));
  while (!duraciones.includes(duracion)) {
    duracion = parseInt(prompt("Duración no válida. Elegí: 30, 60 o 90"));
  }

  let modalidad = prompt(
    "¿Dónde querés el servicio? (gabinete / domicilio)"
  ).toLowerCase();
  while (!modalidades.includes(modalidad)) {
    modalidad = prompt(
      "Opción no válida. Elegí: gabinete / domicilio"
    ).toLowerCase();
  }

  let precio = obtenerPrecioBase(tipo, duracion);
  let detalleAdicional = "";

  if (modalidad === "domicilio") {
    if (duracion === 30) {
      precio += 3000;
      detalleAdicional = "(Recargo por domicilio en sesiones cortas)";
    } else if (duracion === 90) {
      const descuento = precio * 0.1;
      precio -= descuento;
      detalleAdicional = "(10% de descuento por sesión larga a domicilio)";
    }
  }

  const numeroReserva = generarNumeroReserva();

  const resumen = ` Turno para: ${nombre}\n
Masaje: ${tipo}\n
Duración: ${duracion} minutos\n
Modalidad: ${modalidad}\n
Precio final: $${precio} ${detalleAdicional}\n
Número de reserva: ${numeroReserva}\n`;

  console.log(resumen);
  const confirmacion = confirm(resumen + "\n¿Confirmás tu turno?");

  if (confirmacion) {
    alert("Turno confirmado. ¡Gracias por elegir SerZen!");

    reservas.push({
      numeroReserva,
      nombre,
      tipo,
      duracion,
      modalidad,
      precio,
    });

    mostrarReservas();
  } else {
    alert("❌ Turno cancelado. Te esperamos cuando quieras relajarte.");
  }
}

function mostrarReservas() {
  if (reservas.length === 0) {
    alert("No hay reservas registradas aún.");
    return;
  }

  let listaReservas = "Reservas actuales:\n\n";
  for (const reserva of reservas) {
    listaReservas += `#${reserva.numeroReserva} - ${reserva.nombre} - ${reserva.tipo} - ${reserva.duracion} min - ${reserva.modalidad} - $${reserva.precio}\n`;
  }
  alert(listaReservas);
}

simularTurno();

function consultarReserva() {
  const input = document
    .getElementById("codigoReserva")
    .value.trim()
    .toUpperCase();
  const resultado = document.getElementById("resultadoReserva");

  const reservaEncontrada = reservas.find(
    (reserva) => reserva.numeroReserva === input
  );

  if (reservaEncontrada) {
    resultado.textContent = `✅ Reserva encontrada:

Nombre: ${reservaEncontrada.nombre}
Masaje: ${reservaEncontrada.tipo}
Duración: ${reservaEncontrada.duracion} minutos
Modalidad: ${reservaEncontrada.modalidad}
Precio: $${reservaEncontrada.precio}
Código: ${reservaEncontrada.numeroReserva}`;
  } else {
    resultado.textContent = "❌ No se encontró ninguna reserva con ese código.";
  }
}
