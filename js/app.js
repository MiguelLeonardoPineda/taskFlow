import { GestorTareas } from "./clases/GestorTareas.js";

const gestor = new GestorTareas();

gestor.agregarTarea("Estudiar programación orientada a objetos");
gestor.agregarTarea("Terminar el proyecto del módulo 4");
gestor.agregarTarea("Hacer commit en Git");

console.log("Tareas después de agregar:", gestor.tareas);

// Cambiamos el estado de la segunda tarea usando destructuring.
const [primera, segunda] = gestor.tareas;
gestor.cambiarEstadoTarea(segunda.id);
console.log(`Estado de la segunda tarea: ${segunda.estado}`);

// Eliminamos la primera tarea.
gestor.eliminarTarea(primera.id);
console.log("Tareas después de eliminar la primera:", gestor.tareas);