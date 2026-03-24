---
title: 陣列 Array
permalink: array/
categories: (legacy) algorithm
date: 2021-09-21
mathjax: false
---
本篇是紀載了關於陣列的筆記；
原本是跟指標寫在一起的，後來發現跑題太嚴重就獨立一篇出來了。

<!-- more -->

{% note warning %}
為避免冗餘，本文的程式範例皆省略起始函數及標頭檔，即 `main` 跟 `include` 等程式碼請自行補完
{% endnote %}

# 陣列宣告

陣列是一種基本的資料結構，它會分配「連續」的記憶體位置給開發者使用。
更簡單的說，就是宣告多筆「某種類型」的資料。

用 C 語言宣告陣列的例子：

{% codeblock lang:c %}
int arr[10];                        // 宣告陣列
{% endcodeblock %}

除此之外，宣告完陣列後，還會額外取得一個「指向陣列開頭」的指標，
具體而言，指向陣列開頭的意思是：

{% codeblock lang:c %}
int arr[10];                        // 宣告陣列
if(*arr == arr[0]) printf("Y");     // 印出 "Y"
if(arr == &arr[0]) printf("Y");     // 印出 "Y"
{% endcodeblock %}

從這邊可以看出，陣列宣告時附贈的一個起始位置，是第一個元素的記憶體位置。

{% note info %}
注意 `arr[0]` 其實就是 `*(arr + 0)`；
同樣 `&arr[0]` 也是 `&(*(arr + 0))` 即 `arr + 0`。
{% endnote %}

# 陣列初始化

通常來說，如果直接有要放入陣列的值，就直接放入了；
但有時會需要先準備空陣列的情況。

C 語言中一種常見的初始化方法是直接透過函數：

{% codeblock lang:c %}
int arr[10];
memset(arr, 0, 10); // 初始化
{% endcodeblock %}

可是這個 `memset` 函數，實際上式定義在 `string.c` 下，目標是用於字串初始化的函數。

另一個比較奇怪的寫法是透過大括號：

{% codeblock lang:c %}
int arr1[10] = {0};
int arr2[10] = {0,}; // 或這種
{% endcodeblock %}

原理是根據 C99 標準，裡面有一段話：

{% blockquote %}
If there are fewer initializers in a brace-enclosed list than there are elements or members of an aggregate, or fewer characters in a string literal used to initialize an array of known size than there are elements in the array, the remainder of the aggregate shall be initialized implicitly the same as objects that have static storage duration.
{% endblockquote %}

意思是說，如果一個大括號封閉的初始化值「數量少於宣告的空間」的話，
那麼「剩下的」會初始化為 `0` 值。換句話說：

{% codeblock lang:c %}
int arr1[10] = {1, 2, 3}; // 前三格為 1,2,3 剩下的 7 格會被初始化為 0
int arr2[10] = {0};       // 第 1 格為 0 剩下的 9 格會被初始化為 0
{% endcodeblock %}

另外下面 2 種寫法是有問題的：

{% codeblock lang:c %}
int arr1[10] = 0;  // Invalid initializer
int arr2[10] = {}; // ISO C forbids empty initializer braces
{% endcodeblock %}

但 GCC 針對 `{}` 會自動將陣列初始化為 `0` 值。

# 傳遞陣列

由於陣列有多個元素，傳遞給函數時，可以直接給一個起始位置：

{% codeblock lang:cpp %}
void add_one(int *arr, int size) {
    for(int i = 0; i < size; i++)
        arr[i]++;
}

int x[10] = {0};  // 初始化為 0
add_one(x, 10);   // 傳入函數，每個位置都加 1
{% endcodeblock %}

這裡希望大家把指標當成是一般的變數（存位置而已）
所以所謂的「傳陣列」其實就是把 `起始位置` 跟 `大小` 傳入函數。

另一個常見的傳入方式是 `起始位置` 跟 `結束位置` 的方法：

