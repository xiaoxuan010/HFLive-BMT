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
preset_init();

//为方便阅读，如无特殊说明，代码中的变量i特指Key编号

//初始化预设文件
function preset_init() {
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
        // document.getElementById('key' + i + '-preset').value = preset[i].current_preset;// 将滑动条设置为当前使用的预设
        $(`#key${i}-preset`).val(preset[i].current_preset);
        RefreshKeySettings(i);
        RefreshCurrentPreset(i);
        RefreshKeyStatus(i);
    }
}

//保存预设文件
function SavePreset(i) {
    // var current_preset = document.getElementById('key' + i + '-preset').value;  //滑动条选择的数值
    var current_preset = $(`#key${i}-preset`).value;
    preset[i].current_preset = current_preset;  //存进preset
    preset[i].content[current_preset] = {   //分别将序号、表演者、节目名存进preset
        "num": document.getElementById('key' + i + '-num').value,
        "person": document.getElementById('key' + i + '-person').value,
        "name": document.getElementById('key' + i + '-name').value,
    }
    SavePresetToLocal();//将preset存进本地
}

//切换Preset
function PresetSwitched(i) {    //滑动条切换完毕后调用
    // preset[i].current_preset = document.getElementById('key' + i + '-preset').value;    //把滑动条选择的数值存进preset
    preset[i].current_preset = $(`#key${i}-preset`).val();
    SavePresetToLocal();
}

//刷新设置，重置为Preset
function RefreshKeySettings(i) {
    // document.getElementById('key' + i + '-onair-btn').innerHTML = preset[i].key_name;
    $(`#key${i}-onair-btn`).text(preset[i].key_name);   //设置按钮的文字
    // document.getElementById('key' + i + '-preset').setAttribute('max', preset[i].content.length - 1);
    $(`#key${i}-preset`).attr('max', preset[i].content.length - 1);   //设置滑动条的最大值（因为包括0所以长度减一）
    // document.getElementById('key' + i + '-transition-time').value = preset[i].transition_time;  
    $(`#key${i}-transition-time`).val(preset[i].transition_time); //读取转场时间，写入文本框
    mdui.updateSliders();//更新滑动条
}

//刷新预设文本框，重置为Preset
function RefreshCurrentPreset(i) {
    // var current_preset = document.getElementById('key' + i + '-preset').value;
    var current_preset = $(`#key${i}-preset`).val();
    // document.getElementById('key' + i + '-num').value = preset[i].content[current_preset].num;
    $(`#key${i}-num`).val(preset[i].content[current_preset].num);//读取序号，写入文本框
    // document.getElementById('key' + i + '-person').value = preset[i].content[current_preset].person;
    $(`#key${i}-person`).val(preset[i].content[current_preset].person);//读取表演者，写入文本框
    // document.getElementById('key' + i + '-name').value = preset[i].content[current_preset].name;//读取节目名，写入文本框
    $(`#key${i}-name`).val(preset[i].content[current_preset].name);//读取节目名，写入文本框
    // document.getElementById('key' + i + '-current-preset-show').innerHTML = current_preset;//把当前的预设号显示出来
    $(`#key${i}-current-preset-show`).html(current_preset);//把当前的预设号显示出来
}

//撤销更改
function UndoPreset(i) {
    RefreshCurrentPreset(i);//相当于刷新一遍文本框
}

//增加预设$(`#key${i}-name`)
function addPreset(i) {
    SavePreset(i);
    var preset_index = preset[i].content.push({ "num": "", "person": "", "name": "" }) - 1;//初始化预设，都是空的
    preset[i].content[preset_index].num = preset_index;
    preset[i].current_preset = preset_index;
    if (i > 1) preset[i].content[preset_index].person = preset[i].transition_time;//对于KEY2、3，将person（表示动画时间）设为默认时间
    // document.getElementById('key' + i + '-preset').setAttribute('max', preset_index);
    $(`#key${i}-preset`).attr('max', preset_index);  //刷新滑块最大值
    // document.getElementById('key' + i + '-preset').value = preset_index;
    $(`#key${i}-preset`).val(preset_index); //将滑块的值设为长度
    RefreshCurrentPreset(i);//刷新文本框
    mdui.updateSliders();//更新滑块
    SavePresetToLocal();
}

