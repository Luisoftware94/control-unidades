const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    }
});
module.exports = model('User', userSchema);