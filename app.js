const express = require('express');
const app = express();
const cors = require('cors');
const formidable = require('express-form-data');
const path = require('path');

// seteamos el puerto
app.set('port', process.env.PORT || 4000);
app.use(express.static(__dirname + '/images'));

// ***** MIDLEWARES
app.use(cors());
app.use(express.json());

app.use(formidable.parse({ keepExtensions: true, uploadDir:"images" }));

//****   routes
app.use('/api/operadores', require('./routes/operadores'));
app.use('/api/unidades', require('./routes/unidades'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/historialunidades', require('./routes/historialUnidades'));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
    });
}
module.exports = app;