/**
 * QuickSort Studio — Main Coordinator
 */

import './style.css';
import { QuickSortVisualizer } from './components/visualizer.js';
import { CodeViewer } from './components/codeViewer.js';
import { RecursionTreeVisualizer } from './components/recursionTree.js';
import { WalkthroughGuide } from './components/walkthrough.js';
import { PlaygroundChallenges } from './components/playground.js';
import { ComplexityLab } from './components/complexity.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Code Viewer
  const codeViewerEl = document.querySelector('#sidePaneCode');
  const codeViewer = new CodeViewer(codeViewerEl);

  // 2. Initialize Recursion Tree Visualizer
  const treeContainerEl = document.querySelector('#sidePaneTree');
  let visualizer = null;

  const recursionTree = new RecursionTreeVisualizer(treeContainerEl, (low, high) => {
    if (visualizer) {
      visualizer.setHighlightedSubarray(low, high);
    }
  });

  // 3. Initialize Visualizer
  const visualizerContainer = document.querySelector('#visualizerContainer');
  visualizer = new QuickSortVisualizer({
    container: visualizerContainer,
    codeViewer,
    recursionTree
  });

  // 4. Initialize Walkthrough Guide
  const walkthroughContainer = document.querySelector('#walkthroughContainer');
  new WalkthroughGuide(walkthroughContainer, () => {
    // Jump to Visualizer tab
    switchTab('visualizer');
  });

  // 5. Initialize Playground Challenges
  const playgroundContainer = document.querySelector('#playgroundContainer');
  new PlaygroundChallenges(playgroundContainer);

  // 6. Initialize Complexity Lab
  const complexityContainer = document.querySelector('#complexityContainer');
  new ComplexityLab(complexityContainer);

  // --- Main Tab Navigation ---
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(targetTabId) {
    navTabs.forEach(tab => {
      const isTarget = tab.getAttribute('data-tab') === targetTabId;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    tabPanes.forEach(pane => {
      pane.classList.remove('active');
    });

    const targetPane = document.querySelector(`#pane${targetTabId.charAt(0).toUpperCase() + targetTabId.slice(1)}`);
    if (targetPane) {
      targetPane.classList.add('active');
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // --- Side Column Tabs (Synced Code vs Recursion Tree) ---
  const sideTabs = document.querySelectorAll('.side-tab');
  const sidePanes = document.querySelectorAll('.side-pane');

  sideTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-side');
      sideTabs.forEach(t => t.classList.remove('active'));
      sidePanes.forEach(p => p.classList.remove('active'));

      e.currentTarget.classList.add('active');
      const pane = document.querySelector(`#sidePane${target.charAt(0).toUpperCase() + target.slice(1)}`);
      if (pane) pane.classList.add('active');
    });
  });

  // --- Shortcuts / Help Modal ---
  const helpBtn = document.querySelector('#btnHelpModal');
  const shortcutsDialog = document.querySelector('#shortcutsDialog');
  const closeShortcutsBtn = document.querySelector('#btnCloseShortcuts');

  if (helpBtn && shortcutsDialog) {
    helpBtn.addEventListener('click', () => shortcutsDialog.showModal());
  }

  if (closeShortcutsBtn && shortcutsDialog) {
    closeShortcutsBtn.addEventListener('click', () => shortcutsDialog.close());
    shortcutsDialog.addEventListener('click', (e) => {
      if (e.target === shortcutsDialog) shortcutsDialog.close();
    });
  }
});
