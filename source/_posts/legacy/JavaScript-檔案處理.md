---
title: JavaScript 檔案處理
permalink: javascript-file-process/
categories: legacy-system
date: 2017-11-05
mathjax: false
---
這篇文章的起因是想到過去寫的 JS Demo 多數沒有保留，  
好不容易，上次在學校弄人工智慧有保留一份帶有檔案處理的。

所以這篇文章整理了過去做過、  
未來也可能用在本網誌的演示部份而寫。
<!-- more -->

# 歷史
沒記錯的話，早期的瀏覽器是不太允許讀取本機資料的。

理由是，如果瀏覽器的 JavaScript 可以隨意讀取本機資料，  
那可能看一看網站，所有東西都偷偷被上傳了。

然而，這造成了一個問題：  
「每次要檔案處理，都要透過檔案上傳到伺服器，然後再下載回來」

這個模式的問題在於網路頻寬的浪費，  
也有可能網路的傳輸時間遠大於檔案處理的時間。

HTML5 標準中出現了 File API 處理了這個問題。

{% note warning %}
注意：File API 在部分瀏覽器尚未普及。請參閱 [MDN FileReader](https://developer.mozilla.org/zh-TW/docs/Web/API/FileReader)。
{% endnote %}

{% note info %}
部份瀏覽器不允許第三方存取檔案，本文以 Google Chrome 瀏覽器為主。
{% endnote %}

# 讀取檔案
下面是直接從本機拿資料給 JavaScript 的做法：

HTML 必須的有 input 標籤，  
至於按鈕只是為了給使用者按的（不然設定在 input.onchange 也是可以）

{% codeblock lang:html %}
...
<p>基本的上傳檔案</p>
<input type="file" /> <button>上傳</button>
...
{% endcodeblock %}

JavaScript 的部份，最主要就是那個 FileReader 的物件：

{% codeblock lang:js %}
...
buttonNode.onclick = function()
{
  let file = inputNode.files[0];        // 取得輸入標籤的檔案
  let fileReader = new FileReader();    // 建立 FileReader 物件

  fileReader.onload = function() {      // 設定讀檔後的函數
    let contents = event.target.result; // 取得資料
    ...                                 // 處理資料
  };
  fileReader.readAsDataURL(file);       // 載入檔案
};
...
{% endcodeblock %}

## 演示
這個演示從本機端直接讀取檔案，然後顯示出檔案內容（文字）：
{% note info %}
本演示的 input(file) 標籤做了樣式處理，可供參考。
{% endnote %}

{% jsfiddle yaamhnmw result,js,html,css dark 100% 310px %}

# 讀取進度
雖然從本機端直接讀取不用透過網路已經很快了，  
但有時候檔案還是大的多，這個時候我們可能會想知道讀取的進度。

這時，我們的進度可以從 FileReader 的 onprogress 取得（可以搭配 progress 標籤使用）

{% codeblock lang:html %}
...
<progress value="0" max="100"></progress>
...
{% endcodeblock %}

JavaScript 的部份：

{% codeblock lang:js %}
...
// 過程進行的函數
fileReader.onprogress = function() {
  let rate = event.loaded / event.total; // 得到讀取的比例
  ...
};
...
{% endcodeblock %}

## 演示
這個演示製作了進度條（需要大一點的檔案才能看到）
{% note info %}
本演示的 progress 標籤做了樣式處理，可供參考。
{% endnote %}

{% jsfiddle xmee4x4j result,js,html,css dark 100% 310px %}

# 讀取圖像

畫布（Canvas）是 HTML5 幾乎最核心的功能之一，  
當然讀取圖像繪畫到畫布上，也是很常見的。

## 使用 Image 物件

{% codeblock lang:js %}
...
// 從 input 標籤取得檔案
let file = inputNode.files[0];

// 建立 Image 物件 
let img = new Image();

// 圖片載入後的事件函數
img.onload = function() {
      // 畫到畫布上
  context.drawImage(img, 0, 0);
};

// 建立 URL 掛到 Image 物件上
img.src = URL.createObjectURL(file);
...
{% endcodeblock %}

### 演示
這個演示示範了基本從 Image 到 Canvas 的過程：

{% jsfiddle cjpbjrxL result,js,html,css dark 100% 410px %}

## 使用 FileReader 物件
通常而言會推薦使用 Image 物件，不過透過 FileReader 也可實作。

{% note info %}
如果是圖像處理建議使用 Image 物件；
這是因為 FileReader 的瀏覽器支援度不如 Image 物件普及。
{% endnote %}

{% codeblock lang:js %}
...
// 取得檔案、建立 FileReader 物件
let file = inputNode.files[0];
let fileReader = new FileReader();

// 載入完成的事件函數
fileReader.onload = function() {
      let content = event.target.result;    
  let img = new Image();
  img.onload = function() {
        context.drawImage(img, 0, 0);
  };
  img.src = contents;
};

// 載入檔案
fileReader.readAsDataURL(file);
...
{% endcodeblock %}

### 演示
如果透過 FileReader 一樣可以畫在畫布上：

{% jsfiddle rtjd137s result,js,html,css dark 100% 440px %}

# 二進位檔案處理
取得了檔案通常需要做處理（透過 JavaScript）尤其是二進位的檔案，  
轉檔、壓縮之類的往往需要二進位的控制，然而這個已經被 JavaScript 支援了：

{% codeblock lang:js %}
...
// 這個只是方便取得檔案中的文字塊
// 然後把函數掛到了 DataView 底下
DataView.prototype.getString = function(offset, len) {
      let result = "";
  for(let i = 0; i < len; i++) {
        let value = this.getUint8(offset + i);
    result += String.fromCharCode(value);
  }
  return result;
};
...
// 取得檔案、建立 FileReader 物件
let file = inputNode.files[0];
let fileReader = new FileReader();

fileReader.onload = function() {
      // 建立 DataView 做控制
  let contents = new DataView(event.target.result);
  ...
};

// 注意這邊 readAsDataURL 改成 readAsArrayBuffer 函數
fileReader.readAsArrayBuffer(file);
...
{% endcodeblock %}

## 演示
{% note primary %}
這個演示需要 WAV 檔案，可跳至 [下載檔案演示](#演示-5) 的部分；  
該演示將由二進制組合一個 WAV 檔案下載。
{% endnote %}

它解析檔案內容，讀取資料（首個聲道的內容）繪畫到畫布上：

{% jsfiddle 0qs13nyk result,js,html,css dark 100% 250px %}

# 下載檔案
我們討論了很多的讀取、操作檔案的方法，  
同樣的，我們也要讓使用者能把檔案從瀏覽器上拿回來才行。

具體的作法是，透過一個連結標籤。  
然後設定相關參數，並執行自身（讓瀏覽器自動處理）下載：

{% codeblock lang:js %}
...
let buffer = new ArrayBuffer(...);              // 設定空間
let contents = new DataView(buffer);            // 建立 DataView 控制

... /* 在這邊使用 DataView 物件操作檔案 */ ...

// 透過 ArrayBuffer 建立 Blob 物件
// 後面的 type 屬性是二進位的流，請參考 Content-type 資訊
let blob = new Blob([buffer], {type: "application/octet-stream"});

let url = window.URL.createObjectURL(blob);     // 建立 URL
let downloadNode = document.createElement("a"); // 創造 a 標籤

downloadNode.style.display = "none";            // 設定標籤不可見
downloadNode.href = url;                        // 設定標籤位置（URL）
downloadNode.download = "...";                  // 設定下載檔案檔名

document.body.appendChild(downloadNode);        // 加入標籤到網頁
downloadNode.click();                           // 自動點擊執行

URL.revokeObjectURL(url);                       // 將創造的 URL 釋放掉
...
{% endcodeblock %}

## 演示
這個演示會根據你的函數內容生成、下載 WAV 檔案：
{% note info %}
對於 16-bit 的 WAV 文件，範圍在 [-32768, 32767] 的區間內。
{% endnote %}

{% jsfiddle fcgbq61a result,js,html,css dark 100% 200px %}

# 參考資料
* [MDN Web Docs : Image](https://developer.mozilla.org/zh-TW/docs/Web/API/HTMLImageElement/Image)
* [MDN Web Docs : FileReader](https://developer.mozilla.org/zh-TW/docs/Web/API/FileReader)
* [Wikipedia: WAV](https://zh.wikipedia.org/wiki/WAV)
* [WAVE PCM Soundfile Format](http://soundfile.sapp.org/doc/WaveFormat/)
