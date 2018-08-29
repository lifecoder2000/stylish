const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let questionAnswer = new Schema({
    writer : {type : String, required : true},
    title : {type : String, required : true},
    text : {type : String, required : true},
    count : {type : Number, required : true, default : 0},
    answer : {type : String, required : true},
    status : {type : Boolean, required : true},
    date: {type: Date, default: Date.now},
    answer : {type : String}
}, { timestamps: true });

module.exports = mongoose.model('QuestionAnswer', questionAnswer);
