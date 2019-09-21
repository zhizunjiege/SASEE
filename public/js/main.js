'use strict';
(function ($) {
    $(function ($) {
        //初始化
        const SASEE=window.SASEE;
        function _loadFrame($target) {
            let href = $target.attr('href');
            let data = $target[0].dataset;
            let type = data.type ? 'type=' + data.type : '';
            if (!$(href).length) {
                let queryStr = type;
                $('<div>', {
                    "id": href.substring(1),
                    "class": "collapse",
                    "data-parent": "#contents"
                }).appendTo('#contents>div>div').collapse({
                    parent: '#contents',
                    toggle: true
                }).load(SASEE.URL_VIEWS, queryStr);
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
            let page = Number($('#news_list').data().page);
            if (page) {
                return SASEE.URL_VIEWS + '?type=newsList&nextPage=' + (page + 1);
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
