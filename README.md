# 我的 Blog

這是一個使用 Jekyll 建立的個人部落格，部署在 GitHub Pages 上。

## 🚀 快速開始

### 本地開發（使用 Docker）

```bash
# 啟動服務器
docker-compose up

# 停止服務器
docker-compose down

# 訪問 http://localhost:4000/blog
```

### 本地開發（使用 Ruby）

```bash
# 安裝依賴
bundle install

# 啟動本地伺服器
bundle exec jekyll serve

# 訪問 http://localhost:4000/blog
```

## 📝 新增文章

在 `_posts` 目錄下創建新文章，文件名格式：`YYYY-MM-DD-title.md`

```markdown
---
layout: post
title: "文章標題"
date: YYYY-MM-DD
categories: [category1, category2]
---

文章內容...
```

## 🖼️ 添加圖片

1. 將圖片放入 `assets/images/` 目錄
2. 在文章中使用：

```markdown
![圖片描述](/blog/assets/images/your-image.jpg)
```

詳見 [assets/images/README.md](assets/images/README.md)

## 🎨 自定義樣式

自定義 CSS 位於 `assets/css/style.scss`，包含：
- 優化的字體和行距
- 卡片式文章列表
- 響應式設計
- 更好的代碼顯示

## 🚀 部署

推送到 GitHub 後，GitHub Actions 會自動構建和部署網站。

```bash
git add .
git commit -m "更新內容"
git push
```

部署狀態：https://github.com/xiaomingtseng/blog/actions

## 🌐 在線訪問

**https://xiaomingtseng.github.io/blog/**
