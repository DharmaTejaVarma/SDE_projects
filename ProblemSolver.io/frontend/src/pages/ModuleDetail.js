import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Visualization from '../components/Visualization';
import './ModuleDetail.css';

const ModuleDetail = () => {
  const { topic } = useParams();
  const [activeSection, setActiveSection] = useState('theory');

  const moduleData = {
    arrays: {
      title: 'Arrays',
      theory: (
        <div className="theory-content">
          <h3>Definition</h3>
          <p>
            An <strong>Array</strong> is a linear data structure that collects elements of the same data type and stores them in contiguous and adjacent memory locations. Arrays work on an index system starting from 0 to (n-1), where <em>n</em> is the size of the array.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Contiguous Memory Allocation:</strong> Elements are stored in sequential memory blocks, which optimizes cache locality and access speed.</li>
            <li><strong>Random Access:</strong> Any element can be accessed instantaneously (O(1)) using its index address.</li>
            <li><strong>Fixed Size:</strong> In many low-level languages (C/C++), the size must be defined at compile time. JavaScript arrays are dynamic but operate similarly under the hood.</li>
            <li><strong>Homogeneity:</strong> Typically stores elements of the same data type (though JS is flexible).</li>
          </ul>

          <div className="code-block">
            <h4>Implementation in JavaScript</h4>
            <pre>{`// 1. Initialization
const numbers = [10, 20, 30, 40, 50]; 

// 2. Accessing Elements - Time Complexity: O(1)
// Formula: Address = Base_Address + (Index * Element_Size)
console.log(numbers[2]); // Output: 30

// 3. Traversal - Time Complexity: O(n)
numbers.forEach((num, index) => {
    console.log(\`Index \${index}: \${num}\`);
});

// 4. Modifying Elements - Time Complexity: O(1)
numbers[1] = 99; 
console.log(numbers); // [10, 99, 30, 40, 50]`}</pre>
          </div>

          <h3>Applications</h3>
          <ul>
            <li><strong>Matrix Operations:</strong> Used heavily in mathematical computations, image processing (2D arrays), and computer graphics.</li>
            <li><strong>Lookup Tables:</strong> For O(1) retrieval of pre-computed data to optimize algorithms.</li>
            <li><strong>Underlying Structure:</strong> Arrays form the basis for implementing other data structures like Stacks, Queues, Heaps, and Hash Tables.</li>
          </ul>
        </div>
      ),
      operations: [
        { name: 'Access', complexity: 'Θ(1)', color: 'success', description: 'Direct memory addressing via index calculation.' },
        { name: 'Search', complexity: 'Θ(n)', color: 'warning', description: 'Linear search requires iterating elements. Binary Search is O(log n) if sorted.' },
        { name: 'Insertion', complexity: 'Θ(n)', color: 'warning', description: 'Requires shifting subsequent elements to different indices to maintain order.' },
        { name: 'Deletion', complexity: 'Θ(n)', color: 'warning', description: 'Requires shifting elements to fill the gap created by removal.' }
      ],
      examples: [
        {
          title: 'CPU Scheduling',
          scenario: 'Operating Systems use arrays to maintain priority queues for process scheduling.',
          steps: ['Process IDs stored in fixed-size array.', 'Scheduler iterates to find next process to execute.']
        },
        {
          title: 'Digital Signal Processing',
          scenario: 'Audio signals are stored as arrays of sample values for processing.',
          steps: ['Sampled audio data stored in buffer.', 'Apply FFT algorithm on array.', 'Output frequency spectrum.']
        }
      ],
      visualization: 'array'
    },
    stacks: {
      title: 'Stacks',
      theory: (
        <div className="theory-content">
          <h3>Definition</h3>
          <p>
            A <strong>Stack</strong> is a linear data structure that follows the <strong>LIFO</strong> (Last In, First Out) principle. The element inserted last is the first one to be removed. It behaves like a container with only one entry point, often referred to as the 'Top'.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>LIFO Order:</strong> Operations are strictly defined: additions (Push) and removals (Pop) occur at the same end.</li>
            <li><strong>Recursive Nature:</strong> Stacks are fundamental to recursion maintenance in memory (Call Stack).</li>
            <li><strong>Restricted Access:</strong> Random access is not allowed; only the top element is directly accessible.</li>
          </ul>

          <div className="code-block">
            <h4>Implementation: Stack Class in JavaScript</h4>
            <pre>{`class Stack {
    constructor() {
        this.items = [];
    }

    // 1. Push: Add element to top
    push(element) {
        this.items.push(element);
    }

    // 2. Pop: Remove top element
    pop() {
        if (this.isEmpty()) return "Underflow";
        return this.items.pop();
    }

    // 3. Peek: View top element
    peek() {
        if (this.isEmpty()) return "Empty Stack";
        return this.items[this.items.length - 1];
    }

    // Helper functions
    isEmpty() { return this.items.length === 0; }
    printStack() { return this.items.join(" "); }
}

const stack = new Stack();
stack.push(10);
stack.push(20);
console.log(stack.peek()); // 20
stack.pop();
console.log(stack.peek()); // 10`}</pre>
          </div>

          <h3>Applications</h3>
          <ul>
            <li><strong>Memory Management:</strong> Managing function calls and local variables (Call Stack).</li>
            <li><strong>Expression Evaluation:</strong> Converting/Evaluating Infix, Prefix, and Postfix expressions.</li>
            <li><strong>Backtracking Algorithms:</strong> Used in maze solving, N-Queens problem, and DFS of Graphs.</li>
            <li><strong>Undo Mechanisms:</strong> Storing state history in text editors or browsers.</li>
          </ul>
        </div>
      ),
      operations: [
        { name: 'Push', complexity: 'Θ(1)', color: 'success', description: 'Adding an element to the top doesn\'t require shifting.' },
        { name: 'Pop', complexity: 'Θ(1)', color: 'success', description: 'Removing the top element is an instant operation.' },
        { name: 'Peek', complexity: 'Θ(1)', color: 'success', description: 'Reading the last inserted item.' },
        { name: 'Search', complexity: 'Θ(n)', color: 'warning', description: 'Finding an item requires unwinding the stack (worst case).' },
      ],
      examples: [
        {
          title: 'Syntax Parsing',
          scenario: 'Compilers use stacks to check for balanced parentheses in code.',
          steps: ['Push "(".', 'Push "{".', 'Encounter "}". Pop "{".', 'Stack is balanced?']
        },
        {
          title: 'Browser History',
          scenario: 'The "Back" button works like a stack.',
          steps: ['Visit Page A.', 'Visit Page B. (Push B)', 'Click Back -> Pop B, return to A.']
        }
      ],
      visualization: 'stack'
    },
    queues: {
      title: 'Queues',
      theory: (
        <div className="theory-content">
          <h3>Definition</h3>
          <p>
            A <strong>Queue</strong> is a linear data structure that follows the <strong>FIFO</strong> (First In, First Out) principle.
            The first element added to the queue will be the first one to be removed. It is analogous to a line of people waiting for a bus.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>FIFO Order:</strong> Operations are performed at two different ends: Insertion at 'Rear' and Deletion at 'Front'.</li>
            <li><strong>Sequential Processing:</strong> Essential for systems that need to handle requests in the exact order they arrive.</li>
            <li><strong>Dynamic variants:</strong> Can be implemented as a Circular Queue or Priority Queue for specific efficiencies.</li>
          </ul>

          <div className="code-block">
            <h4>Implementation: Queue Class in JavaScript</h4>
            <pre>{`class Queue {
    constructor() {
        this.items = {};
        this.frontIndex = 0;
        this.backIndex = 0;
    }

    // 1. Enqueue: Add to rear
    enqueue(item) {
        this.items[this.backIndex] = item;
        this.backIndex++;
    }

    // 2. Dequeue: Remove from front
    dequeue() {
        const item = this.items[this.frontIndex];
        delete this.items[this.frontIndex];
        this.frontIndex++;
        return item;
    }

    // 3. Peek: View front
    peek() {
        return this.items[this.frontIndex];
    }
}

const queue = new Queue();
queue.enqueue('Task A');
queue.enqueue('Task B');
console.log(queue.dequeue()); // 'Task A'`}</pre>
          </div>

          <h3>Applications</h3>
          <ul>
            <li><strong>Operating Systems:</strong> Job scheduling (CPU scheduling), Disk Scheduling, and I/O Buffers.</li>
            <li><strong>Networking:</strong> Handling data packets in routers and switches.</li>
            <li><strong>Asynchronous Data Transfer:</strong> Used in IO Buffers, pipes, and file IO.</li>
            <li><strong>Breadth-First Search (BFS):</strong> Used in Graph traversal algorithms.</li>
          </ul>
        </div>
      ),
      operations: [
        { name: 'Enqueue', complexity: 'Θ(1)', color: 'success', description: 'Adding to the tail index is instant.' },
        { name: 'Dequeue', complexity: 'Θ(1)', color: 'success', description: 'Removing from the head (with pointer update) is instant.' },
        { name: 'Access', complexity: 'Θ(n)', color: 'warning', description: 'Random access is not supported.' },
        { name: 'Search', complexity: 'Θ(n)', color: 'warning', description: 'Have to check items one by one.' }
      ],
      examples: [
        {
          title: 'Printer Spooling',
          scenario: 'Multiple documents sent to a single printer.',
          steps: ['Doc A arrives.', 'Doc B arrives.', 'Doc A prints first, then Doc B (FIFO).']
        },
        {
          title: 'Web Server Requests',
          scenario: 'Handling thousands of user requests.',
          steps: ['Request 1 enters queue.', 'Request 2 enters queue.', 'Load Balancer directs them to workers in order.']
        }
      ],
      visualization: 'queue'
    },
    linkedLists: {
      title: 'Linked Lists',
      theory: (
        <div className="theory-content">
          <h3>Definition</h3>
          <p>
            A <strong>Linked List</strong> is a linear data structure where elements are not stored at contiguous memory locations. Instead, elements (called Nodes) are linked using pointers. Each node consists of two parts: the <strong>Data</strong> and a <strong>Reference</strong> (or address) to the next node.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Dynamic Path:</strong> Unlike arrays, elements can be scattered in memory, connected only by references.</li>
            <li><strong>Dynamic Size:</strong> Nodes can be allocated and deallocated at runtime without reallocation of the entire structure.</li>
            <li><strong>Sequential Access:</strong> Random access is not allowed; one must traverse from the Head to reach the target node (O(n)).</li>
          </ul>

          <div className="code-block">
            <h4>Implementation: Singly Linked List</h4>
            <pre>{`class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    // Insert at Head - O(1)
    prepend(data) {
        const newNode = new Node(data);
        newNode.next = this.head;
        this.head = newNode;
    }

    // Traverse and Print - O(n)
    printList() {
        let current = this.head;
        let result = "";
        while (current) {
            result += current.data + " -> ";
            current = current.next;
        }
        console.log(result + "null");
    }
}

const list = new LinkedList();
list.prepend(20);
list.prepend(10);
list.printList(); // 10 -> 20 -> null`}</pre>
          </div>

          <h3>Applications</h3>
          <ul>
            <li><strong>Implementation of Stacks/Queues:</strong> More flexible than array-based implementation.</li>
            <li><strong>Image Viewer:</strong> Doubly Linked Lists allow "Next" and "Previous" image navigation.</li>
            <li><strong>Memory Allocation:</strong> OS uses linked lists to track free memory blocks.</li>
            <li><strong>Browser Cache:</strong> LRU (Least Recently Used) cache is typically implemented using a Doubly Linked List + Hash Map.</li>
          </ul>
        </div>
      ),
      operations: [
        { name: 'Insertion (Head)', complexity: 'Θ(1)', color: 'success', description: 'Just changing the head pointer.' },
        { name: 'Insertion (Tail)', complexity: 'Θ(n)', color: 'warning', description: 'Must traverse to the end (unless a tail pointer is kept).' },
        { name: 'Deletion', complexity: 'Θ(1)', color: 'success', description: 'Removing a node is fast if reference to previous node is known.' },
        { name: 'Access/Search', complexity: 'Θ(n)', color: 'warning', description: 'Must traverse nodes sequentially.' },
      ],
      examples: [
        {
          title: 'Music Player Playlist',
          scenario: 'Songs are nodes. Next/Prev buttons traverse the list.',
          steps: ['Song A -> Song B -> Song C', 'Delete Song B?', 'Song A point directly to Song C.']
        },
        {
          title: 'Blockchain',
          scenario: 'A chain of blocks where each block contains a hash of the previous block.',
          steps: ['Genesis Block -> Block 1 -> Block 2', 'Immutable chain structure.']
        }
      ],
      visualization: 'linkedlist'
    },
    trees: {
      title: 'Trees',
      theory: (
        <div className="theory-content">
          <h3>Definition</h3>
          <p>
            A <strong>Tree</strong> is a non-linear hierarchical data structure consisting of nodes connected by edges. It simulates a hierarchical tree structure, with a root value and subtrees of children with a parent node. A tree with N nodes has exactly N-1 edges.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>Hierarchical:</strong> Unlike arrays/lists (linear), trees represent levels of data (Root -> Parent -> Child).</li>
            <li><strong>Acyclic:</strong> There are no loops or cycles. If a cycle exists, it's a Graph, not a Tree.</li>
            <li><strong>Root Node:</strong> The single top-most node from which all other nodes descend.</li>
          </ul>

          <div className="code-block">
            <h4>Implementation: Binary Search Tree (BST)</h4>
            <pre>{`class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() { this.root = null; }

    insert(value) {
        const newNode = new TreeNode(value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        this.insertNode(this.root, newNode);
    }

    insertNode(node, newNode) {
        if (newNode.value < node.value) {
            !node.left ? node.left = newNode : this.insertNode(node.left, newNode);
        } else {
            !node.right ? node.right = newNode : this.insertNode(node.right, newNode);
        }
    }
}`}</pre>
          </div>

          <h3>Applications</h3>
          <ul>
            <li><strong>File Systems:</strong> Folders and sub-folders are a classic Tree structure.</li>
            <li><strong>DOM (Document Object Model):</strong> HTML tags are nested as a tree of objects.</li>
            <li><strong>Database Indexing:</strong> B-Trees and B+ Trees are used to index huge databases for fast search.</li>
            <li><strong>Compilers:</strong> Abstract Syntax Trees (AST) represent the structure of program code.</li>
          </ul>
        </div>
      ),
      operations: [
        { name: 'Search (BST)', complexity: 'Θ(log n)', color: 'success', description: 'Halves the search space at every step (if balanced).' },
        { name: 'Insert (BST)', complexity: 'Θ(log n)', color: 'success', description: 'Finding the correct leaf to attach to takes logarithmic time.' },
        { name: 'Traversal', complexity: 'Θ(n)', color: 'warning', description: 'DFS (Pre/In/Post-order) visits every node once.' }
      ],
      examples: [
        {
          title: 'HTML DOM',
          scenario: 'Browser renders pages by traversing the DOM Tree.',
          steps: ['<html> is root.', '<body> and <head> are children.', 'Browser paints elements recursively.']
        },
        {
          title: 'Tries (Prefix Trees)',
          scenario: 'Autocomplete systems.',
          steps: ['User types "Ca".', 'Traverse root -> C -> a.', 'Suggest "Cat", "Car", "Cake".']
        }
      ],
      visualization: 'tree'
    },
    graphs: {
      title: 'Graphs',
      theory: (
        <div className="theory-content">
          <h3>Definition</h3>
          <p>
            A <strong>Graph</strong> is a non-linear data structure consisting of <strong>Vertices</strong> (Nodes) and <strong>Edges</strong> (lines connecting nodes). Graphs are used to represent networks like social media connections, street maps, and circuits.
            Unlike trees, graphs can contain cycles and don't necessarily have a root.
          </p>

          <h3>Types of Graphs</h3>
          <ul>
            <li><strong>Directed vs Undirected:</strong> One-way streets (Instagram Follow) vs Two-way streets (Facebook Friend).</li>
            <li><strong>Weighted vs Unweighted:</strong> Edges have cost/distance (Google Maps) or are equal (Peer-to-peer network).</li>
            <li><strong>Cyclic vs Acyclic:</strong> Whether you can start at a node and return to it by following edges.</li>
          </ul>

          <div className="code-block">
            <h4>Implementation: Adjacency List</h4>
            <pre>{`// Graph using Adjacency List
const graph = new Map();

function addVertex(v) {
    graph.set(v, []);
}

function addEdge(v, w) {
    graph.get(v).push(w);
    graph.get(w).push(v); // Undirected
}

addVertex('A');
addVertex('B');
addEdge('A', 'B');

console.log(graph); // 'A' -> ['B'], 'B' -> ['A']`}</pre>
          </div>

          <h3>Applications</h3>
          <ul>
            <li><strong>Social Networks:</strong> Suggesting friends (friends of friends).</li>
            <li><strong>Google Maps:</strong> Finding shortest path (Dijkstra/A* algorithm) between two locations.</li>
            <li><strong>Network Routing:</strong> RIP/OSPF protocols to find best path for packets.</li>
            <li><strong>Recommendation Engines:</strong> "Users who bought X also bought Y" (Bipartite graphs).</li>
          </ul>
        </div>
      ),
      operations: [
        { name: 'BFS', complexity: 'Θ(V+E)', color: 'warning', description: 'Level-order traversal. Optimal for unweighted shortest paths.' },
        { name: 'DFS', complexity: 'Θ(V+E)', color: 'warning', description: 'Depth-first traversal. Good for detecting cycles and puzzles.' },
        { name: 'Space', complexity: 'Θ(V+E)', color: 'success', description: 'Adjacency lists are efficient for sparse graphs.' }
      ],
      examples: [
        {
          title: 'Uber/Google Maps',
          scenario: 'Calculating ETA and shortest route.',
          steps: ['Intersections = Vertices.', 'Roads = Weighted Edges.', 'Run Dijkstra\'s Algorithm.']
        },
        {
          title: 'World Wide Web',
          scenario: 'The Internet is a massive directed graph.',
          steps: ['Pages = Nodes.', 'Links = Edges.', 'Crawlers traverse this graph to index the web.']
        }
      ],
      visualization: 'graph'
    }
  };

  const data = moduleData[topic] || moduleData.arrays;

  return (
    <div className="module-detail-page">
      <div className="container">
        <div className="module-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>{data.title}</h1>
          <Link to={`/problems?category=${topic}`} className="btn-primary" style={{ textDecoration: 'none' }}>
            Practice {data.title} Problems 🚀
          </Link>
        </div>

        <div className="module-tabs">
          <button
            className={`module-tab ${activeSection === 'theory' ? 'active' : ''}`}
            onClick={() => setActiveSection('theory')}
          >
            Theory
          </button>
          <button
            className={`module-tab ${activeSection === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveSection('operations')}
          >
            Operations
          </button>
          <button
            className={`module-tab ${activeSection === 'examples' ? 'active' : ''}`}
            onClick={() => setActiveSection('examples')}
          >
            Examples
          </button>
          <button
            className={`module-tab ${activeSection === 'visualization' ? 'active' : ''}`}
            onClick={() => setActiveSection('visualization')}
          >
            Visualization
          </button>
        </div>

        <div className="module-content card">
          {activeSection === 'theory' && (
            <div className="theory-section">
              {data.theory}
            </div>
          )}

          {activeSection === 'operations' && (
            <div className="operations-section">
              <h2>Operations & Complexity</h2>
              <div className="operations-grid">
                {data.operations.map((op, index) => (
                  <div key={index} className="operation-card">
                    <div className="op-header">
                      <h3>{op.name}</h3>
                      <div className={`complexity-badge ${op.color || 'neutral'}`}>
                        {op.complexity}
                      </div>
                    </div>
                    <p>{op.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'examples' && (
            <div className="examples-section">
              <h2>Real-World Scenarios</h2>
              <div className="examples-grid">
                {data.examples.map((example, index) => (
                  <div key={index} className="example-card">
                    <h3>{example.title}</h3>
                    <div className="scenario-box">
                      <strong>Scenario:</strong> {example.scenario}
                    </div>
                    <ul className="steps-list">
                      {example.steps && example.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'visualization' && (
            <div className="visualization-section">
              <h2>Interactive Visualization</h2>
              <Visualization type={data.visualization} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;

