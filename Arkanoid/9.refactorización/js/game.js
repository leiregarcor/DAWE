// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
// var x = 130,
//  y = 135; // posición inicial de Vaus
var delta;
var ANCHURA_LADRILLO = 15,
  ALTURA_LADRILLO = 7;

//Cood de los colores de los ladrillos
coords = {
    "red": [16,8],
    "grey": [32,0]
}

// var frames = 30;

function intersects(left, up, right, bottom, cx, cy, radius )
{
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
      sonidos.play("choqueVaus")
    ball.angle = -ball.angle + Math.PI;
    ball.x= w -ball.radius;
  }else	if(ball.x-ball.radius < 0 ){
     sonidos.play("choqueVaus")
    //margen izquierda
    ball.angle = -ball.angle + Math.PI;
    ball.x= ball.radius; 
  }
  else	if(ball.y+ball.radius > h){
     sonidos.play("choqueVaus")
     //devuele true si ha tocado el margen inferior
    ball.angle = -ball.angle;
    ball.y = h - ball.radius;
    ret = true;
  }else if(ball.y-ball.radius < 0){
     sonidos.play("choqueVaus")
    //margen superior
    ball.angle = -ball.angle;
    ball.y = ball.radius;
  }
  return ret;

}

function Brick(x, y, color) {
      // TU CÓDIGO AQUÍ
    this.x = x;
    this.y = y;
    this.color = color;
    this.sprite = new Sprite('img/sprites.png', coords[color], [ANCHURA_LADRILLO,ALTURA_LADRILLO]);
}

Brick.prototype = {
  draw: function(ctx) {
       // TU CÓDIGO AQUÍ
    // ctx.beginPath();
    //ctx.fillStyle = this.color;
    // Dibujar el rectángulo
    //ctx.fillRect(this.x, this.y, ANCHURA_LADRILLO, ALTURA_LADRILLO); // Posición (x, y) y tamaño (ancho, alto) del rectángulo
      ctx.save();
      ctx.translate(this.x, this.y);
      this.sprite.render(ctx);
      ctx.restore();
  }
};


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
  //Para cuando cargue los audios, se inicialice la partida
  loadAssets(game.start);
};

