/* 
 * HFLive-BMT 报幕条
 * 作者：HFLive13.0 xiaoxuan010
 * 开源地址：https://github.com/xiaoxuan010/HFLive-BMT
 * 开源许可：GPL
 * 使用的开源代码：MDUI(https://github.com/zdhxiong/mdui)基于MIT协议
 */

// 全局变量
var preset;
const preset_id = "hflive-bmt-preset";
var key2_timer, key3_timer;
var $ = mdui.$;

// 初始化函数
presetInit();

//为方便阅读，如无特殊说明，代码中的变量i特指Key编号

//初始化预设文件
function presetInit() {
    // 从本地读取
    var storage_preset = localStorage.getItem(preset_id);
    // 如果能读到就用本地的，否则用默认的，默认的存储在default-preset.js里
    if (storage_preset != null) {
        preset = JSON.parse(storage_preset);
    }
    else {
        preset = default_preset;
    }

    // 重复四次，每次设置一个key
    for (var i = 0; i < 4; i++) {
        RefreshKeySettings(i);
        RefreshCurrentPreset(i);
        RefreshKeyStatus(i);
    }
}

//保存预设文件
function SavePreset(i) {
    var cp = preset[i].current_preset;
    if (i < 2) {
        // preset[i].current_preset = cp;  //存进preset
        preset[i].content[cp] = {   //分别将序号、表演者、节目名存进preset
            "num": $(`#key${i}-num`).val(),
            "person": $(`#key${i}-person`).val(),
            "name": $(`#key${i}-name`).val(),
        }
    }
    else {
        var cl = preset[i].content[cp].current_lyrics;
        preset[i].content[cp].lyrics[cl] = {
            "transition_time": $(`#key${i}-individual-transition-time`).val(),
            "text": $(`#key${i}-text`).val()
        }
        RefreshLyricsList(i);
    }
    SavePresetToLocal();//将preset存进本地
}

//切换Preset
function PresetSwitched(i) {    //滑动条切换完毕后调用
    preset[i].current_preset = $(`#key${i}-preset`).val();
    SavePresetToLocal();
    if (i < 2) {
        mdui.updateSliders();
    }
    else {
        RefreshLyricsList(i);
    }
}

//刷新KEY设置为Preset
function RefreshKeySettings(i) {
    $(`#key${i}-onair-btn`).html(preset[i].key_name);   //设置按钮的文字
    if (i < 2) {
        $(`#key${i}-preset`).attr('max', preset[i].content.length - 1);   //设置滑动条的最大值（因为包括0所以长度减一）
        $(`#key${i}-preset`).val(preset[i].current_preset);
        mdui.updateSliders();//更新滑动条
    }
    else {
        $(`#key${i}-preset`).empty();
        for (var j = 0; j < preset[i].content.length; j++) {
            var elem = document.createElement('option');
            $(elem).val(j);
            $(elem).text(preset[i].content[j].song_name);
            $(`#key${i}-preset`).append(elem);
        }
        $(`#key${i}-preset`).val(preset[i].current_preset);
        mdui.mutation();
        // var selectInst = new mdui.Select(`#key${i}-preset`);
        // selectInst.handleUpdate();
        RefreshLyricsList(i);
    }
    $(`#key${i}-transition-time`).val(preset[i].transition_time); //读取转场时间，写入文本框
}

//刷新歌词列表
function RefreshLyricsList(i) {
    var cs = preset[i].current_preset;
    $(`#key${i}-lyrics-list`).empty();
    for (var j = 0; j < preset[i].content[cs].lyrics.length; j++) {
        var elem = document.createElement('li');
        $(elem).addClass('mdui-list-item mdui-ripple');
        $(elem).text(preset[i].content[cs].lyrics[j].text);
        $(elem).attr('id', `key${i}-song${cs}-lyrics-${j}`);
        $(elem).data({
            'LyricsIndex': j,
            'KeyIndex': i
        });
        $(elem).attr('onclick', 'LyricsChange(this)')
        $(`#key${i}-lyrics-list`).append(elem);
        RefreshCurrentLyrics(i);
    }
}

