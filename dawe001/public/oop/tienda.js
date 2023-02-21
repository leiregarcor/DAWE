  import {Disco} from './disco.js'
  import {Libro} from './libro.js'

var libro1 = new Libro("Dublinés", "Alfonso Zapico", 18);
var libro2 = new Libro("El arte de volar", "Antonio Altarriba y Kim", 20.90);
var disco1 = new Disco("Próxima estación: Esperanza", "Manu Chao", 15, "CD");

// Incluimos los objetos en un array tienda
export var tienda = [];
tienda.push(libro1, libro2, disco1);
			
