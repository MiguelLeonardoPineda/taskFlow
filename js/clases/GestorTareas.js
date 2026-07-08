import { Tarea } from "./Tarea.js";

export class GestorTareas {
  constructor() {
    this.tareas = [];
  }

  agregarTarea(descripcion, fechaLimite = null) {
    const nuevaTarea = new Tarea(descripcion, fechaLimite);
    this.tareas.push(nuevaTarea);
    this.guardarEnLocalStorage();
    return nuevaTarea;
  }

  eliminarTarea(id) {
    this.tareas = this.tareas.filter((tarea) => tarea.id !== id);
    this.guardarEnLocalStorage();
  }

  cambiarEstadoTarea(id) {
    const tareaEncontrada = this.tareas.find((tarea) => tarea.id === id);
    if (tareaEncontrada) {
      tareaEncontrada.cambiarEstado();
      this.guardarEnLocalStorage();
    }
  }

  // Guarda la lista completa de tareas en localStorage (como texto).
  guardarEnLocalStorage() {
    const tareasComoTexto = JSON.stringify(this.tareas);
    localStorage.setItem("tareas", tareasComoTexto);
  }

  // Carga las tareas guardadas desde localStorage al iniciar la app.
  cargarDesdeLocalStorage() {
    const tareasGuardadas = localStorage.getItem("tareas");

    // Si no hay nada guardado, dejamos la lista vacía.
    if (!tareasGuardadas) {
      return;
    }

    // Convertimos el texto en array de objetos planos...
    const objetosPlanos = JSON.parse(tareasGuardadas);

    // ...y reconstruimos cada uno como una instancia real de Tarea.
    this.tareas = objetosPlanos.map((objeto) => Tarea.desdeObjeto(objeto));
  }
}