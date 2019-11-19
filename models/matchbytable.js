var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchbytableSchema = new Schema({
    // chat: {type: Boolean, required: false, default: Date.now},
    table: {type: Schema.Types.ObjectId, ref: 'Table', required:  [true, 'Error de validación. Es Obligatorio indicar la mesa.']}, 
    match: {type: Schema.Types.ObjectId, ref: 'Match', required:  [true, 'Error de validación. Es Obligatorio el partido para relacionarlo con la mesa.']}
});

module.exports = mongoose.model('Matchbytable', matchbytableSchema); 