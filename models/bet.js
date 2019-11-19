var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var betSchema = new Schema({    
    table: {type: Schema.Types.ObjectId, ref: 'Table', required:  [true, 'Obligatorio indicar la mesa']},   
    owner:{ type: Schema.Types.ObjectId, ref: 'User', required:  [true, 'Obligatorio indicar el apostante']}     
});

module.exports = mongoose.model('Bet', betSchema); 