// Definimos la clase Tarea: el "molde" para crear tareas.
export class Tarea {

  // El constructor se ejecuta AUTOMÁTICAMENTE cada vez que creamos una tarea.
  // Recibe la descripción que escribirá el usuario.
  constructor(descripcion) {
    this.id = crypto.randomUUID();   // Identificador único universal (UUID)
    this.descripcion = descripcion;  // El texto de la tarea (ej: "Estudiar JS")
    this.estado = "pendiente";       // Toda tarea nace como "pendiente"
    this.fechaCreacion = new Date(); // Guardamos el momento exacto de creación
  }

  // Método para alternar el estado entre "pendiente" y "completada".
  cambiarEstado() {
    if (this.estado === "pendiente") {
      this.estado = "completada";
    } else {
      this.estado = "pendiente";
    }
  }
}