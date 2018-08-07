const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const information = new Schema({
    name : { type:String, required : true },
    id : { type : String, required : true },
    pw : { type : String, required : true },
    phone_number : { type : String, required : true },
    email : { type : String },
    address : { type: String, required : true },
    token : {type : String}
}, { timestamps: true });

module.exports = mongoose.model('Informations', information);