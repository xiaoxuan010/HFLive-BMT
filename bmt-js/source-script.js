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
        current_preset = preset[i].current_preset;  //当前使用的预设
        current_content = preset[i].content[current_preset];
        document.getElementById('key' + i + '-name').innerHTML = current_content.name;  //设置“节目名”或“歌词”字符串
        if (i < 2)
            document.getElementById('key' + i + '-person').innerHTML = current_content.person;  //设置“表演者”字符串

        /* //以下设置转场时间（已弃用）
        var transision_time_style = document.createElement('style');  //创建一个style标签
        transision_time_style.id = 'bmt-key' + i + 'transision-time';   //设置标签的id
        transision_time_style.innerHTML = '.bmt-key' + i + '-transition {transition: ' + preset[i].transition_time + 's ease;}';    //读取preset里的转场时间，写入标签
        if (document.getElementById('bmt-key' + i + 'transision-time') != undefined)    //如果有相同id的标签
            document.getElementsByTagName('html')[0].removeChild(document.getElementById('bmt-key' + i + 'transision-time')); //那就删掉
        document.getElementsByTagName('html')[0].appendChild(transision_time_style);    //然后把最新的style写进document，就生效了
        //以下设置文本框的显示与否，通过添加hide类来实现，hide类是自己写的，定义在source-style.css标签
        if (preset[i].status == 'CLOSED') {
        }
        else {
        } */

        //设置转场时间
        var transition_time_style_html
        if (preset[i].status == 'CLOSING' || preset[i].status == 'OPENING') 
            transition_time_style_html = '.bmt-key' + i + '-transition {transition: ' + preset[i].transition_time + 's ease;}';
        else
        transition_time_style_html = '.bmt-key' + i + '-transition {transition: unset;}';
        var transision_time_style_elem = document.getElementById('bmt-key' + i + 'transision-time');
        if (transision_time_style_elem != undefined){
            transision_time_style_elem.innerHTML= transition_time_style_html;
        }
        else{
            var transition_time_style = document.createElement('style');
            transition_time_style.id = 'bmt-key' + i + 'transision-time';
            transition_time_style.innerHTML = transition_time_style_html;
            document.getElementsByTagName('html')[0].appendChild(transition_time_style);
        }
        
        // document.getElementsByTagName('html')[0].removeChild(document.getElementById('bmt-key' + i + 'transision-time'));

        //设置状态
        switch (preset[i].status) {
            case 'CLOSED':
            case 'CLOSING': {
                document.getElementById('key' + i).classList.add('hide');
                break;
            }
            case 'OPENING':
            case 'OPENED': {
                document.getElementById('key' + i).classList.remove('hide');
            }
        }

    }
}
