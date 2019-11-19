var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionTypeRelationSchema = new Schema({ 
    optionbettype: {type: Schema.Types.ObjectId, ref: 'OptionBetType', required:  [true, 'Error de validación. Es Obligatorio indicar la opcion.']}, 
    bettype: {type: Schema.Types.ObjectId, ref: 'BetType', required:  [true, 'Error de validación. Es Obligatorio el el tipo de apuesta asociada.']}
});

module.exports = mongoose.model('OptionTypeRelation', optionTypeRelationSchema); 