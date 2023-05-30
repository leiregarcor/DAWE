// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var x = 130,
  y = 135; // posición inicial de Vaus
var delta;
var ANCHURA_LADRILLO = 20, ALTURA_LADRILLO = 10;

// var frames = 30;
//[JOAO] función traída del enunciado 7.1
function intersects(left, up, right, bottom, cx, cy, radius ){
  var closestX = (cx < left ? left : (cx > right ? right : cx));
  var closestY = (cy < up ? up : (cy > bottom ? bottom : cy));
  var dx = closestX - cx;
  var dy = closestY - cy;
  var side;

  var dt = Math.abs(up - cy);
  var db = Math.abs(bottom - cy);
  var dr = Math.abs(right - cx);
  var dl = Math.abs(left - cx);
  var dm = Math.min(dt, db, dr, dl);
  switch (dm) {
    case dt:
      side = "top";
      break;
    case db:
      side = "bottom";
      break;
    case dr:
      side = "right";
      break;
    case dl:
      side = "left";
      break;
  }

  return result = { c : ( dx * dx + dy * dy ) <= radius * radius, d : side  };
}
// Collisions between rectangle and circle
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
  var testX = cx;
  var testY = cy;

  if (testX < x0)
    testX = x0;
  if (testX > (x0 + w0))
    testX = (x0 + w0);
  if (testY < y0)
    testY = y0;
  if (testY > (y0 + h0))
    testY = (y0 + h0);

  return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
}
function testCollisionWithWalls(ball, w, h) {
  // TU CÓDIGO AQUÍ
  var ret = false
  //cuando hay colisión hay que redibujar la bola dentro del margen
  if(ball.x+ball.radius > w){
    //margen derecha
    ball.angle = -ball.angle + Math.PI;
    ball.x= w -ball.radius;
    //console.log("CASO 1")
  }else	if(ball.x-ball.radius < 0 ){
    //margen izquierda
    ball.angle = -ball.angle + Math.PI;
    ball.x= ball.radius; 
  }
  else	if(ball.y+ball.radius > h){
     //devuele true si ha tocado el margen inferior
    ball.angle = -ball.angle;
    ball.y = h - ball.radius;
    //console.log("CASO 2")
    ret = true;
  }else if(ball.y-ball.radius < 0){
    //margen superior
    ball.angle = -ball.angle;
    ball.y = ball.radius;
    //console.log("CASO 3")
  }
  return ret;
}

function Brick(x,y,color) {
  // TU CÓDIGO AQUÍ
  this.x = x;
  this.y = y;
  this.color = color;
}

