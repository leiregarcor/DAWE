'use strict'; // detectara errores de programacion

var cacheVersion = 3; // variables que vamos a necesitar
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
const offlineUrl = 'offline-page.html';

function createCacheBustedRequest(url){
  let request= new Request(url, {cache:'reload'});

  if ('cache' in request){ // si el navegador fuese moderno, con esto seria suficiente
    return request;
  }

  // para navegadores no-modernos, añadimos un parametro cachebust con la fecha actual como valor
  let bustedURL= new URL(url, self.location.href);
  bustedURL.search += (bustedURL.search ? '&' : '') + 'cachebust=' + Date.now();
  return request;
}

this.addEventListener('install', event => { // el evento “install” lo lanza el SW
  event.waitUntil( // bloqueamos la la instalacion hasta terminar de cachear elementos, si falla la instalacion fallara tambien

    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
        //todo lo que queremos offline
          './juego.js',
          offlineUrl
      ]);
    })
  );
});

this.addEventListener('fetch', event => {
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith( // respuesta que daremos
        // peticion al servidor, si hay conexion ira bien, si no (no hay conexion) devolvemos lo que tengamos cacheado
          fetch(createCacheBustedRequest(event.request.url)).catch(error => {
              // Return the offline page
              return caches.match(offlineUrl); // devolvemos lo cacheado
          })
    );
  }
  else{
        // si no es una peticion de una pagina HTML
        // si esta en cache (response) la devolvemos, si no usamos fetch (vamos a pedirlo online)
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
                        .then(function (response) {
                        return response || fetch(event.request);
                    })
            );
      }
});
