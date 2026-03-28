---
title: 全連接神經網路 Fully-Connected Neural Network
permalink: fully-connected-neural-network/
categories: legacy-algorithm
date: 2019-07-07
mathjax: true
---
上一篇介紹的是邏輯回歸與感知器，這一篇將會討論「全連接神經網路」。

睽違 2 年的主要原因是覺得網路上關於反向傳播很多人寫了，
另外微積分其實我沒有掌握得很完全，所以很猶豫哪時要完成這篇文章。
<!-- more -->

# 前言
回顧邏輯回歸與感知器的文章，圖 1 是單科感知器的模型，現在我們將拓展它，
不難理解，單個感知器（perceptron）可以視作是簡化的邏輯回歸，也可以視作基本的神經元（neuron）。

![圖 1、感知器](https://i.imgur.com/TGmNZoX.png)


在基於這個想法，我們堆砌感知器成神經網路，便可以解決上一篇提及的「線性不可分問題」。

{% note success %}
這是 ANN 的系列文章
上一篇是 {% permalink logistic-regression-and-perceptron %}
{% endnote %}

{% note success %}
其他資源請參考：[解說影片](https://www.youtube.com/watch?v=PgcKcu-RMcc)
{% endnote %}

# 神經網路簡介
全連接神經網路（Fully-connect Neural Network, FNN）是一種多個神經元的「連接模式」，
事實上，許多的神經網路模型都只是各種神經元的連接模式，而全連接神經網路是其中最簡單的一種，
參考圖 2 所示，全連接神經網路的特色是，上一層的神經元與下一層所有的神經元相接。

![圖 2、全連接神經網路示意圖](https://i.imgur.com/QpM15R6.png)

我們將帶有數值的輸入，當成一個獨立的神經元，構成圖 2 藍色處，神經網路的輸入層（input layer）
然後圖 2 右邊深綠框為會輸出結果的輸出層（output layer），中間紫色框是神經網路的主體，稱為隱藏層（hidden layer）

{% note info %}
計算神經網路層數時，通常不計算輸入層（input layer），請參考 [Counting the number of layers in a neural network](https://datascience.stackexchange.com/questions/14027/counting-the-number-of-layers-in-a-neural-network) 
{% endnote %}

在邏輯回歸時，我們訓練一組 $\theta$ 來完成任務，在神經網路的情況也是一樣，
我們將訓練 $\Theta$ 權重，由於維度增加，我們用大寫取代小寫，而權重出現在每一條神經元的連接中。
（圖 2 中帶箭頭的線是沒有權重的，那僅是表示輸入、出的箭頭。）

{% note warning %}
注意第一段「各種神經元」，說明了神經網路的神經元並非只有一種。
{% endnote %}

# 前向傳播演算法
還記得當初學習「函數」的時候，是怎麼想像函數的嗎？
函數是一個機器，你可以給它一個值，它就會給你另一個值。

現在，全連接神經網路就是那部機器！我們的函數名為 $h_{\Theta}(X)$
計算這個函數值的過程，就稱為「前向傳播演算法（forward propagation algorithm）」。

試想我們輸入為列向量 $\boldsymbol{x}^{T} = [x_{1}, x_{2}, ..., x_{n}]$ 是一筆具有 $n$ 個特徵的資料，
若為第 $j$ 筆，我們表示為 $(\boldsymbol{x}^{(j)})^{T} = [x_{1}^{(j)}, x_{2}^{(j)}, ..., x_{n}^{(j)}]$
當我們有 $m$ 筆資料構成一個批次（batch）時，輸入矩陣為：

<raw>
$$
X = 
\left[ \begin{matrix}
(\boldsymbol{x}^{(1)})^{T} \\\\
(\boldsymbol{x}^{(2)})^{T} \\\\
\vdots               \\\\
(\boldsymbol{x}^{(m)})^{T}
\end{matrix} \right]
=
\left[ \begin{matrix}
x_{1}^{(1)} & x_{2}^{(1)} & \dots & x_{n}^{(1)} \\\\
x_{1}^{(2)} & x_{2}^{(2)} & \dots & x_{n}^{(2)} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
x_{1}^{(m)} & x_{2}^{(m)} & \dots  & x_{n}^{(m)}
\end{matrix} \right]
$$
</raw>

{% note info %}
輸入資料的行、列可能相反，只要公式做對應的改變即可。
{% endnote %}

{% note info %}
訓練神經網路時，通常會多筆資料一起訓練，而這個多筆資料則稱為一個批次（batch）
{% endnote %}

而假設第 $k$ 層為 $a \times b$ 的神經網路層，權重矩陣為：

$$
\Theta^{(k)} =
\left[ \begin{matrix}
\Theta_{1, 1}^{(k)} & \Theta_{1, 2}^{(k)} & \dots  & \Theta_{1, b}^{(k)} \\\\
\Theta_{2, 1}^{(k)} & \Theta_{2, 2}^{(k)} & \dots  & \Theta_{2, b}^{(k)} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
\Theta_{a, 1}^{(k)} & \Theta_{a, 2}^{(k)} & \dots  & \Theta_{a, b}^{(k)}
\end{matrix} \right]
$$

上一篇文章邏輯回歸中的 $f(x)$ 函數，在神經網路被稱為激勵函數（activation function）
所以當 $X$ 往前計算一層時，只要將兩個矩陣相乘，然後套用激勵函數即可。

{% note info %}
激勵函數通常只在輸出層使用，有許多不同的函數可供選擇，請參考 [Wikipedia: activation function](https://en.wikipedia.org/wiki/Activation_function)；
從這裡也可以知道，激勵函數的一個作用是限制輸出值域。
{% endnote %}

彙整一下，舉例來說，第 1 層有：

<raw>
$$
X\Theta^{(1)} = 
\left[ \begin{matrix}
(\boldsymbol{x}^{(1)})^{T} \\\\
(\boldsymbol{x}^{(2)})^{T} \\\\
\vdots \\\\
(\boldsymbol{x}^{(m)})^{T}
\end{matrix} \right] 
\left[ \begin{matrix}
\Theta_{1, 1}^{(1)} & \Theta_{1, 2}^{(1)} & \dots  & \Theta_{1, b}^{(1)} \\\\
\Theta_{2, 1}^{(1)} & \Theta_{2, 2}^{(1)} & \dots  & \Theta_{2, b}^{(1)} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
\Theta_{a, 1}^{(1)} & \Theta_{a, 2}^{(1)} & \dots  & \Theta_{a, b}^{(1)}
\end{matrix} \right]
=
\left[ \begin{matrix}
x_{1}^{(1)} & x_{2}^{(1)} & \dots & x_{n}^{(1)} \\\\
x_{1}^{(2)} & x_{2}^{(2)} & \dots & x_{n}^{(2)} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
x_{1}^{(m)} & x_{2}^{(m)} & \dots  & x_{n}^{(m)}
\end{matrix} \right] 
\left[ \begin{matrix}
\Theta_{1, 1}^{(1)} & \Theta_{1, 2}^{(1)} & \dots & \Theta_{1, b}^{(1)} \\\\
\Theta_{2, 1}^{(1)} & \Theta_{2, 2}^{(1)} & \dots & \Theta_{2, b}^{(1)} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
\Theta_{a, 1}^{(1)} & \Theta_{a, 2}^{(1)} & \dots & \Theta_{a, b}^{(1)}
\end{matrix} \right]
$$
</raw>

<raw>
$$
= 
\left[ \begin{matrix}
\sum\limits_{i = 1}^{a} x_{i}^{(1)}\Theta_{i, 1}^{(k)} & \sum\limits_{i = 1}^{a} x_{i}^{(1)}\Theta_{i, 2}^{(k)} & \dots & \sum\limits_{i = 1}^{a} x_{i}^{(1)}\Theta_{i, b}^{(k)} \\\\
\sum\limits_{i = 1}^{a} x_{i}^{(2)}\Theta_{i, 1}^{(k)} & \sum\limits_{i = 1}^{a} x_{i}^{(2)}\Theta_{i, 2}^{(k)} & \dots & \sum\limits_{i = 1}^{a} x_{i}^{(2)}\Theta_{i, b}^{(k)} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
\sum\limits_{i = 1}^{a} x_{i}^{(m)}\Theta_{i, 1}^{(k)} & \sum\limits_{i = 1}^{a} x_{i}^{(m)}\Theta_{i, 2}^{(k)} & \dots & \sum\limits_{i = 1}^{a} x_{i}^{(m)}\Theta_{i, b}^{(k)} \\\\
\end{matrix} \right]
$$
</raw>

這是全部寫出來的情況，雖然看起來有點複雜，
但我們仔細觀察注標，可以發現這個矩陣大小關係為：

* $X$ 大小為 $m \times n$
* $\Theta^{(1)}$ 大小為 $a \times b$
* $X\Theta^{(1)}$ 大小為 $m \times b$

{% note info %}
輸入層的神經元數量，等於輸入資料的特徵數量，即有 $n = a$ 的關係。
{% endnote %}

而第 2 層為 $b \times c$ 的神經網路，以 $X\Theta^{(1)}$ 作為輸入，
以此類推，假設我們有 $L$ 層，而激活函數為 $\phi(z)$，則前向傳播為：

$$
h_{\Theta}(X) = \phi(X\Theta^{(1)}\Theta^{(2)} \dots \Theta^{(L)})
$$

參考圖 2 的情況，輸入我們可以寫成：

$$
h_{\Theta}(X) = \phi(X\Theta^{(1)}\Theta^{(2)}) = 
\phi \left(
\begin{bmatrix}
x_{1, 1} & x_{1, 2} \\\\
x_{2, 1} & x_{2, 2}
\end{bmatrix}
\left[ \begin{matrix}
\Theta_{1, 1}^{(1)} & \Theta_{1, 2}^{(1)} & \Theta_{1, 3}^{(1)} & \Theta_{1, 4}^{(1)} \\\\
\Theta_{2, 1}^{(1)} & \Theta_{2, 2}^{(1)} & \Theta_{2, 3}^{(1)} & \Theta_{2, 4}^{(1)}
\end{matrix} \right]
\left[ \begin{matrix}
\Theta_{1, 1}^{(2)} & \Theta_{1, 2}^{(2)} & \Theta_{1, 3}^{(2)} \\\\
\Theta_{2, 1}^{(2)} & \Theta_{2, 2}^{(2)} & \Theta_{2, 3}^{(2)} \\\\
\Theta_{3, 1}^{(2)} & \Theta_{3, 2}^{(2)} & \Theta_{3, 3}^{(2)} \\\\
\Theta_{4, 1}^{(2)} & \Theta_{4, 2}^{(2)} & \Theta_{4, 3}^{(2)} 
\end{matrix} \right]
\right)
$$

# 反向傳播演算法
對於神經網路來說，反向傳播算法（back propagation algorithm）才是訓練的重點，
具體來說，我們的訓練的過程為：

1. 準備輸入的值 $X$ 與訓練的標籤 $Y$
2. 隨機初始化各權重 $\Theta$，通常在 $(0, 1)$ 區間中
3. 使用前向傳播演算法求得 $h_{\Theta}(X)$
4. 使用反向傳播演算法更新 $\Theta$
5. 重複 4~5 步，直到神經網路訓練結束
6. 使用 $h_{\Theta}(X)$ 預測值（這相當於做一次第 4 步的前向傳播算法）

如果我們使用 [均方誤差（Mean Squared Error, MSE）](https://en.wikipedia.org/wiki/Mean_squared_error) 成本函數：

$$
Cost(\theta) = \frac{1}{2m} \sum\limits_{i=1}^m (y^{(i)} - \hat{y}^{(i)})^{2}
$$

{% note info %}
習慣上，我們會多乘一個 $\frac{1}{2}$ 來消去微分後的項
{% endnote %}

我們重寫一次，當輸入批次共 $m$ 筆資料、每筆資料都有 $n$ 個特徵：

<raw>
$$
X = 
\left[ \begin{matrix}
(\boldsymbol{x}^{(1)})^{T} \\\\
(\boldsymbol{x}^{(2)})^{T} \\\\
\vdots               \\\\
(\boldsymbol{x}^{(m)})^{T}
\end{matrix} \right]
=
\left[ \begin{matrix}
x_{1}^{(1)} & x_{2}^{(1)} & \dots & x_{n}^{(1)} \\\\
x_{1}^{(2)} & x_{2}^{(2)} & \dots & x_{n}^{(2)} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
x_{1}^{(m)} & x_{2}^{(m)} & \dots  & x_{n}^{(m)}
\end{matrix} \right]
$$
</raw>

對應的標籤為 $m$ 筆資料、每筆資料都有 $p$ 個特徵（最後一層神經元數量也會為 $p$）：

<raw>
$$
Y = 
\left[ \begin{matrix}
(\boldsymbol{y}^{(1)})^{T} \\\\
(\boldsymbol{y}^{(2)})^{T} \\\\
\vdots               \\\\
(\boldsymbol{y}^{(m)})^{T}
\end{matrix} \right]
=
\left[ \begin{matrix}
y_{1}^{(1)} & y_{2}^{(1)} & \dots & y_{p}^{(1)} \\\\
y_{1}^{(2)} & y_{2}^{(2)} & \dots & y_{p}^{(2)} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
y_{1}^{(m)} & y_{2}^{(m)} & \dots  & y_{p}^{(m)}
\end{matrix} \right]
$$
</raw>

則我們可以將成本函數寫完整：

<raw>
$$
Cost(\Theta)
= \frac{1}{2m} \sum\limits_{i=1}^m (Y - \hat{Y})^{2}
= \frac{1}{2m} \sum\limits_{i=1}^m (Y - h_{\Theta}(X))^{2}
$$
</raw>

<raw>
$$
= \frac{1}{2m} \sum\limits_{i=1}^m
(\left[y\_{j}^{(i)}\right] - \left[ h_{\Theta}(X)^{(i)}_{j} \right]  )^{2}
$$
</raw>

我們關注的是，當權重 $\Theta$ 改變時，成本 $Cost(\Theta)$ 的變化，
假設我們激活函數為 Sigmoid 函數 $\phi(z) = \frac{1}{1 + e ^{-z}}$

接下來，我們要處理每一層的誤差。

## Sigmoid 函數微分
在開始之前，我們先處理激活函數的微分，這個部分在後面會使用到。

$$
\phi(z) = \frac{1}{1 + e ^{-z}}
$$

對 $z$ 偏微分有：

$$
\frac{\partial \phi(z)}{\partial z}
 = \frac{\partial}{\partial z} \left( \frac{1}{1 + e ^{-z}} \right)
 = \frac{\partial (1 + e ^{-z})^{-1}}{\partial (1 + e ^{-z})} \frac{\partial (1 + e ^{-z})}{\partial z}
 = \left[ -(1 + e ^{-z})^{-2} \right] \left[ -e^{-z} \right]
$$
$$
 = \left[ (1 + e ^{-z})^{-1} \right] \left[ (1 + e ^{-z})^{-1}e^{-z} \right]
 = \phi(z) \left( \frac{e^{-z}}{1 + e ^{-z}} + \frac{1}{1 + e ^{-z}} - \frac{1}{1 + e ^{-z}} \right)
$$
$$
 = \phi(z) \left( \frac{1 + e^{-z}}{1 + e ^{-z}} - \phi(z) \right)
 = \phi(z) \left( 1 - \phi(z) \right)
$$

## 輸出層的誤差

在接下去之前，我們把符號定義清楚，先前的討論中，我們得到結論是：
$$
h_{\Theta}(X) = \phi(X\Theta^{(1)}\Theta^{(2)} \dots \Theta^{(L)})
$$

![圖 3、輸出層的誤差](https://i.imgur.com/zOAQra2.png)

如果僅考慮一筆資料的情況，即 $ X = (\boldsymbol{x}^{(1)})^{T}$
參考圖 3 所示，接著定義：
$$
a^{(1)} = X\Theta^{(1)} = (\boldsymbol{x}^{(1)})^{T}\Theta^{(1)} \\\\
a^{(2)} = a^{(1)}\Theta^{(2)} \\\\
\vdots \\\\
a^{(L)} = a^{(L-1)}\Theta^{(L)}
$$

不難發現，第 $l$ 層的第 $k$ 個神經元的輸出為 $a_{k}^{(l)}$ 
另外總輸出為 $h_{\Theta}(X) = \phi(a^{(L)})$
同理，第 $k$ 個神經元的輸出為 $\phi(a_{k}^{(L)})$ 

我們觀察第 $L-1$ 層的第 $i$ 個神經元連接到第 $L$ 層第 $j$ 個神經元的權重為 $\Theta_{ij}^{(L)}$
所以我們對 $Cost(\Theta)$ 的特定神經元做偏微分有：

<raw>
$$
\frac{\partial Cost(\Theta) }{\partial\Theta_{ij}^{(L)}}
 = \frac{1}{2} 
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))^{2} }{\partial \Theta_{ij}^{(L)}}
$$
$$
 = \frac{1}{2} 
 \frac{\partial (y_{j} - \phi(a_{j}^{(L)}))^{2} }{\partial y_{j} - \phi(a_{j}^{(L)})}
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))}{\partial \Theta_{ij}^{(L)}}
$$
$$
= \frac{1}{2} 
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))^{2} }{\partial y_{j} - \phi(a_{j}^{(L)})}
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))}{\partial \phi(a_{j}^{(L)})} 
\frac{\partial \phi(a_{j}^{(L)})}{\partial \Theta_{ij}^{(L)}} 
$$
</raw>