//切换高亮的歌词
function RefreshCurrentLyrics(i) {
    var cp = preset[i].current_preset;
    var cl = preset[i].content[cp].current_lyrics;
    $($(`#key${i}-lyrics-list`).children()).removeClass('mdui-list-item-active');
    $(`#key${i}-song${cp}-lyrics-${cl}`).addClass('mdui-list-item-active');
    $(`#key${i}-individual-transition-time`).val(preset[i].content[cp].lyrics[cl].transition_time);//读取歌词，写入文本框
    $(`#key${i}-text`).val(preset[i].content[cp].lyrics[cl].text);//读取歌词，写入文本框
}

//切换歌词行
function LyricsChange(elem) {
    var i = $(elem).data('KeyIndex');
    var cs = preset[i].current_preset;
    preset[i].content[cs].current_lyrics = $(elem).data('LyricsIndex');
    // SavePresetToLocal();
    if (preset[i].status == 'OPENED' && !$(`#key${i}-lyrics-play-forward-btn`).attr('disabled'))
        LyricsPlay(i);
    RefreshCurrentLyrics(i);
}

//刷新预设Content
function RefreshCurrentPreset(i) {
    var cp = $(`#key${i}-preset`).val();
    if (i < 2) {
        $(`#key${i}-num`).val(preset[i].content[cp].num);//读取序号，写入文本框
        $(`#key${i}-person`).val(preset[i].content[cp].person);//读取表演者，写入文本框
        $(`#key${i}-name`).val(preset[i].content[cp].name);//读取节目名，写入文本框
        $(`#key${i}-current-preset-show`).html(cp);//把当前的预设号显示出来
    }
}

//增加预设
function addPreset(i) {
    SavePreset(i);
    if (i < 2) {
        var preset_index = preset[i].content.push({ "num": "", "person": "", "name": "" }) - 1;//初始化预设，都是空的
        preset[i].content[preset_index].num = preset_index;
        preset[i].current_preset = preset_index;
        $(`#key${i}-preset`).attr('max', preset_index);  //刷新滑块最大值
        $(`#key${i}-preset`).val(preset_index); //将滑块的值设为长度
        RefreshCurrentPreset(i);//刷新文本框
        mdui.updateSliders();//更新滑块
    }
    else {
        mdui.prompt('歌曲名', '添加新歌', function (value) {
            var preset_index = preset[i].content.push({
                "song_name": value,
                "current_lyrics": 0,
                "lyrics": []
            });
            preset[i].current_preset = preset_index - 1;
            SavePresetToLocal();
            RefreshKeySettings(i);
        }, function () { return }, { confirmText: '创建', cancelText: '取消' });
    }
    SavePresetToLocal();
}

//删除预设
function deletePreset(i) {
    mdui.confirm('确定要删除吗？',function(){
        var cp = $(`#key${i}-preset`).val();//先读出现在的预设号
        preset[i].content.splice(cp--, 1);//从预设号开始删除1项
        $(`#key${i}-preset`).val(cp);
        preset[i].current_preset = cp;
        SavePresetToLocal();
        if (i < 2) {
            $(`#key${i}-preset`).attr('max', preset[i].content.length - 1);
            RefreshCurrentPreset(i);
            mdui.updateSliders();
        }
        else {
            RefreshKeySettings(i);
        }
    },function(){
        mdui.snackbar('已取消删除');
    },{confirmText:'确定删除',cancelText:'取消'});
    
}

