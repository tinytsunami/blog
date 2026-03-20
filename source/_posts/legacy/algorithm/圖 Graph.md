---
title: 圖 Graph
permalink: graph/
categories: (legacy) algorithm
date: 2022-02-12
mathjax: true
---

這篇文章主要是為了之後的文章做鋪墊，
原本是想說跟特殊的圖論算法文章一起發的。

<!-- more -->

# 元組

元組（tuple）是一種數學結構：

* 有序元組通常以小括號表示 $(a_0, a_1, a_2, ...)$
* 無序元組通常以大括號表示 $\\{a_0, a_1, a_2, ...\\}$

另外，如果一個元組有 $k$ 個元素，我們會稱為 k 元組（k-tuple），例如：$(1,2)$ 為二元組。

有序元組的元素「順序」不能改變，如果改變，則不為同樣的有序元組，例如： 

$$
(1, 2) \neq (2, 1)
$$

無序元組的元素「順序」能夠改變，改變後仍為同樣的元組，例如：

$$
\\{1, 2\\} = \\{2, 1\\}
$$

元組跟集合最大的兩點不同是：

* 元組允許重複元素（這個性質跟多重集一樣），例如：$(1, 2, 2) \neq (1, 2)$
* 元組必為有限個元素，集合允許無限個元素

