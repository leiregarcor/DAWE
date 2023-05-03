var y;

window.onload = init;

function init() {
	localStorageSpace()
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
	localStorageSpace();

}

function clearStickyNotes() {
	// Crear un nuevo botón en la ventana de postit notes que al pulsarlo,
	// elimine las notas de pantalla y de localStorage
	for (let i = 1; i <= y; i++) {
		localStorage.removeItem("postit_" + i);
		document.getElementById("stickies").removeChild(document.getElementById("stickies").childNodes[1]) 
	}
	localStorage.setItem("length", 0)
	y=0;
	document.getElementById("size").innerHTML= 'Espacio Utilizado: Empty (0 KB)'

	// obtener una referencia a la capa "stickies"
	// recorrer los hijos (childNodes) de esa referencia,
	// eliminándolos uno a uno (removeChild)
}

var localStorageSpace = function(){
        var allStrings = '';
        for(var key in window.localStorage){
            if(window.localStorage.hasOwnProperty(key)){
                allStrings += window.localStorage[key];
            }
        }
       
        var resp = allStrings ?  ((allStrings.length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)'
        document.getElementById("size").innerHTML= 'Espacio Utilizado: '  + resp 
        
 };

