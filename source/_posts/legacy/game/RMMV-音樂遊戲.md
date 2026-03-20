---
title: RMMV 音樂遊戲
permalink: rpg-maker-mv-music-game/
categories: (legacy) blog
date: 2020-01-16
mathjax: false
---
這篇文章將公開前作《Thinking at night》的音樂遊戲插件，
以及介紹其使用方法、譜面撰寫方法之類的內容。

一方面期待 RM 圈未來能有其他更好的作品，
另外也希望能讓一些樂師更容易製作屬於自己的音樂遊戲。

<!-- more -->

{% note info %}
關於遊戲請參考 {% permalink thinking-at-night %}
{% endnote %}

{% note info %}
更多插件請參考我的 [GitHub(RMMV-Plugins)](https://github.com/tinytsunami/RMMV-Plugins)
{% endnote %}

# 插件發布

這個插件我發布於 [GitHub](https://github.com/tinytsunami/RMMV-Plugins/tree/master/MusicGame) 上，  
使用說明我會重貼在這裡，主要是增加一點補充（我比較喜歡個人部落格的排版）這樣。

下面統一稱本插件為「MusicGame」這樣。

{% note info %}
題外話，譜面撰寫的格式，很大一部分參考了太鼓次郎的譜面檔案（.tja）格式。
{% endnote %}

## 更新歷程
* 2019.11.10 《Thinking at night》遊戲公開
* 2019.12.10 MusicGame v1.0：插件整理完成並內部公開
* 2020.01.03 MusicGame v1.1：新增切換數字、背景、分數統計功能
* 2020.01.09 MusicGame v1.2：新增長音音符功能
* 2020.01.16 MusicGame v1.2：插件正式發表

## 利用條款
本插件採用 [MIT 授權 (MIT License)](https://en.wikipedia.org/wiki/MIT_License)。  

也就是說，基本上你用這個插件可以做任何事，  
原本 MIT 授權，需包含著作權聲明（作者）和許可聲明（MIT 授權）標示；  
但考慮到遊戲發布的特殊性，我基本只要求著作權聲明。

簡單的說，你只需要保留插件註解的作者一行即可：

{% codeblock lang:js %}
@author 羊羽
{% endcodeblock %}

另外，關於 [Closing credits](https://en.wikipedia.org/wiki/Closing_credits) 是沒有要求的；不過如果有，我會很高興就是了。

{% note info %}
其他問題請 [來信聯絡](mailto:z27619273@gmail.com)
{% endnote %}

# 使用說明
這個插件的說明有一點點複雜，尤其是譜面的部分。  

## 插件參數
| 名稱 | 型別 | 預設值 | 說明 |
|:--------------------------|:----------------------|:--------------------------|:--------------|
| music data                | Json:File             | data/game/Music.json      | 音樂譜面的檔案 |
| control keys              | Refer to help:String  | up, right, down, left     | 玩家操控的按鈕 |
| auto play                 | [0, 1]Z:Boolean       | 0                         | 自動演奏 |
| auto pause                | [0, 1]Z:Boolean       | 1                         | 遊戲跟隨窗口狀態自動暫停與開始 |
| pitch rate                | [1, inf)Z:Number      | 100                       | 演奏速率 |
| start delay               | [0, inf)Z:Number      | 300                       | 音樂載入後<br/>第一個音符到達前的空白預留時間 |
| end delay                 | [0, inf)Z:Number      | 300                       | 演奏結束後<br/>等待回到上一個場景的空白預留時間 |
| BGM volume                | [0, 100]Z:Number      | 80                        | BGM 播放的音量 |
| trackes number            | [1, inf)Z:Number      | 4                         | 設定的軌道數 |
| trackes direction         | Refer to help:String  | left to right             | 軌道方向 |
| trackes x position        | Refer to help:String  | 766, 766, 766, 766        | 軌道 X 位置 |
| trackes y position        | Refer to help:String  | 162, 262, 362, 462        | 軌道 Y 位置 |
| image background          | Image:File            | img/pictures/background   | 預設演奏時的背景圖片 |
| image note                | Image:File            | img/pictures/note         | 演奏時的相關音符圖片 |
| image max combo           | Image:File            | img/pictures/number       | 演奏時的連擊數字圖片 |
| image max combo digits    | [1, inf)Z:Number      | 3                         | 最大連擊位數 |
| image max combo x offset  | (-inf, inf)Z:Number   | 372                       | 最大連擊 X 位置 |
| image max combo y offset  | (-inf, inf)Z:Number   | 296                       | 最大連擊 Y 位置 |
| image score               | Image:File            | img/pictures/number       | 演奏時的分數數字圖片 |
| image score digits        | [1, inf)Z:Number      | 7                         | 分數位數 |
| image score x offset      | (-inf, inf)Z:Number   | 10                        | 分數 X 位置 |
| image score y offset      | (-inf, inf)Z:Number   | 10                        | 分數 Y 位置 |
| animation hit             | Refer to help:String  | 1, 2, 3, 4                | 按下按鍵時的動畫編號 |
| animation great hit       | Refer to help:String  | 5, 5, 5, 5                | 按下按鍵且擊出 great 的動畫 |
| animation good hit        | Refer to help:String  | 6, 6, 6, 6                | 按下按鍵且擊出 good 的動畫 |
| animation miss hit        | Refer to help:String  | 7, 7, 7, 7                | 按下按鍵且擊出 miss 的動畫 |
| animation connect hit     | Refer to help:String  | 8, 8, 8, 8                | 按下按鍵的長音播放動畫 |
| variable total            | [1, inf)Z:Number      | 1                         | 紀錄結果音符數量的變數 |
| variable great            | [1, inf)Z:Number      | 2                         | 紀錄結果 great 數量的變數 |
| variable good             | [1, inf)Z:Number      | 3                         | 紀錄結果 good 數量的變數 |
| variable miss             | [1, inf)Z:Number      | 4                         | 紀錄結果 miss 數量的變數 |
| variable combo            | [1, inf)Z:Number      | 5                         | 紀錄結果當前 combo 的變數 |
| variable max combo        | [1, inf)Z:Number      | 6                         | 紀錄結果 max combo 的變數 |
| variable score            | [1, inf)Z:Number      | 7                         | 紀錄結果 score 的變數 |
| precision great           | [1, inf)R:Number      | 4.0                       | 判斷為 Great 的精度範圍<br/>單位是為流速倍率 |
| precision good            | [1, inf)R:Number      | 8.0                       | 判斷為 Good 的精度範圍<br/>單位是為流速倍率 |
| precision miss            | [1, inf)R:Number      | 12.0                      | 判斷為 Miss 的精度範圍<br/>單位是為流速倍率 |
| score great               | (-inf, inf)R:Number   | 1000                      | 判定為 Great 的分數 |
| score good                | (-inf, inf)R:Number   | 500                       | 判定為 Good 的分數 |
| score miss                | (-inf, inf)R:Number   | 0                         | 判定為 Miss 的分數 |
| score connect             | (-inf, inf)R:Number   | 1000                      | 完成長音的分數 |

### Trackes direction

| 數值 | 說明 |
|:--------------|:----|
| left to right | 為音符由左至右 |
| right to left | 為音符由右至左 |
| bottom to top | 為音符由下至上 |
| top to bottom | 為音符由下至上 |

{% note warning %}
輸入其他內容，自動變成「left to right」
{% endnote %}

### Control keys

{% codeblock lang:js %}
<key_1>, <key_2>, ... // 字元
{% endcodeblock %}

其中每個參數皆為字串，為「`Input.keyMapper`」與「英文鍵中任意字符」都可以。  
關於 `Input.keyMapper` 的部分請參考：

{% codeblock lang:js %}
Input.keyMapper = {
    9: 'tab',       // tab
    13: 'ok',       // enter
    16: 'shift',    // shift
    17: 'control',  // control
    18: 'control',  // alt
    27: 'escape',   // escape
    32: 'ok',       // space
    33: 'pageup',   // pageup
    34: 'pagedown', // pagedown
    37: 'left',     // left arrow
    38: 'up',       // up arrow
    39: 'right',    // right arrow
    40: 'down',     // down arrow
    45: 'escape',   // insert
    81: 'pageup',   // Q
    87: 'pagedown', // W
    88: 'escape',   // X
    90: 'ok',       // Z
    96: 'escape',   // numpad 0
    98: 'down',     // numpad 2
    100: 'left',    // numpad 4
    102: 'right',   // numpad 6
    104: 'up',      // numpad 8
    120: 'debug'    // F9
};
{% endcodeblock %}

### 其他參考值

下面 8 個參數的數量皆應與 trackes number 對應，  
每個值都以「,」隔開，空白將會忽略，型別請參考註解內容：

{% codeblock lang:js %}
trackes x position      // (-inf, inf)Z:Number
trackes y position      // (-inf, inf)Z:Number
control keys            // Refer to help:String
animation hit           // [1, inf)Z:Number
animation great hit     // [1, inf)Z:Number
animation good hit      // [1, inf)Z:Number
animation miss hit      // [1, inf)Z:Number
animation connect hit   // [1, inf)Z:Number
{% endcodeblock %}

## 插件指令

隨時可以使用的指令：

{% codeblock %}
MusicGame auto true                  // 開啟自動演奏
MusicGame auto false                 // 關閉自動演奏
{% endcodeblock %}

遊戲外可以使用的指令：

{% codeblock %}
MusicGame start <id>                 // 以第 <id> 首音樂開始遊戲
MusicGame read <id> <args> <var_id>  // 讀取第 <id> 首音樂的參數 <args> 到第 <var_id> 號變數
{% endcodeblock %}

遊戲場景中可以使用的指令：

{% codeblock %}
MusicGame pause true                 // 暫停遊戲
MusicGame pause false                // 暫停結束
MusicGame end                        // 遊戲結束
MusicGame number <filename>          // 數字圖片更改為 <filename>
MusicGame number reset               // 數字圖片重設為預設圖片
MusicGame score great <number>       // 將 Great 得分數設為 <number> 分
MusicGame score good <number>        // 將 Good 得分數設為 <number> 分
MusicGame score miss <number>        // 將 Miss 得分數設為 <number> 分
MusicGame score connect <number>     // 將長音得分數設為 <number> 分
{% endcodeblock %}

所有插件指令的參數，皆不允許空白；若為檔案位置名稱，則不需副檔名。

## 設定說明
在指定目錄 `MUSICGAME_FOLDER` 的底下，  
放置 `music.json` 與  檔案，檔案結構如下所示：

    [
        {
            "name": <樂曲名>,
            "file": <樂曲檔名>,
            "background": <背景圖片>,
            "level": <難度分級>,
            "sign": <拍號>,
            "bpm": <曲速>,
            "speed": <音符流速>,
            "sheet": <譜面>
        },
        ...
    ]

每個大括號的內容都為一首樂曲，而「樂曲編號」是這首樂曲在陣列中的序位，  
除了樂曲編號不用填寫外，其他欄位的說明如下：

* 「樂曲名、樂曲檔名」為字串，且樂曲檔名應置於 `./audio/bgm` 底下（不需副檔名）
* 「背景圖片」為字串，且圖片檔名應置於 `./picture/` 底下（不需副檔名，省略時為參數預設）
* 「難度分級」為一數字（整數、小數皆可）
* 「拍號」為長度二的陣列，像是四四拍應寫成 `[4, 4]`
* 「曲速」為一整數
* 「音符流速」為一整數，單位是像素/每幀（pixel/frame）
* 「譜面」為二維陣列，如下說明設定

## 譜面撰寫
對於譜面，第一個維度會放置小節數，第二個維度放置指定軌道的音符（二進制）：

{% codeblock lang:js %}
/* 譜面 */
[
    [...], // 第 1 小節
    [...], // 第 2 小節
    ...
]
{% endcodeblock %}

我們這邊以《Thinking at night》三個軌道為例。  
《Thinking at night》的主題曲，開頭的 3 小節主旋律（小節線用灰線補強）如下：

![圖 1、Thinking at night 曲目的主旋律](https://i.imgur.com/oVOt63C.png)

第一步，我們只拿第一小節，由於這裡所有音符都是 8 分音符，所以我們切割成 8 份，
如果我們想將其簡化成如圖 2 右邊的樣子：

![圖 2、第一小節簡化版](https://i.imgur.com/1P1f6mt.png)

接下來考慮二進位，
注意最高位與最低位相反跟軌道放置順序有關，
我這邊是由左至右排列（最低位在最左邊）：

{% codeblock lang:js %}
000 -> 0
001 -> 1
010 -> 2
001 -> 1
010 -> 2 
001 -> 4
100 -> 1
011 -> 6
{% endcodeblock %}

按照前後方向整理，這裡譜面是向下流動，所以整理成：

{% codeblock lang:js %}
[ 
    [6, 1, 4, 2, 1, 2, 1, 0],   // 第 1 小節
    [...],                      // 第 2 小節
    ...
]
{% endcodeblock %}

這個就是基本譜面的撰寫。

### 複雜的旋律

很多時候會看到多個音符分布的情況，考慮下列小節：

![圖 3、小節內有多種音符](https://i.imgur.com/tWkIpMK.png)

這個時候應該以「最小單位的音符」為準，圖 3 中最小單位是「16 分音符」。  
譜面中的小節將會是 16 個數字，然後可以先大致想一下要怎麼安排位置，如圖四：

![圖 4、抽象化的音符位置](https://i.imgur.com/5RrspdH.png)

然後，因為發出聲音的瞬間，是在音符開頭的地方（而非拉長的地方）
所以我們放置抽象的音符應該長的像圖 5 所示：

![圖 5、白點處為譜面音符位置](https://i.imgur.com/JemY2ue.png)

撰寫譜面為：
{% codeblock lang:js %}
[4, 1, 0, 2, 4, 1, 0, 2, 0, 2, 0, 0, 6, 0, 1, 0]
// 注意音符為向下流動，圖 5 最下方的白格是第一個元素
{% endcodeblock %}

{% note info %}
雖然說有音軌的話，旋律幾乎不會出錯，但實際效果還是需要重複多聽幾次以及實際去玩才能感受
{% endnote %}

### 音符縮寫

考慮圖 6 的音軌，這是短音與長音同處一小節的情況：

![圖 6、短音與長音](https://i.imgur.com/3YnmcaF.png)

如果按照前面的想法，那這裡最小單位是 16 分音符，
則我們可能會寫出這樣的譜面：

{% codeblock lang:js %}
// 二進制
000 -> 0
000 -> 0
000 -> 0
000 -> 0
000 -> 0
000 -> 0
000 -> 0
100 -> 1
000 -> 0
000 -> 0
000 -> 0
010 -> 2
000 -> 0
000 -> 0
000 -> 0
100 -> 1

// 譜面
[1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
{% endcodeblock %}

不難發現，我們的譜面大部分都為 `0` 且難以觀察，曲子一長就很難修改。
這時我們可以將這一小節縮寫，方式非常簡單：兩兩一組，拿掉後面的數字即可。
相當於：

{% codeblock lang:js %}
// 二進制
000 -> 0 // 刪除
000 -> 0
000 -> 0 // 刪除
000 -> 0
000 -> 0 // 刪除
000 -> 0
000 -> 0 // 刪除
100 -> 1
000 -> 0 // 刪除
000 -> 0
000 -> 0 // 刪除
010 -> 2
000 -> 0 // 刪除
000 -> 0
000 -> 0 // 刪除
100 -> 1

// 譜面
[1, 0, 2, 0, 1, 0, 0, 0]
{% endcodeblock %}

再進一步縮寫，可以得到：

{% codeblock lang:js %}
// 譜面
[1, 2, 1, 0]
{% endcodeblock %}

其實眼尖的人應該可以發現，音符縮寫其實相當於去修改譜面的最小單位：
![圖 7、縮寫的意義](https://i.imgur.com/DD1Enph.png)

{% note info %}
能這樣縮寫，是因為小節的時間，是程式依照陣列元素自動切割的。
{% endnote %}

### 長音符

如果上面都懂了，那麼這裡就很容易，我們再次以圖 6 舉例。
長音需要「開頭」以及「結尾」，如果將圖 6 的第三個音符當作長音符，
於下一小節結束，如下所示：

{% codeblock lang:js %}
[
    [1, 2, 1, 0],   // 圖 6 縮寫後
    [1, 0, 0, 0]    // 開頭的 1 為結尾
]
{% endcodeblock %}

則把數字寫成陣列，並於第二維度標示長音即可：

{% codeblock lang:js %}
[
    [1, 2, [1, 1], 0],   // 圖 6 最後一個音為長音
    [[1, 1], 0, 0, 0]    // 開頭的 1 為長音結尾
]
{% endcodeblock %}

長音的格式為：

{% codeblock lang:js %}
[/*原本的音符*/, /*長音標示*/]
{% endcodeblock %}

例如，全部三軌都要按下，但只有第二軌是長音，也是辦的到的：

{% codeblock lang:js %}
1 1 1 // 原本的音符 (111 = 7)
  ^   // 長音標示 (010 = 4)
{% endcodeblock %}

{% note warning %}
小心！長音沒有正確關閉的話，會出錯！
{% endnote %}

# 演示專案
我有準備一個演示的專案可以提供給需要的人下載，
當然也可以直接修改本專案來製作遊戲。

{% note primary %}
[下載演示專案 (Google Drive)](https://drive.google.com/file/d/1Op2lpthvHUenQ5BmZpobAbPv-qo6GYYZ/view?usp=sharing)
{% endnote %}
