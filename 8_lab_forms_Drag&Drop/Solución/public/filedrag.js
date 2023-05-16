window.onload = init;

function output(msg) {
	var m = document.getElementById("messages"); 
	m.innerHTML = m.innerHTML + msg;
}

// file drag hover
function fileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}

// file selection
function fileSelectHandler(e) {
	// cancel event and hover styling
	fileDragHover(e);

	// fetch FileList object
	var files = e.target.files || e.dataTransfer.files;

	// process all File objects
	for (var i = 0, f; f = files[i]; i++) {
		parseFile(f);
	}

	// files can be added by drag&drop or clicking on form's button
	// if the later, append files to form files field 
	var formFiles = documento.getElementById("upload").fileselect;
	if (formFiles.files.length == 0){
		formFiles.files = files;
	}
}

// output file information
function parseFile(file) {
	output(
		"<p>Datos del fichero: <strong>" + file.name +
		"</strong> Tipo: <strong>" + file.type +
		"</strong> Tamaño: <strong>" + file.size +
		"</strong> bytes</p>"
	);
}
		
function enviar(){
	console.log("Enviado");
}

function comprobarCampos(){
	var nombre = document.getElementById("nombre").value; 
	var comprobarNombre = document.getElementById("comprobarnombre");
	var todoBien = true;
	if (nombre === ""){
		comprobarNombre.innerHTML = "El campo del Nombre es obligatorio";
		comprobarNombre.style.color = "#ed9a1b"
		console.log("El nombre esta vacio");
		todoBien = false;
	} else {
		comprobarNombre.innerHTML = "";
	}
	
	var telefono = document.getElementById("telefono").value;
	var comprobarTel = document.getElementById("comprobartel");

	var patronTel = /^\(?([0-9]{3})\)?[-]?([0-9]{3})[-]?([0-9]{3})$/;
	if( !telefono.match(patronTel)){
		comprobarTel.innerHTML = "El campo del telefono debe contener el patrón 123(-)456(-)789";
		comprobarTel.style.color = "#ed9a1b"
		console.log("El telefono está mal");
		todoBien = false;
	} else {
		comprobarTel.innerHTML = "";
	}
	
	var email = document.getElementById("email").value; 
	var comprobarEmail = document.getElementById("comprobaremail");
	var patronEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!email.match(patronEmail)){
		comprobarEmail.innerHTML = "El campo del email es incorrecto. Debe tener el siguiente formato: hola@gmail.com";
		comprobarEmail.style.color = "#ed9a1b"
		console.log("El email es incorrecto");
		todoBien = false;
	} else {
		comprobarEmail.innerHTML = "";
	}
	
	var libro = document.getElementById("books").value; 
	var comprobarLibro = document.getElementById("comprobarlibro"); 
	if (libro === ""){
		comprobarLibro.innerHTML = "- El campo del Libro es obligatorio";
		comprobarLibro.style.color = "#ed9a1b"
		console.log("No hay un libro elegido");
		todoBien = false;
	} else {
		comprobarLibro.innerHTML= "";
	}
	
	var cantidad = document.getElementById("cantidad").value; 
	var comprobarCantidad = document.getElementById("comprobarcantidad"); 
	if (cantidad<1 || cantidad>5){
		comprobarCantidad.innerHTML = "- La cantidad debe ser un número del 1 al 5";
		comprobarCantidad.style.color = "#ed9a1b"
		console.log("Cantidad no es un numero del 1 al 5");
		todoBien = false;
	} else {
		comprobarCantidad.innerHTML= "";
	}
	
	return todoBien;		
}
		
	
function enviarHandler(e) {
	// comprueba que los campos del formulario tienen valores correctos
	if (comprobarCampos()){
		enviar(); 
	}
}


function init() {
	var fileselect = document.getElementById("fileselect"); 
	var filedrag = document.getElementById("filedrag");
	var submitbutton = document.getElementById("enviar");
		
	submitbutton.addEventListener("click", enviarHandler, false);
	// file select
	fileselect.addEventListener("change", fileSelectHandler, false);
	// file drop
	filedrag.addEventListener("dragover", fileDragHover, false);
	filedrag.addEventListener("dragleave", fileDragHover, false);
	filedrag.addEventListener("drop", fileSelectHandler, false);
	filedrag.style.display = "block";
}
