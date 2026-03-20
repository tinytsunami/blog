---
title: 高斯喬登消去法 Gauss-Jordan Elimination
permalink: Gauss-Jordan-elimination/
categories: (legacy) math
date: 2018-05-21 21:09:49
mathjax: false
---
這篇文章是某同學跟我說消去法不好寫，所以才出現的，  
原本當初在上線性代數時，其實也有這樣的感覺，覺得消去法的細節有點多。

想清楚之後就覺得消去法本身不會很困難，精度的維持才是最艱難之處。
<!-- more -->

# 矩陣運算
消去法有一些基本運算，包含：

1. 交換 A、B 兩個列
2. 將一列 A 加到另一列 B
3. 將一列 A 乘上一個倍數 c

此外，建立「增廣矩陣」也要處理。

{% note warning %}
注意這裡使用「直行橫列」意即列（Row）與行（Column）
{% endnote %}

## 增廣矩陣
輸入係數矩陣 M 與列向量 b 建立增廣矩陣 A。

{% codeblock lang:js %}
/* 取得增廣矩陣
 * 輸入係數矩陣 M 及列向量 b 組合
 * 回傳增廣矩陣 A
 */
let augmented = function(M, b) {
  let A = Array.from(M, function(v, k) {  // 建立增廣矩陣 A
    return v.concat(b[k]);                // 將 M 的每一列都加上 b 的列
  });
  return A;                               // 回傳增廣矩陣 A
};
{% endcodeblock %}

為了某些時候需要，  
也可以撰寫將增廣矩陣 A 分解成係數矩陣 M 與列向量 b 的函數。

{% codeblock lang:js %}
/* 分解增廣矩陣
 * 輸入增廣矩陣 A 分解
 * 回傳為包含係數矩陣 M 及列向量 b 的物件
 */
let unaugmented = function(A) {
  return {                                // 回傳包含 M 及 b 的物件
    M: Array.from(A, function(r) {        // 從增廣矩陣 A 建立
      return r.filter(function(v, i) {    // 過濾掉 A 每一列的最後一個元素則為係數矩陣 M
        return i != (r.length - 1);
      });
    }),
    b: Array.from(A, function(r) {        // 從增廣矩陣 A 建立
      return r.filter(function(v, i) {    // 過濾掉非 A 每一列的最後一個元素則為列向量 b
        return i == (r.length - 1);
      });
    })
  };
};
{% endcodeblock %}

## 兩列交換
交換兩個列，多用於軸（pivot）為零的情況。

{% note info %}
「樞」為 pivot 而「軸」為 axis；
不過這裡的軸是指 pivot 才對，鑒於溝通上不太使用「樞」故此用「軸」稱呼。
{% endnote %}

{% codeblock lang:js %}
/* 兩列交換
 * 輸入矩陣 A 交換 a 及 b 兩列
 */
let exchange = function(A, a, b) {
  let T = Array.from(A[a]);               // 複製第 a 列
  A[a] = A[b];                            // 令第 a 列為第 b 列
  A[b] = T;                               // 令第 b 列為複製的 a 列
};
{% endcodeblock %}

## 兩列加法
將一列乘上一個倍數加到另一列上。

{% codeblock lang:js %}
/* 兩列加法
 * 輸入矩陣 A 將第 a 列乘 scalar 加到第 b 列
 */
let addition = function(A, a, b, scalar) {
  A[b] = A[b].map(function(v, k) {        // 使第 b 列變化
    return v + A[a][k] * scalar;          // 將第 a 列乘 scalar 加上
  });
};
{% endcodeblock %}

## 單列縮放
將一列乘上一個常數。

{% codeblock lang:js %}
/* 單列縮放
 * 輸入矩陣 A 將第 a 列乘上 scalar
 */
let scalar = function(A, a, scalar) {
  A[a] = A[a].map(function(v, k) {        // 將第 a 列變化
    return v * scalar;                    // 將元素乘上 scalar
  });
};
{% endcodeblock %}

