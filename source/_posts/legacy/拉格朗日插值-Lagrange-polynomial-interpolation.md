---
title: 拉格朗日插值 Lagrange polynomial interpolation
permalink: lagrange-polynomial-interpolation/
categories: legacy-algorithm
date: 2019-10-07
mathjax: true
---
第一次認識拉格朗日插值，源自於名叫 Paint.NET 的繪圖軟體，
這個軟體陪我走過 RPG Maker VX 的許多歲月。

<!-- more -->

當初在尋找適合製作 Pixel art 的軟體時，筆者當時選擇軟體的條件是「既不能太複雜、也不能太陽春」。
因緣際會遇到了 Paint.NET，它的功能足夠，操作也很簡單，所以我很快就喜歡上了。

![圖 1、個人製作的遊戲畫面圖（素材皆為 Paint.NET 繪製）](https://i.imgur.com/WCnpBLH.jpg)

當時除了用它製作基本的 Pixel 素材之外，也會用它做一些遊戲的特殊效果（像光影）之類的，
它其中一個重要的功能是「設定各個顏色的曲線」：

![圖 2、Paint.NET 的曲線功能](https://i.imgur.com/fw0N6s6.jpg)

當時就在想，要怎麼實作這個功能呢？網路上一查，就碰到「拉格朗日（Lagrange）插值」了！

# 插值

插值，意思就是手上有一些資料點：

$\\{(x_0, y_0), (x_1, y_1), (x_2, y_2) ..., (x_{n-1}, y_{n-1})\\}$

找一個函數，去「穿過」這些點：

$f(x_i) = y_i, \quad i = 0, 1, ..., n-1$

而這邊接下來討論的是「多項式插值」，
也就是說，我們預期 $f(x)$ 是一個多項式，我們表示成 $P(x)$

{% note success %}
建議閱讀 {% permalink linear-regression-and-gradient-descent %}
比較「插值（interpolation）」跟「擬合（fitting）」的差別。
{% endnote %}

{% note info %}
插值可以細分為內插（interpolation）與外插（extrapolation）；
一般說插值是指內插，而如果預測的點出現在資料點的最大區間之外，則稱為外插。
{% endnote %}

# 拉格朗日插值

拉格朗日插值多項式：

$$
P(x) = \sum\limits_{i=0}^{n-1} y_i \ell_i(x)
$$

其中 $\ell_i(x)$ 為插值基函數：

$$
\ell_i(x) = \prod\limits_{j=0, j \neq i}^{n-1} \frac{(x - x_i)}{(x_i - x_j)}
$$

因為有特性：
$$
\ell_i(x_j) = \delta_{ij} =
\begin{cases} 
    1, \qquad\text{if } i = j \\\\
    0, \qquad\text{if } i \neq j \\\\
\end{cases}
$$

{% note info %}
式中的 $\delta_{ij}$ 是指 [克羅內克 delta 函數 (Kronecker delta function)](https://en.wikipedia.org/wiki/Kronecker_delta)
{% endnote %}

導致任意點對 $(x_k, y_k)$ 帶入後都有：

$$
y_k \ell_k(x_k) = y_k
$$

所以 $P(x)$ 必可穿過 $0, 1, ..., n-1$ 所有的點對。

# 多項式的點值表示

插值在最初我看到時，是用在影像處理編輯圖片的操作上；
直到有次在《算法導論》中看到插值結果的唯一性證明，發現它也可以用多項式的點值表示，
更進一步可以用在計算快速傅立葉轉換上。

原本我們是有點對：
$\\{(x_0, y_0), (x_1, y_1), (x_2, y_2) ..., (x_{n-1}, y_{n-1})\\}$

透過這些點對找多項式函數，也就是多項式函數的係數，滿足：

$$
P(x_k) = a_0 + a_1x_k + a_2x_k^2 + \dots + a_{n-1}x_k^{n-1} = y_k, \quad k = 0, 1, \dots, n-1
$$

通常我們都將 $x$ 當成函數輸入，即 $Ax = y$；
但現在我們改以 $a$ 當成函數輸入，並將 $k$ 展開，表示成矩陣有：

$$
Xa = y
$$

{% raw %}
$$
\left[ \begin{matrix}
1 & x_{0} & x_{0}^{2} & \dots & x_{0}^{n-1} \\\\
1 & x_{1} & x_{1}^{2} & \dots & x_{1}^{n-1} \\\\
\vdots & \vdots & \vdots & \ddots & \vdots \\\\
1 & x_{n-1} & x_{n-1}^{2} & \dots  & x_{n-1}^{n-1}
\end{matrix} \right]
\left[ \begin{matrix}
a_{0} \\\\
a_{1} \\\\
\vdots \\\\
a_{n-1}
\end{matrix} \right]
=
\left[ \begin{matrix}
y_{0} \\\\
y_{1} \\\\
\vdots \\\\
y_{n-1}
\end{matrix} \right]
$$
{% endraw %}

其中 $X$ 為 [Vandermonde 矩陣](https://zh.wikipedia.org/wiki/%E8%8C%83%E5%BE%B7%E8%92%99%E7%9F%A9%E9%99%A3)
當 $i \neq j$ 時，有 $x_i \neq x_j$，則行列式 $det(X) \neq 0$
$X$ 可逆，代表唯一存在一組 $a$ 是唯一解，滿足 $Xa = y$

既然係數 $a$ 是唯一的，那多項式函數 $P(x)$ 也是唯一的，
代表了，表示多項式時，我有兩種選擇方法：

1. 直接儲存 $a_0, a_1, \dots, a_n$ 共 $n$ 個係數
2. 儲存 $(x_0, y_0), (x_1, y_1), (x_2, y_2) ..., (x_{n-1}, y_{n-1})$ 共 $n$ 組點對

而第二種儲存點對的方式，被稱為多項式的「點值表示」。

{% note info %}
點值表示有一些很有趣的性質，
比方說兩個多項式相乘的複雜度，在係數表示時是 $\Theta(n^2)$，但在點值表示僅需 $\Theta(n)$。
{% endnote %}

至於用點值表示做其他事情，就超出本文的範圍了。

# 演示

這個演示可以上傳一張照片，用插值曲線調整顏色。

{% jsfiddle hyjb39e7 result,js,html,css dark 100% 600px %}
