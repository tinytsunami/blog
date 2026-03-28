---
title: 排序 Sort
permalink: sort/
categories: legacy-algorithm
date: 2018-03-30 21:43:57
mathjax: true
---
排序是演算法最基本內容。

當初給我這樣印象似乎是網路上某篇文章，雖然已經找不到來源，  
但隨著瞄過《算法導論》以及上過大學演算法後，這個想法深植心中。
<!-- more -->

那時學校作業好像只要求實作兩種排序並比較速度，  
基於興趣，我實作了許多排序。

{% note warning %}
當時未收入睡眠排序；且初次實作大量排序，程式碼品質似乎欠佳。
{% endnote %}

# 測資
本篇所有的程式全都是「由小到大」排序，
另外對於所有程式碼的函數，你可以預設存在這樣一筆測資：

{% codeblock lang:cpp %}
...
int len = 5;                    // 陣列長度
int *arr = new int[5];          // 測資陣列
for(int i = 0; i < len; i++)    // 設定初始值
  arr[i] = rand() % 100;        // 範圍為 [0, 100)
...
sort(arr, len);                 // 調用排序函數
...
{% endcodeblock %}

{% note warning %}
陣列大小設定為變數不是所有編譯器都支援，故此採用動態宣告。
{% endnote %}
# Bubble Sort
中文為「氣泡排序」  
應該是最容易理解的排序之一，同時程式設計課程幾乎都會提及，  
以 C 語言初學者來說，不熟練 STL 與其他排序時，會用上的排序技巧。

大致上的想法是，掃描陣列的兩個值，  
保持兩個值一前一後，如果出現前值大於後值，則交換兩個值。

## 實作

{% note primary %}
筆者在這裡致歉，舊版文章的 Bubble sort 沒有符合相鄰元素才交換的要件；使得程式碼更接近插入排序，在後續 Odd-Even Sort 會造成理解困難，特此聲明。
{% endnote %}

{% codeblock lang:cpp %}
...
/* 整數交換函數 */
void swap(int *a, int *b)
{
    int t = *a;                             // 保存 a 值
    *a = *b;                                // 以 b 值覆蓋 a 值
    *b = t;                                 // 以 a 值覆蓋 b 值
}
...
/* 氣泡排序 */
void bubble_sort(int *arr, int len)
{
    for(int i = 0; i < len; i++)            // 選取第 i 個值（前項）
        for(int j = i + 1; j < len; j++)    // 選取第 j 個值（後項）
            if(arr[j-1] > arr[j])           // 如果前項比後項大
                swap(&arr[j-1], &arr[j]);   // 交換前項與後項
}
...
{% endcodeblock %}

可以發現 `i` 最小為 0，而 `j` 最小為 `i+1` 即 1，可以推得 `j-1` 最小為 0 不會超出邊界。

