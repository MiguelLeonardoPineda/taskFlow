// Definimos la clase Tarea: el "molde" para crear tareas.
export class Tarea {
  // El constructor se ejecuta al crear cada tarea.
  // fechaLimite es opcional: si no se pasa, vale null.
  constructor(descripcion, fechaLimite = null) {
    this.id = crypto.randomUUID();     // Identificador único universal.
    this.descripcion = descripcion;    // El texto de la tarea.
    this.estado = "pendiente";         // Toda tarea nace como "pendiente".
    this.fechaCreacion = new Date();   // Momento exacto de creación.
    this.fechaLimite = fechaLimite;    // Fecha tope, o null si no tiene.
  }

  // Alterna el estado entre "pendiente" y "completada".
  cambiarEstado() {
    if (this.estado === "pendiente") {
      this.estado = "completada";
    } else {
      this.estado = "pendiente";
    }
  }
}