---
title: 先驗算法 Apriori Algorithm
permalink: apriori-algorithm/
categories: legacy-algorithm
date: 2017-05-18
mathjax: true
---
資料探勘的文章，多半是我大學資料探勘課程的筆記之類的東西，  
因為覺得內容有點雜，不是很難，就是很多東西。

所以想開個文章逐一紀錄。以後找資料也方便一點這樣。  
不過課程吸收的感覺對這個領域把握不高，有錯誤還請見諒就是了。
<!-- more -->

# 關聯規則  

關聯規則是類似這樣的一個問題：  
{% note info %}
如果我的客戶買了某個商品，那麼要再推薦什麼商品呢？
{% endnote %}

想當然的，推薦的商品一定是那個「很有可能被加購的」商品。

那麼，我要怎知道客戶有可能加購什麼呢？  
事實上，我們大概可以猜到一些事情。  

* 與「客戶的屬性」相關
  * 客戶是學生，而他剛剛買了筆，是不是折扣的話會買更多？
  * 客戶是廚師的話呢？
* 與「外在的屬性」相關
  * 天氣炎熱的話，買了午餐再買飲料的關聯，是不是會被加強？
  * 天氣涼爽的話呢？
* 與「先前購買的商品」相關  
  * 買了鐵鎚，是不是會繼續選購釘子呢？
  * 推薦買了鐵鎚的人麵包如何？

而資料探勘當中，有一些方法，可以去得到這些關聯規則，

對於商業行為來說，資料探勘的重點就是找到這些隱含在資料中的「商機」。  
然而這三種可能，我們通常關注第三種，也就是「先前購買的商品」相關的部份。

至於為什麼呢？看下面的例子，然後想想看：  

* 某個男人在賣場中買了一個麵包，所以男人的職業是？
* 早上天氣還很熱，下午開始轉涼了。

# 支持率與可信度  
在開始進行算法之前，得先介紹一下：

支持率（Support）以及可信度（Confidence）這兩個參數。  

* 支持率：出現的概率。
* 可信度：條件機率，當商品出現時，出現另一件商品的概率。

下面做一些描述：  

$Support(A) = P(A)$
$Confidence(A \Rightarrow B) = P(B \mid A)$  

參數的作用，從這裡可以發現一些指標：

{% note info %}
支持率代表一條規則的重要程度。
{% endnote %}

$Confidence(A \Rightarrow B) = 99%, Support({A, B}) = 1%$

雖然買了 A 商品，幾乎也會買 B 商品，但出現這種買法相當罕見。  
如果很少人會這樣買，是不是就沒有商機呢？

{% note info %}
可信度代表一條規則的準確程度
{% endnote %}

{% note info %}
想想看，有沒有可能出現可信度很高、但支持率很低的情況？
{% endnote %}

$Confidence(A \Rightarrow B) = P(B \mid A) = \frac{P(A \cap B)}{P(A)} = \frac{Support({A, B})}{P(A)}$

# 先驗算法  
先驗算法（Apriori Algorithm）是資料探勘中的一種基本方法，
讓我們可以從資料中取得這些關聯規則。

實際操作的說明：  

* 設定 $\text{minimum_support}$
* 計算每種商品的 $\text{support}$
* 刪去 $\text{support}$ 小於 $\text{minimum_support}$ 的商品
* 組合剩下的商品
* 重複 2 ～ 4 步，直到無法組合或滿足其他停止條件
* 計算所有的 $\text{confidence}$

公式化：  

* $\alpha = \text{Minimum Support}, X_{0} = \text{All Objects}$
* $X_{p+1} = \{ x_{i} \cup x_{j} : support(x_{i}) > \alpha \land support(x_{j}) > \alpha , x_{i} \neq x_{j}, \forall x_{i}, x_{j} \in X_{p} \}$
* $\text{Repeat step.2, until } X_{n} = \varnothing$

大致上就這個樣子，直到 $X$ 無法組合為止，而這時的最長規則，長度為 $n-1$ 單位，  
很多時候，由於要人工篩選規則，所以所有出現過的 $X$ 都要考慮。

#  演示 

{% jsfiddle okfyq5ub result,js,html,css dark 100% 400px %}
