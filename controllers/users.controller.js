const usersCtrl = {};
const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
    const { nombre, correo, contrasena, rol } = req.body;
    const usuario = await User.findOne({correo: correo});
    if(!usuario){
        const newUser = new User({
            nombre,
            correo,
            contrasena,
            rol
        });
        // creamos salt y el hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.contrasena, salt, (err, hash) => {
                if(err) throw err;
                newUser.contrasena = hash;
                newUser.save()
                    .then( user => {
                        jwt.sign(
                            {id: user.id},
                            config.get('jwtSecret'),
                            {expiresIn: 3600},
                            (err, token) => {
                                if(err) throw err;
                                res.json({token, msg: 'Usuario creado exitosamente!'});
                            }
                        );
                    })
            });
        });
    } else{
        res.status(400).json({msg: 'El correo ya se encuentra en uso', existe: true});
    }
});

router.post('/auth', (req, res) => {
    const { correo, contrasena } = req.body;
    User.findOne({correo: correo})
        .then(user => {
            if(!user) return res.status(400).json({msg: 'Este correo no se encuentra registrado', existe: false}); 
            // validando contrasena
            bcrypt.compare(contrasena, user.contrasena)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({msg: 'Contraseña incorrecta', existe: true});
                    jwt.sign(
                        {id: user.id},
                        config.get('jwtSecret'),
                        {expiresIn: 3600},
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    nombre: user.nombre,
                                    correo: user.correo,
                                    rol: user.rol
                                }
                            });
                        }
                    )
                });
        });
});

router.get('/auth/user', auth, (req, res) =>{
    User.findById(req.user.id)
        .select('-contrasena')
        .then(user => res.json(user));
});
module.exports = router;