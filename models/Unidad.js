const { Schema, model } = require('mongoose');

const unidadSchema = new Schema({
    numUnidad: {
        type: String,
        required: true
    },
    estado: String,
    operador1: String,
    operador2: String,
    rol: String
});
module.exports = model('Unidad', unidadSchema);