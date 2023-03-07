import {Producto} from './producto.js'
export function Disco(titulo, autor, precio, formato) {
	Producto.apply(this, [titulo, autor, precio]);
	this.formato = function() {
  	console.log("Formato del disco: " + formato)
  }
}

Disco.prototype = new Producto();
Disco.prototype.constructor = Disco;