{% codeblock lang:cpp %}
void add_one(int *begin, int *end) {
    for(int *tmp = begin; tmp < end; tmp++)
        (*tmp)++;
}

int x[10] = {0};    // 初始化為 0
add_one(x, x+10);   // 傳入函數，每個位置都加 1
{% endcodeblock %}

{% note warning %}
通常第二種傳法的 `結束位置` 是再後一格的位置；
通常 `x[10]` 的結束是 `x+10` 可是最後可存取的位置是 `x+9`；
像是 C++ 的 algorithm 的 sort 函數就是第二種。
{% endnote %}

{% note info %}
對指標做加法，像 `x[10]` 的 `x+1` 意思是 `x`（起始位置）的下 `1` 格，
實際位置偏移 `sizeof(int)` 而不是 `1`。
{% endnote %}

# 字元陣列

在 C 語言中，用字元陣列來表示字串（string），
所有字串相關的函數都放在 `<string.h>` 中，只要符合：

* 它是一個字元陣列
* 它尾末有一個 `\0`（`0x00`） 結束符

都可以直接視做字串；
反過來說，字串可以視為一種特別的字元陣列。

{% codeblock lang:c %}
char str[20] = "hello world";
{% endcodeblock %}

{% codeblock lang:x86asm %}
0x7fffffffdc70: 0x68  0x65  0x6c  0x6c  0x6f  0x20  0x77  0x6f
0x7fffffffdc78: 0x72  0x6c  0x64  0x00  0x00  0x00  0x00  0x00
0x7fffffffdc80: 0x00  0x00  0x00  0x00  0xff  0x7f  0x00  0x00
{% endcodeblock %}

看起來他存的是 `0x68  0x65  0x6c  0x6c  0x6f  0x20  0x77  0x6f 0x72  0x6c  0x64`
這個數字叫作「ASCII」他們一一對應剛剛的 `hello world`。

