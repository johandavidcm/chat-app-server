const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {
    // verificar auth
    const [ valido, uid ] = comprobarJWT(client.handshake.headers['x-token']);
    if(!valido){
        return client.disconnect();
    }
    console.log('Cliente autenticado');
    usuarioConectado(uid);

    // Ingresar al usuario a una sala en particular
    // Sala global, client.id, uid usuario
    client.join( uid );

    // Esuchar del cliente el mensaje
    client.on('mensaje-personal', async(payload) => {
        await grabarMensaje( payload );
        io.to( payload.para ).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
        console.log('Cliente desconectado');
        
    });
});
