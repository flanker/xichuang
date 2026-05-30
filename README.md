# 西窗 · xichuang.ink

灯下读诗，与古人夜话。

> 何当共剪西窗烛，却话巴山夜雨时。 —— 李商隐《夜雨寄北》

一个极简、重美感的中文古诗词站：唐诗 · 宋词。纯静态，无构建步骤。

## 特点

- **昼夜双主题**：宣纸暖白 ⇄ 夜窗烛光（右上角 ☾/☼ 切换，记忆偏好）
- 思源宋体 + 印章红，逐句/整片排布，诗与词分别处理
- 入场渐显，`prefers-reduced-motion` 友好
- 数据驱动，加诗只改一处

## 添加一首诗

编辑 `assets/poems.js`，往数组末尾追加：

```js
{
  id: "unique-id",
  dynasty: "唐",          // 朝代
  author: "王维",
  form: "诗",             // '诗' | '词'
  tune: "",              // 词牌（词专用）
  title: "相思",          // 诗题 / 词副题
  preface: "",           // 小序（词，可省）
  lines: ["红豆生南国，", "春来发几枝。"]  // 诗:每句一元素 / 词:每片一元素
}
```

## 本地预览

直接用浏览器打开 `index.html` 即可；或起个静态服务：

```sh
python3 -m http.server 8000   # 然后访问 http://localhost:8000
```

## 部署

纯静态，挂到 Cloudflare Pages / GitHub Pages，绑定 `xichuang.ink` 即可。
