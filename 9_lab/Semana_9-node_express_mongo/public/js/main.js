// getElementByClassName
function $class(clase) {
	return document.getElementsByClassName(clase);
}

window.onload = function() {
	let links = document.getElementsByClassName("deleteUser");
	for (let item of links) {
	    item.addEventListener("click", deleteUser);
	}

	//obtenemos los links de la lista de usuarios
	let editLinks = $class("editUser");
	//por cada link añadimos un eventlistener:
	for (let item of editLinks) {
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
}