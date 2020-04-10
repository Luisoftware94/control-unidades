const rolesCtrl = {};

const Rol = require('../models/Rol');
const Unidad = require('../models/Unidad');

rolesCtrl.createRol = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const newRol = new Rol({
        nombre,
        descripcion
    });
    await newRol.save();
    res.json({ message: 'Rol guardado!' });
}

rolesCtrl.getRoles = async (req, res) => {
    const roles = await Rol.find().sort({nombre:1});
    res.json(roles);
}

rolesCtrl.getRol = async (req, res) => {
    const operador = await Rol.findById(req.params.id);
    res.json(operador);
}

rolesCtrl.updateRol = async (req, res) => {
    const { nombre, descripcion } = req.body;
    await Rol.findByIdAndUpdate(req.params.id, {
        nombre,
        descripcion
    });
    res.json({ message: 'Rol actualizado!' });
}

rolesCtrl.deleteRol = async (req, res) => {
    const unidadesRol = await Unidad.find({rol: req.params.id});
    unidadesRol.map(async unidad => {
        await Unidad.findByIdAndUpdate(unidad._id , {
            rol: ""
        });
    });
    await Rol.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rol eliminado' });
}

module.exports = rolesCtrl;