const express = require('express');
const router = express.Router();
const Informations = require('../database/Informations');
const ShoppingBasket = require('../database/ShoppingBasket');
const Products = require('../database/Products');

/* 기본 페이지 랜더링 */
router.get('/', async(req, res) => {
    let findUserBasket = await ShoppingBasket.find({userId : req.session.user_id});
    let totalPrice = 0;
    let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
    for(let i in findUserBasket){ totalPrice += (findUserBasket[i].products.productPrice * findUserBasket[i].productCountKey); }
    let products = await Products.find();
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
    else{ return res.render('index', {user_id : req.session.user_id, product: products, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
});

router.get('/product', async(req, res) => {
    let findUserBasket = await ShoppingBasket.find({userId : req.session.user_id});
    let totalPrice = 0;
    let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
    for(let i in findUserBasket){ totalPrice += (findUserBasket[i].products.productPrice * findUserBasket[i].productCountKey); }
    if(req.param('clothes') == "shirt"){
        let findProducts = await Products.find({highCategoryFilter : "shirt"});
        return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : "shirt", userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }
    if(req.param('clothes') == "pants"){
        let findProducts = await Products.find({highCategoryFilter : "pants"});
        return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : "pants", userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }
    if(req.param('clothes') == "bag"){
        let findProducts = await Products.find({highCategoryFilter : "bag"});
        return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : "bag", userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }
    if(req.param('clothes') == "shoes"){
        let findProducts = await Products.find({highCategoryFilter : "shoes"});
        return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : "shoes", userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }

    /* 카테고리에서 4가지 필터 */
    if((typeof req.param('clothesName')) != 'undefined' && req.param('sorting') == "DefaultSorting"){
        let findProducts = await Products.find({highCategoryFilter : req.param('clothesName')});
        return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : req.param('clothesName'), userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }
    if((typeof req.param('clothesName')) != 'undefined' && req.param('sorting') == "Popularity"){
        let findProducts = await Products.find({highCategoryFilter : req.param('clothesName')}).sort({purchaseAmount:-1});
        return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : req.param('clothesName'), userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }
    if((typeof req.param('clothesName')) != 'undefined' && req.param('sorting') == "Price_lowtohigh"){
        let findProducts = await Products.find({highCategoryFilter : req.param('clothesName')}).sort({price:1});
        return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : req.param('clothesName'), userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }
    if((typeof req.param('clothesName')) != 'undefined' && req.param('sorting') == "Price_hightolow"){
        let findProducts = await Products.find({highCategoryFilter : req.param('clothesName')}).sort({price:-1});
        return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : req.param('clothesName'), userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }
    
    
    if(req.param('sorting') == "DefaultSorting"){
        let products = await Products.find();
        if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
        else{ return res.render('product', {user_id : req.session.user_id, products : products, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
    }
    else if(req.param('sorting') == "Popularity"){
        let products = await Products.find().sort({purchaseAmount:-1});
        return res.render('product', {user_id : req.session.user_id, products : products, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }
    else if(req.param('sorting') == "Price_lowtohigh"){
        let products = await Products.find().sort({price:1});
        return res.render('product', {user_id : req.session.user_id, products : products, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }
    else if(req.param('sorting') == "Price_hightolow"){
        let products = await Products.find().sort({price:-1});
        return res.render('product', {user_id : req.session.user_id, products : products, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
    }else{
        let products = await Products.find();
        if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
        else{ return res.render('product', {user_id : req.session.user_id, products : products, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
    }
});

router.post('/product', async(req, res) => {
    if(req.body.sortName == "DefaultSorting"){
        if( (typeof req.body.clothes === 'undefined') ) {
            return res.send({result : true, path : `/product?sorting=DefaultSorting`})
        }else{    
           return res.send({result : true, path : `/product?sorting=DefaultSorting&clothesName=${req.body.clothes}`});
        }
    }
    if(req.body.sortName == "Popularity"){
        if( (typeof req.body.clothes === 'undefined') ){
            return res.send({result : true, path : `/product?sorting=Popularity`});
        }else{
            return res.send({result : true, path : `/product?sorting=Popularity&clothesName=${req.body.clothes}`});
        }
    }
    if(req.body.sortName == "Price_lowtohigh"){
        if( (typeof req.body.clothes === 'undefined') ){
            return res.send({result : true, path : `/product?&sorting=Price_lowtohigh`});
        }else{
            return res.send({result : true, path : `/product?sorting=Price_lowtohigh&clothesName=${req.body.clothes}`});
        }
    }
    if(req.body.sortName == "Price_hightolow"){
        if( (typeof req.body.clothes === 'undefined') ){
            return res.send({result : true, path : `/product?&sorting=Price_hightolow`});
        }else{
            return res.send({result : true, path : `/product?sorting=Price_hightolow&clothesName=${req.body.clothes}`});
        }
    }
});

router.get('/product-detail', async(req, res) => {
    let findUserBasket = await ShoppingBasket.find({userId : req.session.user_id});
    let totalPrice = 0;
    let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
    for(let i in findUserBasket){ totalPrice += (findUserBasket[i].products.productPrice * findUserBasket[i].productCountKey); }
    let products = await Products.find();
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
    else{ return res.render('product-detail', { user_id : req.session.user_id, products : products, productName : req.param('name'), productPrice : req.param('price'), userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount, highCategoryFilter : req.param('highCategoryFilter'), lowCategoryFilter : req.param('lowCategoryFilter'), description : req.param('description')}); }
});

router.get('/cart', async(req, res) => {
    let findUserBasket = await ShoppingBasket.find({userId : req.session.user_id});
    let totalPrice = 0;
    let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
    for(let i in findUserBasket){ totalPrice += (findUserBasket[i].products.productPrice * findUserBasket[i].productCountKey); }
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); } //totalPrice 
    else if(req.session.is_user_login){ return res.render('cart', {user_id : req.session.user_id, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
    else {return res.send(`<script>alert('Login please.');location.href='/';</script>`);}
});

router.post('/view', (req,res) =>{
    if(req.body.productSize == "Choose an option" || req.body.productColor == "Choose an option" || req.body.productHigh == "Choose an option" || req.body.productWeight == "Choose an option"){
        res.send(`<script>alert('옵션을 제대로 선택해주세요');</script>`);
    }else{
        if(req.body.highCategoryFilter == "shirt" || req.body.highCategoryFilter == "pants"){
            res.send({ result : true, path : `/view?high=${req.body.productHigh}&weight=${req.body.productWeight}&color=${req.body.productColor}&highCategoryFilter=${req.body.highCategoryFilter}&lowCategoryFilter=${req.body.lowCategoryFilter}`});
        }else if(req.body.highCategoryFilter == "shoes"){
            res.send({ result : true, path : `/view?size=${req.body.productSize}&color=${req.body.productColor}&highCategoryFilter=${req.body.highCategoryFilter}&lowCategoryFilter=${req.body.lowCategoryFilter}`});
        }else{ 
            res.send({ result : true, path : `/view?color=${req.body.productColor}&highCategoryFilter=${req.body.highCategoryFilter}&lowCategoryFilter=${req.body.lowCategoryFilter}`});
        }
    }
});

router.get('/view', (req,res) => {
    res.render('viewModel', { highCategoryFilter : req.param('highCategoryFilter'), lowCategoryFilter : req.param('lowCategoryFilter'), high : req.param('high'), weight : req.param('weight'), size : req.param('size'), color : req.param('color') });
});

router.get('/about', async(req, res) => {
    let findUserBasket = await ShoppingBasket.find({userId : req.session.user_id});
    let totalPrice = 0;
    let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
    for(let i in findUserBasket){ totalPrice += (findUserBasket[i].products.productPrice * findUserBasket[i].productCountKey); }
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
    else{ return res.render('about', {user_id : req.session.user_id, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
});

router.get('/contact', async(req, res) => {
    let findUserBasket = await ShoppingBasket.find({userId : req.session.user_id});
    let totalPrice = 0;
    let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
    for(let i in findUserBasket){ totalPrice += (findUserBasket[i].products.productPrice * findUserBasket[i].productCountKey); }
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
    else{ return res.render('contact', {user_id : req.session.user_id, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
});

router.get('/customerCenter', (req, res) => {
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
    else{ return res.render('customerCenter'); }
});

/* 회원가입 */
router.get('/join', (req, res) => {
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
    else{ return res.redirect('/join.html'); }
});

router.post('/join', async(req, res) => {
    if(await Informations.findOne({id:req.body.id, pw:req.body.pw}).exec()){ return res.send(`<script>alert('아이디 또는 패스워드가 존재합니다.');location.href='/join';</script>`); }
    else{
        await Informations.create({
            name : req.body.name,
            id : req.body.id,
            pw : req.body.pw,
            phone_number : req.body.code+'-'+req.body.number2+'-'+req.body.number3,
            email : req.body.email+'@'+req.body.domain,
            address : req.body.address,
            token : ''
        });
        return res.send(`<script>alert('회원가입 완료:)');location.href='/';</script>`);
    }
});

/* 로그인, 로그아웃 */
router.get('/login', (req, res) => {
    if(req.session.is_user_login == true){ return res.send(`<script>alert('이미 로그인 되어있습니다.');location.href='/';</script>`); }
    else{ return res.redirect('/login.html'); }
});

router.post('/login', async(req, res) => {
    if(await Informations.findOne({id:req.body.id, pw:req.body.pw}).exec()){ 
        req.session.is_user_login = true;
        req.session.user_id = req.body.id;
        res.send(`<script>alert('${req.body.id}님 stylish에 오신것을 환영합니다.');location.href='/';</script>`);
    }
    else{ return res.send(`<script>alert('아이디 또는 패스워드가 잘못되었습니다.');location.href='/';</script>`); }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    return res.send(`<script>alert('로그아웃 되었습니다.');location.href='/';</script>`);
});

/* 카트 추가 */
router.post('/cart', async(req, res) => {
    // let findProduct = await Products.findOne({ name : req.body.productName });
    if(req.body.productSizeKey == "Choose an option" || req.body.productColorKey == "Choose an option" || req.body.productWeightKey == "Choose an option" || req.body.productHighKey == "Choose an option"){ // 기본 Choose an option은 옵션으로 선택 불가
        return res.send(`<script>alert('옵션을 모두 선택해주세요 !');location.href='/product-detail?name=${req.body.productNameKey}&price=${req.body.productPriceKey}&highCategoryFilter=${req.body.highCategoryFilter}&lowCategoryFilter=${req.body.lowCategoryFilter}&description=${req.body.description}';</script>`);
        // return res.send({ result : true, path : `/product-detail?name=${findProduct.name}&price=${findProduct.price}`});
    }else{
        try{ 
            if(req.body.highCategoryFilter == "shirt" || req.body.highCategoryFilter == "pants"){ // 셔츠,바지 중복 체크
                let count = 0;
                let overlapShoppingBasket = await ShoppingBasket.findOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productHighKey : req.body.productHighKey, productWeightKey : req.body.productWeightKey, productColorKey : req.body.productColorKey});
                if(overlapShoppingBasket){
                    let resultCount = Number(req.body.productCountKey) + overlapShoppingBasket.productCountKey;
                    await ShoppingBasket.updateOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productHighKey : req.body.productHighKey, productWeightKey : req.body.productWeightKey, productColorKey : req.body.productColorKey},{ productCountKey : resultCount});
                }else{
                    await ShoppingBasket.create({
                        userId : req.session.user_id,
                        productNameKey : req.body.productNameKey,
                        highCategoryFilter : req.body.highCategoryFilter,
                        lowCategoryFilter : req.body.lowCategoryFilter,
                        description : req.body.description,
            
                        productPriceKey : req.body.productPriceKey,
                        productHighKey : req.body.productHighKey,
                        productWeightKey : req.body.productWeightKey,
                        productColorKey : req.body.productColorKey,
                        productCountKey : req.body.productCountKey,
                        productSizeKey : req.body.productSizeKey,
            
                        products : {
                            productName : req.body.productNameKey,
                            productPrice : req.body.productPriceKey,
                            productHigh : req.body.productHighKey,
                            productWeight : req.body.productWeightKey,
                            productColor : req.body.productColorKey,
                            productCount : req.body.productCountKey,
                            productSize : req.body.productSizeKey
                        }    
                    });
                }
            }else if(req.body.highCategoryFilter == "shoes"){ // 신발 중복 체크
                let count = 0;
                let overlapShoppingBasket = await ShoppingBasket.findOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productSizeKey : req.body.productSizeKey, productColorKey : req.body.productColorKey});
                if(overlapShoppingBasket){
                    let resultCount = Number(req.body.productCountKey) + overlapShoppingBasket.productCountKey;
                    await ShoppingBasket.updateOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productSizeKey : req.body.productSizeKey, productColorKey : req.body.productColorKey},{ productCountKey : resultCount});
                }else{
                    await ShoppingBasket.create({
                        userId : req.session.user_id,
                        productNameKey : req.body.productNameKey,
                        highCategoryFilter : req.body.highCategoryFilter,
                        lowCategoryFilter : req.body.lowCategoryFilter,
                        description : req.body.description,
            
                        productPriceKey : req.body.productPriceKey,
                        productHighKey : req.body.productHighKey,
                        productWeightKey : req.body.productWeightKey,
                        productColorKey : req.body.productColorKey,
                        productCountKey : req.body.productCountKey,
                        productSizeKey : req.body.productSizeKey,
            
                        products : {
                            productName : req.body.productNameKey,
                            productPrice : req.body.productPriceKey,
                            productHigh : req.body.productHighKey,
                            productWeight : req.body.productWeightKey,
                            productColor : req.body.productColorKey,
                            productCount : req.body.productCountKey,
                            productSize : req.body.productSizeKey
                        }    
                    });
                }
            }else{ // 가방 중복 체크
                let count = 0;
                let overlapShoppingBasket = await ShoppingBasket.findOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productColorKey : req.body.productColorKey});
                if(overlapShoppingBasket){
                    let resultCount = Number(req.body.productCountKey) + overlapShoppingBasket.productCountKey;
                    await ShoppingBasket.updateOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productColorKey : req.body.productColorKey},{ productCountKey : resultCount});
                }else{
                    await ShoppingBasket.create({
                        userId : req.session.user_id,
                        productNameKey : req.body.productNameKey,
                        highCategoryFilter : req.body.highCategoryFilter,
                        lowCategoryFilter : req.body.lowCategoryFilter,
                        description : req.body.description,
            
                        productPriceKey : req.body.productPriceKey,
                        productHighKey : req.body.productHighKey,
                        productWeightKey : req.body.productWeightKey,
                        productColorKey : req.body.productColorKey,
                        productCountKey : req.body.productCountKey,
                        productSizeKey : req.body.productSizeKey,
            
                        products : {
                            productName : req.body.productNameKey,
                            productPrice : req.body.productPriceKey,
                            productHigh : req.body.productHighKey,
                            productWeight : req.body.productWeightKey,
                            productColor : req.body.productColorKey,
                            productCount : req.body.productCountKey,
                            productSize : req.body.productSizeKey
                        }    
                    });
                }
            }
        }
        catch(err){ return res.send(`<script>alert('오류가 발생했습니다.');location.href='/product';</script>`); }
        finally{ 
            // return res.send({result : true, path : '/product'}); 
            return res.redirect('/product');
        }
    }
    /*
        { 
        productName: 'stylish long T-shirt',
        productPrice: '8000',
        productSize: 'Size S',
        productColor: 'Black',
        productCount: '2' 
        }
    */
   
});

router.post('/cart/deleteOne', async(req, res) => {
    if(req.body.highCategoryFilter == "shirt" || req.body.highCategoryFilter == "pants"){
        let findShoppingBasket = await ShoppingBasket.findOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productHighKey : req.body.productHighKey, productWeightKey : req.body.productWeightKey, productColorKey : req.body.productColorKey});
        if(findShoppingBasket){
            await ShoppingBasket.deleteOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productHighKey : req.body.productHighKey, productWeightKey : req.body.productWeightKey, productColorKey : req.body.productColorKey});
            return res.send(`<script>alert('상품 삭제 완료:)');location.href='/cart';</script>`);
        }
    }else if(req.body.highCategoryFilter == "shoes"){
        let findShoppingBasket = await ShoppingBasket.findOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productSizeKey : req.body.productSizeKey, productColorKey : req.body.productColorKey});
        if(findShoppingBasket){
            await ShoppingBasket.deleteOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productSizeKey : req.body.productSizeKey, productColorKey : req.body.productColorKey});
            return res.send(`<script>alert('상품 삭제 완료:)');location.href='/cart';</script>`);
        }
    }else{
        let findShoppingBasket = await ShoppingBasket.findOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productColorKey : req.body.productColorKey});
        if(findShoppingBasket){
            await ShoppingBasket.deleteOne({productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productColorKey : req.body.productColorKey});
            return res.send(`<script>alert('상품 삭제 완료:)');location.href='/cart';</script>`);
        }
    }
});

module.exports = router;