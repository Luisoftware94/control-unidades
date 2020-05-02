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
    },
    compania: String,
    numImss: String,
    numLicencia: String,
    tipoLicencia: String,
    vencimientoLicencia: Date,
    medicinaPreventiva: String,
    vencimientoMedicinaPreventiva: Date
});
module.exports = model('Operador', operadorSchema);