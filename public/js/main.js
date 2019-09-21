'use strict';
(function ($) {
    window.SASEE = {
        URL_VIEWS: './views',
        URL_FILE: './file',
        URL_UPLOAD: './upload',
        URL_PW:'./password',
        URL_CHOOSE:'./choose',
        URL_DOWNLOAD:'./download',
        URL_EMAIL:'./email',
        URL_LOGOUT:'./logout',
        FILE_MAXSIZE: 5 * 1024 * 1024
    };
    const SASEE = window.SASEE;

    SASEE._contentBarToggle = () => {
        $('#contents_back').toggle();
        $('#contents_title').toggle();
    };
    SASEE._subjectToggle = (content, list, flag) => {
        if (flag) {
            $(content).hide();
            $(list).show();
        } else {
            $(content).toggle();
            $(list).toggle();
        }
    };
    SASEE._loadContent = (e, content, type, callback) => {
        document.getElementById('contents_back').onclick = callback;
        $(content).load(SASEE.URL_VIEWS, 'type=' + type + '&id=' + $(e.currentTarget).data('id'), callback);
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
                        url: SASEE.URL_UPLOAD,
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

    SASEE.fileUpload = (selector) => {
        var $fileForm = $(selector);
        $fileForm.submit((e) => {
            e.preventDefault();
            var formData = new FormData($fileForm[0]);
            $.ajax({
                url: SASEE.URL_UPLOAD,
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false
            }).done(() => {
                console.log('done!');

            }).fail(() => {
                console.log('failed!');

            });
        });
    };
    SASEE.fileCheck = (selector) => {
        var $file = $(selector);
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
    };

    $(function ($) {
        //初始化
        function _loadFrame($target) {
            let href = $target.attr('href');
            let data = $target[0].dataset;
            let type = data.type ? 'type=' + data.type : '';
            if (!$(href).length) {
                let queryStr = type;
                $('<div>', {
                    "id": href.substring(1),
                    "class": "collapse",
                    "data-parent": "#contents"
                }).appendTo('#contents>div>div').collapse({
                    parent: '#contents',
                    toggle: true
                }).load(SASEE.URL_VIEWS, queryStr);
            }
        }
        function _loadNewsContent(e) {
            SASEE._loadContent(e, '#news_content', 'newsContent', (e) => {
                SASEE._contentBarToggle();
                SASEE._subjectToggle('#news_content', '#news_list');
            })
        }

        $('#news_list ul>li').click(_loadNewsContent);
        SASEE.instScroll('.infinite-scroll-container-1', function () {
            let page=Number($('#news_list').data().page);
            if (page) {
                return SASEE.URL_VIEWS + '?type=newsList&nextPage=' + (page+1);
            }
        }, '.list-group-item', 400, '#news_list', false, '.infinite-scroll-status-1', '.infinite-scroll-button-1', null, (e, res, path, items) => {
            $(items).click(_loadNewsContent);
        });
        $('#_toggle_user_info,#navigator a[href="#news"],#navigator ul>a').each((index, element) => {
            var $element = $(element);
            $element.click((e) => {
                let $target = $(e.currentTarget);
                if ($target.data('sub')) {
                    SASEE._subjectToggle($target[0].dataset.content, $target[0].dataset.list, true);
                }
                $('#contents_back').hide();
                $('#contents_title').show().text($element.text());
                _loadFrame($target);
            })
        });
    });
})(window.jQuery);
