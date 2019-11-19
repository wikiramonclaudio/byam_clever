var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchTypeRelationSchema = new Schema({ 
    match: {type: Schema.Types.ObjectId, ref: 'Match', required:  [true, 'Error de validación. Es Obligatorio indicar el partido.']}, 
    table: {type: Schema.Types.ObjectId, ref: 'Table', required:  [true, 'Error de validación. Es Obligatorio indicar la mesa.']}, 
    bettype: {type: Schema.Types.ObjectId, ref: 'BetType', required:  [true, 'Error de validación. Es Obligatorio el el tipo de apuesta asociada.']}
});

module.exports = mongoose.model('MatchTypeRelation', matchTypeRelationSchema);