//删除预设
function deletePreset(i) {
    // var current_preset = document.getElementById('key' + i + '-preset').value;
    var current_preset = $(`#key${i}-preset`).val();//先读出现在的预设号
    preset[i].content.splice(current_preset, 1);//从预设号开始删除1项
    // document.getElementById('key' + i + '-preset').value = current_preset - 1;
    $(`#key${i}-preset`).val(current_preset - 1);
    // document.getElementById('key' + i + '-preset').setAttribute('max', preset[i].content.length - 1);
    $(`#key${i}-preset`).attr('max', preset[i].content.length - 1)
    RefreshCurrentPreset(i);
    mdui.updateSliders();
    SavePresetToLocal();
}

//将预设保存到本地存储
function SavePresetToLocal() {
    localStorage.setItem(preset_id, JSON.stringify(preset));//把对象编码成JSON字符串，存到localStorage
}

//切换Key状态
function OnAir(i) { //点了四个按钮中的一个之后
    // var btn_element = document.getElementById('key' + i + '-onair-btn');
    var btn_element = $(`#key${i}-onair-btn`);//先获得那个按钮
    btn_element.attr('disabled', '');//设为禁用
    // btn_element.setAttribute('disabled', '');

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
    //创建一个style标签，用于控制转场时间（进度条用的）
    // var transision_time_style = document.createElement('style');
    // transision_time_style.id = 'bmt-transision-time-style';
    if (preset[i].status == 'CLOSING' || preset[i].status == 'OPENING') {
        // transision_time_style.innerHTML = '.bmt-progress-transision-time {transition: ' + preset[i].transition_time + 's ease;}';
        $(`#key${i}-progress`).css('transition', preset[i].transition_time + 's ease');
    }
    else {
        $(`#key${i}-progress`).css('transition', 'unset');
    }
    // if (document.getElementById('bmt-transision-time-style') != undefined)
    //     document.getElementsByTagName('html')[0].removeChild(document.getElementById('bmt-transision-time-style'));//如果之前有一样的就删了
    // document.getElementsByTagName('html')[0].appendChild(transision_time_style);//把标签写入document，就生效了

    //设置状态
    switch (preset[i].status) {
        case 'CLOSED':
        case 'CLOSING': {
            // document.getElementById('key' + i + '-onair-btn').classList.remove('mdui-color-red-600');//取消红色
            $(`#key${i}-onair-btn`).removeClass('mdui-color-red-600');
            // document.getElementById('key' + i + '-onair-btn').classList.add('mdui-color-grey-200');//变成灰色
            $(`#key${i}-onair-btn`).addClass('mdui-color-grey-200');
            // document.getElementById('key' + i + '-progress').classList.remove('bmt-status-100');//取消100%状态
            $(`#key${i}-progress`).removeClass('bmt-status-100');
            // document.getElementById('key' + i + '-progress').classList.add('bmt-status-0');//变成0%状态
            $(`#key${i}-progress`).addClass('bmt-status-0');
            break;
        }
        case 'OPENING':
        case 'OPENED': {
            // document.getElementById('key' + i + '-onair-btn').classList.remove('mdui-color-grey-200');//取消灰色
            $(`#key${i}-onair-btn`).removeClass('mdui-color-grey-200');
            // document.getElementById('key' + i + '-onair-btn').classList.add('mdui-color-red-600');//变成红色（不过disabled状态不会显示红色）
            $(`#key${i}-onair-btn`).addClass('mdui-color-red-600');
            // document.getElementById('key' + i + '-progress').classList.remove('bmt-status-0');//取消0%状态
            $(`#key${i}-progress`).addClass('bmt-status-100');
            // document.getElementById('key' + i + '-progress').classList.add('bmt-status-100');//变成100%状态
            $(`#key${i}-progress`).removeClass('bmt-status-0');
        }
    }
}

//保存Key设置
function SaveKeySettings(i) {
    // preset[i].transition_time = document.getElementById('key' + i + '-transition-time').value;//保存转场时间
    preset[i].transition_time = $(`#key${i}-transition-time`).val();
    SavePresetToLocal();
}

//打开对话框
// document.getElementById('import-export-dialog').addEventListener('open.mdui.dialog', function () {//导入导出全部设置的对话框
//     document.getElementById('imex-preset-textarea').value = JSON.stringify(preset);
// });
function imexAllOpened() {
    $(`#imex-preset-textarea`).val(JSON.stringify(preset));
}

