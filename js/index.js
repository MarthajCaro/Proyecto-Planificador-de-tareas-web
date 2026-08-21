const taskManager = new TaskManager();

console.log(taskManager.tasks);

const btnFecha = document.getElementById("btnFecha");
const calendario = document.getElementById("calendario");
const hoy = new Date();

const fechaHoy =
  hoy.getFullYear() +
  "-" +
  String(hoy.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(hoy.getDate()).padStart(2, "0");

calendario.value = fechaHoy;
btnFecha.textContent = "📅 " + fechaHoy;

const error = document.getElementById("error");

const total = document.getElementById("total");
const proceso = document.getElementById("proceso");
const completadas = document.getElementById("completadas");

const form = document.getElementById("form");
const lista = document.getElementById("lista");

const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const estado = document.getElementById("estado").value;
  const fechaInicio = fechaInicioInput.value;
  const fechaFin = fechaFinInput.value;

  if (fechaFin < fechaInicio) {
    error.style.color = "#dc2626";
    error.textContent =
      "La fecha de finalización no puede ser anterior a la fecha de inicio.";
    console.error(
      "Error: la fecha de finalización es anterior a la fecha de inicio.",
    );
    return;
  }

  if (!titulo || !descripcion || !fechaInicio || !fechaFin) {
    error.style.color = "#dc2626";
    error.textContent = "Completa todos los campos";
    console.error("Error: hay campos obligatorios vacíos.");
    return;
  }

  if (titulo.length < 3) {
    error.style.color = "#d97706";
    error.textContent = "El título es muy corto";
    return;
  }

  error.style.color = "#16a34a";
  error.textContent = "Tarea agregada correctamente";

  const tarea = {
    titulo,
    descripcion,
    estado,
    fechaInicio,
    fechaFin,
  };
  tareas.push(tarea);
  localStorage.setItem("tareas", JSON.stringify(tareas));

  console.log("Tarea creada:", tarea);
  console.log("Lista de tareas:", tareas);

  render();
  form.reset();
});

function render() {
  lista.innerHTML = "";

  let enProceso = 0;
  let completadasCount = 0;

  tareas.forEach((t, i) => {
    if (t.estado === "En proceso") enProceso++;
    if (t.estado === "Completada") completadasCount++;

    let claseEstado = "";
    if (t.estado === "Pendiente") claseEstado = "pendiente";
    if (t.estado === "En proceso") claseEstado = "proceso";
    if (t.estado === "Completada") claseEstado = "completada";

    const estaCompletada = t.estado === "Completada";

    const div = document.createElement("div");
    div.className = `task-card ${estaCompletada ? "task-card-completada" : ""}`;

    div.innerHTML = `
    <div class="task-card-header">
        <h5 class="task-card-title">${t.titulo}</h5>
 
        <span class="estado ${claseEstado}">
            ${t.estado}
        </span>
    </div>
 
    <p class="task-card-desc">
        ${t.descripcion}
    </p>
 
    <div class="task-card-footer">
        <small class="task-card-fecha">
            📅 ${t.fechaInicio} → ${t.fechaFin}
        </small>
    </div>
 
    <div class="mt-2 d-flex gap-2">
        <button onclick="toggleCompletada(${i})" class="btn btn-sm ${estaCompletada ? "btn-completada" : "btn-marcar"}">
            ${estaCompletada ? "✅ Completada" : "⬜ Marcar completada"}
        </button>
 
        <button onclick="editar(${i})" class="btn btn-sm btn-warning">
            ✏️
        </button>
 
        <button onclick="eliminar(${i})" class="btn btn-sm btn-danger">
            🗑
        </button>
    </div>
`;

    lista.appendChild(div);
  });

  total.textContent = tareas.length;
  proceso.textContent = enProceso;
  completadas.textContent = completadasCount;
}

// Interruptor: cada clic alterna entre "Completada" y "Pendiente"
function toggleCompletada(i) {
  tareas[i].estado =
    tareas[i].estado === "Completada" ? "Pendiente" : "Completada";

  localStorage.setItem("tareas", JSON.stringify(tareas));

  render();
}

function eliminar(i) {
  tareas.splice(i, 1);

  localStorage.setItem("tareas", JSON.stringify(tareas));

  render();
}

btnFecha.addEventListener("click", () => {
  calendario.showPicker();
});

calendario.addEventListener("change", () => {
  const fecha = calendario.value;

  btnFecha.textContent = "📅 " + fecha;
});

// Hace que el calendario se abra al hacer clic

[fechaInicioInput, fechaFinInput].forEach((input) => {
  input.addEventListener("click", () => {
    if (input.showPicker) {
      input.showPicker();
    }
  });
});

function editar(i) {
  const tarea = tareas[i];

  document.getElementById("titulo").value = tarea.titulo;
  document.getElementById("descripcion").value = tarea.descripcion;
  document.getElementById("estado").value = tarea.estado;
  fechaInicioInput.value = tarea.fechaInicio;
  fechaFinInput.value = tarea.fechaFin;

  tareas.splice(i, 1);
  localStorage.setItem("tareas", JSON.stringify(tareas));

  render();
}

render();
