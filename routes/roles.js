const { Router } = require('express');
const router = Router();

const { createRol, getRol, getRoles, updateRol, deleteRol } = require('../controllers/roles.controller');

router.route('/')
    .get(getRoles)
    .post(createRol)

router.route('/:id')
    .get(getRol)
    .put(updateRol)
    .delete(deleteRol)

module.exports = router;