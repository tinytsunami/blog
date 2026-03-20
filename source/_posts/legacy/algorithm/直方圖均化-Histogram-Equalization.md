---
title: 直方圖均化 Histogram Equalization
permalink: histogram-equalization/
categories: (legacy) algorithm
date: 2020-03-25
mathjax: true
---
之前影像處理課有寫過直方圖均化（Histogram Equalization）的程式，
這篇是重新紀錄做法，以及提供 Web 的演示。

<!-- more -->

因為最近稍微小忙，為了保持每月更新的步調，
所以挑了一個比較簡單的主題先寫這樣 XD"

{% note success %}
請參閱 {% permalink ming-chuan-university-homework %} 的「影像處理課程」部分。
{% endnote %}

# 色階與直方圖

圖片的「色階」（level）是統計圖片像素的灰階亮度或各顏色分量，
然後依照其值與像素的數量，畫成一張直方圖（histogram）如圖 1 所示：

![圖 1、Paint.net 中的色階](https://i.imgur.com/Ms1N4xX.png)

{% note info %}
嚴格說，色階是顏色亮度的強弱，但直方圖是表示色階的一種圖表；
表示色階未必要用直方圖，而且直方圖的 X 與 Y 軸也不見得是亮度與數量。
{% endnote %}

# 直方圖均化

直觀地說，直方圖均化（histogram equalization）做法是紀錄圖像中，每個像素（pixel）的亮度（brightness），
然後根據「每個像素亮度的數量」重新分配亮度的過程，具體作法如下：

1. 初始化直方圖 $h(c, v) = 0 \\ \forall c, v$ 其中 $c \in \\{0, 1, 2\\}$ 為顏色分量，而 $v = [0, 255] \in N$ 為統計數量
2. 遍歷所有像素，計算出直方圖 $h(c, v)$
3. 根據直方圖 $h$ 算出累積分布函數（Cumulative Distribution Function, CDF）
其定義為 $CDF(c, v) = \sum_{i = 0}^{v} h(c, i)$
4. 按 $CDF$ 比例，重新分配像素 $p(c)$ 顏色 $c$ 的亮度值，定義為：

$$
p_{new}(c) = round\left(\text{color_range} \cdot \frac{p_{old}(c) - CDF_{min}(c)}{\text{image_size} - CDF_{min}(c)}\right) \\ \\forall c
$$

其中，根據累積分布函數的定義，有 $CDF_{min}(c) = CDF(c, 0)$ 的關係，
而 $\text{color_range}$ 是該顏色 $c$ 的最大值、$\text{image_size}$ 的圖片像素總數（寬、高相乘），
另外就是 $round$ 函數實際上可以根據需要調整（常見的候選為 $floor(x)$ 及 $ceil(x)$ 函數）。

具體的程式如下：

{% codeblock lang:js %}
/* 直方圖初始化 */
let histogram = Array.from({length: 3}, () => {
  return Array.from({length: 256}, () => 0);
});

/* 遍歷所有像素 */
let pixels = imgData.data;                              // 讀取的圖片值，存在 ImageData 中
for (let i = 0, l = pixels.length; i < l; i += 4) {     // 每個像素都有紅, 綠, 藍及透明度，共 4 個值
  for (let c = 0; c < 3; c += 1) {                      // 紀錄 3 種顏色的數量
    histogram[c][pixels[i + c]] += 1;
  }
}

/* 累積分布函數初始化 */
let cdf = Array.from({length: 3}, () => {
  return Array.from({length: 256}, () => 0);
});

/* 計算累積分布函數 */
for (let c = 0; c < 3; c += 1) {                        // 遍歷所有顏色
  cdf[c][0] = histogram[c][0];                          // 紀錄第一個數量值
  for (let i = 1; i < 256; i += 1) {
    cdf[c][i] = cdf[c][i - 1] + histogram[c][i];        // 累計後面所有數量的值
  }
}

/* 定義一些變數 */
let w = imgData.width;                                  // 舊圖片的寬度
let h = imgData.height;                                 // 舊圖片的高度
let max = w * h;                                        // 圖片的像素總數（image_size = width*height）
let newData = imageContext.createImageData(w, h);       // 宣告新圖片

/* 開始直方圖均化 */
for (let c = 0; c < 3; c += 1) {                        // 遍歷所有顏色
  let min = cdf[c][0];                                  // 取的該顏色最小 CDF 值
  for (let i = 0, l = pixels.length; i < l; i += 4) {   // 遍歷所有像素
    let v = cdf[c][pixels[i + c]];                      // 取得 CDF 值
    let r = (v - min) / (max - min);                    // 計算該 CDF 值的比例
    newData.data[i + c] = Math.round(255 * r);          // 設定新圖片的像素顏色（color_range = 255）
    newData.data[i + 3] = 255;                          // 設定新圖片的像素透明度
  }
}
{% endcodeblock %}


{% note success %}
關於讀取、顯示圖片，請參考 {% permalink javascript-file-process %} 及 [MDN ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) 相關文章。
{% endnote %}

{% note info %}
在 Paint.net 軟體中的「自動色階」功能，就是「直方圖均化」。
{% endnote %}

# 演示

{% jsfiddle 9v4xg21t result,js,html,css dark 100% 600px %}

{% note info %}
重複執行多次直方圖均化時，由於浮點數經過 $round(x)$ 函數，
會導致直方圖有時候會有稍微差異（約 1 個亮度值），但是對於圖片來說，並不會造成視覺上的改變。
{% endnote %}
