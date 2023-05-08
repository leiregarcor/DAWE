const serverURL = window.location.hostname + ":" +  window.location.port;

window.onload = function(){

    const socket = io.connect(serverURL, {secure: true});
    // register phone connection
    socket.emit('phone-connect');

    socket.on('crash', function() {
        navigator.vibrate(500);
    });

    var update = function(id, value) {
        if (value) {
            value = Math.floor(value);
            var rotate = 'rotate' + id.toUpperCase() + '(' + (id === 'x' ? -value : value )+ 'deg)';

            id = '#' + id;
            $(id).html(value + '&deg;');

            id += '-icon';
            $(id).css('transform', rotate);
            $(id).css('-webkit-transform', rotate);
        }
    };

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(e) {

            socket.emit('phone-move', { alpha: e.alpha, beta: e.beta, gamma: e.gamma});

            $('#frame').text((e.absolute ? 'Earth' : 'arbitrary') + ' coordinates frame');

            update('x', e.beta);
            update('y', e.gamma);
            update('z', e.alpha ? 360 - e.alpha : null);
        });
    }
};
