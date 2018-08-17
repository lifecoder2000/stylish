const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentBasket = new Schema({
    userId : {type : String, required : true},
    products : {type : JSON, required : true},
    status : { type : String, default : "입금완료"}, // 배송 상태
    payment : { type : Boolean, default : true}, // 결제 구분
    date: {type: Date, default: Date.now}
}, {timestamps : true});

module.exports = mongoose.model('PaymentBasket', PaymentBasket);