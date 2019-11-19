var CONFIG = require('../config/config');
var jwt = require('jsonwebtoken');


exports.ensureAuth = (req, res, next)=>{
    var token = req.query.token;
    console.log('token');
    console.log(token);
    jwt.verify(token, CONFIG.SEED, (err, decoded)=>{
        if(err)
            return res.status(401).send({message: 'Token incorrecto', error: err, success: false});
        else{
            req.user = decoded.user;
            next();
                
        }
            
    });
};

exports.ensureAdmin = (req, res, next)=>{
    var user = req.user;
    console.log(req);
    if(user.role == 'ROLE_ADMIN'){
        next();
        return;
    }else{
        return res.status(401).send({message: 'Token incorrecto -  No admin', error: err, success: false});
    }
};

exports.ensureAdminOrSameUser = (req, res, next)=>{
    var user = req.user;
    var id = req.params.id;
    if(user.role == 'ROLE_ADMIN' || id == req.user._id){
        next();
        return;
    }else{
        return res.status(401).send({message: 'Token incorrecto -  No admin', error: err, success: false});
    }
};