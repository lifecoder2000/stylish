const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Products = new Schema({
    name : {type : String, required : true},
    stock : {type : Number,default : 0},
    price : {type : Number, required : true},
    highCategoryFilter : {type : String, required : true},
    lowCategoryFilter : {type : String, required : true},
    category : {type : JSON, required : true},
    description : {type : String, required : true},
    purchaseAmount : {type : Number,default : 0}
}, {timestamps : true});

module.exports = mongoose.model('Products', Products);


