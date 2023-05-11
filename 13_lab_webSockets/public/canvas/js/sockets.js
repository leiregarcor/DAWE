const serverURL = window.location.hostname + ":" +  window.location.port;
var socket = null;

export function setupSockets(){

    socket = io.connect(serverURL, {secure: true});
    // register phone connection
    socket.emit('desktop-connect');

    // recibimos el movimiento del movil //TODO no funciona no se como hacerlo
    socket.on("phone-move", function (data) {
        console.log('se mueve'); 
        
        if (data >= 0) { //angulo + derecha
            window.dispatchEvent(
                new KeyboardEvent('keydown',
                    {key: 'ArrowRight'
                })
            );
            // Y luego que dejamos de pisarla (levantamos el dedo)
            window.dispatchEvent(
                new KeyboardEvent('keyup',
                    {key: 'ArrowRight'
                })
            );
        } else { //angulo - izquierda
            window.dispatchEvent(
                new KeyboardEvent('keydown',
                    {key: 'ArrowLeft'
                })
            );
            // Y luego que dejamos de pisarla (levantamos el dedo)
            window.dispatchEvent(
                new KeyboardEvent('keyup',
                    {key: 'ArrowLeft'
                })
            );            
        }       
    });

    
}

export function crash(){
    socket.emit('crash');
}