//追加一行歌词
function addLyrics(i) {
    SavePreset(i);
    var cp = preset[i].current_preset;
    preset[i].content[cp].lyrics.splice(++preset[i].content[cp].current_lyrics, 0, {
        "transition_time": preset[i].transition_time,
        "text": ''
    });
    SavePresetToLocal();
    RefreshLyricsList(i);
    document.getElementById(`key${i}-text`).focus();
}
//插入一行歌词
function insertLyrics(i) {
    SavePreset(i);
    var cp = preset[i].current_preset;
    var cl = preset[i].content[cp].current_lyrics;
    preset[i].content[cp].lyrics.splice(cl, 0, {
        "transition_time": preset[i].transition_time,
        "text": ''
    });
    SavePresetToLocal();
    RefreshLyricsList(i);
    document.getElementById(`key${i}-text`).focus();
}

//删除本行歌词
function deleteLyrics(i) {
    var cp = preset[i].current_preset;
    var cl = preset[i].content[cp].current_lyrics;
    preset[i].content[cp].lyrics.splice(cl, 1);
    preset[i].content[cp].current_lyrics = --cl;
    SavePresetToLocal();
    RefreshLyricsList(i);
}

//将预设保存到本地存储
function SavePresetToLocal() {
    localStorage.setItem(preset_id, JSON.stringify(preset));//把对象编码成JSON字符串，存到localStorage
}

//切换Key状态
function OnAir(i) { //点了四个按钮中的一个之后
    var btn_element = $(`#key${i}-onair-btn`);//先获得那个按钮
    btn_element.attr('disabled', '');//设为禁用

    if (i == 2 && key2_timer) clearTimeout(key2_timer);
    if (i == 3 && key3_timer) clearTimeout(key3_timer);
    preset[i].status = preset[i].status == 'CLOSED' ? 'OPENING' : 'CLOSING';//切换key状态值
    var transition_time = preset[i].transition_time * 1000;//读一下转场时间
    SavePresetToLocal();
    RefreshKeyStatus(i);
    setTimeout(function (elem) {
        elem.removeAttr('disabled');
        preset[i].status = preset[i].status == 'OPENING' ? 'OPENED' : 'CLOSED';//切换key状态值
        SavePresetToLocal();
        RefreshKeyStatus(i);
    }, transition_time, btn_element);//转场完之后取消禁用
}

//刷新Key状态
function RefreshKeyStatus(i) {
    if (preset[i].status == 'CLOSING' || preset[i].status == 'OPENING') {
        $(`#key${i}-progress`).css('transition', preset[i].transition_time + 's ease');
    }
    else {
        $(`#key${i}-progress`).css('transition', 'unset');
    }

    //设置状态
    switch (preset[i].status) {
        case 'CLOSED':
        case 'CLOSING': {
            $(`#key${i}-onair-btn`).removeClass('mdui-color-red-600');
            $(`#key${i}-onair-btn`).addClass('mdui-color-grey-200');
            $(`#key${i}-progress`).removeClass('bmt-status-100');
            $(`#key${i}-progress`).addClass('bmt-status-0');
            break;
        }
        case 'OPENING':
        case 'OPENED': {
            $(`#key${i}-onair-btn`).removeClass('mdui-color-grey-200');
            $(`#key${i}-onair-btn`).addClass('mdui-color-red-600');
            $(`#key${i}-progress`).addClass('bmt-status-100');
            $(`#key${i}-progress`).removeClass('bmt-status-0');
        }
    }
}

//保存Key设置
function SaveKeySettings(i) {
    preset[i].transition_time = $(`#key${i}-transition-time`).val();
    SavePresetToLocal();
}

function imexAllOpened() {
    $(`#imex-preset-textarea`).val(JSON.stringify(preset));
}

function imexOpened(i) {
    $(`#imex-key${i}-preset-textarea`).val(JSON.stringify(preset[i]));
}

