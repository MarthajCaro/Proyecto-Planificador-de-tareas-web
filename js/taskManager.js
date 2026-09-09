class TaskManager {
  constructor(currentId = 0) {
    this.tasks = [];
    this.currentId = currentId;
  }

  // ========================================
  // AGREGAR TAREA
  // ========================================
  addTask(
    name,
    description,
    fechaInicio,
    fechaFin,
    status,
    categoria = "Desarrollo",
  ) {
    this.currentId++;

    const newTask = {
      id: this.currentId,
      name: name,
      description: description,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      status: status,
      categoria: categoria,
    };

    this.tasks.push(newTask);
  }

  // ========================================
  // ELIMINAR TAREA
  // ========================================
  deleteTask(taskId) {
    const newTasks = [];

    for (let task of this.tasks) {
      if (task.id !== taskId) {
        newTasks.push(task);
      }
    }

    this.tasks = newTasks;
  }

  // ========================================
  // BUSCAR TAREA POR ID
  // ========================================
  getTaskById(taskId) {
    let foundTask;

    for (let task of this.tasks) {
      if (task.id === taskId) {
        foundTask = task;
      }
    }

    return foundTask;
  }

  // ========================================
  // GUARDAR EN LOCALSTORAGE
  // ========================================
  save() {
    const tasksJson = JSON.stringify(this.tasks);
    localStorage.setItem("tasks", tasksJson);

    const currentId = String(this.currentId);
    localStorage.setItem("currentId", currentId);
  }

  // ========================================
  // CARGAR DESDE LOCALSTORAGE
  // ========================================
  load() {
    const tasksJson = localStorage.getItem("tasks");

    if (tasksJson) {
      this.tasks = JSON.parse(tasksJson);
    }

    const currentId = localStorage.getItem("currentId");

    if (currentId) {
      this.currentId = Number(currentId);
    }
  }
}
