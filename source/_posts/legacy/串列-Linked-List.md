---
title: 串列 Linked List
permalink: linked-list/
categories: legacy-algorithm
date: 2018-03-18
mathjax: false
---
串列是資料結構中，一種重要的資料表達方式，  
這樣的表達方式可以透過指標來完成。

<!-- more -->

通常，從這個部分開始，  
可以看出一個人對指標的熟練程度。

# 串列結構
串列的典型做法是使用 struct 實作：

{% note info %}
為方便撰寫範例，這裡假設資料為整數。
{% endnote %}

{% codeblock lang:c %}
...
struct Node{
    int data;   // 資料
    Node *next; // 下個節點
};
...
Node *node_1 = new Node; // 第 1 個節點
Node *node_2 = new Node; // 第 2 個節點
...
// 把第 2 個節點接在第 1 個後面
node_1->next = node_2;
...
{% endcodeblock %}

{% note info %}
串列結構經過良好的封裝更便於使用。
{% endnote %}

# 創建節點
可以透過一個函數取得節點，  
動態建立節點後，記得回傳給主程式。

{% codeblock lang:c %}
// 給定資料建立一個節點
Node* create(int value)
{
    Node *node = new Node; // 建立新節點
    node->data = value;    // 設定節點值
    node->next = nullptr;  // 初始化指標
    return node;           // 回傳給主程序
}
{% endcodeblock %}

接下來的插入節點就可以使用這個函數了。

# 搜索節點
我個人認為，搜索節點這件事情，  
搜索當前節點的效益並不大，通常我們更需要「目標節點的前一個節點」。

{% note info %}
「搜索目標節點的前一個節點函數」下面簡稱為「搜前函數」。
{% endnote %}

個人實作時，會先實作搜前函數，  
搜索節點的函數則透過這個函數間接完成。

{% codeblock lang:c %}
Node* sreachPrevious(Node *root, int value)
{
    Node* node = root;
    while (node->next != nullptr      // 不是最後一個節點
        && node->next->data != value) // 而且下個節點的值不是目標
        node = node->next;            // 繼續搜索
    return node;                      // 回傳目標的上一節點或最後一個節點
}
{% endcodeblock %}

{% note info %}
這裡的「root」是樹狀結構的名詞，但串列也可以視作一棵樹。
{% endnote %}

透過搜前函數，可以實做出的搜索功能。

{% codeblock lang:c %}
Node* sreach(Node *root, int value)
{
    if (root->data == value)
        return root;
    Node *node = sreachPrevious(root, value);
    return node->next;
}
{% endcodeblock %}

# 插入節點
插入節點不困難，這裡以插入到末端為例，  
如果存在一個值不會出現在串列中的話，可以透過搜前函數實作。

{% codeblock lang:c %}
// 插入一個節點到串列的結尾
Node* insert(Node *root, int value)
{
    Node *node = create(value);       // 新建節點
    if (root == nullptr)              // 如果串列尚不存在
        return node;                  // 回傳給主程序
    else
    {
        Node* tail = root;            // 找尾巴節點
        while (tail->next != nullptr)
            tail = tail->next;
        tail->next = node;            // 新增在尾巴
        return root;                  // 回傳給主程序
    }
}
{% endcodeblock %}

{% note info %}
插入到特定位置的功能，也可以利用搜前函數的實作。
{% endnote %}

{% note warning %}
如果不回傳指標給主程序，則建立串列時會出錯。
{% endnote %}

# 刪除節點
刪除節點可以直接透過搜前函數實作。

{% codeblock lang:c %}
void remove(Node *root, int value)
{
    Node *previous = sreachPrevious(root, value);
    Node *target = previous->next;
    if (target != nullptr)
    {
        previous->next = target->next;
        delete target;
    }
}
{% endcodeblock %}

# 遍歷節點
對串列進行一堆操作後，檢查串列的正確性，  
或是有時我們需要對整個串列做特定運算，都需要遍歷功能：

{% codeblock lang:c %}
void traversal(Node *root, void (*callback)(Node *node))
{
    for (Node *node = root; node != nullptr; node = node->next)
        callback(node);
}
{% endcodeblock %}

遍歷功能的第二個參數是函數的指標，  
串列的每個節點，會被當成這個函數的傳入值操作。

以印出節點來說，可以這樣調用：

{% codeblock lang:c %}
...
void show(Node *node)
{
    cout << node->data << endl;
}
...
traversal(root, show);
...
{% endcodeblock %}

# 演示
演示包含插入與刪除節點，  
其中插入功能隱含創建節點功能，而刪除功能隱含著搜尋功能。

{% jsfiddle ngkx992u result,js,html,css dark 100% 130px %}
