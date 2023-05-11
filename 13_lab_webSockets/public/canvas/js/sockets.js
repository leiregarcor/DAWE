const serverURL = window.location.hostname + ":" +  window.location.port;

export function setupSockets(){

    const socket = io.connect(serverURL, {secure: true});
    // register phone connection
    socket.emit('desktop-connect');

    // recibimos el movimiento del movil //TODO no funciona no se como hacerlo
    socket.on("phone-move", function () {
        console.log('se mueve');  

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
       
    });

    
}
