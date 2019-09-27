(function ($) {
    window.SASEE = {
        URL_VIEWS: './views',

        URL_FILE: './file',
        URL_UPLOAD: '/upload',
        URL_DOWNLOAD: '/download',

        URL_EMAIL: './email',
        URL_PINCODE: '/sendPinCode',
        URL_NOTICE: '/sendNotice',

        URL_INFO: './info',

        URL_LOGOUT: './logout',
        URL_PW: './password',

        URL_SUBJECT: './subject',
        URL_SUBMIT: '/submit',
        URL_MODIFY:'/modify',

        URL_CHOOSE: './choose',

        FILE_MAXSIZE: 5 * 1024 * 1024
    };
    const SASEE = window.SASEE;

    SASEE._contentBarToggle = () => {
        $('#contents_back').toggle();
        $('#contents_title').toggle();
    };
    SASEE._subjectToggle = (content, list, flag) => {
        SASEE._contentBarToggle();
        if (flag) {
            $(content).hide();
            $(list).show();
        } else {
            $(content).toggle();
            $(list).toggle();
        }
    };
    SASEE._loadContent = (e, content, param, callback) => {
        document.getElementById('contents_back').onclick = callback;
        $(content).load(SASEE.URL_VIEWS + '/' + param.type, param.id ? 'id=' + param.id : '', callback);
    };
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
    SASEE.instEditor = (container) => {
        if (typeof window.wangEditor == 'undefined') {

            $.getScript('/js/wangEditor.min.js').done(() => {
                const WE = window.wangEditor;
                const editor = new WE('#editor');

                editor.customConfig.uploadImgShowBase64 = true;
                //editor.customConfig.uploadImgServer=SASEE.URL_UPLOAD;

                editor.create();

                $('#editor_clear').click(() => {
                    editor.txt.clear();
                });
                $('#editor_submit').click(() => {
                    var myform = new FormData();
                    myform.append('content', editor.txt.html());
                    myform.append('type', 'notice');
                    $.ajax({
                        url: SASEE.URL_FILE + SASEE.URL_UPLOAD,
                        type: 'POST',
                        cache: false,
                        data: myform,
                        processData: false,
                        contentType: 'text/plain'
                    }).done(() => {
                        console.log('successed!');
                    });
                });
            });
        }
        if ($('#editor_container')[0].parentNode != $(container)[0]) {
            $(container).append($('#editor_container'));
        }
    };

    SASEE.alert = ({ msg, static = true, count = 0, buttonHide = false } = {}) => {
        $('.alert>span').text(msg);
        buttonHide && $('.alert>button').hide();
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
            msg:msg,
            static:false,
            count:2,
            buttonHide:true
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

    SASEE.formSubmit = ({ file = false, selector, url, validate, ifNotValid, done, fail = SASEE.requestFail, always } = {}) => {
        let $form = $(selector);
        if (file) {
            let $file = $('input[type=file]', selector);
            $file.change((e) => {
                let file = $file[0].files[0];
                let regexpStr = /\.(?:zip|rar|7z)$/;
                if (!regexpStr.test(file.name)) {
                    $file[0].value = '';
                    alert('仅支持zip，rar和7z格式！');
                } else if (file.size > SASEE.FILE_MAXSIZE) {
                    $file[0].value = '';
                    alert('文件大小不能超过' + SASEE.FILE_MAXSIZE / 1048576 + 'M!');
                } else {
                    $file.next().find('small').text(file.name);
                }
            });
        }
        $form.submit((e) => {
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
                } else {
                    ajaxObj = $.post(url, $form.serialize());
                }
                ajaxObj.done(done).fail(fail).always(always);
            } else {
                ifNotValid && ifNotValid($form);
            }
        });
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

})(window.jQuery);