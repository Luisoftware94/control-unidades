const { Router } = require('express');
const router = Router();

const { createOperador, getOperadores, getOperador, updateOperador, deleteOperador, updateOperadorAsignado, getOperadoresSinAsignar, updateOperadorDesasignado } = require('../controllers/operadores.controller');

router.route('/')
    .get(getOperadores)
    .post(createOperador)

router.route('/:id')
    .get(getOperador)
    .put(updateOperador)
    .delete(deleteOperador)

router.route('/asignado/:id')
    .put(updateOperadorAsignado)

router.route('/desasignado/:id')
    .put(updateOperadorDesasignado)

router.route('/no/asignados')
    .get(getOperadoresSinAsignar)


module.exports = router;