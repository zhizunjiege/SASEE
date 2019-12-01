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

        let callback=()=>{
            SASEE.updateTime();
            setTimeout(callback,5*60*1000);
        };
        callback();

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
    });
})(window.jQuery);
