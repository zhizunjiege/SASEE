'use strict';
(function ($) {
    $(function ($) {
        //初始化
        const SASEE = window.SASEE;
        function _loadFrame({ $target, done, fail = SASEE.requestFail } = {}) {
            let href = $target.attr('href'),
                type = $target[0].dataset.type;
            if (href) {
                $.get(SASEE.URL_VIEWS + '/' + type).fail(fail).done((html) => {
                    if (!$(href).length) {
                        $('<div>', {
                            "id": href.substring(1),
                            "class": "collapse",
                            "data-parent": "#contents"
                        }).appendTo('#contents_body').collapse({
                            parent: '#contents',
                            toggle: true
                        }).append(html);
                    } else {
                        $(href).html(html).collapse('show');
                    }
                    done($target);
                });
            } else {
                done($target);
            }
        }

        SASEE._loadContent({
            container: '#news',
            url: SASEE.URL_VIEWS + '/news'
        });

        $('#_toggle_user_info,#navigator a[href="#manual"],#navigator a[href="#news"],#navigator ul>a[data-type]').each((index, element) => {
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

        SASEE.updateTime();

        let $license = $('#license_modal');
        if ($license.length > 0) {
            $license.modal({
                backdrop: 'static',
                keyboard: false
            });
            $license.find('#button_agree').click(() => {
                $.get('./license/agree').fail(SASEE.requestFail).done(() => {
                    $license.modal('hide');
                    $license.on('hidden.bs.modal', () => {
                        $license.modal('dispose');
                        $license.remove();
                    });
                });
            });
            $license.find('#button_disagree').click(() => {
                $.get('./license/disagree').fail(SASEE.requestFail).done(() => {
                    location.href = '/';
                });
            });
        }

        function setWindowSize(e) {
            let offset1 = 65 + 1, offset2 = 0;
            if ($(window).width() < 992) {
                offset2 = $('#navigator>.page-2').height();
            } else {
                offset2 = 0;
            }
            $('#contents').height($(window).height() - offset1 - offset2);
        }

        setWindowSize();
        $(window).resize(setWindowSize);
    });
})(window.jQuery);
