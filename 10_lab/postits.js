var y;

window.onload = init;

function init() {
	var button = document.getElementById("add_button");
	button.onclick = createSticky;
	var clear = document.getElementById("clear_button");
	clear.onclick = clearStickyNotes;
	y = localStorage.getItem("length");
	if (y == null){
		y = 0;
	}
	cargarStickys();
}
function cargarStickys() {
	for (let i = 1; i <= y; i++) {
		var sticky = localStorage.getItem("postit_" + i);
		addStickyToDOM(sticky);
	}
}

function createSticky() {
	var value = document.getElementById("note_text").value;
	y++;
	localStorage.setItem("postit_" + y, value);
	localStorage.setItem("length", y)
        // crear la nota con nombre postit_X, donde X es un número entero
	// (postit_1, postit_2, ...)  y guardarla en el localStorage
	
	addStickyToDOM(value);
}


function addStickyToDOM(value) {
	var stickies = document.getElementById("stickies");
	var postit = document.createElement("li");
	var span = document.createElement("span");
	span.setAttribute("class", "postit");
	span.innerHTML = value;
	postit.appendChild(span);
	stickies.appendChild(postit);
}

function clearStickyNotes() {
	// Crear un nuevo botón en la ventana de postit notes que al pulsarlo,
	// elimine las notas de pantalla y de localStorage
	// Algoritmo:	
	// obtener una referencia a la capa "stickies"
	// recorrer los hijos (childNodes) de esa referencia,
	// eliminándolos uno a uno (removeChild)
}
