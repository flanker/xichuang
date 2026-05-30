// 西窗 · 全屏诗卡 deck
(function () {
  "use strict";

  var CN_NUM = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  function cn(n) { return n <= 10 ? CN_NUM[n] : String(n); }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // ---------- 构建各屏 ----------
  function buildCover() {
    var s = el("section", "screen cover");
    var w = el("div", "wordmark");
    var seal = el("span", "seal", ""); seal.innerHTML = "西<br>窗"; seal.setAttribute("aria-hidden", "true");
    w.appendChild(seal);
    w.appendChild(el("h1", "brand", "西窗"));
    w.appendChild(el("p", "latin", "XICHUANG"));
    s.appendChild(w);
    s.appendChild(el("p", "slogan", "灯下读诗，与古人夜话"));
    s.appendChild(el("p", "source", "「何当共剪西窗烛，却话巴山夜雨时」"));
    var hint = el("div", "hint");
    hint.appendChild(el("span", "hint-text", "向下"));
    hint.appendChild(el("span", "hint-arrow", "↓"));
    s.appendChild(hint);
    return s;
  }

  function buildPoem(p, idx, total) {
    var s = el("section", "screen poem form-" + (p.form === "词" ? "ci" : "shi"));
    s.appendChild(el("span", "ghost", p.dynasty)); // 背景大字

    var inner = el("div", "poem-inner");
    inner.appendChild(el("span", "dynasty " + (p.dynasty === "唐" ? "tang" : "song"), p.dynasty));

    var head = el("div", "poem-head");
    if (p.form === "词" && p.tune) {
      head.appendChild(el("h2", "tune", p.tune));
      if (p.title) head.appendChild(el("p", "subtitle", p.title));
    } else {
      head.appendChild(el("h2", "title", p.title || ""));
    }
    inner.appendChild(head);
    inner.appendChild(el("p", "byline", "〔" + p.dynasty + "〕" + p.author));
    if (p.preface) inner.appendChild(el("p", "preface", p.preface));

    var body = el("div", "body");
    p.lines.forEach(function (line) {
      body.appendChild(el("p", p.form === "词" ? "stanza" : "verse", line));
    });
    inner.appendChild(body);

    var num = el("p", "index");
    num.innerHTML = "<i>" + cn(idx) + "</i> / " + cn(total);
    inner.appendChild(num);

    s.appendChild(inner);
    return s;
  }

  function buildColophon() {
    var s = el("section", "screen colophon");
    s.appendChild(el("span", "rule", ""));
    s.appendChild(el("p", "mark", "西窗 · xichuang.ink"));
    s.appendChild(el("p", "tiny", "唐诗宋词　选录"));
    return s;
  }

  // ---------- 装配 ----------
  var deck = document.getElementById("deck");
  var dotsNav = document.getElementById("dots");
  var poems = window.POEMS || [];
  var total = poems.length;
  var screens = [];

  function add(node, label) { deck.appendChild(node); screens.push({ node: node, label: label }); }

  add(buildCover(), "封面");
  poems.forEach(function (p, i) { add(buildPoem(p, i + 1, total), p.title || p.tune); });
  add(buildColophon(), "落款");

  // 页点
  screens.forEach(function (sc, i) {
    var b = el("button", "dot");
    b.type = "button";
    b.setAttribute("aria-label", sc.label);
    b.addEventListener("click", function () { goto(i); });
    dotsNav.appendChild(b);
    sc.dot = b;
  });

  // ---------- 导航 ----------
  var current = 0;
  function setActive(i) {
    if (i === current) return;
    if (screens[current]) screens[current].dot.classList.remove("on");
    current = i;
    if (screens[current]) screens[current].dot.classList.add("on");
  }
  function goto(i) {
    i = Math.max(0, Math.min(screens.length - 1, i));
    screens[i].node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // 滚动时高亮当前屏
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > 0.55) {
          var i = screens.findIndex(function (sc) { return sc.node === e.target; });
          if (i >= 0) setActive(i);
        }
      });
    }, { threshold: [0.55] });
    screens.forEach(function (sc) { io.observe(sc.node); });
  } else {
    screens[0].dot.classList.add("on");
  }

  // 键盘上下翻
  window.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "ArrowDown": case "PageDown": case " ":
        e.preventDefault(); goto(current + 1); break;
      case "ArrowUp": case "PageUp":
        e.preventDefault(); goto(current - 1); break;
      case "Home": e.preventDefault(); goto(0); break;
      case "End": e.preventDefault(); goto(screens.length - 1); break;
    }
  });

  // ---------- 昼夜主题 ----------
  (function theme() {
    var KEY = "xichuang-theme";
    var btn = document.getElementById("theme-toggle");
    try { var saved = localStorage.getItem(KEY); if (saved) document.documentElement.setAttribute("data-theme", saved); } catch (e) {}
    btn && btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "night" ? "day" : "night";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  })();
})();
