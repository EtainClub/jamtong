#!/bin/sh
# 사용: scripts/cartoon-sheet.sh <slug> <out.jpg> — 업적 카툰 칸을 한 장에 모아 본다(검수용).
set -e
dir=public/cartoons/$1
magick montage -font /System/Library/Fonts/Supplemental/Arial.ttf -label "%t" $(ls $dir/*.webp | sort) -tile 2x -geometry 540x360+4+4 -background white "$2"
