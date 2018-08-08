const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Products = new Schema({
    name : {type : String, required : true},
    stock : {type : Number,default : 0},
    price : {type : Number, required : true},
    category : {type : JSON, required : true},
    purchaseAmount : {type : Number,default : 0}
}, {timestamps : true});

module.exports = mongoose.model('Products', Products);