<raw>
$$
= 
\frac{1}{2}
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))^{2}}{\partial (y_{j} - \phi(a_{j}^{(L)}))} 
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))}{\partial \phi(a_{j}^{(L)})} 
\frac{\partial \phi(a_{j}^{(L)})}{\partial a_{j}^{(L)}}
\frac{\partial a_{j}^{(L)}}{\partial \Theta_{ij}^{(L)}} 
$$
</raw>

然後我們逐項討論，第一乘項是：

<raw>
$$
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))^{2}}{\partial (y_{j} - \phi(a_{j}^{(L)}))} = 2(y_{j} - \phi(a_{j}^{(L)}))
$$
</raw>

<raw>
$$
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))}{\partial \phi(a_{j}^{(L)})} = -1
$$
</raw>

使用 Sigmoid 偏微分的結果：

$$
\frac{\partial \phi(a_{j}^{(L)})}{\partial a_{j}^{(L)}} = \phi(a_{j}^{(L)}) \left( 1 - \phi(a_{j}^{(L)}) \right)
$$

然後根據先前連接的定義，即前一層第 $k$ 個（任意的）神經元的輸出，
經過權重 $\Theta_{kj}^{(L)}$ 都可以連到輸出層第 $j$ 個神經元：

$$
\frac{\partial a_{j}^{(L)}}{\partial \Theta_{ij}^{(L)}} = 
\frac{\partial}{\partial \Theta_{ij}^{(L)}} \left( \sum\limits_{k} \phi(a_{k}^{(L-1)})\Theta_{kj}^{(L)} \right) = 
\phi(a_{i}^{(L-1)})
$$

