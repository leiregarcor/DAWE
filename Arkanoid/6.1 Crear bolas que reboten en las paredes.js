// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var x = 130,
  y = 135;
var delta;
// var frames = 30;

  function testCollisionWithWalls(ball, w, h) {
        // TU CÓDIGO AQUÍ
        //x e y +6
        var ret = false
        if(ball.x-ball.radius < 0 || ball.x+ball.radius > w){
        	ball.angle = -ball.angle + Math.PI;
        }else	if(ball.y+ball.radius > h){
          ball.angle = -ball.angle;
          ret = true;
          console.log(ret);
        }else if(ball.y-ball.radius < 0){
        	ball.angle = -ball.angle;
        }
        return ret;
    }

// función auxiliar
var calcDistanceToMove = function(delta, speed) {
      // TU CÓDIGO AQUÍ
      return ((speed * delta) / 1000)
  };

function Ball(x, y, angle, v, diameter, sticky) {
 // TU CÓDIGO AQUÍ
 	this.x = x;
  this.y = y;
  this.angle = angle;
  this.speed = v;
  this.radius = diameter/2;
  this.sticky = sticky;

  this.draw = function(ctx) {
     // TU CÓDIGO AQUÍ
     // Pintar la bola en this.x, this.y
     // con radio = this.radius
     // y color verde (green)
    ctx.beginPath();
   	ctx.fillStyle = '#008000';
    ctx.lineWidth = 2;

    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  };

  this.move = function(x, y) {
  // TU CÓDIGO AQUÍ
  // actualizar los atributos this.x , this.y al valor que llega como parámetro
  // si éstos están definidos
  // si no
  // actuializar this.x , this.y a la nueva posición, siguiendo la fórmula del enunciado
  // para calcular incX e incY
  // usar la función calcDistanceToMove para calcular el incremento real de this.x , this.y
  // (animación basada en el tiempo)
  // OJO: la posición y no puede ser inferior a 0 en ningún momento
 // RECUERDA: delta es una variable global a la que puedes acceder...
 		if(x != undefined && y != undefined){
    	this.x = x;
      this.y = y;
    }
    else{
    	var incX = this.speed * Math.cos(this.angle);
			var incY = this.speed * Math.sin(this.angle);
      this.x += calcDistanceToMove(delta, incX);
      this.y += calcDistanceToMove(delta, incY);
    }
  };
}

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
  var fps, oldTime = 0;

  var speed = 300; // px/s 
  var vausWidth = 30,
    vausHeight = 10;

  var balls = [];

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


  var updatePaddlePosition = function() {


    var incX = Math.ceil(calcDistanceToMove(delta, speed));

    // check inputStates
    // TU CÓDIGO AQUÍ
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


  function updateBalls() {
    for (var i = balls.length - 1; i >= 0; i--) {
      var ball = balls[i]; 
      ball.move();
      
      var die = testCollisionWithWalls(ball, w, h);

      ball.draw(ctx);
    }
  }

  function timer(currentTime) {
    var aux = currentTime - oldTime;
    oldTime = currentTime;
    return aux;

  }
  var mainLoop = function(time) {
    //main function, called each frame 
    measureFPS(time);

    // number of ms since last frame draw
    delta = timer(time);

    // Clear the canvas
    clearCanvas();

    // Mover Vaus de izquierda a derecha
    updatePaddlePosition();

    updateBalls();

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

// TU CÓDIGO AQUÍ
// Instancia una bola con los parámetros del enunciado e introdúcela en el array balls
		var bola_inicial = new Ball(50, 70, Math.PI/3, 10, 12, 'False');
    balls.push(bola_inicial);
    bola_inicial.draw(ctx);
    

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

var ball1 = new Ball(48.68599000001268,2.993899778876827,1.0471975511965976, 10, 6, false);

test('Colisión con pared superior', function(assert) {
  var res_sup = testCollisionWithWalls(ball1, w, h);
  assert.equal(ball1.x, 48.68599000001268, "Passed!");
  assert.equal(ball1.y, 3, "Passed!");
  assert.equal(ball1.angle,-1.0471975511965976, "Passed!");
  assert.equal(res_sup, false);
});


var ball2 = new Ball( 131.84048499999335,147.02781021770147,-1.0471975511965976
, 10, 6, false);

test('Colisión con pared inferior', function(assert) {
  var res_bottom = testCollisionWithWalls(ball2, w, h);
  assert.equal(ball2.x,  131.84048499999335 , "Passed!");
  assert.equal(ball2.y, 147, "Passed!");
  assert.equal(ball2.angle,1.0471975511965976, "Passed!");
  assert.equal(res_bottom, true);
});


var ball3 = new Ball(  147.0802850000473 ,120.60389210271744,1.0471975511965976
, 10, 6, false);

test('Colisión con pared izquierda', function(assert) {
  var res_left = testCollisionWithWalls(ball3, w, h);
  assert.equal(ball3.x, 147, "Passed!");
  assert.equal(ball3.y,  120.60389210271744, "Passed!");
  assert.equal(ball3.angle,  2.0943951023931957, "Passed!");
  assert.equal(res_left, false);
});

