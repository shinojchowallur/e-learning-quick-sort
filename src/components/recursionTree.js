/**
 * Interactive Recursion Tree Visualizer
 * Renders the divide-and-conquer call stack tree with interactive node inspection.
 */

export class RecursionTreeVisualizer {
  constructor(containerEl, onNodeClick = null) {
    this.container = containerEl;
    this.onNodeClick = onNodeClick;
    this.currentNodes = [];
    this.activeNodeId = null;
  }

  update(nodes, activeNodeId) {
    this.currentNodes = nodes || [];
    this.activeNodeId = activeNodeId;
    this.render();
  }

  render() {
    if (!this.currentNodes || this.currentNodes.length === 0) {
      this.container.innerHTML = `
        <div class="tree-empty-state">
          <span>Run or step through the algorithm to populate the recursion tree.</span>
        </div>
      `;
      return;
    }

    // Build hierarchy for rendering
    const rootNodes = this.currentNodes.filter(n => !n.parentId);
    const nodeMap = new Map();
    this.currentNodes.forEach(n => nodeMap.set(n.id, { ...n, childrenObj: [] }));

    this.currentNodes.forEach(n => {
      if (n.parentId && nodeMap.has(n.parentId)) {
        nodeMap.get(n.parentId).childrenObj.push(nodeMap.get(n.id));
      }
    });

    const root = rootNodes.length > 0 ? nodeMap.get(rootNodes[0].id) : null;

    this.container.innerHTML = `
      <div class="recursion-tree-wrapper">
        <div class="tree-header">
          <div class="tree-title">
            <span class="icon">🌳</span>
            <span>Divide & Conquer Call Tree</span>
          </div>
          <div class="tree-legend">
            <span class="legend-item"><span class="badge active"></span> Active Call</span>
            <span class="legend-item"><span class="badge completed"></span> Sorted Sub-array</span>
            <span class="legend-item"><span class="badge pending"></span> Pending Call</span>
          </div>
        </div>
        <div class="tree-scroll-container">
          <div class="tree-svg-container" id="treeCanvas">
            ${root ? this.renderNodeHtml(root) : ''}
          </div>
        </div>
      </div>
    `;

    // Attach click events
    this.container.querySelectorAll('.tree-node').forEach(el => {
      el.addEventListener('click', (e) => {
        const low = parseInt(e.currentTarget.getAttribute('data-low'), 10);
        const high = parseInt(e.currentTarget.getAttribute('data-high'), 10);
        if (this.onNodeClick) {
          this.onNodeClick(low, high);
        }
      });
    });
  }

  renderNodeHtml(node) {
    const isActive = node.id === this.activeNodeId;
    const isCompleted = node.status === 'completed';
    const statusClass = isActive ? 'node-active' : (isCompleted ? 'node-completed' : 'node-pending');
    
    return `
      <div class="tree-branch">
        <div class="tree-node ${statusClass}" data-id="${node.id}" data-low="${node.low}" data-high="${node.high}">
          <div class="node-header">
            <span class="node-range">[${node.low}..${node.high}]</span>
            ${node.pivot !== null ? `<span class="node-pivot-badge">Pivot: ${node.pivot}</span>` : ''}
          </div>
          <div class="node-sub">${node.name}</div>
        </div>
        ${node.childrenObj && node.childrenObj.length > 0 ? `
          <div class="tree-children">
            ${node.childrenObj.map(child => this.renderNodeHtml(child)).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
}
