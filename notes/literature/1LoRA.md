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




### Introduction

**背景**：
研究脈絡：從「全量微調」到「參數高效適應」

LoRA 的誕生是為了解決大模型微調成本過高的痛點，其演進脈絡如下：

1. **全面微調（Full Fine-Tuning）**
    - **作法**：更新模型內的所有參數。
    - **痛點**：顯存需求巨大、儲存成本高（每個下游任務都要存一個完整模型檔）、容易發生「災難性遺忘」（原本的能力退化）。
2. **參數高效微調（PEFT）的早期探索**
    - **Adapter (2019)**：在 Transformer 層之間插入串聯的小型網絡。缺點是增加了模型層數，導致**推理延遲（Latency）增加**。
    - **Prefix-Tuning / Prompt Tuning (2021)**：在輸入端加入可訓練的虛擬 Token（前綴）。缺點是占用了原本珍貴的**上下文窗口長度**，且優化難度高。
3. **LoRA 的突破（Microsoft, 2021）**
    - **理論基礎**：研究發現過度參數化的模型，其權重更新其實存在一個**「很低的本徵維度」（Low Intrinsic Dimension）**。
    - **作法**：凍結原模型參數 W₀，引入兩個低秩矩陣 A 和 B 來模擬參數變化量 Δ W = B × A。
    - **優勢**：訓練時只更新 A 和 B；推理時可以把 BA 直接加回 W₀（重參量化），**達成零推理延遲**。

**1LoRA 的出現**：到了 2025、2026 年，大家發現隨著模型越來越大，即便是 LoRA 的外接加速器也有點占空間。**1LoRA**（Summation Low-Rank Adaptation）跳出來說：**「LoRA 外接兩個矩陣還是太多了，我用『加法壓縮』技術，把參數再砍半，直接縮減到極致（1 個可訓練向量）！」**

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

![[Pasted image 20260821100908.png]]



### Results

| 任務                            | 結果                                                               |
| ----------------------------- | ---------------------------------------------------------------- |
| 深度估計 (DepthAnything)          | 1LoRA 全面超越同參數量對手，最接近全參數微調                                        |
| 圖像分類 (ViT-Base → CIFAR10/100) | 準確率略勝多數對手，速度僅次於 BitFit                                           |
| 數學推理 (LLaMA2 7B/13B)          | 除了完整版 LoRA 略勝，1LoRA 打敗其他所有方法；13B 模型上因記憶體優勢可套用到所有線性層，反超 LoRA(QKV) |
| 圖像生成 (DiT → Food-101)         | FID 最佳，同時最省記憶體                                                   |
| Ablation                      | 1LoRA 搭配解凍 normalization 層是最佳組合                                  |

