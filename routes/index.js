const express = require('express');
const router = express.Router();
const Informations = require('../database/Informations');
const ShoppingBasket = require('../database/ShoppingBasket');
const Products = require('../database/Products');

/* 기본 페이지 랜더링 */
router.get('/', async(req, res) => { defaultRendering(req, res, '/', 'index'); });

router.get('/product', async(req, res) => {
    let findUserBasket = await ShoppingBasket.find({userId : req.session.user_id});
    let totalPrice = 0;
    let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
    for(let i in findUserBasket){ totalPrice += (findUserBasket[i].products.productPrice * findUserBasket[i].productCountKey); }
    
    /* 카테고리 4가지 */
    if(req.param('clothes') === 'shirt' || req.param('clothes') === 'pants' || req.param('clothes') === 'bag' || req.param('clothes') === 'shoes'){ getProductCategory(req, res, findUserBasket, totalPrice, basketCount); }
    
    /* 카테고리에서 4가지 필터 */
    if((typeof req.param('clothesName')) !== 'undefined' && req.param('sorting') === 'DefaultSorting'){ getSelectedProductFiltering(req, res, findUserBasket, totalPrice, basketCount, {}); }
    if((typeof req.param('clothesName')) !== 'undefined' && req.param('sorting') === 'Popularity'){ getSelectedProductFiltering(req, res, findUserBasket, totalPrice, basketCount, {purchaseAmount:-1}); }
    if((typeof req.param('clothesName')) !== 'undefined' && req.param('sorting') === 'Price_lowtohigh'){ getSelectedProductFiltering(req, res, findUserBasket, totalPrice, basketCount, {price:1}); }
    if((typeof req.param('clothesName')) !== 'undefined' && req.param('sorting') === 'Price_hightolow'){ getSelectedProductFiltering(req, res, findUserBasket, totalPrice, basketCount, {price:-1}); }
    
    /* 전체 필터 */
    if(req.param('sorting') === "DefaultSorting"){ getAllProductFiltering(req, res, findUserBasket, totalPrice, basketCount, {}); }
    else if(req.param('sorting') === "Popularity"){ getAllProductFiltering(req, res, findUserBasket, totalPrice, basketCount, {purchaseAmount:-1}); }
    else if(req.param('sorting') === "Price_lowtohigh"){ getAllProductFiltering(req, res, findUserBasket, totalPrice, basketCount, {price:1}); }
    else if(req.param('sorting') === "Price_hightolow"){ getAllProductFiltering(req, res, findUserBasket, totalPrice, basketCount, {price:-1}); }
    else{ getAllProductFiltering(req, res, findUserBasket, totalPrice, basketCount, {}); }
});

router.post('/product', async(req, res) => { productFilter(req, res, req.body.sortName); });

router.get('/product-detail', async(req, res) => { defaultRendering(req, res, '/product-detail', 'product-detail'); });

router.get('/cart', async(req, res) => { defaultRendering(req, res, '/cart', 'cart'); });

router.post('/view', (req,res) =>{
    if(req.body.productSize == "Choose an option" || req.body.productColor == "Choose an option" || req.body.productHigh == "Choose an option" || req.body.productWeight == "Choose an option"){
        return res.send(`<script>alert('옵션을 제대로 선택해주세요');</script>`);
    }
    else{
        if(req.body.highCategoryFilter == "shirt" || req.body.highCategoryFilter == "pants"){ return res.send({ result : true, path : `/view?high=${req.body.productHigh}&weight=${req.body.productWeight}&color=${req.body.productColor}&highCategoryFilter=${req.body.highCategoryFilter}&lowCategoryFilter=${req.body.lowCategoryFilter}`}); }
        else if(req.body.highCategoryFilter == "shoes"){ return res.send({ result : true, path : `/view?size=${req.body.productSize}&color=${req.body.productColor}&highCategoryFilter=${req.body.highCategoryFilter}&lowCategoryFilter=${req.body.lowCategoryFilter}`}); }
        else{ return res.send({ result : true, path : `/view?color=${req.body.productColor}&highCategoryFilter=${req.body.highCategoryFilter}&lowCategoryFilter=${req.body.lowCategoryFilter}`}); }
    }
});

router.get('/view', (req,res) => { return res.render('viewModel', { highCategoryFilter : req.param('highCategoryFilter'), lowCategoryFilter : req.param('lowCategoryFilter'), high : req.param('high'), weight : req.param('weight'), size : req.param('size'), color : req.param('color') }); });

router.get('/about', async(req, res) => { defaultRendering(req, res, '/about', 'about'); });