{% note info %}
當 $k = i$ 時，那條權重才會影響，微分後才有項被保留
{% endnote %}

則輸出層的誤差為：

$$
\frac{\partial Cost(\Theta) }{\partial\Theta_{ij}^{(L)}}
= \frac{1}{2} \left[ 2(y_{j} - \phi(a_{j}^{(L)})) (-1) \phi(a_{j}^{(L)}) \left(1 - \phi(a_{j}^{(L)}) \right) \phi(a_{i}^{(L-1)}) \right]
$$
$$
= (y_{j} - \phi(a_{j}^{(L)})) (-1) \phi(a_{j}^{(L)}) \left(1 - \phi(a_{j}^{(L)}) \right) \phi(a_{i}^{(L-1)})
$$
$$
= (\phi(a_{j}^{(L)}) - y_{j}) \phi(a_{j}^{(L)}) \left(1 - \phi(a_{j}^{(L)}) \right) \phi(a_{i}^{(L-1)})
$$

然後我們定義最後一層（即第 $L$ 層）第 $j$ 個神經元的的誤差為：

$$
\delta_{j}^{(L)} = 
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))^{2}}{\partial (y_{j} - \phi(a_{j}^{(L)}))} 
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))}{\partial \phi(a_{j}^{(L)})} 
\frac{\partial \phi(a_{j}^{(L)})}{\partial a_{j}^{(L)}}
$$
$$
 = (\phi(a_{j}^{(L)}) - y_{j}) \phi(a_{j}^{(L)}) \left(1 - \phi(a_{j}^{(L)}) \right)
