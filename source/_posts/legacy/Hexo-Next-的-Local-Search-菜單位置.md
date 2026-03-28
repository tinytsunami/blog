---
title: Hexo Next 的 Local Search 菜單位置
permalink: hexo-next-local-search/
categories: legacy-system
date: 2020-03-24
mathjax: false
---
由於要準備發新文章，開始重新考慮一些文章管理的事情，其中最重要的是「站內搜索」。
這篇文章只是記錄一個設定上的小問題而已……

<!-- more -->

# 開啟 Local Search 功能
首先，在 Hexo 的 Next 主題開啟 Local Search 非常容易，
只要在 `themes\next\_config.yml` 中，找到：

{% codeblock lang:yml %}
  # Local search
  # Dependencies: https://github.com/theme-next/hexo-generator-searchdb
  local_search:
    enable: false
    # If auto, trigger search by changing input.
    # If manual, trigger search by pressing enter key or search button.
    trigger: auto
    # Show top n results per article, show all results by setting to -1
    top_n_per_article: 1
    # Unescape html strings to the readable one.
    unescape: false
{% endcodeblock %}

將 `local_search` 的 `enable` 設為 `true` 即可。

# 調整 Local Search 位置

預設 Local Search 在主選單的位置如圖 1 所示，會自動插入在最末處：

![圖 1、預設 Local Search 的菜單位置](https://i.imgur.com/KHVtWAN.png)

基本上沒辦法直接從 `_config.yml` 設定位置，
如果要改到首頁的下方，則可以到 `themes\next\layout\_partials\header\menu.swig` 修改程式：

{% codeblock lang:swig %}{% raw %}
...
<nav class="site-nav">
  {% if theme.menu %}
    <ul id="menu" class="menu">
      {% for name, path in theme.menu %}
        渲染每一行選單連結
      {%- endfor %}

      {% set hasSearch = theme.swiftype_key || theme.algolia_search.enable || theme.local_search.enable %}
      {% if hasSearch %}
        渲染 Local Search 功能連結
      {% endif %}
    </ul>
  {% endif %}
  其他主題樣式的處理
</nav>
{% endraw %}{% endcodeblock %}

不難理解，假設我們需要把「搜索」的位置移動到「首頁」下方，
那只要把渲染 Local Search 功能，先插入到上方的 `for` 迴圈中，
然後加上一個條件 `name == 'home'` 跟隨首頁進行渲染即可：

{% codeblock lang:swig %}{% raw %}
...
<nav class="site-nav">
  {% if theme.menu %}
    <ul id="menu" class="menu">
      {% for name, path in theme.menu %}
        渲染每一行選單連結

        跟隨首頁進行渲染
        {% if name == 'home' %}
          {% set hasSearch = theme.swiftype_key || theme.algolia_search.enable || theme.local_search.enable %}
          {% if hasSearch %}
            渲染 Local Search 功能連結
          {% endif %}
        {% endif %}

      {%- endfor %}
    </ul>
  {% endif %}
  其他主題樣式的處理
</nav>
{% endraw %}{% endcodeblock %}

{% note info %}
需要注意的是，隨著需求不同，設下的條件（`name == 'home'`）可能不一樣，
你應該檢查 `_config.yml` 的 `menu` 區域設定，來獲得正確的條件。
{% endnote %}

{% note info %}
關於渲染 swig 代碼塊，可以使用：

{% codeblock lang:swig %}{% raw %}
  {% codeblock lang:swig %}
  {% raw %}
  ...
  {% endraw %}
  {% endcodeblock %}
{% endraw %}{% endcodeblock %}
{% endnote %}
