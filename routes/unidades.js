const { Router } = require('express');
const router = Router();

const { createUnidad, getUnidades, getUnidad, updateUnidad, deleteUnidad, getUnidadRol, getUnidadesPorRol } = require('../controllers/unidades.controller');

router.route('/')
    .get(getUnidades)
    .post(createUnidad)

router.route('/:id')
    .get(getUnidad)
    .put(updateUnidad)
    .delete(deleteUnidad)

router.route('/rol/:rol')
    .get(getUnidadRol)

    
router.route('/unidades/rol')
    .get(getUnidadesPorRol)

module.exports = router;