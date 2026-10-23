/**
 * Interactive Walkthrough & Educational Guide
 * Hands-on lessons explaining QuickSort's divide-and-conquer strategy,
 * pivot selection intuition, and partition mechanics.
 */

export class WalkthroughGuide {
  constructor(containerEl, onTryExample = null) {
    this.container = containerEl;
    this.onTryExample = onTryExample;
    this.currentChapter = 1;

    this.render();
  }

  setChapter(chapterNum) {
    this.currentChapter = chapterNum;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="walkthrough-wrapper">
        <!-- Interactive Chapter Navigation -->
        <div class="walkthrough-nav glass-panel">
          <div class="chapter-tabs" role="tablist">
            <button class="chapter-tab ${this.currentChapter === 1 ? 'active' : ''}" data-chap="1">
              <span class="chap-badge">1</span>
              <span class="chap-title">The Big Idea</span>
            </button>
            <button class="chapter-tab ${this.currentChapter === 2 ? 'active' : ''}" data-chap="2">
              <span class="chap-badge">2</span>
              <span class="chap-title">The Pivot Secret</span>
            </button>
            <button class="chapter-tab ${this.currentChapter === 3 ? 'active' : ''}" data-chap="3">
              <span class="chap-badge">3</span>
              <span class="chap-title">The Partition Dance</span>
            </button>
            <button class="chapter-tab ${this.currentChapter === 4 ? 'active' : ''}" data-chap="4">
              <span class="chap-badge">4</span>
              <span class="chap-title">Recursion & Base Cases</span>
            </button>
          </div>
        </div>

        <!-- Chapter Content Card -->
        <div class="walkthrough-content-card glass-panel">
          ${this.renderChapterContent()}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll('.chapter-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const chap = parseInt(e.currentTarget.getAttribute('data-chap'), 10);
        this.setChapter(chap);
      });
    });

    // Try in visualizer buttons
    const tryBtn = this.container.querySelector('.btn-try-visualizer');
    if (tryBtn) {
      tryBtn.addEventListener('click', () => {
        if (this.onTryExample) {
          this.onTryExample();
        }
      });
    }

    // Interactive mini-widget inside chapter 3 (Interactive Step-by-Step simulator)
    const nextMiniBtn = this.container.querySelector('#miniStepNext');
    if (nextMiniBtn) {
      let miniStep = 0;
      const stepsData = [
        {
          desc: "Initial: Array is [23, 45, 12, 35]. Pivot is 35 (at end). Pointer i starts at -1, j at 0.",
          arr: [23, 45, 12, 35],
          i: -1,
          j: 0,
          pivot: 3
        },
        {
          desc: "j = 0: Comparing 23 with Pivot 35. 23 ≤ 35! So increment i to 0 and swap arr[0] with arr[0] (no change).",
          arr: [23, 45, 12, 35],
          i: 0,
          j: 0,
          pivot: 3
        },
        {
          desc: "j = 1: Comparing 45 with Pivot 35. 45 > 35! It stays in the larger section. i remains at 0, advance j to 2.",
          arr: [23, 45, 12, 35],
          i: 0,
          j: 1,
          pivot: 3
        },
        {
          desc: "j = 2: Comparing 12 with Pivot 35. 12 ≤ 35! Increment i to 1 and SWAP arr[1] (45) with arr[2] (12)!",
          arr: [23, 12, 45, 35],
          i: 1,
          j: 2,
          pivot: 3
        },
        {
          desc: "Final Swap: All scanned! Place Pivot 35 at index i + 1 = 2 by swapping arr[2] (45) with arr[3] (35).",
          arr: [23, 12, 35, 45],
          i: 2,
          j: null,
          pivot: 2
        },
        {
          desc: "Done! Notice: [23, 12] are ≤ 35, and [45] is > 35. Pivot 35 is now locked in its final sorted index!",
          arr: [23, 12, 35, 45],
          i: 2,
          j: null,
          pivot: 2,
          locked: true
        }
      ];

      nextMiniBtn.addEventListener('click', () => {
        miniStep = (miniStep + 1) % stepsData.length;
        const cur = stepsData[miniStep];
        this.container.querySelector('#miniDesc').textContent = cur.desc;
        const miniStage = this.container.querySelector('#miniArrayStage');
        miniStage.innerHTML = cur.arr.map((val, idx) => {
          let cls = 'mini-item';
          if (cur.locked && idx === cur.pivot) cls += ' mini-locked';
          else if (idx === cur.pivot) cls += ' mini-pivot';
          else if (idx === cur.j) cls += ' mini-j';
          else if (idx === cur.i) cls += ' mini-i';
          return `<div class="${cls}"><span class="mini-val">${val}</span><span class="mini-idx">[${idx}]</span></div>`;
        }).join('');
      });
    }
  }

  renderChapterContent() {
    switch (this.currentChapter) {
      case 1:
        return `
          <div class="chapter-body">
            <div class="chapter-header">
              <span class="chapter-number">Chapter 01</span>
              <h2>The Big Idea: Divide and Conquer</h2>
              <p class="chapter-subtitle">Why QuickSort is one of the most celebrated algorithms in computer science.</p>
            </div>

            <div class="walkthrough-grid">
              <div class="info-card">
                <h3>💡 The Core Insight</h3>
                <p>
                  Sorting $n$ items by comparing each with every other item takes $O(n^2)$ time—which gets painfully slow as data grows.
                </p>
                <p>
                  QuickSort uses <strong>Divide and Conquer</strong>:
                </p>
                <ol class="styled-list">
                  <li><strong>Pick an element</strong> from the list (called the <em>Pivot</em>).</li>
                  <li><strong>Partition</strong> the array so everything smaller than the pivot is on its left, and everything greater is on its right.</li>
                  <li><strong>Recursively repeat</strong> this on the left and right sub-arrays until the whole list is sorted!</li>
                </ol>
              </div>

              <div class="visual-explanation-card">
                <h4>🎯 The "Golden Guarantee" of QuickSort</h4>
                <div class="concept-diagram">
                  <div class="diagram-partition">
                    <div class="diagram-box box-left">
                      <span class="box-tag">Left Sub-array</span>
                      <span class="box-rule">All elements ≤ Pivot</span>
                    </div>
                    <div class="diagram-box box-pivot">
                      <span class="box-tag">⭐ PIVOT</span>
                      <span class="box-rule">In its 100% final sorted position!</span>
                    </div>
                    <div class="diagram-box box-right">
                      <span class="box-tag">Right Sub-array</span>
                      <span class="box-rule">All elements > Pivot</span>
                    </div>
                  </div>
                </div>
                <div class="diagram-caption">
                  Notice: Once partitioned, the pivot element <strong>never needs to move again</strong>! It is locked in its permanent place.
                </div>
              </div>
            </div>

            <div class="chapter-footer">
              <button class="btn btn-primary btn-try-visualizer">
                <span>🚀 Watch it in Action on Visualizer</span>
              </button>
            </div>
          </div>
        `;

      case 2:
        return `
          <div class="chapter-body">
            <div class="chapter-header">
              <span class="chapter-number">Chapter 02</span>
              <h2>The Pivot Secret: Choosing Wisely</h2>
              <p class="chapter-subtitle">How your choice of pivot determines whether QuickSort runs in blazing $O(n \log n)$ or slows to $O(n^2)$.</p>
            </div>

            <div class="cards-grid-3">
              <div class="strategy-card glass-panel">
                <div class="strat-icon">📍</div>
                <h4>1. Last Element (Lomuto)</h4>
                <p>Always pick <code>arr[high]</code>. Easiest to understand and program. Standard in textbook teaching.</p>
                <div class="strat-badge warning">⚠️ Worst case on sorted arrays</div>
              </div>

              <div class="strategy-card glass-panel">
                <div class="strat-icon">🎲</div>
                <h4>2. Random Pivot</h4>
                <p>Pick a random index and swap with the end. Gives virtually guaranteed $O(n \log n)$ on any real-world input.</p>
                <div class="strat-badge success">✅ Robust in practice</div>
              </div>

              <div class="strategy-card glass-panel">
                <div class="strat-icon">⚖️</div>
                <h4>3. Median-of-Three</h4>
                <p>Look at the first, middle, and last elements. Pick the median of those three. Prevents pathological worst-cases.</p>
                <div class="strat-badge success">⭐ Industry Standard</div>
              </div>
            </div>

            <div class="callout-box">
              <div class="callout-icon">💡</div>
              <div class="callout-content">
                <strong>Why does balance matter?</strong>
                <p>
                  If the pivot splits the array into two equal halves ($50/50$), the recursion tree depth is only $\log_2(n)$ levels.
                  For $1,000,000$ elements, that's just <strong>20 levels</strong>!
                  However, if the pivot is always the smallest or largest element, the depth is <strong>1,000,000 levels</strong> ($O(n^2)$).
                </p>
              </div>
            </div>
          </div>
        `;

      case 3:
        return `
          <div class="chapter-body">
            <div class="chapter-header">
              <span class="chapter-number">Chapter 03</span>
              <h2>The Partition Dance: Step-by-Step Anatomy</h2>
              <p class="chapter-subtitle">Follow the two-pointer dance: Pointer <code>i</code> and Pointer <code>j</code>.</p>
            </div>

            <div class="pointers-breakdown">
              <div class="pointer-card pointer-i">
                <div class="card-title"><span class="badge-i">Pointer i</span> The Wall / Boundary</div>
                <p>Starts at <code>low - 1</code>. Keeps track of where the "smaller elements" zone ends. Everything at or to the left of <code>i</code> is $\le$ Pivot.</p>
              </div>
              <div class="pointer-card pointer-j">
                <div class="card-title"><span class="badge-j">Pointer j</span> The Explorer / Scanner</div>
                <p>Scans every item from <code>low</code> to <code>high - 1</code>. Compares <code>arr[j]</code> against the Pivot.</p>
              </div>
            </div>

            <!-- Interactive Mini Simulator -->
            <div class="mini-sim-card glass-panel">
              <div class="mini-sim-header">
                <h4>Interactive Mini-Walkthrough: Sort <code>[23, 45, 12, 35]</code></h4>
                <button class="btn btn-sm btn-primary" id="miniStepNext">Click to Next Step ⏭️</button>
              </div>
              <div class="mini-array-stage" id="miniArrayStage">
                <div class="mini-item mini-i mini-j"><span class="mini-val">23</span><span class="mini-idx">[0]</span></div>
                <div class="mini-item"><span class="mini-val">45</span><span class="mini-idx">[1]</span></div>
                <div class="mini-item"><span class="mini-val">12</span><span class="mini-idx">[2]</span></div>
                <div class="mini-item mini-pivot"><span class="mini-val">35</span><span class="mini-idx">[3] (Pivot)</span></div>
              </div>
              <p class="mini-desc" id="miniDesc">
                Initial State: Pivot is 35 at index 3. Pointers i = -1, j = 0. Click 'Next Step' above to watch the partition logic!
              </p>
            </div>
          </div>
        `;

      case 4:
        return `
          <div class="chapter-body">
            <div class="chapter-header">
              <span class="chapter-number">Chapter 04</span>
              <h2>Recursion & The Base Case</h2>
              <p class="chapter-subtitle">How sub-arrays shrink until sorting is trivially complete.</p>
            </div>

            <div class="walkthrough-grid">
              <div class="info-card">
                <h3>🛑 When does recursion stop?</h3>
                <p>
                  Every recursive algorithm needs a <strong>Base Case</strong> to prevent infinite loops.
                </p>
                <div class="code-callout">
                  <code>if (low &gt;= high) return; // Base Case</code>
                </div>
                <ul class="styled-list">
                  <li><strong>Size = 1 (low == high)</strong>: An array with only one number is automatically sorted!</li>
                  <li><strong>Size = 0 (low &gt; high)</strong>: Occurs when all elements were strictly greater or strictly smaller than the pivot. Empty sub-arrays need no sorting.</li>
                </ul>
              </div>

              <div class="info-card">
                <h3>🌳 The Recursion Call Stack</h3>
                <p>
                  QuickSort creates a tree of function calls:
                </p>
                <div class="tree-sketch">
                  <div class="tree-step">1. <code>quickSort(0, 9)</code> partitions around pivot 42</div>
                  <div class="tree-branch-sketch">
                    <div class="tree-step sub">↳ <code>quickSort(0, 3)</code> [Left elements ≤ 42]</div>
                    <div class="tree-step sub">↳ <code>quickSort(5, 9)</code> [Right elements > 42]</div>
                  </div>
                </div>
                <p>
                  Because the subproblems are independent, they can even be solved in parallel on modern multi-core CPUs!
                </p>
              </div>
            </div>

            <div class="chapter-footer">
              <button class="btn btn-primary btn-try-visualizer">
                <span>🚀 Ready to Test Your Knowledge? Try Playground!</span>
              </button>
            </div>
          </div>
        `;

      default:
        return '';
    }
  }
}
