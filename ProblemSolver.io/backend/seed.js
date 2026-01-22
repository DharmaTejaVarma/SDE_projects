const mongoose = require('mongoose');
const Problem = require('./models/Problem');
require('dotenv').config();

const importantProblems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    category: "arrays",
    difficulty: "easy",
    constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9",
    sampleInput: "nums = [2,7,11,15], target = 9",
    sampleOutput: "[0,1]",
    explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    solution: {
      code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      language: "python",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      explanation: "Use a hash map to store numbers and their indices. For each number, check if its complement exists in the map."
    },
    testCases: [
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]" }
    ],
    hints: ["Think about using a hash table to store the complement of each number."],
    tags: ["array", "hash-table"],
    isImportant: true,
    createdBy: null // Will be set to admin user if exists
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    category: "stacks",
    difficulty: "easy",
    constraints: "1 <= s.length <= 10^4, s consists of parentheses only '()[]{}'.",
    sampleInput: "s = \"()\"",
    sampleOutput: "true",
    explanation: "The string is valid because open brackets are closed by the same type of brackets in the correct order.",
    solution: {
      code: `def is_valid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
      language: "python",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      explanation: "Use a stack to keep track of opening brackets. When encountering a closing bracket, check if it matches the top of the stack."
    },
    testCases: [
      { input: "\"()\"", expectedOutput: "true" },
      { input: "\"()[]{}\"", expectedOutput: "true" },
      { input: "\"(]\"", expectedOutput: "false" }
    ],
    hints: ["Use a stack data structure."],
    tags: ["string", "stack"],
    isImportant: true,
    createdBy: null
  },
  {
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists and return it as a sorted list.",
    category: "linkedLists",
    difficulty: "easy",
    constraints: "The number of nodes in both lists is in the range [0, 50]. -100 <= Node.val <= 100",
    sampleInput: "list1 = [1,2,4], list2 = [1,3,4]",
    sampleOutput: "[1,1,2,3,4,4]",
    explanation: "Merge the two sorted lists into one sorted list.",
    solution: {
      code: `def merge_two_lists(list1, list2):
    dummy = ListNode()
    current = dummy
    while list1 and list2:
        if list1.val < list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    current.next = list1 or list2
    return dummy.next`,
      language: "python",
      timeComplexity: "O(n + m)",
      spaceComplexity: "O(1)",
      explanation: "Iterate through both lists, comparing values and linking the smaller one to the result list."
    },
    testCases: [
      { input: "[1,2,4]\n[1,3,4]", expectedOutput: "[1,1,2,3,4,4]" },
      { input: "[]\n[]", expectedOutput: "[]" }
    ],
    hints: ["Use a dummy head node."],
    tags: ["linked-list", "recursion"],
    isImportant: true,
    createdBy: null
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    category: "arrays",
    difficulty: "medium",
    constraints: "1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4",
    sampleInput: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
    sampleOutput: "6",
    explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
    solution: {
      code: `def max_subarray(nums):
    max_current = max_global = nums[0]
    for num in nums[1:]:
        max_current = max(num, max_current + num)
        if max_current > max_global:
            max_global = max_current
    return max_global`,
      language: "python",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      explanation: "Use Kadane's algorithm to keep track of the maximum subarray sum ending at each position."
    },
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { input: "[1]", expectedOutput: "1" }
    ],
    hints: ["Kadane's algorithm can be used to solve this problem."],
    tags: ["array", "dynamic-programming"],
    isImportant: true,
    createdBy: null
  },
  {
    title: "Binary Tree Inorder Traversal",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    category: "trees",
    difficulty: "easy",
    constraints: "The number of nodes in the tree is in the range [0, 100]. -100 <= Node.val <= 100",
    sampleInput: "root = [1,null,2,3]",
    sampleOutput: "[1,3,2]",
    explanation: "Inorder traversal visits left subtree, root, right subtree.",
    solution: {
      code: `def inorder_traversal(root):
    result = []
    def inorder(node):
        if node:
            inorder(node.left)
            result.append(node.val)
            inorder(node.right)
    inorder(root)
    return result`,
      language: "python",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      explanation: "Use recursive inorder traversal: left, root, right."
    },
    testCases: [
      { input: "[1,null,2,3]", expectedOutput: "[1,3,2]" },
      { input: "[]", expectedOutput: "[]" }
    ],
    hints: ["Inorder traversal: left -> root -> right."],
    tags: ["tree", "depth-first-search"],
    isImportant: true,
    createdBy: null
  }
];

const seedImportantProblems = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-platform');

    // Check if important problems already exist
    const existingCount = await Problem.countDocuments({ isImportant: true });
    if (existingCount > 0) {
      console.log('Important problems already seeded');
      return;
    }

    // Get admin user or create one
    let adminUser = await require('./models/User').findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await require('./models/User').create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123', // In production, hash this
        role: 'admin'
      });
    }

    // Set createdBy for all problems
    importantProblems.forEach(problem => {
      problem.createdBy = adminUser._id;
    });

    // Insert problems
    await Problem.insertMany(importantProblems);
    console.log('Important problems seeded successfully');

  } catch (error) {
    console.error('Error seeding important problems:', error);
  } finally {
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  seedImportantProblems();
}

module.exports = seedImportantProblems;