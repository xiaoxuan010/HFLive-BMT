/*
 * HFLive-BMT 报幕条
 * 作者：HFLive13.0 xiaoxuan010
 * 开源地址：https://github/xiaoxuan010/hflive-bmt
 * 开源许可：GPL
 * 使用的开源代码：MDUI(https://github.com/zdhxiong/mdui)基于MIT协议
 */

// 全局变量
var preset;
const preset_id = "hflive-bmt-preset";

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
        document.getElementById('key' + i + '-preset').value = preset[i].current_preset;// 将滑动条设置为当前使用的预设
        RefreshKeySettings(i);
        RefreshCurrentPreset(i);
        RefreshKeyStatus(i);
    }
}

//保存预设文件
function SavePreset(i) {
    var current_preset = document.getElementById('key' + i + '-preset').value;  //滑动条选择的数值
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
    preset[i].current_preset = document.getElementById('key' + i + '-preset').value;    //把滑动条选择的数值存进preset
    SavePresetToLocal();
}

//刷新设置，重置为Preset
function RefreshKeySettings(i) {
    document.getElementById('key' + i + '-onair-btn').innerHTML = preset[i].key_name;   //设置按钮的文字
    document.getElementById('key' + i + '-preset').setAttribute('max', preset[i].content.length - 1);   //设置滑动条的最大值（因为包括0所以长度减一）
    document.getElementById('key' + i + '-transition-time').value = preset[i].transition_time;  //读取转场时间，写入文本框
    mdui.updateSliders();//更新滑动条
}

//刷新预设文本框，重置为Preset
function RefreshCurrentPreset(i) {
    var current_preset = document.getElementById('key' + i + '-preset').value;
    document.getElementById('key' + i + '-num').value = preset[i].content[current_preset].num;//读取序号，写入文本框
    document.getElementById('key' + i + '-person').value = preset[i].content[current_preset].person;//读取表演者，写入文本框
    document.getElementById('key' + i + '-name').value = preset[i].content[current_preset].name;//读取节目名，写入文本框
    document.getElementById('key' + i + '-current-preset-show').innerHTML = current_preset;//把当前的预设号显示出来
}

//撤销更改
function UndoPreset(i) {
    RefreshCurrentPreset(i);//相当于刷新一遍文本框
}

//增加预设
function addPreset(i) {
    var preset_length = preset[i].content.push({ "num": "", "person": "", "name": "" });//初始化预设，都是空的
    document.getElementById('key' + i + '-preset').setAttribute('max', preset_length - 1);//刷新滑块最大值
    document.getElementById('key' + i + '-preset').value = preset_length;//将滑块的值设为长度（忘记为啥不用减一了）
    RefreshCurrentPreset(i);//刷新文本框
    mdui.updateSliders();//更新滑块
    SavePresetToLocal();
}

//删除预设
function deletePreset(i) {
    var current_preset = document.getElementById('key' + i + '-preset').value;//先读出现在的预设号
    preset[i].content.splice(current_preset, 1);//从预设号开始删除1项
    document.getElementById('key' + i + '-preset').value = current_preset - 1;
    document.getElementById('key' + i + '-preset').setAttribute('max', preset[i].content.length - 1);
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
    var btn_element = document.getElementById('key' + i + '-onair-btn');//先获得那个按钮
    btn_element.setAttribute('disabled', '');//设为禁用
    var transition_time = preset[i].transition_time * 1000;//读一下转场时间
    setTimeout(function (elem) {
        elem.removeAttribute('disabled')
    }, transition_time, btn_element);//转场完之后取消禁用
    preset[i].status = preset[i].status == '0%' ? '100%' : '0%';//切换key状态值
    SavePresetToLocal();
    RefreshKeyStatus(i);
}

//刷新Key状态
function RefreshKeyStatus(i) {
    //创建一个style标签，用于控制转场时间（进度条用的）
    var transision_time_style = document.createElement('style');
    transision_time_style.id = 'bmt-transision-time-style';
    transision_time_style.innerHTML = '.bmt-progress-transision-time {transition: ' + preset[i].transition_time + 's ease;}';
    if (document.getElementById('bmt-transision-time-style') != undefined)
        document.getElementsByTagName('html')[0].removeChild(document.getElementById('bmt-transision-time-style'));//如果之前有一样的就删了
    document.getElementsByTagName('html')[0].appendChild(transision_time_style);//把标签写入document，就生效了
    /*这里有bug，不过没时间修了，可能会影响控制面板的显示，但是显示那边是修好了的。（不过也可能没问题）*/

    if (preset[i].status == '100%') {
        document.getElementById('key' + i + '-onair-btn').classList.remove('mdui-color-grey-200');//取消灰色
        document.getElementById('key' + i + '-onair-btn').classList.add('mdui-color-red-600');//变成红色（不过disabled状态不会显示红色）
        document.getElementById('key' + i + '-progress').classList.remove('bmt-status-0');//取消0%状态
        document.getElementById('key' + i + '-progress').classList.add('bmt-status-100');//变成100%状态
    }
    else {
        document.getElementById('key' + i + '-onair-btn').classList.remove('mdui-color-red-600');//取消红色
        document.getElementById('key' + i + '-onair-btn').classList.add('mdui-color-grey-200');//变成灰色
        document.getElementById('key' + i + '-progress').classList.remove('bmt-status-100');//取消100%状态
        document.getElementById('key' + i + '-progress').classList.add('bmt-status-0');//变成0%状态
    }
}

//保存Key设置
function SaveKeySettings(i) {
    preset[i].transition_time = document.getElementById('key' + i + '-transition-time').value;//保存转场时间
    SavePresetToLocal();
}

//打开对话框
document.getElementById('import-export-dialog').addEventListener('open.mdui.dialog', function () {//导入导出全部设置的对话框
    document.getElementById('imex-preset-textarea').value = JSON.stringify(preset);
});
document.getElementById('import-export-key0-dialog').addEventListener('open.mdui.dialog', function (j) {//key0的预设
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
});

//从文本框导入配置
document.getElementById('import-export-dialog').addEventListener('confirm.mdui.dialog', function () {
    try {
        preset = JSON.parse(document.getElementById('imex-preset-textarea').value);//尝试解析JSON
    } catch (err) {     //如果JSON格式不对就抛出异常
        console.log(err);
        mdui.alert('输入的配置文件不合法，详见浏览器Console.', '修改未生效');
        return;//结束函数
    }
    SavePresetToLocal();//没问题才会存进本地
    preset_init();//用新的配置刷新
});

//拷贝输入框文本
function CopyPresetText(id) {
    var preset_json = document.getElementById(id).value;
    navigator.clipboard.writeText(preset_json);
    mdui.alert('若没有看到拷贝的内容，请自行全选、复制', '拷贝成功');
}
