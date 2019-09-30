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

        FILE_MAXSIZE: 5 * 1024 * 1024
    };
    const SASEE = window.SASEE;

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
    SASEE._loadContent = (content, param, callback) => {
        document.getElementById('contents_back').onclick = callback;
        $.get(SASEE.URL_VIEWS + '/' + param.type, {
            id: param.id
        }).done(html => {
            $(content).html(html);
            callback();
        }).fail(SASEE.requestFail);
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
    SASEE.instEditor = (container, full = false) => {
        let editor = new window.wangEditor(container + ' .editor');
        editor.customConfig.uploadImgShowBase64 = true;
        editor.customConfig.zIndex = 1000;

        let featureBase = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'justify',  // 对齐方式
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'undo',  // 撤销
            'redo'  // 重复
        ], featureExtend = [
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'list',  // 列表
            'table',  // 表格
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'video',  // 插入视频
            'code',  // 插入代码
        ];
        editor.customConfig.menus = full ? featureBase.concat(featureExtend) : featureBase;
        //editor.customConfig.uploadImgServer
        editor.create();
        $(container + ' .editor-clear').click(() => {
            editor.txt.clear();
        });
        return editor;
    };

    SASEE.alert = ({ msg = '网络错误，请稍后重试！', static = true, count = 0, buttonHide = false } = {}) => {
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

    SASEE.formSubmit = ({ file = false, selector, url, validate, ifNotValid, done, fail = SASEE.requestFail, always } = {}) => {
        let $form = $(selector);
        if (file) {
            let $file = $('input[type=file]', selector);
            $file.change((e) => {
                let file = $file[0].files[0];
                let regexpStr = /\.(?:zip|rar|7z)$/;
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