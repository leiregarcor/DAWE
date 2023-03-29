var efecto = null;
var clip = "video/demovideo1"; // nombre del vídeo, sin extensión
var rotando = false;

window.onload = function() {

	var video = document.getElementById("video");
	var botonByN = document.getElementById("byn");
	botonByN.onclick = cambiarEfecto;
	var botonNormal = document.getElementById("normal");
	botonNormal.onclick = cambiarEfecto;
	var botonPausa = document.getElementById("pausa");
	botonPausa.onclick = pausar;
	var botonScifi = document.getElementById("scifi");
	botonScifi.onclick = cambiarEfecto;
	var botonRotar = document.getElementById("rotar");
	botonRotar.onclick = rotate;

	var botonAudio = document.getElementById("audio");	
	botonAudio.onclick = audio;
	
	var pipButtonElement = document.getElementById("pipButtonElement");
	pipButtonElement.addEventListener('click', async function() {
		pipButtonElement.disabled = true;
		if (video !== document.pictureInPictureElement) {
			await video.requestPictureInPicture();
		  } else {
			await document.exitPictureInPicture();
		  }
		pipButtonElement.disabled = false;
	});
				
	video.addEventListener("play", procesarFrame, false);
	
	video.src = clip + getFormatExtension();
	video.load();
	video.play();   
	
}


function loadAudio(url) {
	return new Promise(resolve => {
		const audio = new Audio();
		audio.addEventListener("loadeddata", () => {
			resolve(audio);
		});
		audio.src = url; 
		audio.load()
		audio.play()// cuando se cumpla, saltará el evento loadeddata
	});
}

function audio() {
	loadAudio("audio/soundtrack.mp3").then( audio => audio.play());
}

function pausar(){
	var video = document.getElementById("video");
	if (video.paused){
		video.play();
	}else{
		video.pause();
	}

}


function cambiarEfecto(e){
	var id = e.target.getAttribute("id");
	if ( id == "byn" ){
		efecto = byn;
	} 
	else if ( id == "scifi" ){
		efecto = scifi;
	} else {
		efecto = null;
	}
}

function getFormatExtension() {
	var video = document.getElementById("video");
	if (video.canPlayType("video/mp4") != "") {
		return ".mp4";
	} 
	else if (video.canPlayType("video/ogg") != "") {
		return ".ogv";
	}
	else if (video.canPlayType("video/webm") != "") {
		return ".webm";
	} 
}


function procesarFrame(e) {
	var video = document.getElementById("video");

	if (video.paused || video.ended) {
		return;
	}

	var bufferCanvas = document.getElementById("buffer");
	var displayCanvas = document.getElementById("display");
	var buffer = bufferCanvas.getContext("2d");
	var display = displayCanvas.getContext("2d");

	buffer.drawImage(video, 0, 0, bufferCanvas.width, bufferCanvas.height);
	var frame = buffer.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height);
	var length = frame.data.length / 4;

	for (var i = 0; i < length; i++) {
		var r = frame.data[i * 4 + 0];
		var g = frame.data[i * 4 + 1];
		var b = frame.data[i * 4 + 2];
		if (efecto){		
			efecto(i, r, g, b, frame.data);
		}
	}
	display.putImageData(frame, 0, 0);

	setTimeout(procesarFrame, 0);
	// en los navegadores modernos, es mejor usar :
	//requestAnimationFrame(procesarFrame);

}

function byn(pos, r, g, b, data) {
	var gris = (r+g+b)/3;

	data[pos * 4 + 0] = gris;
	data[pos * 4 + 1] = gris;
	data[pos * 4 + 2] = gris;
}

function scifi(pos, r, g, b, data) { 
	var offset = pos * 4;
	data[offset] = Math.round(255 - r); 
	data[offset+1] = Math.round(255 - g); 
	data[offset+2] = Math.round(255 - b) ;
}




function rotate() {

		var bufferCanvas = document.getElementById("buffer");
		var displayCanvas = document.getElementById("display");
		var buffer = bufferCanvas.getContext("2d");
		var display = displayCanvas.getContext("2d");
			  // Clear the canvas
				
			  // Move registration point to the center of the canvas
		buffer.translate(bufferCanvas.width/2, bufferCanvas.height/2);
				
			  // Rotate 1 degree
		buffer.rotate(Math.PI / 180);
			    
			  // Move registration point back to the top left corner of canvas
		buffer.translate(-bufferCanvas.width/2, -bufferCanvas.height/2);

		 setTimeout(rotate,10)
		
}