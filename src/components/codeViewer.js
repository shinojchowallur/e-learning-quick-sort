/**
 * Multi-Language Code Viewer with Real-Time Line Highlighting
 */

export class CodeViewer {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentLanguage = 'javascript';
    this.activeLine = null;

    this.codeSnippets = {
      javascript: [
        { num: 1, text: `function quickSort(arr, low, high) {` },
        { num: 2, text: `  if (low < high) {` },
        { num: 3, text: `    // Base case: 1 or 0 items are already sorted` },
        { num: 4, text: `    let pi = partition(arr, low, high);` },
        { num: 5, text: `    quickSort(arr, low, pi - 1);  // Sort left partition` },
        { num: 6, text: `    quickSort(arr, pi + 1, high); // Sort right partition` },
        { num: 7, text: `  }` },
        { num: 8, text: `}` },
        { num: 9, text: `` },
        { num: 10, text: `function partition(arr, low, high) {` },
        { num: 11, text: `  let pivot = arr[high]; // Choose pivot` },
        { num: 12, text: `  let i = low - 1;       // Smaller element index` },
        { num: 13, text: `  for (let j = low; j < high; j++) {` },
        { num: 14, text: `    if (arr[j] <= pivot) {` },
        { num: 15, text: `      i++;` },
        { num: 16, text: `      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap` },
        { num: 17, text: `    }` },
        { num: 18, text: `  }` },
        { num: 19, text: `  // Place pivot in correct sorted spot` },
        { num: 20, text: `  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];` },
        { num: 21, text: `  return i + 1; // Return pivot index` },
        { num: 22, text: `}` }
      ],
      python: [
        { num: 1, text: `def quick_sort(arr, low, high):` },
        { num: 2, text: `    if low < high:` },
        { num: 3, text: `        # Base case check` },
        { num: 4, text: `        pi = partition(arr, low, high)` },
        { num: 5, text: `        quick_sort(arr, low, pi - 1)  # Left sub-array` },
        { num: 6, text: `        quick_sort(arr, pi + 1, high) # Right sub-array` },
        { num: 7, text: `` },
        { num: 8, text: `def partition(arr, low, high):` },
        { num: 9, text: `    pivot = arr[high]  # Pivot element` },
        { num: 10, text: `    i = low - 1        # Boundary index` },
        { num: 11, text: `    for j in range(low, high):` },
        { num: 12, text: `        if arr[j] <= pivot:` },
        { num: 13, text: `            i += 1` },
        { num: 14, text: `            arr[i], arr[j] = arr[j], arr[i] # Swap` },
        { num: 15, text: `    # Place pivot in its correct sorted position` },
        { num: 16, text: `    arr[i + 1], arr[high] = arr[high], arr[i + 1]` },
        { num: 17, text: `    return i + 1` }
      ],
      cpp: [
        { num: 1, text: `void quickSort(int arr[], int low, int high) {` },
        { num: 2, text: `    if (low < high) {` },
        { num: 3, text: `        // Base case: single element sorted` },
        { num: 4, text: `        int pi = partition(arr, low, high);` },
        { num: 5, text: `        quickSort(arr, low, pi - 1);` },
        { num: 6, text: `        quickSort(arr, pi + 1, high);` },
        { num: 7, text: `    }` },
        { num: 8, text: `}` },
        { num: 9, text: `` },
        { num: 10, text: `int partition(int arr[], int low, int high) {` },
        { num: 11, text: `    int pivot = arr[high];` },
        { num: 12, text: `    int i = (low - 1);` },
        { num: 13, text: `    for (int j = low; j < high; j++) {` },
        { num: 14, text: `        if (arr[j] <= pivot) {` },
        { num: 15, text: `            i++;` },
        { num: 16, text: `            std::swap(arr[i], arr[j]);` },
        { num: 17, text: `        }` },
        { num: 18, text: `    }` },
        { num: 19, text: `    std::swap(arr[i + 1], arr[high]);` },
        { num: 20, text: `    return (i + 1);` },
        { num: 21, text: `}` }
      ],
      java: [
        { num: 1, text: `public static void quickSort(int[] arr, int low, int high) {` },
        { num: 2, text: `    if (low < high) {` },
        { num: 3, text: `        // Base case` },
        { num: 4, text: `        int pi = partition(arr, low, high);` },
        { num: 5, text: `        quickSort(arr, low, pi - 1);` },
        { num: 6, text: `        quickSort(arr, pi + 1, high);` },
        { num: 7, text: `    }` },
        { num: 8, text: `}` },
        { num: 9, text: `` },
        { num: 10, text: `private static int partition(int[] arr, int low, int high) {` },
        { num: 11, text: `    int pivot = arr[high];` },
        { num: 12, text: `    int i = (low - 1);` },
        { num: 13, text: `    for (int j = low; j < high; j++) {` },
        { num: 14, text: `        if (arr[j] <= pivot) {` },
        { num: 15, text: `            i++;` },
        { num: 16, text: `            swap(arr, i, j);` },
        { num: 17, text: `        }` },
        { num: 18, text: `    }` },
        { num: 19, text: `    swap(arr, i + 1, high);` },
        { num: 20, text: `    return (i + 1);` },
        { num: 21, text: `}` }
      ]
    };