# 消去法
通過剛剛寫的副程式，可以使消去法變得更容易完成，  
但考慮到一些情形，必須要在撰寫一些函數。

## 取得軸
取得矩陣 A 的從第 k 列開始的軸。  
考慮到如果當前軸那個位置的元素為零，這個函數可以幫我們找到可以交換的列。

{% codeblock lang:js %}
/* 取得軸
 * 輸入矩陣 A 及第 k 列
 * 建立一個 row(A) - k 長度的陣列
 * 陣列元素值 e 為第 k 列開始第 e 行元素不為零
 */
let findPivots = function(A, k) {
  return Array.from({
    length: (A.length - k)                        // 建立長度為 row(A) - k 的陣列
  }, function(e, i) {
    for (let j = 0; j < A[k + i].length; j++) {   // 遍歷 A 第 k + i 列的每個元素
      if (A[k + i][j] != 0) {                     // 如果 A 第 k + i 列的第 j 個元素不為零
        return j;                                 // 返回 j
      }
    }
    return A[0].length;                           // 第 k + i 列的所有元素都為零返回行的數量
  });
};
{% endcodeblock %}

這個函數是之後消去法的關鍵，也是最難理解的部分。  
為幫助理解可以看一個例子：

{% codeblock lang:js %}
let A = [[ 0, -2,  4,  7],
         [ 0,  0,  5,  8],
         [ 0,  0,  0,  0],
         [ 3, -3,  6,  9]]

findPivots(A, 0);   // [1, 2, 4, 0]
findPivots(A, 1);   // [4, 2, 0]
findPivots(A, 2);   // [4, 0]
findPivots(A, 3);   // [0]
{% endcodeblock %}

之所以有這個函數，考慮如果第 k 列的軸為零，  
只要透過這個函數取得從第 k 列開始的軸，找到陣列中最小值交換就好。

考慮剛才的例子：

{% codeblock lang:js %}
[[ 0, -2,  4,  7],
 [ 0,  0,  5,  8],
 [ 0,  0,  0,  0],
 [ 3, -3,  6,  9]]
{% endcodeblock %}

其中第 0 列的軸位置為零，故計算第 0 列開始的軸位置為 [1, 2, 4, 0]
最小值為 0 註標為 3 則交換第 0 列與第 3 列。

{% codeblock lang:js %}
[[ 3, -3,  6,  9],
 [ 0,  0,  5,  8],
 [ 0,  0,  0,  0],
 [ 0, -2,  4,  7]]
{% endcodeblock %}

同樣的，再換一次為：

{% codeblock lang:js %}
[[ 3, -3,  6,  9],
 [ 0, -2,  4,  7],
 [ 0,  0,  0,  0],
 [ 0,  0,  5,  8]]
{% endcodeblock %}

## 最小值註標
取得最小值註標是個簡單的功能。

{% codeblock lang:js %}
/* 取得陣列最小值的註標
 * 輸入陣列 arr 最小值為 arr[i] 回傳 i
 */
let minIndex = function(arr) {
  let index = 0;                          // 假設最小值註標為 0
  for(let i = 1; i < arr.length; i++) {   // 遍歷陣列
    if(arr[i] < arr[index]) {             // 如果值更小
      index = i;                          // 改變最小值註標
    }
  }
  return index;                           // 回傳最小值註標
};
{% endcodeblock %}

## 高斯部分
消去法的這個部分主要是將下三角的元素變為零，  
即使矩陣 A 變成上三角矩陣。

{% codeblock lang:js %}
/* 高斯消去法
 * 輸入增廣矩陣 A 使之變成上三角矩陣
 */
