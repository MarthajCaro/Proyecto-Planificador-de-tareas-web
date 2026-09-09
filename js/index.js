const taskManager = new TaskManager();
taskManager.load(); // Carga las tareas guardadas

const newTaskForm = document.getElementById("newTaskForm");
const lista = document.getElementById("lista");
const error = document.getElementById("error");
let editingId = null;
let filtroActual = "Todas";

const total = document.getElementById("total");
const proceso = document.getElementById("proceso");
const completadas = document.getElementById("completadas");

const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");

const btnFecha = document.getElementById("btnFecha");
const calendario = document.getElementById("calendario");

// ========================================
// CREAR O EDITAR TAREA
// ========================================
newTaskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("titulo").value.trim();
  const description = document.getElementById("descripcion").value.trim();
  const fechaInicio = fechaInicioInput.value;
  const dueDate = fechaFinInput.value;
  const status = document.getElementById("estado").value;

  const categoriaElement = document.getElementById("categoria");
  const categoria = categoriaElement ? categoriaElement.value : "Desarrollo";

  error.className = "text-danger mt-2";
  error.textContent = "";

  if (!name || !description || !fechaInicio || !dueDate) {
    error.textContent = "Completa todos los campos";
    return;
  }

  if (name.length < 3) {
    error.textContent = "El título es muy corto";
    return;
  }

  if (dueDate < fechaInicio) {
    error.textContent =
      "La fecha de finalización no puede ser anterior a la fecha de inicio.";
    return;
  }

  if (editingId === null) {
    taskManager.addTask(
      name,
      description,
      fechaInicio,
      dueDate,
      status,
      categoria,
    );
    error.textContent = "Tarea agregada correctamente";
  } else {
    const taskToUpdate = taskManager.getTaskById(editingId);
    if (taskToUpdate) {
      taskToUpdate.name = name;
      taskToUpdate.description = description;
      taskToUpdate.fechaInicio = fechaInicio;
      taskToUpdate.fechaFin = dueDate;
      taskToUpdate.status = status;
      taskToUpdate.categoria = categoria;
    }
    error.textContent = "Tarea agragada correctamente";

    editingId = null;
    const btnSubmit = newTaskForm.querySelector("button");
    btnSubmit.textContent = "+ AGREGAR TAREA";
    btnSubmit.className = "btn btn-outline w-100";
  }

  taskManager.save();
  error.className = "text-success mt-2";
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

  // Contar estadísticas siempre usando TODAS las tareas
  taskManager.tasks.forEach((tarea) => {
    if (tarea.status === "En proceso") {
      enProceso++;
    }
    if (tarea.status === "DONE" || tarea.status === "Completada") {
      completadasCount++;
    }
  });

  //  Filtrar el arreglo según el botón seleccionado
  const tareasFiltradas = taskManager.tasks.filter((tarea) => {
    const estaCompletada =
      tarea.status === "DONE" || tarea.status === "Completada";
    if (filtroActual === "Pendientes") return !estaCompletada;
    if (filtroActual === "Completadas") return estaCompletada;
    return true; // Para "Todas"
  });

  // Dibujar SOLAMENTE las tareas que pasaron el filtro
  tareasFiltradas.forEach((tarea) => {
    let claseEstado = "";

    if (tarea.status === "Pendiente") {
      claseEstado = "pendiente";
    } else if (tarea.status === "En proceso") {
      claseEstado = "proceso";
    } else if (tarea.status === "DONE" || tarea.status === "Completada") {
      claseEstado = "completada";
    }

    const estaCompletada =
      tarea.status === "DONE" || tarea.status === "Completada";

    // Validar si la tarea está vencida
    const hoyStr = new Date().toISOString().split("T")[0];
    const estaVencida = !estaCompletada && tarea.fechaFin < hoyStr;

    // Definir clases dinámicas para la tarjeta
    let clasesTarjeta = "task-card ";
    if (estaCompletada) clasesTarjeta += "task-card-completada ";
    if (estaVencida) clasesTarjeta += "task-card-vencida ";

    const div = document.createElement("div");
    div.className = clasesTarjeta;
    div.dataset.taskId = tarea.id;

    div.innerHTML = `
      <div class="task-card-header">
        <h5 class="task-card-title">
          <span class="categoria-badge">${tarea.categoria || "Desarrollo"}</span>
          ${tarea.name} ${estaVencida ? "⚠️" : ""}
        </h5>
        <span class="estado ${claseEstado}">${tarea.status}</span>
      </div>

      <p class="task-card-desc">${tarea.description}</p>

      <div class="task-card-footer mb-2">
        <!-- Si está vencida, la fecha se pone en rojo y negrita -->
        <small class="task-card-fecha ${estaVencida ? "text-danger fw-bold" : ""}">
          📅 ${tarea.fechaInicio} → ${tarea.fechaFin} ${estaVencida ? "(Vencida)" : ""}
        </small>
      </div>

      <div class="d-flex gap-2">
        <button class="done-button btn btn-sm ${estaCompletada ? "btn-completada" : "btn-success"}">
          ${estaCompletada ? "✅ Completada" : "⬜ Marcar completada"}
        </button>
        <button class="edit-button btn btn-warning btn-sm text-white">Editar</button>
        <button class="delete-button btn btn-danger btn-sm">Eliminar</button>
      </div>
    `;

    lista.appendChild(div);
  });

  // Actualizar las estadísticas en pantalla
  total.textContent = taskManager.tasks.length;
  proceso.textContent = enProceso;
  completadas.textContent = completadasCount;

  // Actualizar barra de progreso dinámica
  const barraProgreso = document.getElementById("barraProgreso");
  if (barraProgreso) {
    const totalTareas = taskManager.tasks.length;
    const porcentaje =
      totalTareas === 0
        ? 0
        : Math.round((completadasCount / totalTareas) * 100);

    barraProgreso.style.width = `${porcentaje}%`;

    if (porcentaje === 100) {
      barraProgreso.classList.remove("bg-success");
      barraProgreso.style.backgroundColor = "#a855f7";
    } else {
      barraProgreso.classList.add("bg-success");
      barraProgreso.style.backgroundColor = "";
    }
  }
}

