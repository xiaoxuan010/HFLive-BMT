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
        current_preset = preset[i].current_preset;  //当前使用的预设
        current_content = preset[i].content[current_preset];
        $(`#key${i}-name`).html(current_content.name);
        if (i < 2)
            $(`#key${i}-person`).html(current_content.person);


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
            case 'OPENING':
            case 'OPENED': {
                $(`#key${i}`).removeClass('hide');
            }
        }

    }
}
