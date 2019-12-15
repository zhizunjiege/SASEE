{
    window.SASEE || (window.SASEE = {});
    const { SASEE, $ } = window;
    $.fn.extend({
        serializeObject: function () {
            let dataObj = {},
                dataArray = this.serializeArray();
            for (const iterator of dataArray) {
                let field = dataObj[iterator.name];
                if (field) {
                    if (Array.isArray(field)) {
                        field.push(iterator.value);
                    } else {
                        dataObj[iterator.name] = [field, iterator.value];
                    }
                } else {
                    dataObj[iterator.name] = iterator.value;
                }
            }
            return dataObj;
        }
    });
    $.extend({
        json: function ({ url, data }) {
            return $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(data),
                contentType: 'application/json;charset=UTF-8'
            })
        }
    });
    $.ajaxSetup({
        headers: {
            Frame: 'jQuery'
        }
    });
    SASEE.alert = ({ msg = '网络错误，请稍后重试！', static = true, count = 0, buttonHide = false } = {}) => {
        $('.alert>span').text(msg);
        if (buttonHide) {
            $('.alert>button').hide();
        } else {
            $('.alert>button').show();
        }
        $('.alert-modal').modal(static ? {
            backdrop: 'static',
            keyboard: false
        } : null);
        count && SASEE.counter({
            count: count,
            done: () => {
                $('.alert-modal').modal('hide');
            }
        });
    };
    SASEE.requestDone = msg => {
        SASEE.alert({
            msg: msg,
            static: false,
            count: 2,
            buttonHide: true
        });
    };
    SASEE.requestFail = xhr => {
        let location = xhr.getResponseHeader('Location'),
            buttonHide = false;
        if (location) {
            buttonHide = true;
            SASEE.counter({
                count: 2,
                done: () => {
                    window.location.href = location;
                }
            });
        }
        SASEE.alert({
            msg: xhr.responseText,
            buttonHide: buttonHide
        })
    }

    SASEE.formSubmit = ({ file = false, editor = null, selector, url, validate, ifNotValid, preprocess = null, done, fail = SASEE.requestFail, always } = {}) => {
        let $form = $(selector);
        if (file) {
            let $file = $('input[type=file]', selector);
            $file.change((e) => {
                let file = $file[0].files[0], regexpStr = /\.(?:zip|rar|7z|xls|xlsx|doc|docx)$/;
                if (!regexpStr.test(file.name)) {
                    $file[0].value = '';
                    SASEE.alert({ msg: '仅支持doc、docx、xls、xlsx、zip，rar和7z格式！' });
                } else if (file.size > SASEE.FILE_MAXSIZE) {
                    $file[0].value = '';
                    SASEE.alert({ msg: '文件大小不能超过' + SASEE.FILE_MAXSIZE / 1048576 + 'M!' });
                } else {
                    $(e.target).next().find('small').text(file.name);
                }
            });
        }
        $form[0].onsubmit = (e) => {
            e.preventDefault();
            if (!validate || validate($form)) {
                let ajaxObj = null;
                if (file) {
                    let data = new FormData($form[0]);
                    data.has('password') && data.set('password', objectHash.MD5(data.get('password')));
                    ajaxObj = $.ajax({
                        url: url,
                        type: 'POST',
                        cache: false,
                        data,
                        processData: false,
                        contentType: false
                    });
                } else {
                    let data = preprocess ? preprocess($form, editor) : $form.serializeObject();
                    data.password && (data.password = objectHash.MD5(data.password));
                    data.oldPW && (data.oldPW = objectHash.MD5(data.oldPW));
                    data.newPW && (data.newPW = objectHash.MD5(data.newPW));
                    editor && (data.content = editor.txt.html());
                    ajaxObj = $.json({ url, data });
                }
                ajaxObj.done(done).fail(fail).always(always);
            } else {
                ifNotValid && ifNotValid($form);
            }
        };
    };

    SASEE.timeDifference = (date1, date2) => {
        let time1 = new Date(date1).valueOf(),
            time2 = new Date(date2).valueOf(),
            time = time2 - time1,
            _time = time;

        let divMap = [1000, 60, 60, 24, 365, 100], nameMap = ['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'years'], returnObj = {};
        for (const [index, value] of divMap.entries()) {
            returnObj[nameMap[index]] = _time % value;
            _time = Math.floor(_time / value);
        }
        returnObj.time = time;
        return returnObj;
    };

    SASEE.counter = ({ count, doing, done } = {}) => {
        function _countDown() {
            if (count) {
                doing && doing(count);
                count--;
                setTimeout(() => {
                    _countDown();
                }, 1000);
            } else {
                done && done();
            }
        }
        _countDown();
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
}