const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingBasket = new Schema({
    userId : {type : String, required : true},
    productNamekey : {type : String, required : true},
    products : {type : JSON, required : true},
    status : { type : String, default : "입금완료"}, // 배송 상태
    payment : { type : Boolean, default : false} // 결제 구분
}, {timestamps : true});

module.exports = mongoose.model('ShoppingBasket', ShoppingBasket);