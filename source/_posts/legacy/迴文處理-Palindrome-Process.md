---
title: 迴文處理 Palindrome Process
permalink: palindrome-process/
categories: legacy-algorithm
date: 2017-11-05
mathjax: true
---
之前在弄演算法題目的時候，曾經遇過迴文類的問題，  
當時並沒有很了解問題的本質跟相關算法，所以都是窮舉。然而有些超時、有些則否。

後來的某一天又碰到這類的問題，誘發我去把相關的算法看了幾遍。這篇文章算是從中衍伸的筆記。
<!-- more -->

# 子字串與子序列
迴文問題通常不會以簡單的形式出現，  
通常來說，大致上會類似「最長迴文子字串」、「最長迴文子序列」的形式出現，  
正因如此，先理解兩者的差異是重要的。

子字串跟子序列大致上有這樣的關係：

* 子字串、子序列都是依照閱讀的順序擷取（以英文來說，橫書是由左至右）
* 子字串要求資料連續、子序列不要求

從這個角度來看，可以發現子字串的限制較子序列嚴格。

更進一步說，只要是子字串，就一定會是子序列，
而某筆資料所有的子字串集合，會是其資料子序列集合的子集合。

我們來看個例子：「TheQuickBrownFoxJumpsOverTheLazyDog」

| 字串 | 位置 | 類型 |
|:---- |:---- |:----:|
| QuickBrown | The`QuickBrown`FoxJumpsOverTheLazyDog | 子字串、也是子序列 |
| LazyDog | TheQuickBrownFoxJumpsOverThe`LazyDog` | 子字串、也是子序列 |
| QuickFox | The`Quick`Brown`Fox`JumpsOverTheLazyDog | 子序列 |
| BrownDog | TheQuick`Brown`FoxJumpsOverTheLazy`Dog` | 子序列 |
| LazyFox | TheQuickBrownFoxJumpsOverTheLazyDog | 不是子字串或子序列 |

{% note info %}
範例中的「TheQuickBrownFoxJumpsOverTheLazyDog」是全字母句（Pangram）使用了所有英文字母。
{% endnote %}

{% note warning %}
演示或本文撰寫完畢時，筆者發現有一處容易混淆：
「LPS」代表是「Longest Palindrome Substrings/Subsequences」；
其中「S」並無指定為字串或序列，亦即最長子字串或子序列都有可能使用「LPS」做縮寫。
請根據段落判斷「LPS」的意義。
{% endnote %}

# 迴文子字串：窮舉
因為子字串的限制較為嚴格，我們先從子字串下手。
對於迴文子字串的窮舉法邏輯很簡單：「找到所有的子字串，然後檢驗是否迴文。」

{% codeblock lang:cpp %}
...
// 檢驗是否迴文
bool checkPalindrome(string text)
{
    int half = text.length() / 2;            // 取長度的一半
    for (int i =0; i < half; i++)            // 註標 i 對應字串前半
    {
        int j = text.length() - i -1;        // 註標 j 對應字串後半
        if(text[i] != text[j]) return false; // 如果不對則直接返回
    }
    return true;                             // 確實屬於迴文
}
...
{% endcodeblock %}

迴文檢測的邏輯不難，不過還是解釋一下。

字串能夠分成兩種：偶數字串、奇數字串。  
如果是偶數時，長度除以二，會剛好是一半；然而是奇數的話，除以二會是一半捨去小數。
    
簡單的例子：

當字串為 `abcd` 時，長度為 $4$ 則一半為 $\lfloor 4 \rfloor = 2$ 這樣的話，<br/>
註標 `i = 0, 1` 而同時註標 `j = 3, 2` 形成依序比對字串前後兩邊的字元是否相等。

如果字串為 `abcba` 時，長度為 $5$ 則  $\lfloor 5 \rfloor = 2$ 這樣的話，<br/>
註標 `i = 0, 1` 而同時 註標 `j = 4, 3` 可以發現剛好奇數中間的字元並不需要比對。

接著，我們需要得到所有的子字串，在 `std::string` 中有 `substr` 函數可以使用。  
那要取得所有的子字串，則需要註標 $a$ 表示子字串開頭的位置，而註標 $b$ 表示結束的位置，  
對於所有的 $a$ 及 $b$ 有 $a \leq b$ 的關係：

{% codeblock lang:cpp %}
...
for (int a = 0; a < str.length(); a++)        // 子字串開始位置的註標
    for (int b = a; b < str.length(); b++)    // 子字串結束位置的註標
    {
        tmp = str.substr(a, (b - a + 1));     // 從開始位置，取對應長度
        if(checkPalindrome(tmp)) ...;         // 檢查迴文，並處理
    }
...
{% endcodeblock %}

