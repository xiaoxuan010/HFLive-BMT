# HFLive-BMT

![](https://i.bmp.ovh/imgs/2022/02/3984a1bfd6d18100.png)

## 这是什么

这是一套可用于OBS的标题Web页面，可以实现基本的文字显示和动画。

本插件由HFLive13.0某同学开发，初衷是给HFLive提供一个可用的、轻量的、美观的Title软件。考虑开发简便性和使用简便性，最终使用纯HTML+CSS+JavaScript开发，可以离线使用。

## 怎么使用

### 下载

在GitHub上下载本软件的源码，内含bmt-css、bmt-js、mdui等文件夹，control-panel.html、show-source.html等文件。将这些内容复制到任一可访问的文件夹，不要删除。

### 测试

直接双击两个以html结尾的文件或拖入同一电脑的同一款浏览器，就可以在控制面板上控制，显示面板中查看标题效果。

### 安装到OBS

#### OBS 27.1.3

1. 打开OBS，左上角 视图 > 停靠部件(Dock) > 自定义浏览器(Dock)

   ![](https://i.bmp.ovh/imgs/2022/02/103d74983a6fb695.png)

   在弹出的窗口中，左侧Dock名可随意填写（如“HFLiveBMT - 控制面板")，右侧URL填写control-pannel.html文件的路径（如"C:\User\xiaoxuan010\Desktop\HFLive-BMT\control-pannel.html"），注意路径不要加双引号。

   ![](https://i.bmp.ovh/imgs/2022/02/b63175d47d7f718c.png)

2. 弹出的控制窗口，可以自由拖动，并入OBS界面中。（注意检查不要“锁定用户界面“）
3. 添加源“浏览器”，属性为：勾选本地文件，路径为show-source.html的路径（如C:/Users/xiaoxuan010/Desktop/HFLive-BMT/show-source.html）；宽度设置为1080，高度设置为1920；可以使用自定义帧率（也可以不用）；自定义CSS全部删掉（或按需填写）；其它可按默认。

   ![](https://i.bmp.ovh/imgs/2022/02/c59fc1fdc110f583.png)

### OBS 27.2.1

在OBS 27.2.1中，出现了一些特性，需要改变安装方法。如果安装之后发现无法使用，就两种方法都试一下。

1. 左上角“停靠窗口>自定义浏览器停靠窗口"，以下步骤同上。

   ![](https://i.bmp.ovh/imgs/2022/02/ffa4889b56f7bf6f.png)

2. **重点来了**：浏览器源中，不用勾选文件，按如下格式填入地址“file:///M:/HFLive-BMT/show-source.html"，实在不会填的可以在浏览器打开html文件然后把路径复制下来，如图。

   ![](https://i.bmp.ovh/imgs/2022/02/530b6bb2ebdb5c88.png)



### 安装字体

作者测试时使用的字体是：方正灵飞经小楷 简、方正拉勾标题体 简（均可在方正官网免费下载）。安装字体后即可默认使用上述两款字体显示，否则会用浏览器默认字体。有需要可以到`bmt-css/source-style.css`里面自己设置。

## 注意事项

控制页面和显示页面要用同一个浏览器才能互相通信。比如OBS算一个浏览器，在OBS的Dock就可以控制源，在Chrome浏览器里的控制面板就不能控制OBS里面的源。设置存储在浏览器中，不同浏览器可以用“导入/导出功能"备份或同步设置（格式为JSON）。

长宽写死了是1920x1080，有需求的可以自己去css文件里改。



## 不好用/有没有xx功能/怎么不更新

作者只是个苦逼高中生，一个周末抽空写了个小页面，可能也没时间更新。目前只针对HFLive的报幕条显示，希望HFLive14.0能用上。本软件完全免费、开源，欢迎其它大佬贡献代码。

代码文件都写了详细的注释，需要自定义显示效果的可重点阅读`bmt-css/source-style.css`文件。

## 开发进度

KEY0、1、2已经可以使用，KEY3适配中

## TODO List

- [ ] 增强歌词切换稳定性
- [x] 给出歌词导入解决方案
- [ ] 支持设置字体

## 开源相关

本项目完全开源，开源地址：https://github.com/xiaoxuan010/HFLive-BMT ，开源协议见LICENSE文件

本项目使用的开源代码有：

1. MDUI( https://github.com/zdhxiong/mdui )，其基于MIT协议
