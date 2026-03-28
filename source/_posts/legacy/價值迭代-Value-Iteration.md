---
title: 價值迭代 Value Iteration
permalink: value-iteration/
categories: legacy-algorithm
date: 2019-05-18
mathjax: true
---
這篇文章是《人工智能：一種現代的方法》及 Udacity 上的強化學習課程筆記及其他內容的整理，
從馬可爾夫決策過程、價值迭代、策略迭代、Q 學習，最後到深度 Q 網路的思路。
<!-- more -->

# 前言
這篇文章是上一篇文章《馬可爾夫決策過程 Markov Decision Process》的續篇，
如果沒有基礎或想看過那篇文章，可以先去看看。

{% note success %}
這是 DQN 的系列文章，上一篇是 {% permalink markov-decision-process %}
{% endnote %}

上一篇文章中，我們設計好了馬可爾夫決策過程的模型，但尚未提及如何解決問題。
為了解決序列式決策問題，本篇將會提到一個關鍵演算法「價值迭代」。

原本是要連策略迭代一起寫，結果價值迭代寫太長，後來決定分成兩篇了……

# 問題建模
為了避免讀者需要在兩個文章間不同切換，我在這邊簡單寫一些建模的內容，
當然符號方面也會跟上一篇文章差不多，但為了方便我們繼續討論下去，我們將做一些改變：

* 地圖尋路及簡化二十一點的 $MOVE$ 跟 $ACTION$ 映射改成 $A$ 命名（A 表示動作，即 Action）
* 地圖尋路及簡化二十一點的 $POINT$ 跟 $SCORE$ 函數改成 $R$ 命名（R 表示回報，即 Reward）

這樣一來文章讀起來比較順暢，再繼續之前，我們先重看一次建模的定義。

## 地圖尋路
請參考圖 1，問題定義寫在下方。

