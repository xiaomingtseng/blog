---
title: "CNN-based Density Estimation and Crowd Counting: A Survey"
type: literature
date: 2026-10-04
tags:
  - 文獻
  - Crowd Counting
summary: 這是一篇 crowd counting（人群計數）的 survey，引用 220 多篇文獻，聚焦在 CNN + density map（密度圖）這條路線。作者想說明的不只是「哪些方法有效」，而是「為什麼有效」，並主張這些技術可以推廣到車輛、細胞、動物等其他計數任務。
draft: true
math: true
paper:
  title: "CNN-based Density Estimation and Crowd Counting: A Survey"
  authors: Guangshuai Gao, Junyu Gao, Qingjie Liu, Qi Wang, Yunhong Wang
  year: 2020
  venue: arXiv preprint (cs.CV), arXiv:2003.12783v1
  doi: 10.48550/arXiv.2003.12783
  link: https://arxiv.org/abs/2003.12783
  pdf: https://arxiv.org/pdf/2003.12783
  tldr: 系統性回顧 CNN 密度圖式人群計數，依網路架構、學習範式、監督形式等分類，並整理資料集、指標與效能比較。
---
### 核心內容

**1. 方法演進（Fig. 1、第 I 節）**  
偵測式 → 迴歸式（image → count）→ 密度估計（Lempitsky 2010）→ CNN 密度估計（2015 起）。偵測式在密集場景遇到遮擋就失效；迴歸式忽略空間資訊

**2. 分類法（第 II 節，全文骨架）**

|分類維度|類別|
|---|---|
|網路架構|Basic / Multi-column（如 MCNN）/ Single-column（如 CSRNet）|
|學習範式|Single-task / Multi-task|
|推論方式|Patch-based / Whole-image|
|監督形式|全監督 / 無、半、弱、自監督|
|領域|單領域 / 跨領域（domain adaptation）|
|監督層級|Instance-level（點標註）/ Image-level|

**3. 資料集與指標（第 III、IV 節）**

- 資料集：UCSD、Mall、UCF_CC_50、ShanghaiTech、UCF-QNRF、NWPU-Crowd 等，另列車輛、企鵝、細胞、小麥等其他領域資料集。
- 指標：MAE、RMSE（影像層級）；PSNR、SSIM（密度圖品質）；AP/AR（定位）。

**4. 效能比較與分析（第 V 節）**

- Table IV 比較 60 種方法。CNN 方法大幅勝過傳統方法。
- 結論：**single-column 比 multi-column 更簡單有效**，注意力機制、dilated convolution、spatial pyramid pooling 是常見的有效技術。

**5. 開放問題（第 VI 節）**  
密度圖生成方式、損失函數、密度圖品質、**domain gap**（跨資料集 MAE 上升約 45%）、背景干擾、通用計數模型、輕量化、影像與影片結合、多視角、定位與追蹤、微小物體計數。

### 三、如何閱讀（依目的）

**目的 A：快速建立整體概念（約 30 分鐘）**

1. 讀 Abstract + 第 I 節（含 Fig. 1、Fig. 2、Fig. 3）
2. 第 II 節只看每個小節的標題與一兩個代表方法：MCNN、CSRNet、L2R、CAC、PPPD
3. 第 V-B 節的結論條列、第 VII 節

**目的 B：為做魚類／動物計數找方法（建議路線）**

1. **II-A**：理解為什麼 CSRNet 這類 single-column 架構成為主流
2. **II-D**：自監督／半監督，重點看 **L2R**（魚類論文用的就是它）
3. **II-E 與 VI-F**：跨領域與通用計數，重點看 **CAC、PPPD**（PPPD 已用在企鵝、細胞）
4. **VI-A**：密度圖生成（Gaussian kernel、adaptive kernel），這是實作時的關鍵細節
5. **VI-E**：背景／負樣本魯棒性，對應魚類論文的「noise（海豚、漁網）」問題
6. 參考文獻 [23] French et al. 是**魚類計數**，[17] Arteta 是動物計數（Counting in the wild）

**目的 C：找實作與資料集**  
第 III 節的 Table III 與第 V 節的 Table IV，GitHub 連結在摘要與 VI-B。

### 四、閱讀時的注意事項

- **可以跳過**：Table II、Table IV 的逐筆數字，除非你要找 baseline；Table I（前人 survey 列表）只需瀏覽。
- **時效**：這是 **2020 年 3 月**的版本（v1），不含 Transformer、點監督定位（如 P2PNet）、CLIP-based 計數等 2021 年後的發展。要讀最新進展需另找較新的 survey。
- **寫作品質**：英文有不少文法問題與語意不順之處，讀不懂時多半是表達問題，不一定是你的理解有誤。
- **偏重人群**：結論中的許多觀察（如「VGG16 是最佳 backbone」）是針對人群資料，不一定適用於水下或聲納影像。魚類論文用 ResNet-50 就是一個對照。