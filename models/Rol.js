const { Schema, model } = require('mongoose');

const rolSchema = new Schema({
    nombre: String,
    descripcion: String
});

module.exports = model('Rol', rolSchema);