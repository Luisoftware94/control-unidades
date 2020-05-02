const { Router } = require('express');
const router = Router();
const Unidad = require('../models/Unidad');
const HistorialUnidad = require('../models/HistorialUnidad');
const Operador = require('../models/Operador');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    const unidades = await Unidad.find();
    res.json(unidades);
});

router.post('/', async (req, res) => {
    const { numUnidad, estado, operador1, operador2, rol, base, fechaAccidente, ubicacionAccidente } = req.body;
    const newUnidad = new Unidad({
        numUnidad,
        estado,
        operador1,
        operador2,
        rol,
        base,
        fechaAccidente,
        ubicacionAccidente
    });
    const unidad = await Unidad.findOne({numUnidad: numUnidad});
    if(!unidad){
        await newUnidad.save();
        const newHistorialUnidad = new HistorialUnidad({
            descripcion: 'Unidad creada',
            unidad: numUnidad
        });
        await newHistorialUnidad.save();
        res.json({ message: 'Unidad guardada!', existe: false });
    }else{
        res.json({ message: 'Ya existe esa unidad!', existe: true });
    }
});

router.get('/:id', async (req, res) => {
    const unidad = await Unidad.findById(req.params.id);
    res.json(unidad);
});

router.put('/:id', async (req, res) => {
    const { numUnidad, estado, operador1, operador2, rol, base, fechaAccidente, ubicacionAccidente } = req.body;
    await Unidad.findByIdAndUpdate(req.params.id , {
        numUnidad,
        estado,
        operador1,
        operador2,
        rol,
        base,
        fechaAccidente,
        ubicacionAccidente
    });
    res.json({ message: 'Unidad actualizada!' });
});

router.delete('/:id', async (req, res) => {
    const unidad = await Unidad.findById(req.params.id);
    if(unidad.operador1){
        await Operador.findByIdAndUpdate(unidad.operador1, {
            asignado: false,
            estado: 'No asignado'
        });
    }
    if(unidad.operador2){
        await Operador.findByIdAndUpdate(unidad.operador2, {
            asignado: false,
            estado: 'No asignado'
        });
    }
    await Unidad.findByIdAndDelete(req.params.id);
    await HistorialUnidad.find().deleteMany({unidad: unidad.numUnidad});
    res.json({ message: 'Unidad eliminada' });
});

router.get('/rol/:rol', async (req, res) => {
    const unidadesRol = await Unidad.find({rol: req.params.rol});
    res.json(unidadesRol);
});

router.get('/unidades/rol', async (req, res) => {
    const unidadesPorRol = await Unidad.find().sort({numUnidad: 1, rol: 1});
    res.json(unidadesPorRol);
});

module.exports = router;