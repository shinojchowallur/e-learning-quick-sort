/**
 * Complexity & Algorithm Analysis Lab
 * Deep-dive into QuickSort's mathematical foundations, time & space complexity,
 * and algorithm comparisons.
 */

export class ComplexityLab {
  constructor(containerEl) {
    this.container = containerEl;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="complexity-wrapper">
        <!-- Interactive Big-O Calculator -->
        <div class="complexity-calc-card glass-panel">
          <div class="calc-header">
            <span class="icon">🧮</span>
            <div>
              <h3>Interactive Operations Calculator</h3>
              <p>Slide $n$ to see why $O(n \\log n)$ obliterates $O(n^2)$ as input scales!</p>
            </div>
          </div>

          <div class="slider-box">
            <div class="slider-labels">
              <span>Array Size (n): <strong id="calcNVal">1,000</strong></span>
              <span class="preset-hints">Try: 10, 100, 1,000, 10,000, 100,000</span>
            </div>
            <input type="range" id="inputN" class="range-slider" min="1" max="6" value="3" step="1" />
            <div class="scale-ticks">
              <span>10</span>
              <span>100</span>
              <span>1k</span>
              <span>10k</span>
              <span>100k</span>
              <span>1M</span>
            </div>
          </div>

          <div class="calc-results-grid">
            <div class="result-tile best">
              <span class="tile-title">QuickSort (Avg / Best)</span>
              <span class="tile-formula">~ n · log₂(n)</span>
              <span class="tile-val" id="valNLogN">~ 9,966 ops</span>
              <span class="tile-sub">Blazing Fast (Microseconds)</span>
            </div>
            <div class="result-tile worst">
              <span class="tile-title">BubbleSort / Worst Case</span>
              <span class="tile-formula">n²</span>
              <span class="tile-val" id="valNSquared">1,000,000 ops</span>
              <span class="tile-sub">Notice the massive gap!</span>
            </div>
            <div class="result-tile speedup">
              <span class="tile-title">Speedup Factor</span>
              <span class="tile-formula">n² / (n log n)</span>
              <span class="tile-val" id="valSpeedup">~ 100x Faster</span>
              <span class="tile-sub">Real-world efficiency</span>
            </div>
          </div>
        </div>

        <!-- 3 Cases Breakdown Cards -->
        <div class="cases-grid">
          <div class="case-card best-case glass-panel">
            <div class="case-badge">🟢 Best Case</div>
            <h4>O(n log n)</h4>
            <p><strong>Condition:</strong> The chosen pivot divides the array into two virtually equal halves ($n/2$) at every recursive level.</p>
            <div class="case-detail">
              <span>Recursion Tree Depth: <strong>log₂(n)</strong></span>
              <span>Work Per Level: <strong>n operations</strong></span>
              <span>Total Work: <strong>n · log₂(n)</strong></span>
            </div>
          </div>

          <div class="case-card avg-case glass-panel">
            <div class="case-badge">🔵 Average Case</div>
            <h4>O(n log n)</h4>
            <p><strong>Condition:</strong> Random data order or randomized pivot. Even an unbalanced 90/10 split still yields logarithmic tree height!</p>
            <div class="case-detail">
              <span>Expected Comparisons: <strong>~ 1.39 · n log₂(n)</strong></span>
              <span>Cache Performance: <strong>Exceptional (Sequential Memory Scan)</strong></span>
            </div>
          </div>

          <div class="case-card worst-case glass-panel">
            <div class="case-badge">🔴 Worst Case</div>
            <h4>O(n²)</h4>
            <p><strong>Condition:</strong> Array is already sorted (or reverse sorted) and the algorithm naively picks the first or last element as pivot.</p>
            <div class="case-detail">
              <span>Recursion Depth: <strong>n levels</strong></span>
              <span>Work: <strong>n + (n-1) + ... + 1 = n(n+1)/2</strong></span>
              <span>Fix: <strong>Median-of-3 or Randomized Pivot</strong></span>
            </div>
          </div>
        </div>

        <!-- Algorithm Comparison Matrix -->
        <div class="glass-panel table-panel">
          <div class="table-header">
            <h3>Sorting Algorithms Comparison Matrix</h3>
            <p>Why choose QuickSort over other popular sorting algorithms?</p>
          </div>
          <div class="table-responsive">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Best Case</th>
                  <th>Average Case</th>
                  <th>Worst Case</th>
                  <th>Memory (Space)</th>
                  <th>In-Place?</th>
                  <th>Stable?</th>
                </tr>
              </thead>
              <tbody>
                <tr class="highlight-row">
                  <td><strong>⚡ QuickSort</strong></td>
                  <td><span class="tag tag-green">O(n log n)</span></td>
                  <td><span class="tag tag-green">O(n log n)</span></td>
                  <td><span class="tag tag-red">O(n²)</span></td>
                  <td><span class="tag tag-blue">O(log n)</span></td>
                  <td><span class="tag tag-green">Yes</span></td>
                  <td><span class="tag tag-gray">No</span></td>
                </tr>
                <tr>
                  <td><strong>MergeSort</strong></td>
                  <td><span class="tag tag-green">O(n log n)</span></td>
                  <td><span class="tag tag-green">O(n log n)</span></td>
                  <td><span class="tag tag-green">O(n log n)</span></td>
                  <td><span class="tag tag-red">O(n)</span></td>
                  <td><span class="tag tag-red">No</span></td>
                  <td><span class="tag tag-green">Yes</span></td>
                </tr>
                <tr>
                  <td><strong>HeapSort</strong></td>
                  <td><span class="tag tag-green">O(n log n)</span></td>
                  <td><span class="tag tag-green">O(n log n)</span></td>
                  <td><span class="tag tag-green">O(n log n)</span></td>
                  <td><span class="tag tag-green">O(1)</span></td>
                  <td><span class="tag tag-green">Yes</span></td>
                  <td><span class="tag tag-gray">No</span></td>
                </tr>
                <tr>
                  <td><strong>InsertionSort</strong></td>
                  <td><span class="tag tag-green">O(n)</span></td>
                  <td><span class="tag tag-red">O(n²)</span></td>
                  <td><span class="tag tag-red">O(n²)</span></td>
                  <td><span class="tag tag-green">O(1)</span></td>
                  <td><span class="tag tag-green">Yes</span></td>
                  <td><span class="tag tag-green">Yes</span></td>
                </tr>
                <tr>
                  <td><strong>BubbleSort</strong></td>
                  <td><span class="tag tag-green">O(n)</span></td>
                  <td><span class="tag tag-red">O(n²)</span></td>
                  <td><span class="tag tag-red">O(n²)</span></td>
                  <td><span class="tag tag-green">O(1)</span></td>
                  <td><span class="tag tag-green">Yes</span></td>
                  <td><span class="tag tag-green">Yes</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-footnote">
            💡 <strong>Why QuickSort is favored in practice:</strong> Although MergeSort has guaranteed $O(n \log n)$ worst-case, QuickSort typically runs 2x-3x faster in real hardware because it operates in-place without memory allocation, maximizing CPU L1/L2 cache hits!
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const slider = this.container.querySelector('#inputN');
    const nValEl = this.container.querySelector('#calcNVal');
    const nLogNEl = this.container.querySelector('#valNLogN');
    const nSqEl = this.container.querySelector('#valNSquared');
    const speedupEl = this.container.querySelector('#valSpeedup');

    const updateCalc = () => {
      const exp = parseInt(slider.value, 10);
      const n = Math.pow(10, exp);

      nValEl.textContent = n.toLocaleString();

      const nLogN = Math.round(n * Math.log2(n));
      const nSq = n * n;
      const speedup = (nSq / (nLogN || 1));

      nLogNEl.textContent = `~ ${nLogN.toLocaleString()} ops`;
      nSqEl.textContent = `${nSq.toLocaleString()} ops`;
      speedupEl.textContent = `~ ${Math.round(speedup).toLocaleString()}x Faster`;
    };

    slider.addEventListener('input', updateCalc);
    updateCalc();
  }
}
