// Importamos la clase Tarea porque el gestor necesita CREAR tareas.
// Están en la misma carpeta, por eso la ruta empieza con "./"
import { Tarea } from "./Tarea.js";

export class GestorTareas {

  constructor() {
    this.tareas = []; // La lista arranca vacía: aún no hay ninguna tarea.
  }

  // Crea una nueva tarea a partir de una descripción y la mete en la lista.
  agregarTarea(descripcion) {
    const nuevaTarea = new Tarea(descripcion);
    this.tareas.push(nuevaTarea);
    return nuevaTarea;
  }

  // Elimina de la lista la tarea cuyo id coincida con el recibido.
  eliminarTarea(id) {
    for (let i = 0; i < this.tareas.length; i++) {
      if (this.tareas[i].id === id) {
        this.tareas.splice(i, 1);
        break;
      }
    }
  }

  // Busca una tarea por su id y le pide que cambie su propio estado.
  cambiarEstadoTarea(id) {
  console.log("Buscando id:", id, "tipo:", typeof id);
  for (let i = 0; i < this.tareas.length; i++) {
    console.log("Comparando con:", this.tareas[i].id, "tipo:", typeof this.tareas[i].id);
    if (this.tareas[i].id === id) {
      console.log("¡Coincidencia encontrada!");
      this.tareas[i].cambiarEstado();
      break;
    }
  }
}
}