{% note info %}
請參考 [Wikipedia: ASCII](https://en.wikipedia.org/wiki/ASCII)
{% endnote %}

從 `0x7fffffffdc70` 到 `0x7fffffffdc83` 共 20 格是我們可以用的範圍。

{% note info %}
因為是 16 進位，數學應該沒問題吧？ `0x83 - 0x70 = 0x13`
換成 10 進位，所以 `1 * 16 + 3 = 19` 恩？少了一格？

其實用註標相減要再加 1（也就說 `0x83 - 0x70 + 0x01 = 0x14` 才對）
考慮「1, 2, 3，一共有幾個數字？」這種簡化的問題就很清楚了。
{% endnote %}

也可以顯式地將尾末的結束符寫出：

{% codeblock lang:c %}
char str[20] = "hello world\0";
{% endcodeblock %}

看了上例就會知道，這個 `str` 其實只能放 19 個字，不要多放了！

這一節最後來疑難排解一些常見的問題：

{% codeblock lang:c %}
int main(void)
{
    char str[3] = "abc";
    printf("%p\n", str); // 0x7fffffffdc89
    printf("%s\n", str); // abc
}
{% endcodeblock %}

嘿？不是只能放 2 個字嗎？為什麼可以正常顯示？
說起來是這樣的，因為「恰巧」他的下一位是 `0x00`（`\0`）

{% codeblock lang:x86asm %}
0x7fffffffdc80:  0x80  0xdd  0xff  0xff  0xff  0x7f  0x00  0x00
0x7fffffffdc88:  0x00  0x00  0x00  0x00  0x00  0x61  0x62  0x63
0x7fffffffdc90:  0x00  0x00  0x00  0x00  0x00  0x00  0x00  0x00
{% endcodeblock %}

既然已知電腦會配置連續記憶體，那來做個實驗，我們插入一行：

{% codeblock lang:c %}
int main(void)
{
    char str[3] = "abc";
    int a = 48;          // 48 對應的字元為 "0"
    printf("%p\n", str); // 0x7fffffffdc89
    printf("%s\n", str); // abc0
}
{% endcodeblock %}

記憶體中：

{% codeblock lang:x86asm %}
0x7fffffffdc80:  0x80  0xdd  0xff  0xff  0xff  0x7f  0x00  0x00
0x7fffffffdc88:  0x00  0x61  0x62  0x63  0x30  0x00  0x00  0x00  
0x7fffffffdc90:  0x00  0x00  0x00  0x00  0x00  0x00  0x00  0x00
{% endcodeblock %}

真不巧，剛剛的輸出為 `abc0`，
因為記憶體中，下一位「恰好」是我們塞進去的那個 `48` 對應的 ASCII 為字元「0」。
也許我們還是手動加個 `\0` 阻止這種事情發生比較好。

關於長度的定義：

* `字串長度` 為「字串開頭」直到「`\0`（這傢伙不算在內）」為止的長度
* `字元陣列長度` 為「宣告的字元陣列的大小」

前者透過 `<string.h>` 的函數 `strlen` 取得，後者則是透過 `sizeof` 取得。
綜上所述，要是你沒有手動放 `\0` 又「恰巧」後面不為 `\0` 的話，你就會拿到完全不對的結果。

注意 `char s1[]` 跟 `char *s2`本質上是有差異的：

{% codeblock lang:c %}
char s1[] = "hello"; // 是指宣告一個字元陣列放 {'h', 'e', 'l', 'l', 'o', '\0'}
char *s2 = "hello";  // 是指宣告一個指標，指向 "hello" 靜態空間的起始位置

s1[0] = 'p';         // 可修改，印出會是 "pello"
s2[0] = 'n';         // 不可修改，會出錯
{% endcodeblock %}

# 多維陣列

C 語言的初學者常常會卡在多維陣列一段時間，但多維陣列的本質就是一維陣列（應該要視為記憶體中的一塊空間）來看待。

雖然說是多維，但實際上筆者除寫 Python 外，很少看過超過 3 維以上的陣列（或列表、張量）結構，
比較常見的多維陣列可能是 2 至 3 維，初學可以把它當成「陣列的陣列」來看：

{% codeblock lang:c %}
int arr1[10][10];     // 一個二維陣列
int arr2[10][10][10]; // 一個三維陣列

...

// 存取 arr1 的第 6 個陣列，再存取第 4 個值
printf("%d\n", arr1[5][3]);

// 存取 arr2 的第 2 個陣列的陣列、再存取第 3 個陣列、再存取第 4 個值
printf("%d\n", arr2[1][2][3]);

// 存取 arr1 的第 7 個陣列（起始位置）
printf("%p\n", arr1[6]);
{% endcodeblock %}

## 一維轉換

多維陣列轉換成一維在 2D 遊戲中是非常常用的概念，
主要是用來算圖片編號、用來記錄地圖位置等等。

{% codeblock lang:c %}
int arr1[100];    // 一維陣列
int arr2[10][10]; // 二維陣列

...

// 將 arr1 的值塞給 arr2
for(int i = 0; i < 100; i++)
{
    int y = i / 10;
    int x = i % 10;
    arr2[y][x] = arr1[i];
}

// 將 arr2 的值塞給 arr1
for(int y = 0; y < 10; y++)
    for(int x = 0; x < 10; x++)
        arr1[y * 10 + x] = arr2[y][x];
{% endcodeblock %}

更多維度也是同理（以四維為例）：

{% codeblock lang:c %}
int arr1[120];        // 一維陣列
int arr2[2][3][4][5]; // 多維陣列

for(int i = 0; i < 120; i++)
{
    int a = (i / (3 * 4 * 5));
    int b = (i /     (4 * 5)) % 3;
    int c = (i /         (5)) % 4;
    int d = (i              ) % 5;
    arr2[a][b][c][d] = arr1[i];
}

{% endcodeblock %}

多維轉換的核心想法是算這個註標分成幾塊會是第幾個。

以 arr1\[100\] 為例，而 arr2 有：

* arr2\[0\] 是一個共 3\*4\*5 = 60 個元素的陣列
* arr2\[1\] 是一個共 3\*4\*5 = 60 個元素的陣列

共 100 個元素，每 60 個放一組，逢 2 循環（僅 1 輪），顯然放在 arr2\[(100/60)%2\] 中。

接下來考慮 arr2 有：

* arr2\[0\]\[0\] 是一個共 4\*5 = 20 個元素的陣列
* arr2\[0\]\[1\] 是一個共 4\*5 = 20 個元素的陣列
* arr2\[0\]\[2\] 是一個共 4\*5 = 20 個元素的陣列
* arr2\[1\]\[0\] 是一個共 4\*5 = 20 個元素的陣列
* arr2\[1\]\[1\] 是一個共 4\*5 = 20 個元素的陣列
* arr2\[1\]\[2\] 是一個共 4\*5 = 20 個元素的陣列

共 100 個元素每 20 個放一組，逢 3 循環（僅 2 輪），顯然放在 arr2\[1\]\[(100/20)%3\] 中。

以此類推。

## 行列優先序

行列優先序（Row- / Column- major order）是指安排記憶體的方式，由於高階語言的特性，所以理論上抽象的記憶體位置是不影響存取的，作業系統會自動幫你處理這個部分，但符合底層設計的程式會有更好的效能。

{% note info %}
主要的原因是機器跟作業系統的設計，牽涉記憶體的分層架構（hierarchical architecture）在空間區域性（locality of space）下，讀取時會抓一大塊資料（分頁）到快取記憶體。

此時要是空間區域性失效，即每次存取的值都在不同的分頁中，就會導致大量的分頁錯誤（page faults）讓作業系統需要大量中斷（interrupt）來幫你處理，具體來說就是把正確的分頁放到快取中，這個狀態被稱為「顛簸（thrashing）」。
{% endnote %}

來看例子，下面的程式：

{% codeblock lang:c %}
#define N (1000000)
...
int arr[N][N];

for(int i = 0; i < N; i++)
    for(int j = 0; j < N; j++)
        arr[i][j] = i * N + j;
{% endcodeblock %}

會快過下面這個： 

{% codeblock lang:c %}
#define N (1000000)
...
int arr[N][N];

for(int j = 0; j < N; j++)
    for(int i = 0; i < N; i++)
        arr[i][j] = i * N + j;
{% endcodeblock %}

## 傳遞多維陣列

傳遞多維陣列到函數，總共有三種方法：

第一種是維持陣列的樣貌：

{% codeblock lang:c %}
void f(int arr[][2][3]) {
    ...
}
...
int arr[1][2][3];
f(arr);
{% endcodeblock %}

很明顯，這個函數告訴你要準備傳入一個陣列，通常會搭配長度來使用：

{% codeblock lang:c %}
void f(int arr[][2][3], int len) {
    ...
}
...
int arr[1][2][3];
f(arr, 1);
{% endcodeblock %}

第二種是將 `[]` 改成指標 `*` 的形式：

{% codeblock lang:c %}
void f(int *arr[2][3]) {
    ...
}
...
int arr[1][2][3];
f(arr);
{% endcodeblock %}

但這個看起來就像是在說「我要傳入 2\*3 個 int 指標」而不是我要傳入多維陣列。

最後一個則是單個參數中，不提供任何大小訊息，
直接傳遞起始位置，將整個陣列當成指標來用：

{% codeblock lang:c %}
void f(int ***arr) {
    ...
}
...
int arr[1][2][3];
f(arr);
{% endcodeblock %}

{% note info %}
除指標外，其他的核心要旨都是「除第一個維度外，其他維度都要顯式寫出。」
{% endnote %}
