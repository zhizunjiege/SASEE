(function ($) {
    const URL_NEWS_CONTENT = '../doc/notice.html';
    const URL_NEWS_LIST='../doc/view';

    $(function ($) {
        //绑定点击news的行为
        function newsToggle() {
            $('#news_header').children().toggle();
            $('#news_content').toggle();
            $('#news_list').toggle();
        };

        $('#news_list>ul>li').click((e) => {
            $('#news_content').load(URL_NEWS_CONTENT, 'type=newsContent&'+'num=' + $(e.currentTarget).index(), newsToggle);
        });
        $('#news_header>button').click(newsToggle);

        const pageNum=Number($('#page_nav>ul>li').eq(-2).val());
        var currentPage=1;
        $('#page_nav>ul>li').click((e)=>{
            var target=e.currentTarget;
            switch (e.target.innerText) {
                case '«':
                    if(!$(target).hasClass('disabled')){
                        $('#news_list').load(URL_NEWS_LIST,'type=newsList&'+'pageNum='+(currentPage-1));
                    }
                    break;
                case '»':
                    if(!$(target).hasClass('disabled')){
                        $('#news_list').load(URL_NEWS_LIST,'type=newsList&'+'pageNum='+(currentPage+1));
                    }
                    break;
            case '···':
                    $(target).children('button').one('click',(e)=>{
                        var value=Number($('#page_jump input').val());
                        e.preventDefault();
                        e.stopPropagation();
                        if (value>1&&value<pageNum) {
                            console.log('haha');
                            
                         $('#news_list').load(URL_NEWS_LIST,'type=newsList&'+'pageNum='+value);                            
                        }else{
                            alert('请输入有效的页数!');
                        }
                    });
                    break;
                default:
                    console.log('hehe');
                    
                    break;
            }   
        });
    });
})(window.jQuery);