function loadAssets(callback) {
    // Cargar sonido asíncronamente usando howler.js
    music = new Howl({
        urls: ['audio/Game_Start.ogg'], volume: 1,
        onload: function () {
            callback();
        }
    });

    sonidos = new Howl({
        urls: ['audio/sounds.mp3'], volume: 1,
        sprite : {
            choqueVaus: [0,700],
            salir: [1000,1700],
            empezar: [3000,2700],
            movimiento: [5000,500],
            point: [1400,700]
        },
        onload: function () {
            callback();
        }
    });
}// new Howl
// GAME FRAMEWORK STARTS HERE
var GF = function() {

  // vars for counting frames/s, used by the measureFPS function
  var frameCount = 0;
  var lastTime;
  var fpsContainer;
  var fps, oldTime = 0;

    //  var speed = 300; // px/s 
    //  var vausWidth = 30,   vausHeight = 10;

  var balls = [];
  var bricks = [];
  var bricksLeft = 0;
  
  var lifes = 3;

  // vars for handling inputs
  var inputStates = {right:'False', left:'False', space:'False'};

  // game states
    var gameStates = {
           // TU CÓDIGO AQUÍ
			0: "gameRunning",
		  1: "gameOver"
    };

  var currentGameState = gameStates[0];    // TU CÓDIGO AQUÍ


  // VAUS en objeto literal 
    var paddle = {
        dead: false,
        x: 130,
        y: 130,
        width: 32,
        height: 8,
        speed: 300, // pixels/s 
      	sticky: false,
        sprite: new Sprite('img/sprites.png', [224,40], [32,8], 16, [0,1])        
    };



  var ladrillos = [
    // grey
    {
      x: 20,
      y: 20,
      c: 'grey'
    }, {
      x: (20 * 2 + ANCHURA_LADRILLO),
      y: 20,
      c: 'grey'
    }, {
      x: 20 * 3 + ANCHURA_LADRILLO * 2,
      y: 20,
      c: 'grey'
    }, {
      x: 20 * 4 + ANCHURA_LADRILLO * 3,
      y: 20,
      c: 'grey'
    }, {
      x: 20 * 5 + ANCHURA_LADRILLO * 4,
      y: 20,
      c: 'grey'
    },
    // red
    {
      x: 20,
      y: 42,
      c: 'red'
    }, {
      x: 20 * 2 + ANCHURA_LADRILLO,
      y: 42,
      c: 'red'
    }, {
      x: 20 * 3 + ANCHURA_LADRILLO * 2,
      y: 42,
      c: 'red'
    }, {
      x: 20 * 4 + ANCHURA_LADRILLO * 3,
      y: 42,
      c: 'red'
    }, {
      x: 20 * 5 + ANCHURA_LADRILLO * 4,
      y: 42,
      c: 'red'
    }
  ];

 function initTerrain() {
    //sprites del fondo de color
    terrain = new Sprite('img/sprites.png', [192,130], [30, 30], 16, [0,1])
    terrainPattern =  ctx.createPattern ( terrain.image(), 'repeat') ;  // repeat forma un mosaico con el fondo
  }

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
          sonidos.play("movimiento")
          break;//izquierda
        case "ArrowRight":
          //if(x+27<476)
          inputStates.right = 'True';
          sonidos.play("movimiento")
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

  var createBricks = function() {
      // TU CÓDIGO AQUÍ
      ladrillos.forEach((ladrillo) => {
      var brick = new Brick(ladrillo.x, ladrillo.y, ladrillo.c);
      // añade un ladrillo al array de ladrillos
      bricks.push(brick);
      bricksLeft++;
      //console.log("bricksLeft: " + bricksLeft);
      });
    }
  
  var drawBricks = function() {
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
    //Se añade el estilo de la hoja de sprite
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, w, h);
  }

  
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
		// TU CÓDIGO AQUÍ
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
	 
	    	if(aux.c) {
              sonidos.play("point")
	//si la bola alcanza un ladrillo
        //Cambio de angulo segun lado del ladrillo:
	      	switch(aux.d) { // lado del choque
						case "right":
		  				ball.angle = -ball.angle + Math.PI;
				  ball.x = ladrillo.x + ANCHURA_LADRILLO + ball.radius; //estando a la derecha-> la nueva coordenada x es= la coordenada del lado derecho del ladrillo + (radio) el ancho de la bola hasta el centro
		  				break;
		  			case "left":
		  				 ball.angle = -ball.angle + Math.PI;          
				  ball.x = ladrillo.x - ball.radius;
	    				break;
		  			case "top":
		  				ball.angle = -ball.angle;
				  ball.y = ladrillo.y - ball.radius;
		  				break;
		  			case "bottom":
		  				 ball.angle = -ball.angle;
          //no queremos que la se dibuje dentro del ladrillo
				  ball.y = ladrillo.y + ALTURA_LADRILLO + ball.radius;
		  				break;
					}
	      	bricks.splice(bricks.indexOf(ladrillo), 1); // eliminamos el ladrillo
					ball.speed += 5; // aumentamos velocidad de la bola
          bricksLeft--;
	    	}
    	}
	   // devuelve el número de ladrillos que quedan
	  )};



  // Función para pintar la raqueta Vaus
  function drawVaus(x, y) {
    // TU CÓDIGO AQUÍ
    //clearRect(0, 0, w, h);
    //ctx.beginPath();
    //ctx.fillStyle = '#000';
    // Dibujar el rectángulo
    //ctx.fillRect(x,y, paddle.width, paddle.height); // Posición (x, y) y tamaño (ancho, alto) del rectángulo
    

      //dibujar el sprite del vaus
    ctx.save();
    ctx.translate(x, y);
    paddle.sprite.render(ctx);
    ctx.restore();
  }

	
  function createBallInicial(ctx){
    	var bola_inicial = new Ball(50, 70, Math.PI/3, 30, 12, 'False');
    	balls.push(bola_inicial);
    	bola_inicial.draw(ctx);
  }
  
    function displayLifes() {
    // TU CÓDIGO AQUÍ
    	// Muestra en la esquina superior derecha, en rojo, el número de vidas que quedan
        // por ejemplo, Lifes: 3
    	ctx.fillStyle = "white";
    	ctx.font = "bold 10px Arial";
    	ctx.fillText(`Lifes: ${lifes}`, 190, 10);
    }
    
  var updatePaddlePosition = function() {
    //para el sprite del vaus
    paddle.sprite.update(delta);

    var incX = Math.ceil(calcDistanceToMove(delta, paddle.speed));
  // TU CÓDIGO AQUÍ
  	if (inputStates.left == 'True'){
      if (paddle.x > 0) {
        paddle.x-= incX;
      }
    }
    if (inputStates.right == 'True'){
      if (paddle.x + paddle.width < w) {
        paddle.x += incX;
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
      // Nuevo: gestiona la pérdida de una bola usando los atributos de paddle
      if(die){
      	balls.pop();
        console.log(balls.length);
				if(balls.length < 1){ //si es la última bola
        	lifes --;
          paddle.dead = 'True';
        }
      }
      // TU CÓDIGO AQUÍ
       // si la bola ha caído por la parte inferior
       // eliminarla del array de bolas
       // Si no quedan bolas --> una vida menos
      if(circRectsOverlap(paddle.x, paddle.y, paddle.width, paddle.height, ball.x, ball.y, ball.radius)){
        //se redibuja la bola para que no quede encerrada en el vaus
        sonidos.play("choqueVaus")
        ball.y = paddle.y - ball.radius; //es una resta porque la esquina superior es 0
        //modificacion 14 rebote con efecto
        if (inputStates.right == 'True'){
          console.log('inputstates right')
          ball.angle = ball.angle * (ball.angle < 0 ? 0.5 : 1.5);
        }else if (inputStates.left == 'True'){
          console.log('inputstates left')
          ball.angle = ball.angle * (ball.angle > 0 ? 0.5 : 1.5);
        }else{
          console.log('inputstates else')
          ball.angle = -ball.angle; //--sustituimos esta linea por las siguientes
        }
        
      }
      // NUEVO
      // test if ball collides with any brick
      bricksLeft = testBrickCollision(ball);

      // TU CÓDIGO AQUÍ
      // Test if the paddle collides
      // NUEVO: Gestiona el rebote de la bola con Vaus usando los atributos de paddle

      ball.draw(ctx);
    }
  }

  function timer(currentTime) {
    var aux = currentTime - oldTime;
    oldTime = currentTime;
    return aux;

  }
  var mainLoop = function(time) {
     initTerrain()
    //main function, called each frame 
    measureFPS(time);

    // number of ms since last frame draw
    delta = timer(time);

    // Clear the canvas
    clearCanvas();
    // TU CÓDIGO AQUÍ
    // NUEVO
    // Si se ha perdido una vida, comprobar si quedan más 
    // si no --> Game Over
    // si quedan más --> sacar una nueva bola (y actualizar el atributo paddle.dead)
		if(paddle.dead == 'True'){
    	if(lifes < 1){
      	currentGameState = gameStates[1];
      }else{
      	createBallInicial(ctx);
        paddle.dead = 'False';
      }  
    }

  // TU CÓDIGO AQUÍ
  // SI currentGameState = en ejecución
   // todo sigue como antes: 
   	if(currentGameState == "gameRunning"){
        // Mover Vaus de izquierda a derecha
      updatePaddlePosition();

      updateBalls();

      // draw Vaus
      drawVaus(paddle.x, paddle.y);

      // dibujar ladrillos
      drawBricks();

      displayLifes();

      // call the animation loop every 1/60th of second

      requestAnimationFrame(mainLoop);
	}
    // PERO Si currentGameState = GAME OVER
    // PINTAR la pantalla de negro y escribir GAME OVER  
	else if(currentGameState == "gameOver"){
      clearCanvas();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.fillRect(0,0,w,h);
      ctx.fill();
      
      ctx.fillStyle = "white";
      ctx.font = "bold 30px Arial";
      ctx.fillText("GAME OVER", (w/2)-95,(h/2)+10);
    }
    
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
		inicializarGestores();

        //cargar sprites desde imagen
        resources.load([
    		'img/sprites.png'
        ]);
        resources.onReady(GF);


      // TU CÓDIGO AQUÍ
        // Instancia una bola con los parámetros del enunciado e introdúcela en el array balls
        createBallInicial(ctx);
        createBricks();
        //Empezar la musica
      music.play()
    // start the animation
    requestAnimationFrame(mainLoop);
    
 
  };

  //our GameFramework returns a public API visible from outside its scope
  return {
    start: start
  };
};


