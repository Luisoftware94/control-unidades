require('dotenv').config();

const app = require('./app');
require('./database');


async function main(){
    // abrimos un puerto de comunicacion con el servidor async mediante la variable puerto creada en app
    await app.listen(app.get('port'));
    console.log('Servidor en puerto ' + app.get('port'));
}

// inicializamos la funcion principal
main();