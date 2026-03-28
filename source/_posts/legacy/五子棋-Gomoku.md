---
title: 五子棋 Gomoku
permalink: gomoku/
categories: legacy-algorithm
date: 2018-04-26
mathjax: false
---
五子棋，作為一款家喻戶曉的桌上遊戲，  
可能是程式新手練習程式、設計遊戲 AI 的好起點。
<!-- more -->

其實這篇文章是以筆者做的 Python 遊戲為範本；  
那時做出了連珠棋（六子棋）的 AI（雖然沒用到 AI 技術）

後來一直想找機會把這個做法記錄下來。

{% note success %}
筆者原始的 [Python 程式](https://github.com/tinytsunami/PythonGame)
{% endnote %}

{% note info %}
本篇將用 JavaScript 進行說明；其他程式可參考算法。
{% endnote %}

# 初始化
初始化階段，我們需要清空棋盤的二維陣列，  
除此之外，還需要定義一些基本變數。

{% note info %}
這邊棋盤大小以 19 x 19 為例。
{% endnote %}

{% codeblock lang:js %}
...
/* 常數 */
const CONNECT = 5;                          // 取勝的連珠數量
const N = 19;                               // 棋盤大小
const EMPTY = 0;                            // 定義棋盤的空值
const WHITE = 1;                            // 定義棋盤白子的值
const BLACK = 2;                            // 定義棋盤黑子的值

/* 變數 */
let board = null;                           // 二維棋盤
let player = null;                          // 玩家棋的顏色
let computer = null;                        // 電腦棋的顏色
let now = null;                             // 目前是哪方落子
let end = null;                             // 遊戲結束的旗標
...
/* 輸入我方回傳對手的函數 */
let other = function(c) {
  if(c == WHITE) {                          // 如果輸入白子
    return BLACK;                           // 回傳黑方
  }
  else if(c == BLACK) {                     // 如果輸入黑子
    return WHITE;                           // 回傳白方
  }
  return EMPTY;                             // 傳入值有問題，回傳空
};
...
/* 初始化函數 */
let initialize = function() {
  player = BLACK;                           // 定義由玩家下黑子
  computer = other(player);                 // 電腦為玩家的另一方
  now = BLACK;                              // 由黑子先下
  end = false;                              // 遊戲尚未結束
  board = Array.from({length: N}, ()=>{     // 初始化棋盤
    return Array.from({length: N}, ()=>{
      return EMPTY;                         // 棋盤預設內容為空
    });
  });
  refresh();                                // 更新畫面
};
...
initialize();                               // 調用初始化函數
{% endcodeblock %}

玩家不一定要下黑方，  
可以設定由玩家選擇顏色，但這裡為了方便就固定下黑子。

接下來就可以撰寫繪製棋盤的 refresh() 函數了。

# 繪製棋盤
在遊戲可以開始提供給玩家操作前，  
我們要先把棋盤繪製出來。

{% codeblock lang:js %}
/* HTML DOM */
const canvas = document.getElementsByTagName("canvas")[0];        // 取得畫布元素
const context = canvas.getContext("2d");                          // 取得繪畫物件
 
/* 常數 */ 
...
const BLOCK = 24;                                                 // 每格的大小
const MARGIN = 15;                                                // 棋盤外邊框的大小
const TEXT = 12;                                                  // 棋盤下方顯示文字區域的大小
const WIDTH = (N - 1) * BLOCK + MARGIN * 2;                       // 畫布寬度
const HEIGHT = (N - 1) * BLOCK + MARGIN * 2 + TEXT;               // 畫布高度
...
/* 畫布初始化 */ 
canvas.width = WIDTH;
canvas.height = HEIGHT;
 
/* 根據棋子回傳顏色 */ 
let color = function(c) {
  if(c == WHITE)                                                  // 如果是白方
    return "#FFFFFF";                                             // 回傳白色色碼
  else if(c == BLACK)                                             // 如果是黑方
    return "#000000";                                             // 回傳黑色色碼
  return null;                                                    // 傳入值有問題，回傳無
}; 
 
/* 刷新畫面 */ 
let refresh = function() { 
  let ox, oy, tx, ty, r;                                          // 宣告一些暫存變數
  context.clearRect(0, 0, canvas.width, canvas.height);           // 清空畫面
  for(let x = 0; x < N; x++) {                                    // 遍歷棋盤畫線
    for(let y = 0; y < N; y++) { 
      context.beginPath();                                        // 初始化路徑
      ox = x * BLOCK + MARGIN;                                    // 設定座標
      tx = ox; 
      oy = MARGIN; 
      ty = (N - 1) * BLOCK + MARGIN; 
      context.moveTo(ox, oy);                                     // 移到起始座標
      context.lineTo(tx, ty);                                     // 繪製直線
      ox = MARGIN;                                                // 直向路徑
      tx = (N - 1) * BLOCK + MARGIN; 
      oy = y * BLOCK + MARGIN; 
      ty = oy; 
      context.moveTo(ox, oy);                                     // 移到起始座標
      context.lineTo(tx, ty);                                     // 橫向路徑
      context.stroke();                                           // 繪製線條
    }
  }
  for(let x = 0; x < N; x++) {                                    // 遍歷棋盤畫棋子
    for(let y = 0; y < N; y++) { 
      context.beginPath();                                        // 初始化新路徑
      if(board[x][y] != EMPTY) {                                  // 棋盤不為空
        ox = x * BLOCK + MARGIN;                                  // 設定座標
        oy = y * BLOCK + MARGIN; 
        r = BLOCK / 2;                                            // 設定半徑
        context.arc(ox, oy, r, 0, 2 * Math.PI);                   // 圓弧路徑（注意後兩個參數是弧度）
        context.fillStyle = color(board[x][y]);                   // 選取顏色
        context.fill();                                           // 填充圓型
        context.strokeStyle = "#000000";                          // 棋子邊線顏色
        context.stroke();                                         // 繪製邊線
      }
    }
  }
  if(end == true) {                                               // 遊戲結束繪製提示字
    ...                                                           // 繪製結束字的部分
  }
};
...
{% endcodeblock %}

繪製棋盤雖然比較麻煩，但內容不困難，  
座標的暫存變數可以直接寫在繪圖函數的傳入值內也可以。

{% note info %}
關於 beginPath() 的用法請參閱 [w3school: beginPath()](https://www.w3schools.com/tags/canvas_beginpath.asp)。
{% endnote %}

# 遊戲進行
遊戲進行是透過玩家按下滑鼠來推動，  
這樣處理比起透過 setInterval() 函數重複執行要有效率。

{% codeblock lang:js %}
/* 落子在棋盤上的函數 */
let chess = function(x, y) {
  if(board[x][y] == EMPTY) {                                  // 選的位置是空的
    board[x][y] = now;                                        // 代表棋子可以下這裡
    if(...) {                                                 // 勝利的條件
      end = true;                                             // 讓遊戲結束
    }
    else {                                                    // 還沒勝利
      now = other(now);                                       // 換對手下棋
    }
  }
  refresh();                                                  // 更新畫面
};

/* 畫布被玩家按下 */
canvas.onmousedown = function() {
  if(end == true) {                                           // 遊戲結束
    ...                                                       // 遊戲結束的處理
  }
  else {                                                      // 遊戲還沒結束
    let x = Math.round((event.offsetX - MARGIN) / BLOCK);     // 抓取玩家滑鼠按下的 x 座標
    let y = Math.round((event.offsetY - MARGIN) / BLOCK);     // 抓取玩家滑鼠按下的 y 座標
    chess(x, y);                                              // 玩家落子在 (x, y)
    if(now == computer) {                                     // 現在換電腦下？（有可能玩家落子失敗）
      ...                                                     // 電腦的 AI 策略
    }
  }
};
{% endcodeblock %}

設定 chess() 函數檢查落子規則，使得主函數變得很簡潔。

# 勝負判斷
這裡開始的設計是五子棋程式冗長與否的關鍵！

由於可能會重複使用「是否超出棋盤」的邏輯，  
這裡先寫一個 belong() 函數為之後做準備。

{% codeblock lang:js %}
...
/* 是否在範圍中 */
let belong = function(v, min, max) {
  return v >= min && v < max;
};
...
{% endcodeblock %}

接著這邊取得連珠數量的方式是這樣的，  
我們先考慮一個方向的情況，在這個方向上，  
連珠的數量為：「A 部分的數量 + 1 + B 部分的數量」

數量說明請參考圖 1。

![圖 1、連珠數量說明](https://i.imgur.com/mLNHoUH.jpg)

另外觀察所有的方向：  
考慮給定一個 (x, y) 加上一個 (dx, dy) 的偏移量，  
由於 A 部分跟 B 部分是完全相反的。

也就是說 A = (x + dx, y + dy) 的話，  
有 B = (x + (-dx), y + (-dy)) 的關係。

圖 2 使用顏色把原方向及反方向標出來。

![圖 2、連珠方向說明](https://i.imgur.com/SmaJU1x.jpg)

這裡列出所有座標變化：

| 方向 | dx 偏移量範圍 | dy 偏移量範圍 |
|----|----|----|
| 左上 → 右下（上圖藍色部分） | dx = [-1, -2, -3, -4] | dy = [-1, -2, -3, -4] |
| 左上 → 右下（上圖紅色部分） | dx = [+1, +2, +3, +4] | dy = [+1, +2, +3, +4] |
| 直向（上圖藍色部分） | dx = [-0, -0, -0, -0] | dy = [-1, -2, -3, -4] |
| 直向（上圖紅色部分） | dx = [+0, +0, +0, +0] | dy = [+1, +2, +3, +4] |
| 右上 → 左下（上圖藍色部分） | dx = [+1, +2, +3, +4] | dy = [-1, -2, -3, -4] |
| 右上 → 左下（上圖紅色部分） | dx = [-1, -2, -3, -4] | dy = [+1, +2, +3, +4] |
| 橫向（上圖藍色部分） | dx = [-1, -2, -3, -4] | dy = [-0, -0, -0, -0] |
| 橫向（上圖紅色部分） | dx = [+1, +2, +3, +4] | dy = [+0, +0, +0, +0] |

如果令：

| 偏移量代號 | 偏移量範圍 |
|----|----|
| fixed | [0, 0, 0, 0] |
| forward | [+1, +2, +3, +4] |
| reverse | [-1, -2, -3, -4] |

可以把上表化簡成：

| 方向 | dx 偏移量範圍 | dy 偏移量範圍 |
|----|----|----|
| 左上 → 右下（上圖藍色部分） | reverse | reverse |
| 左上 → 右下（上圖紅色部分） | forward | forward |
| 直向（上圖藍色部分） | fixed | reverse |
| 直向（上圖紅色部分） | fixed | forward |
| 右上 → 左下（上圖藍色部分） | forward | reverse |
| 右上 → 左下（上圖紅色部分） | reverse | forward |
| 橫向（上圖藍色部分） | reverse | fixed |
| 橫向（上圖紅色部分） | forward | fixed |

這樣就可以設計一個函數，  
傳入目前座標、棋子顏色及變化量範圍，  
回傳有多少連珠：

{% codeblock lang:js %}
...
/* 確認某個方向內的棋子數量
 * (x, y)   : 目前座標
 * c        : 棋子顏色
 * (dx, dy) : 偏移量範圍
 */
let check = function(x, y, c, dx, dy) {
  let count = 0;                                      // 連珠數量
  for(let i = 0; i < CONNECT - 1; i++) {              // 最大連珠範圍
    let tx = x + dx[i];                               // 偏移後的 x 座標
    let ty = y + dy[i];                               // 偏移後的 y 座標
    if(!belong(tx, 0, N) || !belong(ty, 0, N)) {      // 超出範圍
      continue;                                       // 直接看下個偏移座標
    }
    if(board[tx][ty] == c) {                          // 如果目前偏移座標是指定顏色
      count++;                                        // 連珠數量增加
    }
    else {                                            // 如果不是指定顏色（被截斷）
      break;                                          // 終止計數
    }
  }
  return count;                                       // 回傳連珠數量
};
...
{% endcodeblock %}

有了這樣的函數後，可以直接調用：

{% codeblock lang:js %}
...
/* 從指定座標出發的連珠數量
 * (x, y)   : 目前座標
 * c        : 棋子顏色
 */
let connect = function(x, y, c) {
  let assess = Array.from({length: 4}, (v, i)=>{return 0;});                            // 記錄四個方向的連珠數量
  let fixed = Array.from({length: CONNECT}, (v, i)=>{return 0;});                       // 建立 fixed 偏移表
  let forward = Array.from({length: CONNECT}, (v, i)=>{return i;});                     // 建立 forward 偏移表
  let reverse = Array.from({length: CONNECT}, (v, i)=>{return -i;});                    // 建立 reverse 偏移表
  fixed.shift();                                                                        // 偏移表的第 0 項不要（參考上表）
  forward.shift();
  reverse.shift();
  assess[0] = check(x, y, c, forward, fixed) + check(x, y, c, reverse, fixed) + 1;      // 橫向的連珠數量
  assess[1] = check(x, y, c, fixed, forward) + check(x, y, c, fixed, reverse) + 1;      // 直向的連珠數量
  assess[2] = check(x, y, c, reverse, reverse) + check(x, y, c, forward, forward) + 1;  // 左上到右下的連珠數量
  assess[3] = check(x, y, c, reverse, forward) + check(x, y, c, forward, reverse) + 1;  // 右上到左下的連珠數量
  max = assess.reduce((previous, current)=>Math.max(previous, current));                // 四個方向取最大值
  return max;                                                                           // 回傳最大連珠數量
};
...
{% endcodeblock %}

因為勝出一定是「當前回合落子」造成遊戲結束，  
所以勝負條件會寫在 chess() 函數內，  
給定座標就是當前落子的位置：

{% codeblock lang:js %}
...
/* 落子在棋盤上的函數 */
let chess = function(x, y) {
  if(...) {
    ...
    if(connect(x, y, now) >= CONNECT) {                       // 勝利的條件
      end = true;                                             // 讓遊戲結束
    }
    ...
  }
  ...
};
...
{% endcodeblock %}

{% note info %}
這裡的這個做法還有其他功能。將於 [電腦對弈](#電腦對弈) 段落介紹。
{% endnote %}

# 結束處理
既然勝負判斷已經完成，就可以順便實作結束處理。  
這邊就顯示一行字在底部，然後再次點擊畫面可以重複遊戲這樣。

{% codeblock lang:js %}
...
/* 畫布被玩家按下 */
canvas.onmousedown = function() {
  if(end == true) {                                           // 遊戲結束
    initialize();                                             // 重新初始化
    end = false;                                              // 讓遊戲重新開始
  }
  else {                                                      // 遊戲還沒結束
    ...
  }
};
{% endcodeblock %}

則畫布的更新：

{% codeblock lang:js %}
...
/* 刷新畫面 */ 
let refresh = function() { 
  ...
  if(end == true) {                                               // 遊戲結束繪製提示字
    context.font = "12px Verdana"                                 // 設定字型與大小
    context.fillStyle = "#000000";                                // 繪製顏色
    let winner = (now == BLACK ? "black" : "white");              // 取得勝利方名稱
    let text = `${winner} is won!(click screen to play again)`;   // 勝利提字文字
    context.fillText(text, MARGIN, canvas.height - TEXT);         // 繪製文字
  }
};
...
{% endcodeblock %}

# 電腦對弈
電腦 AI 其實是最難寫的。

不過我們別有用心的設計了 connect() 函數後，  
這裡可以在這裡使用這兩個函數。

由於連珠棋有輪流落子的規則，  
所以只要輪到我方時，我盤面上最長的連珠大於對手最大連珠，  
我方繼續加子，如果對方不阻擋，則我方就會勝出。

反之，如果對手的最大連珠大於我方，我方應該先阻擋對方。

具體的說，透過我們的 connect() 函數傳入可以落子的座標，  
找到「如果這個座標落子的話」這裡會形成的最大連珠。

{% codeblock lang:js %}
/* 搜索盤面上的特定顏色 
 * c: 棋子顏色
 */
let search = function(c) {
  let target = {                                          // 回傳物件
    x: 0,                                                 // 特定的 x 位置
    y: 0,                                                 // 特定的 y 位置
    count: 0                                              // 最大連珠
  };
  for(let x = 0; x < N; x++) {                            // 遍歷棋盤
    for(let y = 0; y < N; y++) {
      if(board[x][y] == EMPTY) {                          // 如果這個棋盤位置可以落子
        let max = connect(x, y, c);                       // 取得落子後的最大連珠
        if(target.count < max) {                          // 如果連珠更大則
          target.x = x;                                   // 保存最大連珠處的 x 位置
          target.y = y;                                   // 保存最大連珠處的 y 位置
          target.count = max;                             // 保存最大連珠數量
        }
      }
    }
  }
  return target;                                          // 回傳最大連珠的資料
};
{% endcodeblock %}

電腦 AI 的部分就很簡單了：

{% codeblock lang:js %}
/* 畫布被玩家按下 */
canvas.onmousedown = function() {
  if(end == true) {                                           // 遊戲結束
    ...                                                       // 遊戲結束的處理
  }
  else {                                                      // 遊戲還沒結束
    ...
    if(now == computer) {                                     // 現在換電腦下？（有可能玩家落子失敗）
      playerTarget = search(player);                          // 搜尋玩家的最大連珠
      computerTarget = search(computer);                      // 搜尋電腦的最大連珠
      if(playerTarget.count > computerTarget.count) {         // 玩家最大連珠大於電腦
        chess(playerTarget.x, playerTarget.y);                // 擋在玩家會形成最大連珠的地方
      }
      else {                                                  // 電腦連珠比玩家的大
        chess(computerTarget.x, computerTarget.y);            // 我方繼續落子在最大的地方
      }
    }
  }
};
{% endcodeblock %}

{% note info %}
雖然這裡稱作電腦「AI」對弈，但實際上是傳統的暴力搜索。
{% endnote %}

# 演示
來下棋吧！

{% jsfiddle xw8LuLvz result,js,html,css dark 100% 550px %}