let Gauss = function(A) {
  let m = A.length;                               // A 有 m 個列
  let n = A[0].length;                            // A 有 n 個行
  let r = Math.min(m, n);                         // A 最大會有 r 個軸
  for (let i = 0; i < m; i++) {                   // 對第 i 個列操作
    let pivots = findPivots(A, i);                // 計算從第 i 列開始的軸位置
    let p = {                                     // 建立目前軸 p 的位置
      i: 0,
      j: 0
    };
    p.i = minIndex(pivots);                       // 取得最小軸位置的列
    p.j = pivots[p.i];                            // 取得最小軸位置
    if (p.j == n) {                               // p.j 為 n 即整列是零
      return;                                     // 已經不能再做下去了
    }
    exchange(A, i, i + p.i);                      // 交換最小軸位置的列到本列
    scalar(A, i, 1 / A[i][p.j]);                  // 縮放本列的大小使軸為 1
    for (let j = i + 1; j < m; j++) {             // 遍歷軸下面的列
      addition(A, i, j, -A[j][p.j] / A[i][p.j]);  // 將其變為 0
    }
  }
};
{% endcodeblock %}

## 喬登部分
消去法的這個部分是透過代入法，  
使矩陣 A 只有對角線上的元素有值（且為 1）。

{% codeblock lang:js %}
/* 代入法
 * 重複代入使軸上方元素為零
 */
let Jordan = function(A) {
  let m = A.length;                               // A 有 m 個列
  let n = A[0].length;                            // A 有 n 個行
  for (let i = m - 1; i >= 0; i--) {              // 對第 i 個列操作
    let pivots = findPivots(A, i);                // 計算從第 i 列開始的軸位置
    let p = {                                     // 建立目前軸 p 的位置
      i: null,
      j: pivots[0]
    };
    if(p.j == n) {                                // p.j 為 n 即整列是零
      continue;                                   // 跳過這個列
    }
    for (let j = i - 1; j >= 0; j--) {            // 遍歷軸上面的列
      addition(A, i, j, -A[j][p.j] / A[i][p.j]);  // 將其變為 0
    }
  }
};
{% endcodeblock %}

# 除錯技巧
這裡整理一些除錯的技巧。

## 自動測資
人工設定測資可能也可以完成，  
但如果能自動生成測資的話，就可以做比較大量的測試。

{% codeblock lang:js %}
/* 產生測資矩陣
 * 建立大小為 (m, n) 的矩陣 M 及大小為 (m, 1) 的列向量 b
 * 組合出元素值 [a, b] 整數的增廣矩陣 A
 * 其中 m 與 n 為 [4, 7]
 */
let generateMatrix = function(a, b) {
  let v = function() {                                // 取得述職的函數
    return Math.floor(Math.random() * (b - a)) + a;   // 數值為 [a, b]
  };
  let m = Math.floor(Math.random() * 3) + 4;          // 取得 m = [4, 7]
  let n = Math.floor(Math.random() * 3) + 4;          // 取得 n = [4, 7]
  let M = Array.from({length: m}, function() {        // 建立矩陣 M
    return Array.from({length: n}, function() {
      return v();
    });
  });
  let b = Array.from({length: m}, function() {        // 建立列向量 b
    return Array.from({length: 1}, function() {
      return v();
    });
  });
  A = augmented(M, b);                                // 組合出增廣矩陣 A
  if(Math.random() > 0.5) {                           // 是否建立空列
    scalar(A, Math.floor(Math.random() * m), 0);      // 使隨機一列元素為 0
  }
  if(Math.random() > 0.5) {                           // 是否建立相同列
    let z = Math.floor(Math.random() * m);            // 使隨機一列 z 等於另一列
    scalar(A, z, 0);                                  // 先使 z 列變成 0
    addition(A, Math.floor(Math.random() * m), z, 1); // 隨機找一列加到 z 列
  }
  return A;
};
{% endcodeblock %}

## 印出矩陣
陣列在 JavaScript 中屬於參考的變數，  
意思是，如果寫的方法為：

{% codeblock lang:js %}
...
console.log(A);
/* 更改 A 矩陣（陣列） */
console.log(A);
...
{% endcodeblock %}

則兩個輸出會完全一樣。  
為了正常印出矩陣，可以建立矩陣的副本：

{% codeblock lang:js %}
...
console.log(A.slice());
/* 更改 A 矩陣（陣列） */
console.log(A.slice());
...
{% endcodeblock %}

# 演示

{% jsfiddle 6j4ru96n result,js,html,css dark 100% 460px %}
