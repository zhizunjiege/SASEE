(function ($) {
    const CONTENTS_NEWSPS=10;
    const URL_VIEW = '/views';
    const URL_NEWS_CONTENT = '/doc/notice.html';

    $(function ($) {

        //绑定news翻页的行为
        const newsNum = $('#news_list').data().newsNum;
        const pageNum = $('#news_list').data().pageNum;
        var currentPage = 1;
        var nextPage = 1;

        function pageNavToggle(e) {
            $('#news_list').load(URL_VIEW, 'type=newsList&' + 'nextPage=' + nextPage, () => {
                if (pageNum > 1) {
                    var sel = $('#news_page_nav>ul>li');
                    var already = true;
                    sel.each((index, element) => {
                        if ($(element).text() == currentPage.toString()) {
                            $(element).toggleClass('active');
                            return false;
                        } else return true;
                    });
                    sel.each((index, element) => {
                        if ($(element).text() == nextPage.toString()) {
                            $(element).toggleClass('active');
                            already = false;
                            return false;
                        } else return true;
                    });
                    if (already) {
                        $('#news_page_jump').replaceWith($('#news_page_jump').prev().clone());
                        $('#news_page_nav>ul>li').eq(2).attr('id', 'news_page_jump').toggleClass('active').children('a').text(nextPage);
                    }
                    if (currentPage == 1 || nextPage == 1) {
                        sel.first().toggleClass('disabled');
                    }
                    if (currentPage == pageNum || nextPage == pageNum) {
                        sel.last().toggleClass('disabled');
                    }
                    currentPage = nextPage;
                }
            });
        }

        if (pageNum > 3) {
            $('#news_page_jump>div').click((e) => {
                e.stopPropagation();
            });
            $('#news_page_jump button').click((e) => {
                e.preventDefault();
                nextPage = Number($('#news_page_jump input').val());
                if (nextPage >= 1 && nextPage <= pageNum) {
                    pageNavToggle();
                } else {
                    alert('请输入有效的页数!');
                }
            });
        }
        $('#news_page_nav>ul').click((e) => {
            switch (e.target.innerText) {
                case '«':
                    if (!$('#news_page_prev').hasClass('disabled')) {
                        nextPage = currentPage - 1;
                        pageNavToggle();
                    }
                    break;
                case '»':
                    if (!$('#news_page_next').hasClass('disabled')) {
                        nextPage = currentPage + 1;
                        pageNavToggle();
                    }
                    break;
                case '···':
                    break;
                default:
                    if (!$(e.target).parent().hasClass('active')) {
                        nextPage = Number(e.target.innerText);
                        if (!isNaN(nextPage)) {
                            pageNavToggle();
                        }
                    }
                    break;
            }
        });

        //绑定点击news的行为
        function newsToggle() {
            $('#news_header').children().toggle();
            $('#news_content').toggle();
            $('#news_list').toggle();
            $('#news_page_nav').toggle();
        };

        $('#news_list>ul>li').click((e) => {
            $('#news_content').load(URL_NEWS_CONTENT, 'type=newsContent&' + 'num=' +((currentPage-1)*CONTENTS_NEWSPS+$(e.currentTarget).index()), newsToggle);
        });
        $('#news_back').click(newsToggle);

        //个人信息的加载
        $('#_toggle_user_info').click((e) => {
            var href = $(e.currentTarget).attr('href');
            if (!$(href).length) {
                $('<div>', {
                    "id": href.substring(1),
                    "class": "collapse",
                    "data-parent": "#contents"
                }).appendTo('#contents').collapse({
                    parent: '#contents',
                    toggle: true
                }).load(URL_VIEW, 'type=userInfo', (e) => {
                    console.log(e);
                })
            }
        });

        //各个阶段的加载
        $('#navigator ul>a').click((e) => {
            var periodId = $(e.currentTarget).attr('href');
            if (!$(periodId).length) {
                $('<div>', {
                    "id": periodId.substring(1),
                    "class": "collapse",
                    "data-parent": "#contents"
                }).appendTo('#contents').collapse({
                    parent: '#contents',
                    toggle: true
                }).load(URL_VIEW, 'type=period&' + 'id=' + periodId.substring(1), (e) => {
                    console.log(e);
                })
            }
        });
    });
})(window.jQuery);


