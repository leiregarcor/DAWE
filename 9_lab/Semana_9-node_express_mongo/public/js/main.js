// getElementByClassName
function $class(clase) {
	return document.getElementsByClassName(clase);
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
	console.log('editar')	;
	var url = '/users/edit/' + event.target.getAttribute('data-id');
	//console.log(url)	;

}