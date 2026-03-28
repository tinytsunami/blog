---
title: 指標 Pointer
permalink: pointer/
categories: legacy-algorithm
date: 2020-08-04
mathjax: false
---
本篇是紀載了關於指標的筆記。我稍微調整了撰寫的順序。
另外就是增加了一些額外的知識來補足一些內容。

<!-- more -->

{% note warning %}
為避免冗餘，本文的程式範例皆省略起始函數及標頭檔，即 `main` 跟 `include` 等程式碼請自行補完
{% endnote %}

# 運算子

指標的運算子，書中大致上會寫兩種：

* 取址運算子
* 取值運算子

但是如果考慮可以作用在位置上的運算子，其數量應該更多，比方說加法。

## 取址運算子
取址運算子是「取得位置」的運算子。
它的符號 `&` 加在變數前面可以取得存放這個變數的位置。

{% codeblock lang:c %}
int num;
&num;    // 取得位置
{% endcodeblock %}

這是指標最基本的運算子，也是較不複雜的一個。

## 取值運算子
取值運算子有兩個用途：

* 宣告指標
* 取得資料

如果一開始不分離兩個功能，可能會在之後搞得亂七八糟，
它的符號 `*` 加在變數前面可能有兩種作用，請看它所在的位置判斷。

{% codeblock lang:c %}
int *num; // 功能 1：宣告指標
*num;     // 功能 2：取得資料
{% endcodeblock %}

{% note info %}
如果 `*` 出現在宣告，則代表宣告指標；除此之外是取得資料
{% endnote %}

# 指標與變數

搭配取址運算子，可以寫出普通程式設計教科書的範例：

{% codeblock lang:c %}
int iNum;               // 宣告變數
int *pNum;              // 宣告指標
iNum = 10;              // 設定變數值
pNum = &iNum;           // 設定指標指向變數
*pNum += 2;             // 指標指向的變數加 2
printf("%d", iNum);     // 印出 12
{% endcodeblock %}

我會建議讀者能把指標想成變數：

{% codeblock lang:c %}
int iNum;               // 宣告變數
int *pNum;              // 宣告指標
iNum = 10;              // 設定變數值
pNum = &iNum;           // 設定指標值
*pNum += 2;             // 指標「存放的」變數加 2
printf("%d", iNum);     // 印出 12
{% endcodeblock %}

以上面範例來說，傳統的畫法：

| 名稱 | 資料 | 指向 |
|:----:|:----:|:-:|
| iNum |  10  | x |
| pNum |  10  | ↑ |

{% note warning %}
筆者實際上不喜歡使用箭頭的指標畫法（因為其實他是「位置的值」）；
原因是會使初學者混亂，但如果彼此對此都很熟悉，那討論時使用倒無所謂。
{% endnote %}

筆者剛剛提到「把指標想成變數」這件事情，
原因是一旦這樣想像，很多事情就變得更清晰了：

| 變數名稱 | 變數資料 | 變數位置 |
|:----:|:----------:|:--------:|
| iNum |        10  | 0x7fffffffdc74 |
| pNum |  `0x7fffffffdc74` | 0x7fffffffdc78 |

當我們執行：
{% codeblock lang:c %}
pNum = &iNum; // 設定指標值
{% endcodeblock %}

此時的 pNum 的「變數資料」會寫入「iNum 的位置」（也就是 &iNum）
然後一連串的事情，就是「使用 pNum 保存的資料來做某些事」

接下來我們可以看看函數在傳值、傳址，傳參考分別的情況。

{% note info %}
C 語言只有傳值、傳址，傳參考是 C++ 中新加入的內容；
不過實際上這三件事情，都是「傳值」才對。
{% endnote %}

## 傳值

我們先從傳值開始，程式應該很好理解：

{% codeblock lang:c %}
void add_by_value(int a, int b)
{
    a += b;
}

int iNum = 10;             // 宣告變數
add_by_value(iNum, 2);     // 調用傳值的函數
printf("%d", iNum);        // 10
{% endcodeblock %}

| 變數名稱 | 變數資料 | 變數位置 |
|:----:|:----------:|:--------:|
| iNum |        10  | 0x7fffffffdc7c |
|    a |        10  | 0x7fffffffdc5c |
|    b |         2  | 0x7fffffffdc58 |

