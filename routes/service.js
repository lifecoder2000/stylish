const express = require('express');
const router = express.Router();
const QuestionAnswer = require('../database/QuestionAnswer');

/* 데모 페이지 */
router.get('/demo', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ res.render('demo'); }
});

router.post('/demo', (req, res) => {
    return res.send({result:true, msg:'키 : '+req.body.high+' 몸무게 : '+req.body.weight});
});

/* 1:1 상담 */ //수정해야될 라우터
router.get('/consulting', (req, res) => {
    if(require('../config/status').isBlocked){ res.render('serverChecking'); }
    else{ res.render('consulting', {user_id : req.session.user_id}); }
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
router.post('/payment', (req, res) => {

});

/* QuestionAnswer collection의 document개수 구하는 함수 */
async function getQuestionAnswerCountAll(){ return await QuestionAnswer.find().count(); }

module.exports = router;