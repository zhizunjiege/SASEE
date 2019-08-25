'use strict';
(function ($) {
    window.SASEE = {
        URL_VIEW: '/views',
        URL_REQUEST: '/request',
        URL_UPLOAD: '/upload',
        FILE_MAXSIZE: 5 * 1024 * 1024
    };
    var SASEE = window.SASEE;

    //封装infinite-scroll函数
    SASEE.instScroll = (container, path, append, scrollThreshold, elementScroll, loadOnScroll, status, button, loadCallback, appendCallback) => {
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
    SASEE._contentBarToggle = () => {
        $('#contents_back').toggle();
        $('#contents_title').toggle();
    }
    SASEE._subjectToggle = (content, list, flag) => {
        if (flag) {
            $(content).hide();
            $(list).show();
        } else {
            $(content).toggle();
            $(list).toggle();
        }
    }
    SASEE._loadContent = (e, content, type, callback) => {
        document.getElementById('contents_back').onclick = callback;
        $(content).load(SASEE.URL_VIEW, 'type=' + type + '&num=' + $(e.currentTarget).index(), callback);
    }

    $(function ($) {
        //初始化
        function _loadFrame($target) {
            let href = $target.attr('href');
            let type = $target.data('type') || '';
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
        function _loadNewsContent(e) {
            SASEE._loadContent(e, '#news_content', 'newsContent', (e) => {
                SASEE._contentBarToggle();
                SASEE._subjectToggle('#news_content', '#news_list');
            })
        }

        $('#news_list ul>li').click(_loadNewsContent);
        SASEE.instScroll('.infinite-scroll-container-1', function () {
            if (this.loadCount + 2 <= $('#news_list').data().page) {
                return SASEE.URL_VIEW + '?type=newsList&nextPage=' + (this.loadCount + 2);
            }
        }, '.list-group-item', 400, '#news_list', false, '.infinite-scroll-status-1', '.infinite-scroll-button-1', null, (e, res, path, items) => {
            $(items).click(_loadNewsContent);
        });
        $('#_toggle_user_info,#navigator a[href="#news"],#navigator ul>a').each((index, element) => {
            var $element = $(element);
            $element.click((e) => {
                let $target = $(e.currentTarget);
                if ($target.data('sub')) {
                    SASEE._subjectToggle($target[0].dataset.content, $target[0].dataset.list, true);
                }
                $('#contents_back').hide();
                $('#contents_title').show().text($element.text());
                _loadFrame($target);
            })
        });
    });
})(window.jQuery);


