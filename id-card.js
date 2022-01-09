// js的方式
(function () {
  class IdCard extends HTMLElement {
    constructor() {
      super();
      // 创建影子dom，并设置为外部不可访问
      this.shadow = this.attachShadow({ mode: "closed" });
      this.shadow.innerHTML = `
      <template id="id-card">
        <div class="container">
         <img class="headpic"></img>
         <div class="number"></div>
        </div>
      </template>`;
    }
    attributeChangedCallback(attr, oldVal, newVal) {
      console.log(attr, oldVal, newVal);
    }
    connectedCallback() {
      var templateElem = this.shadow.getElementById("id-card");
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
