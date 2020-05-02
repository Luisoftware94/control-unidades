const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // probamos el token
    if(!token) return res.status(401).json({msg: 'No autorizado, no token'});

    try{
        // verificamos el token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded;
        next();
    } catch(e){
        res.status(400).json({msg: 'El token no es valido'});
    }
}

module.exports = auth;