---
title: HTML5 Cordova Android APP 環境配置
permalink: html5-android-app-1/
categories: (legacy) system
date: 2018-07-02 00:04:23
mathjax: false
---
這篇是紀錄一個基於 HTML5 的 Android APP 開發流程。

雖然筆者常常寫 HTML、CSS 以及 JavaScript 程式，  
也聽說 HTML5 對 APP 開發速度的幫助很大，但從未有自己的 APP 上架。
<!-- more -->

這篇文章將介紹 Cordova 的環境配置。

{% note info %}
本篇預設讀者都已掌握開發技術，不會介紹 Web 程式的撰寫。
{% endnote %}

# 概述
開發環境的配置需要安裝：
* Node.js
* Cordova
* Java Development Kit (JDK)
* Android Software Development Kit (SDK)

| 名稱 | 功能 | 下載網站 |
|:----|:----|:----|
| Node.js                                 | Cordova 在 Node.js 的命令列上執行 | [Node.js](https://nodejs.org/en/) |
| Cordova                                 | 將 Web 專案部屬到指定行動裝置平台 | [Apache Cordova](https://cordova.apache.org/) |
| Java Development Kit (JDK)              | Cordova 新增、部屬 Android 平台時需要 | [Oracle Technology Network](http://www.oracle.com/technetwork/java/javase/downloads/index.html) |
| Android Software Development Kit (SDK)| Cordova 新增、部屬 Android 平台時需要 | [Android Developers](https://developer.android.com/studio/) |
| Gradle*                                 | Android 的官方構建工具 | [Gradle Build Tool](https://gradle.org/)

{% note info %}
SDK 及 Gradle 的下載有無需要，請在 [安裝 SDK](#安裝-SDK) 的章節中確認。
{% endnote %}

{% note info %}
筆者接下來會將 Java Development Kit 簡稱為 JDK；而 Android Software Development Kit 簡稱為 SDK。
{% endnote %}

# 安裝 Node.js
先到 [Node.js 官網](https://nodejs.org/en/) 下載 Node.js，  
官網左邊的 LTS 表示推薦的穩定版本、而右邊的 Current 表示最新的版本，  
官網畫面請參考圖 1，筆者這邊使用的是 LTS 版本：

![圖 1、Node.js 官網示意圖](https://i.imgur.com/MPA5e7Ql.png)

然後安裝 Node.js 的部分，不會花太多時間，跟一般的安裝差不多。  
安裝好後，透過下列指令測試正確安裝，畫面請參考圖 2：
{% codeblock %}
node --version
{% endcodeblock %}

![圖 2、Node.js 測試示意圖](https://i.imgur.com/ftOp2ZBl.png)

{% note info %}
通常情況下，可能 Node.js 版本與筆者不同，但操作應該大同小異。
{% endnote %}

# 安裝 Cordova
在 [Apache Cordova](https://cordova.apache.org/) 官網有說明絕大多數操作，  
透過 npm 安裝 Cordova 即可，指令如下：
{% codeblock %}
npm install -g cordova
{% endcodeblock %}

安裝好後，一樣透過指令測試，畫面請參考圖 3：
{% codeblock %}
cordova --version
{% endcodeblock %}

![圖 3、測試 Cordova 示意圖](https://i.imgur.com/U2FzEL5l.png)

上圖是安裝完後，透過指令測試的

{% note info %}
Node Package Manager (npm) 是 Node.js 預設的套件包管理器；其中參數 -g 代表全局安裝。
{% endnote %}

# 安裝 JDK
接著到 [Oracle Technology Network](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 網站，  
下載 JDK，如圖 4 所示，注意下圖中藍框的同意條款要勾選才能下載：

![圖 4、下載 JDK 示意圖](https://i.imgur.com/MVsvsq5l.png)

注意兩個安裝的路徑：
* JDK
* Java Runtime Environment (JRE)

這兩個路徑可能之後會使用到，務必記下來，  
預設路徑是「C:\Program Files\Java\」或「C:\Program Files (x86)\Java\」。

# 安裝 SDK
安裝 SDK 的部分，可以分成兩個方法：

* 使用 Android Studio 附帶的 SDK 包
* 獨立安裝 SDK Tools 與 SDK Platform Tools

如果已經安裝過 Android Studio 的話，就直接使用其附帶的 SDK 即可；  
反之，如果沒有安裝過 Android Studio；且未來也不打算安裝，則推薦獨立安裝 SDK。
（如果讀者覺得可能會使用到 Android Studio 則建議安裝。）

安裝好 Android Studio 時，應該會指定安裝 SDK 的位置；  
獨立下載時，解壓縮到喜歡的目錄下即可。

獨立安裝 SDK Tools 的下載網址：[Android Developers](https://developer.android.com/studio/)
此外，要再下載 SDK Platform Tools，網址：[SDK Platform Tools Release](https://developer.android.com/studio/releases/platform-tools)

# 安裝 Gradle
這個部分同樣取決於是否安裝 Android Studio：

* 使用 Android Studio 附帶的 Gradle
* 獨立安裝 Gradle 

與 SDK 的狀況一樣，至於 Android Studio 安裝時，  
不會另外讓你設定 Gradle 的安裝位置，預設在「Android Studio\gradle\gradle-x.x」
（其中 x.x 為 Gradle 的版本號。）

# 配置環境變數
接下來是比較容易出錯的部分，  
由於安裝了很多東西，有一些自動幫你配置環境變數；有些則無。  
我們需要配置的環境變數如下：

| 來源軟體 | 配置方法 | 環境變數名稱 | 環境變數位置 |
|--|--|--|--|
| Node.js | 安裝 Node.js 時自動配置 | Path（系統變數）| nodejs\ |
| Node.js (npm) | 安裝 Node.js 時自動配置 | Path（使用者變數） | AppData\Roaming\npm\ |
| Cordova | 透過 npm 呼叫 | 無 | 無 |
| JDK | 使用者手動配置 | JAVA_HOME（使用者變數） | jdk1.8.0_171\ |
| SDK Tools（A.S. 附帶）| 使用者手動配置 | ANDROID_HOME（使用者變數） | SDK\ |
| SDK Tools（獨立安裝）| 使用者手動配置 | ANDROID_HOME（使用者變數） | SDK\ |
| SDK Platform Tools（A.S. 附帶）| 使用者手動配置 | Path（系統變數）| platform-tools\ |
| SDK Platform Tools（獨立安裝）| 使用者手動配置 | Path（系統變數） | platform-tools\ |
| SDK Tools（A.S. 附帶）| 使用者手動配置 | Path（使用者變數） | tools\bin\ |
| SDK Tools（獨立安裝）| 使用者手動配置 | Path（使用者變數） | tools\bin\ |
| Gradle（A.S. 附帶）| 使用者手動配置 | Path（系統變數） | gradle\gradle-x.x\bin\ |
| Gradle（獨立安裝）| 使用者手動配置 | Path（系統變數）| gradle-x.x\ |

{% note info %}
記號「A.S.」表示「Android Studio」
{% endnote %}

{% note warning %}
環境變數位置為相對位置，請依照安裝時設定的位置為準。
{% endnote %}

# 測試環境變數
這裡提供一個檢測環境變數的方法，  
在這裡使用的 Cordova 專案可能不是最終使用的專案。

首先到自己喜歡的目錄下，透過指令建立 Cordova 專案，  
其中 myApp 為自訂的專案名稱：

{% codeblock %}
cordova create myApp
{% endcodeblock %}

然後將進入建立好的目錄，透過指令將 Android 加入部屬的平台：
{% codeblock %}
cd myApp
cordova platform add android
{% endcodeblock %}

然後透過指令檢測環境：
{% codeblock %}
cordova requirements
{% endcodeblock %}

整個操作的示意如圖 5，  
如果有錯誤，應該會提示哪裡沒有配置好：
![圖 5、檢測命令示意圖](https://i.imgur.com/cglnTXb.png)
