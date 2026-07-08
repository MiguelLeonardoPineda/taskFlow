// Ahora importamos el GESTOR, no la Tarea directamente:
// será el gestor quien cree las tareas por nosotros.
import { GestorTareas } from "./clases/GestorTareas.js";

// Creamos UN archivador para toda la aplicación.
const gestor = new GestorTareas();

// Agregamos tres tareas.
gestor.agregarTarea("Estudiar programación orientada a objetos");
gestor.agregarTarea("Terminar el proyecto del módulo 4");
gestor.agregarTarea("Hacer commit en Git");

console.log("Tareas después de agregar:", gestor.tareas);

// Cambiamos el estado de la segunda tarea (índice 1).
const idSegunda = gestor.tareas[1].id;
gestor.cambiarEstadoTarea(idSegunda);
console.log("Estado de la segunda tarea:", gestor.tareas[1].estado);

// Eliminamos la primera tarea (índice 0) usando su id.
const idPrimera = gestor.tareas[0].id;
gestor.eliminarTarea(idPrimera);
console.log("Tareas después de eliminar la primera:", gestor.tareas);