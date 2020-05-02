const Rol = require('../models/Rol');
const Unidad = require('../models/Unidad');
const { Router } = require('express');
const router = Router();

router.post('/', async (req, res) => {
    const { nombre, descripcion } = req.body;
    const newRol = new Rol({
        nombre,
        descripcion
    });
    await newRol.save();
    res.json({ message: 'Rol guardado!' });
});

router.get('/', async (req, res) => {
    const roles = await Rol.find().sort({nombre:1});
    res.json(roles);
});

router.get('/:id', async (req, res) => {
    const operador = await Rol.findById(req.params.id);
    res.json(operador);
});

router.put('/:id', async (req, res) => {
    const { nombre, descripcion } = req.body;
    await Rol.findByIdAndUpdate(req.params.id, {
        nombre,
        descripcion
    });
    res.json({ message: 'Rol actualizado!' });
});

router.delete(':/id', async (req, res) => {
    const unidadesRol = await Unidad.find({rol: req.params.id});
    unidadesRol.map(async unidad => {
        await Unidad.findByIdAndUpdate(unidad._id , {
            rol: ""
        });
    });
    await Rol.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rol eliminado' });
});

module.exports = router;