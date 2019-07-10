(function ($) {
    const NEWS_URL = '../doc/notice.html';

    $(function ($) {
        //绑定点击news的行为
        function newsToggle() {
          $('#news_header').children().toggle();
          $('#news_content').toggle();
          $('#news_list').toggle();
        };


        $('#news_list>ul>li').click(function () {
            $('#news_content').load(NEWS_URL, 'num=' + $(this).index(),newsToggle);
        });
        $('#news_header>button').click(newsToggle);
    });
})(window.jQuery);


