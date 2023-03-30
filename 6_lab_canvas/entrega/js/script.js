
function inicializarGestores(){
	var canvas = document.getElementById("lienzo");
	var context = canvas.getContext("2d");
	var logo = new Image();
	var esq1= [0,0]; //arriba izquierda
	var esq2= [0,40]; //abajo izquierda
	var esq3= [25,40]; //abajo derecha
	var esq4= [25,0]; //arriba derecha
	var z = 2; //TODO PONER A 1
	logo.onload = function pintar() {
		context.drawImage(logo, 0, 0); // imagen y coordenadas de posicion
		pintarCuadrado(context);
		context.drawImage(logo, esq1[0], esq1[1], 25, 40, 500, 0, 50, 80);
		context.fillText(`(${esq1[0]},${esq1[1]})`, 440, 20);
	};
	logo.src = "images/spritesheet.png";		
	
	function pintarCuadrado(context){
		context.beginPath(); // imaginemos que colocamos un lapiz invisible sobre lienzo
		context.moveTo(esq1[0],esq1[1]); // lo movemos a la posicion (100, 150)
		context.lineTo(esq2[0],esq2[1]); // dibujamos una linea invisible desde la anterior posicion a la (250,75)
		context.lineTo(esq3[0],esq3[1]); // desde la anterior posicion, otra linea a (125, 30)
		context.lineTo(esq4[0],esq4[1]); // desde la anterior posicion, otra linea a (125, 30)
		context.closePath(); /* genera una linea recta desde nuestra ultima posicion a la primera posicion (cierra el triangulo) */
		// ahora queremos dibujar esas lineas invisibles para que se vean
		context.lineWidth = 2; // especificamos el ancho de las lineas
		context.strokeStyle = "red";
		context.stroke(); // con esto las hacemos aparecer (por defecto, en negro)
	}

	document.addEventListener("keydown",(event) => { 

		const keyName = event.key;
		
	    if (keyName === "ArrowDown") {
	    	if(esq2[1]< 480){
				context.clearRect(0, 0, canvas.width, canvas.height);
				esq1[1] = esq1[1]+z;
				esq2[1] = esq2[1]+z;
				esq3[1] = esq3[1]+z;
				esq4[1] = esq4[1]+z;
				context.drawImage(logo, 0, 0);
				pintarCuadrado(context);
				context.drawImage(logo, esq1[0], esq1[1], 25, 40, 500, 0, 50, 80);	
				context.fillText(`(${esq1[0]},${esq1[1]})`, 440, 20);
			}
	    }
		if (keyName === "ArrowLeft") {
	    	if(esq1[0]>0){
				context.clearRect(0, 0, canvas.width, canvas.height);
				esq1[0] = esq1[0]-z;
				esq2[0] = esq2[0]-z;
				esq3[0] = esq3[0]-z;
				esq4[0] = esq4[0]-z;
				context.drawImage(logo, 0, 0);
				pintarCuadrado(context);
				context.drawImage(logo, esq1[0], esq1[1], 25, 40, 500, 0, 50, 80);
				context.fillText(`(${esq1[0]},${esq1[1]})`, 440, 20);
			}
			
	    }
		if (keyName === "ArrowRight") {
	    	if(esq3[0]<476){
				context.clearRect(0, 0, canvas.width, canvas.height);
				esq1[0] = esq1[0]+z;
				esq2[0] = esq2[0]+z;
				esq3[0] = esq3[0]+z;
				esq4[0] = esq4[0]+z;
				context.drawImage(logo, 0, 0);
				pintarCuadrado(context);
				context.drawImage(logo, esq1[0], esq1[1], 25, 40, 500, 0, 50, 80);
				context.fillText(`(${esq1[0]},${esq1[1]})`, 440, 20);
			}
			
	    }
		if (keyName === "ArrowUp") {
			if(esq1[1]>0){
				context.clearRect(0, 0, canvas.width, canvas.height);
				esq1[1] = esq1[1]-z;
				esq2[1] = esq2[1]-z;
				esq3[1] = esq3[1]-z;
				esq4[1] = esq4[1]-z;
				context.drawImage(logo, 0, 0);
				pintarCuadrado(context);
				context.drawImage(logo, esq1[0], esq1[1], 25, 40, 500, 0, 50, 80);
				context.fillText(`(${esq1[0]},${esq1[1]})`, 440, 20);
			}
	    }
  	},
  	false
	);
}

window.onload = inicializarGestores;