# Web Components

参考：[Web Components MDN](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)

[Web Components 教程-阮一峰](http://www.ruanyifeng.com/blog/2019/08/web_components.html)

[WebComponents 使用以及思考](https://www.cnblogs.com/Grewer/p/14733521.html)

[Web Component 使用指南](https://blog.csdn.net/qq_36157085/article/details/107415668)

### 概念

可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可以使代码更加干净、整洁。

### 三项技术

- [custom elements](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements)（自定义元素）：
  - 根据规范，自定义元素的**名称必须包含连词线**，用与区别原生的 HTML 元素，所以`<user-card>`不能写成`<usercard>`
  - `customElements.define('user-card', UserCard)`来定义
  - 类来描述`class CustomEle extends HTMLElement`，声明周期顺序：
    - constructor -> attributeChangedCallback -> connectedCallback
- [shadow dom](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)（影子 dom）：
  - 主文档 dom 与影子 dom 相隔离，内部任何代码都无法影响外部
  - 自定义元素的`this.attachShadow({ mode: 'open' })`方法开启 Shadow DOM
    - 如果 mode 为 closed 则**无法使用`this.shadowRoot`来访问影子 dom**
- [html templates](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_templates_and_slots)（html 模板）：
  - 可以在`<template>`中写 dom，比 js 创建 dom 更方便
  - 且可以在`<template>`里面使用`<style>`设置样式（与组件外部隔离，**`:host`伪类，指代自定义元素本身**）
  - 可`<template>`和`<slot>`插槽元素配合使用，供外部使用时动态设置元素，更灵活。

Shadow DOM 允许将隐藏的 DOM 树附加到常规的 DOM 树中——它以 shadow root 节点为起始根节点，在这个根节点的下方，可以是任意元素，和普通的 DOM 元素一样。

![shadow dom](https://img2020.cnblogs.com/blog/1182844/202105/1182844-20210506001821716-378293359.png)

这里，有一些 Shadow DOM 特有的术语需要我们了解：

- Shadow host：一个常规 DOM 节点，Shadow DOM 会被附加到这个节点上。
- Shadow tree：Shadow DOM 内部的 DOM 树。
- Shadow boundary：Shadow DOM 结束的地方，也是常规 DOM 开始的地方。
- Shadow root: Shadow tree 的根节点。

### 从零实现一个 Demo

如何引入 WebComponents：

- `<script src="./webComponentDemo.js"></script>`
- `<link rel="import" href="./webComponentDemo.html">`

#### js 的方式

##### 实现：

```js
// id-card.js
(function () {
  class IdCard extends HTMLElement {
    constructor() {
      super();
      // 创建影子dom，并设置为外部不可访问
      this.shadow = this.attachShadow({ mode: "closed" });
      // 初始化template
      this.shadow.innerHTML = `
      <template id="id-card">
        <div class="container">
         <img class="headpic"></img>
         <div class="number"></div>
        </div>
        <style>
        :host {
           display: flex;
           align-items: center;
           width: 450px;
           height: 180px;
           background-color: #d4d4d4;
           border: 1px solid #d5d5d5;
           box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
           border-radius: 3px;
           padding: 10px;
        }
        .container {
           display: flex;
           align-items: center;
           padding: 20px;
           height: 160px;
        }
        .container>.headpic {
           width: 160px;
           height: 160px;
           border-radius: 5px;
        }
        .container>.number {
           margin-left: 20px;
           font-size: 20px;
           font-weight: 600;
           line-height: 1;
        }
        </style>
      </template>`;
    }
    attributeChangedCallback(attr, oldVal, newVal) {
      console.log(attr, oldVal, newVal);
    }
    connectedCallback() {
      var templateElem = this.shadow.getElementById("id-card");
      // 克隆template的节点（放在多实例污染）
      var content = templateElem.content.cloneNode(true);
      content
        .querySelector(".container>.headpic")
        .setAttribute("src", this.getAttribute("headpic"));
      content.querySelector(".container>.number").innerText =
        this.getAttribute("number");
      // 将template模板中的元素加工处理，并插入到影子dom中
      this.shadow.appendChild(content);
    }
  }
  window.customElements.define("id-card", IdCard);
})();
```

##### 使用：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebComponentDemo</title>
    <!-- js方式引入 -->
    <script src="./id-card.js"></script>
  </head>
  <body>
    <id-card
      headpic="https://semantic-ui.com/images/avatar2/large/kristy.png"
      number="510123197707283411"
    />
  </body>
</html>
```

#### [HTML Imports 的方式](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/Web_Components)

##### 实现：

```html
<!-- id-card.html -->
<template id="id-card">
  <div class="container">
    <img class="headpic"></img>
    <div class="number"></div>
  </div>
  <style>
    :host {
      display: flex;
      align-items: center;
      width: 450px;
      height: 180px;
      background-color: #d4d4d4;
      border: 1px solid #d5d5d5;
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
      border-radius: 3px;
      padding: 10px;
    }

    .container {
      display: flex;
      align-items: center;
      padding: 20px;
      height: 160px;
    }

    .container>.headpic {
      width: 160px;
      height: 160px;
      border-radius: 5px;
    }

    .container>.number {
      margin-left: 20px;
      font-size: 20px;
      font-weight: 600;
      line-height: 1;
    }
  </style>
</template>

<script>
  (function () {
    class IdCard extends HTMLElement {
      constructor() {
        super();
        console.log(1223);
        // 创建影子dom，并设置为外部不可访问
        var shadow = this.attachShadow({ mode: 'closed' });
        var templateElem = document.getElementById('id-card');
        var content = templateElem.content.cloneNode(true);
        content.querySelector('.container>.headpic').setAttribute('src', this.getAttribute('headpic'));
        content.querySelector('.container>.number').innerText = this.getAttribute('number');
        // 将template模板中的元素加工处理，并插入到影子dom中
        shadow.appendChild(content);
      }
    }
    window.customElements.define('id-card', IdCard);
  }())
</script>
```

##### 使用：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebComponentDemo</title>
    <!-- link import引入html模板 -->
    <link rel="import" href="./id-card.html" id="page1" />
  </head>

  <body>
    <id-card
      headpic="https://semantic-ui.com/images/avatar2/large/kristy.png"
      number="510123197707283411"
    />
  </body>
</html>
```

#### 最终效果图

![image-20220109162631384](./img.png)
