(function ($) {
    const URL_NEWS_CONTENT = '../doc/notice.html';
    const URL_NEWS_LIST = '../doc/view';

    $(function ($) {
        //绑定点击news的行为
        function newsToggle() {
            $('#news_header').children().toggle();
            $('#news_content').toggle();
            $('#news_list').toggle();
        };

        $('#news_list>ul>li').click((e) => {
            $('#news_content').load(URL_NEWS_CONTENT, 'type=newsContent&' + 'num=' + $(e.currentTarget).index(), newsToggle);
        });
        $('#news_header>button').click(newsToggle);

        //绑定news翻页的行为
        const pageNum = Number($('#page_nav>ul>li').eq(-2).text());
        var currentPage = 1;
        var nextPage = 1;

        function pageNavToggle(e) {
            $('#news_list').load(URL_NEWS_LIST, 'type=newsList&' + 'nextPage=' + nextPage, () => {
                if (pageNum > 1) {
                    var sel = $('#page_nav>ul>li');
                    
                    sel.each((index,element)=>{
                        if($(element).text()==currentPage.toString()){
                            $(element).toggleClass('active');
                            return false;
                        }else return true;
                    });
                    sel.each((index,element)=>{
                        if($(element).text()==nextPage.toString()){
                            $(element).toggleClass('active');
                            return false;
                        }else return true;
                    });
                    if (currentPage == 1||nextPage==1) {
                        sel.first().toggleClass('disabled');
                    }
                    if (currentPage == pageNum||nextPage==pageNum) {
                        sel.last().toggleClass('disabled');
                    } 
                    currentPage = nextPage;
                }
            });
        }

        if (pageNum > 3) {
            $('#page_jump').click((e) => {
                e.stopPropagation();
            });
            $('#page_jump button').click((e) => {
                e.preventDefault();
                nextPage = Number($('#page_jump input').val());
                if (nextPage >= 1 && nextPage <= pageNum) {
                    pageNavToggle();
                } else {
                    alert('请输入有效的页数!');
                }
            });
        }
        $('#page_nav>ul').click((e) => {
            switch (e.target.innerText) {
                case '«':
                    if (!$('#page_prev').hasClass('disabled')) {
                        nextPage = currentPage - 1;
                        pageNavToggle();
                    }
                    break;
                case '»':
                    if (!$('#page_next').hasClass('disabled')) {
                        nextPage = currentPage + 1;
                        pageNavToggle();
                    }
                    break;
                case '···':
                    break;
                default:
                    if (!$(e.target).parent().hasClass('active')) {
                        nextPage = Number(e.target.innerText);
                        pageNavToggle();
                    }
                    break;
            }
        });
    });
})(window.jQuery);


