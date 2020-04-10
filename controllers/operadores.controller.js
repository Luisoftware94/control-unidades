const operadoresCtrl = {};

const Operador = require('../models/Operador');
const Unidad = require('../models/Unidad');
operadoresCtrl.createOperador = async (req, res) => {
    const { nombre, numEmpleado, telefono, estado } = req.body;
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
                pathFotografia
            });
            await newOperador.save();
        } else{
            const newOperador = new Operador({
                nombre, 
                numEmpleado, 
                telefono, 
                estado
            });
            await newOperador.save();
        }
        res.json({message: 'Operador guardado!', existe: false});
    } else{
        res.json({message: 'Ya existe el operador!', existe: true});
    }
}

operadoresCtrl.getOperadores = async (req, res) => {
    const operadores = await Operador.find();
    res.json(operadores);
}
operadoresCtrl.getOperadoresSinAsignar = async (req, res) => {
    const operadores = await Operador.find({asignado: false}).sort({nombre: 1});
    res.json(operadores);
}
operadoresCtrl.getOperador = async (req, res) => {
    const operador = await Operador.findById(req.params.id);
    res.json(operador);
}

operadoresCtrl.updateOperador = async (req, res) => {
    const { nombre, numEmpleado, telefono, estado } = req.body;
    if(req.files.fotografia){
        const urlFotografia = req.files.fotografia.path;
        const pathFotografia = urlFotografia.slice(7);
        await Operador.findByIdAndUpdate(req.params.id, {
            nombre,
            numEmpleado,
            telefono,
            estado,
            pathFotografia
        });    
    } else{
        await Operador.findByIdAndUpdate(req.params.id, {
            nombre,
            numEmpleado,
            telefono,
            estado
        });
    }
    res.json({message: 'Operador actualizado'});
}

operadoresCtrl.updateOperadorAsignado = async (req, res) => {
    await Operador.findByIdAndUpdate(req.params.id, {
        asignado: true,
        estado: 'Activo'
    });
    res.json({message: 'Operador asignado'});
}

operadoresCtrl.updateOperadorDesasignado = async (req, res) => {
    await Operador.findByIdAndUpdate(req.params.id, {
        asignado: false,
        estado: 'No asignado'
    });
    res.json({message: 'Operador desasignado'});
}

operadoresCtrl.deleteOperador = async (req, res) => {
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

}

module.exports = operadoresCtrl;