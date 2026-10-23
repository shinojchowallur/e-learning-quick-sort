/**
 * Interactive Playground & Challenge Modes
 * Gamified interactive challenges for intuitive QuickSort mastery.
 */

import { sound } from '../engine/sound.js';

export class PlaygroundChallenges {
  constructor(containerEl) {
    this.container = containerEl;
    this.activeMode = 'predict'; // 'predict' | 'pivotLand' | 'bucket'
    this.score = 0;
    this.streak = 0;

    // Challenge state
    this.currentQuestion = null;

    this.render();
  }

  setMode(mode) {
    this.activeMode = mode;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="playground-wrapper">
        <!-- Top Mode Selector & Scoreboard -->
        <div class="playground-topbar glass-panel">
          <div class="mode-buttons-group" role="tablist">
            <button class="btn btn-sm ${this.activeMode === 'predict' ? 'btn-primary' : 'btn-ghost'}" data-mode="predict">
              🎮 Challenge 1: Predict Next Move
            </button>
            <button class="btn btn-sm ${this.activeMode === 'pivotLand' ? 'btn-primary' : 'btn-ghost'}" data-mode="pivotLand">
              🎯 Challenge 2: Pivot Landing Spot
            </button>
            <button class="btn btn-sm ${this.activeMode === 'bucket' ? 'btn-primary' : 'btn-ghost'}" data-mode="bucket">
              🪣 Challenge 3: Manual Bucket Partition
            </button>
          </div>

          <div class="scoreboard">
            <div class="score-pill">
              <span class="score-icon">⭐</span>
              <span class="score-label">Score:</span>
              <span class="score-num" id="userScore">${this.score}</span>
            </div>
            <div class="score-pill">
              <span class="score-icon">🔥</span>
              <span class="score-label">Streak:</span>
              <span class="streak-num" id="userStreak">${this.streak}</span>
            </div>
          </div>
        </div>

        <!-- Challenge Stage Container -->
        <div class="challenge-stage-card glass-panel" id="challengeStage">
          ${this.renderChallengeBody()}
        </div>
      </div>
    `;

    this.bindEvents();
    this.loadChallengeQuestion();
  }

  bindEvents() {
    this.container.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-mode');
        this.setMode(mode);
      });
    });
  }

  renderChallengeBody() {
    switch (this.activeMode) {
      case 'predict':
        return `
          <div class="challenge-box">
            <div class="challenge-header">
              <span class="badge-tag">Challenge 1</span>
              <h3>Predict the Partition Move</h3>
              <p>Look at the scanning pointer <code>j</code>, boundary <code>i</code>, and the Pivot. What should the algorithm do next?</p>
            </div>

            <div class="challenge-array-display" id="quizArrayDisplay"></div>

            <div class="quiz-question-box" id="quizQuestionBox">
              <h4 id="questionPrompt">Loading question...</h4>
              <div class="quiz-options-grid" id="quizOptions"></div>
            </div>

            <div class="feedback-banner" id="feedbackBanner" style="display: none;"></div>
          </div>
        `;

      case 'pivotLand':
        return `
          <div class="challenge-box">
            <div class="challenge-header">
              <span class="badge-tag">Challenge 2</span>
              <h3>Where Will the Pivot Land?</h3>
              <p>Without running the full partition, predict the final index where the Pivot element will settle!</p>
            </div>

            <div class="challenge-array-display" id="pivotArrayDisplay"></div>

            <div class="quiz-question-box">
              <h4 id="pivotQuestionPrompt">Loading...</h4>
              <p class="quiz-hint">💡 Pro-tip: Count how many elements in the array are strictly smaller than the pivot!</p>
              <div class="pivot-index-selector" id="pivotIndexButtons"></div>
            </div>

            <div class="feedback-banner" id="pivotFeedbackBanner" style="display: none;"></div>
          </div>
        `;

      case 'bucket':
        return `
          <div class="challenge-box">
            <div class="challenge-header">
              <span class="badge-tag">Challenge 3</span>
              <h3>Manual Bucket Partition</h3>
              <p>Click elements from the pool to sort them into the <strong>Left Bucket (≤ Pivot)</strong> or <strong>Right Bucket (&gt; Pivot)</strong>.</p>
            </div>

            <div class="bucket-game-area" id="bucketGameArea">
              <!-- Loaded dynamically -->
            </div>

            <div class="feedback-banner" id="bucketFeedbackBanner" style="display: none;"></div>
          </div>
        `;

      default:
        return '';
    }
  }

  loadChallengeQuestion() {
    if (this.activeMode === 'predict') {
      this.initPredictChallenge();
    } else if (this.activeMode === 'pivotLand') {
      this.initPivotLandChallenge();
    } else if (this.activeMode === 'bucket') {
      this.initBucketChallenge();
    }
  }

  // --- Challenge 1: Predict Partition Move ---
  initPredictChallenge() {
    const size = 6;
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 15);
    const pivotVal = arr[size - 1];
    const j = Math.floor(Math.random() * (size - 1));
    const currentVal = arr[j];
    const i = Math.max(-1, j - (Math.random() > 0.5 ? 1 : 2));

    const isLessOrEqual = currentVal <= pivotVal;

    this.currentQuestion = {
      arr,
      pivotIdx: size - 1,
      pivotVal,
      j,
      i,
      correctAction: isLessOrEqual ? 'swap' : 'skip',
      explanation: isLessOrEqual
        ? `Correct! Because ${currentVal} ≤ ${pivotVal}, it belongs in the left partition. We increment boundary pointer i and swap arr[i] with arr[j].`
        : `Correct! Because ${currentVal} > ${pivotVal}, it belongs in the right partition. Boundary pointer i stays unchanged and scanner j simply advances.`
    };

    const arrayDisplay = this.container.querySelector('#quizArrayDisplay');
    arrayDisplay.innerHTML = `
      <div class="quiz-bars-wrapper">
        ${arr.map((val, idx) => {
          let cls = 'quiz-bar-item';
          if (idx === size - 1) cls += ' quiz-pivot';
          else if (idx === j) cls += ' quiz-j';
          else if (idx === i) cls += ' quiz-i';

          return `
            <div class="${cls}">
              <div class="quiz-bar-badge">
                ${idx === size - 1 ? '👑 Pivot' : (idx === j ? 'j (scan)' : (idx === i ? 'i (boundary)' : ''))}
              </div>
              <div class="quiz-bar-val">${val}</div>
              <div class="quiz-bar-idx">[${idx}]</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    const promptEl = this.container.querySelector('#questionPrompt');
    promptEl.innerHTML = `Scanner <code>j</code> is on <strong>${currentVal}</strong>. The Pivot is <strong>${pivotVal}</strong>. What should happen?`;

    const optionsContainer = this.container.querySelector('#quizOptions');
    optionsContainer.innerHTML = `
      <button class="btn btn-outline btn-option" data-action="swap">
        <span class="opt-icon">🔄</span>
        <span class="opt-text"><strong>Advance i & Swap</strong> (${currentVal} ≤ ${pivotVal})</span>
      </button>
      <button class="btn btn-outline btn-option" data-action="skip">
        <span class="opt-icon">⏭️</span>
        <span class="opt-text"><strong>Skip / Do Not Swap</strong> (${currentVal} > ${pivotVal})</span>
      </button>
    `;

    optionsContainer.querySelectorAll('.btn-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        this.handlePredictAnswer(action);
      });
    });

    const banner = this.container.querySelector('#feedbackBanner');
    banner.style.display = 'none';
  }

  handlePredictAnswer(action) {
    const isCorrect = action === this.currentQuestion.correctAction;
    const banner = this.container.querySelector('#feedbackBanner');
    banner.style.display = 'block';

    if (isCorrect) {
      this.score += 10;
      this.streak += 1;
      sound.playCompareTone(60, 5, 100);
      banner.className = 'feedback-banner feedback-success';
      banner.innerHTML = `
        <div class="fb-header">🎉 <strong>Spot on!</strong> (+10 pts)</div>
        <p>${this.currentQuestion.explanation}</p>
        <button class="btn btn-sm btn-primary" id="btnNextQuiz">Next Question ➡️</button>
      `;
    } else {
      this.streak = 0;
      banner.className = 'feedback-banner feedback-error';
      banner.innerHTML = `
        <div class="fb-header">❌ <strong>Not quite!</strong></div>
        <p>Remember the rule: If <code>arr[j] ≤ Pivot</code>, it goes to the left (advance i and swap). Otherwise, leave it for the right sub-array.</p>
        <button class="btn btn-sm btn-primary" id="btnNextQuiz">Try Another ➡️</button>
      `;
    }

    this.updateScoreboard();
    banner.querySelector('#btnNextQuiz').addEventListener('click', () => {
      this.initPredictChallenge();
    });
  }

  // --- Challenge 2: Pivot Landing Spot ---
  initPivotLandChallenge() {
    const size = 7;
    const arr = [];
    while (arr.length < size) {
      const num = Math.floor(Math.random() * 85) + 10;
      if (!arr.includes(num)) arr.push(num);
    }
    const pivotVal = arr[size - 1];

    // Calculate correct final landing index
    const smallerCount = arr.slice(0, size - 1).filter(n => n <= pivotVal).length;
    const correctLandingIdx = smallerCount;

    this.currentQuestion = {
      arr,
      pivotVal,
      correctIdx: correctLandingIdx,
      smallerElements: arr.slice(0, size - 1).filter(n => n <= pivotVal)
    };

    const display = this.container.querySelector('#pivotArrayDisplay');
    display.innerHTML = `
      <div class="quiz-bars-wrapper">
        ${arr.map((val, idx) => {
          const isPivot = idx === size - 1;
          return `
            <div class="quiz-bar-item ${isPivot ? 'quiz-pivot' : ''}">
              <div class="quiz-bar-badge">${isPivot ? '👑 Pivot' : ''}</div>
              <div class="quiz-bar-val">${val}</div>
              <div class="quiz-bar-idx">[${idx}]</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    this.container.querySelector('#pivotQuestionPrompt').innerHTML = 
      `The Pivot is <strong>${pivotVal}</strong> (at index [${size - 1}]). After partitioning, which index will it settle at?`;

    const btnContainer = this.container.querySelector('#pivotIndexButtons');
    btnContainer.innerHTML = arr.map((_, idx) => `
      <button class="btn btn-outline pivot-idx-btn" data-idx="${idx}">
        Index [${idx}]
      </button>
    `).join('');

    btnContainer.querySelectorAll('.pivot-idx-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const chosenIdx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
        this.handlePivotLandAnswer(chosenIdx);
      });
    });

    const banner = this.container.querySelector('#pivotFeedbackBanner');
    banner.style.display = 'none';
  }

  handlePivotLandAnswer(chosenIdx) {
    const isCorrect = chosenIdx === this.currentQuestion.correctIdx;
    const banner = this.container.querySelector('#pivotFeedbackBanner');
    banner.style.display = 'block';

    if (isCorrect) {
      this.score += 15;
      this.streak += 1;
      sound.playCompareTone(80, 5, 100);
      banner.className = 'feedback-banner feedback-success';
      banner.innerHTML = `
        <div class="fb-header">🌟 <strong>Masterful Deduction!</strong> (+15 pts)</div>
        <p>
          There are exactly <strong>${this.currentQuestion.correctIdx}</strong> elements smaller than ${this.currentQuestion.pivotVal} (${this.currentQuestion.smallerElements.join(', ')}).
          Therefore, the pivot must land at index <strong>[${this.currentQuestion.correctIdx}]</strong>!
        </p>
        <button class="btn btn-sm btn-primary" id="btnNextPivotLand">Next Challenge ➡️</button>
      `;
    } else {
      this.streak = 0;
      banner.className = 'feedback-banner feedback-error';
      banner.innerHTML = `
        <div class="fb-header">❌ <strong>Close, but not quite!</strong></div>
        <p>
          The correct index was <strong>[${this.currentQuestion.correctIdx}]</strong>.
          Count the elements smaller than ${this.currentQuestion.pivotVal}: there are ${this.currentQuestion.correctIdx} of them!
        </p>
        <button class="btn btn-sm btn-primary" id="btnNextPivotLand">Try Another ➡️</button>
      `;
    }

    this.updateScoreboard();
    banner.querySelector('#btnNextPivotLand').addEventListener('click', () => {
      this.initPivotLandChallenge();
    });
  }

  // --- Challenge 3: Manual Bucket Partition ---
  initBucketChallenge() {
    const pivotVal = 40;
    const pool = [15, 68, 27, 85, 33, 52, 9, 74];
    
    let leftBucket = [];
    let rightBucket = [];
    let available = [...pool];

    const area = this.container.querySelector('#bucketGameArea');
    const renderBucketArea = () => {
      area.innerHTML = `
        <div class="pivot-callout-strip">
          <span class="icon">👑</span>
          <span>Benchmark Pivot: <strong>${pivotVal}</strong></span>
        </div>

        <div class="bucket-pool-section">
          <span class="pool-label">Click a number to classify it:</span>
          <div class="pool-items">
            ${available.map(val => `
              <button class="pool-item-btn" data-val="${val}">${val}</button>
            `).join('')}
            ${available.length === 0 ? `<span class="empty-pool-text">All items classified! Click 'Verify Partition' below.</span>` : ''}
          </div>
        </div>

        <div class="buckets-grid">
          <div class="bucket-col bucket-left" id="bucketLeftZone">
            <div class="bucket-title">
              <span class="b-badge">Left Bucket</span>
              <span>Elements ≤ ${pivotVal}</span>
            </div>
            <div class="bucket-dropzone">
              ${leftBucket.map(v => `<span class="b-item">${v}</span>`).join('')}
            </div>
          </div>

          <div class="bucket-col bucket-pivot-center">
            <div class="bucket-title">
              <span class="b-badge gold">Pivot</span>
            </div>
            <div class="bucket-center-card">
              <span class="b-val">${pivotVal}</span>
            </div>
          </div>

          <div class="bucket-col bucket-right" id="bucketRightZone">
            <div class="bucket-title">
              <span class="b-badge">Right Bucket</span>
              <span>Elements > ${pivotVal}</span>
            </div>
            <div class="bucket-dropzone">
              ${rightBucket.map(v => `<span class="b-item">${v}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="bucket-actions">
          <button class="btn btn-ghost" id="btnResetBucket">Reset</button>
          <button class="btn btn-primary" id="btnVerifyBucket" ${available.length > 0 ? 'disabled' : ''}>Verify Partition ✅</button>
        </div>
      `;

      // Handle item click
      area.querySelectorAll('.pool-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const val = parseInt(e.currentTarget.getAttribute('data-val'), 10);
          available = available.filter(v => v !== val);
          if (val <= pivotVal) {
            leftBucket.push(val);
          } else {
            rightBucket.push(val);
          }
          renderBucketArea();
        });
      });

      // Reset
      area.querySelector('#btnResetBucket').addEventListener('click', () => {
        leftBucket = [];
        rightBucket = [];
        available = [...pool];
        renderBucketArea();
      });

      // Verify
      const verifyBtn = area.querySelector('#btnVerifyBucket');
      if (verifyBtn) {
        verifyBtn.addEventListener('click', () => {
          const leftValid = leftBucket.every(v => v <= pivotVal);
          const rightValid = rightBucket.every(v => v > pivotVal);

          const banner = this.container.querySelector('#bucketFeedbackBanner');
          banner.style.display = 'block';

          if (leftValid && rightValid && leftBucket.length + rightBucket.length === pool.length) {
            this.score += 20;
            this.streak += 1;
            sound.playVictory();
            banner.className = 'feedback-banner feedback-success';
            banner.innerHTML = `
              <div class="fb-header">🎉 <strong>Perfect Partition!</strong> (+20 pts)</div>
              <p>You have successfully satisfied the QuickSort partition invariant! Left bucket has all elements ≤ ${pivotVal}, right bucket has all elements > ${pivotVal}.</p>
            `;
          } else {
            banner.className = 'feedback-banner feedback-error';
            banner.innerHTML = `
              <div class="fb-header">❌ <strong>Some elements were misclassified</strong></div>
              <p>Check again: Does the left bucket contain any number greater than ${pivotVal}?</p>
            `;
          }
          this.updateScoreboard();
        });
      }
    };

    renderBucketArea();
  }

  updateScoreboard() {
    const scoreEl = this.container.querySelector('#userScore');
    const streakEl = this.container.querySelector('#userStreak');
    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = this.streak;
  }
}
