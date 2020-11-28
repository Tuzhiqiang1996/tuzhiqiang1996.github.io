layui.config({
    base: './templates/perfree-simple-pro/static/plugins/laynotice/' 
});
var lay_notice;
layui.use(['notice'], function(){
    lay_notice = layui.notice;
})
const Util = {
    leftDistance: (el) => {
        let left = el.offsetLeft;
        let scrollLeft;
        while (el.offsetParent) {
            el = el.offsetParent;
            left += el.offsetLeft;
        }
        scrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
        return left - scrollLeft;
    },
    timeFormat: (time) => {
        let tempMin = parseInt(time / 60);
        let tempSec = parseInt(time % 60);
        let curMin = tempMin < 10 ? ('0' + tempMin) : tempMin;
        let curSec = tempSec < 10 ? ('0' + tempSec) : tempSec;
        return curMin + ':' + curSec;
    },
    percentFormat: (percent) => {
        return (percent * 100).toFixed(2) + '%';
    },
    ajax: (option) => {
        option.beforeSend && option.beforeSend();
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300){
                    option.success && option.success(xhr.responseText);
                }else{
                    option.fail && option.fail(xhr.status);
                }
            }
        };
        xhr.open('GET',option.url);
        xhr.send(null);
    }
};

let instance = false;
const baseUrl = '/';

class skPlayer {
    constructor(option){
        if(instance){
            return Object.create(null);
        }else{
            instance = true;
        }

        const defaultOption = {
            element: document.getElementById('skPlayer'),
            autoplay: false,                             //true/false
            mode: 'listloop',                            //singleloop/listloop
            listshow: true                               //true/false
        };
        // this.option = Object.assign({},defaultOption,option);
        for(let defaultKey in defaultOption){
            if(!option.hasOwnProperty(defaultKey)){
                option[defaultKey] = defaultOption[defaultKey];
            }
        }
        this.option = option;

        if(!(this.option.music && this.option.music.type && this.option.music.source)){
            lay_notice.error('音乐播放器出错！');
            return Object.create(null);
        }
        this.root = this.option.element;
        this.type = this.option.music.type;
        this.music = this.option.music.source;
        this.isMobile = /mobile/i.test(window.navigator.userAgent);

        this.toggle = this.toggle.bind(this);
        this.toggleList = this.toggleList.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.switchMode = this.switchMode.bind(this);

        if(this.type === 'file'){
            this.root.innerHTML = this.template();
            this.init();
            this.bind();
        }else if(this.type === 'cloud'){
            Util.ajax({
                // url: baseUrl + 'perfree/music/getMusicList',
                url: 'http://www.jpress.yinpengfei.com/perfree/music/getMusicList',
                beforeSend: () => {
                },
                success: (data) => {
                    this.music = JSON.parse(data);
                    this.root.innerHTML = this.template();
                    this.init();
                    this.bind();
                },
                fail: (status) => {
                    lay_notice.error('歌单拉取失败！ 错误码：' + status);
                }
            });
        }
    }

    template(){
        let html = `
            <audio class="skPlayer-source" src="${this.type === 'file' ? this.music[0].src : ''}" preload="auto"></audio>
            <div class="skPlayer-picture">
                <img class="skPlayer-cover" src="${this.music[0].cover}" alt="">
            </div>
            <div class="skPlayer-control">
                <p class="skPlayer-name">${this.music[0].name}</p>
                <div class="skPlayer-pre-btn perfree-music-btn" onclick="player.prev();"><i class="fa fa-step-backward" aria-hidden="true"></i></div>
                <div class="skPlayer-play-custom-btn perfree-music-btn"><i class="fa fa-play" aria-hidden="true"></i></div>
                <div class="skPlayer-next-btn perfree-music-btn" onclick="player.next();"><i class="fa fa-step-forward" aria-hidden="true"></i></div>
                <div class="skPlayer-percent">
                    <div class="skPlayer-line-loading"></div>
                    <div class="skPlayer-line"></div>
                </div>
            </div>
            <div class="skPlayer-showList-btn" onclick="player.toggleList();">
                <i class="fa fa-headphones" aria-hidden="true"></i>
            </div>
            <ul class="skPlayer-list">
        `;
        for(let index in this.music){
            html += `
                <li data-index="${index}">
                    <i class="skPlayer-list-sign"></i>
                    <span class="skPlayer-list-index">${parseInt(index) + 1}</span>
                    <span class="skPlayer-list-name" title="${this.music[index].name}">${this.music[index].name}</span>
                    <span class="skPlayer-list-author" title="${this.music[index].author}">${this.music[index].author}</span>
                </li>
            `;
        }
        html += `
            </ul>
        `;
        return html;
    }

