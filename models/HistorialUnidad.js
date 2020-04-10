const { Schema, model } = require('mongoose');

const historialUnidadSchema = new Schema({
    descripcion: String,
    fecha: {
        type: Date,
        default: Date.now
    },
    unidad: String
});
module.exports = model('HistorialUnidad', historialUnidadSchema);