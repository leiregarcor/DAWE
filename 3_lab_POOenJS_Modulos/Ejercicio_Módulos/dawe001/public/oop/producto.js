export function Producto(titulo, autor, precio) {
	this.titulo = titulo;
	this.autor = autor;
	this.precio = precio;
}

Producto.prototype.mostrar = function() {
	var contenido = "Producto: " + this.titulo + "<br/>" + "Autor: " + this.autor + "<br/>" + "Precio: " + this.precio + "<hr/>";
	return contenido;
}
