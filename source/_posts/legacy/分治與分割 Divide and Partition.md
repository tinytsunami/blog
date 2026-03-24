---
title: 分治與分割 Divide and Partition
permalink: divide-and-partition/
categories: (legacy) algorithm
date: 2021-9-20
mathjax: true
---

這篇算是心得總結，不太會按照傳統演算法的順序來講分治；分治法是演算法中很基礎的東西。

<!-- more -->

有趣的是，我在尚未了解算法前，一直沒有掌握分治法的核心想法，
總覺得就是「系統上地」將複雜的系統切成小塊再拼合，
於是很長一段時間裡，都覺得分治僅適用於系統。

但實際上，分治不只系統可以做，邏輯上也可以。

隱約記得某次演算法課上提過，分割（partition）跟分治（divide and conquer）是不同的。
兩者基本上差在一個合併的步驟。

# 算法分割

算法的分割（partition）是指邏輯上的。用 [LeetCode 75](https://leetcode.com/problems/sort-colors/) 考慮，
題目大意是：「排序數字，數字只有三種，但會重複。」

這個實作起來很容易，隨意一個排序演算法（可能需要稍做修改）都可以處理。

{% note success %}
請參考 {% permalink sort %}
{% endnote %}

看到下面另一句話：
Follow up: Could you come up with a one-pass algorithm using only constant extra space?
這話暗示了類似 Bitonic Sort 之類的東西。

同樣是 $O(n)$ 我們可以從另一個角度來看，
如果我能保證下列三件事，那代表這個數列已經排序完成：
* 所有的 0 都在 1 前面 
* 所有的 1 都在 2 前面
* 所有的 0 都在 2 前面

至於為何不是兩個條件的原因留給讀者自己思考。

邏輯上來說，我只要寫一個函數，讓 $a$ 永遠在 $b$ 之前，然後依序把條件帶入即可：

{% codeblock lang:c %}
void swapWith(int *nums, int numsSize, int a, int b)
{
    int t;
    int i = 0;                                    // 從頭開始
    int j = numsSize - 1;                         // 從尾開始
    while (i < j)
    {
        while(i < numsSize && nums[i] != b) i++;  // i 去找 j 前面的 b
        while(j >= 0       && nums[j] != a) j--;  // j 去找 i 後面的 a
        if (i < j) 
        {
            t = nums[i];                          // 交換兩個數
            nums[i] = nums[j];
            nums[j] = t;
        }
    }
}
{% endcodeblock %}


然後：

{% codeblock lang:c %}
void sortColors(int* nums, int numsSize)
{
    swapWith(nums, numsSize, 0, 1); // 確保所有的 0 在 1 前
    swapWith(nums, numsSize, 0, 2); // 確保所有的 0 在 2 前
    swapWith(nums, numsSize, 1, 2); // 確保所有的 1 在 2 前
}
{% endcodeblock %}

另一個類似的東西：[LeetCode 20](https://leetcode.com/problems/valid-parentheses/)。

# 算法分治

分治法還是以合併排序最經典，但通常的合併階段沒有合併排序那麼單純；

通常第一步是粗估暴力破解的時間，然後提出一個分治法的假設，
如果光是合併就跟暴力破解的複雜度一樣或是接近，那基本上就是做白工。

## 主定理

由於分治多跟遞迴有關，此時主定理（master theorem）就可以幫我們估計時間：

$$
T(n) = aT(\frac{n}{b}) + f(n)
$$

這裡的 $T(n)$ 是大問題的耗時，而 $f(n)$ 是合併的耗時；
然後 $a$ 是子問題數，$\frac{n}{b}$ 是子問題規模。

然後拿 $f(n)$ 跟 $\log_{b}(a)$ 比大小，不嚴謹地表示：

* 如果 $f(n) = O(n^{\log_{b}(a)})$，則 $T(n) = \Theta(n^{\log_{b}(a)})$
* 如果 $f(n) = \Omega(n^{\log_{b}(a)})$，則 $T(n) = \Theta(f(n))$
* 如果 $f(n) = \Theta(n^{\log_{b}(a)}\log^{k}(n))$，而 $k \geq 0$，則 $T(n) = \Theta(n^{\log_{b}(a)}\log^{k+1}(n))$

簡易的白話文如下：

* 如果「各個擊破的時間」比「合併結果的時間」長，那時間是「各個擊破的時間」
* 如果「合併結果的時間」比「各個擊破的時間」長，那時間是「合併結果的時間」
* 如果「合併結果的時間」跟「各個擊破的時間」只差 $\log^{k}$ 時間，那時間是「各個擊破的時間，再多一點 $\log^{k+1}$」

## 無效的分治

考慮一個例子 [LeetCode 327](https://leetcode.com/problems/count-of-range-sum/)。
題目大意是，給定一個序列跟範圍，數一數有多少連續子序列和在這個範圍內。

我們粗估暴力破解，也就是以 $i$ 及 $j$ 找出所有的開頭及結尾，並以 $k$ 從 $i$ 累計到 $j$，
這樣的話，時間複雜度為 $O(n^3)$。顯然，如果我們希望做得更好，那麼至少得少於這個數字。

現在我們提出一個無效分治法的例子：

* 首先將序列均分成兩部分 $[0, \frac{n}{2}]$ 及 $[\frac{n}{2}, n]$ 
* 兩個部分各自計算數量
* 然後讓 $i = [0, \frac{n}{2}] \in Z$ 且 $j = [\frac{n}{2}, n] \in Z$ 為兩部分註標
* 計算合併的結果

以他的 Example 1 為例：

* $[-2, 5, -1]$ 被分成 $[-2]$ 及 $[5, -1]$ 兩塊
* $[-2]$ 有 1 個（從 0 累計到 0，也就是 $-2$）
* $[5, -1]$ 有 1 個（從 1 累計到 1，也就是 $-1$）
* 然後 $i = \\{0\\}$ 且 $j = \\{0, 1\\}$ 計算
* $i = 0, j = 0$ 有 $-2 + 5 = 3$ 不合
* $i = 0, j = 1$ 有 $-2 + 5 + -1 = 2$ 總計 1 個
* 合計共 3 組連續子序列落在 $[-2, 2]$ 中

為什麼這個做法會無效呢？我們用主定理估計看看……

$$
T(n) = 2T(n/2) + f(n)
$$

其中合併時間 $f(n)$ 的粗估如下，首先考量 $i$ 跟 $j$ 兩個註標至多是序列長的一半，即 $\frac{n}{2}$，

那麼，顯然計算從 $i$ 到 $j$ 需要 $k_1$（累計 $i$ 到第一部分結尾） 跟 $k_2$（累計第二部分開頭到 $j$），

而 $k_1$ 及 $k_2$ 的範圍是 $\frac{n}{2}$。

也就是說 $f(n) = O(\frac{n}{2}^3) = O(\frac{1}{8}n^3)$，基本上 $f(n) = O(n^3)$；

主定理條件 $f(n) = \Omega(n^{\log_{2}(2)}) = \Omega(n)$ 有 $T(n) = \Theta(f(n)) = \Theta(n^3)$，顯然跟暴力破解相比，沒有任何好處。

## 分析與最佳化

從主定理可以觀察到一個很重要的事實：反過來說，如果能壓低 $f(n)$ 的值，就能一定程度壓低 $T(n)$。

這裡我們利用「連續」的性質，考慮圖一。如果已經計算出兩個部份的結果，而我們額外計算的，必然是中間藍色（A 部分）及橘色（B 部分）的結果，也就是從中間向兩側延伸的序列。

![圖一、連續子序列合併](https://i.imgur.com/rtMlrEh.png)

如果是這樣，那我們可以直接用暫存空間累計，考慮圖二。

![圖二、轉換成累加序列](https://i.imgur.com/DAvvxOa.png)

這樣一來，我們就可以在 $f(n) = O((\frac{n}{2})^2)$ 內計算完 $i$ 及 $j$，
累計也不需要 $k$，直接將暫存空間相加即可。根據主定理，總複雜度被降到 $T(n) = \Theta(f(n)) = \Theta(n^2)$。

{% codeblock lang:c %}
inline bool in(long x, int lower, int upper)
{
    return x >= lower && x <= upper;
}

int countRangeSum(int* nums, int numsSize, int lower, int upper)
{
    // Boundary
    if (numsSize == 0) 
        return 0;
    
    if (numsSize == 1) 
        return in(nums[0], lower, upper) ? 1 : 0;
    
    // Divide
    int half = numsSize / 2;
    
    int *partA = nums;
    int *partB = nums + half;
    
    int sizeA = half;
    int sizeB = numsSize - half;
    
    int countA = countRangeSum(partA, sizeA, lower, upper);
    int countB = countRangeSum(partB, sizeB, lower, upper);
    
    // Merge
    long *tmp = (long *) malloc(sizeof(long) * numsSize);
    
    tmp[half - 1] = nums[half - 1];
    for(int i = half - 2; i >= 0; i--) 
        tmp[i] = tmp[i + 1] + nums[i];
    
    tmp[half] = nums[half];
    for(int j = half + 1; j < numsSize; j++) 
        tmp[j] = tmp[j - 1] + nums[j];
    
    int countM = 0;
    for(int i = 0; i < sizeA; i++)
        for(int j = sizeA; j < numsSize; j++)
            if (in(tmp[i] + tmp[j], lower, upper))
                countM++;
    
    free(tmp);
    
    return countA + countB + countM;
}
{% endcodeblock %}

{% note warning %}
注意程式碼的 `long` 型別，這裡沒針對範圍處理，使用 `int` 會出錯；
而且這個程式碼還不夠快，會超時（TLE, Time Limit Exceeded）
{% endnote %}

## 進一步最佳化

{% note success %}
接下來的內容是參考 Discuss 中排名最高的解
{% endnote %}

透過壓低 $f(n)$ 所能觸及的下界（如果能辦到），透過主定理也能大概猜到，是 $T(n) = \Theta(n\log(n))$，
這個值出現在 $f(n)$ 被壓到只有 $\Theta(n)$ 時，為 $k=0$ 的 $\log^{k}(n)$ 倍得到。

那麼，如何讓 $f(n)$ 進一步變小呢？

從上面程式可以發現，導致問題是 39 至 42 行，這裡的瓶頸導致 $f(n) = O(n^2)$ 的結果。

就像第一次最佳化一樣，題目不需要子序列的總和。這代表打從一開始就應該用「累加序列」運算，而元素的差就是子序列的總和，見圖三：累加序列 $n$ 中，元素的差（任意 $n_j - n_i$）對應原始序列 $i$ 到 $j$ 的累加。圖中有 $n_6 - n_3 = 10 - 4 = 6$ 為 5、-6、7 三元素的和。

![圖三、累加序列的元素差](https://i.imgur.com/kXm0YJw.png)

然後，一旦用累加序列取代，那麼只要在子問題合併前不打亂，順序就不重要了，可以透過排序處理。換句話說，由於我們合併階段，關心的是「跨越兩個子問題的序列和」，所以個別排序不會出問題。

考慮圖四，其中有 $\text{sorted}_5 - \text{sorted}_1 = 9 - 1 = 7$ 它對應的序列「不為原序列第 1 至第 5 個元素」而是對應「第 0 至第 4 個元素（$n_4 - n_0$）」。只要任意 $\text{sorted}_j - \text{sorted}_i$ 的 $i$ 都落在前半段，而 $j$ 落在後半段，那麼就一定唯一對應原序列的一段序列和，只是對應的註標不同。

![圖四、累加序列排序的意義](https://i.imgur.com/kWFHiAm.png)

同樣地，我們透過切割兩半的方法去處理，假設子問題的區塊都有單調性（即已排序過），看看能不能省略計數的步驟。

* 如果某個元素 $n_i$ 在第一區塊中、而 $n_j$ 在第二區塊，且兩個區塊都有單調性
* 我們遍歷所有的 $n_i$ 並尋找跟 $n_j$ 的關係
* 如果有註標 $k$ 有 $n_k - n_i \leq \text{lower}$ 則對於某個 $n_i$ 來說，元素 $n_k$ 不能再小
* 如果有註標 $j$ 有 $n_j - n_i \geq \text{upper}$ 則對於某個 $n_i$ 來說，元素 $n_j$ 不能再大

然後關鍵是，由於單調性存在，所以遍歷 $i$ 時，值 $n_i$ 只會遞增，也就是說：

* 當 $i$ 遞增，則 $n_i$ 變大
* 所以 $n_k - n_i$ 變小，之前的 $k$ 為首個滿足條件（恰好大於 $\text{lower}$）的註標
* 為了再次滿足條件，$n_k$ 必須變大，使 $n_k - n_i$ 變大
* 故 $k$ 必須遞增

觀察另一個註標 $j$ 也有類似的狀況，只是這次要求找「不滿足」條件的註標：

* 當 $i$ 遞增，則 $n_i$ 變大
* 所以 $n_j - n_i$ 變小，之前的 $j$ 為首個「不滿足」條件（恰好大於 $\text{upper}$）的註標
* 為了再次「不滿足」條件，$n_j$ 必須變大，使 $n_j - n_i$ 變大
* 故 $j$ 必須遞增

計算完成後，兩個註標：

* 註標 $k$ 對應的值 $n_k$ 為滿足 $n_k - n_i \geq \text{lower}$ 的首個註標
* 註標 $j$ 對應的值 $n_j$ 為滿足 $n_j - n_i > \text{upper}$ 的首個註標

則 $j - k$ 為兩個子問題合併情況的解。

剩下最後一個問題，就是子問題的單調性如何確保。實際上，可以直接透過合併排序的合併階段來實現。

稍微重新整理一下剛剛的流程：

* 把整個序列轉換成累加序列，共花 $O(n)$
* 將問題切割成兩個子問題
* 遍歷第一區塊所有的 $n_i$ 計算 $n_j - n_i$ 及 $n_k - n_i$（注意 $j$ 跟 $k$ 只會變大，花費 $O(n)$）
* 每個子問題透過合併階段，花費 $O(n)$ 維持單調性
* 將兩個子問題解加上 $j - k$ 為答案

{% codeblock lang:c %}
int countRangeSum(int* nums, int numsSize, int lower, int upper)
{
    // 累加序列
    int sumsSize = numsSize;
    long *sums = (long *) malloc(sizeof(long) * sumsSize);

    // 建立累加序列
    sums[0] = nums[0];
    for(int i = 1; i < sumsSize; i++)
        sums[i] = sums[i - 1] + nums[i];

    // 遞迴解區間 [0, sumsSize)
    return f(sums, 0, sumsSize, lower, upper);
}

int f(long *sums, int start, int end, int lower, int upper)
{
    // 單個元素則直接判斷範圍
    if (end - start <= 1) {
        return sums[start] >= lower && sums[start] <= upper ? 1 : 0;
    }

    // 將問題切割成子問題
    int mid = (end + start) / 2;
    int count = f(sums, start, mid, lower, upper) // 子問題 A
              + f(sums, mid, end, lower, upper);  // 子問題 B

    // 合併階段的暫存序列
    long *tmps = (long *) malloc(sizeof(long) * (end - start));

    // 用於計算的註標群
    int k = mid; // 尋找累加序列的下界（首個符合條件的註標）
    int j = mid; // 尋找累加序列的上界（首個不符合條件的註標）

    // 用於合併的註標群
    int t = mid; // 子問題 B 的元素註標
    int r = 0;   // 合併暫存序列的註標

    // 遍歷子問題 A 的累加序列
    for(int i = start; i < mid; i++)
    {
        // 計算數量
        while(k < end && sums[k] - sums[i] <  lower) k++; // 尋找下界
        while(j < end && sums[j] - sums[i] <= upper) j++; // 尋找上界
        count += j - k;                                   // 計算數量

        // 合併階段
        // 跟「子問題 A 首個的元素」比較
        // 如果「子問題 B 的元素」比較小，則放進合併序列中
        while(t < end && sums[t] < sums[i])
            tmps[r++] = sums[t++];
        
        // 跳出迴圈後，保證子問題 A 首個元素比較小，直接放進序列中
        tmps[r++] = sums[i];
    }

    // 把合併序列剩下的複製進原序列
    for(int i = 0; i < r; i++)
        sums[start + i] = tmps[i];

    // 釋放掉合併暫存序列
    free(tmps);

    // 回傳答案
    return count;
}
{% endcodeblock %}