router.get('/contact', async(req, res) => { defaultRendering(req, res, '/contact', 'contact'); });

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
    if(req.body.productSizeKey == "Choose an option" || req.body.productColorKey == "Choose an option" || req.body.productWeightKey == "Choose an option" || req.body.productHighKey == "Choose an option"){ return res.send(`<script>alert('옵션을 모두 선택해주세요 !');location.href='/product-detail?name=${req.body.productNameKey}&price=${req.body.productPriceKey}&highCategoryFilter=${req.body.highCategoryFilter}&lowCategoryFilter=${req.body.lowCategoryFilter}&description=${req.body.description}';</script>`); }
    else{
        try{ 
            // 셔츠,바지 중복 체크
            if(req.body.highCategoryFilter === 'shirt' || req.body.highCategoryFilter === 'pants'){ cartAdd(req, {productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productHighKey : req.body.productHighKey, productWeightKey : req.body.productWeightKey, productColorKey : req.body.productColorKey}); }
            // 신발 중복 체크
            else if(req.body.highCategoryFilter === 'shoes'){ cartAdd(req, {productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productSizeKey : req.body.productSizeKey, productColorKey : req.body.productColorKey}); }
            // 가방 중복 체크 
            else{ cartAdd(req, {productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productColorKey : req.body.productColorKey}); }
        }
        catch(err){ return res.send(`<script>alert('오류가 발생했습니다.');location.href='/product';</script>`); }
        finally{ return res.redirect('/product'); }
    }
});

/* 카트 삭제 */
router.post('/cart/deleteOne', async(req, res) => {
    if(req.body.highCategoryFilter == "shirt" || req.body.highCategoryFilter == "pants"){ cartDeleteOne(res, {productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productHighKey : req.body.productHighKey, productWeightKey : req.body.productWeightKey, productColorKey : req.body.productColorKey}); }
    else if(req.body.highCategoryFilter == "shoes"){ cartDeleteOne(res, {productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productSizeKey : req.body.productSizeKey, productColorKey : req.body.productColorKey}); }
    else{ cartDeleteOne(res, {productNameKey : req.body.productNameKey, productPriceKey : req.body.productPriceKey, productColorKey : req.body.productColorKey}); }
});

/* default rendering function */
async function defaultRendering(req, res, route, renderFileName){
    let findUserBasket = await ShoppingBasket.find({userId : req.session.user_id});
    let totalPrice = 0;
    let basketCount =  await ShoppingBasket.find({userId : req.session.user_id}).count();
    for(let i in findUserBasket){ totalPrice += (findUserBasket[i].products.productPrice * findUserBasket[i].productCountKey); }
    if(route === '/'){
        let products = await Products.find();
        if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
        else{ return res.render(`${renderFileName}`, {user_id : req.session.user_id, product: products, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
    }else if(route === '/product-detail'){
        let products = await Products.find();
        if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
        else{ return res.render(`${renderFileName}`, { user_id : req.session.user_id, products : products, productName : req.param('name'), productPrice : req.param('price'), userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount, highCategoryFilter : req.param('highCategoryFilter'), lowCategoryFilter : req.param('lowCategoryFilter'), description : req.param('description')}); }
    }else if(route === '/cart'){
        if(require('../config/status').isBlocked){ return res.render('serverChecking'); } //totalPrice 
        else if(req.session.is_user_login){ return res.render(`${renderFileName}`, {user_id : req.session.user_id, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
        else {return res.send(`<script>alert('Login please.');location.href='/';</script>`);}
    }else{
        if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
        else{ return res.render(`${renderFileName}`, {user_id : req.session.user_id, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
    }
    
}

/* product category filter function */
async function getProductCategory(req, res, findUserBasket, totalPrice, basketCount){
    let findProducts = await Products.find({highCategoryFilter : req.param('clothes')});
    return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : req.param('clothes'), userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
}

/* 카테고리 선택한 상태에서 필터링 */
async function getSelectedProductFiltering(req,res, findUserBasket, totalPrice, basketCount, sortOption){
    let findProducts = await Products.find({highCategoryFilter : req.param('clothesName')}).sort(sortOption);
    return res.render('product', {user_id : req.session.user_id, products : findProducts, clothes : req.param('clothesName'), userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount});
}

/* 전체 상품 필터링 */
async function getAllProductFiltering(req, res, findUserBasket, totalPrice, basketCount, sortOption){
    let products = await Products.find().sort(sortOption);
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
    else{ return res.render('product', {user_id : req.session.user_id, products : products, userBasket : findUserBasket, totalPrice : totalPrice, basketCount : basketCount}); }
}

/* product filter function - POST */
async function productFilter(req, res, sortName){
    if( (typeof req.body.clothes === 'undefined') ) { return res.send({result : true, path : `/product?sorting=${sortName}`}); }
    else{ return res.send({result : true, path : `/product?sorting=${sortName}&clothesName=${req.body.clothes}`}); }
}

/* cartAdd function */
async function cartAdd(req, findObject){
    let overlapShoppingBasket = await ShoppingBasket.findOne(findObject);
    if(overlapShoppingBasket){
        let resultCount = Number(req.body.productCountKey) + overlapShoppingBasket.productCountKey;
        await ShoppingBasket.updateOne(findObject,{ productCountKey : resultCount});
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

/* cartDeleteOne function */
async function cartDeleteOne(res, findObject){
    let findShoppingBasket = await ShoppingBasket.findOne(findObject);
    if(findShoppingBasket){
        await ShoppingBasket.deleteOne(findObject);
        return res.send(`<script>alert('상품 삭제 완료:)');location.href='/cart';</script>`);
    }
    else{ return res.send(`<script>alert('상품 삭제 에러:)');location.href='/cart';</script>`); }
}

module.exports = router;