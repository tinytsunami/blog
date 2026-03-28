---
title: 老鼠走迷宮 Mouse Maze
permalink: mouse-maze/
categories: legacy-algorithm
date: 2016-11-13
mathjax: true
---
這是資料結構第三次作業。  
本篇老鼠走迷宮會大致上分成：「生成迷宮」與「解出迷宮」兩個部分。
<!-- more -->

# 建立迷宮
老鼠走迷宮畢竟是一個經典問題，當然對於迷宮生成也是，  
所以已經有許多很棒的網路資源可以參考了。

{% note info %}
我覺得很棒的 [參考資料](http://hctu.blogspot.tw/search?q=%E8%BF%B7%E5%AE%AE\)
{% endnote %}

{% note success %}
本文改寫前使用碎形結構建立迷宮。<!-- ；請參閱 [L系統與碎形 L-system and Fractal](/2018/03/03/L系統與碎形%20L-system%20and%20Fractal/#more) -->
{% endnote %}

那接下來，我就不重複裡面的內容，畢竟重複就沒有太大的意義。  
我會依照我原先的想法來製作迷宮。

好的迷宮是又亂又複雜的，所以直觀的想法是：使用亂數。

參考室內結構來說，梁柱、牆板之類的部分是必要的；  
我想迷宮也一樣，而且我們最好有一條路徑可以找到出口。

對於亂數生成的做法來講，以下提供基本操作的想法：

* 產生入口
* 產生出口
* 格子狀佈滿柱子
* 柱子間隨機方向延伸 1 格成為牆板，或不延伸
* 輸出迷宮

{% note info %}
好的迷宮有哪些特徵呢？
{% endnote %}

## 演示
演示提供三個參數可以調整。

我增加了柱子間連接的機率，也就是說，即使選取了A、B兩個柱子。  
也要剛好機會符合才相接牆面，間接降低了圖形的密度。

{% jsfiddle rzun2ogn result,js,html,css dark 100% 560px %}

# 迷宮解法

{% note success%}
本段需有堆疊與佇列的先備知識；請參閱 {% permalink stack-and-queue %}
{% endnote %}

其實在之前 ITSA 中就有這樣的題目，  
當時是採用複製地圖副本且標記的作法來解，也順利解出來了。  
其實是同一類的做法，只差在這邊多了一種資料結構來控制與調整。

有趣的是，如果直接在地圖上記錄哪裡走過，  
最後輸出路徑還是需要掃描一次地圖。

下面是解法的粗略步驟：  
1. 堆疊初始化（存入第一步）
2. 根據堆疊內的資料走出下一步
3. 走出下一步時將資料存入堆疊
4. 重複 2 ~ 3 步驟，直到堆疊為空或到達出口

{% codeblock lang:c %}
...
// 給予第一步
stack.push((0, 0));
// 尚有路徑沒試
while(!stack.empty())
{
    // 走回頭路
    obj step = stack.pop();
    x = step.x;
    y = step.y;
    dir = step.dir;
    ...
    // 嘗試每個方向
    while(dir)
    {
        // 下一步的位置
        u = x + dx;
        v = y + dy;
        // 下一步可以通行
        if(map[u][v].through())
        {
            // 把這步塞進堆疊
            stack.push((x, y));
            // 移動到下一步
            x = u;
            y = v;
            // 發現這步正是終點
            if(map[x][y].end?())
                outputResult();
            //方向重置
            dir.initialize();
        }
    }
}
// 所有路徑都已經嘗試
// 但沒有走到終點，代表無解
noResult();
...
{% endcodeblock %}

這邊巧妙的利用方向重置來找路，並僅使用一行掉頭找其他路徑。
{% note info%}
迷宮的布局、嘗試方向的順序，皆會影響解出迷宮的時間。
{% endnote %}

## 演示

{% jsfiddle suws2m74 result,js,html,css dark 100% 540px %}