這樣我們問題就解決了。

不過仔細想想，我們其實並不需要另外合成字串，
直接在原字串比對就好，我們修正檢測：

{% codeblock lang:cpp %}
...
// 迴文檢測（使用參考）
// 傳入字串的參考、開始位置、結束位置
bool checkPalindrome(string &text, int a, int b)
{
    int len = b - a + 1;                     // 取得子字串長度
    int half = len / 2;                      // 取的一半的長度
    for (int i = 0; i < half; i++)           // 註標 i 表示取前後多少字元
        if(text[a + i] != text[b - i])       // 從前面取 i 個及從後面取 i 個比對
            return false;                    // 如果不符則傳回
    return true;                             // 確實為迴文
}
...
{% endcodeblock %}

直接傳入參考以避免生成一堆子字串，  
利用母字串的註標 $a$ 與 $b$ 取得子字串的長度運算即可。

## 複雜度
在分析之前，我們從例子著手。
比方說，當原字串為 `abc` 其長度為 $3$ 則存在子字串：

substr(`abc`) = {`空字串`, `a`, `ab`, `abc`, `b`, `bc`, `c`}

{% note warning %}
其實包含空字串在內也是子字串；只是我們不需要，所以沒有實做出來。
{% endnote %}

可以發現，子字串的數量為 $3 + 2 + 1 + 1 = 7$ 個，如果不含空字串則是 $3 + 2 + 1 = 6$ 個，  
於是我們大概可以假設如下：

長度為 $n$ 的原字串，不含空字串的話，有 $\sum\limits_{x=1}^n x = \frac{1}{2}(1+n)n$ 個子字串。

假設只是從觀察中發現，實際推算看看是否正確：

設原字串的長度為 $n$ 的話，  
註標 $a$ 的範圍在 $[0, n-1]$ 而註標 $b$ 的範圍在 $[a, n-1]$

因為子字串的數量就是所有註標匹配的數量：

$\sum\limits_{a = 0}^{n - 1} \sum\limits_{b = a}^{n - 1} 1$

後面的取和直接算有幾個，得到：

$= \sum\limits_{a = 0}^{n - 1} [(n - 1) - a + 1] = \sum\limits_{a = 0}^{n - 1} (n - a) = \sum\limits_{a = 0}^{n - 1} n - \sum\limits_{a = 0}^{n - 1} a$

{% raw %}
$= n \sum\limits_{a = 0}^{n - 1} 1 - \frac{1}{2}[(n - 1) + 0][(n - 1) - 0 + 1]$
{% endraw %}

$= n^{2} - \frac{1}{2} (n - 1)n = n^{2} - \frac{1}{2} (n^2 - n)$

$= n^{2} - \frac{1}{2} n^2 + \frac{1}{2} n = \frac{1}{2} n^2 + \frac{1}{2} n$

$= \frac{1}{2} (n^2 + n) = \frac{1}{2} (n + 1)n$

看來我們的推測試是正確的。

試想檢測一個字串是否為迴文，需要掃描一半的字串，  
把原本取和裡面的 $1$ 改成子字串長度的一半也就是 $\frac{1}{2} (b - a + 1)$ 的話：

$\sum\limits_{a = 0}^{n - 1} \sum\limits_{b = a}^{n - 1} \frac{1}{2} (b - a + 1) = \frac{1}{2} \sum\limits_{a = 0}^{n - 1} \sum\limits_{b = a}^{n - 1} (b - a + 1)$

$= \frac{1}{2} \sum\limits_{a = 0}^{n - 1} ( \sum\limits_{b = a}^{n - 1} b - \sum\limits_{b = a}^{n - 1} a + \sum\limits_{b = a}^{n - 1} 1 )$

{% raw %}
$= \frac{1}{2} \sum\limits_{a = 0}^{n - 1} \{ \frac{1}{2}[(n - 1) + a](n - a) - a(n - a) + (n - a) \}$
{% endraw %}

$= \frac{1}{2} \sum\limits_{a = 0}^{n - 1} [ \frac{1}{2}(n + a -1)(n - a) - an + a^{2} + n - a ]$

$= \frac{1}{2} \sum\limits_{a = 0}^{n - 1} [ \frac{1}{2}(n^{2} - an + an - a^{2} - n + a) - an + a^{2} + n - a ]$

$= \frac{1}{2} \sum\limits_{a = 0}^{n - 1} [ \frac{1}{2} n^{2} + \frac{1}{2} a^{2} + \frac{1}{2} n - \frac{1}{2} a - an ]$

$= \frac{1}{4} \sum\limits_{a = 0}^{n - 1} ( n^{2} + a^{2} + n - a ) - \frac{1}{2} n\sum\limits_{a = 0}^{n - 1} a$

