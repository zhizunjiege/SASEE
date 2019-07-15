(function ($) {
    //const CONTENTS_NEWSPS = 10;
    const URL_VIEW = '/views';
    const URL_NEWS_CONTENT = '/doc/notice.html';

    $(function ($) {

        //绑定news翻页的行为
        const newsNum = $('#news_list').data().num;
        const pageNum = $('#news_list').data().page;

        function instScroll(context,container,path,append,scrollThreshold,status,callback) {
            var $infiniteScrollObj = $(container,context).infiniteScroll({
                path: path,
                append: append,
                checkLastPage: true,
                prefill: false,
                responseType: 'document',
                onInit:null,
                scrollThreshold: scrollThreshold,
                elementScroll: false,//默认用window的滚动触发
                loadOnScroll: true,
                history: false,
                //hideNav: '.infinite-scroll-status',
                status: status,
                //button:'.infinite-scroll-button',
                debug: true
            });
            function log(e,res,path,items) {
                console.log(e);
                console.log(res);
                console.log(path);
                console.log(items);
            }
            //$infiniteScrollObj.on('scrollThreshold.infiniteScroll', log);
            //$infiniteScrollObj.on('request.infiniteScroll', log);
            //$infiniteScrollObj.on('load.infiniteScroll', log);
            $infiniteScrollObj.on('append.infiniteScroll',callback);
            //$infiniteScrollObj.on('error.infiniteScroll', log);
            //$infiniteScrollObj.on('last.infiniteScroll', log);
        };

        instScroll(document,'.infinite-scroll-container',function () {
                if (this.loadCount + 2 <= $('#news_list').data().page) {
                    return URL_VIEW + '?type=newsList&nextPage=' + (this.loadCount + 2);
                }
            },'.list-group-item',400,'.infinite-scroll-status',(e,res,path,items)=> {
                for (let i = 0; i < items.length; i++) {
                    clickToLoadContent($(items[i]),loadNewsContent);                    
                } 
             });

        //绑定点击news的行为
        function newsContentToggle() {
            $('#contents_header').children().toggle();
            $('#news').children().toggle();
        };
        function loadNewsContent(e) {
            $('#news_content').load(URL_NEWS_CONTENT, 'type=newsContent&' + 'num=' + $(e.currentTarget).index(), newsContentToggle);
        };
        function clickToLoadContent(item,loadContent) {
            $(item).click(loadContent);
        };
        //$('#news_list>ul>li').click(loadNewsContent);
        clickToLoadContent($('#news_list>ul>li'),loadNewsContent);
        $('#contents_back').click(newsContentToggle);

        function loadFrame(e,type,callback) {
            var href = $(e.currentTarget).attr('href');
            if (!$(href).length) {
                $('<div>', {
                    "id": href.substring(1),
                    "class": "collapse",
                    "data-parent": "#contents"
                }).appendTo('#contents>div').collapse({
                    parent: '#contents',
                    toggle: true
                }).load(URL_VIEW, 'type='+type, callback);
            }
        };

        //个人信息的加载
        $('#_toggle_user_info').click((e) => {
            loadFrame(e,'userInfo',()=>{
                $('#modify_pw').click(()=>{
                    
                });
            });
        });

        //各个阶段的加载
        $('#navigator ul>a').click((e)=>{
            loadFrame(e,'period',()=>{

            });
        });
       
    });
})(window.jQuery);


