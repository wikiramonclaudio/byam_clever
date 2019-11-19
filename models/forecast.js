var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var forecastSchema = new Schema({    
    match: {type: Schema.Types.ObjectId, ref: 'Match', required:  [true, 'Obligatorio indicar el partido']}, 
    bettype: {type: Schema.Types.ObjectId, ref: 'BetType', required:  [true, 'Obligatorio indicar el tipo de apuesta']}, 
    choice: {type: Schema.Types.ObjectId, ref: 'OptionBetType', required:  [true, 'Obligatorio indicar el pronostico/eleccion']},   
    winnerchoice: {type: Schema.Types.ObjectId, ref: 'OptionBetType', required:  false},   
    finished: {type: String, required:  false},   
    bet:{ type: Schema.Types.ObjectId, ref: 'Bet', required:  [true, 'Obligatorio indicar la apuesta en al que ira el pronostico']},   
});

module.exports = mongoose.model('Forecast', forecastSchema); 