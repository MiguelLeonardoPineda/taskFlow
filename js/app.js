import { GestorTareas } from "./clases/GestorTareas.js";

// El gestor: el "cerebro" que guarda todas las tareas.
const gestor = new GestorTareas();

// --- Elementos del DOM ---
const formularioTarea = document.getElementById("formularioTarea");
const inputTarea = document.getElementById("inputTarea");
const listaTareas = document.getElementById("listaTareas");
const contadorCaracteres = document.getElementById("contadorCaracteres");

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

    // --- Armamos el <li> con sus tres piezas y lo metemos en el <ul> ---
    elementoTarea.appendChild(textoTarea);
    elementoTarea.appendChild(botonCompletar);
    elementoTarea.appendChild(botonEliminar);
    listaTareas.appendChild(elementoTarea);
  });
};

// --- Evento submit: agregar una tarea nueva ---
formularioTarea.addEventListener("submit", (evento) => {
  // Evitamos que el formulario recargue la página.
  evento.preventDefault();

  // Leemos lo escrito y quitamos espacios sobrantes.
  const descripcion = inputTarea.value.trim();

  // Si está vacío, no hacemos nada.
  if (descripcion === "") {
    return;
  }

  gestor.agregarTarea(descripcion);
  inputTarea.value = "";

  // Reiniciamos el contador tras limpiar el input.
  contadorCaracteres.textContent = "0 caracteres";

  // Redibujamos la pantalla con la lista actualizada.
  renderizarTareas();
});

// --- Evento keyup: contar caracteres mientras el usuario escribe ---
inputTarea.addEventListener("keyup", () => {
  const cantidad = inputTarea.value.length;
  contadorCaracteres.textContent = `${cantidad} caracteres`;
});