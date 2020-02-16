(function ($) {
    window.SASEE = {
        URL_VIEWS: './views',

        URL_FILE: './file',
        URL_UPLOAD: '/upload',
        URL_DOWNLOAD: '/download',

        URL_EMAIL: './email',

        URL_SUBJECT: './subject',
        URL_SUBMIT: '/submit',
        URL_MODIFY: '/modify',
        URL_QUERY: '/query',

        FILE_MAXSIZE: 5 * 1024 * 1024
    };
    const { SASEE, util } = window;

    SASEE._showListOrContent = ({ container, flag = true, title }) => {
        function _show(container, flag = true) {
            let listSel = '#contents_title,' + container + ' .sys-list',
                contentSel = '#contents_back,' + container + ' .sys-content';
            if (flag) {
                $(contentSel).hide();
                $(listSel).show();
            } else {
                $(contentSel).show();
                $(listSel).hide();
            }
        }
        function _bindContentsBack(container) {
            document.getElementById('contents_back').onclick = () => {
                _show(container);
            };
        }
        if (title) {
            $('#contents_title').text(title);
        }
        if ($(container).find('.sys-list').length > 0) {
            _bindContentsBack(container);
        }
        _show(container, flag);
    }
    SASEE._loadContent = ({ container, url, data, done, fail = SASEE.requestFail }) => {
        $.get(url, data).done(html => {
            $(container).html(html);
            done && done();
        }).fail(fail);
    };

    SASEE.serverTimeObj = {
        $serverTime: $('#_serverTime'),
        $nowState: $('#_nowState'),
        $restTime: $('#_restTime'),
        description: '',
        refreshCount: 0,
        updaterId: null,
        counterId: null,
        callback(data) {
            let obj = SASEE.serverTimeObj, timeDiff = SASEE.timeDifference(data.now, data.end);

            if (isNaN(timeDiff.time)) {
                obj.$serverTime.text(data.now);
                obj.$restTime.parent().remove();
            } else {
                if (timeDiff.time <= 0) {
                    window.location.href = './';
                    return;
                }
                obj.$serverTime.text(data.now);
                obj.$nowState.text(data.description);
                obj.$restTime.text(timeDiff.days ? `${timeDiff.days}天${timeDiff.hours}小时` : `${timeDiff.hours}小时${timeDiff.minutes}分钟`);
            }
            data.now = new Date(new Date(data.now).valueOf() + 1000).toLocaleString({
                hc: 'h23'
            }, {
                hour12: false
            });
            obj.counterId = setTimeout(obj.callback, 1000, data);
        },
    };
    SASEE.updateTime = () => {
        let timeObj = SASEE.serverTimeObj;
        if (timeObj.updaterId) {
            clearTimeout(timeObj.updaterId);
        }
        $.getJSON('/serverTime').done(data => {
            if (timeObj.description) {
                if (timeObj.description != data.description) {
                    SASEE.counter({
                        count: 5,
                        done() {
                            window.location.reload(true);
                        }
                    });
                    SASEE.alert({
                        msg: '服务器状态发生变化，请勿继续操作，页面将在5秒后自动刷新。',
                        buttonHide: true
                    });
                    return;
                }
            } else {
                timeObj.description = data.description;
            }
            if (timeObj.counterId) {
                clearTimeout(timeObj.counterId);
            }
            timeObj.refreshCount = 0;
            timeObj.callback(data);
            timeObj.updaterId = setTimeout(SASEE.updateTime, 5 * 60 * 1000);
        }).fail(() => {
            if (timeObj.refreshCount == 3) {
                SASEE.alert({ msg: '与服务端失去连接，请刷新页面重试！' });
                return;
            }
            timeObj.refreshCount++;
            setTimeout(SASEE.updateTime, 2000);
        });
    };

    SASEE.sendPinCode = ({ selector, url, dataFn = () => ({}), validate, ifNotValid } = {}) => {
        let regexpStr = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
            $button = $(selector);
        $button.click(e => {
            let data = dataFn($button[0].form),
                email = data.email;
            if (email && !regexpStr.test(email)) {
                SASEE.alert({ msg: '请输入有效的邮箱地址！' });
                return;
            }
            if (!validate || validate(data)) {
                $.get(url, data).done(msg => {
                    SASEE.requestDone(msg);
                    SASEE.counter({
                        count: 60,
                        doing: count => {
                            $button[0].setAttribute('disabled', true);
                            $button[0].innerText = count + 's';
                        },
                        done: () => {
                            $button[0].innerText = '发送验证码';
                            $button[0].removeAttribute('disabled');
                        }
                    });
                }).fail(SASEE.requestFail);
            } else {
                ifNotValid && ifNotValid(data);
            }
        });
    };
})(window.jQuery);