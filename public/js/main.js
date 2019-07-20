(function ($) {
    //const CONTENTS_NEWSPS = 10;
    const URL_VIEW = '/views';
    const URL_NEWS_CONTENT = '/doc/notice.html';
    const URL_REQUEST = '/request';
    const URL_UPLOAD = '/upload';
    //const URL_SUBJECT_CONTENT='/views';

    $(function ($) {

        //封装infinite-scroll函数
        function instScroll(context, container, path, append, scrollThreshold, elementScroll, loadOnScroll, status, button, loadCallback, appendCallback) {
            var $infiniteScrollObj = $(container, context).infiniteScroll({
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
            };
            if (button) {
                $(button, context).click(() => {
                    $(container, context).infiniteScroll('loadNextPage');
                    $infiniteScrollObj.infiniteScroll('option', {
                        loadOnScroll: true
                    });
                    $(button, context).hide();
                });
            };

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

        //点击news
        function contentBarToggle() {
            $('#contents_back').toggle();
            $('#contents_title').toggle();
        };
        function newsToggle() {
            contentBarToggle();
            $('#news_content').toggle();
            $('#news_list').toggle();
        };
        function subjectToggle() {
            contentBarToggle();
            $('#subject_content').toggle();
            $('#subject_list').toggle();
        }
        function loadNewsContent(e) {
            document.getElementById('contents_back').onclick = newsToggle;
            $('#news_content').load(URL_NEWS_CONTENT, 'type=newsContent&' + 'num=' + $(e.currentTarget).index(), newsToggle);
        };
        function loadSubjectContent(e) {
            document.getElementById('contents_back').onclick = subjectToggle;
            $('#subject_content').load(URL_VIEW, 'type=subjectContent&' + 'num=' + $(e.currentTarget).index(), () => {
                subjectToggle();
                $('#subject_check_submit').click(function (e) {
                    e.preventDefault();
                    this.form.action = URL_REQUEST;
                    this.form.submit();
                });
            });
        };
        function clickToLoadContent(context, item, loadContent) {
            $(item, $(context)).click(loadContent);
        };
        instScroll(document, '.infinite-scroll-container', function () {
            if (this.loadCount + 2 <= $('#news_list').data().page) {
                return URL_VIEW + '?type=newsList&nextPage=' + (this.loadCount + 2);
            }
        }, '.list-group-item', 400, '#news_list', false, '.infinite-scroll-status', '.infinite-scroll-button', null, (e, res, path, items) => {
            for (let i = 0; i < items.length; i++) {
                clickToLoadContent('#news_list', items[i], loadNewsContent);
            }
        });

        //初始化各条目
        clickToLoadContent('#news_list', 'ul>li', loadNewsContent);
        $('#navigator a[href="#news"]').click(() => {
            $('#contents_back').hide();
            $('#contents_title').show().text('通知');
            $('#news_content').hide();
            $('#news_list').show();
        });
        $('#navigator a[href="#bysj_xt"]').click(() => {
            $('#subject_content').hide();
            $('#subject_list').show();
        });
        //封装加载其余框架的函数
        function loadFrame(e, type, callback) {
            var href = $(e.currentTarget).attr('href');
            if (!$(href).length) {
                $('<div>', {
                    "id": href.substring(1),
                    "class": "collapse",
                    "data-parent": "#contents"
                }).appendTo('#contents>div').collapse({
                    parent: '#contents',
                    toggle: true
                }).load(URL_VIEW, 'type=' + type, callback);
            }
        };

        //个人信息的加载
        $('#_toggle_user_info').click((e) => {
            $('#contents_back').hide();
            $('#contents_title').show().text('个人信息');
            loadFrame(e, 'userInfo', () => {
                $('#modifyPW_submit').click(function (e) {
                    e.preventDefault();
                    if (this.form.pw_new.value == this.form.pw_repeat.value) {
                        this.form.action = URL_REQUEST;
                        this.form.submit();
                    } else {
                        $(this).popover({
                            selector: '#modifyPW_submit',
                            html: true,
                            content: '<h5 class="text-warning">密码不匹配！</h5>',
                            container: '#modifyPW_modal',
                            placement: 'top'
                        }).popover('toggle');
                    }
                });
            });
        });

        function loadSubject() {
            clickToLoadContent(this, '.infinite-scroll-item', loadSubjectContent);
            instScroll(this, '.infinite-scroll-container-2', function () {
                if (this.loadCount + 2 <= $('#subject_list').data().page) {
                    return URL_VIEW + '?type=subjectList&nextPage=' + (this.loadCount + 2);
                }
            }, '.infinite-scroll-item', 400, '#subject_list', true, '.infinite-scroll-status-2', null, null, (e, res, path, items) => {
                for (let i = 0; i < items.length; i++) {
                    clickToLoadContent(document, items[i], loadSubjectContent);
                }
            });
        };

        function loadMySubject() {
            $.getScript('/js/wangEditor.min.js', () => {
                var WE = window.wangEditor;
                var editor = new WE('#editor');

                editor.customConfig.uploadImgShowBase64 = true;
                //editor.customConfig.uploadImgServer=URL_UPLOAD;

                editor.create();

                $('#editor_clear').click(() => {
                    editor.txt.clear();
                });
                $('#editor_submit').click(() => {
                    /*
                    var myform=new FormData();
                    myform.append('first',editor.txt.html());
                    myform.append('type','notice');
                    $.ajax({
                        url:URL_UPLOAD,
                        type:'POST',
                        cache:false,
                        data:myform,
                        processData:false,
                        contentType:'text/plain'
                    }).done(()=>{
                        console.log('successed!');
                        
                    });
                    */
                });
            });
        };

        var arrayLoadCallback = [
            loadSubject,
            loadMySubject
        ];
        var arrayLoadType = [
            'subject',
            'mySubject'
        ];

        //各个阶段的加载
        $('#navigator ul>a').each((index, element) => {
            $(element).click((e) => {
                $('#contents_back').hide();
                $('#contents_title').show().text($(element).find('small').text());
                loadFrame(e, arrayLoadType[index], arrayLoadCallback[index]);
            })
        });
    });
})(window.jQuery);


