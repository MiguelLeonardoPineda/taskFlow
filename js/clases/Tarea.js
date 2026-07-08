// Definimos la clase Tarea: el "molde" para crear tareas.
export class Tarea {
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

  // Reconstruye una instancia de Tarea a partir de un objeto plano
  // (por ejemplo, uno recuperado de localStorage).
  static desdeObjeto(objeto) {
    const tarea = new Tarea(objeto.descripcion, objeto.fechaLimite);
    tarea.id = objeto.id;                 // Conservamos el id original.
    tarea.estado = objeto.estado;         // Conservamos el estado guardado.
    tarea.fechaCreacion = objeto.fechaCreacion;
    // Si había fecha límite guardada, la volvemos a convertir en Date.
    tarea.fechaLimite = objeto.fechaLimite ? new Date(objeto.fechaLimite) : null;
    return tarea;
  }
}