    init(){
        this.dom = {
            cover: this.root.querySelector('.skPlayer-cover'),
            playbutton: this.root.querySelector('.skPlayer-play-btn'),
            play_custom_button: this.root.querySelector('.skPlayer-play-custom-btn'),
            name: this.root.querySelector('.skPlayer-name'),
            author: this.root.querySelector('.skPlayer-author'),
            timeline_total: this.root.querySelector('.skPlayer-percent'),
            timeline_loaded: this.root.querySelector('.skPlayer-line-loading'),
            timeline_played: this.root.querySelector('.skPlayer-percent .skPlayer-line'),
            timetext_total: this.root.querySelector('.skPlayer-total'),
            timetext_played: this.root.querySelector('.skPlayer-cur'),
            volumebutton: this.root.querySelector('.skPlayer-icon'),
            volumeline_total: this.root.querySelector('.skPlayer-volume .skPlayer-percent'),
            volumeline_value: this.root.querySelector('.skPlayer-volume .skPlayer-line'),
            switchbutton: this.root.querySelector('.skPlayer-list-switch'),
            modebutton: this.root.querySelector('.skPlayer-mode'),
            musiclist: this.root.querySelector('.skPlayer-list'),
            musicitem: this.root.querySelectorAll('.skPlayer-list li')
        };
        this.audio = this.root.querySelector('.skPlayer-source');
        if(this.option.listshow){
            this.root.className = 'skPlayer-list-on';
        }
        if(this.option.mode === 'singleloop'){
            this.audio.loop = true;
        }
        this.dom.musicitem[0].className = 'skPlayer-curMusic';
        if(this.type === 'cloud'){
            Util.ajax({
                url: baseUrl + 'perfree/music/getMusicUrl?id=' + this.music[0].song_id,
                beforeSend: () => {
                },
                success: (data) => {
                    let url = JSON.parse(data).url;
                    if(url !== null){
                        this.audio.src = url;
                    }else{
                        lay_notice.error('歌曲拉取失败！ 资源无效！');
                        if(this.music.length !== 1){
                            this.next();
                        }
                    }
                },
                fail: (status) => {
                    lay_notice.error('歌曲拉取失败！ 错误码：' + status);
                }
            });
        }
    }

    bind(){
        this.updateLine = () => {
            let percent = this.audio.buffered.length ? (this.audio.buffered.end(this.audio.buffered.length - 1) / this.audio.duration) : 0;
            this.dom.timeline_loaded.style.width = Util.percentFormat(percent);
        };

        this.audio.addEventListener('durationchange', (e) => {
            //this.dom.timetext_total.innerHTML = Util.timeFormat(this.audio.duration);
            this.updateLine();
        });
        this.audio.addEventListener('progress', (e) => {
            this.updateLine();
        });
        this.audio.addEventListener('canplay', (e) => {
            if(this.option.autoplay && !this.isMobile){
                this.play();
            }
        });
        this.audio.addEventListener('timeupdate', (e) => {
            let percent = this.audio.currentTime / this.audio.duration;
            this.dom.timeline_played.style.width = Util.percentFormat(percent);
            //this.dom.timetext_played.innerHTML = Util.timeFormat(this.audio.currentTime);
        });
        this.audio.addEventListener('seeked', (e) => {
            this.play();
        });
        this.audio.addEventListener('ended', (e) => {
            this.next();
        });

        //this.dom.playbutton.addEventListener('click', this.toggle);
        //this.dom.switchbutton.addEventListener('click', this.toggleList);
        this.dom.play_custom_button.addEventListener('click', this.toggle);
        if(!this.isMobile){
            //this.dom.volumebutton.addEventListener('click', this.toggleMute);
        }
        //this.dom.modebutton.addEventListener('click', this.switchMode);
        this.dom.musiclist.addEventListener('click', (e) => {
            let target,index,curIndex;
            if(e.target.tagName.toUpperCase() === 'LI'){
                target = e.target;
            }else if(e.target.parentElement.tagName.toUpperCase() === 'LI'){
                target = e.target.parentElement;
            }else{
                return;
            }
            index = parseInt(target.getAttribute('data-index'));
            curIndex = parseInt(this.dom.musiclist.querySelector('.skPlayer-curMusic').getAttribute('data-index'));
            if(index === curIndex){
                this.play();
            }else{
                this.switchMusic(index + 1);
            }
        });
        this.dom.timeline_total.addEventListener('click', (event) => {
            let e = event || window.event;
            let percent = (e.clientX - Util.leftDistance(this.dom.timeline_total)) / this.dom.timeline_total.clientWidth;
            if(!isNaN(this.audio.duration)){
                this.dom.timeline_played.style.width = Util.percentFormat(percent);
                //this.dom.timetext_played.innerHTML = Util.timeFormat(percent * this.audio.duration);
                this.audio.currentTime = percent * this.audio.duration;
            }
        });
        if(!this.isMobile){
        }
    }

