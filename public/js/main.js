'use strict';
(function ($) {
    $(function ($) {
        //初始化
        const SASEE = window.SASEE;
        function _loadFrame({ $target, done, fail = SASEE.requestFail } = {}) {
            let href = $target.attr('href'),
                type = $target[0].dataset.type;
            if (href && !$(href).length) {
                $.get(SASEE.URL_VIEWS + '/' + type).fail(fail).done((html) => {
                    $('<div>', {
                        "id": href.substring(1),
                        "class": "collapse",
                        "data-parent": "#contents"
                    }).appendTo('#contents>div>div').collapse({
                        parent: '#contents',
                        toggle: true
                    }).append(html);
                    done($target);
                });
            } else {
                done($target);
            }
        }

        SASEE.initNewsFrame();

        $('#_toggle_user_info,#navigator a[href="#news"],div[data-target="#news"],#navigator ul>a[data-type]').each((index, element) => {
            var $element = $(element);
            $element.click((e) => {
                _loadFrame({
                    $target: $element,
                    done: $target => {
                        SASEE._showListOrContent({
                            container: $target.attr('href'),
                            title: $target.text()
                        });
                    }
                });
            });
        });
    });
})(window.jQuery);
