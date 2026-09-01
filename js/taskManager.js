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

  save() {
    localStorage.setItem("tareas", JSON.stringify(this.tasks));
    localStorage.setItem("currentId", this.currentId);
  }
}
