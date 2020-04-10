const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/databasetest';

// establecemos la conexion con mongoose
mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const connection = mongoose.connection;

// escuchamos en consola
connection.once('open', () => {
    console.log('Conectado a la base de datos');
});