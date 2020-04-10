const { Schema, model } = require('mongoose');

const operadorSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    numEmpleado: {
        type: String,
        required: true
    },
    telefono: String,
    estado: String,
    pathFotografia: String,
    asignado: {
        type: Boolean,
        default: false
    }
});
module.exports = model('Operador', operadorSchema);