---
title: 邏輯回歸與感知器 Logistic Regression and Perceptron
permalink: logistic-regression-and-perceptron/
categories: (legacy) algorithm
date: 2017-11-02
mathjax: true
---
上一篇介紹的是線性回歸與梯度下降，這一篇將會討論「邏輯回歸與感知器」。
<!-- more -->

# 前言
在這邊先約定一件事情，就是對數函數的表示法：

* $log(x)$ 表示以 10 為底
* $lg(x)$ 表示以 2 為底
* $ln(x)$ 表示以 $e$ 為底

因為第一種表示法很容易造成混淆，  
所以這邊就事前說明，不要造成大家的困擾。

{% note info %}
這是 Chrome 瀏覽器搜尋的表示法；你可以在網址列輸入 log(10)、lg(2) 及 ln(e) 來觀察。
{% endnote %}

{% note success %}
這是 ANN 的系列文章
上一篇是 {% permalink linear-regression-and-gradient-descent %}
下一篇是 {% permalink fully-connected-neural-network %}
{% endnote %}

{% note success %}
筆者於大學專題時，曾向組員介紹過相關內容，如有需要可以參考 [Logistic Regression 簡報](https://docs.google.com/presentation/d/1IfcViNOgnE3g2yj6tdWGsNnm2D1cb0nkB87crTMTFno/edit?usp=sharing)
{% endnote %}

# 邏輯回歸
邏輯回歸公式看起來還蠻複雜的，不過依舊有跡可循。  
首先，我們回憶線性回歸的一些式子：

$h_{\theta}(x) = \theta_{0} + \theta_{1}x$

還記得這個做什麼的話就好辦了，首先我們有一堆 $x$ 跟 $y$ 的資料（訓練資料），  
然後我們透過找 $\theta$ 來確定之後新資料的 $y$ 值，換言之 $h_{\theta}(x)$ 其實就是新資料要代入的函數。

現在問題在於，如果我希望這個 $h_{\theta}(x)$ 介於 $[0, 1]$ 這個區間的話，  
為什麼要做落在這個區間呢？因為這樣才能對應這樣的關係：

* $h_{\theta}(x) = 1 = True$
* $h_{\theta}(x) = 0 = False$

這也是叫做邏輯回歸的原因了，也就是說我們要修該這個 $h_{\theta}(x)$ 函數。

# 預測函數
修改函數其實有很多種方法，比方說：

* $ f(x) = \frac{1}{1 + e ^{-x}}$
* $ f(x) = \frac{1 + tanh(x)}{2}$

其中第一個 $ f(x) = \frac{1}{1 + e ^{-x}}$  
叫做 Sigmoid Function、或叫 Logistic Function（邏輯函數）

這邊就以這個函數為準。  
然後我們令 $h_{\theta}(x) ＝\frac{1}{1 + e ^{-(\theta_{0} + \theta_{1}x)}}$  
也就是把函數套在原函數上面。

可能會造成困惑的一點是，我們其實不知道 $\theta_{0} + \theta_{1}x$ 確切的值域，  
用淺白一點的例子來說：如果我在線性回歸中預測的是房價，那麼這個函數的值應該會很大。

但是這樣的猜測是不正確的，因為我們並沒有確定 $\theta$ 的值，  
所以在A.I.學習的過程中，這個 $\theta$ 的值就會讓 $h_{\theta}(x)$ 貼近真實的情況。

# 成本函數
接下來就是定義成本代價了。

因為 $h_{\theta}(x)$ 這次只會在 $[0, 1]$ 中，  
所以說，我們的成本函數也是差不多要這樣定義：  

{% raw %}
$Cost(\theta) = \left\{\begin{array}{l} -ln(h_{\theta}(x)) && \text{if }y = 1 \\ -ln(1-h_{\theta}(x)) && \text{if }y = 0 \end{array}\right .$
{% endraw %}

* 如果 $h_{\theta}(x) = 0$ 且 $y = 0$ 則 $Cost(\theta) = 0$（預測正確，成本為零）
* 如果 $h_{\theta}(x) = 0$ 且 $y = 1$ 則 $Cost(\theta) = \infty$（預測錯誤，成本無限大）
* 如果 $h_{\theta}(x) = 1$ 且 $y = 0$ 則 $Cost(\theta) = \infty$（預測錯誤，成本無限大）
* 如果 $h_{\theta}(x) = 1$ 且 $y = 1$ 則 $Cost(\theta) = 0$（預測正確，成本為零）

而 $log(x)$ 有這這樣的性質：

* 任何數的零次方等於一，也就是 $ln(1) = 0$
* 有條貼近 $y$ 軸的漸近線，也就是 $\displaystyle{\lim_{x \to 0} ln(x) = -\infty}$

也就是說，只要取 $-ln(x)$ 就能找到 $0$ 跟 $\infty$ 兩個重要的值，剩下的就只是調整。  
從這裡也可以發現一件事，就是其他的對數函數也差不多（其實是可以用的意思）

接下來整理成一條公式：

$Cost(\theta) = \left[-yln(h_{\theta}(x))\right] + \left[-(1-y)ln(1-h_{\theta}(x))\right]$

因為假設有 $m$ 筆資料的話：

$Cost(\theta) = \frac{1}{m} \sum\limits_{i=1}^m \left[ -y_{i}ln(h_{\theta}(x_{i})) \right] + \left[ -(1-y_{i})ln(1-h_{\theta}(x_{i})) \right]$ 

## 成本的梯度
因為梯度下降要用到，接下來是微分成本函數：

$Cost(\theta) = -\frac{1}{m} \sum\limits_{i=1}^m \left[ y_{i}ln(h_{\theta}(x_{i})) \right] + \left[ (1-y_{i})ln(1-h_{\theta}(x_{i})) \right]$ 

在微分之前，對兩個 $ln(x)$ 函數做變化：

$ln(h_{\theta}(x_{i})) = ln(\frac{1}{1 + e^{-\theta^{T}X}}) = ln(1) - ln(1 + e^{-\theta^{T}X}) = - ln(1 + e^{-\theta^{T}X})$

$ln(1-h_{\theta}(x_{i})) = ln(1-\frac{1}{1 + e^{-\theta^{T}X}}) = ln(\frac{1 + e^{-\theta^{T}X}}{1 + e^{-\theta^{T}X}}-\frac{1}{1 + e^{-\theta^{T}X}})$

$= ln(\frac{e^{-\theta^{T}X}}{1 + e^{-\theta^{T}X}}) = ln(e^{-\theta^{T}X}) - ln(1 + e^{-\theta^{T}X}) = -\theta^{T}X - ln(1 + e^{-\theta^{T}X})$

然後代換，化簡。

$Cost(\theta) = -\frac{1}{m} \sum\limits_{i=1}^m \left[ y_{i}(- ln(1 + e^{-\theta^{T}X})) \right] + \left[ (1-y_{i})(-\theta^{T}X - ln(1 + e^{-\theta^{T}X})) \right] $

$= -\frac{1}{m} \sum\limits_{i=1}^m \left[ -y_{i}ln(1 + e^{-\theta^{T}X}) + (1-y_{i})(-\theta^{T}X - ln(1 + e^{-\theta^{T}X})) \right]$

$= -\frac{1}{m} \sum\limits_{i=1}^m \left[ -y_{i}ln(1 + e^{-\theta^{T}X}) + (-\theta^{T}X - ln(1 + e^{-\theta^{T}X})+y_{i}\theta^{T}X + y_{i}ln(1 + e^{-\theta^{T}X}) \right]$ 

$= -\frac{1}{m} \sum\limits_{i=1}^m \left[ -\theta^{T}X - ln(1 + e^{-\theta^{T}X})+y_{i}\theta^{T}X \right]$ 

$= -\frac{1}{m} \sum\limits_{i=1}^m \left[ -(ln(e^{\theta^{T}X}) + ln(1 + e^{-\theta^{T}X}))+y_{i}\theta^{T}X \right]$ 

$= -\frac{1}{m} \sum\limits_{i=1}^m \left[ -ln(e^{\theta^{T}X}(1 + e^{-\theta^{T}X}))+y_{i}\theta^{T}X \right]$ 

$= -\frac{1}{m} \sum\limits_{i=1}^m \left[ -ln(e^{\theta^{T}X} + 1)+y_{i}\theta^{T}X \right]$ 

$= -\frac{1}{m} \sum\limits_{i=1}^m \left[ y_{i}\theta^{T}X - ln(e^{\theta^{T}X} + 1) \right]$ 

接著在處理微分。

$\frac{\partial}{\partial\theta_{j}}Cost(\theta) = -\frac{1}{m} \sum\limits_{i=1}^m \left[ \frac{\partial}{\partial\theta_{j}}y_{i}\theta^{T}X - \frac{\partial}{\partial\theta_{j}}ln(e^{\theta^{T}X} + 1) \right]$ 

第一項的部份：

$\frac{\partial}{\partial\theta_{j}}y_{i}\theta^{T}X = y_{i}x_{j}$

第二項的部份：

$\frac{\partial}{\partial\theta_{j}}ln(e^{\theta^{T}X} + 1) = \frac{\partial}{\partial(e^{\theta^{T}X} + 1)}ln(e^{\theta^{T}X} + 1)\frac{\partial}{\partial\theta_{j}}(e^{\theta^{T}X} + 1)$

$= \frac{1}{e^{\theta^{T}X} + 1}(x_{j}e^{\theta^{T}X}) = \frac{x_{j}e^{\theta^{T}X}}{e^{\theta^{T}X} + 1} = \frac{x_{j}}{(e^{-\theta^{T}X})(e^{\theta^{T}X} + 1)}$

$= \frac{x_{j}}{1 + e^{-\theta^{T}X}} = x_{j}h_{\theta}(x_{i})$

所以：

$\frac{\partial}{\partial\theta_{j}}Cost(\theta) = -\frac{1}{m} \sum\limits_{i=1}^m \left[ \frac{\partial}{\partial\theta_{j}}y_{i}\theta^{T}X - \frac{\partial}{\partial\theta_{j}}ln(e^{\theta^{T}X} + 1) \right]$

$= -\frac{1}{m} \sum\limits_{i=1}^m \left[ y_{i}x_{j} - x_{j}h_{\theta}(x_{i}) \right] = -\frac{1}{m} \sum\limits_{i=1}^m \left[ y_{i} - h_{\theta}(x_{i}) \right] x_{j}$ 

$= \frac{1}{m} \sum\limits_{i=1}^m \left[ h_{\theta}(x_{i}) - y_{i} \right] x_{j}$ 

實際的使用上我們會：

$\theta_{j} := \theta_{j} - \alpha\frac{1}{m}\sum\limits_{i=1}^m \left[ h_{\theta}(x_{i}) - y_{i} \right] x_{j}$ 

其中 $\alpha$ 學習率，太高的學習率跟線性回歸一樣會震盪，  
換言之，容易導致結果發散，無法收斂至最佳解。

{% note warning %}
學習率 $\alpha$ 太高會造成發散，導致無法收斂到最佳解。
{% endnote %}

# 感知器
![圖 1、感知器](https://i.imgur.com/TGmNZoX.png)

{% note info %}
用於人工神經網路時，單個感知器（perceptron）又稱為神經元（neuron）。
{% endnote %}

圖 1 應該算是蠻常見的吧？如果常在接觸這個領域的話。  
這篇文章把這個放在這裡，是為了跟邏輯回歸做比較。

圖中顯示的 $\sum$ 是指 $X$ 乘上 $\theta$ 權重取和；而 $\phi(x)$ 是指某種函數，可能是 sigmoid 或是其他函數。

有沒有跟邏輯回歸很類似或者說接近呢？

## 線性不可分問題
下面這個段落引用自 Wikipedia 的文章，讓我們回顧一下歷史。

{% blockquote Wikipedia https://zh.wikipedia.org/wiki/%E6%84%9F%E7%9F%A5%E5%99%A8 %}
雖然最初被認為有著良好的發展潛能，但感知機最終被證明不能處理諸多的模式識別問題。1969年，Marvin Minsky和Seymour Papert在《Perceptrons》書中，仔細分析了以感知機為代表的單層神經網絡系統的功能及局限，證明感知機不能解決簡單的異或（XOR）等線性不可分問題，但Rosenblatt和Minsky及Papert等人在當時已經了解到多層神經網絡能夠解決線性不可分的問題。

由於Rosenblatt等人沒能夠及時推廣感知機學習算法到多層神經網絡上，又由於《Perceptrons》在研究領域中的巨大影響，及人們對書中論點的誤解，造成了人工神經領域發展的長年停滯及低潮...  
{% endblockquote %}

# 演示
這個演示是邏輯回歸（單個神經元）學習邏輯運算的規則，  
可以發現除了 XOR 外，其他邏輯都可以使紅、藍兩色分明。

{% jsfiddle ht98xhej result,js,html,css dark 100% 550px %}
