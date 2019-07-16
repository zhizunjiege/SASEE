(function ($) {
    //const CONTENTS_NEWSPS = 10;
    const URL_VIEW = '/views';
    const URL_NEWS_CONTENT = '/doc/notice.html';
    const URL_REQUEST = '/request';
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
            $infiniteScrollObj.on('request.infiniteScroll', log);
            $infiniteScrollObj.on('load.infiniteScroll', log);
            $infiniteScrollObj.on('append.infiniteScroll', appendCallback);
            //$infiniteScrollObj.on('error.infiniteScroll', log);
            //$infiniteScrollObj.on('last.infiniteScroll', log);
        };

        //点击news
        function newsContentToggle() {
            $('#contents_header').children().toggle();
            $('#news').children().toggle();
        };
        function subjectContentToggle() {
            $('#contents_header').children().toggle();
            $('#bysj_xt').children().toggle();
        }
        function loadNewsContent(e) {
            $('#news_content').load(URL_NEWS_CONTENT, 'type=newsContent&' + 'num=' + $(e.currentTarget).index(), newsContentToggle);
        };
        function loadSubjectContent(e) {
            $('#subject_content').load(URL_VIEW, 'type=subjectContent&' + 'num=' + $(e.currentTarget).index(), subjectContentToggle);
        };
        function clickToLoadContent(item, loadContent) {
            $(item).click(loadContent);
        };
        
        instScroll(document, '.infinite-scroll-container', function () {
            if (this.loadCount + 2 <= $('#news_list').data().page) {
                return URL_VIEW + '?type=newsList&nextPage=' + (this.loadCount + 2);
            }
        }, '.list-group-item', 400, false, false, '.infinite-scroll-status', '.infinite-scroll-button',null, (e, res, path, items) => {
            for (let i = 0; i < items.length; i++) {
                clickToLoadContent(items[i], loadNewsContent);
            }
        });
        
        //初始化news条目
        clickToLoadContent('#news_list>ul>li', loadNewsContent);
        $('#contents_back').click(newsContentToggle);

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

        function loadSubject(e) {
            console.log(e);

            console.log(this);

            
            instScroll(document, '.infinite-scroll-container-2', function () {
                console.log($('#subject_list').data().page);
                
                if (this.loadCount + 2 <= $('#subject_list').data().page) {
                    return URL_VIEW + '?type=subjectList&nextPage=' + (this.loadCount + 2);
                }
            }, '.infinite-scroll-item', 100, false, true, '.infinite-scroll-status-2',null, (e,res,path)=>{
                console.log(res);
                
                $('.infinite-scroll-container-2').infiniteScroll('appendItems',$(res).find('.infinite-scroll-item'));
            },(e, res, path, items) => {
                console.log(items);
                
                for (let i = 0; i < items.length; i++) {
                    clickToLoadContent(items[i], loadSubjectContent);
                }
            });
            
        };


        var arrayLoadCallback = [
            loadSubject
        ];
        var arrayLoadType = [
            'subject'
        ];

        //各个阶段的加载
        $('#navigator ul>a').each((index, element) => {
            $(element).click((e) => {
                loadFrame(e, arrayLoadType[index], arrayLoadCallback[index]);
            })
        });
    });
})(window.jQuery);


