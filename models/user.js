var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validation');

var Schema = mongoose.Schema;

var roles = {
    values: [
        'ROLE_ADMIN',
        'USER_ROLE',
    ],
    message: '{VALUE} no es un rol permitido.'
}

var userSchema = new Schema({
    name: {type: String, required: [true, 'El nombre es obligatorio']},
    email: {type: String, unique: true, required: [true, 'El email es obligatorio']},
    password: {type: String,  required: [true, 'El password es obligatorio']},
    image: {type: String,  required: false},
    role: {type: String,  required: true, default: 'USER_ROLE', enum: roles},
    google: {type: Boolean, default: false},
    money: {type: Number, default: 0}
}, {timestamps: true});

// userSchema.plugin( uniqueValidator, { message: '{PATH} debe ser único'} );

module.exports = mongoose.model('User', userSchema);

