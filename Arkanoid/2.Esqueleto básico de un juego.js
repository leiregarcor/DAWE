// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx=canvas.getContext("2d");
var w = canvas.width;
var h= canvas.height;

var x = getRandomInt(w);
var y = getRandomInt(h);
const radio = 5;



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Game Framework
var GF = function(){
  
   var mainLoop = function(time){
    // TU CÓDIGO AQUÍ
    //clearRect(0, 0, w, h);
    x = getRandomInt(w);
    y = getRandomInt(h);
    ctx.beginPath();
    ctx.fillStyle = '#ff0000';
    //ctx.strokeStyle = '#0077aa47';
    ctx.lineWidth = 2;

    ctx.arc(x, y, radio, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    

    requestAnimationFrame(mainLoop);
  };
  var start = function(){
    requestAnimationFrame(mainLoop);
  };
  return {
    start: start
  };
};

var game = new GF();
game.start();


test('Testeando colores', function(assert) {  

    var done = assert.async();
    var rojos = 0;
   
  // ctx.fillStyle = 'red';
 //  ctx.fillRect(15,15,4,4);    

  setTimeout(function() {
         var colores = [];
         
         colores.push(
         Array.prototype.slice.apply(canvas.getContext("2d").getImageData(15, 15, 1, 1).data), Array.prototype.slice.apply(canvas.getContext("2d").getImageData(45, 45, 1, 1).data), Array.prototype.slice.apply(canvas.getContext("2d").getImageData(75, 75, 1, 1).data), Array.prototype.slice.apply(canvas.getContext("2d").getImageData(105, 105, 1, 1).data),
 Array.prototype.slice.apply(canvas.getContext("2d").getImageData(135, 135, 1, 1).data)
         );
         
   for(var i=0; i< colores.length; i++)
      if (colores[i][0] == 255)
            rojos++;
         
   assert.ok( rojos >= 1, "Passed!");  
    done();
  }, 10000 );
    
});



