import { GestorTareas } from "./clases/GestorTareas.js";


const gestor = new GestorTareas();

// URL de la API de práctica JSON Placeholder.
const URL_API = "https://jsonplaceholder.typicode.com/todos";

//  Elementos del DOM 
const formularioTarea = document.getElementById("formularioTarea");
const inputTarea = document.getElementById("inputTarea");
const inputFecha = document.getElementById("inputFecha");
const listaTareas = document.getElementById("listaTareas");
const contadorCaracteres = document.getElementById("contadorCaracteres");
const notificacion = document.getElementById("notificacion");

//  Función que muestra una notificación temporal 
const mostrarNotificacion = (mensaje) => {
  notificacion.textContent = mensaje;
  setTimeout(() => {
    notificacion.textContent = "";
  }, 2000);
};

// Calcula el texto del tiempo restante para una fecha límite 
const calcularTiempoRestante = (fechaLimite) => {
  const ahora = new Date();
  const diferencia = fechaLimite - ahora;

  if (diferencia <= 0) {
    return "tiempo cumplido";
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

    //  Agregamos todos los elementos al DOM
    elementoTarea.appendChild(textoTarea);
    elementoTarea.appendChild(contadorTarea);
    elementoTarea.appendChild(botonCompletar);
    elementoTarea.appendChild(botonEliminar);
    listaTareas.appendChild(elementoTarea);
  });
};

// --- Función que envía la tarea a la API  ---
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

//  Evento submit
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

// Evento keyup: contar caracteres mientras el usuario escribe 
inputTarea.addEventListener("keyup", () => {
  const cantidad = inputTarea.value.length;
  contadorCaracteres.textContent = `${cantidad} caracteres`;
});

//  setInterval global actualiza todos los contadores cada segundo 
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

//  Al iniciar la app, cargamos las tareas guardadas y las mostramos 
gestor.cargarDesdeLocalStorage();
renderizarTareas();