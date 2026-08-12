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

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let tareaEditando = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const estado = document.getElementById("estado").value;
  const prioridad = document.getElementById("prioridad").value;
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  if (fechaFin < fechaInicio) {
    error.style.color = "red";
    error.textContent = "La fecha de finalización no puede ser anterior a la fecha de inicio.";
    console.error("Error: la fecha de finalización es anterior a la fecha de inicio.");
    return;
}

  //  error
  if (!titulo || !descripcion || !fechaInicio || !fechaFin) {
    error.style.color = "red";
    error.textContent = "Completa todos los campos";
    console.error("Error: hay campos obligatorios vacíos.");
    return;
  }

  // advertencia
  if (titulo.length < 3) {
    error.style.color = "orange";
    error.textContent = "El título es muy corto";
    return;
  }

  // tarea guardada
  error.style.color = "#4ade80";
  error.textContent = "Tarea agregada correctamente";

  const tarea = {
    titulo,
    descripcion,
    estado,
    prioridad,
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
    // contador
    if (t.estado === "En proceso") enProceso++;
    if (t.estado === "Completada") completadasCount++;

    // clase dinámica
    let claseEstado = "";
    if (t.estado === "Pendiente") claseEstado = "pendiente";
    if (t.estado === "En proceso") claseEstado = "proceso";
    if (t.estado === "Completada") claseEstado = "completada";

    const div = document.createElement("div");
    div.className = "task-card";

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

        <span class="prioridad ${t.prioridad.toLowerCase()}">
            ${t.prioridad}
        </span>
    </div>

    <div class="mt-2">
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

function editar(i) {
  const tarea = tareas[i];

  document.getElementById("titulo").value = tarea.titulo;
  document.getElementById("descripcion").value = tarea.descripcion;
  document.getElementById("estado").value = tarea.estado;
  document.getElementById("prioridad").value = tarea.prioridad;
  document.getElementById("fechaInicio").value = tarea.fechaInicio;
  document.getElementById("fechaFin").value = tarea.fechaFin;

  tareas.splice(i, 1);

  render();
}

render();