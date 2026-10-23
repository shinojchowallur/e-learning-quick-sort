/**
 * QuickSort Visualizer Component
 * Core interactive player with dual bar/card views, pointer indicators,
 * active sub-array boundary highlighting, and timeline scrubber.
 */

import { QuickSortEngine } from '../engine/quicksort.js';
import { sound } from '../engine/sound.js';

export class QuickSortVisualizer {
  constructor(options) {
    this.container = options.container;
    this.codeViewer = options.codeViewer;
    this.recursionTree = options.recursionTree;

    this.engine = new QuickSortEngine();
    this.steps = [];
    this.currentStepIdx = 0;
    this.isPlaying = false;
    this.playTimer = null;
    this.speed = 800; // ms per step
    this.strategy = 'lomuto';
    this.viewMode = 'bars'; // 'bars' | 'cards'
    this.highlightSubarray = null; // for hovering over tree nodes

    this.initialArray = [42, 17, 89, 5, 63, 28, 91, 34, 12, 76];

    this.init();
  }

  init() {
    this.renderLayout();
    this.bindEvents();
    this.resetSimulation();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="visualizer-wrapper">
        <!-- Top Toolbar / Configuration Bar -->
        <div class="glass-panel controls-toolbar">
          <div class="toolbar-group">
            <label class="control-label">Array Preset</label>
            <div class="button-group presets-group">
              <button class="btn btn-sm btn-ghost active" data-preset="random">🎲 Random</button>
              <button class="btn btn-sm btn-ghost" data-preset="reversed">📉 Reversed (Worst)</button>
              <button class="btn btn-sm btn-ghost" data-preset="nearly">📈 Nearly Sorted</button>
              <button class="btn btn-sm btn-ghost" data-preset="duplicates">👯 Duplicates</button>
              <button class="btn btn-sm btn-outline" id="btnCustomArray">✍️ Custom...</button>
            </div>
          </div>

          <div class="toolbar-group">
            <label class="control-label">Pivot Strategy</label>
            <select id="selectStrategy" class="select-input">
              <option value="lomuto" selected>Lomuto (Last Element)</option>
              <option value="first">First Element</option>
              <option value="median3">Median-of-Three</option>
            </select>
          </div>

          <div class="toolbar-group">
            <label class="control-label" for="arraySizeSlider">Size: <span id="sizeValueDisplay">10</span></label>
            <input type="range" id="arraySizeSlider" class="range-slider" min="5" max="18" value="10" />
          </div>

          <div class="toolbar-group">
            <label class="control-label">View</label>
            <div class="button-group">
              <button class="btn btn-sm ${this.viewMode === 'bars' ? 'btn-primary' : 'btn-ghost'}" id="btnViewBars" title="Bars View">📊 Bars</button>
              <button class="btn btn-sm ${this.viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}" id="btnViewCards" title="Cards View">🃏 Cards</button>
            </div>
          </div>
        </div>

        <!-- Main Interactive Visualizer Stage -->
        <div class="visualizer-stage-card glass-panel">
          <!-- Step status & Math Invariant Banner -->
          <div class="stage-top-banner">
            <div class="status-badge" id="stepStatusBadge">
              <span class="pulse-dot"></span>
              <span id="stepActionTitle">Ready to Sort</span>
            </div>
            <div class="formula-badge" id="stepFormulaBadge">Array Size: 10</div>
            <div class="step-counter-badge" id="stepCounterBadge">Step 0 / 0</div>
          </div>

          <!-- The Visual Array Container -->
          <div class="array-stage-container" id="arrayStage">
            <!-- Pointers and Bars rendered dynamically -->
          </div>

          <!-- Color Coding & Pointer Legend -->
          <div class="legend-row">
            <div class="legend-pill"><span class="pill-dot pivot-dot"></span> <strong>Pivot</strong> (Benchmark)</div>
            <div class="legend-pill"><span class="pill-dot i-dot"></span> <strong>i</strong> (≤ Pivot Boundary)</div>
            <div class="legend-pill"><span class="pill-dot j-dot"></span> <strong>j</strong> (Current Scanner)</div>
            <div class="legend-pill"><span class="pill-dot swap-dot"></span> <strong>Swapping</strong></div>
            <div class="legend-pill"><span class="pill-dot sorted-dot"></span> <strong>Locked / Sorted</strong></div>
            <div class="legend-pill"><span class="pill-dot window-dot"></span> <strong>Active Sub-array [low..high]</strong></div>
          </div>

          <!-- Plain English Intuitive Explanation ("The Teacher's Note") -->
          <div class="explanation-box" id="explanationBox">
            <div class="explanation-header">
              <span class="icon">💡</span>
              <span class="title">Interactive Learning Guide</span>
            </div>
            <p class="explanation-text" id="explanationText">
              Press <strong>Play</strong> or click <strong>Step Forward</strong> to watch how QuickSort intelligently partitions the array.
            </p>
          </div>
        </div>

        <!-- Player Controls & Timeline Scrubber -->
        <div class="glass-panel playback-card">
          <!-- Timeline Scrubber -->
          <div class="timeline-row">
            <span class="timeline-time">Step 0</span>
            <input type="range" id="stepScrubber" class="timeline-slider" min="0" max="0" value="0" />
            <span class="timeline-total" id="totalStepsDisplay">Total: 0</span>
          </div>

          <div class="playback-buttons-row">
            <div class="btn-cluster">
              <button class="btn btn-outline" id="btnReset" title="Reset to Start (R)">
                <span class="btn-icon">⏮️</span> Reset
              </button>
              <button class="btn btn-outline" id="btnStepBack" title="Step Back (Left Arrow)">
                <span class="btn-icon">◀️</span> Prev
              </button>
              <button class="btn btn-primary btn-play" id="btnPlayPause" title="Play / Pause (Space)">
                <span class="btn-icon" id="playIcon">▶️</span>
                <span id="playText">Play</span>
              </button>
              <button class="btn btn-outline" id="btnStepForward" title="Step Forward (Right Arrow)">
                <span class="btn-icon">▶️</span> Next
              </button>
              <button class="btn btn-outline" id="btnToEnd" title="Jump to End">
                <span class="btn-icon">⏭️</span> End
              </button>
            </div>

            <!-- Speed & Volume Controls -->
            <div class="speed-cluster">
              <div class="speed-control">
                <span class="control-label">Speed:</span>
                <button class="btn btn-xs btn-ghost speed-btn" data-speed="1500">0.5x</button>
                <button class="btn btn-xs btn-ghost speed-btn active" data-speed="800">1x</button>
                <button class="btn btn-xs btn-ghost speed-btn" data-speed="400">2x</button>
                <button class="btn btn-xs btn-ghost speed-btn" data-speed="150">4x</button>
              </div>
              <button class="btn btn-sm btn-ghost sound-btn" id="btnSoundToggle" title="Toggle Sound">
                <span id="soundIcon">🔊</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Live Operations Metrics Bar -->
        <div class="metrics-grid">
          <div class="metric-card glass-panel">
            <div class="metric-icon">🔄</div>
            <div class="metric-info">
              <span class="metric-label">Comparisons</span>
              <span class="metric-value" id="metricComparisons">0</span>
            </div>
          </div>
          <div class="metric-card glass-panel">
            <div class="metric-icon">🔀</div>
            <div class="metric-info">
              <span class="metric-label">Swaps</span>
              <span class="metric-value" id="metricSwaps">0</span>
            </div>
          </div>
          <div class="metric-card glass-panel">
            <div class="metric-icon">🪜</div>
            <div class="metric-info">
              <span class="metric-label">Call Stack Depth</span>
              <span class="metric-value" id="metricDepth">0</span>
            </div>
          </div>
          <div class="metric-card glass-panel">
            <div class="metric-icon">⏱️</div>
            <div class="metric-info">
              <span class="metric-label">Efficiency Metric</span>
              <span class="metric-value" id="metricEfficiency">O(n log n)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Array Modal -->
      <dialog id="customArrayDialog" class="modal-dialog glass-panel">
        <form method="dialog" id="customArrayForm" class="modal-form">
          <div class="modal-header">
            <h3>✍️ Custom Array Input</h3>
            <button type="button" class="btn-close" id="btnCloseCustomModal">✕</button>
          </div>
          <div class="modal-body">
            <p class="modal-desc">Enter 5 to 18 comma-separated numbers (values between 5 and 99):</p>
            <input type="text" id="customArrayInput" class="text-input" placeholder="e.g. 52, 14, 88, 32, 7, 65, 41" value="45, 12, 89, 34, 7, 65, 23, 54" />
            <div class="error-msg" id="customArrayError"></div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" id="btnCancelCustom">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btnApplyCustom">Apply & Sort</button>
          </div>
        </form>
      </dialog>
    `;
  }

  bindEvents() {
    // Preset buttons
    this.container.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const preset = e.currentTarget.getAttribute('data-preset');
        this.applyPreset(preset);
      });
    });

    // Custom array dialog
    const customDialog = this.container.querySelector('#customArrayDialog');
    const btnCustom = this.container.querySelector('#btnCustomArray');
    const btnClose = this.container.querySelector('#btnCloseCustomModal');
    const btnCancel = this.container.querySelector('#btnCancelCustom');
    const customForm = this.container.querySelector('#customArrayForm');

    btnCustom.addEventListener('click', () => {
      customDialog.showModal();
    });

    btnClose.addEventListener('click', () => customDialog.close());
    btnCancel.addEventListener('click', () => customDialog.close());

    customForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputStr = this.container.querySelector('#customArrayInput').value;
      const parsed = inputStr
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n));

      const errorEl = this.container.querySelector('#customArrayError');
      if (parsed.length < 5 || parsed.length > 20) {
        errorEl.textContent = 'Please enter between 5 and 20 numbers.';
        return;
      }
      if (parsed.some(n => n < 1 || n > 99)) {
        errorEl.textContent = 'Please enter numbers between 1 and 99 for best visual display.';
        return;
      }

      errorEl.textContent = '';
      customDialog.close();
      this.initialArray = parsed;
      this.container.querySelector('#arraySizeSlider').value = parsed.length;
      this.container.querySelector('#sizeValueDisplay').textContent = parsed.length;
      this.resetSimulation();
    });

    // Strategy selector
    this.container.querySelector('#selectStrategy').addEventListener('change', (e) => {
      this.strategy = e.target.value;
      this.resetSimulation();
    });

    // Size slider
    const sizeSlider = this.container.querySelector('#arraySizeSlider');
    sizeSlider.addEventListener('input', (e) => {
      const size = parseInt(e.target.value, 10);
      this.container.querySelector('#sizeValueDisplay').textContent = size;
      this.initialArray = this.generateRandomArray(size);
      this.resetSimulation();
    });

    // View mode toggle
    const btnBars = this.container.querySelector('#btnViewBars');
    const btnCards = this.container.querySelector('#btnViewCards');

    btnBars.addEventListener('click', () => {
      this.viewMode = 'bars';
      btnBars.classList.add('btn-primary');
      btnBars.classList.remove('btn-ghost');
      btnCards.classList.remove('btn-primary');
      btnCards.classList.add('btn-ghost');
      this.renderCurrentStep();
    });

    btnCards.addEventListener('click', () => {
      this.viewMode = 'cards';
      btnCards.classList.add('btn-primary');
      btnCards.classList.remove('btn-ghost');
      btnBars.classList.remove('btn-primary');
      btnBars.classList.add('btn-ghost');
      this.renderCurrentStep();
    });

    // Playback buttons
    this.container.querySelector('#btnPlayPause').addEventListener('click', () => this.togglePlay());
    this.container.querySelector('#btnStepForward').addEventListener('click', () => this.stepForward());
    this.container.querySelector('#btnStepBack').addEventListener('click', () => this.stepBack());
    this.container.querySelector('#btnReset').addEventListener('click', () => this.resetSimulation());
    this.container.querySelector('#btnToEnd').addEventListener('click', () => this.jumpToEnd());

    // Timeline scrubber
    const scrubber = this.container.querySelector('#stepScrubber');
    scrubber.addEventListener('input', (e) => {
      this.pause();
      this.currentStepIdx = parseInt(e.target.value, 10);
      this.renderCurrentStep();
    });

    // Speed buttons
    this.container.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.speed = parseInt(e.currentTarget.getAttribute('data-speed'), 10);
        if (this.isPlaying) {
          this.pause();
          this.play();
        }
      });
    });

    // Sound toggle
    const btnSound = this.container.querySelector('#btnSoundToggle');
    btnSound.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      this.container.querySelector('#soundIcon').textContent = isMuted ? '🔇' : '🔊';
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.stepBack();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        this.resetSimulation();
      }
    });
  }

  generateRandomArray(size) {
    const arr = [];
    for (let k = 0; k < size; k++) {
      arr.push(Math.floor(Math.random() * 85) + 10);
    }
    return arr;
  }

  applyPreset(preset) {
    const size = parseInt(this.container.querySelector('#arraySizeSlider').value, 10);
    let arr = [];

    switch (preset) {
      case 'reversed':
        arr = Array.from({ length: size }, (_, i) => Math.round(95 - (i * 85 / (size - 1))));
        break;
      case 'nearly':
        arr = Array.from({ length: size }, (_, i) => Math.round(15 + (i * 80 / (size - 1))));
        // Swap 2 random adjacent elements
        if (arr.length > 3) {
          const swapIdx = Math.floor(Math.random() * (arr.length - 2)) + 1;
          const temp = arr[swapIdx];
          arr[swapIdx] = arr[swapIdx + 1];
          arr[swapIdx + 1] = temp;
        }
        break;
      case 'duplicates':
        const pool = [15, 38, 55, 78];
        arr = Array.from({ length: size }, () => pool[Math.floor(Math.random() * pool.length)]);
        break;
      default: // random
        arr = this.generateRandomArray(size);
        break;
    }

    this.initialArray = arr;
    this.resetSimulation();
  }

  resetSimulation() {
    this.pause();
    const result = this.engine.generateSteps(this.initialArray, this.strategy);
    this.steps = result.steps;
    this.currentStepIdx = 0;

    // Update Scrubber
    const scrubber = this.container.querySelector('#stepScrubber');
    scrubber.max = this.steps.length - 1;
    scrubber.value = 0;
    this.container.querySelector('#totalStepsDisplay').textContent = `Total: ${this.steps.length - 1}`;

    this.renderCurrentStep();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.currentStepIdx >= this.steps.length - 1) {
      this.currentStepIdx = 0;
    }
    this.isPlaying = true;
    this.updatePlayBtn();

    this.playTimer = setInterval(() => {
      if (this.currentStepIdx < this.steps.length - 1) {
        this.currentStepIdx++;
        this.renderCurrentStep();
      } else {
        this.pause();
        sound.playVictory();
      }
    }, this.speed);
  }

  pause() {
    this.isPlaying = false;
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
    this.updatePlayBtn();
  }

  stepForward() {
    this.pause();
    if (this.currentStepIdx < this.steps.length - 1) {
      this.currentStepIdx++;
      this.renderCurrentStep();
    }
  }

  stepBack() {
    this.pause();
    if (this.currentStepIdx > 0) {
      this.currentStepIdx--;
      this.renderCurrentStep();
    }
  }

  jumpToEnd() {
    this.pause();
    this.currentStepIdx = this.steps.length - 1;
    this.renderCurrentStep();
    sound.playVictory();
  }

  updatePlayBtn() {
    const playText = this.container.querySelector('#playText');
    const playIcon = this.container.querySelector('#playIcon');
    const playBtn = this.container.querySelector('#btnPlayPause');

    if (this.isPlaying) {
      playText.textContent = 'Pause';
      playIcon.textContent = '⏸️';
      playBtn.classList.add('playing');
    } else {
      playText.textContent = 'Play';
      playIcon.textContent = '▶️';
      playBtn.classList.remove('playing');
    }
  }

  setHighlightedSubarray(low, high) {
    this.highlightSubarray = (low !== null && high !== null) ? { low, high } : null;
    this.renderCurrentStep();
  }

  renderCurrentStep() {
    if (!this.steps || this.steps.length === 0) return;
    const step = this.steps[this.currentStepIdx];

    // Update scrubber
    const scrubber = this.container.querySelector('#stepScrubber');
    scrubber.value = this.currentStepIdx;

    // Update Badges
    this.container.querySelector('#stepCounterBadge').textContent = `Step ${this.currentStepIdx} / ${this.steps.length - 1}`;
    this.container.querySelector('#stepFormulaBadge').textContent = step.formula || '';
    this.container.querySelector('#stepActionTitle').textContent = this.formatStepTitle(step.type);

    // Update Explanation text
    this.container.querySelector('#explanationText').innerHTML = step.humanMessage;

    // Update Metrics
    this.container.querySelector('#metricComparisons').textContent = step.stats.comparisons;
    this.container.querySelector('#metricSwaps').textContent = step.stats.swaps;
    this.container.querySelector('#metricDepth').textContent = step.stats.currentDepth;

    // Audio cues
    if (step.type === 'COMPARE' && step.comparing) {
      sound.playCompareTone(step.array[step.comparing[0]], 5, 100);
    } else if (step.type === 'SWAP' && step.swapping) {
      sound.playSwapTone(step.array[step.swapping[0]], step.array[step.swapping[1]], 5, 100);
    } else if (step.type === 'PIVOT_LOCKED' && step.pivotVal !== null) {
      sound.playPivotLockTone(step.pivotVal, 5, 100);
    }

    // Sync Code Viewer
    if (this.codeViewer && step.codeLine) {
      this.codeViewer.highlightLine(step.codeLine);
    }

    // Sync Recursion Tree
    if (this.recursionTree && step.treeSnapshot) {
      this.recursionTree.update(step.treeSnapshot, step.activeNodeId);
    }

    // Render Array Elements
    this.renderArrayElements(step);
  }

  formatStepTitle(type) {
    switch (type) {
      case 'START': return 'Algorithm Initialized';
      case 'CALL': return 'Recursive Function Call';
      case 'BASE_CASE': return 'Base Case (Single Element)';
      case 'PIVOT_PREPARE': return 'Pivot Selected & Positioned';
      case 'CHOOSE_PIVOT': return 'Pivot Element Chosen';
      case 'INIT_PARTITION': return 'Pointers Initialized';
      case 'COMPARE': return 'Comparing Element with Pivot';
      case 'ADVANCE_I': return 'Advancing Boundary & Swapping';
      case 'SWAP': return 'Element Swapped to Left Partition';
      case 'ADVANCE_I_NO_SWAP': return 'Element Already in Left Partition';
      case 'SKIP_GREATER': return 'Element Greater than Pivot (Right Partition)';
      case 'PREPARE_PIVOT_SWAP': return 'Placing Pivot in Sorted Spot';
      case 'PIVOT_LOCKED': return 'Pivot Locked in Place! 🔒';
      case 'DONE': return 'Sorting Completed!';
      default: return 'Processing Step';
    }
  }

  renderArrayElements(step) {
    const stage = this.container.querySelector('#arrayStage');
    const arr = step.array;
    const maxVal = Math.max(...arr, 100);

    // Subarray bounds for partition box
    const inActiveRange = (idx) => {
      if (this.highlightSubarray) {
        return idx >= this.highlightSubarray.low && idx <= this.highlightSubarray.high;
      }
      return step.low !== null && step.high !== null && idx >= step.low && idx <= step.high;
    };

    stage.innerHTML = `
      <div class="array-elements-wrapper ${this.viewMode}">
        ${arr.map((val, idx) => {
          const isPivot = idx === step.pivotIdx;
          const isPointerI = idx === step.i;
          const isPointerJ = idx === step.j;
          const isComparing = step.comparing && step.comparing.includes(idx);
          const isSwapping = step.swapping && step.swapping.includes(idx);
          const isSorted = step.sortedIndices && step.sortedIndices.has(idx);
          const isActiveSub = inActiveRange(idx);

          let elementClass = 'array-item';
          if (isSorted) elementClass += ' item-sorted';
          else if (isPivot) elementClass += ' item-pivot';
          else if (isSwapping) elementClass += ' item-swapping';
          else if (isComparing) elementClass += ' item-comparing';
          else if (isPointerI && isPointerJ) elementClass += ' item-i-j';
          else if (isPointerI) elementClass += ' item-pointer-i';
          else if (isPointerJ) elementClass += ' item-pointer-j';

          if (!isActiveSub && !isSorted && step.low !== null) {
            elementClass += ' item-dimmed';
          }

          // Height percentage for bar mode
          const heightPercent = Math.max(16, Math.round((val / maxVal) * 88));

          return `
            <div class="${elementClass}" data-index="${idx}" style="--bar-height: ${heightPercent}%;">
              <!-- Top Pointer Indicators -->
              <div class="pointers-container">
                ${isPivot ? `<div class="pointer-tag pivot-tag"><span class="crown">👑</span> Pivot</div>` : ''}
                ${isPointerI && !isPointerJ ? `<div class="pointer-tag i-tag">i (≤)</div>` : ''}
                ${isPointerJ && !isPointerI ? `<div class="pointer-tag j-tag">j (scan)</div>` : ''}
                ${isPointerI && isPointerJ ? `<div class="pointer-tag ij-tag">i & j</div>` : ''}
              </div>

              <!-- Bar / Card Body -->
              <div class="bar-visual">
                <span class="bar-value">${val}</span>
                <div class="bar-fill"></div>
              </div>

              <!-- Bottom Index Indicator -->
              <div class="index-label">[${idx}]</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Active Sub-array bracket overlay -->
      ${step.low !== null && step.high !== null ? `
        <div class="active-window-indicator" style="${this.calculateWindowStyle(step.low, step.high, arr.length)}">
          <span class="window-label">Sub-array: [${step.low} .. ${step.high}]</span>
        </div>
      ` : ''}
    `;
  }

  calculateWindowStyle(low, high, total) {
    if (total === 0) return '';
    const leftPercent = (low / total) * 100;
    const widthPercent = ((high - low + 1) / total) * 100;
    return `left: ${leftPercent}%; width: ${widthPercent}%;`;
  }
}
