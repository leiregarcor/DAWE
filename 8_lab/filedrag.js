// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function output(msg) {
		var m = $id("messages");
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
		//console.log(files.length);
        //if ( e.constructor.name !=  "DragEvent"){
            // process all File objects
            for (var i = 0, f; f = files[i]; i++) {
				//console.log(f.name);
                parseFile(f);
            }
        //}

        // files can be added by drag&drop or clicking on form's button
        // if the later, append files to form files field 
        var formFiles = $id("upload").fileselect;
        if (formFiles.files.length == 0){
            formFiles.files = files;
        }



	}


	// output file information
	function parseFile(file) {
		//console.log(file.name);
		output(
			"<p>Datos del fichero: <strong>" + file.name +
			"</strong> Tipo: <strong>" + file.type +
			"</strong> Tamaño: <strong>" + file.size +
			"</strong> bytes</p>"
		);

	}

	function validar(){
		var validado = true;
		var nombre = document.getElementById("nombre").value;
		if(nombre==""){
			document.getElementById("errorNombre").innerHTML = "El campo del Nombre es obligatorio";
			document.getElementById("errorNombre").style.color = "red";
			console.log("El campo del Nombre es obligatorio");
			validado=false;
		}else{
			document.getElementById("errorNombre").innerHTML = "";
		}

		var tel = document.getElementById("numero").value;
		//console.log(tel);
		var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{3})$/;
 
		if (!tel.match(re)) {
			document.getElementById("errorTel").innerHTML = "El campo del telefono debe contener el patrón 123(-)456(-)789";
			document.getElementById("errorTel").style.color = "red";
			console.log("El campo del telefono debe contener el patrón 123(-)456(-)789");
			validado=false;
		}else{
			document.getElementById("errorTel").innerHTML = "";
		}
		var mail = document.getElementById("mail").value;
		var re2 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (!mail.match(re2)) {
			document.getElementById("errorMail").innerHTML = "El campo del email es incorrecto. Debe tener el siguiente formato: hola@gmail.com";
			document.getElementById("errorMail").style.color = "red";
			console.log("El campo del email es incorrecto. Debe tener el siguiente formato: hola@gmail.com");
			validado=false;
		}else{
			document.getElementById("errorMail").innerHTML = "";
		}
		
		var libro = document.getElementById("libros").value;
		//console.log(libro)
		if(libro==""){
			document.getElementById("errorLibro").innerHTML = "- El campo del Libro es obligatorio";
			document.getElementById("errorLibro").style.color = "red";
			console.log("El campo del Libro es obligatorio");
			validado=false;
		}else{
			document.getElementById("errorLibro").innerHTML = "";
		}
		var cant = document.getElementById("cant").value;
		//console.log(cant)
		if(cant =="" || cant>5 || cant < 1){
			document.getElementById("errorCant").innerHTML = "- La cantidad debe ser un número del 1 al 5";
			document.getElementById("errorCant").style.color = "red";
			console.log("La cantidad debe ser un número del 1 al 5");
			validado=false;
		}else{
			document.getElementById("errorCant").innerHTML = "";
		}

		if (validado) {
			enviar();
		}
		
	}

	function enviar(){
		console.log("Formulario enviado correctamente :)");
	}

	// initialize
	function init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("enviar");


        //submitbutton.onclick = validar();
        submitbutton.addEventListener("click", validar, false);



		// file select
		fileselect.addEventListener("change", fileSelectHandler, false);


			// file drop
			filedrag.addEventListener("dragover", fileDragHover, false);
			filedrag.addEventListener("dragleave", fileDragHover, false);
			filedrag.addEventListener("drop", fileSelectHandler, false);
			filedrag.style.display = "block";

	}

	// call initialization file
	if (window.File && window.FileList) {
		init();
	}