// 从文本框导入全局配置
$('#import-export-dialog').on('confirm.mdui.dialog', function () {
    try {
        preset = JSON.parse($(`#imex-preset-textarea`).val());//尝试解析JSON
    } catch (err) {     //如果JSON格式不对就抛出异常
        console.log(err);
        mdui.alert('输入的配置文件不合法，详见浏览器Console.', '修改未生效');
        return;//结束函数
    }
    SavePresetToLocal();//没问题才会存进本地
    presetInit();//用新的配置刷新
    mdui.snackbar('保存成功');
});
//导入单KEY配置
function importKeyPreset(i) {
    try {
        preset[i] = JSON.parse($(`#imex-key${i}-preset-textarea`).val());
    } catch (err) {
        console.log(err);
        mdui.alert('输入的配置文件不合法，详见浏览器Console.', '修改未生效');
        return;
    }
    SavePresetToLocal();//没问题才会存进本地
    presetInit();//用新的配置刷新
    mdui.snackbar('保存成功');
}

//以文本编辑歌词
function editLyrics(i) {
    var cp = preset[i].current_preset;
    var arr = preset[i].content[cp].lyrics;
    var lyrics = '';
    $.each(arr, function () {
        lyrics += this.text + '\n';
    });
    // console.log(lyrics);
    $(`#key${i}-edit-lyrics-textarea`).val(lyrics);
}

function importLyrics(i) {
    var cp = preset[i].current_preset;
    var arr = $(`#key${i}-edit-lyrics-textarea`).val().split('\n');
    // console.log(arr);
    preset[i].content[cp].lyrics = [];
    $.each(arr, function (index, value) {
        preset[i].content[cp].lyrics.push({
            "transition_time": preset[i].transition_time,
            "text": value
        });
    })
    SavePresetToLocal();
    RefreshLyricsList(i);
}

//拷贝输入框文本
function CopyPresetText(id) {
    var preset_json = $(`#${id}`).val();
    navigator.clipboard.writeText(preset_json);
    mdui.snackbar('拷贝成功');
}


//KEY2、3歌词控制
function LyricsBack(i) {
    var cp = preset[i].current_preset;
    var pcl = preset[i].content[cp].current_lyrics;
    if (pcl == 0) {
        mdui.snackbar('已到达首句歌词');
    }
    else {
        pcl--;
        preset[i].content[cp].current_lyrics = pcl;
        SavePresetToLocal();
        RefreshCurrentPreset(i);
    }
}
function LyricsForward(i) {
    var cp = preset[i].current_preset;
    var pcl = preset[i].content[cp].current_lyrics;
    if (pcl == preset[i].content[cp].lyrics.length - 1) {
        mdui.snackbar('已到达末尾歌词');
    }
    else {
        pcl++;
        preset[i].content[cp].current_lyrics = pcl;
        SavePresetToLocal();
        RefreshCurrentLyrics(i);
    }
}
function LyricsPlayForward(i) {
    var cp = preset[i].current_preset;
    if (preset[i].content[cp].current_lyrics == preset[i].content[cp].lyrics.length - 1) {
        mdui.snackbar('已到达末尾歌词');
    }
    else {
        preset[i].content[cp].current_lyrics++;
        LyricsPlay(i);
    }
}

function LyricsPlay(i) {
    var cp = preset[i].current_preset;
    var cl = preset[i].content[cp].current_lyrics;
    preset[i].content[cp].current_lyrics = cl;

    var btn_element = $(`#key${i}-lyrics-play-forward-btn`);//先获得那个按钮
    btn_element.attr('disabled', '');//设为禁用
    preset[i].status = 'PLAYING_FORWARD';
    var transition_time = preset[i].content[cp].lyrics[cl].transition_time * 1000;//读一下转场时间
    if (transition_time > 4000) transition_time = 4000;
    SavePresetToLocal();
    RefreshCurrentLyrics(i);
    RefreshKeyStatus(i);
    key2_timer = setTimeout(function (elem) {
        elem.removeAttr('disabled');
        preset[i].status = 'OPENED';
        SavePresetToLocal();
        RefreshKeyStatus(i);
    }, transition_time, btn_element);//转场完之后取消禁用
}

//调试用：清除设置
function rm() {
    localStorage.removeItem(preset_id);
    location.reload();
}