當 `add_by_value` 調用時，程式另外建立 `a` 跟 `b` 區域變數；
生命週期是直到函數結束。很單純的小程式。

## 傳址

接著我們看傳址：

{% codeblock lang:c %}
void add_by_pointer(int *a, int b)
{
    *a += b;
}

int iNum = 10;              // 宣告變數
add_by_pointer(&iNum, 2);   // 調用傳值的函數
printf("%d", iNum);         // 12
{% endcodeblock %}

| 變數名稱 | 變數資料 | 變數位置 |
|:----:|:----------:|:--------:|
| iNum |        10  | `0x7fffffffdc7c` |
|    a | `0x7fffffffdc7c`  | 0x7fffffffdc5c |
|    b |         2  | 0x7fffffffdc58 |

當使用傳址後，當 `a` 傳入時，實際上是傳入 `iNum` 的記憶體位置；
所以才有「傳址」也是「傳值」一說。

## 傳參考

最後來看傳參考。是三者中最特別的東西。

{% codeblock lang:cpp %}
void add_by_reference(int &a, int b)
{
    a += b;
}

int iNum = 10;              // 宣告變數
add_by_reference(iNum, 2);  // 調用傳值的函數
printf("%d", iNum);         // 12
{% endcodeblock %}

| 變數名稱 | 變數資料 | 變數位置 |
|:----:|:----------:|:--------:|
| iNum |        10  | `0x7fffffffdc7c` |
|    a |        10  | `0x7fffffffdc7c` |
|    b |         2  | 0x7fffffffdc5c |

從表很容易看出，實際上傳參考就是當成把傳入的值，取個別名而已；
從例子來看，變數 `a` 其實就是 `iNum` 的別名。

## 印出指標

如果要觀察指標，可以透過 `printf("%p", ...)` 輸出。

{% codeblock lang:c %}
int x = 0;
int *y = &x;
printf("%d (%p)\n", x, &x);                     // 0 (0x7ffd8443024c)
printf("%p (%p)\n", y, &y);                     // 0x7ffd8443024c (0x7ffd84430240)
printf("%s (%p)\n", "constant", &"constant");   // constant (0x55fdd9cbc016)
printf("%s (%p)\n", "constant", &"constant");   // constant (0x55fdd9cbc016)
{% endcodeblock %}

這裡可以看出，當編譯器處理常數字串時，不會記錄多餘的資訊，
常數字串 `constant` 被存在 `0x55fdd9cbc016` 位置，而重複存取會到同一個位置找來用。