$$

所以可以表示為：

$$
\frac{\partial Cost(\Theta) }{\partial\Theta_{ij}^{(L)}} = \delta_{j}^{(L)} \phi(a_{i}^{(L-1)})
$$

## 隱藏層的誤差
有了輸出層的經驗，隱藏層便不會太過困難。

![圖 4、隱藏層的誤差](https://i.imgur.com/wPg7VqS.png)

觀察圖 4 的內容，我們接下來要討論倒數第 2 層（即 $L-1$ 層）的誤差，
很顯然地，一樣是對成本函數做偏微分。

不難發現，最後一層所有的誤差都傳遞到了隱藏層中，
可以視作多變數函數的全微分，所以有：

<raw>
$$
\frac{\partial Cost(\Theta) }{\partial\Theta_{st}^{(L-1)}} 
= 
\frac{1}{2} \sum\limits_{j} \left[
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))^{2}}{\partial (y_{j} - \phi(a_{j}^{(L)}))} 
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))}{\partial \phi(a_{j}^{(L)})} 
\frac{\partial \phi(a_{j}^{(L)})}{\partial a_{j}^{(L)}}
\right]
\frac{\partial a_{j}^{(L)}}{\partial\Theta_{st}^{(L-1)}}
$$
</raw>

直至這一步都是幾乎一樣的，接下來拆開最後一項。

