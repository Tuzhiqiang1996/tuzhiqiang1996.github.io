// 手机端菜单是否展开
let phoneIsOn = false;
// 手机端底部导航
let phoneTop = false;
// 音乐
let player = null;
let pjax = null;

$(document).ready(function () {
    initLayui();
    initEvent();
    initPjax();
    initMusic();
    initPhoneEvent();
    initRightPanel();
    initScroll();
    loadPageInit();
});

/**
 * 初始化右侧边栏数据
 */
function initRightPanel() {
    dayDiff();
    initTagsColor();
    formatMsgTime();
}

/**
 * 初始化layui相关
 */
function initLayui() {
    layui.config({
        // base: '/templates/perfree-simple-pro/static/plugins/laynotice/'
        base: '../plugins/laynotice/'
    });
    layui.use(['element','notice'], function(){
        const element = layui.element,lay_notice = layui.notice;
    });
}

/**
 * 初始化彩色标签云
 */
function initTagsColor() {
    $('.perfree-tag').each(function(){
        $(this).css("background-color",common.getRandomColor());
    })
}

/**
 * 初始化pjax
 */
function initPjax() {
    $(document).pjax('.pjax', '.p-container-box',{
        push: false,
        scrollTo: 0,
        replace: true,
        fragment: '.p-container-box'
    });
    let index;
    $(document).on('pjax:send', function() {
        index = layer.load();
    });
    $(document).on('pjax:success', function() {
        loadPageInit();
        initRightPanel();
        layer.close(index);
    });
    $(document).on('pjax:complete', function() {
        layer.close(index);
    });
}

/**
 * 初始化音乐相关
 */
function initMusic() {
    player = new skPlayer({
        autoplay: false,
        listshow: false,
        mode: 'listloop',
        music: {
            type: 'cloud',
            source: "auto"
        }
    });
}

/**
 * 初始化事件监听
 */
function initEvent() {
    // 音乐鼠标移入移出事件
    $('#skPlayer').on('mouseenter', '.skPlayer-control', function() {
        $(".skPlayer-percent").css({"opacity":1});
    });
    $('#skPlayer').on('mouseleave', '.skPlayer-control', function() {
        $(".skPlayer-percent").css({"opacity":0});
    });
    // 窗口大小改变事件
    $(window).resize(function () {
        $(".p-left-bottom-box").removeAttr("style");
        $(".p-right-box").removeAttr("style");
        $(".p-left-box").removeAttr("style");
        $(".p-left-box-2").removeAttr("style");
        $(".p-container-box").removeAttr("style");
        $(".p-left-menu-nav-txt").removeAttr("style");
        $(".p-left-user-img-box").removeAttr("style");
        $(".p-left-user-name-box").removeAttr("style");
        $(".p-left-logo-box-text-name").removeAttr("style");
        $(".p-header-box-music-box").removeAttr("style");
        $(".p-phone-top-nav").removeAttr("style");
        $("#phoneOnOffMenu").html('<i class="layui-icon">&#xe668;</i> ');
        phoneIsOn = false;
        phoneTop = false;
    });

    //图片查看支持鼠标放大缩小
    $(document).on("mousewheel DOMMouseScroll", ".layui-layer-phimg img", function(e) {
        let delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
        let imagep = $(".layui-layer-phimg").parent().parent();
        let image = $(".layui-layer-phimg").parent();
        let h = image.height();
        let w = image.width();
        if(delta > 0) {
            if(h < (window.innerHeight)) {
                h = h * 1.05;
                w = w * 1.05;
            }
        } else if(delta < 0) {
            if(h > 100) {
                h = h * 0.95;
                w = w * 0.95;
            }
        }
        imagep.css("top", (window.innerHeight - h) / 2);
        imagep.css("left", (window.innerWidth - w) / 2);
        image.height(h);
        image.width(w);
        imagep.height(h);
        imagep.width(w);
    });
    // 手机端底部导航点击事件
    $(".p-header-box-right-box").on('click','#phoneSetting',function(){
        if(phoneTop){
            $(".p-header-box-music-box").hide();
            $(".p-phone-top-nav").hide();
            phoneTop = false;
        }else{
            $(".p-header-box-music-box").show();
            $(".p-phone-top-nav").show();
            phoneTop = true ;
        }
    })
}


/**
 * 初始化手机端菜单事件
 */