![圖 1、基本玩具問題](https://i.imgur.com/8g4n6Sv.png)

問題建模為：

* 狀態集合，即座標集合 $S = \\{(x, y)| x \in \\{1, 2, 3\\}, y \in \\{1, 2, 3, 4\\} \\}$
* 動作函數，即在某一座標可以執行的動作 $A: S \mapsto \\{\text{up}, \text{left}, \text{right}, \text{down}\\}$
* 轉移模型，即在某座標、執行某動作後，轉移到下個狀態的機率 $P(s_{t+1}|s_{t}, a_{t})$ 其中 $s_{t}, s_{t+1} \in S$ 且 $a_{t} \in A(s_{t})$
* 回報函數，每個位置的得分 $R(s) = R(x, y)$

詳細定義的部分：

{% raw %}
$R(s) = R(x, y) = \left\{\begin{array}{l}
+1 && \text{if } s = (4, 3) \\
-1 && \text{if } s = (4, 2) \\
-0.04 && \text{otherwise}
\end{array}\right .$
{% endraw %}

## 簡化的二十一點
前篇中，簡化二十一點的規則如下：

* 牌面 1、2、3、4、5 每種牌都有無限多張且抽到每一種的機率相等
* 牌面 1、2、3、4、5 對應點數為牌面的數字
* 每一回合莊家、玩家決定要不要繼續抽牌
* 若某回合不抽牌，接下來的回合不能繼續抽牌
* 若超過 10 點，則判輸
* 若雙方皆超過 10 點，則平手
* 若雙方皆小於等於 10 點，則點數大者勝
* 所有牌都是明牌（玩家可觀察）
* 莊家先抽牌

我們將其建模為：

* 狀態集合，即各種手牌 $s$ 及允許抽牌標誌 $f$ 的集合 $S = \\{s = (c, f) | c \subseteq \\{1, 2, 3, 4, 5\\},  f \in \\{1, 0\\}\\}$
* 動作函數，即每回合可以執行的動作 $A: S \mapsto \\{\text{draw}, \text{pass}\\}$
* 轉移模型，即抽牌後，轉移到下個狀態的機率 $P(s_{t+1}|s_{t}, a_{t})$ 其中 $s_{t}, s_{t+1} \in S$ 且 $a_{t} \in A$
* 回報函數，即一局遊戲的牌面數字 $R(s)$ 其中 $s \in S$

詳細定義的部分：

{% raw %}
$A(c, f) = \left\{\begin{array}{l}
\text{draw}, \text{pass} && \text{if } f = 1 \text{ and } \sum\limits_{x \in c}x \leq 10 \\
\text{pass} && \text{if }  f = 0 \text{ or } \sum\limits_{x \in c}x > 10 \\
\end{array}\right .$
{% endraw %}<br/>
{% raw %}
$R(s) = R(c, f) = \left\{\begin{array}{l}
\sum\limits_{x \in c}x && \text{if } \sum\limits_{x \in c}x \leq 10 \\
0 && \text{if } \sum\limits_{x \in c}x > 10 \\
\end{array}\right .$
{% endraw %}<br/>
{% note warning %}
再次提醒，這裡的動作函數 $A$ 很可能是「一對多」映射；嚴格說「一對多」映射不構成函數，但習慣上會這樣稱呼。
{% endnote %}

# 策略與效用
接下來，我們要討論策略與效用。

策略（policy）被定義為 $\pi(s_{t})$，其中 $s_{t} \in S$，指的是在狀態 $s_{t}$ 的情況下，推薦的行動，
行動通常是由 $A(s_{t})$ 一對多映射得到的「多種結果」，而 $\pi(s_{t})$ 會必然會給出其中一種。

為了對比，最優策略（best policy）通常表示為 $\pi^{\*}(s_{t})$，
是理想狀態下可以得到的最佳決策，也是之後 AI 算法收斂的目標。

「效用」其實就是得分，為 $R(s_{t})$ 的加總。
若隨著時間我們有不同的狀態 $s_{0}, s_{1}, s_{2}, ...$，則效用可以表示成：

$U_{h}([s_{0}, s_{1}, s_{2}, ...]) = R(s_0) + \gamma R(s_1) + \gamma^{2} R(s_2) + ...$

其中 $\gamma \in [0, 1]$ 為折扣因子，折扣因子越接近 $0$，則對未來的效用越不敏感，
通常這種效用的定義方式，被稱作折扣回報（discounted reward），
當 $\gamma = 1$ 效用退化成單純的加總，被稱為累加回報（addictive reward）。

# 貝爾曼方程
在進行算法前，我們這邊要介紹一個效用方程式，
被稱為「貝爾曼方程」又名動態規劃方程，定義如下：

$U(s_{t}) = R(s_{t}) + \gamma\max\limits_{a \in A(s_{t})}\sum\limits_{s_{t+1}}P(s_{t+1}|s_{t}, a)U(s_{t+1})$

回憶上面建模的定義，其中 $s_{t}, s_{t+1} \in S$ 且 $a_{t} \in A(s_{t})$

雖然看起來很複雜，但其實不太困難，具體來說：

1. 在某個時間 $t$ 有某一個狀態 $s_{t}$
2. 這個 $s_{t}$ 的效用 $U(s_{t})$ 為「目前的效用 $R(s_{t})$」
3. 執行某一個動作 $a$ 後，下一個狀態的期望值 $\sum\limits_{s_{t+1}}P(s_{t+1}|s_{t}, a)U(s_{t+1})$
4. 這個狀態的效用，其中包含到折扣因子 $\gamma$ 及下一狀態期望的最佳效用

其中第 3 點，單純這樣看可能難以理解；
因為抽牌具有隨機性，所以用我們的簡化二十一點說明：

1. 假設折扣因子為 $\gamma = 0.9$
2. 舉例來說，在某個時間 $t$ 有某一個狀態 $s_{t} = (\\{1, 3, 5\\}, 1)$ 即「手牌有 1、3、5 點，還沒 PASS 過」
3. 目前的效用 $R(s_{t}) = R(\\{1, 3, 5\\}, 1) = 1 + 3 + 5 = 9$
4. 可以執行的動作為 $A(s_{t}) = A(c_{t}, f_{t}) = \text{draw, pass}$
5. 執行抽牌動作 $a = \text{draw}$ 的話，期望值有：
    * $P((\\{1, 3, 5, 1\\}, 1)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 20\% \cdot U(s_{t+1}) = 20\% \cdot U(\\{1, 3, 5, 1\\}, 1) = 2$<br/>
    （由於接下來 $s_{t+2}$ 都超過 10 點，選擇 PASS 為最大，所以不必計算 $U(s_{t+2})$ 的值。）
    * $P((\\{1, 3, 5, 2\\}, 1)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 20\% \cdot U(s_{t+1}) = 0$（超過 10 點）
    * $P((\\{1, 3, 5, 3\\}, 1)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 20\% \cdot U(s_{t+1}) = 0$（超過 10 點）
    * $P((\\{1, 3, 5, 4\\}, 1)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 20\% \cdot U(s_{t+1}) = 0$（超過 10 點）
    * $P((\\{1, 3, 5, 5\\}, 1)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 20\% \cdot U(s_{t+1}) = 0$（超過 10 點）
    * $P((\\{1, 3, 5, 1\\}, 0)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 20\% \cdot U(s_{t+1}) = 0$（再抽牌，超過 10 點）
    * $P((\\{1, 3, 5, 2\\}, 0)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 0\% \cdot U(s_{t+1}) = 0$（不能抽牌）
    * $P((\\{1, 3, 5, 3\\}, 0)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 0\% \cdot U(s_{t+1}) = 0$（不能抽牌）
    * $P((\\{1, 3, 5, 4\\}, 0)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 0\% \cdot U(s_{t+1}) = 0$（不能抽牌）
    * $P((\\{1, 3, 5, 5\\}, 0)|(\\{1, 3, 5\\}, 1), \text{draw})U(s_{t+1}) = 0\% \cdot U(s_{t+1}) = 0$（不能抽牌）

6. 執行停止動作 $a = \text{pass}$ 的話，期望值有：
$P((\\{1, 3, 5\\}, 0)|(\\{1, 3, 5\\}, 1), \text{pass})U(s_{t+1}) = 100\% \cdot U(s_{t+1}) = 9$（接下來不能抽牌）
$P((\\{1, 3, 5\\}, 1)|(\\{1, 3, 5\\}, 1), \text{pass})U(s_{t+1}) = 0\% \cdot U(s_{t+1}) = 0$（PASS 後，能繼續抽牌的機率為 0）

7. 則「最大的下一個狀態期望值」是 $\max\limits_{a \in A(s_{t})}\sum\limits_{s_{t+1}}P(s_{t+1}|s_{t}, a)U(s_{t+1}) = 9$

8. 這個狀態的效用為 $U(s_{t}) = R(s_{t}) + \gamma\max\limits_{a \in A(s_{t})}\sum\limits_{s_{t+1}}P(s_{t+1}|s_{t}, a)U(s_{t+1}) = 9 + 0.9 \cdot 9 = 17.1$

# 價值迭代
有了效用的評估，我們可以計算每個狀態的效用，
然後利用效用來決策，這個過程稱為價值迭代（value iteration）。

下面為價值迭代的步驟：

1. 輸入變數：狀態集合 $S$、動作函數 $A(s)$、轉換模型 $P(s'|s, a)$、回報函數 $R$、折扣因子 $\gamma$與停止誤差 $\epsilon$
2. 建立區域變數：初期效用 $U(s)$、暫存效用 $U'(s)$ 及效用差 $\delta$
3. $U \leftarrow U'$、$\delta \leftarrow 0$
4. $U'(s) \leftarrow R(s) + \gamma\max\limits_{a \in A(s)}\sum\limits_{s'}P(s'|s_{t}, a)U(s'), \forall s \in S$
5. 若 $|U'(s) - U(s)| > \delta$ 則 $\delta \leftarrow |U'(s) - U(s)|$
6. 重複 3~5 步，直到 $\delta < \epsilon (1 - \gamma) / \gamma$
7. 回傳 $U$

{% note info %}
其中 $s'$ 跟 $s_{t+1}$ 是相同的，指某狀態 $s$（或 $s_{t}$）的下一個可能狀態
但在迴圈中，避免讀者誤會 $t$ 會遞增，故改以 $s'$ 表示
{% endnote %}

{% note info %}
$U$ 跟 $U'$ 是兩個大小為 $|S|$ 的向量
{% endnote %}

不難發現，價值迭代不斷更新 $U(s)$ 向量去計算每個狀態的效用，
而中止條件是 

$$\delta < \epsilon (1 - \gamma) / \gamma$ 其中 $\delta = \max\limits_{s}|U'(s) - U(s)|$$

要理解終止條件，我們要來討論貝爾曼方程的收斂，先定義兩個內容：

* 貝爾曼算子 $B$ 相當於執行：

$$R(s) + \gamma\max\limits_{a \in A(s)}\sum\limits_{s'}P(s'|s_{t}, a)U(s')$$

* 以及，最大范數 $\\|U\\|$：

$$\\|U\\|=\max\limits_{s}|U(s)|$$

即向量中最大的值

那麼，兩個效用的最大距離為 $\\|U - U'\\| = \max\limits_{s}|U'(s) - U(s)|$ 即演算法中的 $\delta$

接下來，考慮第 $t+1$ 次迭代的距離為 $\\|U_{t+1} - U_{t+1}'\\|$
考慮演算法中第 4 步，即 $U_{t+1} \leftarrow BU_{t}$，可以發現 $U_{t+1}$ 為 $BU_{t}$
故 $\\|U_{t+1} - U_{t+1}'\\| = \\|BU_{t} - BU_{t}'\\|$

因為 
$$\\|BU_{t} - BU_{t}'\\| = \\|R(s) + \gamma\max\limits_{a \in A(s)}\sum\limits_{s'}P(s'|s_{t}, a)U_{t}(s') - [R(s) + \gamma\max\limits_{a \in A(s)}\sum\limits_{s'}P(s'|s_{t}, a)U_{t}'(s')]\\|$$
$$= \\|\gamma\max\limits_{a \in A(s)}\sum\limits_{s'}P(s'|s_{t}, a)U_{t}(s') - \gamma\max\limits_{a \in A(s)}\sum\limits_{s'}P(s'|s_{t}, a)U_{t}'(s')\\|$$
$$= \gamma \\|\max\limits_{a \in A(s)}\sum\limits_{s'}P(s'|s_{t}, a)U_{t}(s') - \max\limits_{a \in A(s)}\sum\limits_{s'}P(s'|s_{t}, a)U_{t}'(s')\\|$$
$$\leq \gamma \\|\max\limits_{s}U_{t}(s') - \max\limits_{s}U_{t}'(s')\\|$$

{% note info %}
「選擇某個動作達到的最大效用」不會高於「遍歷所有狀態得到的最大效用」
{% endnote %}

簡單觀察 

$$|\max\limits_{a}f(a) - \max\limits_{a}g(a)| \leq \max\limits_{a}|f(a) - g(a)|$$

在 $\max\limits_{a}|f(a) - g(a)|$ 中，若 $f(a)$ 為最大值，即 $f(a) = \max\limits_{a}f(a)$
同樣的 $a$ 對於 $g(a)$ 來說，可能不滿足 $g(a) = \max\limits_{a}g(a)$，所以有上面那個結果（書中習題 17.6(a) 的內容）

又 

$$\\|U - U'\\| = \max\limits_{s}|U'(s) - U(s)|$$

所以 

$$\\|BU_{t} - BU_{t}'\\| \leq \gamma \\|\max\limits_{s}U_{t}(s') - \max\limits_{s}U_{t}'(s')\\| \leq \max\limits_{s}|U'(s) - U(s)| = \\|U - U'\\|$$

可得 

$$\\|BU_{t} - BU_{t}'\\| \leq |U_{t} - U_{t}'|$$

考慮效用的極值：

$$U_{h}([s_{0}, s_{1}, s_{2}, ...]) = R(s_0) + \gamma R(s_1) + \gamma^{2} R(s_2) + ...$$

$$\leq \max\limits_{s}R(s) + \gamma \max\limits_{s}R(s) + \gamma^{2} \max\limits_{s}R(s) + ... = \frac{\max\limits_{s}R(s)}{1-\gamma}$$

（由於 $\gamma < 1$ 使用等比級數公式）

若有負回報 $R(s) \leq 0$ 同理，則有：

$$U_{max} = \pm\frac{\max\limits_{s}R(s)}{1-\gamma}$$

{% note info %}
這個步驟透漏了一個訊息，當 $\gamma = 1$ 時，很可能貝爾曼方程不會收斂。
{% endnote %}

透過最大、小值範圍，不難推導出 $\\|U_{0} - U_{t}'\\| \leq \frac{2\max\limits_{s}R(s)}{1-\gamma}$

若 $N$ 次迭代的誤差不超過 $\epsilon$，又每一次誤差降低 $\gamma$ 倍，則 $\gamma^{N}\frac{2\max\limits_{s}R(s)}{1-\gamma}\leq \epsilon$

解出 $N$：
$$\gamma^{N}\frac{2\max\limits_{s}R(s)}{1-\gamma}\leq \epsilon$$
$$\gamma^{N}2\max\limits_{s}R(s) \leq \epsilon(1-\gamma)$$
$$\gamma^{N} \leq \frac{\epsilon(1-\gamma)}{2\max\limits_{s}R(s)}$$
$$N \leq log_{\gamma}(\frac{\epsilon(1-\gamma)}{2\max\limits_{s}R(s)})$$
$$N \leq log(\frac{\epsilon(1-\gamma)}{2\max\limits_{s}R(s)})/log(\gamma)$$（換底公式）

則 $N$ 至多迭代 $\lceil log(\frac{\epsilon(1-\gamma)}{2\max\limits_{s}R(s)})/log(\gamma) \rceil$ 次，
這是一整個系統的迭代上界，若我們只考慮一步：

$$\gamma\frac{2\max\limits_{s}R(s)}{1-\gamma}\leq \epsilon$$
$$2\gamma\max\limits_{s}R(s) \leq \epsilon(1-\gamma)$$
$$2\max\limits_{s}R(s) \leq \frac{\epsilon(1-\gamma)}{\gamma}$$

另外由於 

$$\\|U_{t+1} - U_{t}\\| = \\|U_{t} - U_{t+1}\\| \leq \\|U_{0} - U_{t}'\\| $$

所以 

$$\\|U_{t+1} - U_{t}\\| \leq \\|U_{0} - U_{t}'\\| \leq 2\max\limits_{s}R(s) \leq \frac{\epsilon(1-\gamma)}{\gamma}$$

可得中止條件為：

$$\\|U_{t+1} - U_{t}\\| = \max\limits_{s}|U'(s) - U(s)| = \delta \leq \frac{\epsilon(1-\gamma)}{\gamma}$$

# 問題解決

接下來，我們來看實際解決問題時，價值迭代是如何運作的，
雖然表面上價值迭代計算每個狀態的效用，然後選擇動作朝著效用較大的方向前進，
但有時狀態顯示的效用並不能協助我們做出較佳的決策。

## 地圖巡路

這是書中玩具問題，再加上一點修改而成；
具體來說，我們的移動是確定的，導致期望值的部分是確定的。

{% codeblock lang:js %}
...
/* 宣告變數 */
const up = 0, down = 1, left = 2, right = 3;
let A = [up, down, left, right];                        // 動作 A
let U = Array.from({length: 3}, () =>                   // 效用
        Array.from({length: 4}, () => 0));              // 大小 width = 4, height = 3
let Ut = Array.from({length: 3}, () =>                  // 效用暫存
         Array.from({length: 4}, () => 0));             // 大小同效用 U
let D = Array.from({length: 3}, () =>                   // 決策表
         Array.from({length: 4}, () => 0));             // 大小同效用 U
let epsilon = 0.01;                                     // 迭代停止參數
let gamma = 0.9;                                        // 折扣因子
let delta;                                              // 迭代差

/* 回報函數 */
let R = function(x, y) {
  if(x == 3 && y == 0) {                                // 終點
    return +1;
  }else if(x == 3 && y == 1) {                          // 陷阱
    return -1;
  }else if(x == 1 && y == 1) {                          // 牆（不評分）
    return 0;
  }
  return -0.04;                                         // 其他狀態
};

/* 動作的期望值 */
let Exp = function(x, y) {
  let exp = [];
  if(x > 0) {
    exp.push(1.0 * U[y][x - 1]);                        // 向左移動
  }
  if(x < 3) {
    exp.push(1.0 * U[y][x + 1]);                        // 向右移動
  }
  if(y > 0) {
    exp.push(1.0 * U[y - 1][x]);                        // 向上移動
  }
  if(y < 2) {
    exp.push(1.0 * U[y + 1][x]);                        // 向下移動
  }
  return exp;                                           // 回傳期望值
};

/* 演算法主體 */
do {
  for (let y = 0; y < 3; y++) {                         // 複製效用暫存
    for (let x = 0; x < 4; x++) {
      U[y][x] = Ut[y][x];
    }
  }
  delta = 0;                                            // 初始化迭代差
  for (let y = 0; y < 3; y++) {                         // 對所有狀態
    for (let x = 0; x < 4; x++) {  
      if((x == 3 && y == 0) ||                          // 終點的效用固定
         (x == 3 && y == 1) ||                          // 陷阱的效用固定
         (x == 1 && y == 1)) {                          // 牆的效用固定
        Ut[y][x] = R(x, y);
      }
      else {                                            // 其他狀態的效用
        let exp = Exp(x, y);
        Ut[y][x] = R(x, y) + gamma * Math.max(...exp);  // 貝爾曼方程
      }
      if (Math.abs(Ut[y][x] - U[y][x]) > delta) {       // 計算最大迭代差
        delta = Math.abs(Ut[y][x] - U[y][x]);           // 儲存迭代差
      }
    }
  }
} while (delta >= epsilon * (1 - gamma) / gamma);       // 中止條件

/* 在 Console 輸出表格 */
console.table(U);
...
{% endcodeblock %}

程式輸出請參考圖 2 所示，
雖然表面上，只要沿著效用較大的格子走，就可以到達終點，
但實際的決策可能要參考 $\max\limits_{a \in A(s)}$ 的動作選擇，
具體請參考簡化二十一點的程式輸出。

![圖 2、地圖巡路：程式輸出](https://i.imgur.com/1Z7xib3.png)

## 簡化二十一點
接著看我們自己設計的玩具問題，幫助我們理解更全面一點。

考慮任何狀態 $s_{t} = (c, f) \in S$ 與 $s_{t}' = (c', f') \in S$ 
若滿足 $\sum\limits_{x \in c}x = \sum\limits_{x \in c'}x$ 則效用評估有：$U(s_{t}) = U(s_{t}')$
因為效用等於牌面點數和 $R(s) = R(s')$，而動作只有抽不抽牌，故雖然看起來 $|S|$ 很大，
但其實 $|S|$ 有意義的範圍，只有 $\sum\limits_{x \in c}x \leq 10$ 的部分而已。

故 $S$ 大小為總和的可能值域：即 0（手上沒牌）到 15（剛好手上總和為 10 點時，又抽了一張 5 點）
加上抽不抽牌的旗標有 0 與 1 兩種，共 2*15 = 30 種狀態，
然而實際程式碼中，狀態其實只是效用 $U$ 與 $U'$ 的引索而已。

{% codeblock lang:js %}
...
/* 宣告變數 */
const pass = 0, draw = 1;                               // 動作 A
let U = Array.from({length: 2}, () =>                   // 效用, s = (c, f)
        Array.from({length: 16}, () => 0));             // 大小 |c| = 16, |f| = 2 
let Ut = Array.from({length: 2}, () =>                  // 效用暫存
         Array.from({length: 16}, () => 0));            // 大小同效用 U
let epsilon = 0.01;                                     // 迭代停止參數
let gamma = 0.9;                                        // 折扣因子
let delta;                                              // 迭代差

/* 回報函數 */
let R = function(c) {
  return c > 10 ? 0 : c;
};

/* 動作的期望值
   若 f = 0: 只能選擇 "pass" (其中 exp = [pass_value])
   若 f = 1: 可能選擇 "draw" 或 "pass" (其中 exp = [pass_value, draw_value]) */
let Exp = function(c, f) {
  let exp = [];
  if (f == 0) {                                         // 若 f = 0: 只能選 "pass"
    exp.push(1.0 * R(c));                               // pass 成功機率為 100%
  } else if (f == 1) {                                  // 若 f = 1: 能選 pass 或 draw
    exp.push(1.0 * R(c));                               // pass 成功機率為 100%
    let t = 0;                                          // draw 下個狀態的機率為牌面 + 1~5 (各20%)
    for (let d = 1; d <= 5; d++) {
      if (c + d < 16) {
        t += 0.2 * U[f][c + d];
      }
    }
    exp.push(t);
  }
  return exp;                                           // 回傳期望值
};

/* 演算法主體 */
do {
  for (let f = 0; f <= 1; f++) {                        // 複製效用暫存
    for (let c = 0; c <= 15; c++) {
      U[f][c] = Ut[f][c];
    }
  }
  delta = 0;                                            // 初始化迭代差
  for (let f = 0; f <= 1; f++) {                        // 對所有狀態 s = (c, f)
    for (let c = 0; c <= 15; c++) {
      let exp = Exp(c, f);
      Ut[f][c] = R(c) + gamma * Math.max(...exp);       // 貝爾曼方程
      if (Math.abs(Ut[f][c] - U[f][c]) > delta) {       // 計算最大迭代差
        delta = Math.abs(Ut[f][c] - U[f][c]);           // 儲存迭代差
      }
    }
  }
} while (delta >= epsilon * (1 - gamma) / gamma);       // 中止條件

/* 在 Console 輸出表格 */
let arr = [[], []];
for(let c = 0; c <= 15; c++) {
    arr[0].push(parseFloat(U[0][c].toFixed(2)));
    arr[1].push(parseFloat(U[1][c].toFixed(2)));
}
console.table(arr);
...
{% endcodeblock %}

參考圖 3 可以看到執行結果，
查看完整演示之前，我們可能需要分析一下結果的合理性。

![圖 3、簡化二十一點：程式輸出](https://i.imgur.com/cpzMqL4.png)

若狀態 $s = (c, f)$，那麼列（row）方向是 $f$ 的標誌，而行（cloumn）方向是 $\sum\limits_{x \in c}x$ 的值。

可以發現 $s = (9, 1)$ 的值，跟 [貝爾曼方程段落](#貝爾曼方程) 的手算結果一致，
不過看起來表格怪怪的，這主要是因為我們沒有顯式地把 $\max\limits_{a \in A(s)}$ 的選擇保留，
導致這張表格本身雖然能看到效用值 $U$，但是不能為我們做決策。

舉兩個例來說：

1. 如果我狀態在 $s = (1, 10)$ 則我會選擇 $s = (0, 10)$ 為下個狀態（也就是 pass 動作），
因為與 $(1, i), i = 11, 12, ..., 15$ 相比，該位置效用值較大。

2. 如果我狀態在 $s = (1, 9)$ 則我會選擇 $s = (1, 10)$ 為下個狀態（也就是 draw 動作），
因為與 $(1, i), i = 10, 12, ..., 14$ 相比，該位置效用值較大。

第二個例子，就是這張表不合邏輯的地方了，
從另一個角度來說，如果我狀態是 $s = (1, 9)$，抽牌的風險非常大。

{% note info %}
敏銳的讀者可能發現，可以將這個玩具問題轉換成地圖尋路。
{% endnote %}

### 結果修正

事實上，如果我們將 $\max\limits_{a \in A(s)}$ 記錄下來，可以發現 AI 其實是選擇 pass 動作，才使效用最大化的，
具體參考圖 4 的 $s = (1, 9)$ 處。

![圖 4、簡化二十一點：MAX 函數的動作選擇](https://i.imgur.com/3LjuaW5.png)

題外話，若改變 $R(s)$ 在 $\sum\limits_{x \in c}x > 10$ 條件下的值，決策可能發生變化；
具體來說，當 $0$ 變成 $-\infty$ 時，決策會趨近絕對保守（盡量 PASS），反之亦然。

另一個修正方法是，將 $R(s)$ 重新定義，順便將 $(1, i), i = 11, 12, ..., 15$ 固定下來。
我們規定，狀態為 $pass$ 時，會有回報的加成，則重新定義的 $R$ 為：

{% raw %}
$R(s) = R(c, f) = \left\{\begin{array}{l}
(1 - f) + \sum\limits_{x \in c}x && \text{if } \sum\limits_{x \in c}x \leq 10\\
0 && \text{if } \sum\limits_{x \in c}x > 10\\
\end{array}\right .$
{% endraw %}

結果請參考圖 5，此時我們便可以透過效用直接選擇動作了。

![圖 5、簡化二十一點：重新定義回報的結果](https://i.imgur.com/Jof8bqT.png)

### 演示

{% jsfiddle bzL638xf result,js,html,css dark 100% 200px %}

{% note info %}
雖然邏輯上是 AI 高於 7 點則不再抽牌，但這個結論是透過計算而來的；
可以想見在更複雜的狀態環境中，仍可建立決策模式。
{% endnote %}
