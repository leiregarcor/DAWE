// getElementByClassName
function $class(clase) {
	return document.getElementsByClassName(clase);
}
// getElementById
function $id(id) {
	return document.getElementById(id);
}

window.onload = function() {
	//obtenemos los links de delete de la lista de usuarios
	let links = document.getElementsByClassName("deleteUser");
	//por cada link añadimos un eventlistener:
	for (let item of links) {
		//si se hace click llama a la función deleteUser
	    item.addEventListener("click", deleteUser); 
	}

	//obtenemos los links de edit de la lista de usuarios
	let editLinks = $class("editUser");
	//por cada link añadimos un eventlistener:
	for (let item of editLinks) {
		//si se hace click llama a la función editUser
	    item.addEventListener("click", editUser);
	}

}



function deleteUser(event){
    var confirmation = confirm('Are You Sure?');
	if(confirmation){
		var url = '/users/delete/' + event.target.getAttribute('data-id');
		var consulta = new XMLHttpRequest();
		consulta.open("DELETE", url);
		consulta.onload = function() {
			if (consulta.status == 200) {
				window.location.replace('/')
			}
		};
		consulta.send();
	} else {
		return false;
	}

}

function editUser(event) {
	//document.getElementById("editar").style.display = "none";
	//boton enviar no visible
	let botonEnviar = $id("submit");
	botonEnviar.value = "Edit";

	// campos del formulario
	var usuario = $id("first_name");
	var apellido = $id("last_name");
	var email = $id("email");

	//console.log('editar')	;
	var url = '/users/getUser/' + event.target.getAttribute('data-id');
	fetch(url)
		.then((response)=> response.json())
		.then((data)=> {
			
			usuario.value = data.first_name;
			apellido.value = data.last_name;
			email.value = data.email;
		});
			

}