// ========================================
// FILTROS DE VISUALIZACIÓN
// ========================================
document.getElementById("filtros").addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    // Quitar la clase "active" de todos los botones
    document
      .querySelectorAll("#filtros button")
      .forEach((btn) => btn.classList.remove("active"));

    // Poner la clase "active" al botón clickeado
    event.target.classList.add("active");

    // Actualizar la variable global y volver a dibujar
    filtroActual = event.target.dataset.filtro;
    render();
  }
});

lista.addEventListener("click", (event) => {
  // Manejar el clic en "Mark As Done"
  if (event.target.classList.contains("done-button")) {
    const parentTask = event.target.closest(".task-card");
    const taskId = Number(parentTask.dataset.taskId);
    const task = taskManager.getTaskById(taskId);

    if (task) {
      task.status = "DONE";
      taskManager.save();
      render();
    }
  }

  // Manejar el clic en "Editar"
  if (event.target.classList.contains("edit-button")) {
    const parentTask = event.target.closest(".task-card");
    const taskId = Number(parentTask.dataset.taskId);
    const task = taskManager.getTaskById(taskId);

    if (task) {
      document.getElementById("titulo").value = task.name;
      document.getElementById("descripcion").value = task.description;
      fechaInicioInput.value = task.fechaInicio;
      fechaFinInput.value = task.fechaFin;
      document.getElementById("estado").value =
        task.status === "DONE" ? "Completada" : task.status;

      const categoriaSelect = document.getElementById("categoria");
      if (categoriaSelect) {
        categoriaSelect.value = task.categoria || "Desarrollo";
      }

      editingId = taskId;
      const btnSubmit = newTaskForm.querySelector("button");
      btnSubmit.textContent = "💾 GUARDAR CAMBIOS";
      btnSubmit.className = "btn btn-warning w-100 text-white font-weight-bold";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Manejar el clic en "Eliminar"
  if (event.target.classList.contains("delete-button")) {
    const parentTask = event.target.closest(".task-card");
    const taskId = Number(parentTask.dataset.taskId);

    taskManager.deleteTask(taskId);
    taskManager.save();
    render();
  }
});

// ========================================
// BOTÓN HOY Y FECHAS
// ========================================
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
  if (calendario.showPicker) calendario.showPicker();
});

calendario.addEventListener("change", () => {
  btnFecha.textContent = "📅 " + calendario.value;
});

[fechaInicioInput, fechaFinInput].forEach((input) => {
  input.addEventListener("click", () => {
    if (input.showPicker) input.showPicker();
  });
});

// ========================================
// CARGAR TAREAS AL ABRIR LA PÁGINA
// ========================================
render();
