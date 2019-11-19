var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionBetTypeSchema = new Schema({
    name: {type: String, required: false},
    bettype: {type: Schema.Types.ObjectId, ref: 'BetType', required: false},
});

module.exports = mongoose.model('OptionBetType', optionBetTypeSchema); 