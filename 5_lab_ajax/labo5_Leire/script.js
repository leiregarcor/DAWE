function ISBN_handler(){
	var item = document.getElementById("combobox");
		
	fetch("https://openlibrary.org/api/books?bibkeys=ISBN:"+ item.value + "&jscmd=details&format=json")
	.then((response) => response.json())
	.then((data) => rellenarDatos(data));


}
function rellenarDatos(datosjson) {
	var item = document.getElementById("datos");
	item.innerHTML=datosjson;

	
}

function InicializadorDeGestores() {
	var formulario = document.getElementById('formulario');
	formulario.onsubmit = ISBN_handler;
	console.log(formulario);	
}
window.onload = InicializadorDeGestores;