$= \frac{1}{4} [ \sum\limits_{a = 0}^{n - 1} n^{2} + \sum\limits_{a = 0}^{n - 1} a^{2} +  \sum\limits_{a = 0}^{n - 1} n - \sum\limits_{a = 0}^{n - 1} a ] - \frac{1}{4} n^{2}(n - 1) $

$= \frac{1}{4} [ n^{2} \sum\limits_{a = 0}^{n - 1} 1 + \sum\limits_{a = 0}^{n - 1} a^{2} +  n \sum\limits_{a = 0}^{n - 1} 1 - \frac{1}{2} n (n - 1) ] - \frac{1}{4} n^{2}(n - 1) $

$= \frac{1}{4} [ n^{3} + \sum\limits_{a = 0}^{n - 1} a^{2} +  n^{2} - \frac{1}{2} n (n - 1) ] - \frac{1}{4} n^{2}(n - 1) $

把中間 $\sum\limits_{a = 0}^{n - 1} a^{2}$ 項拿一個 $0^{2}$ 出來，  
然後多加 $n^{2}$ 進去取和，後面再扣掉：

$\sum\limits_{a = 0}^{n - 1} a^{2} = 0^{2} + \sum\limits_{a = 1}^{n} a^{2} - n^{2} = \sum\limits_{a = 1}^{n} a^{2} - n^{2}$

利用公式：$\sum\limits_{k = 1}^{n} k^{2} = \frac{1}{6} n(n+1)(2n+1)$

$= \frac{1}{4} [ n^{3} + \frac{1}{6}n(n + 1)(2n + 1) - n^{2} +  n^{2} - \frac{1}{2} n (n - 1) ] - \frac{1}{4} n^{2}(n - 1) $

$= \frac{1}{4} [ n^{3} + \frac{1}{6}n(n + 1)(2n + 1) - \frac{1}{2} n(n - 1) ] - \frac{1}{4} n^{2}(n - 1) $

$= \frac{1}{4} n^{3} + \frac{1}{24}(n^{2} + n)(2n + 1) - \frac{1}{8} n(n - 1)  - \frac{1}{4} n^{2}(n - 1) $

$= \frac{1}{4} n^{3} + \frac{1}{24}(2n^{3} + n^{2} + 2n^{2} + n) - \frac{1}{8} n^{2} + \frac{1}{8} n  - \frac{1}{4} n^{3} + \frac{1}{4} n^{2}$

$= \frac{1}{4} n^{3} + \frac{1}{12} n^{3} + \frac{1}{24} n^{2} + \frac{1}{12} n^{2} + \frac{1}{24}n - \frac{1}{8} n^{2} + \frac{1}{8} n  - \frac{1}{4} n^{3} + \frac{1}{4} n^{2}$

$= \frac{2}{24} n^{3} + \frac{6}{24} n^{2} + \frac{4}{24} n$

$= \frac{1}{12} n^{3} + \frac{1}{4} n^{2} + \frac{1}{6} n$

對於搜索全部的子字串、並且暴力檢測迴文的複雜度是：

$\frac{1}{2} \sum\limits_{a = 0}^{n - 1} \sum\limits_{b = a}^{n - 1} (b - a + 1) = \frac{1}{12} n^{3} + \frac{1}{4} n^{2} + \frac{1}{6} n = O(n^{3})$

{% note warning %}
注意：本式中存在一個瑕疵，由於子字串長度 $\frac{1}{2} (b - a + 1)$ 有可能為奇數，
精確的應寫為 $\lfloor \frac{1}{2} (b - a + 1) \rfloor$ 並將奇、偶數分開討論。
{% endnote %}

## 演示

{% note info %}
本演示的最糟測資是所有子字串都是迴文的情況，也就是單個字元構成的字串。
{% endnote %}

{% jsfiddle 3d7z04uh result,js,html,css dark 100% 230px %}

# 迴文子字串：策略
對於這樣的問題 Manacher algorithm 提供了思考的策略：「大的迴文包含了小的迴文」
Manacher algorithm 的步驟：  

* 字元間插入字符，使原字串都變成奇數長度
* 依序掃描字元、長度，找到最長的迴文

關於步驟 1 的部份，實際上是這樣的：
假設有 `abcdcpa` 改變成 `#a#b#c#d#c#p#a#` （其中的 `#` 是任意字符）

數數看，我們插入了多少字元呢？如果把尾巴的 `#` 拿走的話：
* `abcdcpa`
* `#a#b#c#d#c#p#a` + `#`
* `#a #b #c #d #c #p #a` + `#`

在長度為 $n$ 的字串中，我們插入了 $n$ 個 `#` 並在尾巴多加了一個 `#` 使得長度變成 $2n + 1$<br/>
考慮長度為 $n$ 的字串，其中 $n$ 可能為偶數、或著奇數：

