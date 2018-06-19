const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    id : { type : String, required : true },
    pw : { type : String, required : true }
}, { timestamps: true });

module.exports = mongoose.model('Informations', applicationSchema);