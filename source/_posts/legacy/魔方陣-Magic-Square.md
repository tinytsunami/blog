---
title: 魔方陣 Magic Square
permalink: magic-square/
categories: legacy-algorithm
date: 2016-10-22
mathjax: true
---
這個是我們資料結構（Data Structure）的第二次作業，  
本文紀錄了**奇數**、**雙偶數**以及**單偶數**魔方陣（Magic Square）的做法。
<!-- more -->

老實說，上課不斷的聯想到太鼓達人的 ★9 曲「魔方陣-サモン・デルタ-」

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/UgK1_AflaME" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# 魔方陣定義
魔方陣定義是這樣的：

* 每一行（Column）的總和
* 每一列（Row）的總和
* 對角線的總和
* 上面每一個值都相等

{% note info %}
這邊採用了**直行橫列**的說法。
{% endnote %}

比方說圖 1 這樣：
![圖 1、$3$ x $3$ 與 4x4 魔方陣例子](https://i.imgur.com/50hRjKi.png)

接下來我會記錄如何製作魔方陣。

# 奇數魔方陣
奇數的魔方陣是魔方陣中比較簡單的一種，構造方式相當容易。  
正常情況下，給定一個 $n$ 在 $O(n^2)$ 時間複雜度內就可以完成。

* 第一列（Row）中間放「1」
* 不斷**往左上角移動（走出方格從對面出現）**、放入下一個數字
* 如果左上角空間**已有數字，則往下放一格**

以 $3$ x $3$ 魔方陣為例（$n = 3$）：

第一步：如圖 2 在中間上面放「1」

![圖 2、$3$ x $3$ 魔方陣第 1 步](https://i.imgur.com/SCB43cG.png)

第二步：如圖 3 不斷往左上走。同時累進數字。
（這個 1 從上方跑出方陣、於是 2 應該在下面。）

![圖 3、$3$ x $3$ 魔方陣第 2 步](https://i.imgur.com/Invvg6W.png)

如圖 4 我們接下來不斷重複。

![圖 4、$3$ x $3$ 魔方陣第 2 步重複](https://i.imgur.com/YweZ4PI.png)

第三步：如圖 5 這個 3 的左上方已經有數字，於是往下放一格。

![圖 5、$3$ x $3$ 魔方陣第 3 步](https://i.imgur.com/DK9XvRB.png)

依照這個步驟繼續完成。

![圖 6、$3$ x $3$ 魔方陣](https://i.imgur.com/7xFxDuz.png)

如圖 6 所示，我們最終就得到一個不錯的方陣。

## 算法
只要考慮跑出方陣、以及碰撞到有值的格子就可以了。

{% codeblock lang:C %}
...
//計算下一步的座標
x = (x - 1 &lt; 0)? width : x - 1;
y = (y - 1 &lt; 0)? height : y - 1;

//如果下一步有值
if(!empty(map[x][y]))
{
        //先回到上一步
    x = tx;
    y = ty;

    //往下移動一格
    y = (y + 1 &gt; height)? 0 : y + 1;
}

//確定位置後，填入數值
map[x][y] = value;

//記錄這一步的座標
tx = x;
ty = y;
...
{% endcodeblock %}

## 演示

{% jsfiddle yq50092e result,js,html,css dark 100% 280px %}

# 雙偶數魔方陣
雙偶數指的是 4 的倍數。這類型的魔方陣比奇數更複雜一些。
雙偶數的魔方陣的做法：

* 先**按照順序填入**
* 找到**主對角線**
* 找到**副對角線**
* 把不在對角線上的值依序取下
* 把取下的值從後面**反過來填上**

重點在於，何謂主、副對角線呢？
這邊的解釋是，任何可以切割成方格的樣子。

![圖 7、$4$ x $4$ 魔方陣（藍色為主對角線）](https://i.imgur.com/7xFxDuz.png)

![圖 8、$8$ x $8$ 魔方陣（藍色為主對角線、紅色為副對角線）](https://i.imgur.com/tq5mSR8.png)

從圖 7 與圖 8 就可以看出來，藍色背景的是我所認知的「主對角線」、而紅色背景是「副對角線」。

* 當 $n = 4$ 時，沒有副對角線。
* 當 $n \geq 8$ 時，有副對角線。

## 算法
最麻煩的是、你如何抓對角線呢？  
讓我們來仔細觀察看看圖 9：

![圖 9、對角線座標觀察](https://i.imgur.com/naerzSE.png)

不曉得有沒有發現呢？ 他縱向、橫向的規律是一致的。  
然後他對角線上的值有這樣的特性：

* 位置 $(x, y)$
* 如果 $x \mod 4 = 0$ 或 $3$ 且 $y \mod 4 = 0$ 或 $3$（上方紅色）
* 如果 $x \mod 4 = 1$ 或 $2$ 且 $y \mod 4 = 1$ 或 $2$（上方藍色）

{% codeblock lang:C %}
...
//弄個陣列
array = []

//遍歷位置
for(x is 0 to width)
    for(y is 0 to height)
    {
        //屬於非對角線的話，推入陣列
        if(belong(x, y))
            array.push((x, y));
    }

//翻轉陣列
array.reverse();

//最後填回
for(x is 0 to width)
    for(y is 0 to height)
    {
        //屬於非對角線的話，從陣列中回填
        if(belong(x, y))
            (x, y) = array.pop();
    }
...
{% endcodeblock %}

這樣就可以把雙偶數魔方陣完成。

## 演示

{% jsfiddle 744xrkk1 result,js,html,css dark 100% 280px %}

# 單偶數魔方陣
這是所有方陣中最複雜的。但其也有跡可循。  
然而我們可以觀察到，它的大小：$n = 4k+2$
舉例來說：

* $k = 1$、$n = 4+2 = 6$
* $k = 2$、$n = 8+2 = 10$
* ...

{% note warning %}
注意：當 $k = 0$ 時，則 $n = 2$ 的 2x2 魔方陣並不存在。
{% endnote %}

除了奇數、4 的倍數外、剩下的剛好都是 $4k+2$ 的形式。  
這種方陣的樣貌大致上呈現，如圖 10 及圖 11 這樣：

![圖 10、6x6 魔方陣（$n=6$、$k=1$）](https://i.imgur.com/sXPLdE7.png)

![圖 11、10x10 魔方陣（$n=10$、$k=2$）](https://i.imgur.com/bPsDTMt.png)

這邊來敘述這種方陣的構成：

* 先構造一個 $n / 2$ 的魔方陣，作為子方陣
* 拼合 4 個子方陣（規則下面會說明）
* 透過 $k = (n - 2) / 4$ 求出 $k$
* 搬動方陣內的元素

我們以 $n = 6$ 為例子。  
首先，我們得構造一個 $3$ x $3$ 的魔方陣，如圖 12：

![圖 12、$3$ x $3$ 魔方陣](https://i.imgur.com/CZBPgzy.png)

接著我們要拚合子方陣。先看圖 13：

![圖 13、拼合子方陣結構](https://i.imgur.com/totfAHj.png)

總共會把子方陣複製 4 份貼在 $6$ x $6$ 的方陣中。  
不過還得加上一個常數：$m \cdot (n / 2)^2$

* A 區塊 $m = 0$、所以方陣中元素加 $0$
* B 區塊 $m = 2$、所以方陣中元素加 $2 \cdot 3^2 = 18$
* C 區塊 $m = 3$、所以方陣中元素加 $3 \cdot 3^2 = 27$
* D 區塊 $m = 1$、所以方陣中元素加 $1 \cdot 3^2 = 9$

將其累進拚合後：

![圖 14、拼合方陣](https://i.imgur.com/2yCaG9e.png)

這樣就拚合了 4 個子方陣成為一個大的 6x6 方陣，如圖 14。  
不過還沒有完成。我們得搬動一些元素才行。

接著，透過 $k = (n - 2) / 4$ 求出 $k$。$n = 6$ 代表 $k = 1$
然後把矩陣分成上下兩塊，如圖 15：

![圖 15、拼合方陣上下分割](https://i.imgur.com/yl17sjK.png)

搬動元素的規則為：

* 上面區塊的左上角 $k$ x $k$ 方陣跟下方換。
* 上面區塊的左下角 $k$ x $k$ 方陣跟下方換。
* 上面區塊的中間列（Row）從 $k$ 位置向右 $k$ 格跟下方換
* 上面矩陣的 $(n/2) + \lfloor n/4 \rfloor$（也就是右半邊的中間）處向右 $k - 1$ 格跟下方換

實際標記看看，上面區塊的左上角 $k$ x $k$ 方陣跟下方換（$k = 1$），如圖 16：

![圖 16、交換左上角區塊](https://i.imgur.com/k0w6LsS.png)

上面區塊的左下角 $k$ x $k$ 方陣跟下方換（$k = 1$），如圖 17：

![圖 17、交換左下角區塊](https://i.imgur.com/pyDJ8bL.png)

上面區塊的中間列（Row）從 $k$ 位置（綠框）向右 $k$ 格（藍框）跟下方換（$k = 1$），如圖 18：

![圖 18、交換中間列區塊](https://i.imgur.com/8kVKxGT.png)

{% note warning %}
注意計算綠框向右 $k$ 格時，綠框自己不算是 1 格。
{% endnote  %}

上面矩陣的 $(n/2) + \lfloor n/4 \rfloor$ 處向右 $k - 1$ 格跟下方換，  
這邊理解一下，雖然看起來很複雜，但 $n/2$ 是子方陣的大小、$(n/2)/2$ 恰為子方陣大小的一半。  
從綠框處（含）、往右 $0$ 格（藍框、因為是 $0$ 而無法顯示）如圖 19：

![圖 19、交換右側直行區塊](https://i.imgur.com/yEXXqu3.png)

{% note info %}
您可以在演示區使用 $10$ x $10$ 的魔方陣觀察這一步。
{% endnote  %}

這樣最後得到的，如圖 20 就是完好的魔方陣了。

![圖 20、$6$ x $6$ 魔方陣](https://i.imgur.com/V4dCf8W.png)

## 算法
知道了構造方式、接下來的只是土法煉鋼。

{% codeblock lang:C %}
...
//生成 nxn 空間
map[n][n];

//奇數方陣大小
odd_size = n/2;

//構造奇數方陣
odd_magic = magic(odd_size);

//組合子方陣
for(int x=0; x&lt;odd_size; x++)
    for(int y=0; y&lt;odd_size; y++)
    {
            //組合 A 子方陣
        map[x][y] = odd_magic[x][y];
        //組合 B 子方陣
        map[x+(n/2)][y] = odd_magic[x][y] + 2*pow(odd_size, 2);
        //組合 C 子方陣
        map[x][y+(n/2)] = odd_magic[x][y] + 3*pow(odd_size, 2);
        //組合 D 子方陣
        map[x+(n/2)][y+(n/2)] = odd_magic[x][y] + 1*pow(odd_size, 2);
    }

//計算 k 值
k = (n - 2)/4;

//交換左上角區塊
for(int x=0; x&lt;k; x++)
    for(int y=0; y&lt;k; y++)
        swap(map[x][y], map[x][y+odd_size]);

//交換左下角區塊
for(int x=0; x&lt;k; x++)
    for(int y=0; y&lt;k; y++)
        swap(map[x][odd_size-y], map[x][n-y]);

//交換中間區塊
for(int x=0; x&lt;k; x++)
    swap(map[k+x][odd_size/2], map[k+x][n-(odd_size/2)]);

//交換右邊的(k-1)區塊
pos = oddsize + (odd_size/2);
for(int x=pos; x&lt;pos+k-1; x++)
    for(int y=0; y&lt;odd_size; y++)
        swap(map[x][y], map[x][y+odd_size]);
...
{% endcodeblock %}

## 演示

{% jsfiddle 1samkxs3 result,js,html,css dark 100% 410px %}