/* document.getElementById('import-export-key0-dialog').addEventListener('open.mdui.dialog', function (j) {//key0的预设
    document.getElementById('imex-key0-preset-textarea').value = JSON.stringify(preset[0]);
});
document.getElementById('import-export-key1-dialog').addEventListener('open.mdui.dialog', function (j) {//key1
    document.getElementById('imex-key1-preset-textarea').value = JSON.stringify(preset[1]);
});
document.getElementById('import-export-key2-dialog').addEventListener('open.mdui.dialog', function (j) {//key2
    document.getElementById('imex-key2-preset-textarea').value = JSON.stringify(preset[2]);
});
document.getElementById('import-export-key3-dialog').addEventListener('open.mdui.dialog', function (j) {//key3
    document.getElementById('imex-key3-preset-textarea').value = JSON.stringify(preset[3]);
}); */

function imexOpened(i) {
    $(`#imex-key${i}-preset-textarea`).val(JSON.stringify(preset[i]));
}

//从文本框导入配置
document.getElementById('import-export-dialog').addEventListener('confirm.mdui.dialog', function () {
    // $(`#import-export-dialog`).addEventListener('confirm.mdui.dialog',function(){
    try {
        preset = JSON.parse(document.getElementById('imex-preset-textarea').value);//尝试解析JSON
        preset = $('imex-preset-textarea').val();
    } catch (err) {     //如果JSON格式不对就抛出异常
        console.log(err);
        mdui.alert('输入的配置文件不合法，详见浏览器Console.', '修改未生效');
        return;//结束函数
    }
    SavePresetToLocal();//没问题才会存进本地
    preset_init();//用新的配置刷新
    mdui.snackbar('保存成功');
});

function importKeyPreset(i) {
    try {
        // preset[i] = JSON.parse(document.getElementById('imex-key' + i + '-preset-textarea').value);
        preset[i] = JSON.parse($(`#imex-key${i}-preset-textarea`).val());
    } catch (err) {
        console.log(err);
        mdui.alert('输入的配置文件不合法，详见浏览器Console.', '修改未生效');
        return;
    }
    SavePresetToLocal();//没问题才会存进本地
    preset_init();//用新的配置刷新
    mdui.snackbar('保存成功');
}

//拷贝输入框文本
function CopyPresetText(id) {
    // var preset_json = document.getElementById(id).value;
    var preset_json = $(`#${id}`).val();
    navigator.clipboard.writeText(preset_json);
    mdui.snackbar('拷贝成功');
}


//KEY2、3歌词控制
function LyricsBack(i) {
    var pcp = parseInt(preset[i].current_preset);
    if (pcp == 0) {
        mdui.snackbar('已到达首句歌词');
    }
    else {
        pcp--;
        preset[i].current_preset = pcp;
        // document.getElementById('key' + i + '-preset').value = pcp;
        $(`#key${i}-preset`).val(pcp);
        mdui.updateSliders();
        RefreshCurrentPreset(i);
        SavePresetToLocal();
    }
}
function LyricsForward(i) {
    var pcp = parseInt(preset[i].current_preset);
    if (pcp == preset[i].content.length - 1) {
        mdui.snackbar('已到达末尾歌词');
    }
    else {
        pcp++;
        preset[i].current_preset = pcp;
        // document.getElementById('key' + i + '-preset').value = pcp;
        $(`#key${i}-preset`).val(pcp);
        mdui.updateSliders();
        RefreshCurrentPreset(i);
        SavePresetToLocal();
    }
}
function LyricsPlayForward(i) {
    var pcp = parseInt(preset[i].current_preset);
    if (pcp == preset[i].content.length - 1) {
        mdui.snackbar('已到达末尾歌词');
    }
    else {
        pcp++;
        preset[i].current_preset = pcp;
        // document.getElementById('key' + i + '-preset').value = pcp;
        $(`#key${i}-preset`).val(pcp);
        mdui.updateSliders();
        RefreshCurrentPreset(i);

        // var btn_element = document.getElementById('key' + i + '-lyrics-play-forward-btn');
        var btn_element = $(`#key${i}-lyrics-play-forward-btn`);//先获得那个按钮
        // btn_element.setAttribute('disabled', '');
        btn_element.attr('disabled', '');//设为禁用
        preset[i].status = 'PLAYING_FORWARD';
        var transition_time = preset[i].content[pcp].person * 1000;//读一下转场时间
        SavePresetToLocal();
        RefreshKeyStatus(i);
        key2_timer = setTimeout(function (elem) {
            elem.removeAttr('disabled');
            preset[i].status = 'OPENED';
            SavePresetToLocal();
            RefreshKeyStatus(i);
        }, transition_time, btn_element);//转场完之后取消禁用
    }

}