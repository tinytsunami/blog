---
title: 堆疊與佇列 Stack and Queue
permalink: stack-and-queue/
categories: legacy-algorithm
date: 2016-11-12
mathjax: false
---
本文僅為資料結構的筆記。

對於較高階的語言來說有許多現成的函式庫，
儘管如此，還是需要瞭解基本規則。
<!-- more -->

# 堆疊
堆疊是一種基本結構，核心的思維是「先進後出」。

{% codeblock lang:cpp %}
...
//create stack
int stack[SIZE];
int top = 0;

//stack push data
void push(int data)
{
    stack[top++] = data;
}

//stack pop data
int pop()
{
    return stack[--top];
}
...
{% endcodeblock %}

這是 C/C++ 的作法，  
對於更高階的語言（比方說 JavaScript）來說，  
這些功能都已經內建了。

{% note info %}
實際上 C++ STL 有內建；另外雖然建立很簡單，但 C 語言方面也有函示庫可以使用。
{% endnote %}

{% codeblock lang:js%}
...
var stack = new Array(); //create stack
stack.push(..);          //stack push data
stack.pop(..);           //stack pop data
...
{% endcodeblock %}

## 演示
接下來來看看基本堆疊的資料進出方式。

{% jsfiddle 6xb1L6my result,js,html,css dark 100% 300px %}

# 佇列
佇列是一種基本結構，核心的思維是「先進先出」。

{% codeblock lang:cpp %}
...
//create queue
int queue[SIZE];
int top = 0;

//queue push data
void push(int data)
{
    queue[top++] = data;
}

//queue shift data
int shift()
{
    int data = queue[0];
    for(int i = 0; i < top; i++)
        queue[i] = queue[i + 1];
    top--;
    return data;
}
...
{% endcodeblock %}
這是C/C++的作法，  
對於更高階的語言（比方說 JavaScript）來說，  
這些功能都也已經內建了。

{% codeblock lang:js%}
...
var queue = new Array(); //create queue
queue.push(..);          //queue push data
queue.shift(..);         //queue shift data
...
{% endcodeblock %}

## 演示
接下來來看看基本佇列的資料進出方式。

{% jsfiddle zfq3ucak result,js,html,css dark 100% 300px %}
