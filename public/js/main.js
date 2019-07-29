'use strict';
(function ($) {
    window.SASEE = {
        URL_VIEW: '/views',
        URL_NEWS_CONTENT: '/doc/notice.html',
        URL_REQUEST: '/request',
        URL_UPLOAD: '/upload',
        FILE_MAXSIZE:5*1024*1024
    };
    var SASEE = window.SASEE;

    //封装infinite-scroll函数
    SASEE.instScroll = function (container, path, append, scrollThreshold, elementScroll, loadOnScroll, status, button, loadCallback, appendCallback) {
        var $infiniteScrollObj = $(container).infiniteScroll({
            path: path,
            append: append,
            checkLastPage: true,
            prefill: false,
            responseType: 'document',
            onInit: null,
            scrollThreshold: scrollThreshold,
            elementScroll: elementScroll,//默认用window的滚动触发
            loadOnScroll: loadOnScroll,
            history: false,
            //hideNav: '.infinite-scroll-status',
            status: status,
            //button: button,
            debug: true
        });
        function log(e, res, path, items) {
            console.log(e);
            console.log(res);
            console.log(path);
            console.log(items);
        }
        if (button) {
            $(button).click(() => {
                $(container).infiniteScroll('loadNextPage');
                $infiniteScrollObj.infiniteScroll('option', {
                    loadOnScroll: true
                });
                $(button).hide();
            });
        }

        //$infiniteScrollObj.on('scrollThreshold.infiniteScroll', log);
        //$infiniteScrollObj.on('request.infiniteScroll', log);
        if (loadCallback) {
            $infiniteScrollObj.on('load.infiniteScroll', loadCallback);
        }
        if (appendCallback) {
            $infiniteScrollObj.on('append.infiniteScroll', appendCallback);
        }
        //$infiniteScrollObj.on('error.infiniteScroll', log);
        //$infiniteScrollObj.on('last.infiniteScroll', log);
    };
    function contentBarToggle() {
        $('#contents_back').toggle();
        $('#contents_title').toggle();
    }
    function newsToggle() {
        contentBarToggle();
        $('#news_content').toggle();
        $('#news_list').toggle();
    }
    function subjectToggle() {
        contentBarToggle();
        $('#subject_content').toggle();
        $('#subject_list').toggle();
    }
    function loadNewsContent(e) {
        document.getElementById('contents_back').onclick = newsToggle;
        $('#news_content').load(SASEE.URL_NEWS_CONTENT, 'type=newsContent&' + 'num=' + $(e.currentTarget).index(), newsToggle);
    }
    SASEE.loadSubjectContent = function (e) {
        document.getElementById('contents_back').onclick = subjectToggle;
        $('#subject_content').load(SASEE.URL_VIEW, 'type=subjectContent&' + 'num=' + $(e.currentTarget).index(), subjectToggle);
    };
    function loadFrame(e, type) {
        var href = $(e.currentTarget).attr('href');
        if (!$(href).length) {
            $('<div>', {
                "id": href.substring(1),
                "class": "collapse",
                "data-parent": "#contents"
            }).appendTo('#contents>div>div').collapse({
                parent: '#contents',
                toggle: true
            }).load(SASEE.URL_VIEW, 'type=' + type);
        }
    }

    $(function ($) {
        //初始化
        $('#news_list ul>li').click(loadNewsContent);
        SASEE.instScroll('.infinite-scroll-container-1', function () {
            if (this.loadCount + 2 <= $('#news_list').data().page) {
                return SASEE.URL_VIEW + '?type=newsList&nextPage=' + (this.loadCount + 2);
            }
        }, '.list-group-item', 400, '#news_list', false, '.infinite-scroll-status-1', '.infinite-scroll-button-1', null, (e, res, path, items) => {
            $(items).click(loadNewsContent);
        });

        function loadNews() {
            $('#news_content').hide();
            $('#news_list').show();
        }
        function loadSubject() {
            $('#subject_content').hide();
            $('#subject_list').show();
        }

        var arrayLoadType = [
            'userInfo',
            '',
            'subject',
            'mySubject'
        ];
        var arrayLoadCallback = [
            null,
            loadNews,
            loadSubject
        ];

        $('#_toggle_user_info,#navigator a[href="#news"],#navigator ul>a').each((index, element) => {
            var $element = $(element);
            $element.click((e) => {
                if (arrayLoadCallback[index]) {
                    arrayLoadCallback[index]();
                }
                $('#contents_back').hide();
                $('#contents_title').show().text($element.text());
                loadFrame(e, arrayLoadType[index] || '');
            })
        });
    });
})(window.jQuery);


