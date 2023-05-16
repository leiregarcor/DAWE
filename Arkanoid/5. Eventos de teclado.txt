// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;


var x = 130,
  y = 135;

// Inits
window.onload = function init() {
  var game = new GF();
  game.start();
};


// GAME FRAMEWORK STARTS HERE
var GF = function() {

  // vars for counting frames/s, used by the measureFPS function
  var frameCount = 0;
  var lastTime;
  var fpsContainer;
  var fps, delta, oldTime = 0;

  var direction = -1; // inicialmente movimiento a la izquierda
  var speed = 300; // px/s 
  var vausWidth = 30, vausHeight = 10;

    // vars for handling inputs
    var inputStates = {};


  var measureFPS = function(newTime) {

    // test for the very first invocation
    if (lastTime === undefined) {
      lastTime = newTime;
      return;
    }

    //calculate the difference between last & current frame
    var diffTime = newTime - lastTime;

    if (diffTime >= 1000) {

      fps = frameCount;
      frameCount = 0;
      lastTime = newTime;
    }

    //and display it in an element we appended to the 
    // document in the start() function
    fpsContainer.innerHTML = 'FPS: ' + fps;
    frameCount++;
  };

  // clears the canvas content
  function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
    // ctx.fillStyle = 'green';
    // ctx.fillRect(15,15,4,4);    
  }

  // Función para pintar la raqueta Vaus
  function drawVaus(x, y) {
// TU CÓDIGO AQUÍ
  //clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.fillStyle = '#000';
    // Dibujar el rectángulo
    ctx.fillRect(x,y, 30, 10); // Posición (x, y) y tamaño (ancho, alto) del rectángulo
}

  
  var calcDistanceToMove = function(delta, speed) {
// TU CÓDIGO AQUÍ
   return ((speed * delta) / 1000)
};

  var updatePaddlePosition = function() {
    
     var incX = Math.ceil(calcDistanceToMove(delta, speed));
     //console.log(incX)
          // check inputStates
     if (inputStates.left == 'True'){
     		if (x > 0) {
        	x-= incX;
        }
     }
     if (inputStates.right == 'True'){
     		if (x + vausWidth < w) {
        	 x += incX;
        }
     }
     if (inputStates.space == 'True'){
     		console.log("Espacio")
     }
}

 function timer(currentTime) {
    var aux = currentTime - oldTime;
    oldTime = currentTime;
    return aux;
    
  }
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
      
        // number of ms since last frame draw
        delta = timer(time);

    // Clear the canvas
    clearCanvas();

    // Mover Vaus de izquierda a derecha
    updatePaddlePosition();

    // draw Vaus
    drawVaus(x, y);

    // call the animation loop every 1/60th of second
    requestAnimationFrame(mainLoop);
  };

  var start = function() {
    // adds a div for displaying the fps value
    fpsContainer = document.createElement('div');
    document.body.appendChild(fpsContainer);

// TU CÓDIGO AQUÍ
// Crea un listener para gestionar la pulsación
// de izquierda, derecha o espacio
// y actualiza inputStates.left .right o .space 
// el listener será para keydown (pulsar)
// y otro para keyup
		inputStates.right = 'False';
    inputStates.left = 'False';
    inputStates.space = 'False';
		document.onkeydown = function pulsar(tecla){
    	tecla.preventDefault();
    	switch(tecla.code){
      	 case "ArrowLeft":
            inputStates.left = 'True';
            break;//izquierda 
        case "ArrowRight":
            //if(x+27<476)
            inputStates.right = 'True';
            break;
        case "Space":
        		inputStates.space = 'True';
            break;
     	}
    }
    document.onkeyup = function pulsar(tecla){
    	tecla.preventDefault();
    	switch(tecla.code){
      	 case "ArrowLeft":
            inputStates.left = 'False';
            break;//izquierda 
        case "ArrowRight":
            //if(x+27<476)
            inputStates.right = 'False';
            break;
        case "Space":
        		inputStates.space = 'False';
            break;
     	}
    }

    // start the animation
    requestAnimationFrame(mainLoop);
  };

  //our GameFramework returns a public API visible from outside its scope
  return {
    start: start
  };
};


var game = new GF();
game.start();
