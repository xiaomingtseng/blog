# 我的 Blog

這是一個使用 Jekyll 建立的個人部落格，部署在 GitHub Pages 上。

## 本地開發

```bash
# 安裝依賴
bundle install

# 啟動本地伺服器
bundle exec jekyll serve

# 訪問 http://localhost:4000/blog
```

## 部署

推送到 GitHub 後，GitHub Pages 會自動構建和部署網站。

## 新增文章

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
