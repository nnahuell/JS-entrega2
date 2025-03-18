// Recuperamos los libros guardados en localStorage o inicializamos con un array vacío
let libros = JSON.parse(localStorage.getItem("libros")) || [];

// Mostrar libros
function mostrarLibros() {
    const listaLibros = document.getElementById("listaLibros");
    listaLibros.innerHTML = "";

    libros.forEach((libro, index) => {
        const div = document.createElement("div");
        div.className = `libro ${libro.leido ? "leido" : ""}`;
        div.innerHTML = `
            <span><strong>${libro.titulo}</strong> - ${libro.autor}</span>
            <button onclick="marcarLeido(${index})">${libro.leido ? "✔ Leído" : "📖 Marcar como leído"}</button>
            <button onclick="editarLibro(${index})">✏️ Editar</button>
            <button onclick="eliminarLibro(${index})">❌ Eliminar</button>
        `;
        listaLibros.appendChild(div);
    });

    actualizarContador();
    localStorage.setItem("libros", JSON.stringify(libros));
}

// Agregar libro
function agregarLibro() {
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();

    if (!titulo || !autor) {
        alert("Por favor, ingresa un título y un autor válidos.");
        return;
    }

    if (libros.some(libro => libro.titulo.toLowerCase() === titulo.toLowerCase())) {
        alert("Este libro ya está en la lista.");
        return;
    }

    libros.push({ titulo, autor, leido: false });
    mostrarLibros();
    document.getElementById("titulo").value = "";
    document.getElementById("autor").value = "";
}

// Editar un libro
function editarLibro(index) {
    let nuevoTitulo = prompt("Editar título:", libros[index].titulo);
    let nuevoAutor = prompt("Editar autor:", libros[index].autor);

    if (nuevoTitulo && nuevoAutor) {
        libros[index].titulo = nuevoTitulo.trim();
        libros[index].autor = nuevoAutor.trim();
        mostrarLibros();
    } else {
        alert("Los campos no pueden estar vacíos.");
    }
}

// Marcar como leído
function marcarLeido(index) {
    libros[index].leido = !libros[index].leido;
    mostrarLibros();
}

// Eliminar un libro con confirmación
function eliminarLibro(index) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${libros[index].titulo}"?`)) {
        libros.splice(index, 1);
        mostrarLibros();
    }
}

// Eliminar todos los libros con confirmación
function limpiarLista() {
    if (libros.length === 0) {
        alert("No hay libros para eliminar.");
        return;
    }

    if (confirm("¿Estás seguro de que quieres eliminar todos los libros?")) {
        libros = [];
        localStorage.removeItem("libros");
        mostrarLibros();
    }
}

// Contador de libros y porcentaje de leídos
function actualizarContador() {
    const total = libros.length;
    const leidos = libros.filter(libro => libro.leido).length;
    document.getElementById("contador").innerText = `(${leidos} de ${total} leídos)`;
}

// Filtrar libros
function filtrarLibros() {
    const busqueda = document.getElementById("buscar").value.toLowerCase();
    document.querySelectorAll(".libro").forEach(libro => {
        libro.style.display = libro.innerText.toLowerCase().includes(busqueda) ? "flex" : "none";
    });
}

// Exportar libros a JSON
function exportarLibros() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(libros));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "libros.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Importar libros desde JSON
function importarLibros() {
    const archivo = document.getElementById("importarArchivo").files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function (evento) {
        try {
            const datos = JSON.parse(evento.target.result);
            if (Array.isArray(datos)) {
                libros = datos;
                mostrarLibros();
            } else {
                alert("El archivo no es válido.");
            }
        } catch (e) {
            alert("Error al importar libros.");
        }
    };
    lector.readAsText(archivo);
}

// Mostrar libros al cargar la página
mostrarLibros();
