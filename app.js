const btnFecha = document.getElementById("btnFecha");
const calendario = document.getElementById("calendario");
const error = document.getElementById("error");

const total = document.getElementById("total");
const proceso = document.getElementById("proceso");
const completadas = document.getElementById("completadas");

let tareas = [];
let tareaEditando = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const estado = document.getElementById("estado").value;
  const prioridad = document.getElementById("prioridad").value;
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;

  //  error
  if (!titulo || !descripcion || !fechaInicio || !fechaFin) {
    error.style.color = "red";
    error.textContent = "Completa todos los campos";
    return;
  }

  // advertencia
  if (titulo.length < 3) {
    error.style.color = "orange";
    error.textContent = "El título es muy corto";
    return;
  }

  // tarea guardada
  error.style.color = "green";
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
  <div>
    <strong>${t.titulo}</strong><br>

    <small>${t.descripcion}</small><br>

    <small>
      📅 Inicio: ${t.fechaInicio}<br>
      🏁 Fin: ${t.fechaFin}<br>
      ⭐ Prioridad: ${t.prioridad}
    </small>

  </div>

  <div>
    <span class="estado ${claseEstado}">
      ${t.estado}
    </span>
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
