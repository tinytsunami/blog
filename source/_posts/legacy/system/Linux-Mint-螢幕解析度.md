---
title: Linux 螢幕解析度問題
permalink: linux-screen-display-problem/
categories: (legacy) system
date: 2018-03-11
mathjax: false
---
我當初剛裝 Linux 時，被雙螢幕的問題搞了許久，  
這篇主要是做個解決方案的筆記，以免之後又碰到相同的問題。

本解決方案來自網路上的資料，我將把參考資料陳列於下方。
<!-- more -->

{% note info %}
本篇的 Linux 版本為 [Linux Mint](https://linuxmint.com/)
如果你的不是 Linux Mint 的話，解決方案可能大同小異，請參考其他資料處理。
{% endnote %}

# 解析度問題
有時候安裝好 Linux 螢幕並不會自動抓到適當的解析度，  
筆者的雙螢幕中，發生問題的螢幕是電視螢幕，具體參考圖 1。

我的猜測是，螢幕本身不是電腦螢幕的話，可能發生機會會大得多。

![圖 1、Linux Mint 螢幕設定畫面](https://i.imgur.com/w7Kga59.png)

如上圖所示，問題螢幕為 DVI-I 輸出，正常情況應為 1920x1080 解析度；  
但由於某種原因，最高只到 1024x768 解析度。

# 解決方案

我們會利用 cvt 及 xrandr 指令解決這個問題：

* 利用 xrandr 找出問題螢幕的代號
* 透過 cvt 生成 modeline
* 透過 xrandr 以及 modeline 建立解析度
* 透過 xrandr 增加解析度到螢幕代號
* 設定螢幕為新解析度

{% codeblock lang:bash %}
tinytsunami@Tinytsunami-PC ~ $ xrandr
Screen 0: minimum 320 x 200, current 2944 x 1080, maximum 16384 x 16384
DVI-I-1 connected 1024x768+0+0 (normal left inverted right x axis y axis) 0mm x 0mm
   1024x768      60.00* 
   800x600       60.32    56.25  
   848x480       60.00  
   640x480       59.94  
HDMI-1 disconnected (normal left inverted right x axis y axis)
VGA-1 connected primary 1920x1080+1024+0 (normal left inverted right x axis y axis) 477mm x 268mm
   1920x1080     60.00*+
   1680x1050     59.95  
   1600x900      60.00  
   1280x1024     60.02  
   1280x800      59.81  
   1280x720      60.00  
   1024x768      60.00  
   800x600       60.32  
   640x480       59.94  
tinytsunami@Tinytsunami-PC ~ $ cvt 1920 1080 60
# 1920x1080 59.96 Hz (CVT 2.07M9) hsync: 67.16 kHz; pclk: 173.00 MHz
Modeline "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -hsync +vsync
tinytsunami@Tinytsunami-PC ~ $ xrandr --newmode "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -hsync +vsync
tinytsunami@Tinytsunami-PC ~ $ xrandr --addmode DVI-I-1 "1920x1080_60.00"
tinytsunami@Tinytsunami-PC ~ $ xrandr --output DVI-I-1 --mode 1920x1080_60.00
{% endcodeblock %}

這個方法是暫時的，完成這些步驟後，要做一些設定來保存這個配置，
我的方案是使用開機執行程式（.sh）開機時自動完成上面那些操作：

{% codeblock lang:bash %}
xrandr --newmode "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -hsync +vsync
xrandr --addmode DVI-I-1 1920x1080_60.00
xrandr --output DVI-I-1 --mode 1920x1080_60.00
{% endcodeblock %}

# 參考資料
https://www.ubuntu-tw.org/modules/newbb/viewtopic.php?post_id=161574
https://askubuntu.com/questions/377937/how-to-set-a-custom-resolution
