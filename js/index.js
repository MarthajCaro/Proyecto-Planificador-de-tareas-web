const currentId = Number(localStorage.getItem("currentId")) || 0;

const taskManager = new TaskManager(currentId);

taskManager.tasks = JSON.parse(localStorage.getItem("tareas")) || [];

const newTaskForm = document.getElementById("newTaskForm");
const lista = document.getElementById("lista");
const error = document.getElementById("error");

const total = document.getElementById("total");
const proceso = document.getElementById("proceso");
const completadas = document.getElementById("completadas");

const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");

const btnFecha = document.getElementById("btnFecha");
const calendario = document.getElementById("calendario");

// ========================================
// CREAR TAREA
// ========================================

newTaskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("titulo").value.trim();
  const description = document.getElementById("descripcion").value.trim();
  const fechaInicio = fechaInicioInput.value;
  const dueDate = fechaFinInput.value;
  const status = document.getElementById("estado").value;

  error.className = "text-danger mt-2";
  error.textContent = "";

  // Validar campos
  if (!name || !description || !fechaInicio || !dueDate) {
    error.textContent = "Completa todos los campos";
    return;
  }

  // Validar título
  if (name.length < 3) {
    error.textContent = "El título es muy corto";
    return;
  }

  // Validar fechas
  if (dueDate < fechaInicio) {
    error.textContent =
      "La fecha de finalización no puede ser anterior a la fecha de inicio.";
    return;
  }

  // Crear tarea
  taskManager.addTask(name, description, fechaInicio, dueDate, status);

  console.log("Tarea creada:", taskManager.tasks);

  error.className = "text-success mt-2";
  error.textContent = "Tarea agregada correctamente";

  newTaskForm.reset();

  render();
});

// ========================================
// MOSTRAR TAREAS
// ========================================

function render() {
  lista.innerHTML = "";

  let enProceso = 0;
  let completadasCount = 0;

  taskManager.tasks.forEach((tarea, i) => {
    if (tarea.status === "En proceso") {
      enProceso++;
    }

    if (tarea.status === "Completada") {
      completadasCount++;
    }

    let claseEstado = "";

    if (tarea.status === "Pendiente") {
      claseEstado = "pendiente";
    }

    if (tarea.status === "En proceso") {
      claseEstado = "proceso";
    }

    if (tarea.status === "Completada") {
      claseEstado = "completada";
    }

    const estaCompletada = tarea.status === "Completada";

    const div = document.createElement("div");
    div.className = `task-card ${estaCompletada ? "task-card-completada" : ""}`;

    div.dataset.taskId = tarea.id;

    div.innerHTML = `
      <div class="task-card-header">
        
        <h5 class="task-card-title">
          ${tarea.name}
        </h5>

        <span class="estado ${claseEstado}">
          ${tarea.status}
        </span>

      </div>

      <p class="task-card-desc">
        ${tarea.description}
      </p>

      <div class="task-card-footer">

        <small class="task-card-fecha">

        📅 ${tarea.fechaInicio} → ${tarea.fechaFin}

        </small>

      </div>

      
        <button
          onclick="toggleCompletada(${i})"
          class="btn btn-sm ${estaCompletada ? "btn-completada" : "btn-marcar"}"
        >
          ${estaCompletada ? "✅ Completada" : "⬜ Marcar completada"}
        </button>

        <button
          class="delete-button btn btn-danger btn-sm"
        >
          Eliminar
        </button>

        </div>
    `;

    lista.appendChild(div);
  });

  // Actualizar estadísticas
  total.textContent = taskManager.tasks.length;
  proceso.textContent = enProceso;
  completadas.textContent = completadasCount;
}

// ========================================
// MARCAR / DESMARCAR COMPLETADA
// ========================================

function toggleCompletada(i) {
  if (taskManager.tasks[i].status === "Completada") {
    taskManager.tasks[i].status = "Pendiente";
  } else {
    taskManager.tasks[i].status = "Completada";
  }

  // Guardar cambio
  taskManager.saveTasks();

  render();
}

// ========================================
// ELIMINAR
// ========================================

lista.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    const parentTask = event.target.parentElement;

    const taskId = Number(parentTask.dataset.taskId);

    taskManager.deleteTask(taskId);

    taskManager.save();

    render();
  }
});

// ========================================
// BOTÓN HOY
// ========================================```javascript
function eliminar(taskId) {
  taskManager.deleteTask(taskId);

  console.log("Tarea eliminada:", taskId);
  console.log("Tareas actuales:", taskManager.tasks);

  render();
}

const hoy = new Date();

const fechaHoy =
  hoy.getFullYear() +
  "-" +
  String(hoy.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(hoy.getDate()).padStart(2, "0");

calendario.value = fechaHoy;

btnFecha.textContent = "📅 " + fechaHoy;

btnFecha.addEventListener("click", () => {
  calendario.showPicker();
});

calendario.addEventListener("change", () => {
  btnFecha.textContent = "📅 " + calendario.value;
});

// ========================================
// ABRIR CALENDARIOS
// ========================================

[fechaInicioInput, fechaFinInput].forEach((input) => {
  input.addEventListener("click", () => {
    if (input.showPicker) {
      input.showPicker();
    }
  });
});

// ========================================
// CARGAR TAREAS AL ABRIR LA PÁGINA
// ========================================

render();
