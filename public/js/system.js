(function ($) {
    Date.prototype.toLocaleISOString = function () {
        return new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString().replace('Z', '');
    };
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
    const SASEE = window.SASEE;

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
    SASEE.instPagination = ({ container, pagination, url, max = 10 } = {}) => {
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
                }).fail(SASEE.requestFail);
            } else {
                SASEE.alert({ msg: '未获取到内容，请刷新页面或重新登陆！' });
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

    SASEE.instEditor = (container, full = false) => {
        let editor = new window.wangEditor(container + ' .editor');
        // editor.customConfig.uploadImgShowBase64 = true;
        editor.customConfig.uploadImgServer = './editorImg';
        editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
        editor.customConfig.uploadImgMaxLength = 1;
        editor.customConfig.uploadImgTimeout = 3000;
        editor.customConfig.uploadFileName = 'file';
        editor.customConfig.customAlert = function (info) {
            SASEE.alert(info)
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

})(window.jQuery);