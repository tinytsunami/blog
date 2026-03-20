---
title: 線性回歸與梯度下降 Linear Regression and Gradient Descent
permalink: linear-regression-and-gradient-descent/
categories: (legacy) algorithm
date: 2017-06-25
mathjax: true
---
這篇是 Coursera 中 Machine Learning 的筆記。
<!-- more -->

{% note info %}
課程在：[Coursera Machine Learning](https://www.coursera.org/learn/machine-learning/home/welcome/)，這是機器學習入門的推薦課程。
{% endnote %}

# 梯度下降
梯度下降是理解演算法的人，應該不會太陌生的東西，  
因為類似的還有爬山算法、模擬退火等等。

有些人會分不清楚爬山算法跟梯度下降的差別，  
根據 Wikipedia 的說明，二維函數上的爬山演算法大致上是：  

* 找一點 $p$ 當起點
* 代入函數 $f(x)$ 並紀錄 $f(p)$ 以及 $p$ 的值
* 調整 $p$ 成為 $p+k$
* 檢查 $f(p+k) > f(p)$ （大、小於，根據找最大、小值而定）
* 如果為真，則 $p := p+k$
* 重複 2 ～ 5 步驟，直到 $f(p)$ 到達滿意為止

而梯度下降法，是這樣操作的：  

* 找一點 $p$ 當起點
* 微分 $f(x)$ 成為 $\frac{d}{dx}f(x)$
* 使 $p := p - \frac{d}{dx}f(p)$（正負號，根據尋找最大、小值而定）
* 重複 2～3 步驟，直到 $f(p)$ 到達滿意為止

換而言之，兩者最大的差別是：  
對於爬山算法是代函數找新值，如果新值更好則替換，  
而梯度下降則利用了微分的性質，直接往正確的方向前進。

{% note info %}
梯度下降比爬山算法更有效嗎？為什麼？
函數難以微分（或不可微分、越微分越複雜）時，梯度下降、爬山算法哪個更有效？
當函數屬於多變數函數時，梯度下降、爬山算法哪個更有效？
{% endnote %}

{% note success %}
這是 ANN 的系列文章
下一篇是 {% post_link legacy/algorithm/邏輯回歸與感知器-Logistic-Regression-and-Perceptron %}
{% endnote %}

{% note success %}
筆者於大學專題時，曾向組員介紹過相關內容，如有需要可以參考 [Multiple Linear Regression 簡報](https://docs.google.com/presentation/d/1WMTRxJnfNmJozAB6M-CQkB4zPzCLj4aw0ip1D8sStbs/edit?usp=sharing)
{% endnote %}

# 回歸問題
在 Machine Learning 中，算是最容易的東西。同時也是跟統計學重複的內容。  

這邊簡單描述問題，大意是這樣：  
{% raw %}
給一組 $S = \{(x^{(1)}_{1}, x^{(1)}_{2}, ..., x^{(1)}_{n}, y^{(1)}), (x^{(2)}_{1}, x^{(2)}_{2}, ..., x^{(2)}_{n}, y^{(2)}), ..., (x^{(m)}_{1}, x^{(m)}_{2}, ..., x^{(m)}_{n}, y^{(m)})\}$ 
{% endraw %}

你要找到一個函數 $h_{\theta}(x_{1}, x_{2}, ..., x_{n})$ 使的每一筆資料代入後： $Cost(h_{\theta}(x_{1}, x_{2}, ..., x_{n}), y)$ 為最小。  
在二維平面上的情況（單個 $x$ 對應一個 $y$ 的狀況）

大概就是：找一條線盡可能的擬合資料的趨勢，但是也不可以過度的擬合，  
這裡的 $Cost(...)$ 是指成本函數，稍後會介紹。

{% note info %}
試想想插值（interpolation）與過擬合回歸（overfitting regression）間的差異。
{% endnote %}

## 特徵與標籤
我們剛剛提到了集合，我們現在單獨把裡面的元素搬出來看：

{% raw %}
$(x^{(1)}_{1}, x^{(1)}_{2}, ..., x^{(1)}_{n}, y^{(1)})$
{% endraw %}

這樣的資料組成，我們理解成兩個部份：特徵以及標籤。  
其中 $x$ 的部份稱作特徵，而 $y$ 的部份叫做標籤，比方說我們的問題是：

以資工系學生某些科目的期中考分數（程式設計、線性代數），預測所有科目的平均。  
那我們的元素會變成類似這樣：  

* $x_{1} = 程式設計分數$
* $x_{2} = 線性代數分數$
* $y = 科目平均$

元素為 $(x_{1}, x_{2}, y)$ 這樣，當然 Machine Learning 領域跟統計學一樣，  
資料量得到達一定的大小，預測才會較為準確。  
為了方便之後的解釋，我們就繼續採用這個預測科目平均的例子，  
不過我們把兩個科目換成一個科目（方便我們之後的演示，畢竟雙變數要畫三維圖形）  
元素變成：$(程式設計分數, 學期平均)$ 這樣。

# 預測函數
我們在討論接下來的操作以前，得先處理上面提到的 $h_{\theta}(x)$ 函數才行，  
基本上 $h_{\theta}(x)$ 是由設計模型的人提出的，跟資料的分佈有相應的關係。  
由於我們是預測科目的平均，且特徵只取一個，

那麼對應的 $h_{\theta}(x)$ 函數應該只是一個簡單的函數：

$h_{\theta}(x) = \theta_{0} + \theta_{1}x$

其中的 $\theta$ 在 Machine Learning 中叫做權重，同時也是我們搜尋的目標。  
有時為了方便計算會變成向量的形式：

$h_{\theta}(x) = \theta^{T}x$

在這樣的情況下，應該多增加 $x_{0} = 1$ 使的大小相等。  
為了理解，還是在說明一次，預測函數跟系統的設計有關，

當然也可以設計成更為複雜的函數。

# 成本函數
成本函數（Cost Function，又名做代價函數）  
成本函數的意義，是用於評估回歸線在擬合資料集的時候，

到底擬合的好不好（換言之，也就是 $h_{\theta}(x)$ 函數好不好）  
以剛才的預測學期平均的例子來說，

一個很簡單的概念是，代入函數值跟理想值的差為成本：

$Cost(\theta) = h_{\theta}(x) - y$

不過應該很容易發現問題點，如果出來的值是負的，  
難道我的成本變成獲利？函數非常好嗎？  
並不是，事實上這兩者的在數線上的距離差越大越糟糕，  
於是我們習慣上加上平方來消除負號：

$Cost(\theta) = (h_{\theta}(x) - y)^{2}$

{% note info %}
為什麼這裡不使用絕對值函數？
請參閱：[在进行线性回归时，为什么最小二乘法是最优方法？](https://www.zhihu.com/question/24095027/)
{% endnote %}

不過，我們的特徵有很多筆，  
假設有 $m$ 筆資料好了，於是乎成本函數又有了變化：

$Cost(\theta) = \frac{1}{2m}\sum\limits_{i=1}^{m} (h_{\theta}(x) - y)^{2}$

乘 $\frac{1}{m}$ 的原因是我們想算誤差的平均數，

而乘 $\frac{1}{2}$ 是因為等等微分可以消掉常數倍。  
我們的目標已經很明確了找到一組 $\theta$ 使得 $Cost(\theta)$ 最小化，  
你可能注意到了，成本函數 $Cost(\theta)$ 的變數是 $\theta$ 而非 $x$  
第一次看到可能不習慣，不過如果你把 $h_{\theta}(x)$ 整個內容寫出來應該就不難理解。

## 成本的梯度
由於我們想要找成本函數的最小值（全域最大值）的關係，  
理所當然有一些方法能夠處理這個問題，比方說直接解方程式之類的，  
而這個叫做正規方程，也是類似公式解的東西，不過我們沒有打算在這裡說明。

我們採用的是梯度下降找區域極值的方法。

微分成本函數（把 $\theta$ 當成向量同時微分）：  

$\frac{d}{d\theta}Cost(\theta) = \frac{d}{d\theta} \frac{1}{2m}\sum\limits_{i=1}^{m} (h_{\theta}(x^{(i)}) - y^{(i)})^{2}$

套用鏈鎖法則：  

$\frac{d}{d\theta}Cost(\theta) = \frac{1}{2m}\sum\limits_{i=1}^{m} (\frac{d}{d(h_{\theta}(x^{(i)}) - y^{(i)})} (h_{\theta}(x^{(i)}) - y^{(i)})^{2} \frac{d}{d\theta} h_{\theta}(x^{(i)}) - y^{(i)})$

$\frac{d}{d\theta}Cost(\theta) = \frac{1}{m}\sum\limits_{i=1}^{m} ((h_{\theta}(x^{(i)}) - y^{(i)})x^{(i)})$

因為我們將 $\theta$ 當成向量，梯度下降法則會：  

$\theta_{j} := \theta_{j} - \alpha\frac{1}{m}\sum\limits_{i=1}^{m} ((h_{\theta}(x^{(i)}) - y)x^{(i)}_{j})$

{% raw %}
如果你有注意到 $x^{(i)}_{j}$ 的話，我們剛才只有出現 $x_{1} = x$ 對應著 $\theta_{1}$
{% endraw %}

那這邊的 $\theta_{0}$ 只要令 $x_{0} = 1$ 使得 $h_{\theta}(x) = \theta_{0}x_{0} + \theta_{1}x_{1}$ 成立就好。  
不必擔心這邊 $x$ 上下標一堆的問題，上標 $(i)$ 代表每個資料要輪流代入，下標 $j$ 可以看成是 $\theta_{j}$ 的係數。其中 $\alpha$ 被稱為學習率，是自行設定的常數。

{% note warning %}
學習率 $\alpha$ 太高會造成發散，導致無法收斂到最佳解。
{% endnote %}

{% note warning %}
更新 $\theta$ 時，應同時改變 $\theta_{0}$ 及 $\theta_{1}$ 才是正確的。
{% endnote %}

# 演示
這是一個簡單線性回歸（Simple Linear Regression）的演示。

{% note warning %}
本演示為了使回歸更快，把在 $\theta_{0}$ 處的梯度加大了。
{% endnote %}

{% jsfiddle 2nga2mnm result,js,html,css dark 100% 550px %}
