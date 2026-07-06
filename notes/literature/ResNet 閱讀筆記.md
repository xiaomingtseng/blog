---
title: ResNet 閱讀筆記
type: literature
date: 2026-07-06
tags: [文獻, CNN, image-classification]
summary: 提出殘差學習框架，讓極深的網路更容易訓練，ImageNet 上做到 152 層。
draft: false
paper:
  title: Deep Residual Learning for Image Recognition
  authors: [Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun]
  year: 2015
  venue: arXiv (later CVPR 2016)
  doi: 10.48550/arXiv.1512.03385
  link: https://arxiv.org/abs/1512.03385
  pdf: https://arxiv.org/pdf/1512.03385
  tldr: 用殘差連接（skip connection）解決深層網路訓練困難的問題，讓網路能做到 152 層還持續進步。
---


## 一句話印象

深度網路訓練誤差反而隨深度上升的問題，靠殘差連接（skip connection）解決——讓每層學「跟輸入的差異」而不是從零學映射，深到 152 層還能繼續進步。

## 隨手記幾點

- 核心結構：$y = F(x) + x$，$F$ 是幾層卷積，$x$ 直接跳接過去加回輸出
- 解決的是**優化困難**，不是 overfitting——這點之前沒特別意識到
- ImageNet 2015 冠軍，COCO 系列任務也全部拿下

## 之後想深入的地方

- [ ] identity mapping 為什麼對梯度傳遞這麼關鍵，之後找 ResNet v2（"Identity Mappings in Deep Residual Networks"）那篇補
- [ ] 跟 DenseNet 的 skip connection 設計差在哪