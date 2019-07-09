(function ($) {
    const NEWS_URL = "../doc/notice.html";

    $(function ($) {
        //绑定点击news的行为
        var newsList=null;
        $("#news_list>li").click(function () {
            if (!$(this).hasClass("active")) {
                $("#news_content").load(NEWS_URL, "num=" + $(this).index(), function () {
                    newsList=$(this).next().remove();
                });
            }
            $(this).toggleClass("active");
        });

    });
})(window.jQuery);


