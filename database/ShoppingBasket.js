const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingBasket = new Schema({
    userId : {type : String, required : true},
    productNameKey : {type : String, required : true},
    products : {type : JSON, required : true},
    highCategoryFilter : {type : String, required : true},
    lowCategoryFilter : {type : String, required : true},
    description : {type : String},

    productPriceKey : {type : Number },
    productHighKey : {type : String },
    productWeightKey : {type : String },
    productColorKey : {type : String },
    productCountKey : {type : Number },
    productSizeKey : {type : Number },

    status : { type : String, default : "입금완료"}, // 배송 상태
}, {timestamps : true});

module.exports = mongoose.model('ShoppingBasket', ShoppingBasket);