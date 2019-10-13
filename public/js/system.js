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
            $(container).find('.sys-content').html(html);
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
            $.get(url, { page }).done(html => {
                $container.empty().append(html);
                $now[0].children[0].innerText = page;
            }).fail(SASEE.requestFail);
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

    SASEE.initNewsFrame = () => {
        $('#news>.sys-list>ul').click(e => {
            SASEE._loadContent({
                container: '#news',
                url: SASEE.URL_VIEWS + '/newsContent',
                data: {
                    id: $(e.target).closest('li').data('id')
                },
                done: () => {
                    SASEE._showListOrContent({
                        container: '#news',
                        flag: false
                    });
                }
            });
        });
        SASEE.instPagination({
            container: '#news>.sys-list>ul',
            pagination: '#news .sys-pagination',
            url: SASEE.URL_VIEWS + '/newsList'
        });
    };

})(window.jQuery);