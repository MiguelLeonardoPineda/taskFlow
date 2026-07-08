import { GestorTareas } from "./clases/GestorTareas.js";

// El gestor: el "cerebro" que guarda todas las tareas.
const gestor = new GestorTareas();

// URL de la API de práctica (JSONPlaceholder).
const URL_API = "https://jsonplaceholder.typicode.com/todos";

// --- Elementos del DOM ---
const formularioTarea = document.getElementById("formularioTarea");
const inputTarea = document.getElementById("inputTarea");
const inputFecha = document.getElementById("inputFecha");
const listaTareas = document.getElementById("listaTareas");
const contadorCaracteres = document.getElementById("contadorCaracteres");
const notificacion = document.getElementById("notificacion");
const botonCargarApi = document.getElementById("botonCargarApi");

// --- Función que muestra una notificación temporal ---
const mostrarNotificacion = (mensaje) => {
  notificacion.textContent = mensaje;

  // La notificación desaparece sola tras 2 segundos.
  setTimeout(() => {
    notificacion.textContent = "";
  }, 2000);
};

// --- Calcula el texto del tiempo restante para una fecha límite ---
const calcularTiempoRestante = (fechaLimite) => {
  const ahora = new Date();
  const diferencia = fechaLimite - ahora; // diferencia en milisegundos

  // Si ya se pasó la fecha, avisamos.
  if (diferencia <= 0) {
    return "¡Tiempo cumplido!";
  }

  // Convertimos los milisegundos a horas, minutos y segundos.
  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  return `Faltan ${horas}h ${minutos}m ${segundos}s`;
};

// --- Función que dibuja TODAS las tareas en pantalla ---
const renderizarTareas = () => {
  // 1. Vaciamos la lista para redibujarla desde cero.
  listaTareas.innerHTML = "";

  // 2. Recorremos cada tarea del gestor.
  gestor.tareas.forEach((tarea) => {
    // Creamos el <li> contenedor de esta tarea.
    const elementoTarea = document.createElement("li");

    // --- Evento mouseover: resaltar la tarea al pasar el mouse ---
    elementoTarea.addEventListener("mouseover", () => {
      elementoTarea.style.backgroundColor = "#f0f0f0";
    });

    // --- Evento mouseout: quitar el resaltado al salir el mouse ---
    elementoTarea.addEventListener("mouseout", () => {
      elementoTarea.style.backgroundColor = "";
    });

    // --- Texto de la tarea ---
    const textoTarea = document.createElement("span");
    textoTarea.textContent = tarea.descripcion;

    // Si la tarea está completada, la mostramos tachada.
    if (tarea.estado === "completada") {
      textoTarea.style.textDecoration = "line-through";
    }

    // --- Contador regresivo (solo si la tarea tiene fecha límite) ---
    const contadorTarea = document.createElement("span");
    contadorTarea.id = `contador-${tarea.id}`; // id único para actualizarlo luego
    contadorTarea.style.fontSize = "12px";
    contadorTarea.style.color = "#c0392b";
    if (tarea.fechaLimite) {
      contadorTarea.textContent = calcularTiempoRestante(tarea.fechaLimite);
    }

    // --- Botón completar / reactivar ---
    const botonCompletar = document.createElement("button");
    botonCompletar.textContent =
      tarea.estado === "pendiente" ? "Completar" : "Reactivar";

    botonCompletar.addEventListener("click", () => {
      gestor.cambiarEstadoTarea(tarea.id);
      renderizarTareas();
    });

    // --- Botón eliminar ---
    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";

    botonEliminar.addEventListener("click", () => {
      gestor.eliminarTarea(tarea.id);
      renderizarTareas();
    });

    // --- Armamos el <li> con todas sus piezas y lo metemos en el <ul> ---
    elementoTarea.appendChild(textoTarea);
    elementoTarea.appendChild(contadorTarea);
    elementoTarea.appendChild(botonCompletar);
    elementoTarea.appendChild(botonEliminar);
    listaTareas.appendChild(elementoTarea);
  });
};

