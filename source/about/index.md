---
title: About Me
type: about
categories: blog
comments: false
---

<style>
  .post-meta {
    margin: 3px 0 20px 0 !important;
  }
  #title_photo img {
    width: 600px;
  }
  #part2 {
    clear: left;
  }
  @media (min-width: 1366px) {
    #part1 {
      float: left;
      width: 70%;
    }
    .small-head {
      float: left;
      border-radius: 100%;
      width: 20%;
      margin: 0 5%;
      padding: 3em 0;
    }
  }
  @media (max-width: 1365px) {
    #part1 {
      width: 100%;
    }
    .small-head {
      display: none!important;
    }
  }
  #part1>p:last-child{
    margin-bottom: 0;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>

<span id="title_photo">

![](/images/about.jpg)

</span>

# 簡介 Introduction

<div id="part1">

最早是 RPG Maker VX 的獨立遊戲開發者。
在學生時代是網頁設計選手，所以也想要有自己的網站 💣

後來唸資訊工程，喜歡在業餘時間研究一些遊戲有關的要素，
像是地圖雲、NPC 尋路/視野、道具整理、遊戲光影之類的東西 🎮

隨著深耕在電腦科學領域，發現很多數學、演算法的東西，
實際用在程式設計（或遊戲）裡會有很神奇的效果 ✨

目前主要在 RPG Maker 社群裡活動 🐑

</div>
<img class="small-head" src="/images/head.jpg">

<div id="part2">

---
I was an indie game developer using RPG Maker VX early, and web design contestant in the student period 🐑

And then, I study computer science, and enjoy game design topics during my spare time 🎮
For instance, how to generate/draw cloud using a few image fragments in the 2d screen, NPCs vision/routing, item sorting in the bag, game lighting, etc.

With learning in computer science, I discovered that is interesting if you put some mathematics or algorithm into your program (or indie game) ✨

Now, I am active in the Taiwan RPG Maker community 🐑

</div>

# MY VSINDER 🎲
{% codeblock lang:js %}
const epsilon = 1e-4;

let differential = function(f) {
  return x => (f(x + epsilon) - f(x)) / epsilon;
};

let integral = function(f, f0) {
  return x => f0 + [...Array(x / epsilon >> 0).keys()].reduce((s, k) => {
    return s + f(x - k * epsilon);
  }, 0) * epsilon;
};

let f = (x) => x * x;    // f(x) = x^2;
let g = differential(f); // g(x) = 2*x;
let h = integral(g, 0);  // h(x) = x^2;

console.log(f(2), f(4), f(6));
console.log(g(2), g(4), g(6));
console.log(h(2), h(4), h(6));
{% endcodeblock %}

# 我的旅途 Journey

{% note success %}
我把一些簡歷放在這裡，因為數量不多就湊合一下 💣
{% endnote %}

| 名稱 Name | 類型 Type | 時間 Timestamp |
|:--|:--:|:--:|
| 全國大專電腦軟體設計競賽（應用軟體組）第二名<br/> National Collegiate Programming Contest 2rd place (application software design) | 獎項 Honor | Nov. 2018 |
| 全國大專電腦軟體設計競賽（應用軟體組）佳作<br/> National Collegiate Programming Contest honorable mention (application software design) | 獎項 Honor | Nov. 2017 |
| 全國大專電腦軟體設計競賽（應用軟體組）第三名<br/> National Collegiate Programming Contest 3rd place (application software design) | 獎項 Honor | Nov. 2016 |
| 全國工科技藝競賽志工<br/> National High School Skills Competition | 志工 Volunteer | Nov. 2013 |

# 網站歷程 History

{% note info %}
「更新歷程」系列文章之後只會發表更新時比較值得描述的情況 🚧
{% endnote %}

|  描述 Description | 時間 Timestamp |
|:--|:--:|
| 羊羽手札v1（PHP） | 2016.10.24 | 
| 羊羽手札v2（Vue.js+Express） | 2017.12.18 | 
| 羊羽手札v3（Hexo） | 2017.02.25 | 
| 更新歷程 01 發表 | 2017.02.25 | 
| 更新歷程 02 發表 | 2018.07.01 | 
| 暫停更新 | 2018.09.24 | 
| 更新歷程 03 發表 | 2018.09.24 | 
| 重啟更新 | 2019.03.28 | 
| 羊羽手札v4（Hexo/Next Update） | 2019.04.20 | 
| 更新歷程 04 發表 | 2019.04.20 | 
| 更新歷程 05 發表 | 2020.02.25 | 
| 羊羽手札v5（Hexo/Next Update） | 2022.02.12 | 
| 更新歷程 06 發表 | 2022.02.12 | 
| 公開「關於我」頁面 | 2022.02.19 | 
