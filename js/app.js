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
  setTimeout(() => {
    notificacion.textContent = "";
  }, 2000);
};

// --- Calcula el texto del tiempo restante para una fecha límite ---
const calcularTiempoRestante = (fechaLimite) => {
  const ahora = new Date();
  const diferencia = fechaLimite - ahora;

  if (diferencia <= 0) {
    return "¡Tiempo cumplido!";
  }

  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  return `Faltan ${horas}h ${minutos}m ${segundos}s`;
};

// --- Función que dibuja TODAS las tareas en pantalla ---
const renderizarTareas = () => {
  listaTareas.innerHTML = "";

  gestor.tareas.forEach((tarea) => {
    // Creamos el <li> y le damos su clase base.
    const elementoTarea = document.createElement("li");
    elementoTarea.classList.add("tarea");

    // --- Eventos mouseover/mouseout: agregar y quitar clase de resaltado ---
    elementoTarea.addEventListener("mouseover", () => {
      elementoTarea.classList.add("tarea-resaltada");
    });
    elementoTarea.addEventListener("mouseout", () => {
      elementoTarea.classList.remove("tarea-resaltada");
    });

    // --- Texto de la tarea ---
    const textoTarea = document.createElement("span");
    textoTarea.classList.add("tarea-texto");
    textoTarea.textContent = tarea.descripcion;

    // Si está completada, agregamos la clase que la tacha (definida en CSS).
    if (tarea.estado === "completada") {
      textoTarea.classList.add("tarea-completada");
    }

    // --- Contador regresivo (solo si la tarea tiene fecha límite) ---
    const contadorTarea = document.createElement("span");
    contadorTarea.classList.add("tarea-contador");
    contadorTarea.id = `contador-${tarea.id}`;
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

    // --- Armamos el <li> y lo metemos en el <ul> ---
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

    const respuesta = await fetch(`${URL_API}?_limit=5`);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    datos.forEach((item) => {
      gestor.agregarTarea(item.title);
    });

    renderizarTareas();
    mostrarNotificacion("¡Tareas de ejemplo cargadas!");

    // Evitamos duplicados: deshabilitamos el botón tras cargarlas una vez.
    botonCargarApi.disabled = true;
    botonCargarApi.textContent = "Tareas de ejemplo ya cargadas";
  } catch (error) {
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
  evento.preventDefault();

  const descripcion = inputTarea.value.trim();

  if (descripcion === "") {
    return;
  }

  mostrarNotificacion("Agregando tarea...");

  setTimeout(() => {
    const fechaLimite = inputFecha.value ? new Date(inputFecha.value) : null;
    gestor.agregarTarea(descripcion, fechaLimite);
    renderizarTareas();
    mostrarNotificacion("¡Tarea agregada!");
    enviarTareaAApi(descripcion);
  }, 1000);

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
    if (tarea.fechaLimite) {
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