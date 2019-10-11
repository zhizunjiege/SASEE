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

    SASEE.initNews = () => {
        function _loadNewsContent(e) {
            SASEE._loadContent('#news_content', {
                type: 'newsContent',
                id: $(e.target).closest('li').data('id')
            }, () => {
                SASEE._subjectToggle('#news_content', '#news_list');
            });
        }
        $('#news_list>ul').click(_loadNewsContent);
        SASEE.instPagination({
            container: '#news_list>ul',
            pagination: '#news_pagination',
            url: SASEE.URL_VIEWS + '/newsList'
        });
    };

})(window.jQuery);