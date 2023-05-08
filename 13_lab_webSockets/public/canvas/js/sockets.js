const serverURL = window.location.hostname + ":" +  window.location.port;

export function setupSockets(){

    const socket = io.connect(serverURL, {secure: true});
    // register phone connection
    socket.emit('desktop-connect');
    
}
