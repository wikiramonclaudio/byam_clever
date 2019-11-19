var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tableSubscriptionSchema = new Schema({ 
    table: {type: Schema.Types.ObjectId, ref: 'Table', required:  [true, 'Error de validación. Es Obligatorio indicar la mesa.']}, 
    player: {type: Schema.Types.ObjectId, ref: 'User', required:  [true, 'Error de validación. Es Obligatorio el usuario apostante.']}
});

module.exports = mongoose.model('TableSubscription', tableSubscriptionSchema); 