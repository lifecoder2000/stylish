$('#search_2').click(() => {
    let data = prompt("검색할 제품을 입력해주세요");
   	if(data){
   		$.ajax({
   			url : '/service/search',
			dataType : 'json',
			type : 'POST',
			data : {'productName' : data},
			success : result => {
				if(result.path === '/product'){ alert('제품이 존재하지 않습니다.'); }
				else{ location.href=`${result.path}`; } 
			}
		});
    }
    else{ alert("제대로 입력해주세요"); }
});