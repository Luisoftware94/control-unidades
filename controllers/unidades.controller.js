const unidadesCtrl = {};

const Unidad = require('../models/Unidad');
const HistorialUnidad = require('../models/HistorialUnidad');
const Operador = require('../models/Operador');

unidadesCtrl.getUnidades = async (req, res) => {
    const unidades = await Unidad.find();
    res.json(unidades);
}

unidadesCtrl.createUnidad = async (req, res) => {
    const { numUnidad, estado, operador1, operador2, rol } = req.body;
    const newUnidad = new Unidad({
        numUnidad,
        estado,
        operador1,
        operador2,
        rol
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
}

unidadesCtrl.getUnidad = async (req, res) => {
    const unidad = await Unidad.findById(req.params.id);
    res.json(unidad);
}

unidadesCtrl.updateUnidad = async (req, res) => {
    const { numUnidad, estado, operador1, operador2, rol } = req.body;
    await Unidad.findByIdAndUpdate(req.params.id , {
        numUnidad,
        estado,
        operador1,
        operador2,
        rol
    });
    res.json({ message: 'Unidad actualizada!' });
}
unidadesCtrl.deleteUnidad = async (req, res) => {
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
}

unidadesCtrl.getUnidadRol = async (req, res) => {
    const unidadesRol = await Unidad.find({rol: req.params.rol});
    res.json(unidadesRol);
}

unidadesCtrl.getUnidadesPorRol = async (req, res) => {
    const unidadesPorRol = await Unidad.find().sort({numUnidad: 1, rol: 1});
    res.json(unidadesPorRol);
}

module.exports = unidadesCtrl;