{% note info %}
這裡的參數 `%p` 是輸出位置、而 `%d` 是輸出整數、然後 `%s` 是輸出字串。
請參閱 [cplusplus: printf](http://www.cplusplus.com/reference/cstdio/printf/)
{% endnote %}

# 動態宣告

指標的用法中，很常見的是動態宣告，其實就是執行期間去跟 OS 拿記憶體來用。

C 語言常使用：

{% codeblock lang:cpp %}
int *arr;                                   // 宣告指標
arr = (int*) malloc(sizeof(int) * 10);      // 拿記憶體（10個int），起始位置給 arr
/* Do Something */                          // 使用記憶體
free(arr);                                  // 把空間還給 OS
{% endcodeblock %}

{% note info %}
另一個常見的是使用 `calloc` 它會幫你初始化記憶體為 `0`。
請參閱 [cplusplus: calloc](http://www.cplusplus.com/reference/cstdlib/calloc/)
{% endnote %}

在 C 語言中，我們會在使用後透過 `free` 來釋放記憶體空間。

C++ 風格則是：

{% codeblock lang:cpp %}
int *arr;               // 宣告指標
arr = new int[10];      // 拿記憶體（10個int），起始位置給 arr
/* Do Something */      // 使用記憶體
delete arr;             // 把空間還給 OS
{% endcodeblock %}

在 C 語言中，我們會在使用後透過 `delete` 來釋放記憶體空間。

{% note warning %}
請務必在動態配置記憶體後，釋放掉記憶體。
{% endnote %}

# 指標的指標

到這個部份，解釋會開始變得複雜，
主要只是因為指標的指標講起來比較繞口。

實際上如果接受儲存的值為位置這個概念，
那指標的指標也會很容易理解。

{% codeblock lang:cpp %}
int iNum = 0;
int *a = &iNum; 
int **b = &a;
{% endcodeblock %}

| 變數名稱 | 變數資料 | 變數位置 |
|:----:|:----------:|:--------:|
| iNum |        10  | 0x7fffffffdc7c |
|    a |  0x7fffffffdc7c  | 0x7fffffffdc70 |
|    b |  0x7fffffffdc70  | 0x7fffffffdc68 |

指標的指標也是有動態宣告，用法跟單一指標一樣。
只是多重指向的指標動態宣告出來的必須是少一個指標：

{% codeblock lang:c %}
int **matrix;
matrix = (int **) malloc(sizeof(int *) * 10);
for(int i = 0; i < 10; i++)
    matrix[i] = (int *) malloc(sizeof(int) * 10);
{% endcodeblock %}

或是 C++ 風格：

{% codeblock lang:cpp %}
int **matrix;
matrix = new int*[10];
for(int i = 0; i < 10; i++)
    matrix[i] = new int[10];
{% endcodeblock %}

不過，如果理解記憶體配置，也許可以這樣分配：

{% codeblock lang:c %}
int *matrix;
matrix = (int *) malloc(sizeof(int) * 10 * 10);
matrix[i * 10 + j]; // 當成一個陣列來用
{% endcodeblock %}

# 函數指標

除了資料有指標外，實際上函數在宣告的時候也有位置：

{% codeblock lang:c %}
int foo(int a) { 
    return a;
}

int (*p)(int) = foo;
printf("%p", &foo); // 0x555555555149
printf("%p", p);    // 0x555555555149
{% endcodeblock %}

在 GDB 中，顯示的位址：

{% codeblock lang:x86asm %}
0x0000555555555149 <+0>:  endbr64 
0x000055555555514d <+4>:  push   %rbp
0x000055555555514e <+5>:  mov    %rsp,%rbp
0x0000555555555151 <+8>:  mov    %edi,-0x4(%rbp)
0x0000555555555154 <+11>: mov    $0x0,%eax
0x0000555555555159 <+16>: pop    %rbp
0x000055555555515a <+17>: retq   
{% endcodeblock %}

{% note info %}
請參閱 [Wikipedia: GNU Debugger](https://en.wikipedia.org/wiki/GNU_Debugger)
{% endnote %}

函數的位置其實就是指令開始的位置。
至於函數指標宣告有一個細節，就是當不寫括號時：

{% codeblock lang:c %}
int *p(int) = foo; // error
{% endcodeblock %}

而 `int *p` 相當於把 `int*` 看做一組，等價於 `(int*) p(int)`
編譯器看到 `int *p (int)` 的 `(int)` 就不知道你在寫什麼，會出錯：

{% codeblock lang:c %}
(int *) p(int) = foo; // error
{% endcodeblock %}

{% codeblock lang:shell %}
./main.c:10:15: error: expected expression before ‘int’
   10 |     (int *) p(int) = foo; // error
      |               ^~~
{% endcodeblock %}

函數指標呼叫時：

{% codeblock lang:c %}
(*p)();                 // 完整的寫法
p();                    // 簡寫
{% endcodeblock %}

相同地，函數其實也是簡寫：

{% codeblock lang:c %}
int (*p)(int) = &foo;   // 完整的寫法
int (*p)(int) = foo;    // 簡寫
{% endcodeblock %}

# void 指標

指標跟其他型別一樣，是可以強制轉型的。
比較特別的是指標存在一個稱為 `void *` 的東西。

{% codeblock lang:c %}
void *p;
{% endcodeblock %}

簡單說，這個 `void *` 是為了讓使用者「強制轉型」，從而確定型別；
像是 `void *malloc(size_t size);` 就是回傳 `void *`。

所以如果你不轉型，是無法使用的：

{% codeblock lang:c %}
void *p = malloc(sizeof(int));
*p = 10;                        // 無法使用
*((int *) p) = 10;              // 強制轉型後可用
{% endcodeblock %}

# 後記

這一節就真的是個人筆記了，初學者看看就好（雖然說順便學個 GDB 不是壞事），
所有東西在記憶體中都是有位置的，參考先前出現過的例子：

{% codeblock lang:c %}
int iNum;               // 宣告變數
int *pNum;              // 宣告指標
iNum = 10;              // 設定變數值
pNum = &iNum;           // 設定指標值
*pNum += 2;             // 指標「存放的」變數加 2
printf("%d", iNum);     // 印出 12
{% endcodeblock %}

我們編譯過後，透過 GDB 追蹤：

{% codeblock lang:shell %}
> gcc ./main.c -o ./main -fno-stack-protector
> gdb ./main
> run
> disas main
> break *0x0000555555555173
> run
{% endcodeblock %}

中斷點 break 後的位置請參考自己環境下的位置。

{% note info %}
這邊關閉了緩衝區防撞保護（Stack Smashing Protector）
請參閱 [OSDEV wiki: Stack SmashingProtector](https://wiki.osdev.org/Stack_Smashing_Protector)
{% endnote %}

反組譯的結果應該是：

{% codeblock lang:x86asm %}
0x0000555555555149 <+0>:  endbr64 
0x000055555555514d <+4>:  push   %rbp
0x000055555555514e <+5>:  mov    %rsp,%rbp
0x0000555555555151 <+8>:  sub    $0x10,%rsp
0x0000555555555155 <+12>: movl   $0xa,-0xc(%rbp)
0x000055555555515c <+19>: lea    -0xc(%rbp),%rax
0x0000555555555160 <+23>: mov    %rax,-0x8(%rbp)
0x0000555555555164 <+27>: mov    -0x8(%rbp),%rax
0x0000555555555168 <+31>: mov    (%rax),%eax
0x000055555555516a <+33>: lea    0x2(%rax),%edx
0x000055555555516d <+36>: mov    -0x8(%rbp),%rax
0x0000555555555171 <+40>: mov    %edx,(%rax)
0x0000555555555173 <+42>: mov    -0xc(%rbp),%eax
0x0000555555555176 <+45>: mov    %eax,%esi
0x0000555555555178 <+47>: lea    0xe85(%rip),%rdi   # 0x555555556004
0x000055555555517f <+54>: mov    $0x0,%eax
0x0000555555555184 <+59>: callq  0x555555555050 <printf@plt>
0x0000555555555189 <+64>: mov    $0x0,%eax
0x000055555555518e <+69>: leaveq 
0x000055555555518f <+70>: retq   
{% endcodeblock %}

我用 `#` 當成註解，標示成下面這樣：

{% codeblock lang:x86asm %}
0x0000555555555149 <+0>:  endbr64                    # 標記為有效分支（系統安全操作）

                                                     # 函數呼叫操作
0x000055555555514d <+4>:  push   %rbp                # 紀錄舊的 $rbp 暫存器
0x000055555555514e <+5>:  mov    %rsp,%rbp           # 移動 $rbp 到 $rsp（紀錄 $rsp）
0x0000555555555151 <+8>:  sub    $0x10,%rsp          # 將舊的 $rsp 減去 16 Bytes（宣告記憶體空間）

                                                     # iNum = 10;
                                                     # iNum 的位置是 $rbp-12
                                                     # 常數 10 為 0xA
0x0000555555555155 <+12>: movl   $0xa,-0xc(%rbp)     # 移動 10 到 iNum 的位置

                                                     # pNum = &iNum;
                                                     # pNum 的位置是 $rbp-8
0x000055555555515c <+19>: lea    -0xc(%rbp),%rax     # 將 iNum 的位置給 $rax
                                                     # lea mem,reg 指令不載入內容，mem 做完偏移就放到 reg
0x0000555555555160 <+23>: mov    %rax,-0x8(%rbp)     # 移動 %rax 的值給 pNum

                                                     # *pNum += 2;
                                                     # 等價於 *pNum = *pNum + 2;
                                                     # 分兩個部份做，先加 2 再賦值

                                                     # *pNum + 2
0x0000555555555164 <+27>: mov    -0x8(%rbp),%rax     # 移動 pNum 的值給 $rax（iNum 的位置）
0x0000555555555168 <+31>: mov    (%rax),%eax         # 移動 $rax 存的那個位置上的值給 $eax（10）
0x000055555555516a <+33>: lea    0x2(%rax),%edx      # 加載 $rax（10） 的值+2 放到 $edx（12）

                                                     # *pNum = *pNum + 2
0x000055555555516d <+36>: mov    -0x8(%rbp),%rax     # 讀取 pNum 的值給 $rax（iNum 的位置）
0x0000555555555171 <+40>: mov    %edx,(%rax)         # 將 $edx（12） 的值給 $rax（iNum 的位置）的值

                                                              # printf("%d", iNum);
0x0000555555555173 <+42>: mov    -0xc(%rbp),%eax              # 讀取 iNum 的值給 $eax
0x0000555555555176 <+45>: mov    %eax,%esi                    # 移動 $eax 的值給 $esi
0x0000555555555178 <+47>: lea    0xe85(%rip),%rdi             # 將 $rip+0xe85（"%d\n"）給 $rdi
0x000055555555517f <+54>: mov    $0x0,%eax                    # 清空 $eax
0x0000555555555184 <+59>: callq  0x555555555050 <printf@plt>  # 呼叫 printf
0x0000555555555189 <+64>: mov    $0x0,%eax                    # 清空 $eax

                                                     # 函數離開操作，等價於：
0x000055555555518e <+69>: leaveq                     # movq %rbp, %rsp
                                                     # popq %rbp
0x000055555555518f <+70>: retq                       # 回傳
{% endcodeblock %}
 
{% note info %}
GDB 採 AT&T 格式，顯示順序跟 Intel 是顛倒，請參閱 [Wikipedia: X86 assembly language](https://en.wikipedia.org/wiki/X86_assembly_language)
{% endnote %}

在輸出位置前檢查（設中斷點），可以檢查我們的區域變數：

| 變數名稱 | 變數資料 | 變數位置 |
|:----:|:----------------:|:--------------:|
| iNum |            0x0c  | 0x7fffffffdc74 |
| pNum |  0x7fffffffdc74  | 0x7fffffffdc78 |

{% codeblock lang:shell %}
> (gdb) x/32xb $rsp
{% endcodeblock %}

{% codeblock lang:x86asm %}
0x7fffffffdc70: 0x70  0xdd  0xff  0xff  0x0c  0x00  0x00  0x00
0x7fffffffdc78: 0x74  0xdc  0xff  0xff  0xff  0x7f  0x00  0x00
0x7fffffffdc80: 0x00  0x00  0x00  0x00  0x00  0x00  0x00  0x00
0x7fffffffdc88: 0xb3  0x70  0xde  0xf7  0xff  0x7f  0x00  0x00
{% endcodeblock %}

{% note info %}
注意顯示單位，這樣一組 `0x00` 相當於二進制的 `b00000000` 共 8 個位元；
所以一個 `int` 需要 4 組，而筆者電腦是 64-bits 需要 8 組。
{% endnote %}

`0x7fffffffdc78` 儲存的內容看起來雖然是 `0x74dcffffff7f`，不過 x86 系統採用小端序（little endian），
所以實際的值是 `0x7fffffffdc74`；同樣地，`iNum` 是 `0x0000000c` 而非 `0x0c000000`。

注意！是 Bytes 的組合順序顛倒（不是位元順序、也不是顯示的順序），
以 `0x01 0x02 0x03 0x04`（`b00000001000000100000001100000101`）為例：

* 真正的值（小端序）：`0x04 0x03 0x02 0x01` 即 `0x04030201`
* 位元順序顛倒：`b10100000110000000100000010000000` 即 `0xA0C04080`
* 顯示順序顛倒：`0x40 0x30 0x20 0x10` 即 `0x40302010`

這 3 種結果完全不同。

{% note info %}
`mov` 跟 `lea` 的差別；假設有兩個暫存器 `$A = 0xfc` 及 `$B`、一個記憶體 `0xfa = 777`。
    {% codeblock lang:x86asm %}
    mov -0x2($A),$B     # $B = 777
    lea -0x2($A),$B     # $B = 0xfa
    {% endcodeblock %}
{% endnote %}