* 如果 $n$ 為偶數，則 $2n$ 也是偶數，那 $2n + 1$ 為奇數
* 如果 $n$ 為奇數，則 $2n$ 變成偶數，那 $2n + 1$ 為奇數

{% codeblock lang:cpp %}
...
// 插入符號到字元間
string insertSign(string str, char sign)
{
    string nstr;                          // 建立新字串
    for(int i = 0; i < str.length(); i++) // 遍歷原字串
    {
        nstr += sign;                     // 加上符號
        nstr += str[i];                   // 插入字元到新字串
    }
    return nstr + sign;                   // 新字串尾巴補上符號
}
...
insertSign("ABC", \'#\');                   // 調用時："#A#B#C#"
...
{% endcodeblock %}

能理解這個部份的話，我們進入算法核心：
如果我們字串比對由左至右來處理的話，一直到圖 1 的問號處：

![圖 1、用已知資料推測問號處的值](https://i.imgur.com/nHa3cFa.png)

問號處應該填入多少呢？我們利用已知的資料做推測，
圖 2 橘色的部份就是已知區域最大的迴文：

![圖 2、已經有的資料值（橘色）](https://i.imgur.com/tfCrpQK.png)

我們可以合理推測，正因為左右淡橘色以深橘色（Index = $7$）對稱，
在 `a` 處（Index = $9$）的 Palindrome 會與左邊的綠色 `a` 處（Index = $5$）相等，如圖 3。
    
![圖 3、透過已知值（綠色）推測問號處的值](https://i.imgur.com/7SZausI.png)

換句話說，我們會認為它等於 $1$（因為左邊的 Palindrome = $1$）如圖 4：

![圖 4、推測出問號處的值（綠色框為該位置的迴文範圍）](https://i.imgur.com/FNDjVzx.png)

我們接下來看第二種情況：

![圖 5、不能直接推測的情況](https://i.imgur.com/w0qvUvc.png)

{% note danger %}
錯誤的推測：這邊的 `b` 處（Index = $11$）會跟左邊的 `b` 處（Index = $3$）相等。
{% endnote %}

因為左邊的 `b` 處（Index = $3$）紀錄的迴文長度，
向左延伸超出了 `c` 處（Index = $7$）所紀錄的保證範圍，如圖 6：

![圖 6、錯誤的推測值（紅色框為 $b$ 的迴文範圍）](https://i.imgur.com/lqoxeMM.png)

既然一直到 `#` 處（Index = $12$）都跟左邊對稱的話，  
右邊的 `b` 處（Index = $11$）、搭配左邊的 `b` 處（Index = $3$）紀錄的數字，  
可以得到 $12 - 11 = 1 < 3$

也就是說，雖然左邊提供資訊為 3 的迴文長度，  
但 `c` 處（Index = $7$）只保證至少有 1 的迴文長度。

可以觀察出一個結論：  

* 我們必須紀錄目前保護範圍到哪裡
* 如果延伸沒有超過保護範圍，則直接填入左邊對稱的數字
* 如果延伸超過了保護範圍，則利用左邊對稱的數字做保守估計

我們用變數表示可以理解的更清楚，如圖 7 所示：

![圖 7、變數表示](https://i.imgur.com/DWPcioH.png)

觀察之後的結論：
* 若以 $k$ 為對稱，則對應於 $i$ 的 $j = k - (i - k) = 2k - i$
* 僅考慮右邊的保護範圍只到 $k + P_{k}$
* 如果 $i + P_{j} < k + P_{k}$ 則 $P_{i} = P_{j}$
* 如果 $i + P_{j} \geq k + P_{k}$ 則至少保證 $P_{i} \geq (k + P_{k}) - i$
    
更簡潔地表示：
* 令 $j = k - (i - k) = 2k - i$
* 令 $m = k + P_{k}$
* {% raw %}$P_{i} = \left\{\begin{array}{l} P_{j} && \text{if } (i + P_{j}) < m \\ m - i + c && \text{if } (i + P_{j}) \geq m \end{array}\right .${% endraw %}
* 上式 $c \in \mathbb{N}^{0}$ 須另外估計（延伸是否迴文）
    
{% codeblock lang:cpp %}
...
void LPS(string s)
{
    int len = s.length();                             // 字串長度
    int i, j;                                         // 兩個以 k 為對稱的註標
    int m = 0;                                        // 保護範圍的註標
    int k = 0;                                        // 對稱中心的註標
    int *p = new int[len];                            // 紀錄迴文長度的表
    for(i = 0; i < len; i++)                          // 遍歷所有字元
    {
        j = 2*k - i;                                  // 找到另一對稱的註標
        if(i + p[j] < m)                              // 在保護範圍內
            p[i] = p[j];                              // 此迴文長度與對稱的迴文長度相等
        else                                          // 超出保護範圍內
        {
            p[i] = m - i;                             // 至少有保護範圍到該註標的長度
            while(s[i + p[i]] == s[i - p[i]])         // 拓展新長度
            {
                p[i]++;
                if(i + p[i] >= len || i - p[i] < 0)   // 超出邊界就要停止
                break;
            }
            k = i; m = k + p[k];                      // 以目前為新對稱中，拓寬保護範圍
        }
    }
    return findMax(p, len);                           // 尋找最大值
}
...
{% endcodeblock %}

## 複雜度
Manacher algorithm 的最差情況，即是「毫無資訊可利用」的情形（不存在迴文），  
即便無資訊可用，使 $i$ 必須逐步配對，也會使得 $m$ 逐漸遞增。  
（此一情況下，會有 $m = i$ 的關係）

由於僅需要掃描一次原字串，Manacher algorithm 複雜度為 $O(n)$
            
        
## 演示

{% note info %}
建議利用相同的測資，比較窮舉與策略的速度差異。
{% endnote %}

{% jsfiddle uc3vyr6f result,js,html,css dark 100% 230px %}

# 迴文子序列：窮舉

{% note info %}
字串可以看作是字元的序列。
{% endnote %}

迴文子序列的暴力破解比子字串更糟糕，  
原因在於，子序列的條件比子字串更寬鬆， 以至於任意長度字串的子序列數量極多。

窮舉的邏輯跟子字串是一樣的：找到所有的子序列，並且檢測迴文。  
跟子字串不一樣的地方是：沒辦法利用傳入字串參考及兩個註標來解決生成一堆子序列。

以 `ABCD` 三個字元為例：

* 長度為 $0$ 時，存在 $1$ 個子序列：`ø`
* 長度為 $1$ 時，存在 $4$ 個子序列：`A`, `B`, `C`, `D`
* 長度為 $2$ 時，存在 $6$ 個子序列：`AB`, `AC`, `AD`, `BC`, `BD`, `CD`
* 長度為 $3$ 時，存在 $4$ 個子序列：`ABC`, `ABD`, `ACD`, `BCD`
* 長度為 $4$ 時，存在 $1$ 個子序列：`ABCD`

不難發現，其實存在的關係跟排列組合中的組合有關，
當原字串長度為 $n$ 時，子序列的數量是：

$\sum\limits_{k = 0}^{n}\binom{n}{k}$

以剛剛的例子來說：

$\because n = 4$

$\therefore \sum\limits_{k = 0}^{4}\binom{4}{k}$

$\sum\limits_{k = 0}^{4}\binom{4}{k} = \binom{4}{0} + \binom{4}{1} + \binom{4}{2} + \binom{4}{3} + \binom{4}{4}$

$= 1+4+6+4+1 = 16$

從另一角度看，子序列的問題其實就是這堆字取任意個有多少種取法，  
以 `ABCD` 來說，以 $0$ 表示不取、以 $1$ 表示有取到的話：

| A | B | C | D | Subsequence |
|:-:|:-:|:-:|:-:| :-: |
| 0 | 0 | 0 | 0 | `ø` |
| 0 | 0 | 0 | 1 | `D` |
| 0 | 0 | 1 | 0 | `C` |
| 0 | 0 | 1 | 1 | `CD` |
| 0 | 1 | 0 | 0 | `B` |
| 0 | 1 | 0 | 1 | `BD` |
| 0 | 1 | 1 | 0 | `BC` |
| 0 | 1 | 1 | 1 | `BCD` |
| 1 | 0 | 0 | 0 | `A` |
| 1 | 0 | 0 | 1 | `AD` |
| 1 | 0 | 1 | 0 | `AC` |
| 1 | 0 | 1 | 1 | `ACD` |
| 1 | 1 | 0 | 0 | `AB` |
| 1 | 1 | 0 | 1 | `ABD` |
| 1 | 1 | 1 | 0 | `ABC` |
| 1 | 1 | 1 | 1 | `ABCD` |

同時它也長的像二進位的真值表，  
更進一步的解釋了：$\sum\limits_{k = 0}^{n}\binom{k}{n} = 2^{n}$

要證明這件事情，我們得從二項式定理開始：
$(x + y)^{n} = \sum\limits_{k = 0}^{n} x^{k}y^{(n - k)}\binom{k}{n}$

只要令 $x = 1, y = 1$ 則：
$(1 + 1)^{n} = \sum\limits_{k = 0}^{n} 1^{k}1^{(n - k)}\binom{k}{n} = 2^{n}$

換言之，對於長度為 $n$ 的原字串來說，存在 $2^{n}$ 種子序列。
利用遞迴關係，可以很簡單的找到所有的子序列：

{% codeblock lang:cpp %}
...
// 利用遞迴關係取得子序列
void getSubseq(string subseq, string str)
{
    // 若子序列不為空集合，則處理
    if(subseq != "") process(subseq);
    // 將子序列增加一個字元，其字元後的子字串傳到下一層
    for(int i = 0; i < str.length(); i++)
        getSubseq(subseq + str[i], str.substr(i, str.length()));
}
getSubseq("", "ABC"); // 調用時
...
{% endcodeblock %}
對於檢查迴文，使用子字串中提供的第一種檢查方法（也是一般的檢查法）較簡單。

## 複雜度
我們在上面已經曉得，  
長度為 $n$ 的序列，子序列的數量為：$\sum\limits_{k = 0}^{n}\binom{k}{n} = 2^{n}$

在組合構成的多項式每一項 $\binom{k}{n}$ 都是子字串的數量，  
透過變數 $k$ 可以抓到子序列的長度（檢測迴文需要一半長度），  
於是複雜度是：$\sum\limits_{k = 0}^{n} \frac{1}{2}k\binom{k}{n}$

由於已知光是子序列數量 $\sum\limits_{k = 0}^{n}\binom{k}{n} = 2^{n} = O(2^{n})$

$\sum\limits_{k = 0}^{n} \frac{1}{2}k\binom{k}{n}$ 複雜度必超過 $O(2^{n})$

因此算法並不堪用，得另尋出路！

{% note warning %}
注意！與子字串相同，長度 $\frac{1}{2} k$ 不一定為偶數，應討論其奇偶性。
{% endnote %}

## 演示

{% note warning %}
由於時間複雜度高，輸入太長的測資容易當機。
{% endnote %}

{% jsfiddle qu8j1nda result,js,html,css dark 100% 230px %}

# 迴文子序列：策略
由於子序列數量實在增長的很快，有沒有其他方法呢？
使用動態規劃可以有效解決這個問題：

![圖 8、長度為 $5$ 的字串](https://i.imgur.com/oFrlWBu.png)

考慮圖 8，也就是一個長度為 $5$ 的字串。

透過註標 $0$ 及註標 $4$ 的字元不相等這件事情，  
我們可以肯定的說，最長迴文子序列的長度不會是 $5$

那麼，有沒有可能長度為 $4$ 呢？
如果已知註標 $0$ 及註標 $4$ 的字元不相等，且長度為 $4$ 此事為真，
則註標 $3$ 可能為 `A`，即圖 9 的情況：

![圖 9、註標 $3$ 可能為 A 的情況](https://i.imgur.com/HxHNCdO.png)

或註標 $1$ 為 `C`，即圖 10 的情況：

![圖 10、註標 $1$ 可能為 C 的情況](https://i.imgur.com/XBMucHa.png)

因為我們還不知道註標 $3$ 及註標 $1$ 的字元，我們可以肯定的是：  
最長迴文子序列應該是「註標 $0$ 到註標 $3$」或「註標 $1$ 到註標 $4$」其中一個較長的。

![圖 11、「最長的」迴文子序列一定是「長度較長的」那一個](https://i.imgur.com/nQpuNnT.png)

圖 11 顯示出一個肯定的答案：
* 「註標 $0$ 到註標 $3$」的最長迴文子序列長度為 $3$  
* 「註標 $1$ 到註標 $4$」的最長迴文子序列長度為 $4$  
* 則「註標 $0$ 到註標 $4$」的最長迴文子序列長度就會是 $4$ 

我們觀察了第一種字元不相等的情況，那如果相等呢？參考圖 12：

![圖 12、最長迴文子序列至少為 $2$](https://i.imgur.com/PV6Rhy6.png)

此時我們可以肯定，至少最長迴文子序列為 $2$  
記得子字串、子序列的差異，這邊暗示如果註標 $1$ 到註標 $3$ 的字元通通不取，  
則子序列為 `AA` 就是長度為 $2$ 的迴文。

一旦字元相等，我們就保證長度至少為 $2$ 還要在加上「註標 $1$ 到註標 $3$」最長的長度。  

考慮圖 13 的情況，由於註標 $0$ 及註標 $4$ 字元相等，  
則保證長度為 $2$ + 「註標 $1$ 到註標 $3$ 最長迴文子序列的長度」  
這個情況下，長度就是 $2 + 3 = 5$

![圖 13、最長迴文子序列長度為 $2 + 3 = 5$](https://i.imgur.com/vWWUxuQ.png)

如果實際下去比對，還有兩種情況：  

其一是「註標 $2$ 到註標 $2$ 最長迴文子序列的長度」   
由於只有一個字元，當註標相同時，必為 $1$，參考圖 14：

![圖 14、只有一個字元的情況](https://i.imgur.com/oxOiQd8.png)

最後一種情形是「註標 $1$ 到註標 $2$ 最長迴文子序列的長度」在碰到兩個字元相等時  
很顯然地，這種情況只能給出長度 $2$ 當作答案，參考圖 15：

![圖 15、只有一個字元的情況](https://i.imgur.com/7WElE0N.png)

根據上述一些推理，可以得到一些結論。

假設：
* 原字串長度為 $n$
* 註標 $i$ 及註標 $j$ 存在 $i \leq j$
* 原字串第 $i$ 個字元為 $S_{i}$ 
* 從註標 $i$ 到註標 $j$ 的最長迴文子序列長度為 $P_{i, j}$

則：
* 當 $S_{i} \neq S_{j}$ 且 $i \neq j$ 則 $P_{i, j} = max(P_{i + 1, j}, P_{i, j - 1})$
* 當 $S_{i} = S_{j}$ 且 $|i - j| > 1$ 則 $P_{i, j} = P_{i + 1, j - 1}$
* 當 $S_{i} = S_{j}$ 且 $|i - j| = 1$ 則 $P_{i, j} = 2$
* 當 $i = j$ 則 $P_{i, j} = 1$

{% note info %}
條件 $|i - j| > 1$ 或 $|i - j| = 1$ 都隱含著 $i \neq j$ 這個關係
{% endnote %}

簡潔地表示：
* {% raw %}
$P_{i, j} = \left\{\begin{array}{l}
max(P_{i + 1, j}, P_{i, j - 1}) && \text{if } S_{i} \neq S_{j}, i \neq j \\
P_{i, j} = P_{i + 1, j - 1} && \text{if } S_{i} = S_{j}, |i - j| > 1 \\
2 && \text{if } S_{i} = S_{j}, |i - j| = 1 \\
1 && \text{if } i = j
\end{array}\right .$
{% endraw %}

看一個簡單的例子，參考下圖 16（例子已將可能的四種情況納入）：  

![圖 16、簡單的例子](https://i.imgur.com/HorUIoW.png)

我們的目標是找到 $P_{0, 4}$
由於 $S_{0} \neq S_{4}$ 且 $i \neq j$ 所以：

* $P_{0, 4} = max(P_{1, 4}, P_{0, 3})$（規則一）

對於 $P_{1, 4}$ 的部份：
* $P_{1, 4} = max(P_{2, 4}, P_{1, 3})$（規則一）
* $P_{2, 4} = max(P_{3, 4}, P_{2, 3})$（規則一）
* $P_{1, 3} = max(P_{2, 3}, P_{1, 2})$（規則一）
* $P_{3, 4} = 2$（規則四 $\because S_{3} = S_{4}, |3 - 4| = 1$）
* $P_{2, 3} = max(P_{3, 3}, P_{2, 2}) = 1$（規則一）
* $P_{1, 2} = max(P_{2, 2}, P_{1, 1}) = 1$（規則一）
* $P_{1, 1} = P_{2, 2} = P_{3, 3} = 1$（規則三）


對於 $P_{0, 3}$ 的部份：
* $P_{0, 3} = max(P_{1, 3}, P_{0, 2})$（規則一）
* $P_{1, 3} = max(P_{2, 3}, P_{1, 2})$（規則一）
* $P_{2, 3} = max(P_{3, 3}, P_{2, 2}) = 1$（規則一）
* $P_{1, 2} = max(P_{2, 2}, P_{1, 1}) = 1$（規則一）
* $P_{1, 1} = P_{2, 2} = P_{3, 3} = 1$（規則三）
* $P_{0, 2} = 2 + P_{1, 1} = 3$（規則二）

所以 $P_{0, 4} = 3$

程式碼的部份，利用遞迴可以輕易達成：
{% codeblock lang:cpp %}
...                                                  // 初始化或輸入
int **p = new int* [str.length()];                   // 建立儲存表
for(int i = 0; i < str.length(); i++)
{
    p[i] = new int [str.length()];
    memset(p[i], -1, sizeof(p[i]));                  // 初始化儲存表為 -1
}
...
// 動態規劃找最長迴文子序列
int LPS(int i, int j)
{
    if(p[i][j] > 0) return p[i][j];                  // 若有儲存則直接使用
    if(i == j)                                       // 若只有一字元
        p[i][j] = 1;                                 // 長度為 1
    else if(i + 1 == j && str[i] == str[j])          // 只有兩字元，且兩字元一樣
        p[i][j] = 2;                                 // 長度為 2
    else if(i != j && str[i] == str[j])              // 首、尾字元相等
        p[i][j] = LPS(s, i + 1, j - 1) + 2;          // 長度至少為 2 還要加上內部的最大長度
    else //(i != j && str[i] != str[j])              // 首、尾字元相異
        p[i][j] = max(LPS(i + 1, j), LPS(i, j - 1)); // 長度為刪除首、尾字元其一後的最大長度
    return p[i][j];                                  // 回傳長度
}
LPS(0, str.length() - 1);                            // 調用時
...
{% endcodeblock %}

{% note warning %}
調用時，因為傳入值為註標，第二個參數應為 `str.length() - 1` 而非 `str.length()`
{% endnote %}

## 複雜度
如果採用遞迴的方法處理（即沒紀錄重複計算的部份），  
這個算法的複雜度也相當高：

僅考慮最糟情況，也就是不斷計算 $P_{i, j} = max(P_{i + 1, j}, P_{i, j - 1})$ 的狀況。

令長度 $n = j - i + 1$ 則有遞迴式：

$$T(n) = 2T(n - 1), \forall n \in N^{0}$$ 

透過猜測複雜度來解遞迴式的方法，我們先猜測複雜度為 $O(n^{2})$，假設：

$$\forall c > 0,\quad T(n) = 2T(n - 1),\quad T(n - 1) \leq c(n - 1)^{2}$$

結合兩個條件：

$$T(n) = 2T(n - 1) \leq 2c(n - 1)^{2} \leq cn^{2}$$

經過整理後有：

$$2cn^{2} - 4cn + 1 \leq cn^{2}$$

假設不成立，顯然 $T(n) > O(n^{2})$

---

這次改假設為 $T(n) = O(2^{n})$

假設 

$$\forall c > 0,\quad T(n) = 2T(n - 1),\quad T(n - 1) \leq c2^{(n - 1)}$$

結合兩個條件：

$$T(n) = 2T(n - 1) \leq 2c(2)^{n - 1} \leq c2^{n}$$

滿足：

$$c2^{n} \leq c2^{n}$$

假設成立，且可知道對於 $c = 1$ 只要 $n_{0} = 1$ 就有 $T(n) = O(2^{n})$

{% note warning %}
完整的遞迴式原先應標記在 $n \leq k$ 的情況下 $T(n) = O(1)$<br/>
故此處隱含了當 $n$ 足夠小，則複雜度為 $O(1)$ 的概念，<br/>
此外從式中可知 $n_{0} = 0$ 時 $T(n_{0} - 1) = T(-1)$ 是未定義的。
{% endnote %}

做最後一步確認，透過遞迴樹如圖 1：  

![圖 1、遞迴樹](https://i.imgur.com/jNptBcw.png)

已知深度為 $k$ 且根節點層為 $1$ 的二元樹有 $2^{k-1}$ 個葉節點，  
則由於 $T(n) = 2T(n - 1)$ 每次讓 $n$ 遞減，二元樹層數為 $n$ 則葉節點數目為 $2^{n-1}$
經累計則可確認，若以不紀錄的方式遞歸，複雜度會達到 $O(2^{n})$

若經紀錄，則會避開重複計算的節點（如上例中的 $P_{1, 1}, P_{2, 2}, P_{3, 3}$）
相當於在二維陣列中填表，且只需要填入 $i \leq j$ 的部份即可。

此時，最糟情況下，每次填入都須依賴 $P_{i, j}, i = j$ 的值（對角線）
但，至多也只需要填入 $\frac{1}{2} n^{2}$ 個位置，則複雜度為 $O(n^{2})$

## 演示

{% note info %}
取得最長序列的方法，可以改變 `p[i][j]` 同時記錄長度及序列；本演示即是如此。
{% endnote %}

{% jsfiddle o28vt6cc result,js,html,css dark 100% 230px %}

# 參考資料
* [Wikipedia: Substring](https://en.wikipedia.org/wiki/Substring)
* [Wikipedia: Subsequence](https://en.wikipedia.org/wiki/Subsequence)
* [Wikipedia: Longest Palindromic Substring](https://en.wikipedia.org/wiki/Longest_palindromic_substring)
* [演算法筆記：迴文](http://www.csie.ntnu.edu.tw/~u91029/Palindrome.html)
* [Algorithms @tutorialhorizo​​n](http://algorithms.tutorialhorizon.com/longest-palindromic-subsequence/)
* [PEGWiki: Longest Palindromic Subsequence](https://wcipeg.com/wiki/Longest_palindromic_subsequence)
* [Felix021：Manacher's ALGORITHM: O(n)时间求字符串的最长回文子串](https://www.felix021.com/blog/read.php?2040)
* 《算法導論》（第 2 章到第 4 章，主要用於參考「分析遞迴關係式」）
