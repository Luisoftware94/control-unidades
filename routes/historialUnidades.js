const { Router } = require('express');
const router = Router();

const { getHistorialUnidad, postHistorialUnidad } = require('../controllers/historialUnidades.controller');

router.route('/:unidad')
    .get(getHistorialUnidad)
    .post(postHistorialUnidad)

module.exports = router;