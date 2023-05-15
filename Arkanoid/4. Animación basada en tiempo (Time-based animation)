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

  function drawVaus(x, y) {
// TU CÓDIGO AQUÍ
    //clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.fillStyle = '#000';
    // Dibujar el rectángulo
    ctx.fillRect(x,y, 30, 10); // Posición (x, y) y tamaño (ancho, alto) del rectángulo

  }

  var calcDistanceToMove = function(delta, speed) {
    return ((speed * delta) / 1000)
  }

  var updatePaddlePosition = function() {
    var incX = Math.ceil(calcDistanceToMove(delta, speed));
    console.log(incX)
    // TU CÓDIGO AQUÍ
    // Fíjate que GF tiene definidas ya variables de interés
    // que tendrás que usar: x, y, speed, vausWidth, w
    x += incX*direction;
    console.log("x: " + x)
    // Si el rectángulo llega al borde derecho del canvas, cambiar la dirección del movimiento
    if (x + vausWidth > w) {
      direction = -direction;
      console.log("Speed: " + speed)
    }

    // Si el rectángulo llega al borde izquierdo del canvas, cambiar la dirección del movimiento
    if (x < 0) {
      direction = Math.abs(direction);
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
