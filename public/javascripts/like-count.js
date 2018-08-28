$('#likeCount').click(() => {
    var n = $('#likeCount').index(this);
    var num = $("#likeCountText:eq("+n+")").val();
    num = $("#likeCountText:eq("+n+")").val(num*1+1); 
});