    // Mapping of internal generic step lines to specific language lines
    this.lineMappings = {
      javascript: {
        1: 1, 2: 2, 3: 3, 7: 11, 8: 11, 9: 12, 10: 13, 11: 14, 12: 15, 13: 16, 15: 20, 16: 21, 23: 1
      },
      python: {
        1: 1, 2: 2, 3: 3, 7: 9, 8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14, 15: 16, 16: 17, 23: 1
      },
      cpp: {
        1: 1, 2: 2, 3: 3, 7: 11, 8: 11, 9: 12, 10: 13, 11: 14, 12: 15, 13: 16, 15: 19, 16: 20, 23: 1
      },
      java: {
        1: 1, 2: 2, 3: 3, 7: 11, 8: 11, 9: 12, 10: 13, 11: 14, 12: 15, 13: 16, 15: 19, 16: 20, 23: 1
      }
    };

    this.render();
  }

  setLanguage(lang) {
    if (this.codeSnippets[lang]) {
      this.currentLanguage = lang;
      this.render();
      if (this.activeLine) {
        this.highlightLine(this.activeLine);
      }
    }
  }

  highlightLine(genericLineNum) {
    this.activeLine = genericLineNum;
    const mapped = this.lineMappings[this.currentLanguage][genericLineNum] || null;

    const allLines = this.container.querySelectorAll('.code-line');
    allLines.forEach(el => el.classList.remove('active-code-line'));

    if (mapped) {
      const targetEl = this.container.querySelector(`.code-line[data-line="${mapped}"]`);
      if (targetEl) {
        targetEl.classList.add('active-code-line');
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  render() {
    const lines = this.codeSnippets[this.currentLanguage];
    
    this.container.innerHTML = `
      <div class="code-viewer-card glass-panel">
        <div class="code-viewer-header">
          <div class="code-window-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="code-title">Algorithm Implementation</span>
          </div>
          <div class="code-lang-selector" role="tablist">
            <button class="lang-tab ${this.currentLanguage === 'javascript' ? 'active' : ''}" data-lang="javascript">JavaScript</button>
            <button class="lang-tab ${this.currentLanguage === 'python' ? 'active' : ''}" data-lang="python">Python</button>
            <button class="lang-tab ${this.currentLanguage === 'cpp' ? 'active' : ''}" data-lang="cpp">C++</button>
            <button class="lang-tab ${this.currentLanguage === 'java' ? 'active' : ''}" data-lang="java">Java</button>
          </div>
        </div>
        <div class="code-viewer-body">
          <pre class="code-pre"><code>${lines.map(l => `
            <div class="code-line" data-line="${l.num}">
              <span class="line-number">${l.num}</span>
              <span class="line-content">${this.syntaxHighlight(l.text)}</span>
            </div>
          `).join('')}</code></pre>
        </div>
      </div>
    `;

    // Add event listeners for language tabs
    this.container.querySelectorAll('.lang-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.currentTarget.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });
  }

  syntaxHighlight(text) {
    if (!text) return '&nbsp;';
    
    // Simple fast syntax tokenizer for keywords, numbers, comments, functions
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Comments
    if (escaped.includes('//') || escaped.includes('#')) {
      const commentIdx = escaped.indexOf('//') !== -1 ? escaped.indexOf('//') : escaped.indexOf('#');
      const codePart = escaped.slice(0, commentIdx);
      const commentPart = escaped.slice(commentIdx);
      return this.highlightCodeTokens(codePart) + `<span class="syntax-comment">${commentPart}</span>`;
    }

    return this.highlightCodeTokens(escaped);
  }

  highlightCodeTokens(str) {
    return str
      .replace(/\b(function|def|void|int|public|static|let|return|if|for|in|range)\b/g, '<span class="syntax-keyword">$1</span>')
      .replace(/\b(quickSort|quick_sort|partition|swap)\b/g, '<span class="syntax-func">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>')
      .replace(/\b(pivot|low|high|arr|pi|i|j)\b/g, '<span class="syntax-var">$1</span>');
  }
}
