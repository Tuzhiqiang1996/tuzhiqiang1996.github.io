function pageForInit() {
    initHljs();
    initToc();
    initComment();
    initRevert();
    initPreAndNext();
}

/**
 * 初始化代码样式
 */
function initHljs() {
    hljs.initHighlighting();
    $('pre code').each(function(){
        let edit = $("#edit-model").text();
        let lines = $(this).text().split('\n').length-1;
        if(edit === 'html'){
            lines = $(this).text().split('\n').length;
        }
        let $numbering = $('<ul/>').addClass('pre-numbering hljs');
        $(this).addClass('has-numbering').parent().append($numbering);
        for(let i=1;i<=lines;i++){
            $numbering.append($('<li/>').text(i+"."));
        }
    });
}

/**
 * 初始化文章导航
 */
function initToc() {
    let toc = $("#toc").tocify({context:"article",selectors:"h2,h3",extendPage:false});
    let tocHtml = toc[0];
    if(tocHtml.getElementsByTagName("li").length > 0){
        $("#toxBox").show();
    }else{
        $("#toxBox").hide();
    }
}

/**
 * 初始化渲染评论内容
 */
function initComment() {
    $("#allComment").hide();
    let comment = $(".p-revert-content");
    for (let i = 0; i < comment.length; i ++){
        let text = $(comment[i]).text();
        text = text.replace(/<script.*?>.*?<\/script>/ig, '');
        text = text.replace(/<style.*?>.*?<\/style>/ig, '');
        text = text.replace(/<html.*?>.*?<\/html>/ig, '');
        $(comment[i]).html(text);
    }
    $("#allComment").show();
}
/**
 * 初始化评论相关
 */
function initRevert() {
    layui.use(['layedit','form','jquery','notice'], function(){
        let layedit = layui.layedit,form=layui.form,$=layui.jquery,lay_notice = layui.notice;
        //建立编辑器
        let edit = layedit.build('revert',{
            height: 120,
            tool: ['strong','italic','underline','del','link', 'face']
        });
        $(".captcha").val("");
        layedit.clearContent(edit);
        $(".comment-verify").click();
        //利用表单验证将编辑器值赋予textarea
        form.verify({
            content: function(value, item) {
                layedit.sync(edit);
            }
        });
        let pRevertContent,pRevertAuthor,pRevertCreated,pRevertAvatar;
        //监听回复按钮点击事件
        $('.p-article-revert-container').on('click','.p-revert-btn', function () {
            $('#revertPid').val($(this).attr('data-cid'));
            $('#revert').val('回复 @' + $(this).attr('data-author') + " ：");
            edit = layedit.build('revert', {
                tool: ['strong','italic','underline','del','link', 'face'],
                height: 120
            });
            //记录父级评论内容
            pRevertContent = $(this).siblings(".p-revert-content").text();
            pRevertAuthor = $(this).siblings(".p-revert-user").children(".p-article-revert-container-right").children(".p-revert-user-name").text();
            pRevertCreated = $(this).siblings(".p-revert-user").children(".p-article-revert-container-right").children(".p-revert-time").text();
            pRevertAvatar = $(this).siblings(".p-revert-user").children("img").attr("src");
            document.querySelector(".p-article-comment-box").scrollIntoView(true);

        });
        //监听form提交
        form.on('submit(comment)', function(data){
            let content = layedit.getContent(edit);
            if(content == null || content === "" || content === undefined){
                lay_notice.error('请填写评论内容');
                return false;
            }
            let captcha = $(".captcha").val();
            let str = '回复 @' + pRevertAuthor + " ：";
            let revertContent = $("#revert").val();
            //判断回复是否存在
            if(!new RegExp(str).test(revertContent)){
                $('#revertPid').val('');
            }else {
                revertContent = revertContent.replace(str,'');
            }
            $.ajax({
                type : "post",
                url:"/article/postComment",
                data: {articleId:$("#articleId").val(),pid: $('#revertPid').val(),content: revertContent,captcha:captcha},
                success:function(result){
                    if(result.state === "ok"){
                        lay_notice.success("评论成功");
                        $.pjax.reload({container:"#allComment",fragment: '#allComment'});
                    }else{
                        lay_notice.error('评论失败:' + result.message);
                        $(".captcha").val("");
                        $(".comment-verify").attr("src",'/commons/captcha?d='+Math.random());
                        if (data.errorCode === 9) {
                            location.href = '../../../../user/login.htm'/*tpa=http://www.jpress.yinpengfei.com/user/login*/;
                        }
                    }
                    return false;
                },
                error:function () {
                    lay_notice.error('网络错误，请稍后重试');
                    $(".captcha").val("");
                    $(".comment-verify").attr("src",'/commons/captcha?d='+Math.random());
                    return false;
                }
            });
            return false;
        });
    });

    layer.photos({
        photos: '#articleContent',
        anim: 5
    });
}
/**
 * 初始化上一篇下一篇事件
 */
function initPreAndNext() {
    let index;
    $('.p-article-goto-box').on('mouseenter','#preArticle',function(){
        let preTitle = $("#preArticle").attr("title");
        index = layer.tips(preTitle, '#preArticle', {
            tips: 1
        });
    });
    $('.p-article-goto-box').on('mouseleave','#preArticle',function(){
        layer.close(index);
    });
    $('.p-article-goto-box').on('mouseenter','#nextArticle',function(){
        var preTitle = $("#nextArticle").attr("title");
        index = layer.tips(preTitle, '#nextArticle', {
            tips: 1
        });
    });
    $('.p-article-goto-box').on('mouseleave','#nextArticle',function(){
        layer.close(index);
    });
}

/**
 * 赞赏
 */
function appreciate() {
    layer.open({
        type: 1,
        title:'赞赏作者',
        shade: 0.6,
        anim: 1,
        shadeClose:true,
        area:["300px","350px"],
        content: $('#appreciate-content')
    });
}

/**
 * 赞赏图片切换
 * @param type
 */
function changeImg(type) {
    if (type === 1) {
        $(".layui-layer-wrap > #appreciate-content-wechatImg").hide();
        $(".layui-layer-wrap > #appreciate-content-aLiImg").show();
    } else {
        $(".layui-layer-wrap > #appreciate-content-aLiImg").hide();
        $(".layui-layer-wrap > #appreciate-content-wechatImg").show();
    }
}