const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questionAnswer = new Schema({
    writer : {type : String, required : true},
    text : {type : String, required : true},
    status : {type : String, required : true}
}, { timestamps: true });

module.exports = mongoose.model('QuestionAnswer', questionAnswer);