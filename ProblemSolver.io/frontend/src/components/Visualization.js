import React, { useState, useEffect } from 'react';
import './Visualization.css';

const Visualization = ({ type }) => {
  const [array, setArray] = useState([3, 7, 1, 9, 4]);
  const [stack, setStack] = useState([10, 20, 30]);
  const [queue, setQueue] = useState([10, 20, 30]);
  const [linkedList, setLinkedList] = useState([1, 2, 3, 4]);
  const [treeData, setTreeData] = useState(null);

  // Animation States
  const [message, setMessage] = useState('Ready for interaction!');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMessage('Ready for interaction!');
    setHighlightIndex(-1);

    if (type === 'tree') {
      setTreeData({
        value: 10,
        left: {
          value: 5,
          left: { value: 3, left: null, right: null },
          right: { value: 7, left: null, right: null }
        },
        right: {
          value: 15,
          left: { value: 12, left: null, right: null },
          right: { value: 18, left: null, right: null }
        }
      });
    }
  }, [type]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleArrayOperation = async (operation) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const newArray = [...array];

    if (operation === 'push') {
      if (newArray.length >= 8) {
        setMessage('Array is full! Cannot add more elements.');
        setIsAnimating(false);
        return;
      }
      const val = Math.floor(Math.random() * 100);
      setMessage(`Step 1: finding the first empty index at position ${newArray.length}...`);
      await sleep(1000);

      setMessage(`Step 2: Inserting value ${val} at index ${newArray.length}...`);
      setHighlightIndex(newArray.length); // Highlight the empty spot (conceptually)
      await sleep(1000);

      newArray.push(val);
      setArray(newArray);
      setHighlightIndex(newArray.length - 1);
      setMessage('Step 3: Element inserted successfully! Size increased.');
      await sleep(1000);

    } else if (operation === 'pop') {
      if (newArray.length === 0) {
        setMessage('Array is empty! Nothing to pop.');
        setIsAnimating(false);
        return;
      }
      setMessage(`Step 1: Identifying the last element at index ${newArray.length - 1}...`);
      setHighlightIndex(newArray.length - 1);
      await sleep(1000);

      setMessage('Step 2: Removing the element...');
      await sleep(500);
      newArray.pop();
      setArray(newArray);
      setHighlightIndex(-1);
      setMessage('Step 3: Element removed. Size decreased.');
      await sleep(1000);

    } else if (operation === 'reverse') {
      setMessage('Step 1: Swapping elements from both ends...');
      await sleep(1000);
      newArray.reverse();
      setArray(newArray);
      setMessage('Step 2: Array reversed!');
    }

    setHighlightIndex(-1);
    setIsAnimating(false);
  };

  const handleStackOperation = async (operation) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newStack = [...stack];

    if (operation === 'push') {
      const val = Math.floor(Math.random() * 100);
      setMessage(`Step 1: Creating new element ${val}...`);
      await sleep(800);

      setMessage('Step 2: Placing it on TOP of the stack...');
      newStack.push(val);
      setStack(newStack);
      setHighlightIndex(newStack.length - 1); // Highlight top
      await sleep(1000);

      setMessage('Done! New element is now at the Top.');

    } else if (operation === 'pop') {
      if (newStack.length === 0) {
        setMessage('Stack is empty (Underflow)!');
        setIsAnimating(false);
        return;
      }
      setMessage('Step 1: Identifying the Top element...');
      setHighlightIndex(newStack.length - 1);
      await sleep(1000);

      setMessage('Step 2: Removing Top element...');
      newStack.pop();
      setStack(newStack);
      await sleep(500);

      setMessage('Done! The element below is now the new Top.');
    }

    await sleep(1000);
    setHighlightIndex(-1);
    setIsAnimating(false);
  };

  const handleQueueOperation = async (operation) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newQueue = [...queue];

    if (operation === 'enqueue') {
      const val = Math.floor(Math.random() * 100);
      setMessage(`Step 1: Creating new element ${val}...`);
      await sleep(800);

      setMessage('Step 2: Joining at the REAR (Back) of the line...');
      newQueue.push(val);
      setQueue(newQueue);
      setHighlightIndex(newQueue.length - 1); // Highlight rear
      await sleep(1000);
      setMessage('Done! Element added to the Rear.');

    } else if (operation === 'dequeue') {
      if (newQueue.length === 0) {
        setMessage('Queue is empty (Underflow)!');
        setIsAnimating(false);
        return;
      }
      setMessage('Step 1: Identifying the FRONT element...');
      setHighlightIndex(0); // Front is always index 0
      await sleep(1000);

      setMessage('Step 2: Serving/Removing the Front element...');
      newQueue.shift();
      setQueue(newQueue);
      await sleep(500);

      setMessage('Done! The next person is now at the Front.');
    }

    await sleep(1000);
    setHighlightIndex(-1);
    setIsAnimating(false);
  };

  const handleLinkedListOperation = (operation) => {
    // Keep sync for now or upgrade later if time permits
    const newList = [...linkedList];
    if (operation === 'insert') {
      newList.push(Math.floor(Math.random() * 100));
    } else if (operation === 'delete' && newList.length > 0) {
      newList.pop();
    }
    setLinkedList(newList);
  };

  const renderTree = (node, x, y, level = 0) => {
    if (!node) return null;
    const spacing = 150 / (level + 1);
    return (
      <g key={`${x}-${y}`}>
        <circle cx={x} cy={y} r="20" fill="#6366f1" stroke="#fff" strokeWidth="2" />
        <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
          {node.value}
        </text>
        {node.left && (
          <>
            <line x1={x} y1={y + 20} x2={x - spacing} y2={y + 60} stroke="#6366f1" strokeWidth="2" />
            {renderTree(node.left, x - spacing, y + 60, level + 1)}
          </>
        )}
        {node.right && (
          <>
            <line x1={x} y1={y + 20} x2={x + spacing} y2={y + 60} stroke="#6366f1" strokeWidth="2" />
            {renderTree(node.right, x + spacing, y + 60, level + 1)}
          </>
        )}
      </g>
    );
  };

  if (type === 'array') {
    return (
      <div className="visualization-container">
        <div className="visualization-title">Array Visualization</div>
        <div className="status-box">{message}</div>
        <div className="array-visualization">
          {array.map((item, index) => (
            <div key={index} className={`array-element ${index === highlightIndex ? 'highlighted' : ''}`}>
              <div className="element-value">{item}</div>
              <div className="element-index">{index}</div>
            </div>
          ))}
        </div>
        <div className="visualization-controls">
          <button className="btn btn-primary" onClick={() => handleArrayOperation('push')} disabled={isAnimating}>
            Add Element
          </button>
          <button className="btn btn-primary" onClick={() => handleArrayOperation('pop')} disabled={isAnimating}>
            Remove Element
          </button>
          <button className="btn btn-secondary" onClick={() => handleArrayOperation('reverse')} disabled={isAnimating}>
            Reverse
          </button>
        </div>
      </div>
    );
  }

  if (type === 'stack') {
    return (
      <div className="visualization-container">
        <div className="visualization-title">Stack Visualization (LIFO)</div>
        <div className="status-box">{message}</div>
        <div className="stack-visualization">
          <div className="stack-base">Base</div>
          {stack.map((item, index) => (
            <div
              key={index}
              className={`stack-element ${index === highlightIndex ? 'highlighted' : ''}`}
            >
              {item}
            </div>
          ))}
          {stack.length > 0 && (
            <div className="stack-top-label">Top →</div>
          )}
        </div>
        <div className="visualization-controls">
          <button className="btn btn-primary" onClick={() => handleStackOperation('push')} disabled={isAnimating}>
            Push
          </button>
          <button className="btn btn-primary" onClick={() => handleStackOperation('pop')} disabled={isAnimating}>
            Pop
          </button>
        </div>
      </div>
    );
  }

  if (type === 'queue') {
    return (
      <div className="visualization-container">
        <div className="visualization-title">Queue Visualization (FIFO)</div>
        <div className="status-box">{message}</div>
        <div className="queue-visualization">
          <div className="queue-front">Front →</div>
          {queue.map((item, index) => (
            <div key={index} className={`queue-element ${index === highlightIndex ? 'highlighted' : ''}`}>
              {item}
            </div>
          ))}
          <div className="queue-rear">← Rear</div>
        </div>
        <div className="visualization-controls">
          <button className="btn btn-primary" onClick={() => handleQueueOperation('enqueue')} disabled={isAnimating}>
            Enqueue
          </button>
          <button className="btn btn-primary" onClick={() => handleQueueOperation('dequeue')} disabled={isAnimating}>
            Dequeue
          </button>
        </div>
      </div>
    );
  }

  if (type === 'linkedlist') {
    return (
      <div className="visualization-container">
        <div className="visualization-title">Linked List Visualization</div>
        <div className="status-box">Simple insertion/deletion (More animations coming soon!)</div>
        <div className="linkedlist-visualization">
          {linkedList.map((item, index) => (
            <React.Fragment key={index}>
              <div className="linkedlist-node">
                <div className="node-value">{item}</div>
                <div className="node-pointer">→</div>
              </div>
            </React.Fragment>
          ))}
          <div className="linkedlist-node null">
            <div className="node-value">NULL</div>
          </div>
        </div>
        <div className="visualization-controls">
          <button className="btn btn-primary" onClick={() => handleLinkedListOperation('insert')}>
            Insert
          </button>
          <button className="btn btn-primary" onClick={() => handleLinkedListOperation('delete')}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  if (type === 'tree') {
    return (
      <div className="visualization-container">
        <div className="visualization-title">Binary Tree Visualization</div>
        <div className="tree-visualization">
          <svg width="600" height="400" style={{ overflow: 'visible' }}>
            {treeData && renderTree(treeData, 300, 50)}
          </svg>
        </div>
        <div className="tree-info">
          <p><strong>Traversals:</strong></p>
          <p>Inorder: 3, 5, 7, 10, 12, 15, 18</p>
          <p>Preorder: 10, 5, 3, 7, 15, 12, 18</p>
          <p>Postorder: 3, 7, 5, 12, 18, 15, 10</p>
        </div>
      </div>
    );
  }

  return <div>Visualization type not supported</div>;
};

export default Visualization;

