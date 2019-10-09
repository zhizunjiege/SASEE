'use strict';
(function ($) {
    $(function ($) {
        //初始化
        const SASEE = window.SASEE;
        function _loadFrame({ $target, fail = SASEE.requestFail } = {}) {
            let href = $target.attr('href'),
                type = $target[0].dataset.type;
            if (!$(href).length) {
                $.get(SASEE.URL_VIEWS + '/' + type).fail(fail).done((html) => {
                    $('<div>', {
                        "id": href.substring(1),
                        "class": "collapse",
                        "data-parent": "#contents"
                    }).appendTo('#contents>div>div').collapse({
                        parent: '#contents',
                        toggle: true
                    }).append(html);
                });
            }
        }
        function _loadNewsContent(e) {
            SASEE._loadContent('#news_content', {
                type: 'newsContent',
                id: $(e.target).closest('li').data('id')
            }, () => {
                SASEE._subjectToggle('#news_content', '#news_list');
            });
        }
        $('#news_list>ul').click(_loadNewsContent);
        SASEE.instPagination({
            container: '#news_list>ul',
            pagination: '#news_pagination',
            url: SASEE.URL_VIEWS + '/newsList'
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
                _loadFrame({ $target });
            });
        });
    });
})(window.jQuery);
