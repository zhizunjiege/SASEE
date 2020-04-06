Date.prototype.toLocaleISOString = function () {
    return new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString().replace('Z', '');
};
$.extend({
    ajaxPromise(options) {
        return new Promise((resolve, reject) => {
            $.ajax(options).done(data => {
                resolve(data);
            }).fail(err => {
                reject(err);
            });
        });
    },
    getPromise(url, query) {
        return this.ajaxPromise({
            type: 'GET',
            url,
            data: query,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8'
        });
    },
    postPromise(url, data) {
        return this.ajaxPromise({
            type: 'POST',
            url,
            data: JSON.stringify(data),
            contentType: 'application/json;charset=UTF-8'
        });
    }
});
$.ajaxSetup({
    headers: {
        Frame: 'jQuery'
    }
});



/*     util.instEditor = (container, full = false) => {
        let editor = new window.wangEditor(container + ' .editor');
        // editor.customConfig.uploadImgShowBase64 = true;
        editor.customConfig.uploadImgServer = './editorImg';
        editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
        editor.customConfig.uploadImgMaxLength = 1;
        editor.customConfig.uploadImgTimeout = 3000;
        editor.customConfig.uploadFileName = 'file';
        editor.customConfig.customAlert = function (info) {
            util.alert(info)
        }

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

        editor.create();
        $(container + ' .editor-clear').click(() => {
            editor.txt.clear();
        });
        return editor;
    };
    util.instPagination = ({ container, pagination, url, max = 10 } = {}) => {
        let $container = $(container),
            $pagination = $(pagination),
            $previous = $pagination.find('.previous'),
            $now = $pagination.find('.now'),
            $next = $pagination.find('.next'),
            totalPage = Math.ceil(Number($pagination.data('total')) / max);
        function _now() {
            return Number($now[0].children[0].innerText);
        }
        function _load(offset) {
            let page = _now() + offset;
            if (totalPage > 0) {
                $.get(url, { page }).done(html => {
                    $container.empty().append(html);
                    $now[0].children[0].innerText = page;
                }).fail(util.requestFail);
            } else {
                util.alert({ msg: '未获取到内容，请刷新页面或重新登陆！' });
            }
        }
        $previous.click(e => {
            if (_now() > 1) {
                _load(-1);
            } else {
                _load(totalPage - 1);
            }
        });
        $now.click(e => {
            _load(0);
        });
        $next.click(e => {
            if (_now() < totalPage) {
                _load(1);
            } else {
                _load(1 - totalPage);
            }
        });
    };

    util.formSubmit = ({ file = false, editor = null, el, url, validate, ifNotValid, preprocess = null, done, fail = util.requestFail, always } = {}) => {
        //需要防止连续提交，利用flag
        let flag = true;
        let $form = $(el);
        let $popover = $form.find('button[type=submit]').popover({
            content: '已经提交过了哦，请等待返回的结果',
            container: $form,
            placement: 'top',
        }).popover('disable');
        if (file) {
            let $file = $('input[type=file]', el);
            $file.change((e) => {
                let file = $file[0].files[0], regexpStr = /\.(?:zip|rar|7z|xls|xlsx|doc|docx|pdf|tar\.gz|txt)$/;
                if (!regexpStr.test(file.name)) {
                    $file[0].value = '';
                    util.alert({ msg: '仅支持pdf、doc、docx、xls、xlsx、zip、rar、tar.gz和7z格式！' });
                } else if (file.size > util.FILE_MAXSIZE) {
                    $file[0].value = '';
                    util.alert({ msg: '文件大小不能超过' + util.FILE_MAXSIZE / 1048576 + 'M!' });
                } else {
                    $(e.target).next().find('small').text(file.name);
                }
            });
        }
        $form[0].onsubmit = (e) => {
            e.preventDefault();
            if (flag) {
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
                    ajaxObj.done(done).fail(fail).always(() => {
                        flag = true;
                        $popover.length && $popover.popover('hide').popover('disable');
                        always && always();
                    });
                    flag = false;
                } else {
                    ifNotValid && ifNotValid($form);
                }
            } else {
                $popover.length && $popover.popover('enable').popover('show');
            }
        };
    }; */
