import { Tarea } from "./Tarea.js";

export class GestorTareas {

  constructor() {
    this.tareas = [];
  }

  // Crea una nueva tarea y la agrega a la lista.
  agregarTarea(descripcion) {
    const nuevaTarea = new Tarea(descripcion);
    this.tareas.push(nuevaTarea);
    return nuevaTarea;
  }

  // Elimina una tarea: nos quedamos con TODAS menos la del id recibido.
  eliminarTarea(id) {
    this.tareas = this.tareas.filter((tarea) => tarea.id !== id);
  }

  // Busca la tarea por id y le pide que cambie su propio estado.
  cambiarEstadoTarea(id) {
    const tareaEncontrada = this.tareas.find((tarea) => tarea.id === id);
    if (tareaEncontrada) {
      tareaEncontrada.cambiarEstado();
    }
  }
}