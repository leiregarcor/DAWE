// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;


var x = 10,
  y = 135;

// Inits
window.onload = function init() {
  var game = new GF();
  game.start();
};


// GAME FRAMEWORK
var GF = function() {

  var frameCount = 0;
  var lastTime;
  var fpsContainer;
  var fps;

  var speed = -5; // posición de Vaus
  var vausWidth = 30;
  var vausHeight = 10;


  var measureFPS = function(newTime) {

    if (lastTime === undefined) {
      lastTime = newTime;
      return;
    }

    var diffTime = newTime - lastTime;

    if (diffTime >= 1000) {

      fps = frameCount;
      frameCount = 0;
      lastTime = newTime;
    }
    fpsContainer.innerHTML = 'FPS: ' + fps;
    frameCount++;
  };

  // clears the canvas content
  function clearCanvas() {
    ctx.clearRect(0, 0, w, h);
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

    // TU CÓDIGO AQUÍ
    // Fíjate que GF tiene definidas ya variables de interés
    // que tendrás que usar: x, y, speed, vausWidth, w
    x += speed;
    console.log("x: " + x)
    // Si el rectángulo llega al borde derecho del canvas, cambiar la dirección del movimiento
    if (x + vausWidth > w) {
      speed = -speed;
      console.log("Speed: " + speed)
    }

    // Si el rectángulo llega al borde izquierdo del canvas, cambiar la dirección del movimiento
    if (x < 0) {
      speed = Math.abs(speed);
    }


/*
    if(x<(h-vausHeight) && dir){
      console.log(x + " "+(h-vausHeight))

    }else{
      dir=false;
    }
    console.log(dir)
    if((x>vausHeight) && !dir){
      x=x+speed
    }
    else{
      dir=true;
    }
    console.log(x)
*/

  }

  var mainLoop = function(time) {
    // funció principal, llamada en cada frame
    measureFPS(time);

    // Borrar canvas
    clearCanvas();

    // Mover Vaus de izquierda a derecha
    updatePaddlePosition();

    // pintar Vaus
    drawVaus(x, y);

    // animation loop, llamado cada 1/60 segundos
    requestAnimationFrame(mainLoop);
  };

  var start = function() {
    // un div para mostrar los fps
    fpsContainer = document.createElement('div');
    document.body.appendChild(fpsContainer);

    // comenzar la animación
    requestAnimationFrame(mainLoop);
  };

  // API Público
  return {
    start: start
  };
};


var game = new GF();
game.start();


