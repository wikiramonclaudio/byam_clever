var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var betTypeSchema = new Schema({
    name: {type: String, required: false},
    option1: {type: Schema.Types.ObjectId, ref: 'OptionBetType', required:  false},
    option2: {type: Schema.Types.ObjectId, ref: 'OptionBetType', required:  false}, 
    option3: {type: Schema.Types.ObjectId, ref: 'OptionBetType', required:  false}, 
    sport: {type: String, required: false}
});

module.exports = mongoose.model('BetType', betTypeSchema); 