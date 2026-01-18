<div align="center">
  <img src="icon.png" width="100" height="100" alt="FrostFall Logo">
  <h1>FrostFall</h1>
  <p>
    <b>One-click tool to combine multiple Tweet photos into one continuous image.</b>
  </p>
  
  [English](#english) | [中文](#chinese)
</div>

---

<a name="english"></a>
## ❄️ Introduction

**FrostFall** is a lightweight, privacy-friendly Chrome extension designed for pure image collection on X (formerly Twitter). 

It intelligently detects tweets with multiple images, filters out unrelated content (like Quote Tweet images), fetches the highest quality versions available (`orig`), and stitches them into a seamless vertical stack.

## ✨ Features

- **Smart Stitching**: Automatically combines 2-4 images into a single vertical image.
- **Center Alignment**: Intelligent layout for images with varying aspect ratios.
- **Purity First**: Automatically filters out avatars, emojis, and images from Quote Tweets.
- **Original Quality**: Fetches the maximum resolution source files (`name=orig`) for the best output.
- **Privacy Focused**: No data collection, no tracking. Runs entirely locally in your browser.

## 🚀 Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Toggle **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the folder where you saved this repository.

## 📖 Usage

1. Browse [X.com / Twitter.com](https://x.com).
2. Find any tweet containing multiple images.
3. Look for the **Snowflake Icon** ❄️ in the action bar (next to Reply/Retweet/Like).
4. Click it! The extension will process the images and automatically download the stitched result.

---

<a name="chinese"></a>
## ❄️ 简介

**FrostFall** 是一款专为 X (Twitter) 设计的轻量级图片处理插件。它能一键提取推文中的多张配图，并以原始高质量格式垂直拼接成一张长图。

## ✨ 核心功能

- **智能拼接**: 将推文中的多张图片（2-4张）按顺序垂直合并。
- **自动居中**: 即使图片宽度不一致，也能自动居中对齐，保持视觉美观。
- **精准提取**: 智能识别并排除“引用推文”中的无关图片，只保留主内容。
- **原图画质**: 强制请求图片的最高分辨率 (`orig` 级别) 进行绘制。
- **零隐私风险**: 代码纯原生运行，不收集任何用户数据。

## 🚀 安装指南

1. 下载或克隆本项目到本地。
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`。
3. 打开右上角的 **开发者模式 (Developer mode)** 开关。
4. 点击左上角的 **加载已解压的扩展程序 (Load unpacked)**。
5. 选择本项目所在的文件夹。

## 📖 如何使用

1. 打开 [X.com / Twitter.com](https://x.com)。
2. 找到一条带有图片的推文。
3. 在推文底部的操作栏（评论、转发、点赞按钮旁边），你会看到一个新的**雪花图标** ❄️。
4. 点击它！插件会自动处理并在完成后下载拼接好的长图。

## 📄 License

MIT License
