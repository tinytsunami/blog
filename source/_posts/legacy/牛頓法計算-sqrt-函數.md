---
title: 牛頓法計算 sqrt 函數
permalink: newton-method-sqrt/
categories: legacy-algorithm
date: 2021-10-03
mathjax: true
---

這篇最早是 Evernote 的筆記，整理之後就放到部落格這裡來了；
忘記最早是為了要做什麼，總之就是利用牛頓法計算開根號函數的作法。

<!-- more -->

# 函數化

當要估計 $\text{sqrt}(a) = \sqrt{a}$ 時，
可以先令 $x_k$  為一近似解，即 $x_k \approx \sqrt{a}$。

接著整理：

$x^{2}_{k} \approx a$ 

$x^{2}_{k} - a \approx 0$

將 $x^{2}_{k} - a$ 視為一函數 $f(p) = p^{2} - a$

令 $p = x_{k}$ 就有 $f(x_{k}) = x_{k}^{2} - a \approx 0$

則 $x_k$ 恰為函數近似解 $f(x_k) \approx 0$ 之值。

# 泰勒展開

對函數 $f(p)$ 在 $x_{k}$ 處取泰勒展開（Taylor series）有：

$f(p) = \frac{f(x_{k})}{0!}(p-x_{k})^0  + \frac{f'(x_{k})}{1!}(p-x_{k})^1 + R(p)$

整理後得：

$f(p) = f(x_{k}) + f'(x_{k})(p-x_{k}) + R(p)$

其中 $R(p)$ 為餘項。

# 迭代關係

回憶最早的假設 $x_k \approx \sqrt{a}$；

我們現在考慮迭代法，即 $x_{k+1}$ 比 $x_{k}$ 的答案更精準：

$x_{k+1} \approx \sqrt{a}$

取 $p = x_{k+1}$ 帶入泰勒展開：

$f(x_{k+1}) = f(x_{k}) + f'(x_{k})(x_{k+1}-x_{k}) + R(x_{k+1})$

由於是近似解，故捨去餘項 $R(p)$ 有：

$f(x_{k+1}) \approx f(x_{k}) + f'(x_{k})(x_{k+1}-x_{k})$

這兩者都可以視做原函數的近似，即 $f(x_k) \approx f(x_{k+1})$ 只是 $f(x_{k+1})$ 更精確。

{% note warning %}
注意對象目前是 $f(p) = p^{2} - a$ 而 $f(p) \neq \sqrt{p}$
{% endnote %}

之前的函數 $f(p) = p^{2} - a$；

我們現在帶入更精確的 $x_{k+1} \approx \sqrt{a}$ 於是：

$f(x_{k+1}) = x_{k+1}^{2} - a \approx 0$

同時，展開式：

$f(x_{k+1}) \approx f(x_{k}) + f'(x_{k})(x_{k+1}-x_{k})$

兩式串接可得：

$f(x_{k}) + f'(x_{k})(x_{k+1}-x_{k}) \approx 0$

$f'(x_{k})(x_{k+1}-x_{k}) \approx -f(x_{k})$

$x_{k+1}-x_{k} \approx \frac{-f(x_{k})}{f'(x_{k})}$

$x_{k+1} \approx \frac{-f(x_{k})}{f'(x_{k})} + x_{k}$

$x_{k+1} \approx x_{k} - \frac{f(x_{k})}{f'(x_{k})}$

我們現在找到近似關係了，一旦我們確定 $x_{k}$ 那就可以計算右項來推得 $x_{k+1}$。

# 程式解

函數 $f(x_{k}) = x_k^2 - a$

一階微分函數 $f'(x_{k}) = 2 \cdot x_k$

{% note info %}
這裡的 $a$ 為一常數，也是確定的輸入參數值 $\text{sqrt}(a) = \sqrt{a}$
{% endnote %}

整個合併整理：

$x_{k+1} \approx x_{k} - \frac{\displaystyle x_k^2 - a}{\displaystyle 2 x_k}$

$x_{k+1} \approx \frac{\displaystyle 2 x_{k}^2}{\displaystyle 2 x_k} - \frac{\displaystyle x_k^2 - a}{\displaystyle 2 x_k}$

$x_{k+1} \approx \frac{\displaystyle 2 x_{k}^2 - (x_k^2 - a)}{\displaystyle 2 x_k}$

$x_{k+1} \approx \frac{\displaystyle 2 x_{k}^2 - x_k^2 + a}{\displaystyle 2 x_k}$

$x_{k+1} \approx \frac{\displaystyle x_{k}^2 + a}{\displaystyle 2 x_k}$

$x_{k+1} \approx \frac{\displaystyle x_{k}}{\displaystyle 2} + \frac{\displaystyle a}{\displaystyle 2 x_k}$

$x_{k+1} \approx \frac{\displaystyle 1}{\displaystyle 2} \left( \displaystyle x_{k} + \frac{\displaystyle a}{\displaystyle x_k} \right)$

所以說 $\text{sqrt}(a)$ 的值為 $x_{k+1} \approx \frac{1}{2} \left(x_{k} + \frac{a}{x_k} \right)$

只要先隨便令一個 $x_k$ 為任意值，就透過計算 $x_{k+1}$ 得到更精確地解：

{% codeblock lang:js %}
function sqrt(a)
{
  let epsilon = 1e-6;        // 迭代到精準度 1e-6
  let x0;                    // x[k]
  let x1;                    // x[k+1]
  x1 = a;                    // 隨便猜一個數
  do{
    x0 = x1;                 // 讓 k 遞增（x[k] 變成 x[k+1]）
    x1 = (x0 + a/x0) / 2;    // 公式 x[k+1] = (1/2)(x[k] + a/x[k])
  }while(x0 - x1 > epsilon); // 不夠精準則繼續
  return x1;                 // 答案在 x[k+1]
}
{% endcodeblock %}

{% note info %}
程式上的一個細節是，初始猜的值跟終止條件有關。

若初始條件 $x_{k} > \sqrt a$ 則收斂時 $x_{k+1}$ 會比 $x_{k}$ 更小；
反之，初始條件 $x_{k} < \sqrt a$ 則收斂時 $x_{k+1}$ 會比 $x_{k}$ 更大。

考慮 $a \in N$ 則必有 $a \geq \sqrt a$，
則初始條件給 $x_{k} = a$ 則必向更小的方向收斂，終止條件就可以避免使用另外的判斷式。
{% endnote %}

# 勘誤與致謝

* 2022/09/14 感謝 JyhChenHwang 指出程式解段落中的錯誤。
