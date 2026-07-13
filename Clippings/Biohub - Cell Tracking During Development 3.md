---
title: "Biohub - Cell Tracking During Development"
source: "https://www.kaggle.com/competitions/biohub-cell-tracking-during-development/discussion/716062"
author:
published:
created: 2026-07-13
description: "Detect and track zebrafish cells through 3D space and time"
tags:
  - "clippings"
---
Biohub · Research Code Competition · 3 months to go

### Welcome to the Biohub - Cell Tracking During Development Challenge

## Welcome to the Biohub - Cell Tracking During Development Challenge

Hello everyone,

We, at Biohub, are excited to present this challenge to you!

Advances in machine learning and computer vision have transformed many areas of science, from image analysis to biological discovery. These methods are now being applied to increasingly complex microscopy data, where even expert researchers face major challenges in managing the scale, noise, and biological complexity of the data.

Tracking cells across time in 3D microscopy is a fundamental problem in biological research. Scientists use time-lapse 3D imaging to study how cells grow, move, interact, divide, and form complex biological structures. However, analyzing these datasets remains a major bottleneck. In many studies, researchers still spend countless hours manually detecting and linking cells across frames, especially when datasets contain thousands of visually similar cells that move, deform, and divide over time.

Automated cell-tracking tools already exist, but they often struggle in real-world conditions. Dense cell populations, imaging noise, irregular cell shapes, cell divisions, and complex 3D structures can lead to tracking errors and incorrect lineage reconstruction. These errors limit scientists' ability to scale their analyses and compare results across datasets and experiments.

Based on real microscopy datasets from developing Zebrafish embryos, we are launching this challenge to provide a shared benchmark for robust 3D+time cell tracking. Your goal is to develop algorithms that can detect cells, associate them across time, identify division events, and reconstruct accurate cell lineages. We hope this challenge will inspire new methods that are reliable, generalizable, and useful for real biological research.

We have prepared the following resource to help you get started:

1 - Python library for working with 3D+time datasets, including training a small baseline, running inference, visualizing ground-truth and model predictions, understanding and computing the metrics is available here: [https://github.com/royerlab/kaggle-cell-tracking-competition](https://github.com/royerlab/kaggle-cell-tracking-competition)

## Data

By node and edge count, this dataset is the largest cell tracking dataset published to date. The provided ground truth annotations are sparse. You have to develop methods that can leverage sparsely annotated datasets. While inference will require the tracking of all cells present in the videos, your submissions will be evaluated on a random sparse subset of these cells.

## Open Problem and Research Ideas

### 1 - Data perspective

We strongly encourage you to visit the Cell Tracking Challenge ([https://celltrackingchallenge.net/)](https://celltrackingchallenge.net/\)), which is highly regarded in the field for hosting a number of 2D+time and 3D+time datasets as well as benchmarking state-of-the-art methods for cell tracking.

### 2 - Useful packages:

geff ([https://github.com/live-image-tracking-tools/geff](https://github.com/live-image-tracking-tools/geff))  
zarr ([https://zarr.readthedocs.io/en/stable/](https://zarr.readthedocs.io/en/stable/))  
tracksdata ([https://github.com/royerlab/tracksdata](https://github.com/royerlab/tracksdata))  
cupy ([https://docs.cupy.dev/en/stable/index.html](https://docs.cupy.dev/en/stable/index.html))  
cucim ([https://github.com/rapidsai/cucim](https://github.com/rapidsai/cucim))  
napari (native usage only) ([https://napari.org/](https://napari.org/))  
ndv ([https://github.com/pyapp-kit/ndv](https://github.com/pyapp-kit/ndv))  
motile ([https://github.com/funkelab/motile](https://github.com/funkelab/motile))

### 3 - Some competitive tracking methods

ultrack ([https://github.com/royerlab/ultrack](https://github.com/royerlab/ultrack))  
trackastra ([https://github.com/weigertlab/trackastra](https://github.com/weigertlab/trackastra))  
byotrack ([https://github.com/raphaelreme/byotrack](https://github.com/raphaelreme/byotrack))  
laptrack ([https://github.com/yfukai/laptrack](https://github.com/yfukai/laptrack))  
cellect ([https://github.com/zzz333za/CELLECT](https://github.com/zzz333za/CELLECT))  
ascent ([https://github.com/lu-lab/ascent](https://github.com/lu-lab/ascent))  
OrganoidTracker ([https://github.com/jvzonlab/OrganoidTracker](https://github.com/jvzonlab/OrganoidTracker))

Last but not least, we really hope you enjoy the competition. We cannot wait to see your solutions. We strongly encourage you to open-source your code and solutions so that the entire community can benefit from your work.

On behalf of all the organizers,

284

## 5 Comments

HotnessThis comment will be made public once posted.### [Youri Matiounine](https://www.kaggle.com/ymatioun)

Posted 10 days ago

· 740th in this Competition

would you please provide a script to evaluate predictions? Something that takes "submission.csv", reads "train/xxx.geff" data, and outputs final competition score? This is a required resource for a competition, and it is not easy to create it from documentation alone.

Thanks.### [Thibaut Goldsborough](https://www.kaggle.com/thibautgoldsborough)

Competition Host

Posted 2 days ago

Hey! The repo ([https://github.com/royerlab/kaggle-cell-tracking-competition](https://github.com/royerlab/kaggle-cell-tracking-competition)) we shared does implement the official metric (from a folder with.geff predictions and a folder with.geff ground truth). You're right that there was no official code for converting a.csv file to a list of.geff files, so I wrote a simple script and I recently added it to the repo, I hope that helps you running the official metric.### [LeeWhieldon](https://www.kaggle.com/leewhieldon)

Posted 4 days ago

Hi [@thibautgoldsborough](https://www.kaggle.com/thibautgoldsborough),

Thanks for putting this challenge together, really interesting problem and dataset.

Wanted to flag something I found while setting up local cross-validation: all 4 official test clips appear to have byte-identical copies in the train split, including full ground truth annotations.

Verified by comparing actual pixel data (not just filenames) at t=0, t=50, and t=99 for each clip:

| Test clip id | Train copy | Pixel-identical | Train `.geff` present |
| --- | --- | --- | --- |
| `44b6_0113de3b` | `train/44b6_0113de3b.zarr` | Yes | Yes |
| `44b6_0b24845f` | `train/44b6_0b24845f.zarr` | Yes | Yes |
| `6bba_05b6850b` | `train/6bba_05b6850b.zarr` | Yes | Yes |
| `6bba_05db0fb1` | `train/6bba_05db0fb1.zarr` | Yes | Yes |

Reproduction: read `train/{clip_id}.zarr/0/c/{t}/0/0/0` and `test/{clip_id}.zarr/0/c/{t}/0/0/0` from the competition zip for the same clip id and timepoint, decompress with blosc2, and compare arrays: they match exactly frame for frame.

If this is intentional (e.g. these clips are meant to double as both a train example and a test target), no action needed, just wanted to confirm. But if not, it means the ground truth for the hidden test set is currently downloadable by anyone through the train split, which could affect leaderboard integrity. Happy to share the verification script if it's useful for checking on your end.

Thanks again for the great competition.### [Thibaut Goldsborough](https://www.kaggle.com/thibautgoldsborough)

Competition Host

Posted 2 days ago

Hi, thank you for expressing your concern. Indeed these are dummy placeholder files to help you ensure that your submission notebook actually produces a.csv file without erroring out. The actual leaderboard score is obtained from a much bigger test set, that is deliberately kept private, and I assure you there is no overlap between that hidden test set and the train set that is publicly available. I hope that answers your question.