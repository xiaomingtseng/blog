# 圖片資源目錄

此目錄用於存放 blog 中使用的圖片資源。

## 📁 目錄結構建議

```
assets/images/
├── profile/          # 個人照片、頭像
├── posts/            # 文章配圖
├── hobbies/          # 興趣愛好相關圖片
│   ├── swimming/
│   ├── gaming/
│   └── photography/
└── projects/         # 專案截圖
```

## 🖼️ 使用方式

### 在文章中插入圖片

```markdown
![圖片描述](/blog/assets/images/posts/image-name.jpg)
```

### 在頁面中插入圖片

```markdown
![個人照片](/blog/assets/images/profile/photo.jpg)
```

## 📸 建議的圖片

為了豐富 blog 內容，建議添加：

1. **個人照片** (`profile/`)
   - 個人頭像或生活照
   - 建議尺寸：300x300 到 500x500 px

2. **興趣愛好照片** (`hobbies/`)
   - 游泳訓練或比賽照片
   - 遊戲截圖
   - 攝影作品展示

3. **專案截圖** (`projects/`)
   - Data Engineering 專案結果
   - 技術學習成果

## 💡 圖片優化建議

- 使用 JPG 格式用於照片（較小檔案）
- 使用 PNG 格式用於截圖或需要透明背景的圖片
- 建議寬度不超過 1200px
- 壓縮圖片以加快載入速度
