---
title: "1LoRA: Summation Compression for Very Low-Rank Adaptation"
type: literature
date: 2026-08-19
tags:
  - 文獻
  - PEFT
summary: 1LoRA 用「加總壓縮 + 一個可學習向量解壓縮」取代 LoRA 的兩個矩陣，參數更少、效果更好。
draft: false
math: true
paper:
  title: "1LoRA: Summation Compression for Very Low-Rank Adaptation"
  authors:
    - Alessio Quercia
    - Zhuo Cao
    - Arya Bangun
    - Richard D. Paul
    - Abigail Morrison
  year: 2025
  link: https://arxiv.org/abs/2503.08333
  pdf: https://arxiv.org/abs/2503.08333
  tldr: 改良LoRA
---

- k = 輸入特徵維度（固定，由模型架構決定，不是你能調的超參數）
- d = 輸出特徵維度（同樣固定）
- r = **rank**，這是唯一你可以自己設的超參數

![[Pasted image 20260819145806.png]]