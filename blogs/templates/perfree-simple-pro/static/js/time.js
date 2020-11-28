function pageForInit(articles) {
    layui.use('laypage', function(){
        let laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'timeLinePage',
            count: articles.length,
            theme: '#337ab7',
            limit: 9,
            jump: function(obj, first){
                let timeIndex = layer.load();
                $("#timelineBox").html('');
                let html = '';
                let start = 0;
                if(obj.curr > 1){
                    start = (obj.curr-1) *9;
                }
                for (var i = start;i< articles.length;i++){
                    if(i <= start + 8){
                        var articleHtml = '<li class="layui-timeline-item">'+
                            '<i class="layui-icon layui-timeline-axis">&#xe63f;</i>' +
                            '<div class="layui-timeline-content layui-text">' +
                            '<h3 class="layui-timeline-title">'+articles[i].created+'</h3>' +
                            '<span class="time-box-top"><i class="fa fa-caret-up"></i></span>' +
                            '<a href="'+articles[i].url+'" title="'+articles[i].title+'" class="pjax">' +
                            articles[i].title+
                            '</a>' +
                            '</div>' +
                            '</li>';
                        html += articleHtml;
                    }
                }
                $("#timelineBox").append(html);
                $("html,body").animate({scrollTop:$('.p-content-box').offset().top},300);
                layer.close(timeIndex);
                //首次不执行
                if(!first){
                    //do something
                }
            }
        });
    });
}