function inicializarGestores()
{

	//[INI] - 1º Ejercicio
	var imagen = document.getElementById("imagen");
	var clicked = false;
	var imagenes = ["manzanas","fresas","limon","melon","sesamo","mandarinas"]
	imagen.onclick = function(){
		
		clicked = true;
	}
	var i = 0;
	function mostrarImagen() {
		
		if(!clicked){
			imagen.style.backgroundImage = "url('./images/"+imagenes[i]+".jpg')"
			i++;
			if(i>=imagenes.length){
				i=0;
			}
			console.log("Valor i :" + i); 
	   	}
	}
	
	var reloj = setInterval(mostrarImagen, 5000);
	//[FIN] - 1º Ejercicio


	//[INI] 2º Ejercicio

	document.addEventListener("keydown",(event) => { 

		const keyName = event.key;
		
	    if (keyName === "ArrowDown"
	    	|| keyName === "ArrowLeft"
	   		|| keyName === "ArrowRight"
	   		|| keyName === "ArrowUp"
	    	) {
	    		alert(`HAS PULSADO ${keyName}`);
	    		event.preventDefault();
	      		return;
	    }

  	},
  	false
	);

	/*document.addEventListener(
  	"keyup",
  	(event) => {
    	const keyName = event.key;

    	// As the user releases the Ctrl key, the key is no longer active,
    	// so event.ctrlKey is false.
    if (keyName === "Control") {
    	alert("Control key was released");
    }
  	},
  	false
);*/

//[FIN] 2º Ejercicio






	
	var usuario = document.getElementById("usuario");
	usuario.value = 'tu@email';

	usuario.onblur = function(){
		if (usuario.value == ''){
			usuario.value = "tu@email";
		}
	}

	usuario.onfocus = function(){
		if (usuario.value == 'tu@email'){
			usuario.value = '';
		}
	}

	var item = document.getElementById("combobox");
	item.addEventListener("change",gestorCombo);

	function gestorCombo(){
		console.log(item.value);
		console.log(item.options[item.selectedIndex].text);
		console.log(item.selectedIndex);
	} 

	var formulario = document.getElementById('formulario');
	formulario.onsubmit = function(){
		console.log("click en submit");
		return false;
	}

}

window.onload = inicializarGestores;
