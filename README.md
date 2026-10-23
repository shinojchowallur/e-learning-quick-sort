# Quick Sort Lab

An interactive website that teaches quick sort in C. It is a single self-contained file with no build step and no dependencies.

## Files
- `index.html`: the whole website (HTML, CSS and JavaScript). Open it in any browser.
- `quicksort.c`: the clean C program used in the lessons. Build it with `gcc quicksort.c -o quicksort && ./quicksort`.
- `QuickSort_Presentation.pdf`: the 12-slide class presentation.

## Run it
- Double-click `index.html`, or
- From this folder run `python3 -m http.server 8000` and open http://localhost:8000

## What is inside
- **Learn**: tap any bar to make it the pivot and watch the numbers split. Every tap explains why.
- **Watch**: step through the algorithm with narration, a "Why?" explanation, the highlighted C line, and the recursion stack.
- **Practice**: answer "is this number smaller than the pivot?" and "where does the pivot go?" with instant feedback.

## Where to change things (for the Antigravity agent or by hand)
- Step engine: `buildSteps()` in the `<script>` block. Each step has `text` (what happens) and `why` (the explanation).
- Colours and fonts: the `:root` tokens at the top of the `<style>` block (light and dark themes).
- Code panel text: the `CODE` array. Full program shown in the page: the `FULL` constant.
- Fonts load from Google Fonts. Without internet the page falls back to system fonts and still works.

## Ideas to extend
- Add other algorithms (merge sort, bubble sort) as new step builders.
- Pivot strategies: first, middle, random, median of three.
- A quiz mode and a "worst case" comparison chart.
