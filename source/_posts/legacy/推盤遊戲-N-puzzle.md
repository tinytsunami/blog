---
title: 推盤遊戲  n-puzzle
permalink: n-puzzle/
categories: legacy-algorithm
date: 2018-07-21
mathjax: true
---
這是人工智慧課程的教學筆記。
同時也是學期初上課的內容，因為不太好寫演示所以拖到暑假來完成。
<!-- more -->

原本以為寫起來很簡單，但筆者發現許多地方很難說明清楚，  
增加了許多圖片輔助理解，也延後了完成的時間……

{% note info %}
本篇內容與機器學習無關，更屬於早期推理與搜索人工智慧的部分。
{% endnote %}

# 滑塊遊戲
開始之前，先來討論遊戲本體。  

## 規則
通常而言，已完成的盤面有 2 種表示方法，就像圖 1 這樣：

![圖 1、盤面表示的 2 種方法](https://i.imgur.com/90Tj4xL.png)

筆者採用前者這種。

遊戲的規則很簡單：

* 移動空格（即 0 那格）周圍的拼圖到空格上
* 移動到拼圖完成（只剩空格那塊不在正確的位置上）

以程式來講，規則是容易實作的，  
反而是盤面資料的表示會有很多的考量。

接下來我們會先討論盤面與狀態的關係，再敘說表示方法。

## 盤面與狀態
所謂的狀態，其實就是指儲存的盤面，盤面可以用各種方式儲存，  
其實狀態大致上跟盤面是同義的；雖然嚴格說起來，狀態是盤面的抽象表示。

考慮到 3x3 的盤面，就已經有多種保存的方法：

* 儲存陣列
* 儲存動態陣列的指標
* 儲存某個計算過的數值
* 儲存定義的物件
* ...

儲存陣列在高階語言中，相當於額外開一塊記憶體空間，  
而在 C/C++ 中，儲存指標可能要有效率的多。

計算某個數值的方法，舉例來說可以計算 $V(S) = \sum\limits_{i=0}^{N^{2}-1} 10^{i}S_{i}$
像是 $S = [4, 7, 6, 3, 1, 2, 8, 0, 5]$ 就有：

$V(S) = 10^{0}S_{0} + 10^{1}S_{1} + ... + 10^{8}S_{8}$
$= 4 + 70 + 600 + 3000 + 10000 + 200000 + 8000000 + 0 + 500000000 = 508213674$

儲存定義的物件，通常是用於需要中間盤面的時候，  
而筆者的演示因為需要動畫，所以採用的是這種方式（陣列儲存在物件中）。

{% note danger %}
儲存特定數值可能不是有效的方法，因為數值較大可能溢位（4x4）
{% endnote %}

## 盤面動作
定義好盤面表示法（即狀態）之後，接下來要定義動作。

由於我們將 2 維陣列以 1 維表示，直觀上來講，  
若盤面大小為 $N$ 且狀態為 $S_{i}$ 其中 $i$ 為陣列的註標，  
先定義取得列的函數：

$row(x) = \lfloor\frac{x}{N}\rfloor$

動作的部分：

* 向上移動，即 $swap(S_{i}, S_{i-N})$ 其中 $row(i-N) \geq 0$
* 向下移動，即 $swap(S_{i}, S_{i+N})$ 其中 $row(i+N) \leq N-1$
* 向左移動，即 $swap(S_{i}, S_{i-1})$ 其中 $row(i) = row(i-1)$
* 向右移動，即 $swap(S_{i}, S_{i+1})$ 其中 $row(i) = row(i+1)$

{% note warning %}
若將空格視為圖塊，因為只能移動空格，則此處的 $S_{i}$ 必為 $0$
{% endnote %}

舉個例子。

下面以 $N = 3$ 即 3x3 盤面為例，  
假設此時的 $S = [4, 7, 6, 3, 1, 2, 8, 0, 5]$ 畫成圖 2：

![圖 2、初始盤面](https://i.imgur.com/HohLNkB.png)

{% note info %}
圖的格子中間的數字是儲存的值，而右下角為註標。
{% endnote %}

我們先向下移動，如果不考慮條件，直接移動的話，會變成圖 3：

![圖 3、向下移動錯誤](https://i.imgur.com/yTodbyw.png)

驗算一下，因為 $S_{7} = 0$ 則 $row(7+N) = \lfloor\frac{7+3}{3}\rfloor = \lfloor\frac{10}{3}\rfloor = 3$ 有 $3 \nleq 2$ 代表條件不成立，  
所以移動失敗，如圖 4：

![圖 4、向下移動失敗](https://i.imgur.com/mlYFT87.png)

接著向上移動。
則 $S_{7} = 0$ 因為 $row(7-N) = \lfloor\frac{7-3}{3}\rfloor = \lfloor\frac{4}{3}\rfloor = 1$ 則 $1 \geq 2$ 成立，所以移動成功，如圖 5。
做 $swap(state[7], state[4])$ 有：

![圖 5、向上移動成功](https://i.imgur.com/LGGN4hg.png)

然後我們向右移動，現在 $S_{4} = 0$ 的話：  
$row(4) = \lfloor\frac{4}{3}\rfloor = 1$  
$row(4+1) = \lfloor\frac{5}{3}\rfloor = 1$  
有 $1 = 1$ 成立，所以移動成功，如圖 6。  
做 $swap(state[4], state[5])$ 有：

![圖 6、向右移動成功](https://i.imgur.com/zLKI65z.png)

我們最後再向右移動一次，考慮 $S_{5} = 0$  
$row(5) = \lfloor\frac{5}{3}\rfloor = 1$  
$row(5+1) = \lfloor\frac{6}{3}\rfloor = 2$  
因為 $1 \neq 2$ 所以移動失敗，如圖 7。

如果錯誤移動，則會變成：

![圖 7、向右移動錯誤](https://i.imgur.com/AY2LFNK.png)

正確應該是圖 8 的樣子：

![圖 8、向右移動失敗](https://i.imgur.com/mlYFT87.png)

從上面例子可以看出來，條件只是為了維護空格的正確性。

注意上下移動時，我們只判斷是否出界，因為 $ S_{i \pm N}$ 保證會與 $S_{i}$ 在同一行上；  
同理，在左右移動時，僅判斷是否為同一列的原因，在於兩個出界的情況都會換列。

{% note info %}
為了程式的美觀，可以兩個條件都檢查，不過有些顯得多此一舉。
{% endnote %}

{% note warning %}
行（column）、列（row）是借用矩陣的術語，其實我們使用的是 1 維陣列，並無這個概念。
{% endnote %}

寫成程式，大概長這樣子：

{% codeblock lang:js %}
...
/* 檢查範圍 */
Math.include = function(v, a, b) {
  return v >= a && v < b;                       // v 屬於 [a, b) 則為真
};
...
/* 註標轉換成列 */
let row = function(n, index) {                  // 這裡將 N 也一併傳入
  return Math.floor(index / n);                 // 計算列數
};
...
/* 操作動作 */
let move = function(s, a) {                     // 傳入目前的狀態
  let nextS = Array.from(s);                    // 複製一份狀態
  let p = s.indexOf(0);                         // 檢查 0 的註標
  switch(a) {                                   // 檢查要執行的動作
    case ACTIONS.UP:                            // 向上移動
      if(Math.include(row(N, p - N), 0, N)) {   // 確認邊界範圍
        nextS.swap(p, p - N);                   // 執行交換
      }
      break;
    case ACTIONS.RIGHT:                         // 向右移動
      if(row(N, p) == row(N, p + 1)) {          // 檢查列相等
        nextS.swap(p, p + 1);                   // 執行交換
      }
      break;
    case ACTIONS.DOWN:                          // 向下移動
      if(Math.include(row(N, p + N), 0, N)) {   // 確認邊界範圍
        nextS.swap(p, p + N);                   // 執行交換
      }
      break;
    case ACTIONS.LEFT:                          // 向左移動
      if(row(N, p) == row(N, p - 1)) {          // 確認邊界範圍
        nextS.swap(p, p - 1);                   // 執行交換
      }
      break;
  }
  return nextS;                                 // 回傳下一個狀態
};
...
{% endcodeblock %}

## 檢查狀態
對於檢查是否完成的函數，  
只要狀態在一個陣列中，則比對起來相當容易：

{% codeblock lang:js %}
...
let state = [0, 1, 2, 3, 4, 5, 6, 7, 8];    // 初始狀態
...
let goal = function(state) {                // 檢查結果
  return state.map((value, index)=>{
      return value == index;                // 檢查對錯
  }).reduce((previous, current)=>{          // 全部正確才正確
      return previous && current;           // 總和結果
  });
};
...
{% endcodeblock %}

{% note info %}
這個寫法是在 [規則](#規則) 選擇表示法時確定下來的，不同的表示法有不同的檢查函數。
{% endnote %}

## 解的類型
所謂的解分成 2 種：

* 普通解
* 最優解

普通解是「不限移動多少步」只要完成盤面就可以；  
最優解則是限制「一定要在最少步數」完成盤面。

下面兩個解都會提及。

# 普通解法
普通解法很簡單，但不太實用，  
因為可能要很多步才能到完成盤面。

## 狀態樹
考慮圖 9 的盤面：

![圖 9、初始盤面](https://i.imgur.com/yiUwADa.png)

若將其下一步繪製出來，則有圖 10：

![圖 10、盤面單層狀態樹](https://i.imgur.com/rSXUXe2.png)

這個樣貌的東西，每一個節點都是「狀態」，而整體稱作「狀態樹」
我們的目標，則是在這樣的分支中，尋找解答。

## 貪婪搜索
這是一個 2 層的狀態樹，參考圖 11：

![圖 11、盤面兩層狀態樹](https://i.imgur.com/OAV074x.png)

考慮到圖中狀態 $A = D$ 且 $A = G$ 代表我們需要紀錄已經存在的狀態，  
否則可能陷入無窮迴圈（也可能不會，要看初始狀態。）

貪婪搜索的想法是：「哪一步更好，我就選擇哪一步。」

那麼，哪一步更好呢？考慮到我們檢查函數：

{% codeblock lang:js %}
...
let goal = function(state) {                // 檢查結果
  return state.map((value, index)=>{
      return value == index;                // 檢查對錯
  }).reduce((previous, current)=>{          // 全部正確才正確
      return previous && current;           // 總和結果
  });
};
...
{% endcodeblock %}

可以改寫成：

{% codeblock lang:js %}
...
let h = function(state) {                   // 檢查狀態
  return state.map((value, index)=>{
    if (value == 0) {                       // 是否為空格
      return 0;                             // 空格不算錯位
    }
    else {                                  // 不為空格
      return value == index ? 1 : 0;        // 檢查對錯
    }
  }).reduce((previous, current)=>{          // 累計結果
    return previous + current;
  });
};
...
{% endcodeblock %}

如此一來，函數 $h$ 稱作「評估函數」
對於某一個狀態，可以評價目前的狀態「有多少錯誤的格子」
貪婪的兩層狀態樹，請參考圖 12。

![圖 12、貪婪兩層狀態樹](https://i.imgur.com/26Nh0U3.png)

狀態 $A$ 在選擇下一個狀態：

* $h(B) = 5$
* $h(C) = 3$

所以選擇 $C$ 為下一步。同時，將狀態 $A$ 紀錄下來，  
好在之後排除 $D$ 與 $G$ 兩個相同的狀態。

由於狀態 $C$ 下一步選擇評估最佳的 $H$ 並將 $C$ 記錄下來，  
狀態 $H$ 選擇最佳的 $M$ 為下一步，且狀態 $M$ 選擇最佳的 $P$ 為下一步。

{% codeblock lang:js %}
...
/* 求解盤面 */
let resolve = function(state, h) {                    // 給定狀態與策略
  let actions = Object.keys(ACTIONS);                 // 動作列表
  let bestH = Number.MAX_SAFE_INTEGER;                // 最佳的評價值（先設最大）
  let bestState = null;                               // 最佳的動作
  record.push(state);                                 // 將目前狀態紀錄
  for(let i of actions) {                             // 對所有可執行的動作
    let nextState = move(state, ACTIONS[i]);          // 生成下一步
    if(!have(record, nextState)) {                    // 檢查是否在紀錄中
      if(h(nextState) < bestH) {                      // 評價是目前最佳
        bestState = nextState;                        // 保存最佳動作
      }
    }
  }
  return bestState;                                   // 回傳下一個狀態
};
...
{% endcodeblock %}


坦白說，這個做法很難找到解，  
不過除了可以使不理解規則的讀者大致知道在做什麼外，  
也為了其他方法做了事前準備。

## 死路狀態
這個優先選擇最佳的方法，很有可能落入無路可走的狀態，  
筆者稱之為「死路狀態」，圖 13 為死路狀態的例子。

![圖 13、死路狀態](https://i.imgur.com/kCedGRl.png)

死路狀態容易發生在角落移動時，  
因為往角落移動的時候，分支僅為 2 條，其中一條已經被用掉（上一狀態）
而若此時，另一條狀態也在先前的紀錄中，則程式便會當機。

下面列出一個最終出現死路狀態的例子：

{% codeblock lang:js %}
...
[2, 4, 5, 1, 0, 8, 3, 6, 7]
[2, 4, 5, 0, 1, 8, 3, 6, 7]
[2, 4, 5, 3, 1, 8, 0, 6, 7]
...
[1, 2, 4, 8, 0, 5, 3, 6, 7]
[1, 2, 4, 8, 6, 5, 3, 0, 7] // 注意此處
[1, 2, 4, 8, 6, 5, 0, 3, 7]
...
[1, 2, 4, 0, 8, 6, 3, 7, 5]
[1, 2, 4, 8, 0, 6, 3, 7, 5]
[1, 2, 4, 8, 6, 0, 3, 7, 5]
[1, 2, 4, 8, 6, 5, 3, 7, 0]
...
{% endcodeblock %}

{% note info %}
死路狀態例子中，第一分支是 64 步出現的，而第二分支在 182 步，然後在 183 步進入死路狀態。
{% endnote %}

## 隨機策略
由死路問題引出了另一個想法是：  
「一旦搜尋不到更好且沒記錄過的解，則隨機移動一步。」

畢竟如果只搜索一層，則沒有其他資訊可以用了。

{% codeblock lang:js %}
...
/* 求解盤面 */
let resolve = function(state, h) {                    // 給定狀態與策略
  ...
  /* 貪婪搜索 */
  ...
  if(bestState == null) {                             // 如果進入死路狀態
    let i = Math.floor(Math.random()*actions.length); // 隨機選一步
    bestState = move(state, ACTIONS[actions[i]]);     // 往下一步前進
  }
  return bestState;                                   // 回傳下一個狀態
};
...
{% endcodeblock %}

{% note info %}
隨機是人工智慧的另一個慣用手法，其他例子像是隨機梯度下降（SGD）就用於跳脫局部最佳解。
{% endnote %}

## 演示

{% jsfiddle xz2n3tu1 result,js,html,css dark 100% 430px %}

{% note warning %}
記憶體會隨記錄狀態而膨脹。本演示有記錄狀態的佇列上限，同時這也代表了可能找不到解。
{% endnote %}

# 最優解法
普通的做法需要步數太多了。  
以至於動畫很難等到他找到解答（雖然筆者在寫文章時看到過幾次……）

所以我們需要找一個在「狀態樹」中，較短路徑的解答；  
其中，在狀態樹中，那條最短路徑稱為「最優解」。

{% note info %}
尋找最優解是一個 [NP-hard](https://zh.wikipedia.org/wiki/NP%E5%9B%B0%E9%9A%BE) 問題
{% endnote %}

{% note warning %}
最優解的意思不是速度最快，即使可以找到步數很少的解，但程式可能需要搜索很久。
{% endnote %}

## A*搜索
尋找最優解的過程，與先前的 [貪婪搜索](#貪婪搜索) 類似，  
只不過這次我們會將紀錄過的路徑拿出來使用。

原本的貪婪搜索是「選擇下一步中，最佳的狀態。」
而既然要挑最優解，策略變成「選擇『紀錄狀態』中，最佳的狀態。」

A* 搜索的策略，將原本的策略變成： $f(s) = g(s) + h(s)$  
其中 $h(s)$ 與原本貪婪搜索的函數一樣；而 $g(s)$ 代表這是第幾層的狀態，
狀態樹請參考圖 14。

![圖 14、A*狀態樹](https://i.imgur.com/hqxmhmA.png)

兩個函數互相平衡的結果：

如果 $h(S_{a})$ 很棒，但 $g(S_{a})$ 很大（意味著步數很多）
則先不急著拓展 $S_{a}$ 狀態，找找看淺層（也就是 $g(s)$ 較小）有沒有解。

如果 $g(S_{b})$ 很小，但 $h(S_{b})$ 很糟，  
顯然地，這個 $S_{b}$ 狀態可能距離盤面完成還有很多步，  
則找找看有沒有 $h(s)$ 比較好的狀態。

{% codeblock lang:js %}
...
/* 求解盤面 */
let resolve = function(state, h) {                                          // 給定狀態與策略
  let create = queue.node;                                                  // 建立優先佇列節點的函數
  let record = [];                                                          // 紀錄的陣列
  let next = [];                                                            // 下一步的暫存陣列
  let actions = Object.keys(ACTIONS);                                       // 動作列表
  queue.insert(create(null, state, null, 0, h(state)));                     // 將初始狀態加入優先佇列
  while(!queue.empty()) {                                                   // 優先佇列不為空
    let node = queue.get();                                                 // 從優先佇列取得一個節點
    let state = node.state;                                                 // 取得當前節點的狀態
    record.push(node);                                                      // 將目前狀態紀錄
    if(goal(state)) {                                                       // 已經完成
      return record;                                                        // 將所有狀態返回（建立動畫）
    }
    let recordStates = record.map((node)=>node.state);                      // 取得所有紀錄的狀態
    for (let i of actions) {
      let action = ACTIONS[i];
      let nextStates = move(state, action);                                 // 生成下一步
      if (!have(recordStates, nextStates)) {                                // 檢查是否在紀錄中
        let g = node.g + 1;                                                 // 這步的深度遞增（即下一層）
        if (g >= maxDeep) {                                                 // 防止搜索過深（預防當機）
          break;
        }
        queue.insert(create(node, nextStates, action, g, h(nextStates)));   // 將下一步全部插入優先佇列
      }
    }
  }
  return record;                                                            // 超出深度時直接把紀錄返回
};
...
{% endcodeblock %}

## 優先佇列
A*搜索實作的重點之一是如何實現優先佇列；  
一個簡單的方法是透過插入排序，在適當的位置插入狀態。

{% note success %}
請參考：{% permalink sort %}
{% endnote %}

不過在這裡，我們透過堆積完成優先佇列。

{% codeblock lang:js %}
...
/* 優先佇列 */
let queue = {
  heap: [{f: -1}],

  /* 清除佇列 */
  clear: function() {
    this.heap = [{f: -1}];
  },

  /* 判斷佇列為空 */
  empty: function() {
    return !(this.heap.length > 1);
  },

  /* 重整佇列函數 */
  restore: function(node, leaf) {
    while ((node * 2) <= leaf) {                                            // 樹的倒數二層之內
      let left = 2 * node;                                                  // 取得左子節點
      let right = 2 * node + 1;                                             // 取得右子節點
      if (right > leaf) {                                                   // 超出葉子
        right = left;                                                       // 使左、右節點相等
      }
      let target;                                                           // 暫存節點
      if (this.heap[left].f < this.heap[right].f) {                         // 根據節點的 f(s) 值排序
        target = left;                                                      // 往左子節點去
      }
      else {
        target = right;                                                     // 往右子節點去
      }
      if (this.heap[node].f < this.heap[target].f) {                        // 順序是對的直接跳出
        break;
      }
      this.heap.swap(node, target);                                         // 往下交換節點
      node = target;                                                        // 前往子節點
    }
  },

  /* 插入節點 */
  insert: function(node) {
    this.heap.push(node);                                                   // 先直接塞進駐列
    let i;
    for(i = this.heap.length - 1;                                           // 從葉子開始整理佇列
        this.heap[Math.floor(i / 2)].f > node.f;                            // 根據節點的 f(x) 值處理
        i = Math.floor(i / 2)) {                                            // 往父節點整理
      this.heap[i] = this.heap[Math.floor(i / 2)];                          // 父節點覆寫子節點
    }
    this.heap[i] = node;                                                    // 在正確的位置插入
  },

  /* 取得最小 f(x) 值的節點*/
  get: function() {
    let node = this.heap[1];                                                // 樹根就是最小，取得樹根的值
    this.heap[1] = this.heap[this.heap.length - 1];                         // 把樹根移到葉子的位置上
    this.heap.pop();                                                        // 把樹葉摘除
    this.restore(1, this.heap.length - 1);                                  // 從樹根開始重整堆積
    return node;                                                            // 把最小節點回傳
  },

  /* 節點的結構 */
  node: function(previous, state, action, g, h) {
    return {
      previous: previous,                                                   // 來源的節點
      state: state,                                                         // 狀態陣列
      action: action,                                                       // 實行的動作
      g: g,                                                                 // g(x) 值，紀錄的深度
      f: f                                                                  // f(x) 值（f = g + h）
    };
  }
};
...
{% endcodeblock %}

優先佇列不能取代紀錄陣列，原因是優先佇列會將最小節點丟出去拓展，紀錄會被破壞；  
反之，如果持續保留最小節點，則根本無法拓展狀態樹。

## 演示
與上一個演示不同，這個演示給讀者調整參數。  
參數中最重要的是「Maximum deep」代表可以搜索的深度，  
有時候解答藏在很深的狀態樹中，根據 [wikipedia: 數字推盤遊戲](https://zh.wikipedia.org/wiki/%E6%95%B8%E5%AD%97%E6%8E%A8%E7%9B%A4%E9%81%8A%E6%88%B2) 的內容；  
可以得知 3x3 的解，最深會藏在 31 層以內。

也就是說，當「Maximum deep = 31」時，必有解；  
但至於執行時間可能相當長（瀏覽器可能會當成沒有回應）。

{% jsfiddle p8ghq1ds result,js,html,css dark 100% 530px %}

{% note danger %}
深度很深時，執行速度可能很慢。
{% endnote %}
