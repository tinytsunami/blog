---
title: 影像濾波 Image Filter
permalink: image-filter/
categories: legacy-algorithm
date: 2020-08-02
mathjax: true
---
這次的主題是影像濾波（image filter）。

這也是大學影像處理課的內容，基本的東西已經寫過了，
原先考慮到加入一些其他新東西，可是後來想說不要把文章複雜化，
所以新東西可能之後才會發。

<!-- more -->

{% note success %}
請參閱 {% permalink ming-chuan-university-homework %} 的「影像處理課程」部分。
{% endnote %}

# 相關名詞

在開始之前，可能要釐清一些相似的概念，
包括我自己也是，下面 4 件事情很容易混淆：

* 影像濾波（image filter）
* 影像濾鏡（image filter）
* 影像相關（image correlation）
* 影像卷積（image convlusion）

後來看了一些資料，才把這些事情搞清楚。

{% note info %}
影像相關（image correlation）的中譯取自《数字图像处理（第三版）》
{% endnote %}

我們先看濾波與濾鏡好了，因為某些不明原因，似乎兩者的英文原文是相同的；
不過很濾波是來自於訊號處理，而濾鏡是來自攝影的鏡頭配件。

電腦科學上的濾鏡，這邊採用 Computer Definition 的定義：

{% blockquote %}
A software routine that changes the appearance of an image or part of an image by altering the shades and colors of the pixels in some manner. Filters are used to increase brightness and contrast as well as to add a wide variety of textures, tones and special effects to a picture.
{% endblockquote %}

簡單的說，濾鏡是一種「軟體」，任何能夠修改圖像陰影、顏色、明暗的都可以算是一種影像濾鏡。

至於濾波，通常是指「濾波器」（Filter）是來自訊號處理的領域，
意思是「濾除某些東西」，用訊號來比方的話，像是低通濾波器，意思是低頻的會通、高頻則被「濾除」了。

很顯然，所以我們可以針對某個域來處理，影像的話，有「空間」跟「頻率」兩個域，
分別對應了「空間濾波器」跟「頻率濾波器」兩大類型。至於考量函數特性的線性、非線性也是一種分類方法。

濾波與卷積在訊號處理上是完全不同的東西。應該說，卷積只是濾波的一種操作方法。

在影像處理中，空間濾波的操作是透過相關（correlation）或卷積（convlusion）操作實現的，
透過濾波器（filter）在源圖像上進行掃描，然後逐步運算得出新圖像。

{% note info %}
濾波器（filter）也被稱為核（kernel）
{% endnote %}

假設 $f(x, y)$ 是 $3 \times 3$ 濾波器，而 $g(x, y)$ 是圖像。
若執行「相關」操作，則新圖像 $h(x, y)$ 是：

$$
h(x, y) = \text{cor}(f(x, y), g(x, y)) = \sum\limits_{i=-a}^{a} \sum\limits_{j=-b}^{b} f(i, j) \cdot g(x + i, y + j)
$$

改執行「卷積」操作則為：

$$
h(x, y) = \text{conv}(f(x, y), g(x, y)) = \sum\limits_{i=-a}^{a} \sum\limits_{j=-b}^{b} f(i, j) \cdot g(x - i, y - j)
$$

