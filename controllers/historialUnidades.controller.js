const historialUnidadesCtrl = {};

const HistorialUnidad = require('../models/HistorialUnidad');

historialUnidadesCtrl.getHistorialUnidad = async (req, res) => {
    const historial = await HistorialUnidad.find({unidad: req.params.unidad}).sort({fecha: -1});
    res.json(historial);
}

historialUnidadesCtrl.createHistorialUnidad = async (req, res) => {
    const {descripcion, unidad} = req.body;
    const newHistorial = new HistorialUnidad({
        descripcion,
        unidad
    });
    await newHistorial.save();
    res.json({message: 'Historial actualizado!'});
}

historialUnidadesCtrl.postHistorialUnidad = async (req, res) => {
    const {descripcion} = req.body;
    const newHistorial = new HistorialUnidad({
        descripcion,
        unidad: req.params.unidad
    });
    await newHistorial.save();
    res.json({message: 'Historial actualizado!'});   
}

module.exports = historialUnidadesCtrl;