{% note warning %}
交換函數 (swap) 在 C++ 中有預先定義，請參考 [cplusplus std::swap](http://www.cplusplus.com/reference/algorithm/swap/)
{% endnote %}

# Selection Sort
中文為「選擇排序」
選擇排序是很直觀的一種排序，可以視作氣泡排序的加強版，  
雖然概念很簡單，但註標的設定對於初學者來說是有可能混亂的。

原先氣泡排序要不斷地交換陣列的元素，  
選擇排序提供了一種思路：「找到最小的交換」取代了「每次比較的交換」。

與氣泡排序相同，要掃描兩個值，  
但這次將前值固定，後值從未排序的元素中選擇最小的跟前值換。  
（未排序的陣列包含前值那個位置）

## 實作

{% codeblock lang:cpp %}
...
/* 選擇排序 */
void selection_sort(int *arr, int len)
{
    for (int i = 0; i < len; i++)           // 對於每個元素
    {
        int min = i;                        // 假設元素 i 是 [i, len) 內最小
        for (int j = i + 1; j < len; j++)   // 尋找 [i+1, len) 內更小的 j 元素
            if (arr[min] > arr[j])          // 如果元素 j 更小
                min = j;                    // 取代原本的最小假設
        swap(&arr[i], &arr[min]);           // 使元素 i 的位置為 [i, len) 內最小值
    }
}
...
{% endcodeblock %}

{% note info %}
交換函數 (swap) 於前面段落有提及，有需要請參考 [氣泡排序](#Bubble-Sort)
{% endnote %}

# Insertion Sort
中文為「插入排序」  
插入排序是《算法導論》起初就介紹的排序方法。

概念其實很容易，就像是在玩撲克牌，  
如果你整理你的手牌，你會把需要整理的牌取出，  
然後一張張挪動比他大的牌，直到找到插入的位置。

## 實作

{% codeblock lang:cpp %}
...
/* 插入排序 */
void insertion_sort(int *arr, int len)
{
    int i, j;                                           // 註標 i, j
    for (i = 0; i < len; i++)                           // 檢查每一個元素
    {
        int tmp = arr[i];                               // 取出要排序的元素
        for (j = i; j > 0 && tmp < arr[j - 1]; j--)     // 往前尋找插入點
            arr[j] = arr[j - 1];                        // 挪動元素的位置
        arr[j] = tmp;                                   // 插入元素
    }
}
...
{% endcodeblock %}

# Cocktail Sort
中文為「雞尾酒排序」
可以視為氣泡排序的加強版，氣泡排序從單邊處理；  
而雞尾酒的想法是從陣列的兩端，像在搖瓶子那樣把兩頭逐漸處理完。

## 實作

{% codeblock lang:cpp %}
...
/* 雞尾酒排序 */
void cocktail_sort(int *arr, int len)
{
    int left = 0;                               // 一方面從左邊開始
    int right = len - 1;                        // 一方面從右邊開始
    while (left < right)                        // 尚未結束
    {
        for (int j = left; j < right; j++)      // 最大的元素會被換到右邊
            if (arr[j] > arr[j + 1])
                swap(&arr[j], &arr[j + 1]);
        right--;                                // 最右邊排序完成
        for (int j = right; j > left; j--)      // 最小的元素會被換到左邊
            if (arr[j] < arr[j - 1])
                swap(&arr[j], &arr[j - 1]);
        left++;                                 // 最左邊排序完成
    }
}
...
{% endcodeblock %}

{% note info %}
交換函數 (swap) 於前面段落有提及，有需要請參考 [氣泡排序](#Bubble-Sort)
{% endnote %}

# Comb Sort
中文為「梳排序」  
梳排序意思就是「梳子排序」借用了梳子的想法。

與氣泡排序一樣，每次掃描兩個元素，  
但每次掃描的當下，掃描的元素距離是固定的，  
並隨著每次掃描，寬度逐漸縮小。

就像是梳理凌亂的頭髮，  
一開始會用齒距大的梳子，後來越用越小，  
當然也會越來越整齊了。

## 實作

{% codeblock lang:cpp %}
...
/* 梳排序 */
void comb_sort(int *arr, int len)
{
    for (int width = len - 1; width > 0; width--)               // 兩元素的間距逐漸遞減
        for (int begin = 0; (begin + width) < len; begin++)     // 掃描每個元素
            if (arr[begin] > arr[begin + width])                // 比較兩個元素大小
                swap(&arr[begin], &arr[begin + width]);         // 交換元素
}
...
{% endcodeblock %}

{% note info %}
交換函數 (swap) 於前面段落有提及，有需要請參考 [氣泡排序](#Bubble-Sort)
{% endnote %}

# Gnome Sort
中文為「地精排序」  
這個排序特別的地方在於，實作出來往往只有一層迴圈結構，  
大量交換元素使的整體類似氣泡排序，不是實用的算法。

具體來說，它透過進入未排序的範圍，  
透過相鄰的兩兩交換，把元素換到正確的位置上。

## 實作

{% codeblock lang:cpp %}
...
/* 地精排序 */
void gnome_sort(int *arr, int len)
{
    int i = 0;                              // 初始化註標
    while (i < (len - 1))                   // 設定註標範圍
    {
        if (arr[i] <= arr[i + 1])           // 如果目前這裡已經排好
            i++;                            // 移動到未排序的範圍
        else
        {
            swap(&arr[i], &arr[i + 1]);     // 把未排序的元素往前換
            i--;                            // 註標跟著這個未換好的元素
        }
        if (i < 0)                          // 處理邊界問題
            i = 0;
    }
}
...
{% endcodeblock %}

{% note info %}
交換函數 (swap) 於前面段落有提及，有需要請參考 [氣泡排序](#Bubble-Sort)
{% endnote %}


# Odd-Even Sort
中文為「奇偶排序」，跟氣泡排序類似的排序算法。

排序的特性會透過排序奇數位的元素及偶數位的元素，來達成整體的排序，
實際上是氣泡排序的平行化版本，在 SIMD (Single-Instruction Multiple-Data) 的假設下，可以壓到 O(n)。

## 實作

這裡僅實做序列版：

{% codeblock lang:cpp %}
...
/* 奇偶排序 */
void ood_even_sort(int *arr, int len)
{
    bool sorted = false;                                // 宣告排序完成旗標
    while (sorted == false)                             // 如果排序未完成則排序
    {
        sorted = true;                                  // 假設已經排序完畢
        for (int base = 0; base < 2; base++)            // 依序操作奇數位元素、偶數位元素
            for (int i = base; i < (len - 1); i += 2)
                if (arr[i] > arr[i + 1])                // 比較相鄰奇、偶數的元素
                {
                    swap(&arr[i], &arr[i + 1]);         // 如果位置不對則交換
                    sorted = false;                     // 假設錯誤目前未排完
                }
    }
}
...
{% endcodeblock %}

# Shell Sort
中文為「希爾排序」  
可以看成是插入排序的加強版。

實作上，將固定間距的數字先做插入排序，  
然後使間距逐漸遞減。

## 實作

{% codeblock lang:cpp %}
...
/* 希爾排序 */
void shell_sort(int *arr, int len)
{
    for (int gap = len; gap > 0; gap /= 2)                                      // 間距逐次減半
        for (int shift = 0; shift < gap; shift++)                               // 找到間距中的所有元素
        {
            int i, j;                                                           // 註標 i, j
            for (i = shift; i < len; i += gap)                                  // 對特定間距的插入排序
            {
                int tmp = arr[i];                                               // 取出要排序的元素
                for (j = i; tmp < arr[j - gap] && j > shift; j -= gap)          // 往前尋找插入點
                    arr[j] = arr[j - gap];                                      // 挪動元素的位置
                arr[j] = tmp;                                                   // 插入元素
            }
        }
}
...
{% endcodeblock %}

# Bucket Sort
中文為「桶子排序」
這是一個混合式的方法，必須先將元素分配到不同的桶子，  
然後再將每個桶子內排序完成，最後再組合起來。對於平行系統似乎是個好選擇。

{% note info %}
每個桶子內的排序，這裡使用了 [插入排序](#Insertion-Sort)
{% endnote %}

如果還記得複雜度分析的方法：  
當 $c$ 為一常數，且 $n > n_{0}$ 時，  
存在 $f(n) < cg(n)$ 這樣的關係，  
可以表示為 $f(n) = O(g(n))$

也就是說，桶子排序的排序算法，  
可以選擇一些 $n$ 在 $n_{0}$ 之下，速度很快的方法。

{% note warning %}
有些中文書的桶子排序是指 [Counting Sort](#Counting-Sort)
{% endnote %}

## 實作

{% codeblock lang:cpp %}
...
/* 桶子排序 */
void bucket_sort(int *arr, int len)
{
    int **bucket = new int*[10];                                // 建立一些桶子（這裡是 10 個）
    for (int i = 0; i < 10; i++)                                // 初始化每個桶子
    {
        bucket[i] = new int[len];                               // 設定桶子大小
        bucket[i][0] = 0;                                       // 桶子第 0 個位置存放元素個數   
    }
    for (int i = 0; i < len; i++)                               // 分配每個元素到 10 個桶子中
        for (int j = 0; j < 10; j++)
            if (arr[i] >= j * 10 && arr[i] < (j + 1) * 10)      // [10*j, 10*(j+1)] 分配到 j
                bucket[j][1 + bucket[j][0]++] = arr[i];         // 每個從 1 號位置開始放元素
    for (int i = 0; i < 10; i++)                                // 對每個桶子執行插入排序
        insertion_sort(&bucket[i][1], bucket[i][0]);
    int index = 0;                                              // 拼回原本的陣列
    for (int i = 0; i < 10; i++)
        for (int j = 0; j < bucket[i][0]; j++)
            arr[index++] = bucket[i][j + 1];
    delete[] bucket;                                            // 清理空間
}
...
{% endcodeblock %}

{% note info %}
注意桶子的大小跟數量，分配需要涵蓋到所有元素。事先知道資料分布情況是很有幫助的。
{% endnote %}

{% note danger %}
不要忘記使用 delete 與 delete[] 來清理記憶體空間。
{% endnote %}

# Counting Sort
中文為「計數排序」
非比較排序，所以不受上限 $\Omega(nlg(n))$ 的限制。  

大致上的概念是說，數數看有哪些元素，  
比方說有 5 則在 5 號箱子加一，最後再整合蒐集來的資訊。

通常情況下很浪費空間，但速度相當快，  
對於位數相當敏感，而非個數，所以也可將 $n$ 視為元素位數。

## 實作

{% codeblock lang:cpp %}
...
/* 計數排序 */
void counting_sort(int *arr, int len)
{
    int *count = new int[99];               // 宣告計數空間
    for (int i = 0; i < 99; i++)            // 範圍是 [0, 100)
        count[i] = 0;                       // 初始化數量為 0
    for (int i = 0; i < len; i++)           // 紀錄每個元素的數量
        count[arr[i]]++;
    int index = 0;                          // 拼回原本的陣列
    for (int i = 0; i < 99; i++)
        for (int j = 0; j < count[i]; j++)
            arr[index++] = i;
    delete count;                            // 清理空間
}
...
{% endcodeblock %}

# Radix Sort
中文為「基數排序」
基數排序是很特別的排序算法，  
依照元素的每個位數排好，最終結果就會是排好的元素。

## 實作
縱使算法看起來要將元素顛三倒四，  
但實作上有非常精巧的方法，  
透過記錄元素位數的偏移量來將元素放置到正確的位置上。

{% codeblock lang:cpp %}
...
#include <cmath>
...
/* 取得數字的某位數 */
int get_digit(int number, int digit)
{
    int a = (int) pow(10, digit);                           // 取得目標位數 10 的冪次
    int b = (int) pow(10, digit - 1);                       // 取的低一位數 10 的冪次
    number = number % a / b;                                // 取的目標位數
    return (int) floor(number);                             // 取整返回
}

/* 取得目前最大的元素 */
int get_max_number(int *arr, int len)
{
    int number = -1;                                        // 如果沒有元素則回傳 -1
    for (int i = 0; i < len; i++)                           // 遍歷所有元素
        if (number < arr[i])                                // 比對最大的元素
            number = arr[i];                                // 紀錄最大值
    return number;                                          // 回傳最大值
}

/* 基數排序 */
void radix_sort(int *arr, int len)
{
    int max_number = get_max_number(arr, len);              // 取得最大的數字
    int max_digit = (int) ceil(log10(max_number));          // 取的最大數字的位數
    int *tmp = new int[len];                                // 暫存的陣列
    int index[11];                                          // 記錄某位數的偏移量
    int count[11];                                          // 記錄某位數的數量
    for (int i = 1; i <= max_digit; i++)                    // 遍歷位數
    {
        for (int j = 0; j < 10; j++)                        // 清空紀錄位數數量
            count[j] = 0;
        for (int j = 0; j < len; j++)                       // 紀錄位數的數量
            count[get_digit(arr[j], i)]++;
        index[0] = 0;                                       // 位數 0 的偏移量為 0
        for (int j = 0; j < 10; j++)                        // 依序記錄每一位的偏移量
            index[j + 1] = index[j] + count[j];
        for (int j = 0; j < len; j++)                       // 利用偏移量將元素放置到正確的位置
            tmp[index[get_digit(arr[j], i)]++] = arr[j];
        for (int j = 0; j < len; j++)                       // 把暫存的陣列回寫
            arr[j] = tmp[j];
    }
    delete tmp;                                             // 清理空間
}
...
{% endcodeblock %}

{% note info %}
為使程式易讀，建議非關鍵功能獨立成副函式。
{% endnote %}

{% note warning %}
注意引入 cmath 或 math.h 標頭檔，以便使用 ceil、log 與 pow 函數。
{% endnote %}

{% note warning %}
小心隱式型別轉換可能導致的問題。
{% endnote %}

# Merge Sort
中文為「合併排序」  
重要的排序算法，同時也是排序問題最佳算法之一，  
因為很容易解釋 $O(nlg(n))$ 的關係，似乎常被拿來當教材。

跟快速排序是相對的存在，且被大量函式庫實作：

|  使用案例  |  排序演算法  |
|:--------------------------------- |:-------------------------- |
| Perl 5.8 Default                  | 合併排序 |
| Linux Kernel(linked list)         | 合併排序 |
| Java Arrays.sort()                | Tim Sort（源於合併與插入排序）|
| Python Default                    | Tim Sort（源於合併與插入排序）|
| GNU Octave                        | Tim Sort（源於合併與插入排序）|

## 實作

下面是遞迴的實作：

{% codeblock lang:cpp %}
...
/* 合併函數 */
void merge(int *arr, int *arr1, int *arr2, int len, int len1, int len2)
{
    int index1 = 0;                                         // 從第一個子陣列的第 0 個元素開始合併
    int index2 = 0;                                         // 從第二個子陣列的第 0 個元素開始合併
    for (int i = 0; i < len; i++)                           // 依序將元素填入合併陣列
    {
        if (index1 == len1)                                 // 如果第一個子陣列已經填完
            arr[i] = arr2[index2++];                        // 把第二個子陣列的元素全部塞給合併陣列
        else if (index2 == len2)                            // 如果第二個子陣列已經填完
            arr[i] = arr1[index1++];                        // 把第一個子陣列的元素全部塞給合併陣列
        else if (arr1[index1] < arr2[index2])               // 第一個子陣列的元素較小
            arr[i] = arr1[index1++];                        // 把第一個子陣列的元素塞給合併陣列
        else                                                // 第二個子陣列的元素較小（或相等）
            arr[i] = arr2[index2++];                        // 把第二個子陣列的元素塞給合併陣列
    }
}
...
/* 合併排序 */
void merge_sort(int *arr, int len)
{
    if (len > 1)                                            // 如果元素有多個
    {
        int left_len = len / 2;                             // 計算分割後，第一個子陣列的長度
        int right_len = len - left_len;                     // 計算分割後，第二個子陣列的長度
        int *left = new int[left_len];                      // 建立第一個子陣列
        int *right = new int[right_len];                    // 建立第二個子陣列
        for (int i = 0; i < left_len; i++)                  // 將元素分配到第一個子陣列
            left[i] = arr[i];
        for (int i = left_len; i < len; i++)                // 將元素分配到第二個子陣列
            right[i - left_len] = arr[i];
        merge_sort(left, left_len);                         // 對第一個子陣列遞迴
        merge_sort(right, right_len);                       // 對第二個子陣列遞迴
        merge(arr, left, right, len, left_len, right_len);  // 將兩個子陣列合併回傳
        delete left;                                        // 清理空間
        delete right;
    }
}
...
{% endcodeblock %}

{% note warning %}
如果合併函數不使用原始陣列的位置操作，而是另外建立空間，則需要回傳指標。
{% endnote %}

從觀察遞迴的版本可以發現，每次都是由 2 個元素（或 1 個）開始組合，  
然後逐漸變成 4 個、8 個慢慢增加，正因為排序的關鍵在於合併，  
也許可以透過迴圈模擬遞迴的過程。

下面是非遞迴的實作，使用了同樣的合併函數（參考上面）：

{% codeblock lang:cpp %}
...
/* 整數箝制函數 */
int clamp(int number, int lower_bound, int upper_bound)
{
    if (number > upper_bound)                                           // 如果數字大過上界
        return upper_bound;                                             // 讓數字等於上界回傳
    if (number < lower_bound)                                           // 如果數字小於下界
        return lower_bound;                                             // 讓數字等於下界回傳
    return number;                                                      // 數字在範圍內直接回傳
}
...
/* 合併排序 */
void merge_sort(int *arr, int len)
{
    int sub_len = 2;                                                    // 由兩兩合併開始
    while (sub_len <= len * 2)                                          // 直到下個 2^n 停止
    {
        for (int i = 0; i < len; i += sub_len)                          // 對每個區段進行處理
        {
            int left_len = sub_len / 2;                                 // 取得每區段左半邊的長度
            int right_len = sub_len - left_len;                         // 取得每區段右半邊的長度
            int *left = arr + i;                                        // 取得每區段左半邊的開頭
            int *right = left + left_len;                               // 取得每區段右半邊的開頭
            left_len = clamp(left_len, 0, (arr + len) - left);          // 處理區段左半邊界問題
            right_len = clamp(right_len, 0, (arr + len) - right);       // 處理區段右半邊界問題
            int *sub_arr = new int[sub_len];                            // 暫時的合併陣列
            merge(sub_arr, left, right, sub_len, left_len, right_len);  // 合併左右半邊到暫時的合併陣列
            for (int j = 0; j < sub_len; j++)                           // 將暫時的合併陣列複製到原陣列
                arr[i + j] = sub_arr[j];
            delete sub_arr;                                             // 清理空間
        }
        sub_len *= 2;
    }
}
...
{% endcodeblock %}

{% note warning %}
箝制函數 (clamp) 在 C++17 中有預先定義，請參考 [cppreference std::clamp](http://en.cppreference.com/w/cpp/algorithm/clamp)
{% endnote %}

# Quick Sort
中文為「快速排序」
快速排序可以說是最重要的排序算法，  
有著 $O(nlg(n))$ 的複雜度，但平均情況下又勝過其他排序。

## 實作
以下是遞迴版本：

{% codeblock lang:cpp %}
...
/* 快速排序 */
void quick_sort(int *arr, int len)
{
    if (len > 1)                                        // 如果還有元素
    {
        int *pivot = arr;                               // 選擇一個參考值（這裡選擇陣列開頭）
        int *left = arr + 1;                            // 左註標從陣列開頭的右邊一個開始
        int *right = arr + len - 1;                     // 右註標從陣列結尾開始
        while (left < right)                            // 如果左、右註標還沒重合
        {
            while (*left < *pivot && left < right)      // 左註標尋找大於參考值的元素
                left++;
            while (*right >= *pivot && left < right)    // 右註標尋找小於參考值的元素
                right--;
            if (left < right)                           // 如果註標還沒重合就交換元素
                swap(left, right);
        }
        if (*left < *pivot)                             // 檢查左註標的值跟參考值的關係
            swap(pivot, left);                          // 如果不符順序把參考值換到左邊
        int *start = arr;                               // 設定序列開頭
        int *end = arr + len;                           // 設定序列結尾
        int *center = left;                             // 中間的註標（左、右註標因重合都可以選）
        quick_sort(start, center - start);              // 遞迴左半部分
        quick_sort(center, end - center);               // 遞迴右半部分
    }
}
...
{% endcodeblock %}

也可以使用堆疊模擬這個過程，下面是非遞迴版本的快速排序：

{% codeblock lang:cpp %}
...
#include <stack>
#include <utility>
...
/* 快速排序 */
void quick_sort(int *arr, int len)
{
    pair<int*, int*> index;                                 // 宣告一個暫存區間的註標
    stack<pair<int*, int*>> stack;                          // 宣告一個存放區間的堆疊
    if (len <= 1)                                           // 根本沒東西可以排
        return;
    stack.push(make_pair(arr, arr + len - 1));              // 將整段陣列區間放入堆疊
    while (!stack.empty())                                  // 如果還沒處理完
    {
        index = stack.top();                                // 從堆疊中取出待處理的區間
        stack.pop();                                        // 從堆疊中刪除待處理的區間
        int *pivot = index.first;                           // 選擇一個參考值（這裡選擇陣列開頭）
        int *left = index.first + 1;                        // 左註標從待處理處開頭的右邊一個開始
        int *right = index.second;                          // 右註標從待處理處結尾開始
        while (left < right)                                // 如果左、右註標還沒重合
        {
            while (*left < *pivot && left < right)          // 左註標尋找大於參考值的元素
                left++;
            while (*right >= *pivot && left < right)        // 右註標尋找小於參考值的元素
                right--;
            if (left < right)                               // 如果註標還沒重合就交換元素
                swap(left, right);
        }
        if (*left < *pivot)                                 // 檢查左註標的值跟參考值的關係
            swap(pivot, left);                              // 如果不符順序把參考值換到左邊
        int *center = left;                                 // 中間的註標（左、右註標因重合都可以選）
        if (index.first < center - 1)                       // 如果左半段未完成
            stack.push(make_pair(index.first, center - 1)); // 將左半段待處理的區間放入堆疊
        if (center < index.second)                          // 如果右半段未完成
            stack.push(make_pair(center, index.second));    // 將右半段待處理的區間放入堆疊
    }
}
...
{% endcodeblock %}

{% note info %}
非遞迴版的區間註標可以透過 Struct 實作。
{% endnote %}

{% note warning %}
注意引入 stack 或 utility 標頭檔，以便使用 stack 及 pair 物件。
{% endnote %}

{% note warning %}
快速排序的實作有很多細節，可以先在紙上模擬這些步驟以利實作。
{% endnote %}

# Binary Search Tree
中文為「二元搜尋樹」  
利用二元樹資料結構的排序方法。

事實上，只要建立一個二元搜尋樹後，  
使用中序走訪便可以得到排序完成的結果。

## 實作
實作時，可以建立先「二元搜尋樹」的類別並實作方法。  
下面是二元搜尋樹節點的類別：

{% codeblock lang:cpp %}
...
/* 二元樹的節點類別 */
class BinaryTreeNode
{
public:
    BinaryTreeNode(int data);                // 建構函數
    int data;                                // 儲存的值
    BinaryTreeNode *left;                    // 左子節點
    BinaryTreeNode *right;                   // 右子節點
};

/* 建構函數 */
BinaryTreeNode::BinaryTreeNode(int data)
{
    this->data = data;                       // 儲存值
    this->left = nullptr;                    // 初始化左子節點
    this->right = nullptr;                   // 初始化右子節點
}
...
{% endcodeblock %}

{% note info %}
節點也可以透過 Struct 實做。
{% endnote %}

雖然有實作過完整的二元樹，  
但其實排序功能其實不需要太多的方法。

由於實際上外部調用不需要知道樹根的指標，  
實作上可以透過重載函數的方法隱藏起來，  
另外取回排序過的值時，傳入陣列的開頭利用註標及中序走訪依序取回。

下面是二元樹的類別：

{% codeblock lang:cpp %}
/* 二元搜尋樹的類別 */
class BinaryTree
{
public:
    BinaryTree();                                           // 建構函數
    void push(int data);                                    // 新增節點（外部調用）
    void gain(int *arr);                                    // 把值依序取回的函數
private:
    BinaryTreeNode *root;                                   // 樹根
    void push(BinaryTreeNode *root, int data);              // 新增節點（內部調用）
    void traversal(BinaryTreeNode *root, int *arr);         // 中序走訪（內部調用）
    int index;                                              // 用於把值回存的註標
};

/* 建構函數 */
BinaryTree::BinaryTree()
{
    this->root = nullptr;                                   // 初始化樹根
}

/* 新增節點（外部調用） */
void BinaryTree::push(int data)
{
    this->push(this->root, data);                           // 調用內部新增節點
}

/* 把值依序取回的函數 */
void BinaryTree::gain(int *arr)
{
    this->index = 0;                                        // 初始化註標
    this->traversal(this->root, arr);                       // 調用內部中序走訪
}

/* 新增節點（內部調用） */
void BinaryTree::push(BinaryTreeNode *root, int data)
{
    if (this->root == nullptr)                              // 如果樹為空
        this->root = new BinaryTreeNode(data);              // 新增節點成為根
    else if (root->data > data)                             // 樹不為空，且值比根的值小
    {
        if (root->left == nullptr)                          // 如果左子樹為空
            root->left = new BinaryTreeNode(data);          // 新增節點成為左子樹
        else
            this->push(root->left, data);                   // 新增節點到左子樹的某處
    }
    else                                                    // 樹不為空，且值比根的值大
    {
        if (root->right == nullptr)                         // 如果右子樹為空
            root->right = new BinaryTreeNode(data);         // 新增節點成為右子樹
        else
            this->push(root->right, data);                  // 新增節點到右子樹的某處
    }
}

/* 中序走訪（內部調用） */
void BinaryTree::traversal(BinaryTreeNode *root, int *arr)
{
    if (root != nullptr)                                    // 樹根有東西才繼續
    {
        if (root->left != nullptr)                          // 如果左子樹還有東西
            traversal(root->left, arr);                     // 去左子樹找節點
        arr[this->index] = root->data;                      // 把值存回去
        this->index++;                                      // 增加註標
        if (root->right != nullptr)                         // 如果右子樹還有東西
            traversal(root->right, arr);                    // 去右子樹找節點
    }
}
{% endcodeblock %}

調用的時候就相當簡單了：

{% codeblock lang:cpp %}
...
/* 二元搜尋樹排序 */
void binary_tree_sort(int *arr, int len)
{
    BinaryTree tree;                // 宣告二元搜尋樹
    for (int i = 0; i < len; i++)   // 將陣列的值儲存至二元樹
        tree.push(arr[i]);
    tree.gain(arr);                 // 取回排序過的值
}
...
{% endcodeblock %}

{% note warning %}
存在許多封裝資料結構的設計方法；  
然而這裡的這個方法存在一個瑕疵，當儲存的節點數目跟陣列大小不符時會出錯，  
但待排序的內容為串列結構時，可能很適合這樣的二元樹排序技巧。
{% endnote %}

# Heap Sort
中文為「堆積排序」  
堆積是完全二元樹，雖然是二元樹但性質與二元搜尋樹不同。  
作為排序算法使用時，是借助本身的特性來使用，  
是速度非常快的排序算法。

{% note info %}
堆積通常使用陣列模擬，而且第 0 個位置通常不用。
{% endnote %}

## 實作
傳統的做法，主要圍繞在建立堆積與取出堆積資料兩個步驟。  
在建立堆積時，先將資料放在樹葉節點上，然後向上調整；  
取出資料時，將樹根與樹葉節點交換，然後裁取樹葉。

{% codeblock lang:cpp %}
...
/* 堆積排序 */
void heap_sort(int *arr, int len)
{
    int *heap = new int[len + 1];                   // 宣告堆積
    for (int i = 0; i < len + 1; i++)               // 初始化堆積
        heap[i] = 0;
    int leaf = 1;                                   // 堆積樹葉的位置
    for (int i = 0; i < len; i++)                   // 插入所有的元素
    {
        heap[leaf] = arr[i];                        // 先放在樹葉的位置
        int tmp = leaf;                             // 調整堆積
        while (heap[tmp / 2] > heap[tmp])           // 如果父節點大於子節點
        {
            swap(&heap[tmp / 2], &heap[tmp]);       // 交換父節點與子節點
            tmp /= 2;                               // 繼續看祖父節點
        }
        leaf++;                                     // 插入完成後樹葉的位置遞增
    }
    leaf -= 1;                                      // 調整樹葉的位置到有元素的空間
    for (int i = 0; i < len; i++)                   // 取得所有元素
    {
        swap(&heap[1], &heap[leaf]);                // 交換樹根到樹葉的位置
        arr[i] = heap[leaf];                        // 取得樹葉的值
        leaf--;                                     // 裁掉樹葉
        int tmp = 1;                                // 調整堆積（從樹根開始）
        while ((tmp * 2) <= leaf)                   // 如果還有子節點
        {
            int left = tmp * 2;                     // 左子節點的註標
            int right = tmp * 2 + 1;                // 右子節點的註標
            if (right > leaf)                       // 右子節點超過範圍
                right = left;                       // 假裝左子節點為右子節點
            int target;                             // 取得較小的節點
            if (heap[left] < heap[right])           // 左子節點比較小
                target = left;                      // 往左子節點的方向調整
            else                                    // 右子節點比較小
                target = right;                     // 往右子節點的方向調整
            if (heap[tmp] > heap[target])           // 子節點比較小
                swap(&heap[tmp], &heap[target]);    // 交換子節點到樹根的位置
            tmp = target;                           // 往下一層調整
        }
    }
    delete heap;                                    // 清理空間
}
...
{% endcodeblock %}

自從上了演算法課後，課程中學到了更精闢的堆積處理技巧：

* 獨立出「從指定節點調整堆積」的函數
* 直接塞入所有資料到堆積，然後從倒數第二層調整堆積至樹根
* 取出資料直接採用覆蓋的方式，而非資料交換

這個做法大幅度降低了資料在堆積中搬移與交換的時間。

{% codeblock lang:cpp %}
...
/* 從指定節點調整堆積 */
void restore(int node, int *heap, int leaf)
{
    while ((node * 2) <= leaf)                  // 如果還有子節點
    {
        int left = 2 * node;                    // 左子節點的註標
        int right = 2 * node + 1;               // 右子節點的註標
        if (right > leaf)                       // 右子節點超過範圍
            right = left;                       // 假裝左子節點為右子節點
        int target;                             // 取得較小的節點
        if (heap[left] < heap[right])           // 左子節點比較小
            target = left;                      // 往左子節點的方向調整
        else                                    // 右子節點比較小
            target = right;                     // 往右子節點的方向調整
        if (heap[node] < heap[target])          // 如果子節點比較大
            break;                              // 直接結束
        swap(&heap[node], &heap[target]);       // 交換子節點到根的位置
        node = target;                          // 往下一層調整
    }
}
...
/* 推積排序 */
void heap_sort(int *arr, int len)
{
    int *heap = new int[len + 1];               // 宣告堆積
    for (int i = 0; i < len; i++)               // 先把所有資料塞入堆積
        heap[i + 1] = arr[i];
    for (int i = (int)(len / 2); i >= 1; i--)   // 從倒數第二層開始調整堆積
        restore(i, heap, len);
    int index = 0;                              // 從堆積回存資料
    for (int i = len; i >= 1; i--)              // 對每筆資料
    {
        arr[index++] = heap[1];                 // 從樹根取回資料
        heap[1] = heap[i];                      // 把樹葉移到樹根
        restore(1, heap, i);                    // 重新調整堆積
    }
    delete heap;                                // 清理空間
}
...
{% endcodeblock %}

# Stooge Sort
中文為「臭皮匠排序」
《算法導論》思考題中的低效排序算法，  
雖然算法本身不實用，但是很好的練習題材。

概念很簡單，從最大的序列開始，如果第一個跟最後一個順序不對則交換，  
如果序列大於三，則依序對「前2/3個元素」、「後2/3個元素」、「前2/3個元素」，  
重複使用臭皮匠排序，最後就會排完。

{% note info %}
wikipedia 的說明簡單明瞭，可參閱 [wikipedia: Stooge sort](https://en.wikipedia.org/wiki/Stooge_sort)
{% endnote %}

## 實作

{% codeblock lang:cpp %}
...
/* 臭皮匠排序 */
void stooge_sort(int *arr, int len)
{
    if (arr[0] > arr[len - 1])              // 如果順序不對則交換
        swap(&arr[0], &arr[len - 1]);
    if (len >= 3)                           // 序列長度大於 3
    {
        int tmp = (int)(len / 3);           // 分成 3 等份
        stooge_sort(arr, len - tmp);        // 前 2/3 個元素排序
        stooge_sort(arr + tmp, len - tmp);  // 後 2/3 個元素排序
        stooge_sort(arr, len - tmp);        // 前 2/3 個元素排序
    }
}
...
{% endcodeblock %}

# Sleep Sort
中文為「睡眠排序」  
充滿魔性的排序方法，根據數值的大小設定延遲進入陣列的時間。

{% note warning %}
等待時間的單位越小，越容易給出錯誤的答案。
{% endnote %}

## 實作
{% codeblock lang:cpp %}
...
#include <thread>
...
/* 執行序的函數 */
void wait(int value, int *arr, int *index)
{
    this_thread::sleep_for(chrono::milliseconds(value));    // 設定延遲時間
    arr[*index] = value;                                    // 讓數值進入陣列
    (*index)++;                                             // 累計註標
}

void sleep_sort(int *arr, int len)
{
    thread *tasks = new thread[len];                        // 宣告執行緒
    int index = 0;                                          // 設定註標
    for (int i = 0; i < len; i++)                           // 為每個元素設定執行緒函數
        tasks[i] = thread(wait, arr[i], arr, &index);       // 傳入數值、陣列的位置、註標的位置
    for (int i = 0; i < len; i++)                           // 開始讓每個元素的執行緒函數執行
        tasks[i].join();
    delete tasks;                                           // 清理空間
}
...
{% endcodeblock %}

# Bogo Sort
中文為「猴子排序」  
簡單的說，就是隨機洗牌，然後檢查是否排好的排序算法。  
雖然不實用，但是具有特別的教育意義。

## 實作
{% codeblock lang:cpp %}
...
void bogo_sort(int *arr, int len)
{
    srand(time_t(NULL));                        // 設定亂數種子
    bool sorted = false;                        // 排序未完成
    while (sorted == false)                     // 如果排序未完成
    {
        sorted = true;                          // 假設排序完成
        for (int i = 0; i < len; i++)           // 隨機把位置上的元素跟其他元素交換
            swap(&arr[i], &arr[rand() % len]);
        for (int i = 1; i < len; i++)           // 檢查排序是否完成
            if (arr[i] < arr[i - 1])            // 如果排序沒有完成
                sorted = false;                 // 假設錯誤
    }
}
...
{% endcodeblock %}

{% note danger %}
注意不要輸入過大的測資，以免當機。
{% endnote %}

# 綜合評估

<table><tr><th>中文名稱</th><th>英文名稱</th><th>最糟複雜度</th><th>最優複雜度</th><th colspan="3">簡介</th></tr><tr><td>氣泡排序</td><td>Bubble Sort</td><td>$O(n^{2})$</td><td>$O(n)$</td><td colspan="3">依序選擇相鄰的元素比較、交換的排序方法</td></tr><tr><td>選擇排序</td><td>Selection Sort</td><td>$O(n^{2})$</td><td>$O(n)$</td><td colspan="3">重複在未排序的區間選擇最小的放到正確的位置</td></tr><tr><td>插入排序</td><td>Insertion Sort</td><td>$O(n^{2})$</td><td>$O(n)$</td><td colspan="3">移動其他元素，並在找到插入點時插入正確的元素</td></tr><tr><td>雞尾酒排序</td><td>Cocktail Sort</td><td>$O(n^{2})$</td><td>$O(n)$</td><td colspan="3">左右來回的氣泡排序</td></tr><tr><td>梳排序</td><td>Comb Sort</td><td>$O(n^{2})$</td><td>$O(nlg(n))$</td><td colspan="3">間距上的元素順序不符則交換，間距逐次遞減</td></tr><tr><td>地精排序</td><td>Gnome Sort</td><td>$O(n^{2})$</td><td>$O(n)$</td><td colspan="3">到未排序的區間透過相鄰交換，將元素換到正確的位置上</td></tr><tr><td>奇偶排序</td><td>Odd-even Sort</td><td>$O(n^{2})$</td><td>$O(n)$ *平行</td><td colspan="3">分奇數位置、偶數位置，分別做氣泡排序</td></tr><tr><td>希爾排序</td><td>Shell Sort</td><td>$O(n^{2})$</td><td>$O(nlg(n))$</td><td colspan="3">對固定間距的元素做插入排序，間距逐次遞減</td></tr><tr><td>桶子排序</td><td>Bucket Sort</td><td>$O(n^{2})$</td><td>-</td><td colspan="3">將元素分群，對不同群做好排序再合併</td></tr><tr><td>計數排序</td><td>Counting Sort</td><td>$O(n+k)$</td><td>-</td><td colspan="3">紀錄每種元素的出現次數，利用出現次數重新排列數字</td></tr><tr><td>基數排序</td><td>Radix Sort</td><td>$O(wn)$</td><td>-</td><td colspan="3">依序對每一位做排序，位數逐次遞增（或遞減）</td></tr><tr><td>合併排序</td><td>Merge Sort</td><td>$O(nlg(n))$</td><td>$O(n)$</td><td colspan="3">將元素分成兩半，直至無法分開後，依照順序合併</td></tr><tr><td>快速排序</td><td>Quick Sort</td><td>$O(n^{2})$</td><td>$O(nlg(n))$</td><td colspan="3">選擇參考元素，將其他元素與其比較並放到其中一邊</td></tr><tr><td>二元搜尋樹</td><td>Binary Search Tree</td><td>$O(n^{2})$</td><td>$O(nlg(n))$</td><td colspan="3">利用資料建立一顆二元搜尋樹後透過中序走訪取得元素</td></tr><tr><td>堆積排序</td><td>Heap Sort</td><td>$O(nlg(n))$</td><td>$O(nlg(n))$</td><td colspan="3">利用資料建立堆積，依序取出堆積的樹根，再調整堆積</td></tr><tr><td>臭皮匠排序</td><td>Stooge Sort</td><td>$O(n^{lg(3)/lg(1.5)})$</td><td>$O(n^{lg(3)/lg(1.5)})$</td><td colspan="3">起始結束位置不對則交換，遞迴調用前、後、前2/3個元素</td></tr><tr><td>睡眠排序</td><td>Sleep Sort</td><td>$O(max(n))$</td><td>$O(max(n))$</td><td colspan="3">利用數值本身的大小讓系統等待，結束等待同時取回元素</td></tr><tr><td>猴子排序</td><td>Bogo Sort</td><td>$O(\infty)$</td><td>$O(n)$</td><td colspan="3">亂數洗牌，直到順序正確為止</td></tr></table>

# 排序動畫演示

{% jsfiddle L1by5kpt result,js,html,css dark 100% 420px %}

# 效能評估演示

{% jsfiddle u0pnrwqu result,js,html,css dark 100% 600px %}

# 參考資料
參考資料沒有先後關係。

* [wikipedia: Sorting algorithm](https://en.wikipedia.org/wiki/Sorting_algorithm)
* [wikipedia: Bubble sort](https://en.wikipedia.org/wiki/Bubble_sort)
* [wikipedia: Selection sort](https://en.wikipedia.org/wiki/Selection_sort)
* [wikipedia: Insertion sort](https://en.wikipedia.org/wiki/Insertion_sort)
* [wikipedia: Cocktail shaker sort](https://en.wikipedia.org/wiki/Cocktail_shaker_sort)
* [wikipedia: Comb sort](https://en.wikipedia.org/wiki/Comb_sort)
* [wikipedia: Gnome sort](https://en.wikipedia.org/wiki/Gnome_sort)
* [wikipedia: Odd-even sort](https://en.wikipedia.org/wiki/Odd%E2%80%93even_sort)
* [wikipedia: Shell sort](https://en.wikipedia.org/wiki/Shellsort)
* [wikipedia: Bucket sort](https://en.wikipedia.org/wiki/Bucket_sort)
* [wikipedia: Counting sort](https://en.wikipedia.org/wiki/Counting_sort)
* [wikipedia: Radix sort](https://en.wikipedia.org/wiki/Radix_sort)
* [wikipedia: Merge sort](https://en.wikipedia.org/wiki/Merge_sort)
* [wikipedia: Quicksort](https://en.wikipedia.org/wiki/Quicksort)
* [wikipedia: Tree sort](https://en.wikipedia.org/wiki/Tree_sort)
* [wikipedia: Binary search tree](https://en.wikipedia.org/wiki/Binary_search_tree)
* [wikipedia: Heapsort](https://en.wikipedia.org/wiki/Heapsort)
* [wikipedia: Stooge sort](https://en.wikipedia.org/wiki/Stooge_sort)
* [wikipedia: Sleep sort](https://it.wikipedia.org/wiki/Sleep_sort)
* [wikipedia: Bogosort](https://en.wikipedia.org/wiki/Bogosort)
* [排序之桶子排序法(Bucket Sort)](http://marklin-blog.logdown.com/posts/1910182)
* [C++ 的多執行序程式開發 Thread：基本使用](https://kheresy.wordpress.com/2012/07/06/multi-thread-programming-in-c-thread-p1/)
* [程序员的自我修养（五）：C++ 多线程编程初步](https://liam0205.me/2017/05/16/first-step-on-multithread-programming-of-cxx/)
* [经典排序算法 - 地精排序Gnome Sort](http://www.cnblogs.com/kkun/archive/2011/11/23/gnome_sort.html)
* [stackoverflow: Is there any overhead for using variable-length arrays?](https://stackoverflow.com/questions/2034712/is-there-any-overhead-for-using-variable-length-arrays)
* [stackoverflow: CodeJam 2011: Solution for Gorosort?](https://stackoverflow.com/questions/5928699/codejam-2011-solution-for-gorosort)
* [stackoverflow: Most efficient/elegant way to clip a number?](https://stackoverflow.com/questions/9323903/most-efficient-elegant-way-to-clip-a-number)
* [Hacker News: Sleep sort](https://news.ycombinator.com/item?id=8798202)
* [cplusplus: sleep_for](http://www.cplusplus.com/reference/thread/this_thread/sleep_for/)
* [cplusplus: ceil](http://www.cplusplus.com/reference/cmath/ceil/)
* [cplusplus: pow](http://www.cplusplus.com/reference/cmath/pow/)
* [cplusplus: log](http://www.cplusplus.com/reference/cmath/log/)
* [cplusplus: swap](http://www.cplusplus.com/reference/algorithm/swap/)
* [ISO/IEC 9899 - Programming languages - open-std](http://www.open-std.org/jtc1/sc22/wg14/www/docs/n1124.pdf)
* [cplusplus: A little doubt about delete](http://www.cplusplus.com/forum/beginner/51496/)
* [cppreference: sleep_for](http://en.cppreference.com/w/cpp/thread/sleep_for)
* [cppreference: clamp](http://en.cppreference.com/w/cpp/algorithm/clamp)
* [Geeks for Geeks: Merge Sort](https://www.geeksforgeeks.org/merge-sort/)
* [Geeks for Geeks: Iterative Merge Sort](https://www.geeksforgeeks.org/iterative-merge-sort/)
* [徐熊健@資料結構與演算法 Data Structures and Algorithms](https://sites.google.com/site/sjdsalg/home)
* [百度百科: TimSort](https://baike.baidu.com/item/TimSort/10279720?fr=aladdin)
* [[译]理解TIMSORT, 第一部分：适应性归并排序(ADAPTIVE MERGESORT)](http://www.blogjava.net/xiaomage234/archive/2015/02/26/423059.html)
* [Oracle Java: Class Arrays](https://docs.oracle.com/javase/9/docs/api/java/util/Arrays.html#sort-java.lang.Object:A-)
