var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
    finished: {type: Boolean, required: false, default: false},
    tournament: {type: String, required: false},
    localteam: {type: String, required: [true, 'El equipo local es obligatorio.']},
    awayteam: {type: String, required: [true, 'El equipo visitante es obligatorio.']},
    when : { type : Date, required: [true, 'La fecha del evento es obligatoria.'] },
    where : { type : String, required: [true, 'El lugar del evento es obligatorio.'] },    
    // bettype: {type: Schema.Types.ObjectId, ref: 'BetType', required:  [true, 'Error de validación. Es Obligatorio el el tipo de apuesta asociada.']},
    result: {type: Schema.Types.ObjectId, ref: 'OptionBetType', required: false}
});

module.exports = mongoose.model('Match', matchSchema); 