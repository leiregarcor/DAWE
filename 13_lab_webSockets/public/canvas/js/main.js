import {setupSockets} from "./sockets.js";
// main.js hay que importarlo con type=”module”.
// podeis crear otra funcion que llame a setupSockets, lo pongo asi para simplificar
window.onload = setupSockets; 

const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
var x = 0;
var y = 0;
var img_w = 0; // anchura spritesheet
var img_h = 0; // altura spritesheet
var speed = 10; // velocidad de desplazamiento de la ventana
var window_w = 25; // anchura de la ventana
var window_h = 35; // altura de la ventana
var offset_fixed_window = 10; // espacio entre el spritesheet y la ventana fija de la derecha

var logo = new Image();
logo.src = './canvas/img/spritesheet.png';
logo.onload = function(){
    context.drawImage(logo, 0, 0); // dibujar el spritesheet
    img_w = this.width;
    img_h = this.height;
    context.drawImage(logo, x, y, window_w, window_h, img_w+offset_fixed_window, 0, 2*window_w, 2*window_h); // dibujar la ventana fija donde se visualiza el contenido de la ventana
};
document.onkeydown = function pulsar(tecla){
    canvas.width=canvas.width; //Para que no se quede atascado en el borde. Borra tambien todo el contenido del canvas.
    context.lineWidth = "2";
    tecla.preventDefault();
    switch(tecla.code){

        case "ArrowLeft":
            if(x>0)
                x=Math.max(0,x-speed);
            break;//izquierda
        case "ArrowUp":
            if(y>0)
               y=Math.max(0, y-speed);       
            break;  
        case "ArrowRight":
            //if(x+27<476)
            if(x+window_w<img_w)
              x=Math.min(img_w-window_w-1, x+speed);
            break;
        case "ArrowDown":
            if(y+window_h<img_h)
               y=Math.min(img_h-window_h-1, y+speed);
            break;
    }     
    
    context.drawImage(logo, 0, 0); // dibujar el spritesheet
    context.rect(x, y, window_w, window_h); // dibujar la ventana en su nueva posicion
   
    context.drawImage(logo, x, y, window_w, window_h, img_w+offset_fixed_window, 0, 2*window_w, 2*window_h); // dibujar la ventana fija redimensionada

    context.strokeStyle = "red";
    context.fillText("("+x+","+y+")", 435, 10); // texto que muestra la posicion actual
    context.stroke();
}