// --- Trae tareas de ejemplo desde la API (GET con fetch) ---
const cargarTareasDesdeApi = async () => {
  try {
    mostrarNotificacion("Consultando API...");

    // Pedimos solo 5 tareas para no llenar la lista.
    const respuesta = await fetch(`${URL_API}?_limit=5`);

    // Si la respuesta no fue exitosa, lanzamos un error a propósito.
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    // Convertimos la respuesta en datos utilizables (array de objetos).
    const datos = await respuesta.json();

    // Por cada dato recibido, agregamos una tarea a nuestro gestor.
    datos.forEach((item) => {
      gestor.agregarTarea(item.title);
    });

    renderizarTareas();
    mostrarNotificacion("¡Tareas de ejemplo cargadas!");
  } catch (error) {
    // Si algo falla (sin internet, API caída, etc.), lo capturamos aquí.
    console.error("Error al cargar desde la API:", error);
    mostrarNotificacion("No se pudieron cargar las tareas de la API.");
  }
};

// --- Envía una tarea a la API (POST con fetch) ---
// Nota: JSONPlaceholder NO guarda de verdad; responde como si lo hiciera.
const enviarTareaAApi = async (descripcion) => {
  try {
    const respuesta = await fetch(URL_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: descripcion,
        completed: false,
      }),
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    console.log("Respuesta de la API (POST simulado):", datos);
  } catch (error) {
    console.error("Error al enviar a la API:", error);
  }
};

// --- Evento submit: agregar una tarea nueva (con retardo simulado) ---
formularioTarea.addEventListener("submit", (evento) => {
  // Evitamos que el formulario recargue la página.
  evento.preventDefault();

  // Leemos lo escrito y quitamos espacios sobrantes.
  const descripcion = inputTarea.value.trim();

  // Si está vacío, no hacemos nada.
  if (descripcion === "") {
    return;
  }

  // Mostramos un mensaje de "cargando" inmediatamente.
  mostrarNotificacion("Agregando tarea...");

  // Simulamos un retardo de 1 segundo (como si guardáramos en un servidor).
  setTimeout(() => {
    // Si el usuario eligió fecha, la convertimos a Date; si no, null.
    const fechaLimite = inputFecha.value ? new Date(inputFecha.value) : null;
    gestor.agregarTarea(descripcion, fechaLimite);
    renderizarTareas();
    mostrarNotificacion("¡Tarea agregada!");

    // Además, enviamos la tarea a la API como demostración de consumo.
    enviarTareaAApi(descripcion);
  }, 1000);

  // Los campos se limpian de inmediato, sin esperar el retardo.
  inputTarea.value = "";
  inputFecha.value = "";
  contadorCaracteres.textContent = "0 caracteres";
});

// --- Evento keyup: contar caracteres mientras el usuario escribe ---
inputTarea.addEventListener("keyup", () => {
  const cantidad = inputTarea.value.length;
  contadorCaracteres.textContent = `${cantidad} caracteres`;
});

// --- Evento click en el botón de cargar desde la API ---
botonCargarApi.addEventListener("click", () => {
  cargarTareasDesdeApi();
});

// --- setInterval global: actualiza todos los contadores cada segundo ---
setInterval(() => {
  gestor.tareas.forEach((tarea) => {
    // Solo si la tarea tiene fecha límite.
    if (tarea.fechaLimite) {
      // Buscamos el <span> del contador de esta tarea por su id.
      const contador = document.getElementById(`contador-${tarea.id}`);
      if (contador) {
        contador.textContent = calcularTiempoRestante(tarea.fechaLimite);
      }
    }
  });
}, 1000);

// --- Al iniciar la app: cargamos las tareas guardadas y las mostramos ---
gestor.cargarDesdeLocalStorage();
renderizarTareas();