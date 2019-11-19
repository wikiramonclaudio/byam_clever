var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tableSchema = new Schema({
    chat: {type: Boolean, required: false},
    userslimit: {type: String, required: false},
    type: {type: String, required: false},    
    betamount: {type: String, required: [true, 'La cantidad de la apuesta es obligatoria.']},
    totalamount: {type: String, required: false},
    closed: {type: Boolean, required: false},
    published: {type: Boolean, required: false},
    activeusers: {type: Number, required: false},
    name: {type: String, required: false},
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: false},
    winner: {type: Schema.Types.ObjectId, ref: 'User', required: false}
});

module.exports = mongoose.model('Table', tableSchema); 