<raw>
$$
\frac{\partial Cost(\Theta) }{\partial\Theta_{st}^{(L-1)}} 
= 
\frac{1}{2} \sum\limits_{j} \left[
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))^{2}}{\partial (y_{j} - \phi(a_{j}^{(L)}))} 
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))}{\partial \phi(a_{j}^{(L)})} 
\frac{\partial \phi(a_{j}^{(L)})}{\partial a_{j}^{(L)}}
\right]
\frac{\partial a_{j}^{(L)}}{\partial\Theta_{st}^{(L-1)}}
$$
$$
= 
\frac{1}{2} \sum\limits_{j} \left[
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))^{2}}{\partial (y_{j} - \phi(a_{j}^{(L)}))} 
\frac{\partial (y_{j} - \phi(a_{j}^{(L)}))}{\partial \phi(a_{j}^{(L)})} 
\frac{\partial \phi(a_{j}^{(L)})}{\partial a_{j}^{(L)}}
\right]
\frac{\partial \sum\limits_{k} \left( \phi(a_{k}^{(L-1)}) \Theta_{kj}^{(L)} \right)}{\partial a_{i}^{(L-1)}}
\frac{\partial a_{i}^{(L-1)}}{\partial\Theta_{st}^{(L-1)}}
$$
$$
= 
\frac{1}{2} \sum\limits_{j} \delta_{j}^{(L)}
\frac{\partial \sum\limits_{k} \left( \phi(a_{k}^{(L-1)}) \Theta_{kj}^{(L)} \right)}{\partial a_{i}^{(L-1)}}
\frac{\partial a_{i}^{(L-1)}}{\partial\Theta_{st}^{(L-1)}}
$$
</raw>

