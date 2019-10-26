{
    window.SASEE || (window.SASEE = {});
    const { SASEE, $ } = window;
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

    SASEE.formSubmit = ({ file = false, editor = null, selector, url, validate, ifNotValid, done, fail = SASEE.requestFail, always } = {}) => {
        let $form = $(selector);
        if (file) {
            let $file = $('input[type=file]', selector);
            $file.change((e) => {
                let file = $file[0].files[0], regexpStr = /\.(?:zip|rar|7z)$/;
                if (!regexpStr.test(file.name)) {
                    $file[0].value = '';
                    SASEE.alert({ msg: '仅支持zip，rar和7z格式！' });
                } else if (file.size > SASEE.FILE_MAXSIZE) {
                    $file[0].value = '';
                    SASEE.alert({ msg: '文件大小不能超过' + SASEE.FILE_MAXSIZE / 1048576 + 'M!' });
                } else {
                    $file.next().find('small').text(file.name);
                }
            });
        }
        $form[0].onsubmit = (e) => {
            e.preventDefault();
            if (!validate || validate($form)) {
                let ajaxObj = null;
                if (file) {
                    ajaxObj = $.ajax({
                        url: url,
                        type: 'POST',
                        cache: false,
                        data: new FormData($form[0]),
                        processData: false,
                        contentType: false
                    });
                } else if (editor) {
                    let data = $form.serializeObject();
                    data.content = editor.txt.html();
                    ajaxObj = $.json({ url, data });
                } else {
                    ajaxObj = $.post(url, $form.serialize());
                }
                ajaxObj.done(done).fail(fail).always(always);
            } else {
                ifNotValid && ifNotValid($form);
            }
        };
    };

    SASEE.counter = ({ count, doing = () => { }, done = () => { } } = {}) => {
        function _countDown() {
            if (count) {
                doing(count--);
                setTimeout(() => {
                    _countDown();
                }, 1000);
            } else {
                done();
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