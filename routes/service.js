const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Informations = require('../database/Informations');
const QuestionAnswer = require('../database/QuestionAnswer');
//add
const Products = require('../database/Products');

/* 데모 페이지 */
router.get('/demo', (req, res) => {
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
    else{ res.render('demo'); }
});

router.post('/demo', (req, res) => {
    return res.send({result:true, msg:'키 : '+req.body.high+' 몸무게 : '+req.body.weight});
});

/* 1:1 상담 토큰 생성 */
router.get('/token', (req, res) => {
    if(req.session.is_user_login){ return res.render('create-token', { userId : req.session.user_id}); }
    else{ return res.send(`<script>alert('login please');location.href='/customerCenter'</script>`); }
});

router.post('/token', async(req, res) => {
    let cipher = crypto.createCipher('aes192', '%&*^&(@UJI#U)*RHY#IPRNIPENPEIKFN:@(UJ(FNPFNLDKJOPNKLF');
    cipher.update(req.body.userId, 'utf8', 'base64');
    let cipheredOutput = cipher.final('base64');
    try{ await Informations.updateOne({id : req.body.userId}, {token : cipheredOutput}); }
    catch(err){ return res.send(`<script>alert('error');location.href='/customerCenter';</script>`); }
    finally{ return res.send(`<script>alert('당신의 토큰은 ${cipheredOutput}');location.href='/customerCenter';</script>`); }
});

/* 1:1 상담 */ 
router.get('/consulting', (req, res) => {
    if(require('../config/status').isBlocked){ return res.render('serverChecking'); }
    else{ return res.render('consulting'); }
});

// view 페이지 (상세 게시물) : 글 보는 부분. 글 내용을 출력하고 조회수를 늘려줘야함
router.get('/view', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{
        QuestionAnswer.findOne({_id:req.param('id')}, function(err, rawContents){
            if(err){ throw err; } 
            else{
                // 조회수 증가, 변경된 조회수 저장
                rawContents.count += 1; 
                rawContents.save( err => {
                    if(err) throw err;
                    else { res.render('boardDetail',{content:rawContents}); }
                });
            }
        });
    }
});

/* Q & A */
router.get('/QA', async(req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{
        let page = req.param('page');
        if(page == null) { page = 1; }
        let skipSize = (page-1)*10;
        let totalCount = await getQuestionAnswerCountAll();
        QuestionAnswer.find({}).sort({date:-1}).skip(skipSize).limit(10).exec((err, rawContents) => {
            if(err) { throw err; }
            else {res.render('questionAndAnswer', {contents: rawContents, pagination: Math.ceil(totalCount/10), count: totalCount, skip:skipSize}); }
        });
    }
});

router.post('/QA', async(req, res) => {
    await QuestionAnswer.create({ writer : req.body.id, text : req.body.text, title : req.body.title, status : false });
    return res.send(`<script>alert('질문이 등록되었습니다.');location.href='/service/QA'</script>`);
});

/* 결제 */
router.get('/payment', (req, res) => {
    if(req.session.is_user_login){ return res.render('payment', {user_id : req.session.user_id}); }
    else {return res.send(`<script>alert('Login please.');location.href='/';</script>`);}
});

router.post('/payment', (req, res) => {
    console.log(req.body);
});

router.get('/payment/inputPaymentInformation', (req, res) => {
    if(req.session.is_user_login){ return res.render('inputPaymentInformation', {user_id : req.session.user_id}); }
    else {return res.send(`<script>alert('Login please.');location.href='/';</script>`);}
});

router.post('/payment/inputPaymentInformation', (req, res) => {
    res.send(`<script>alert('결제가 완료되었습니다');location.href='/'</script>`);
});

/* 제품 검색 */
router.post('/search', async(req,res)=> {
    let findProduct = await Products.findOne({ name : req.body.productName });
    if(findProduct){ return res.send({result : true, path : `/product-detail?name=${findProduct.name}&price=${findProduct.price}`}); }
    else { return res.send(`<script>alert('상품을 찾지 못했습니다 :( ');location.href='/product';</script>`) }
});

/* QuestionAnswer collection의 document개수 구하는 함수 */
async function getQuestionAnswerCountAll(){ return await QuestionAnswer.find().count(); }

module.exports = router;