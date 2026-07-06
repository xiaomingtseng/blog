---
title:   用 YOLOv8 做魚體偵測的資料增強策略
type:    research           # research | literature | idea | life
date:    2026-06-28
updated: 2026-06-29         # 選填
tags:    [CV, YOLO, 養殖]    # 自由多選
summary: 針對水下低對比影像，比較五種增強策略對 mAP@0.5 的實際影響。
draft:   false
math:    true               # 這篇有 LaTeX → 版面才載入 katex.css
---
Test Line !!!!!!!!!!!
Test Line2
## 背景與問題

水下養殖影像**低對比、懸浮顆粒多**，直接 fine-tune 會掉 mAP。[^1]

> 與其蒐集更多資料，不如先把「水」這個變因建模進訓練分佈。

## 評估指標

主要看 mAP@0.5，框品質以 IoU 衡量：

$$ \text{IoU} = \frac{\text{area}(B_{pred}\cap B_{gt})}{\text{area}(B_{pred}\cup B_{gt})} $$

```python
import albumentations as A
transform = A.Compose([
    A.RandomBrightnessContrast(p=0.5),
    A.RandomFog(fog_coef_upper=0.4, p=0.3),  # 模擬濁度
])
```

![增強前後對照](attachments/aug-compare.png)

[^1]: 時段差異主要來自餵食前後的魚群密度與水體濁度。
