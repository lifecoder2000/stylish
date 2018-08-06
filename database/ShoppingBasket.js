const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ShoppingBasket = new Schema({
    productsName : {type : String, required : true}, // 상품 이름
    productsNum : {type : Number, required : true, default : 0}, // 상품 갯수
    productsPrice : {type : Number, required : true, default : 0}, // 상품 가격
    totalPrice : {type : Number, required : true, default : 0}, // 상품 총합 가격

}, { timestamps: true });