不同的濾波器會對應不同的效果，可以參考 {% link Wikipedia: Kernel (image processing) https://en.wikipedia.org/wiki/Kernel_(image_processing) %}
圖像相關跟圖像卷積兩者操作基本上一樣，唯獨卷積在濾波器上轉了 180 度。

{% note info %}
這邊的定義是採奇數大小、中心座標為原點的濾波器。
意即 $3 \times 3$ 的濾波器，對應的參數為 $a = 1, b = 1$
{% endnote %}

# 均值濾波器

相似地，若輸出為 $h(x, y)$ 數學上的定義為：

$$
h(x, y) 
= \frac{\text{cor}(f(x, y), g(x, y))}{\sum\limits_{i=-a}^{a} \sum\limits_{j=-b}^{b} f(i, j)}
= \frac{\sum\limits_{i=-a}^{a} \sum\limits_{j=-b}^{b} f(i, j) \cdot g(x + i, y + j)}{\sum\limits_{i=-a}^{a} \sum\limits_{j=-b}^{b} f(i, j)} 
$$

看起來很難懂，其實就是拿著濾波器掃描圖片，然後被濾波器蓋住的地方，就平均一下。

![圖 1、均值濾波器](https://i.imgur.com/naVLmQK.png)

參考圖 1 的例子，濾波器放在左上角，經過計算：

$$
\sum\limits_{i=-1}^{1} \sum\limits_{j=-1}^{1} f(i, j) = 9
$$

所以把對應的格子乘以權重（這邊為 $1$）加起來，然後除以 $9$ 就可以了：

$$
h(x, y) 
= \frac{\text{cor}(f(x, y), g(x, y))}{9}
= \frac{\sum\limits_{i=-1}^{1} \sum\limits_{j=-1}^{1} f(i, j) \cdot g(x + i, y + j)}{9} 
$$
$$
= \frac{216+255+255+102+216+255+102+102+255}{9} 
= \frac{1758}{9} = 195
$$

{% codeblock lang:js %}
/* 設定變數 */
let i, j, k, p, q;          // 用於迴圈的註標
let sum;                    // 用於加總圖片濾波器的總和
let index;                  // 用於計算實際圖片的像素的位置
let filter = [              // 濾波器
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
];
let w = imgData.width;      // 圖片的寬度
let h = imgData.height;     // 圖片的長度
let fw = 3;                 // 濾波器的寬度
let fh = 3;                 // 濾波器的長度
let fs = 9;                 // 濾波器的大小

/* 建立圖片副本 */
let newData = imageContext.createImageData(w, h);
newData.data.set(imgData.data);

/* 計算濾波器中心，在圖片上的位置 */
for (i = 1; i < (w - fw - 1); i++) {
    for (j = 1; j < (h - fh - 1); j++) {

        /* 計算圖片的三種顏色 */
        for (k = 0; k < 3; k++) {
            
            /* 計算濾波器覆蓋圖片區域的平均值 */
            sum = 0;
            for (p = -1; p < fw - 1; p++) {
                for (q = -1; q < fh - 1; q++) {
                    index = ((j + q) * w + (i + p)) * 4 + k;
                    sum += filter[p + 1][q + 1] * imgData.data[index];
                }
            }
            sum /= fs;

            /* 將平均值賦值給這塊區域的所有像素 */
            for (p = -1; p < fw - 1; p++) {
                for (q = -1; q < fh - 1; q++) {
                    index = ((j + q) * w + (i + p)) * 4 + k;
                    newData.data[index] = sum;
                }
            }
        }
    }
}

/* 顯示新圖片 */
imageContext.putImageData(newData, 0, 0);
{% endcodeblock %}

{% note warning %}
實作時，應該另開記憶體空間，以避免取樣到加工過的圖片 $h(x, y)$
{% endnote %}

# 中值濾波器

中值濾波器只是在濾波器的範圍內找最大輸出：

$$
h(x, y) = \max\limits_{i, j \in \\{-1, 0, 1\\}} g(x + i, y + j)
$$

![圖 2、中值濾波器](https://i.imgur.com/kQbriZT.png)

中值濾波器的一個功能是，在圖片遭受胡椒鹽雜訊（Salt-and-pepper noise）時，
則可以透過中值濾波器修復，參考圖 3 的原圖：

![圖 3、未受胡椒鹽雜訊汙染的圖像圖](https://i.imgur.com/mGqhnpg.png)

當遭受胡椒鹽雜訊干擾，呈現圖 4 的樣子：

![圖 4、胡椒鹽雜訊汙染後的圖像](https://i.imgur.com/yu7R0R9.png)

我們透過中值濾波器，可以修復為圖 5 的樣子：

![圖 5、經中值濾波器復原後的圖像](https://i.imgur.com/Gpzy1P3.png)

不過，當胡椒鹽雜訊過強時，像是圖 6 那樣，中值濾波器也難以修復：

![圖 6、嚴重胡椒鹽雜訊汙染的圖像](https://i.imgur.com/yAxd9OO.png)

{% codeblock lang:js %}
/* 設定變數 */
let i, j, k, p, q;          // 用於迴圈的註標
let index;                  // 用於計算實際圖片的像素的位置
let arr = [];               // 用於計算中位數的陣列
let median;                 // 紀錄的中位數
let w = imgData.width;      // 圖片的寬度
let h = imgData.height;     // 圖片的長度
let fw = 3;                 // 濾波器的寬度
let fh = 3;                 // 濾波器的長度
let fs = 9;                 // 濾波器的大小

/* 建立圖片副本 */
let newData = imageContext.createImageData(w, h);
newData.data.set(imgData.data);

/* 計算濾波器中心，在圖片上的位置 */
for (i = 1; i < (w - fw - 1); i++) {
    for (j = 1; j < (h - fh - 1); j++) {

        /* 計算圖片的三種顏色 */
        for (k = 0; k < 3; k++) {
            
            /* 計算濾波器覆蓋圖片區域的中位數 */
            sum = 0;
            for (p = -1; p < fw - 1; p++) {
                for (q = -1; q < fh - 1; q++) {
                    index = ((j + q) * w + (i + p)) * 4 + k;

                    /* 直接找到註標塞值到 arr 中 */
                    /* 效能會比每次都重建陣列 push 來的好 */
                    arr[(q + 1) * fh + (p + 1)] = imgData.data[index];
                }
            }
            arr.sort((a, b) => (a < b ? -1 : 1)); // 排序固定數量的 9 個數
            median = arr[4];                      // 中位數是第 5 個數（註標 4）

            /* 將中位數賦值給這塊區域的所有像素 */
            for (p = -1; p < fw - 1; p++) {
                for (q = -1; q < fh - 1; q++) {
                    index = ((j + q) * w + (i + p)) * 4 + k;
                    newData.data[index] = median;
                }
            }
        }
    }
}

/* 顯示新圖片 */
imageContext.putImageData(newData, 0, 0);
{% endcodeblock %}

# 銳化濾波器

最後來看銳化濾波器，首先我們定義一階微分，
由於我們處理的數值是離散的、且變化量發生在相鄰像素之間，於是定義：

$$ \frac{\partial f}{\partial x} = f(x+1) - f(x) $$

同樣地，我們定義二階微分：

$$ \frac{\partial^2 f}{\partial x^2} = \frac{\partial f}{\partial x} (f(x+1) - f(x)) $$
$$ = \frac{\partial f}{\partial x} f(x+1) - \frac{\partial f}{\partial x} f(x) $$
$$ = (f(x+2) - f(x+1)) - (f(x+1) - f(x)) $$
$$ = f(x+2) - 2f(x+1) + f(x) $$

我們遞移像素中心到 $x+1$ 所以表示為：

$$ f(x+2) - 2f(x+1) + f(x) $$
$$ = f(x+1) - 2f(x) + f(x-1) $$

考慮雙變數在偏微分下的情況：

$$ \frac{\partial^2 f(x, y)}{\partial x^2} = f(x+1, y) - 2f(x, y) + f(x-1, y) $$

$$ \frac{\partial^2 f(x, y)}{\partial y^2} = f(x, y+1) - 2f(x, y) + f(x, y-1) $$

接著定義圖像 $f(x,y)$ 的拉普拉斯算子：

$$ \nabla^2 f(x, y) = \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2} $$

拉普拉斯算子是先做梯度再散度：

$$ \nabla^2 f(x, y) = \nabla \cdot (\nabla f) $$

圖像函數 $f(x, y)$ 梯度：

$$ \nabla f(x, y) = (\frac{\partial f}{\partial x},  \frac{\partial f}{\partial y}) $$

注意到這一步為止的結果是「向量」。

代表 $\nabla f(x, y)$ 本身是一個平面座標的向量場，接著 $\nabla f(x, y)$ 的散度：

$$ \nabla^2 f(x, y) = \nabla \cdot \nabla f(x, y)$$
$$ = \nabla (\frac{\partial f}{\partial x},  \frac{\partial f}{\partial y}) = \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2} $$

注意到這一步為止的結果是「純量」。

觀察性質上：
* 圖片函數，即你所看到的圖片
* 圖片函數梯度，即圖片發生像素變化的「方向跟量」
* 圖片函數梯度的散度，即「圖片發生像素變化的『方向跟量』」的變化量總和

{% note info %}
因為是總和，所以 $\frac{\partial^2 f}{\partial x^2}$ 跟 $\frac{\partial^2 f}{\partial y^2}$ 有可能會抵消。
{% endnote %}

現在只有變化量，然後我們要「在原圖上加強我們的變化」那就是「加上原圖」得到，所以銳化圖片 $g(x, y)$ 為：

$$g(x, y) = f(x, y) + c\left[\nabla^2 f(x, y)\right]$$

其中，常數 $c$ 常見的值為 $c = 1$ 或 $c = -1$

結合上述的結果，可以得到拉普拉斯的銳化濾波器：

$$ f(x, y) + c[\nabla^2 f(x, y)] = f(x, y) + c [\nabla \cdot \nabla f(x, y)]$$
$$ = f(x, y) + c[\frac{\partial^2 f(x, y)}{\partial x^2} + \frac{\partial^2 f(x, y)}{\partial y^2}]$$
$$ = f(x, y) + c[f(x+1, y) - 2f(x, y) + f(x-1, y) + f(x, y+1) - 2f(x, y) + f(x, y-1)] $$
$$ = f(x, y) + c[f(x+1, y) + f(x-1, y) + f(x, y+1) + f(x, y-1) - 4f(x, y)] $$
$$ = (1 - 4c)f(x, y) + cf(x+1, y) + cf(x-1, y) + cf(x, y+1) + cf(x, y-1)$$

當 $c = -1$ 時，濾波器可參考圖 7 所示，式子為：

$$5f(x, y) + f(x+1, y) + f(x-1, y) + f(x, y+1) + f(x, y-1)$$

![圖 7、銳化濾波器](https://i.imgur.com/mIttFB5.png)

{% codeblock lang:js %}
/* 設定變數 */
let i, j, k, p, q;          // 用於迴圈的註標
let sum;                    // 用於加總圖片濾波器的總和
let index;                  // 用於計算實際圖片的像素的位置
let c = -1;                 // 參考公式，任意常數（常為 -1）
let filter = [              // 參考公式，濾波器
    [0, c, 0],
    [c, 1 - 4 * c, c],
    [0, c, 0]
];
let w = imgData.width;      // 圖片的寬度
let h = imgData.height;     // 圖片的長度
let fw = 3;                 // 濾波器的寬度
let fh = 3;                 // 濾波器的長度
let fs = 9;                 // 濾波器的大小

/* 建立圖片副本 */
let newData = imageContext.createImageData(w, h);
newData.data.set(imgData.data);

/* 計算濾波器中心，在圖片上的位置 */
for (i = 1; i < (w - fw - 1); i++) {
    for (j = 1; j < (h - fh - 1); j++) {

        /* 計算圖片的三種顏色 */
        for (k = 0; k < 3; k++) {
            
            /* 計算濾波器覆蓋圖片區域的值（參考公式） */
            sum = 0;
            for (p = -1; p < fw - 1; p++) {
                for (q = -1; q < fh - 1; q++) {
                    index = ((j + q) * w + (i + p)) * 4 + k;
                    sum += filter[p + 1][q + 1] * imgData.data[index];
                }
            }

            /* 將該值賦值給像素（需要限制值域，計算後可能會超出範圍） */
            index = (j * w + i) * 4 + k;
            newData.data[index] = Math.max(Math.min(sum, 255), 0);
        }
    }
}

/* 顯示新圖片 */
imageContext.putImageData(newData, 0, 0);
{% endcodeblock %}

# 邊界處理

由於濾波器不會完全覆蓋，所以圖像邊界要特殊處理，常見的方式有 3 種：

* 跳過不處理
* 在原圖的邊界補零
* 延伸原圖的邊界

跳過不處理的話，濾波器可以從圖像的 $(1, 1)$ 開始，移動至 $(\text{width} - 2, \text{height} - 2)$ 停止。<br/>
而邊界補零是非常常見的做法，意思是當濾波器跑出範圍，則預設給 $0$ 值，參考圖 8，<br/>
不過缺點是輸出的邊界很容易黑黑的，但是可以省去很多例外條件的判斷。

![圖 8、邊界處理：補零](https://i.imgur.com/3CBMICm.png)

至於為了獲得更好的效果，我們可以像圖 9 那樣，
把圖片的邊界「延伸」到圖片外一圈，如此一來，就會得到更好的效果。

![圖 9、邊界處理：延伸](https://i.imgur.com/DgqiZSQ.png)

# 演示

{% jsfiddle 40unwrc5 result,js,html,css dark 100% 530px %}

{% note info %}
此演示的圖像邊界是採用「跳過不處理」的方式
{% endnote %}

# 參考資料

* 《数字图像处理（第三版）》(ISBN：9787121110085)
* [image filter - Computer Definition](https://www.yourdictionary.com/image-filter)
* [滤波和卷积](https://rocky69.pixnet.net/blog/post/218272785-%5B%E8%BD%89%5D%E6%BF%BE%E6%B3%A2%E5%92%8C%E5%8D%B7%E7%A9%8D)
* {% link Wikipedia: Kernel (image processing) https://en.wikipedia.org/wiki/Kernel_(image_processing) %}
* {% link Wikipedia: Salt-and-pepper noise https://en.wikipedia.org/wiki/Salt-and-pepper_noise %}