    prev(){
        let index = parseInt(this.dom.musiclist.querySelector('.skPlayer-curMusic').getAttribute('data-index'));
        if(index === 0){
            if(this.music.length === 1){
                this.play();
            }else{
                this.switchMusic(this.music.length-1 + 1);
            }
        }else{
            this.switchMusic(index-1 + 1);
        }
    }

    next(){
        let index = parseInt(this.dom.musiclist.querySelector('.skPlayer-curMusic').getAttribute('data-index'));
        if(index === (this.music.length - 1)){
            if(this.music.length === 1){
                this.play();
            }else{
                this.switchMusic(0 + 1);
            }
        }else{
            this.switchMusic(index+1 + 1);
        }
    }

    switchMusic(index){
        if(typeof index !== 'number'){
            lay_notice.error('请输入正确的歌曲序号！');
            return;
        }
        index -= 1;
        if(index < 0 || index >= this.music.length){
            lay_notice.error('请输入正确的歌曲序号！');
            return;
        }
        if(index == this.dom.musiclist.querySelector('.skPlayer-curMusic').getAttribute('data-index')){
            this.play();
            return;
        }
        this.dom.musiclist.querySelector('.skPlayer-curMusic').classList.remove('skPlayer-curMusic');
        this.dom.musicitem[index].classList.add('skPlayer-curMusic');
        this.dom.name.innerHTML = this.music[index].name;
        this.dom.cover.src = this.music[index].cover;
        if(this.type === 'file'){
            this.audio.src = this.music[index].src;
            this.play();
        }else if(this.type === 'cloud'){
            Util.ajax({
                url: baseUrl + 'perfree/music/getMusicUrl?id=' + this.music[index].song_id,
                beforeSend: () => {
                },
                success: (data) => {
                    let url = JSON.parse(data).url;
                    if(url !== null){
                        this.audio.src = url;
                        this.play();
                        //暂存问题，移动端兼容性
                    }else{
                        lay_notice.error('歌曲拉取失败！ 资源无效！');
                        if(this.music.length !== 1){
                            this.next();
                        }
                    }
                },
                fail: (status) => {
                    lay_notice.error('歌曲拉取失败！ 错误码：' + status);
                }
            });
        }
    }

    customPlay(){
        if(!this.audio.paused){
            $(".skPlayer-play-custom-btn").html('<i class="fa fa-pause" aria-hidden="true"></i>');
        }else{
            $(".skPlayer-play-custom-btn").html('<i class="fa fa-play" aria-hidden="true"></i>');
        }
        player.toggle();
    }

    play(){
        if(this.audio.paused){
            this.audio.play();
            $(".skPlayer-play-custom-btn").html('<i class="fa fa-pause" aria-hidden="true"></i>');
            $(".skPlayer-cover").addClass("play");
        }
    }

    pause(){
        if(!this.audio.paused){
            this.audio.pause();
            $(".skPlayer-play-custom-btn").html('<i class="fa fa-play" aria-hidden="true"></i>');
            $(".skPlayer-cover").removeClass("play");
        }
    }

    toggle(){
        this.audio.paused ? this.play() : this.pause();
    }

    toggleList(){
        this.root.classList.contains('skPlayer-list-on') ? this.root.classList.remove('skPlayer-list-on') : this.root.classList.add('skPlayer-list-on');
    }

    toggleMute(){
        //暂存问题，移动端兼容性
        if(this.audio.muted){
            this.audio.muted = false;
            this.dom.volumebutton.classList.remove('skPlayer-quiet');
            this.dom.volumeline_value.style.width = Util.percentFormat(this.audio.volume);
        }else{
            this.audio.muted = true;
            this.dom.volumebutton.classList.add('skPlayer-quiet');
            this.dom.volumeline_value.style.width = '0%';
        }
    }

    switchMode(){
        if(this.audio.loop){
            this.audio.loop = false;
            this.dom.modebutton.classList.remove('skPlayer-mode-loop');
        }else{
            this.audio.loop = true;
            this.dom.modebutton.classList.add('skPlayer-mode-loop');
        }
    }

    destroy(){
        instance = false;
        this.audio.pause();
        this.root.innerHTML = '';
        for(let prop in this){
            delete this[prop];
        }
    }
}