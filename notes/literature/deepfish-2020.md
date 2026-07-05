---
title:   DeepFish 大規模水下魚類資料集
type:    literature
date:    2026-05-12
tags:    [文獻, dataset, CV]
summary: 首個涵蓋分類、計數、分割三任務的真實水下魚類 benchmark。
draft:   false
# ↓ type=literature 專屬的 paper 區塊，版型的頂部小卡讀這裡
paper:
  title:   "DeepFish: A Realistic Fish-Habitat Dataset to Evaluate Algorithms for Underwater Visual Analysis"
  authors: [Saleh A., Laradji I., Konovalov D., Bradley M., Vázquez D., Sheppard M.]
  year:    2020
  venue:   Scientific Reports
  doi:     10.1038/s41598-020-71639-x
  link:    https://alzayats.github.io/DeepFish/
  tldr:    把「水下視覺分析」拉到統一、貼近真實棲地的評估標準上。
---

## 一句話重點

{{ paper.tldr }}

## 我的評註 / 可用之處

- 計數任務的**點標註**格式，可直接借來標箱網影像。
- 濁度退化的觀察，支持我在增強策略那篇加入 Fog 增強的決定。
