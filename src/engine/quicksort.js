/**
 * QuickSort Engine with Step Recording & Time-Travel Debugging
 * Supports Lomuto, First, and Median-of-3 partition schemes.
 */

export class QuickSortEngine {
  constructor() {
    this.steps = [];
    this.comparisons = 0;
    this.swaps = 0;
    this.maxDepth = 0;
    this.treeNodes = [];
    this.nodeCounter = 0;
  }

  generateSteps(initialArray, strategy = 'lomuto') {
    this.steps = [];
    this.comparisons = 0;
    this.swaps = 0;
    this.maxDepth = 0;
    this.treeNodes = [];
    this.nodeCounter = 0;

    const arr = [...initialArray];
    const sortedIndices = new Set();

    // Create root tree node
    const rootNodeId = `node_${this.nodeCounter++}`;
    const rootNode = {
      id: rootNodeId,
      parentId: null,
      low: 0,
      high: arr.length - 1,
      name: `quickSort(0, ${arr.length - 1})`,
      pivot: null,
      status: 'active',
      depth: 0,
      children: []
    };
    this.treeNodes.push(rootNode);

    // Initial step
    this.recordStep({
      type: 'START',
      array: [...arr],
      low: 0,
      high: arr.length - 1,
      pivotIdx: null,
      pivotVal: null,
      i: null,
      j: null,
      swapping: null,
      comparing: null,
      sortedIndices: new Set(sortedIndices),
      activeNodeId: rootNodeId,
      depth: 0,
      codeLine: 1,
      humanMessage: `Starting QuickSort on array of ${arr.length} elements. Strategy: ${this.formatStrategyName(strategy)}.`,
      formula: `Array length = ${arr.length}`
    });

    // Run QuickSort
    this.quickSortHelper(arr, 0, arr.length - 1, sortedIndices, rootNodeId, 0, strategy);

    // Final step: all elements confirmed sorted
    for (let k = 0; k < arr.length; k++) {
      sortedIndices.add(k);
    }
    
    // Mark root as completed
    rootNode.status = 'completed';

    this.recordStep({
      type: 'DONE',
      array: [...arr],
      low: null,
      high: null,
      pivotIdx: null,
      pivotVal: null,
      i: null,
      j: null,
      swapping: null,
      comparing: null,
      sortedIndices: new Set(sortedIndices),
      activeNodeId: null,
      depth: 0,
      codeLine: 23,
      humanMessage: `🎉 QuickSort complete! Entire array is sorted in ascending order with ${this.comparisons} comparisons and ${this.swaps} swaps.`,
      formula: `Sorted state reached`
    });

    return {
      steps: this.steps,
      stats: {
        comparisons: this.comparisons,
        swaps: this.swaps,
        maxDepth: this.maxDepth,
        stepCount: this.steps.length
      },
      tree: this.treeNodes
    };
  }

  formatStrategyName(strategy) {
    switch (strategy) {
      case 'first': return 'First Element as Pivot';
      case 'median3': return 'Median-of-Three';
      default: return 'Lomuto (Last Element as Pivot)';
    }
  }

  recordStep(data) {
    this.steps.push({
      ...data,
      stats: {
        comparisons: this.comparisons,
        swaps: this.swaps,
        maxDepth: this.maxDepth,
        currentDepth: data.depth || 0
      },
      treeSnapshot: JSON.parse(JSON.stringify(this.treeNodes))
    });
  }

