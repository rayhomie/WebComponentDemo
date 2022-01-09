// js的方式
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
