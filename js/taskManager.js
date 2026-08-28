class TaskManager {
  constructor(currentId = 0) {
    this.tasks = [];
    this.currentId = currentId; //Guarda ese contador dentro del objeto
  }

  addTask(name, description, dueDate, status) {
    this.currentId++;

    this.tasks.push({
      id: this.currentId,
      name: name,
      description: description,
      dueDate: dueDate,
      status: "PORHACER",
    });
  }
}
