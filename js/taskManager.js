class TaskManager {
  constructor(currentId = 0) {
    this.tasks = [];
    this.currentId = currentId;
  }

  addTask(name, description, fechaInicio, fechaFin, status) {
    this.currentId++;

    const newTask = {
      id: this.currentId,
      name: name,
      description: description,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      status: status,
    };

    this.tasks.push(newTask);
  }

  deleteTask(taskId) {
    const newTasks = [];
    for (let task of this.tasks) {
      if (task.id !== taskId) {
        newTasks.push(task);
      }
    }
    this.tasks = newTasks;
  }

  getTaskById(taskId) {
    let foundTask;
    for (let task of this.tasks) {
      if (task.id === taskId) {
        foundTask = task;
      }
    }
    return foundTask;
  }

  // GUARDA LAS TAREAS EN LOCALSTORAGE
  save() {
    localStorage.setItem("tareas", JSON.stringify(this.tasks));
    localStorage.setItem("currentId", String(this.currentId));
  }

  // CARGA LAS TAREAS DE LOCALSTORAGE AL INICIAR
  load() {
    if (localStorage.getItem("tareas")) {
      const tareasGuardadas = localStorage.getItem("tareas");
      this.tasks = JSON.parse(tareasGuardadas);
    }

    if (localStorage.getItem("currentId")) {
      const idGuardado = localStorage.getItem("currentId");
      this.currentId = Number(idGuardado);
    }
  }
}
