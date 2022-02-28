/*
 * HFLive-BMT 报幕条
 * 作者：HFLive13.0 xiaoxuan010
 * 开源地址：https://github.com/xiaoxuan010/HFLive-BMT
 * 开源许可：GPL
 * 使用的开源代码：MDUI(https://github.com/zdhxiong/mdui)基于MIT协议
 */

//全局变量
var preset;
const preset_id = "hflive-bmt-preset";
var $ = mdui.$;

//监听数据变动
window.addEventListener('storage', RefreshContent);//有本地数据变动时调用RefreshContent函数

//初始化调用
RefreshContent();

function preset_init() {
    var storage_preset = localStorage.getItem(preset_id);//从浏览器存储中读取数据，格式为JSON字符串
    if (storage_preset != null) {//如果不为空，即本地有数据
        preset = JSON.parse(storage_preset);//使用本地数据
    }
    else {
        preset = default_preset;//否则使用默认数据（在dafault-preset.js里面）
    }
}

//刷新所有内容
function RefreshContent() {
    preset_init();  //先读取一次数据
    for (var i = 0; i < 4; i++) {   //重复4次，每次设置一个key 
        var cp = preset[i].current_preset;  //当前使用的预设编号
        if (i < 2 || preset[i].status == 'OPENED' || preset[i].status == 'CLOSED') {
            lyricsShow(i);
        }

        //设置转场时间
        if (preset[i].status == 'CLOSING' || preset[i].status == 'OPENING') {
            $(`#key${i},#key${i}>*`).css('transition', `ease ${preset[i].transition_time}s`);
        }
        else {
            $(`#key${i},#key${i}>*`).css('transition', 'unset');
        }

        //以下设置文本框的显示与否，通过添加hide类来实现，hide类是自己写的，定义在source-style.css标签
        switch (preset[i].status) {
            case 'CLOSED':
            case 'CLOSING': {
                $(`#key${i}`).addClass('hide');
                break;
            }
            case 'OPENED':
            case 'OPENING': {
                $(`#key${i}`).removeClass('hide');
                break;
            }
            case 'PLAYING_FORWARD': {
                $(`#key${i}`).removeClass('hide');
                lyricsPlay(i);
            }
        }

    }
}

//逐字出现
function lyricsPlay(i) {
    var cp = preset[i].current_preset;
    var j = 0;
    $(`#key${i}-name`).empty();
    var cl = preset[i].content[cp].current_lyrics;
    var content = preset[i].content[cp].lyrics[cl].text;
    var tTime = preset[i].content[cp].lyrics[cl].transition_time * 1000;
    if (tTime > 4000)
        tTime = 4000;
    var eTime = tTime / content.length;
    var PFtimer = setInterval(() => {
        var chr = content[j++];
        var elem = document.createElement('span');
        $(elem).text(chr);
        $(elem).addClass('hide');
        $(elem).css({
            'font-size': '0em',
            'transition': `${eTime * 3}ms ease`,
            'vertical-align': 'middle',
            'text-align': 'center',
            'display': 'inline-block',
            'width': $(`#key${i}-name`).css('font-size')
        })
        $(`#key${i}-name`).append(elem);
        setTimeout(function () {
            $(elem).removeClass('hide');
            $(elem).css('font-size', 'inherit');
        }, 100);
        if (j > content.length) {
            clearInterval(PFtimer);
            return;
        }
    }, eTime);
}
//直接出现
function lyricsShow(i) {
    var cp = preset[i].current_preset;
    if (i < 2) {
        var content = preset[i].content[cp];
        $(`#key${i}-name`).html(content.name);
        $(`#key${i}-person`).html(content.person);
    }
    else {
        var cl = preset[i].content[cp].current_lyrics;
        var content = preset[i].content[cp].lyrics[cl].text;
        if ($(`#key${i}-name`).text() == content) return;
        $(`#key${i}-name`).empty();
        for (var j = 0; j < content.length; j++) {
            var chr = content[j];
            var elem = document.createElement('span');
            $(elem).text(chr);
            $(elem).css({
                'vertical-align': 'middle',
                'text-align': 'center',
                'display': 'inline-block',
                'width': $(`#key${i}-name`).css('font-size')
            })
            $(`#key${i}-name`).append(elem);
        }
    }

}