逐項討論，這裡用了激活函數的結果，
注意偏微分，當 $k \neq i$ 的項都被視為常數：

<raw>
$$
\frac{\partial \sum\limits_{k} \left( \phi(a_{k}^{(L-1)}) \Theta_{kj}^{(L)} \right)}{\partial a_{i}^{(L-1)}}
= \frac{\partial \phi(a_{i}^{(L-1)}) \Theta_{ij}^{(L)}}{\partial a_{i}^{(L-1)}}
$$
$$
= \frac{\partial \phi(a_{i}^{(L-1)})}{\partial a_{i}^{(L-1)}} \Theta_{ij}^{(L)} + \phi(a_{i}^{(L-1)}) \frac{\partial \Theta_{ij}^{(L)}}{\partial a_{i}^{(L-1)}}
= \Theta_{ij}^{(L)} \phi(a_{i}^{(L-1)}) \left( 1 - \phi(a_{i}^{(L-1)})\right)
$$
</raw>

最後一項，跟輸出層的時候一樣（觀察圖 3 可以得到 $t = i$）
所以只有 $k = s$ 的時候才有值：

<raw>
$$
\frac{\partial a_{i}^{(L-1)}}{\partial\Theta_{st}^{(L-1)}} = 
\frac{\partial}{\partial \Theta_{st}^{(L-1)}} \left( \sum\limits_{k} \phi(a_{k}^{(L-2)})\Theta_{ki}^{(L-1)} \right) = 
\frac{\partial}{\partial \Theta_{st}^{(L-1)}} \left( \sum\limits_{k} \phi(a_{k}^{(L-2)})\Theta_{kt}^{(L-1)} \right) = 
\phi(a_{s}^{(L-2)})
$$
</raw>