function initPhoneEvent() {
    // 手机端菜单点击按钮事件
    $('.p-header-box-menu-btn').on('click','#phoneOnOffMenu',function(){
        if(phoneIsOn){
            //菜单已展开
            $("#phoneOnOffMenu").html('<i class="layui-icon">&#xe66b;</i> ');
            $(".p-left-box").animate({left:"-300px"},500);
            $(".p-container-box").animate({left:"0px"},500);
            phoneIsOn = false;
        }else{
            //菜单已关闭
            phoneIsOn = true;
            $("#phoneOnOffMenu").html('<i class="layui-icon">&#xe668;</i> ');
            $(".p-left-box").animate({left:"0px"},500);
            $(".p-container-box").animate({left:"300px"},500);
        }
    });
    // 手机菜单展开时,点击其他地方关闭菜单
    $('.p-box').on('click','.p-container-box',function(){
        if(phoneIsOn){
            $("#phoneOnOffMenu").click();
        }
    })
    $(".p-left-menu-box").on('click','.nav-menu-a',function(){
        if(phoneIsOn){
            $("#phoneOnOffMenu").click();
        }
    })
}

/**
 * 展开左侧菜单
 */
function onMenu(){
    $("#onOffMenu").html('<i class="layui-icon">&#xe668;</i> ');
    $(".p-left-logo-box-text-name").show("fast");
    $(".p-left-bottom-box").show("fast");
    $(".p-left-menu-nav-txt").show("fast");
    $(".p-left-box .layui-nav-tree .layui-nav-more").show("fast");
    $(".p-left-box .layui-nav .layui-nav-item a").animate({padding:'0 20px'},"fast");
    $(".p-left-user-img-box").animate({width:'100px',height:'100px'},"fast");
    $(".p-left-logo-box-text").animate({paddingLeft:'10px'},"fast");
    $(".p-left-box").animate({width:'220px'},"fast");
    $(".p-left-box-2").animate({width:'237px'},"fast");
    $(".p-right-box").animate({paddingLeft:'220px'},"fast");
    $(".p-left-box .layui-nav .layui-nav-child dd").show("fast");
    setTimeout(showText, 350);
}

/**
 * 显示文本
 */
function showText() {
    $(".p-left-user-name-box").show();
    $(".p-left-user-hitokoto-box").show();
}

/**
 * 闭合左侧菜单
 */
function offMenu(){
    $("#onOffMenu").html('<i class="layui-icon">&#xe66b;</i> ');
    $(".p-left-logo-box-text-name").hide();
    $(".p-left-user-name-box").hide();
    $(".p-left-user-hitokoto-box").hide();
    $(".p-left-menu-nav-txt").hide();
    $(".p-left-bottom-box").hide();
    $(".p-left-box .layui-nav-tree .layui-nav-more").hide();
    $(".p-left-box .layui-nav .layui-nav-item a").css({padding:'0 13px'});
    $(".p-left-user-img-box").css({width:'30px',height:'30px'});
    $(".p-left-logo-box-text").animate({paddingLeft:'5px'},"fast");
    $(".p-left-box").animate({width:'50px'},"fast");
    $(".p-left-box-2").animate({width:'67px'},"fast");
    $(".p-right-box").animate({paddingLeft:'50px'},"fast");
    $(".p-left-box .layui-nav .layui-nav-child dd").css({"display":"none"});
}

/**
 * 初始化运行多少天
 */
function dayDiff(){
    let date = $("#initDay").text();
    let dateBegin = new Date(date.replace(/-/g, "/"));
    let dateEnd = new Date();
    let dateDiff = dateEnd.getTime() - dateBegin.getTime();
    let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
    $("#dayDiff").text(dayDiff+"天");
}

/**
 * 初始化最近活动时间
 */
function formatMsgTime() {
    let dateTimeStamp = Date.parse($("#articleLastTime").text().replace(/-/gi, "/"));
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    let now = new Date().getTime();
    let diffValue = now - dateTimeStamp;
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;
    let result;
    if (monthC >= 1) {
        result = parseInt(monthC) + "月前";
    }
    else if (weekC >= 1) {
        result = parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
        result = parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
        result = parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
        result = parseInt(minC) + "分钟前";
    } else
        result = "刚刚";
    $("#articleLastTimeDiff").text(result);
}

/**
 * 初始化返回顶部操作
 */
function initScroll() {
    $('.go-top').hide();        //隐藏go to top按钮
    $(window).scroll(function(){
        if($(this).scrollTop() > 100){
            $('.go-top').fadeIn();
        }else{
            $('.go-top').fadeOut();
        }
    });
    $('.go-top').click(function(){
        $('html ,body').animate({scrollTop: 0}, 300);
        return false;
    });
}

/**
 * 加载页面的init方法
 */
function loadPageInit() {
    if (common.isExitsFunction("pageInit")){
        pageInit();
    }
}