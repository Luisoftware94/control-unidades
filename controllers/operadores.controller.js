const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');

const Operador = require('../models/Operador');
const Unidad = require('../models/Unidad');

router.post('/', async (req, res) => {
    const { nombre, numEmpleado, telefono, estado, compania, numImss, numLicencia, tipoLicencia, vencimientoLicencia, medicinaPreventiva, vencimientoMedicinaPreventiva } = req.body;
    const operador = await Operador.findOne({numEmpleado: numEmpleado});
    if(!operador){
        if(req.files.fotografia){
            const urlFotografia = req.files.fotografia.path;
            const pathFotografia = urlFotografia.slice(7);
            const newOperador = new Operador({
                nombre, 
                numEmpleado, 
                telefono, 
                estado,
                pathFotografia,
                compania,
                numImss,
                numLicencia,
                tipoLicencia,
                vencimientoLicencia,
                medicinaPreventiva,
                vencimientoMedicinaPreventiva
            });
            await newOperador.save();
        } else{
            const newOperador = new Operador({
                nombre, 
                numEmpleado, 
                telefono, 
                estado,
                compania,
                numImss,
                numLicencia,
                tipoLicencia,
                vencimientoLicencia,
                medicinaPreventiva,
                vencimientoMedicinaPreventiva
            });
            await newOperador.save();
        }
        res.json({message: 'Operador guardado!', existe: false});
    } else{
        res.json({message: 'Ya existe el operador!', existe: true});
    }
});

router.get('/', async (req, res) => {
    const operadores = await Operador.find();
    res.json(operadores);
});

router.get('/no/asignados', async (req, res) => {
    const operadores = await Operador.find({asignado: false}).sort({nombre: 1});
    res.json(operadores);
});

router.get('/:id', async (req, res) => {
    const operador = await Operador.findById(req.params.id);
    res.json(operador);
});

router.put('/:id', async (req, res) => {
    const { nombre, numEmpleado, telefono, estado, compania, numImss, numLicencia, tipoLicencia, vencimientoLicencia, medicinaPreventiva, vencimientoMedicinaPreventiva } = req.body;
    if(req.files.fotografia){
        const urlFotografia = req.files.fotografia.path;
        const pathFotografia = urlFotografia.slice(7);
        await Operador.findByIdAndUpdate(req.params.id, {
            nombre,
            numEmpleado,
            telefono,
            estado,
            pathFotografia,
            compania,
            numImss,
            numLicencia,
            tipoLicencia,
            vencimientoLicencia,
            medicinaPreventiva,
            vencimientoMedicinaPreventiva
        });    
    } else{
        await Operador.findByIdAndUpdate(req.params.id, {
            nombre,
            numEmpleado,
            telefono,
            estado,
            compania,
            numImss,
            numLicencia,
            tipoLicencia,
            vencimientoLicencia,
            medicinaPreventiva,
            vencimientoMedicinaPreventiva
        });
    }
    res.json({message: 'Operador actualizado'});
});

router.put('/asignado/:id', async (req, res) => {
    await Operador.findByIdAndUpdate(req.params.id, {
        asignado: true,
        estado: 'Activo'
    });
    res.json({message: 'Operador asignado'});
});

router.put('/desasignado/:id', async (req, res) => {
    await Operador.findByIdAndUpdate(req.params.id, {
        asignado: false,
        estado: 'No asignado'
    });
    res.json({message: 'Operador desasignado'});
});

router.delete('/:id', async (req, res) => {
    const unidades = await Unidad.find(); 
    unidades.map(async unidad => {
        if(req.params.id === unidad.operador1){
            await Unidad.findByIdAndUpdate(unidad._id, {
                operador1: ""
            });
        }
        if(req.params.id === unidad.operador2){
            await Unidad.findByIdAndUpdate(unidad._id, {
                operador2: ""
            });
        }
    });
    await Operador.findByIdAndDelete(req.params.id);
    res.json({message: 'Operador eliminado'});

});

module.exports = router;