{% note info %}
包含 $n$ 個有限元素的 [多重集（multiset）](https://en.wikipedia.org/wiki/Multiset)是一個無序 n 元組
{% endnote %}

{% note info %}
二元組又稱為對（pair），對學生來說，最常見的有序對可能是平面座標上的點 $(x, y)$
{% endnote %}

## 笛卡兒積

笛卡兒積（Cartesian product）也被稱為卡氏積，定義是：

$$
A \times B = \\{(a, b) \:|\: a \in A ,\; b \in B \\}
$$

也就是將兩個集合的元素構成對，再包進一個集合中，例子：

$$
\\{\text{a}, \text{b}\\} \times \\{1, 2, 3\\} = \\{(a, 1), (a, 2), (a, 3), (b, 1), (b, 2), (b, 3)\\}
$$

# 圖的定義

圖（graph）是由點（vertex）的集合、邊（edge）的集合構成的有序對：

$$
G = (V, E)
$$

其中：

* 圖表示為 $G$
* 點集表示為 $V$ 是構成點的集合
* 邊集表示為 $E$ 是構成邊的多重集

{% note info %}
若邊集元素皆唯一（無重邊）則有 $E \subseteq V \times V$ 的關係
{% endnote %}

圖的例子：

$$
G = (V, E), \;\text{where}\; V = \\{a,b,c\\},\; E=\\{(a,a), (a,b)\\}
$$

通常會畫成：

![](https://i.imgur.com/xCacvlo.png)

上圖為不連通的圖。

圖若連通（connected）則沒有斷開。更精確地說，任兩點皆存在一條路徑抵達另外一點。

## 設置權重

可以為點或邊設置權重，數學上會使用函數處理：

* 定義「點權重」為函數 $W_v(u)$ 帶入點 $u$ 可得該點權重。
* 定義「邊權重」為函數 $W_e(u, v)$ 帶入邊 $(u, v)$ 可得該邊權重。

{% note info %}
這邊有一個很彆扭的地方是，數學上常常將元組「直接拆開」作為函數輸入

比方說，函數 $f(x, y) = \sqrt{x^2 + y^2}$ 可以代入 $(2, 3)$ 作為參數

通常不會保留其原本的結構（但偶爾會）即寫為 $f((x, y))$ 或 $f(p)$
{% endnote %}

## 迴圈與環路

迴圈（loop）是指有自己到自己的邊：

![](https://i.imgur.com/H7I3OFK.png)

環路（cycle）是圖上可以走一圈到自己：

![](https://i.imgur.com/R8glOLi.png)

{% note info %}
若圖有負環路（negative cycle）即環路上的所有邊權重和為負，則最短路徑問題的正解為無限小（不存在）；因為從任一點出發抵達負環路後，會持續在環路中繞，權重和會越來越小。
可是由於演算法設計的關係，有可能可以解出負環路圖的最短路徑解，但不為最佳解。
{% endnote %}

## 有向與無向

有向圖（directed graph）是指圖上的邊是單行道、單向通行：

![](https://i.imgur.com/g8tri0h.png)

無向圖（undirected graph）是指圖上的邊雙向通行：

![](https://i.imgur.com/wXKkzUx.png)

{% note info %}
無論有向無向，邊集 $E$ 元素皆用小括號表示。無向圖的情況下，寫 $(a, b)$ 跟 $(b, a)$ 的意義是相同的，儘管以大括號表示會更加貼近它的意義，但習慣上不太會這樣表示。
{% endnote %}

## 點的度數

無向圖的度數（degree）是指點有多少邊與之相聯，通常點 $u$ 的度數表示為 $deg(u)$

![](https://i.imgur.com/RKkf3ru.png)

有向圖分成：

* 入度數（in-degree）而點 $u$ 的度數表示為 $id(u)$
* 出度數（out-degree）而點 $u$ 的出度數表示為 $od(u)$

![](https://i.imgur.com/LP04A3K.png)

# 圖的縮寫

這裡列出一些常見的圖縮寫：

| 名稱 | 縮寫 | 簡述 | 例子 |
|:-:|:-:|:-:|:-:|
| 完全圖（complete graph） | $K_n$ | 每點都跟其他點恰一邊相連 | $K_5$ ![](https://i.imgur.com/RBI2Mym.png) |
| 環圖（cycle graph） | $C_n$ | 點與邊數相同，且每點的度數皆為 2 | $C_5$ ![](https://i.imgur.com/lZFNx8h.png) |
| 完全雙分圖（complete bipartite graph） | $K_{m,n}$ | 點分成兩組，每點都跟另一組所有點恰一邊相連 | $K_{2,3}$ ![](https://i.imgur.com/TFOTy29.png) |
| 立方圖（cubical graph） | $Q_n$ | 立方形 | $Q_3$ ![](https://i.imgur.com/GDdqduy.png) |
| 有向完全圖（complete graph） | $K^*_n$ | 同 $K_n$ 只是邊有方向 | $K^*_5$ ![](https://i.imgur.com/LxgKFbm.png) |
| 輪圖（wheel graph） | $W_n$ | 同 $C_n$ 只是多放一點跟所有點相連 | $W_5$ ![](https://i.imgur.com/wFQ5Nnj.png) |

# 圖的表示

圖在電腦中的表示大致上有兩種，一種基於陣列，另一種基於串列。

## 鄰接矩陣

鄰接矩陣（adjacency matrix）用點跟點的關係做標記：

![例 1、有權重無向圖的例子](https://i.imgur.com/QJWY1bu.png)

有權重時，為了搭配演算法，常常會將沒有連接的邊，設為 `0x7fffffff` 即 4 bytes 的整數最大值，其他的邊會放入該邊權重。

{% codeblock lang:c %}
// 沒有連接權重無限大
#define X 0x7FFFFFFF

// 鄰接矩陣
int G[5][5];

//        0  1  2  3  4
//        a  b  c  d  e
//  0  a  3  2  1  X  X
//  1  b  2  X  3  4  X
//  2  c  1  3  X  1  X
//  3  d  X  4  1  X  X
//  4  e  X  X  X  X  X

...

G[2][3]; // 邊權重 (c, d) = 1
{% endcodeblock %}

![例 2、無權重有向圖的例子](https://i.imgur.com/llMue6n.png)

如果沒有權重，通常會將沒有連接的邊設為 `0` 做標記。

{% codeblock lang:c %}
// 鄰接矩陣
int G[5][5];

//        0  1  2  3  4
//        a  b  c  d  e
//  0  a  1  1  0  0  0
//  1  b  0  0  1  1  0
//  2  c  1  0  0  0  0
//  3  d  0  0  1  0  0
//  4  e  0  0  0  0  0

...

G[2][3]; // 邊 (c, d) 無連接
{% endcodeblock %}

{% note info %}
還有一種比較少見的接合矩陣（incidence matrix）是以點跟邊構成的表示法。
{% endnote %}

## 鄰接串列

鄰接矩陣的一個問題是當 $|E| << |V|^2$ 時，稱為稀疏圖（sparse graph），很浪費空間，另外在演算法中，搜索邊還要翻找一大堆 `0` 會浪費時間。故此，鄰接串列（adjacency list）只記錄存在的邊，既可節省空間，也可省去一些常數時間。

![例 3、稀疏圖的例子](https://i.imgur.com/uWL8N3X.png)

{% codeblock lang:c %}
// 鄰接串列
struct Node {
 int id;
 struct Node * next;
};

typedef struct Node G[12];

//  0  a -> c -> NULL
//  1  b -> NULL
//  2  c -> NULL
//  3  d -> NULL
//  4  e -> NULL
//  5  f -> NULL
//  6  g -> NULL
//  7  h -> NULL
//  8  i -> NULL
//  9  j -> NULL
// 10  k -> NULL
// 11  l -> NULL

...

(G[0].next)->id; // a -> c, 2
{% endcodeblock %}