Brick.prototype = {
  draw : function(ctx) {
    // TU CÓDIGO AQUÍ
    ctx.beginPath();
    ctx.fillStyle = this.color;
    // Dibujar el rectángulo
    ctx.fillRect(this.x, this.y, ANCHURA_LADRILLO, ALTURA_LADRILLO); // Posición (x, y) y tamaño (ancho, alto) del rectángulo
  }
};


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
    ctx.beginPath();
    ctx.fillStyle = '#008000';
    ctx.lineWidth = 2;

    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();

  };

  this.move = function(x, y) {
    // TU CÓDIGO AQUÍ
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
  var bricks = [];
  //inicializar bricksLeft
  var bricksLeft = 0;  
  //var bricksLeft;


  // vars for handling inputs
  //inicializar a false
  var inputStates = {right:'False', left:'False', space:'False'};


  var ladrillos = [
    // grey
    {x:20,y:20,c:'grey'}, {x:(20*2+ANCHURA_LADRILLO),y:20,c:'grey'},{x:20*3+ANCHURA_LADRILLO*2,y:20,c:'grey'},{x:20*4+ANCHURA_LADRILLO*3,y:20,c:'grey'}, {x:20*5+ANCHURA_LADRILLO*4,y:20,c:'grey'} ,
    // red
    {x:20,y:42,c:'red'}, {x:20*2+ANCHURA_LADRILLO,y:42,c:'red'},{x:20*3+ANCHURA_LADRILLO*2,y:42,c:'red'},{x:20*4+ANCHURA_LADRILLO*3,y:42,c:'red'}, {x:20*5+ANCHURA_LADRILLO*4,y:42,c:'red'} ];

  function inicializarGestores(){
    //FUNCION PARA INICIALIZAR LOS GESTORES DEL TECLADO keyup y keydomw

    // Crea un listener para gestionar la pulsación
    // de izquierda, derecha o espacio
    // y actualiza inputStates.left .right o .space
    // el listener será para keydown (pulsar)
    // y otro para keyup

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
  }


  var createBricks = function(){
    // TU CÓDIGO AQUÍ
    ladrillos.forEach((ladrillo) => {
      var brick = new Brick(ladrillo.x, ladrillo.y, ladrillo.c);
      // añade un ladrillo al array de ladrillos
      bricks.push(brick);
      //[JOAO] - 7.1 - Incremento de la cantidad de bricks
      bricksLeft++;
      console.log(brick);
      console.log("bricksLeft: " + bricksLeft);

    });
  }

  var drawBricks = function(){
    // TU CÓDIGO AQUÍ
    for (var i = bricks.length - 1; i >= 0; i--) {
      var brick = bricks[i];
      brick.draw(ctx);
    }
  };

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

  //[JOAO] 7.1
  function testBrickCollision(ball) {
    // TU CÓDIGO AQUÍ
    // Para cada ladrillo
    // comprobar si hay intersección entre bola y ladrillo
    // si la hay, incrementar la velocidad de la bola
    // y rebotar la bola consecuentemente
    // recuerda que ya has implementado un rebote de bola contra
    // cualquiera de las paredes (left, right, top, bottom)
    // por lo que un rebote contra un ladrillo es exactamente igual
    // En caso de colisión bola-ladrillo, elimina del array bricks
    // el ladrillo correspondiente
    bricks.forEach((ladrillo) => {
      var aux = intersects(ladrillo.x,ladrillo.y,(ladrillo.x+ANCHURA_LADRILLO),(ladrillo.y+ALTURA_LADRILLO), ball.x,ball.y,ball.radius);
      /*
       * ladrillo.x = coordenada erpin izq x
       * ladrillo.y = coordenada erpin izq y
       * ladrillo.x+ANCHURA_LADRILLO = coordenada erpin dcho x
       * ladrillo.y+ALTURA_LADRILLO = coordenada erpin dch y
       * ball.x = coordenada x del centro de la bola
       * ball.y = coordenada y del centro de la bola
       * ball.radius = radio de la bola
       */
      if (aux.c){
        //si la bola alcanza un ladrillo
        //Cambio de angulo segun lado del ladrillo:
        if(aux.d=="right"){
          ball.angle = -ball.angle + Math.PI;
				  ball.x = ladrillo.x + ANCHURA_LADRILLO + ball.radius; //estando a la derecha-> la nueva coordenada x es= la coordenada del lado derecho del ladrillo + (radio) el ancho de la bola hasta el centro
        }else if ( aux.d=="left") {
          ball.angle = -ball.angle + Math.PI;          
				  ball.x = ladrillo.x - ball.radius;
        }
        else	if(aux.d=="top"){
          ball.angle = -ball.angle;
				  ball.y = ladrillo.y - ball.radius;
        }else if(aux.d=="botton"){
          ball.angle = -ball.angle;
          //no queremos que la se dibuje dentro del ladrillo
				  ball.y = ladrillo.y + ALTURA_LADRILLO + ball.radius;
        }
        //para eliminar el ladrillo hay que usar el metodo del array scplice, pero hace falta saber el indice del ladrillo
        //sintaxis-> array.splice(start[, deleteCount[, item1[, item2[, ...]]]]), es decir desde que indice se elimina y hasta que índice
        //estoy dando por hecho que el indice nunca va a dar negativo porque bricks va a tener elementos, si no no entraría en el foreach
        bricks.splice(bricks.indexOf(ladrillo),1);
        ball.speed++;        
        //restamos los ladrillos restantes
        bricksLeft--;
      }


    });


    //falta el return
    // devuelve el número de ladrillos que quedan
  }

  // Función para pintar la raqueta Vaus
  function drawVaus(x, y) {
    // TU CÓDIGO AQUÍ
    //clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.fillStyle = '#000';
    // Dibujar el rectángulo
    ctx.fillRect(x,y, vausWidth, vausHeight); // Posición (x, y) y tamaño (ancho, alto) del rectángulo
  }


  var updatePaddlePosition = function() {


    var incX = Math.ceil(calcDistanceToMove(delta, speed));

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

      // TU CÓDIGO AQUÍ
      // Test para comprobar colisión entre Vaus y la bola
      if(circRectsOverlap(x, y, vausWidth, vausHeight, ball.x, ball.y, ball.radius)){
        //se redibuja la bola para que no quede encerrada en el vaus
        ball.y = y - ball.radius; //es una resta porque la esquina superior es 0
        ball.angle = -ball.angle;
      }

      //[JOAO] 7.1 NUEVO
      // test if ball collides with any brick
      //bricksLeft = testBrickCollision(ball);
      //no hace falta devolverlo porque ya se guarda como variable global
      testBrickCollision(ball);

      // TU CÓDIGO AQUÍ
      // Test if the paddle collides
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

    // dibujar ladrillos
    drawBricks();
    // call the animation loop every 1/60th of second
    requestAnimationFrame(mainLoop);
  };

  var start = function() {
    // adds a div for displaying the fps value
    fpsContainer = document.createElement('div');
    document.body.appendChild(fpsContainer);

  // TU CÓDIGO AQUÍ
  // Crea un listener para gestionar la pulsación de izquierda, derecha o espacio
  inicializarGestores();


// TU CÓDIGO AQUÍ
// Instancia una bola con los parámetros del enunciado e introdúcela en el array balls
    var bola_inicial = new Ball(50, 70, Math.PI/3, 30, 12, 'False');
    balls.push(bola_inicial);
    bola_inicial.draw(ctx);

    createBricks();

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

test('Comprobar ladrillos', function(assert) {
  var brickW = 20;
  var bricks = [{x:20,y:20,c:'grey'}, {x:(20*2+brickW),y:20,c:'grey'},{x:20*3+brickW*2,y:20,c:'grey'},{x:20*4+brickW*3,y:20,c:'grey'}, {x:20*5+brickW*4,y:20,c:'grey'} ,

    {x:20,y:42,c:'red'}, {x:20*2+brickW,y:42,c:'red'},{x:20*3+brickW*2,y:42,c:'red'},{x:20*4+brickW*3,y:42,c:'red'}, {x:20*5+brickW*4,y:42,c:'red'} ];

  for(var brick of bricks){
    var r=255, g=0, b=0, a=255;
    if (brick.c == 'grey'){
      r= 128; g = 128; b= 128;
    }
    assert.pixelEqual(canvas, brick.x, brick.y, r, g, b, a," Passed!");
  }
});