  quickSortHelper(arr, low, high, sortedIndices, parentNodeId, depth, strategy) {
    this.maxDepth = Math.max(this.maxDepth, depth);

    if (low > high) {
      return;
    }

    if (low === high) {
      sortedIndices.add(low);
      const currNode = this.treeNodes.find(n => n.id === parentNodeId);
      if (currNode) currNode.status = 'completed';

      this.recordStep({
        type: 'BASE_CASE',
        array: [...arr],
        low,
        high,
        pivotIdx: low,
        pivotVal: arr[low],
        i: null,
        j: null,
        swapping: null,
        comparing: null,
        sortedIndices: new Set(sortedIndices),
        activeNodeId: parentNodeId,
        depth,
        codeLine: 3,
        humanMessage: `Base case reached: Sub-array [${low}..${high}] has only 1 element (${arr[low]}). A single element is already sorted!`,
        formula: `low == high (${low} == ${high})`
      });
      return;
    }

    this.recordStep({
      type: 'CALL',
      array: [...arr],
      low,
      high,
      pivotIdx: null,
      pivotVal: null,
      i: null,
      j: null,
      swapping: null,
      comparing: null,
      sortedIndices: new Set(sortedIndices),
      activeNodeId: parentNodeId,
      depth,
      codeLine: 2,
      humanMessage: `Examining sub-array [${low}..${high}] with ${high - low + 1} elements. Need to partition!`,
      formula: `quickSort(arr, low=${low}, high=${high})`
    });

    // Strategy Pivot Pre-selection
    if (strategy === 'first') {
      // Swap first element to high to use Lomuto partition
      const firstVal = arr[low];
      const highVal = arr[high];
      arr[low] = highVal;
      arr[high] = firstVal;
      this.swaps++;
      this.recordStep({
        type: 'PIVOT_PREPARE',
        array: [...arr],
        low,
        high,
        pivotIdx: high,
        pivotVal: arr[high],
        i: null,
        j: null,
        swapping: [low, high],
        comparing: null,
        sortedIndices: new Set(sortedIndices),
        activeNodeId: parentNodeId,
        depth,
        codeLine: 7,
        humanMessage: `Strategy: Selected first element (${arr[high]}) as Pivot and moved it to the end at index ${high}.`,
        formula: `swap(arr[${low}], arr[${high}])`
      });
    } else if (strategy === 'median3' && high - low >= 2) {
      const mid = Math.floor((low + high) / 2);
      const a = arr[low], b = arr[mid], c = arr[high];
      let medianIdx = high;
      if ((a <= b && b <= c) || (c <= b && b <= a)) medianIdx = mid;
      else if ((b <= a && a <= c) || (c <= a && a <= b)) medianIdx = low;

      if (medianIdx !== high) {
        const temp = arr[medianIdx];
        arr[medianIdx] = arr[high];
        arr[high] = temp;
        this.swaps++;
        this.recordStep({
          type: 'PIVOT_PREPARE',
          array: [...arr],
          low,
          high,
          pivotIdx: high,
          pivotVal: arr[high],
          i: null,
          j: null,
          swapping: [medianIdx, high],
          comparing: null,
          sortedIndices: new Set(sortedIndices),
          activeNodeId: parentNodeId,
          depth,
          codeLine: 7,
          humanMessage: `Median-of-Three: Compared [${a}, ${b}, ${c}]. Median is ${arr[high]}. Swapped to index ${high} to avoid worst-case partition.`,
          formula: `Median-of-3(${a}, ${b}, ${c}) = ${arr[high]}`
        });
      }
    }

    // Partition
    const pivotIndex = this.partition(arr, low, high, sortedIndices, parentNodeId, depth);

    // Update tree node with pivot
    const currNode = this.treeNodes.find(n => n.id === parentNodeId);
    if (currNode) {
      currNode.pivot = arr[pivotIndex];
    }

    // Left child recursive call
    if (low <= pivotIndex - 1) {
      const leftChildId = `node_${this.nodeCounter++}`;
      const leftNode = {
        id: leftChildId,
        parentId: parentNodeId,
        low,
        high: pivotIndex - 1,
        name: `Left: [${low}..${pivotIndex - 1}]`,
        pivot: null,
        status: 'pending',
        depth: depth + 1,
        children: []
      };
      if (currNode) currNode.children.push(leftChildId);
      this.treeNodes.push(leftNode);

      this.quickSortHelper(arr, low, pivotIndex - 1, sortedIndices, leftChildId, depth + 1, strategy);
      leftNode.status = 'completed';
    }

    // Right child recursive call
    if (pivotIndex + 1 <= high) {
      const rightChildId = `node_${this.nodeCounter++}`;
      const rightNode = {
        id: rightChildId,
        parentId: parentNodeId,
        low: pivotIndex + 1,
        high,
        name: `Right: [${pivotIndex + 1}..${high}]`,
        pivot: null,
        status: 'pending',
        depth: depth + 1,
        children: []
      };
      if (currNode) currNode.children.push(rightChildId);
      this.treeNodes.push(rightNode);

      this.quickSortHelper(arr, pivotIndex + 1, high, sortedIndices, rightChildId, depth + 1, strategy);
      rightNode.status = 'completed';
    }

    if (currNode) currNode.status = 'completed';
  }

