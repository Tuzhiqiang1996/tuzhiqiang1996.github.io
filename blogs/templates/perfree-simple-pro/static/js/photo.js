function pageForInit() {
    layer.photos({
        photos: '#photoList',
        anim: 5
    });
    $('.p-photos-content-box').on('mouseenter', '.p-photo-link', function() {
        $(this).children('.p-photo-hover-bg').show();
    });
    $('.p-photos-content-box').on('mouseleave', '.p-photo-link', function() {
        $(this).children('.p-photo-hover-bg').hide();
    });
    layui.use(['form','notice'], function(){
        let form = layui.form,lay_notice = layui.notice;
        form.on('submit(checkPhoto)', function(data) {
            $.post("/photo/getPhoto", data.field, function (result) {
                if (result.state === 'ok') {
                    let html= "";
                    for (var i = 0; i < result.photo.photos.length; i++) {
                        html += '<a class="p-photo-link">'
                            +'<img src="' + result.photo.photos[i] + '"/>'
                            +'<span class="p-photo-hover-bg">'+result.photo.photos[i].substring(parseInt(result.photo.photos[i].lastIndexOf("/")+1),parseInt(result.photo.photos[i].lastIndexOf(".")))+'</span>'
                            +'</a>';
                    }
                    $("#photoList").html(html);
                    layer.photos({
                        photos: '#photoList',
                        anim: 5
                    });
                    $("#photoList").removeClass("photoListEnc");
                } else {
                    lay_notice.error("密码错误");
                }
            });
            return false;
        });
    });
}