同樣地，我們做個總整理：

<raw>
$$
\frac{\partial Cost(\Theta) }{\partial\Theta_{st}^{(L-1)}} 
= 
\frac{1}{2} \sum\limits_{j} \delta_{j}^{(L)}
\frac{\partial \sum\limits_{k} \left( \phi(a_{k}^{(L-1)}) \Theta_{kj}^{(L)} \right)}{\partial a_{i}^{(L-1)}}
\frac{\partial a_{i}^{(L-1)}}{\partial\Theta_{st}^{(L-1)}}
$$
$$
= 
\frac{1}{2} \sum\limits_{j} \delta_{j}^{(L)}
\Theta_{ij}^{(L)} \phi(a_{i}^{(L-1)}) \left( 1 - \phi(a_{i}^{(L-1)}) \right) \phi(a_{s}^{(L-2)})
$$
</raw>

重新定義第 $L-1$ 層第 $t = i$ 個神經元的的誤差為：

$$
\delta_{t}^{(L-1)} = \left[ 
\left( \sum\limits_{j} \delta_{j}^{(L)} \Theta_{ij}^{(L)} \right)
\phi(a_{i}^{(L-1)}) \left( 1 - \phi(a_{i}^{(L-1)}) \right)
\right]
$$

所以可以表示為：

$$
\frac{\partial Cost(\Theta) }{\partial\Theta_{st}^{(L-1)}} = \frac{1}{2} \delta_{t}^{(L-1)} \phi(a_{s}^{(L-2)})
$$

我們可以對任意權重 $\Theta_{ab}^{(c)}$ 同理推論出：

$$
\frac{\partial Cost(\Theta) }{\partial\Theta_{ab}^{(c)}} = \frac{1}{2} \delta_{b}^{(c)} \phi(a_{a}^{(c-1)})
$$

{% note info %}
從這裡可以發現 $\delta$ 是可以重複利用的，而且誤差是由最後一層，層層向前傳遞。
{% endnote %}
