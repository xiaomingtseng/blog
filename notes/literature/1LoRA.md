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




![[Pasted image 20260819225911.png]]
### Introduction

**背景**：PEFT 方法（LoRA、VeRA、MoRA 等）已經能大幅減少微調大模型時需要訓練的參數量，但作者想進一步逼問：如果把每層可訓練參數壓到跟 BitFit（只調 bias，業界公認最省參數的方法之一）一樣少，能不能還維持甚至超越 LoRA 的效果？這個「参数壓到最低」的情境，論文稱作 **very low-rank regime**。

**目的**：提出 1LoRA——把 LoRA 的可訓練壓縮矩陣 A 換成固定的「特徵加總」，只保留一個可學習向量 b 做解壓縮，讓每層可訓練參數量降到只有  d 個（比 rank-1 LoRA 的  k+d 少了 k 個）。
![[notes/attachments/Pasted image 20260819145806.png]]


- k = 輸入特徵維度（固定，由模型架構決定，不是你能調的超參數）
- d = 輸出特徵維度（同樣固定）
- r = **rank**，這是唯一你可以自己設的超參數
**結論**：1LoRA 在深度估計、圖像分類、數學推理、圖像生成四種任務上，效果普遍優於同等參數量的 LoRA/VeRA/MoRA/BitFit/DiffFit，且訓練時間更短、GPU 記憶體占用更低；因為省記憶體，還能把 1LoRA 套用到更多層（不像 LoRA 大模型時只能限縮在 attention 的 QKV），進一步提升效果。

### Architecture

- **核心公式**：
	![[Pasted image 20260820112909.png]]
	其中 1 是全為 1 的固定向量（不訓練）
- **跟 LoRA 的差異**：LoRA 用兩個可訓練矩陣 A、BA、B A、B 做「壓縮→解壓縮」；1LoRA 把壓縮那一步固定死（用加總取代學習），只留解壓縮向量 b 可訓練
- **參數量**： d（vs. rank-1 LoRA 的 k+d）
- **推論零負擔**：訓練完 ΔW可直接合併回原始權重 W0​，跟 LoRA 一樣不影響推論速度
- **為什麼加總是合理的壓縮方式**：ReLU/GELU 這類激活函數會把特徵推向正值象限，全 1 向量跟這些正值特徵方向相近，不容易發生「壓縮方向錯、資訊互相抵銷」的問題（PCA 分析佐證，尤其在 MLP 第二層最明顯）

### Results

|任務|結果|
|---|---|
|深度估計 (DepthAnything)|1LoRA 全面超越同參數量對手，最接近全參數微調|
|圖像分類 (ViT-Base → CIFAR10/100)|準確率略勝多數對手，速度僅次於 BitFit|
|數學推理 (LLaMA2 7B/13B)|除了完整版 LoRA 略勝，1LoRA 打敗其他所有方法；13B 模型上因記憶體優勢可套用到所有線性層，反超 LoRA(QKV)|
|圖像生成 (DiT → Food-101)|FID 最佳，同時最省記憶體|
|Ablation|1LoRA 搭配解凍 normalization 層是最佳組合|