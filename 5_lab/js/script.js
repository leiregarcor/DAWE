function inicializarGestores()
{
	var formulario = document.getElementById('form');
	formulario.onsubmit = getInfo;
	//console.log(formulario);	
}


	generarDatos = (data) => {
		var isbn = document.getElementById("libros").value
					console.log(data[`ISBN:${isbn}`])
					
            		document.getElementsByTagName("h5")[0].innerHTML=data[`ISBN:${isbn}`].details.title
            		document.getElementsByTagName("h6")[0].innerHTML=data[`ISBN:${isbn}`].details.authors[0].name


	};
	generarImagen = (data) => {
				var isbn = document.getElementById("libros").value
				document.getElementsByTagName("img")[0].src=data[`ISBN:${isbn}`].thumbnail_url.replace("S","M")
				return data;
	};


	getInfo=()=>{
     	   var isbn = document.getElementById("libros").value
           fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`) // la promesa: descarga asíncronamente un fichero
            .then((response) => response.json()) 
            .then((data) => 
					generarImagen(data)
        		).then((data) => 
					generarDatos(data)
					
        		)
        	};






window.onload = inicializarGestores;