  partition(arr, low, high, sortedIndices, parentNodeId, depth) {
    const pivotVal = arr[high];
    const pivotIdx = high;

    this.recordStep({
      type: 'CHOOSE_PIVOT',
      array: [...arr],
      low,
      high,
      pivotIdx,
      pivotVal,
      i: low - 1,
      j: low,
      swapping: null,
      comparing: null,
      sortedIndices: new Set(sortedIndices),
      activeNodeId: parentNodeId,
      depth,
      codeLine: 8,
      humanMessage: `🎯 Chosen Pivot is ${pivotVal} at index ${high}. Goal: place all elements ≤ ${pivotVal} to its left, and > ${pivotVal} to its right!`,
      formula: `pivot = arr[${high}] = ${pivotVal}`
    });

    let i = low - 1;

    this.recordStep({
      type: 'INIT_PARTITION',
      array: [...arr],
      low,
      high,
      pivotIdx,
      pivotVal,
      i,
      j: low,
      swapping: null,
      comparing: null,
      sortedIndices: new Set(sortedIndices),
      activeNodeId: parentNodeId,
      depth,
      codeLine: 9,
      humanMessage: `Initialized partition pointers: i = ${i} (boundary of elements ≤ pivot) and j = ${low} (current scanner).`,
      formula: `i = low - 1 (${i}), j = low (${low})`
    });

    for (let j = low; j < high; j++) {
      this.comparisons++;
      const isLessOrEqual = arr[j] <= pivotVal;

      this.recordStep({
        type: 'COMPARE',
        array: [...arr],
        low,
        high,
        pivotIdx,
        pivotVal,
        i,
        j,
        swapping: null,
        comparing: [j, high],
        sortedIndices: new Set(sortedIndices),
        activeNodeId: parentNodeId,
        depth,
        codeLine: 11,
        humanMessage: `Comparing arr[${j}] (${arr[j]}) with Pivot (${pivotVal}). Is ${arr[j]} ≤ ${pivotVal}? ${isLessOrEqual ? '✅ YES!' : '❌ NO, it is greater.'}`,
        formula: `${arr[j]} ${isLessOrEqual ? '≤' : '>'} ${pivotVal}`
      });

      if (isLessOrEqual) {
        i++;
        
        if (i !== j) {
          this.recordStep({
            type: 'ADVANCE_I',
            array: [...arr],
            low,
            high,
            pivotIdx,
            pivotVal,
            i,
            j,
            swapping: null,
            comparing: null,
            sortedIndices: new Set(sortedIndices),
            activeNodeId: parentNodeId,
            depth,
            codeLine: 12,
            humanMessage: `Since ${arr[j]} ≤ ${pivotVal}, advance boundary pointer i from ${i - 1} to ${i}. Now swap arr[${i}] and arr[${j}]!`,
            formula: `i++ -> i = ${i}`
          });

          // Swap arr[i] and arr[j]
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          this.swaps++;

          this.recordStep({
            type: 'SWAP',
            array: [...arr],
            low,
            high,
            pivotIdx,
            pivotVal,
            i,
            j,
            swapping: [i, j],
            comparing: null,
            sortedIndices: new Set(sortedIndices),
            activeNodeId: parentNodeId,
            depth,
            codeLine: 13,
            humanMessage: `🔄 Swapped arr[${i}] (${arr[i]}) with arr[${j}] (${arr[j]}). Now ${arr[i]} is safely in the '≤ pivot' region!`,
            formula: `swap(arr[${i}], arr[${j}])`
          });
        } else {
          this.recordStep({
            type: 'ADVANCE_I_NO_SWAP',
            array: [...arr],
            low,
            high,
            pivotIdx,
            pivotVal,
            i,
            j,
            swapping: null,
            comparing: null,
            sortedIndices: new Set(sortedIndices),
            activeNodeId: parentNodeId,
            depth,
            codeLine: 12,
            humanMessage: `Since ${arr[j]} ≤ ${pivotVal}, increment pointer i to ${i}. Since i == j (${i}), ${arr[i]} is already in place. No swap needed!`,
            formula: `i = ${i}, already in ≤ partition`
          });
        }
      } else {
        this.recordStep({
          type: 'SKIP_GREATER',
          array: [...arr],
          low,
          high,
          pivotIdx,
          pivotVal,
          i,
          j,
          swapping: null,
          comparing: null,
          sortedIndices: new Set(sortedIndices),
          activeNodeId: parentNodeId,
          depth,
          codeLine: 10,
          humanMessage: `${arr[j]} > ${pivotVal}, so it naturally stays in the '> pivot' zone. Advance scanner j to next element.`,
          formula: `${arr[j]} > ${pivotVal} (right zone)`
        });
      }
    }

    // Place pivot in its correct sorted position by swapping with arr[i + 1]
    const finalPivotIdx = i + 1;
    const oldPivotVal = arr[high];
    const displacedVal = arr[finalPivotIdx];

    this.recordStep({
      type: 'PREPARE_PIVOT_SWAP',
      array: [...arr],
      low,
      high,
      pivotIdx: high,
      pivotVal,
      i,
      j: high,
      swapping: [finalPivotIdx, high],
      comparing: null,
      sortedIndices: new Set(sortedIndices),
      activeNodeId: parentNodeId,
      depth,
      codeLine: 15,
      humanMessage: `🏁 Partition pass finished! All items ≤ ${pivotVal} are at indices 0..${i}. Now swap Pivot from index ${high} with arr[${finalPivotIdx}] (${displacedVal}).`,
      formula: `swap(arr[${finalPivotIdx}], arr[${high}])`
    });

    arr[high] = displacedVal;
    arr[finalPivotIdx] = oldPivotVal;
    this.swaps++;
    sortedIndices.add(finalPivotIdx);

    this.recordStep({
      type: 'PIVOT_LOCKED',
      array: [...arr],
      low,
      high,
      pivotIdx: finalPivotIdx,
      pivotVal,
      i: finalPivotIdx,
      j: null,
      swapping: null,
      comparing: null,
      sortedIndices: new Set(sortedIndices),
      activeNodeId: parentNodeId,
      depth,
      codeLine: 16,
      humanMessage: `✨ Pivot ${pivotVal} is now LOCKED at index ${finalPivotIdx}! Everything to its left is ≤ ${pivotVal}, and everything to its right is > ${pivotVal}. It will never move again!`,
      formula: `arr[${finalPivotIdx}] = ${pivotVal} (Final Sorted Position)`
    });

    return finalPivotIdx;
  }
}
