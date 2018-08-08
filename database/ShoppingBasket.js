const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingBasket = new Schema({
    userId : {type : String, required : true},
    products : {type : JSON, required : true}
}, {timestamps : true});

module.exports = mongoose.model('ShoppingBasket', ShoppingBasket);