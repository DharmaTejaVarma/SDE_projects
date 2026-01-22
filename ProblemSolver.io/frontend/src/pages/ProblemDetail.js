import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import importantProblemsData from '../data/importantProblems.json';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import SuccessModal from '../components/SuccessModal';
import './ProblemDetail.css';

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('problem');
  const [submissions, setSubmissions] = useState([]);
  const [userSolved, setUserSolved] = useState(false);

  const [entryPoint, setEntryPoint] = useState('solve');
  const [showDriverCode, setShowDriverCode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [solutionLanguage, setSolutionLanguage] = useState('python');
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [consoleData, setConsoleData] = useState({
    status: null, // 'accepted', 'wrong_answer', 'runtime_error', 'compilation_error', 'time_limit_exceeded', 'system_error'
    executionSummary: null, // { language, executionTime, memoryUsed, testCasesPassed, totalTestCases }
    testCaseResults: [], // Array of test case objects
    errorMessage: null, // Compilation or runtime error message
    isSubmission: false // true for submit, false for run
  });

  useEffect(() => {
    fetchProblem();
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [id, isAuthenticated]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/submissions?problemId=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);

        // Check if solved
        const acceptedSubmission = data.data.find(sub => sub.status === 'Accepted');
        if (acceptedSubmission) {
          setUserSolved(true);
          // Auto-load accepted code
          setCode(acceptedSubmission.code);
        }
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };



  const fetchProblem = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const problemData = importantProblemsData.find(p => p.id === id);
      if (problemData) {
        setProblem(problemData);

        // Determine entry point from solution code
        let derivedEntryPoint = 'solve';
        if (problemData.solution && problemData.solution.python && problemData.solution.python.code) {
          const match = problemData.solution.python.code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
          if (match) {
            derivedEntryPoint = match[1];
          }
        }
        setEntryPoint(derivedEntryPoint);

        // Only set default code if we haven't just loaded an accepted solution (race condition tricky here with async state)
        // Actually fetchSubmissions runs parallel. Let's make sure we don't overwrite accepted code.
        // Better: Wait for submissions to check? No, default first.
        setDefaultCode(language, problemData, derivedEntryPoint);
      } else {
        console.error('Problem not found');
      }
    } catch (error) {
      console.error('Failed to fetch problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultCode = (lang, problemData, ep = 'solve') => {
    let codeStub = '';

    // Define problem-specific stubs
    if (problemData) {
      if (lang === 'python') {
        switch (problemData.title) {
          case 'Two Sum':
            codeStub = `def ${ep}(nums, target):
    # Write your solution here
    pass`;
            break;
          case 'Valid Parentheses':
            codeStub = `def ${ep}(s):
    # Write your solution here
    pass`;
            break;
          case 'Merge Two Sorted Lists':
            codeStub = `def ${ep}(list1, list2):
    # Write your solution here
    pass`;
            break;
          case 'Maximum Subarray':
            codeStub = `def ${ep}(nums):
    # Write your solution here
    pass`;
            break;
          default:
            codeStub = `def ${ep}():
    # Write your solution here
    pass`;
        }
      }
    }

    // Extract arguments from the stub for the driver comment
    const argsMatch = codeStub.match(/def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\((.*?)\):/);
    const args = argsMatch ? argsMatch[1] : '*args';

    const pythonDriver = `
# Driver Code
if __name__ == "__main__":
    # Inputs (${args}) are automatically read from standard input
    # result = ${ep}(${args})
    # print(result)
    pass`;

    const jsCodeStub = `function ${ep}(${args}) {
    // Write your solution here
    return;
}`;

    const templates = {
      python: (codeStub || `def ${ep}():
    # Write your solution here
    pass`) + pythonDriver,
      javascript: jsCodeStub,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    // Write your solution here
    return 0;
}`,
      java: `public class Solution {
    public static void main(String[] args) {
        // Write your solution here
    }
}`
    };
    setCode(templates[lang] || templates.python);
  };

  const validateCode = (code, language, problem) => {
    // Basic validation rules
    if (language === 'python') {
      // Check for basic Python syntax
      if (!code.includes('def ') && !code.includes('class ')) {
        return {
          isValid: false,
          errorMessage: 'Python code should contain at least one function definition (def) or class definition.'
        };
      }

      // Check for return statement in solution functions
      if (problem.id === '1' && !code.includes('return') && !code.includes('pass')) {
        // Relax validation to allow 'pass' for initial template
      }

      // Check for basic syntax issues
      const lines = code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const leadingSpaces = line.length - line.trimStart().length;
          if (leadingSpaces % 4 !== 0) {
            return {
              isValid: false,
              errorMessage: `Line ${i + 1}: Invalid indentation. Python uses 4 spaces for indentation.`
            };
          }
        }
      }
    } else if (language === 'java') {
      // Check for basic Java syntax
      if (!code.includes('public class') && !code.includes('class ')) {
        return {
          isValid: false,
          errorMessage: 'Java code should contain at least one class definition.'
        };
      }

      if (!code.includes('public static void main')) {
        return {
          isValid: false,
          errorMessage: 'Java code should contain a main method: public static void main(String[] args)'
        };
      }

      // Check for balanced braces
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        return {
          isValid: false,
          errorMessage: 'Unbalanced braces. Check your opening and closing braces.'
        };
      }
    } else if (language === 'cpp') {
      // Check for basic C++ syntax
      if (!code.includes('#include') && !code.includes('int main')) {
        return {
          isValid: false,
          errorMessage: 'C++ code should contain #include directives and a main function.'
        };
      }

      if (!code.includes('int main')) {
        return {
          isValid: false,
          errorMessage: 'C++ code should contain a main function: int main()'
        };
      }

      // Check for balanced braces
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        return {
          isValid: false,
          errorMessage: 'Unbalanced braces. Check your opening and closing braces.'
        };
      }
    }

    return { isValid: true };
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setDefaultCode(newLang, problem, entryPoint);
  };

  const updateConsoleData = (updates) => {
    setConsoleData(prev => ({ ...prev, ...updates }));
  };

  const clearConsole = () => {
    setConsoleData({
      status: null,
      executionSummary: null,
      testCaseResults: [],
      errorMessage: null,
      isSubmission: false
    });
  };

  const compileCode = async (code, language) => {
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Basic syntax validation
    if (!code.trim()) {
      return { success: false, error: 'Code cannot be empty' };
    }

    // Language-specific compilation checks
    if (language === 'python') {
      // Check for basic Python syntax
      if (!code.includes('def ') && !code.includes('class ') && !code.includes('print(')) {
        return { success: false, error: 'Python code should contain at least one function, class, or print statement' };
      }

      // Check for balanced parentheses
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        return { success: false, error: 'Unbalanced parentheses' };
      }
    } else if (language === 'java') {
      // Check for basic Java syntax
      if (!code.includes('class ')) {
        return { success: false, error: 'Java code must contain a class definition' };
      }

      // Check for balanced braces
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        return { success: false, error: 'Unbalanced braces' };
      }
    } else if (language === 'cpp' || language === 'c') {
      // Check for basic C/C++ syntax
      if (!code.includes('int main') && !code.includes('void main')) {
        return { success: false, error: 'C/C++ code must contain a main function' };
      }

      // Check for balanced braces
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        return { success: false, error: 'Unbalanced braces' };
      }
    }

    return { success: true };
  };

  const executeCode = async (code, language, input = '', problemId = null) => {
    // Simulate execution delay with timeout
    const executionPromise = new Promise((resolve) => {
      setTimeout(() => {
        try {
          let output = '';
          let executionError = null;

          // Check for potential infinite loops (very basic detection)
          if (code.includes('while True:') || code.includes('while(true)') || code.includes('while (true)')) {
            executionError = 'Time Limit Exceeded: Possible infinite loop detected';
            resolve({ success: false, error: executionError, output: '' });
            return;
          }

          // Simulate execution based on problem type
          if (problemId === '1') { // Two Sum
            // Parse input: "[2,7,11,15]\n9"
            const lines = input.trim().split('\n');
            if (lines.length >= 2) {
              try {
                const numsStr = lines[0].trim();
                const targetStr = lines[1].trim();

                // Parse array and target
                const numsMatch = numsStr.match(/\[([^\]]+)\]/);
                const target = parseInt(targetStr);

                if (numsMatch && !isNaN(target)) {
                  const nums = numsMatch[1].split(',').map(n => parseInt(n.trim()));

                  // Check if code contains the expected function/method
                  let hasFunction = false;
                  if (language === 'python' && code.includes('def two_sum')) hasFunction = true;
                  else if (language === 'java' && (code.includes('public int[] twoSum') || code.includes('int[] twoSum'))) hasFunction = true;
                  else if ((language === 'cpp' || language === 'c') && (code.includes('vector<int> twoSum') || code.includes('twoSum('))) hasFunction = true;

                  if (hasFunction) {
                    // Simulate correct implementation for this specific input
                    const seen = {};
                    let found = false;
                    for (let i = 0; i < nums.length; i++) {
                      const complement = target - nums[i];
                      if (complement in seen) {
                        output = `[${seen[complement]},${i}]`;
                        found = true;
                        break;
                      }
                      seen[nums[i]] = i;
                    }
                    if (!found) output = '[]';
                  } else {
                    executionError = language === 'python' ? 'Function two_sum not found' :
                      language === 'java' ? 'Method twoSum not found' :
                        'Function twoSum not found';
                  }
                } else {
                  executionError = 'Invalid input format';
                }
              } catch (e) {
                executionError = 'Input parsing error';
              }
            } else {
              executionError = 'Invalid input format';
            }
          } else if (problemId === '2') { // Valid Parentheses
            // Input is just the string to check, may have quotes
            let s = input.trim();
            if (s.startsWith('"') && s.endsWith('"')) {
              s = s.slice(1, -1);
            }

            // Check if code contains the expected function/method
            let hasFunction = false;
            if (language === 'python' && code.includes('def is_valid')) hasFunction = true;
            else if (language === 'java' && (code.includes('public boolean isValid') || code.includes('boolean isValid'))) hasFunction = true;
            else if ((language === 'cpp' || language === 'c') && (code.includes('bool isValid') || code.includes('isValid('))) hasFunction = true;

            if (hasFunction) {
              // Simulate correct implementation
              const stack = [];
              const mapping = { ')': '(', '}': '{', ']': '[' };
              let valid = true;

              for (const char of s) {
                if (char in mapping) {
                  const top = stack.length > 0 ? stack.pop() : '#';
                  if (mapping[char] !== top) {
                    valid = false;
                    break;
                  }
                } else {
                  stack.push(char);
                }
              }

              output = (valid && stack.length === 0).toString();
            } else {
              executionError = language === 'python' ? 'Function is_valid not found' :
                language === 'java' ? 'Method isValid not found' :
                  'Function isValid not found';
            }
          } else {
            // Generic simulation for other problems
            if (language === 'python') {
              if (code.includes('print(')) {
                const printMatches = code.match(/print\((.*?)\)/g);
                if (printMatches) {
                  output = printMatches.map(match => {
                    const content = match.match(/print\((.*?)\)/)[1];
                    if ((content.startsWith('"') && content.endsWith('"')) ||
                      (content.startsWith("'") && content.endsWith("'"))) {
                      return content.slice(1, -1);
                    }
                    return content;
                  }).join('\n');
                }
              }
            } else if (language === 'java') {
              if (code.includes('System.out.println(')) {
                const printMatches = code.match(/System\.out\.println\((.*?)\)/g);
                if (printMatches) {
                  output = printMatches.map(match => {
                    const content = match.match(/System\.out\.println\((.*?)\)/)[1];
                    if (content.startsWith('"') && content.endsWith('"')) {
                      return content.slice(1, -1);
                    }
                    return content;
                  }).join('\n');
                }
              }
            } else if (language === 'cpp') {
              if (code.includes('cout <<')) {
                const coutMatches = code.match(/cout\s*<<\s*(.*?);/g);
                if (coutMatches) {
                  output = coutMatches.map(match => {
                    const content = match.match(/cout\s*<<\s*(.*?);/)[1];
                    if (content.startsWith('"') && content.endsWith('"')) {
                      return content.slice(1, -1);
                    }
                    return content;
                  }).join('\n');
                }
              }
            }
          }

          if (executionError) {
            resolve({
              success: false,
              error: executionError,
              output: '',
              executionTime: null,
              memoryUsed: null
            });
          } else {
            const executionTime = `${Math.floor(Math.random() * 500) + 200}ms`;
            const memoryUsed = `${Math.floor(Math.random() * 20) + 5}MB`;
            resolve({
              success: true,
              output,
              error: null,
              executionTime,
              memoryUsed
            });
          }
        } catch (e) {
          resolve({ success: false, error: e.message, output: '' });
        }
      }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
    });

    // Timeout after 3 seconds
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          error: 'Time Limit Exceeded: Execution took too long',
          output: '',
          executionTime: null,
          memoryUsed: null
        });
      }, 3000);
    });

    const result = await Promise.race([executionPromise, timeoutPromise]);

    return result;
  };

  const runTestCases = async (code, language, problem, isSubmission = false) => {
    const testCases = problem.testCases || [
      { input: problem.sampleInput, expectedOutput: problem.sampleOutput }
    ];

    let passed = 0;
    const results = [];
    let totalExecutionTime = 0;
    let maxMemoryUsed = 0;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      // Simulate execution with test input
      const executionResult = await executeCode(code, language, testCase.input, problem.id);

      if (!executionResult.success) {
        results.push({
          status: 'runtime_error',
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: '',
          error: executionResult.error,
          executionTime: executionResult.executionTime,
          memoryUsed: executionResult.memoryUsed
        });
        continue;
      }

      // Compare output (normalize whitespace: trim trailing spaces and newlines, but preserve internal whitespace)
      const normalizeOutput = (output) => {
        if (!output) return '';
        return output
          .split('\n')
          .map(line => line.trimEnd()) // Remove trailing spaces from each line
          .join('\n')
          .trimEnd(); // Remove trailing newlines
      };

      const actualOutput = normalizeOutput(executionResult.output);
      const expectedOutput = normalizeOutput(testCase.expectedOutput);

      if (actualOutput === expectedOutput) {
        passed++;
        results.push({
          status: 'passed',
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: executionResult.output,
          executionTime: executionResult.executionTime,
          memoryUsed: executionResult.memoryUsed
        });

        // Track performance metrics
        if (executionResult.executionTime) {
          const timeMs = parseInt(executionResult.executionTime.replace('ms', ''));
          totalExecutionTime += timeMs;
        }
        if (executionResult.memoryUsed) {
          const memMB = parseInt(executionResult.memoryUsed.replace('MB', ''));
          maxMemoryUsed = Math.max(maxMemoryUsed, memMB);
        }
      } else {
        results.push({
          status: 'failed',
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: executionResult.output,
          executionTime: executionResult.executionTime,
          memoryUsed: executionResult.memoryUsed
        });
      }
    }

    // Update console data
    const executionSummary = {
      language: language.toUpperCase(),
      executionTime: totalExecutionTime > 0 ? `~${Math.round(totalExecutionTime / testCases.length)}ms` : '~800ms',
      memoryUsed: maxMemoryUsed > 0 ? `~${maxMemoryUsed}MB` : '~12MB',
      testCasesPassed: passed,
      totalTestCases: testCases.length
    };

    updateConsoleData({
      executionSummary,
      testCaseResults: results,
      isSubmission
    });

    return {
      passed,
      total: testCases.length,
      results,
      executionTime: executionSummary.executionTime,
      memoryUsed: executionSummary.memoryUsed
    };
  };

  const handleRun = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRunning(true);
    clearConsole();

    try {
      const response = await fetch('/api/submissions/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          functionName: entryPoint
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error types properly
        if (response.status === 401 || response.status === 403) {
          updateConsoleData({
            status: 'system_error',
            errorMessage: 'Authentication failed. Please log in again.',
            isSubmission: false
          });
        } else if (response.status >= 500) {
          updateConsoleData({
            status: 'system_error',
            errorMessage: 'Server error. Please try again later.',
            isSubmission: false
          });
        } else {
          updateConsoleData({
            status: 'runtime_error',
            errorMessage: data.message || 'Failed to run code',
            isSubmission: false
          });
        }
        return;
      }

      // Update console with run results
      updateConsoleData({
        status: data.data.verdict,
        executionTime: data.data.executionTime,
        memoryUsed: data.data.memoryUsed,
        testCasesPassed: data.data.testCasesPassed,
        totalTestCases: data.data.totalTestCases,
        sampleResults: data.data.sampleResults,
        failedTestCase: data.data.failedTestCase,
        isSubmission: false
      });

    } catch (error) {
      updateConsoleData({
        status: 'system_error',
        errorMessage: `Network error: ${error.message}`,
        isSubmission: false
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!code || !code.trim()) {
      updateConsoleData({
        status: 'compilation_error',
        errorMessage: 'No code to submit',
        isSubmission: true
      });
      return;
    }

    setSubmitting(true);
    clearConsole();

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          functionName: entryPoint
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error types properly
        if (response.status === 401 || response.status === 403) {
          updateConsoleData({
            status: 'system_error',
            errorMessage: 'Authentication failed. Please log in again.',
            isSubmission: true
          });
        } else if (response.status >= 500) {
          updateConsoleData({
            status: 'system_error',
            errorMessage: 'Server error. Please try again later.',
            isSubmission: true
          });
        } else {
          updateConsoleData({
            status: 'runtime_error',
            errorMessage: data.message || 'Failed to submit code',
            isSubmission: true
          });
        }
        return;
      }

      // Ensure data.data exists
      const resultData = data.data || {};
      const isAccepted = resultData.status === 'accepted';

      updateConsoleData({
        status: resultData.status,
        executionTime: resultData.executionTime, // Assuming these are directly available or need parsing
        memoryUsed: resultData.memoryUsed,
        testCasesPassed: resultData.testCasesPassed,
        totalTestCases: resultData.totalTestCases,
        failedTestCase: resultData.failedTestCase, // Keep failedTestCase if it's part of the API response
        errorMessage: resultData.errorMessage, // Add errorMessage for compilation/runtime errors
        isSubmission: true
      });

      if (isAccepted) {
        setShowSuccessModal(true);
      }

    } catch (error) {
      updateConsoleData({
        status: 'system_error',
        errorMessage: `Network error: ${error.message}`,
        isSubmission: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="problem-detail-page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="problem-detail-page">
        <div className="container">
          <div className="empty-state">
            <p>Problem not found</p>
          </div>
        </div>
      </div>
    );
  }

  const handleNextProblem = () => {
    setShowSuccessModal(false);
    const currentIndex = importantProblemsData.findIndex(p => p.id === id);
    if (currentIndex !== -1 && currentIndex < importantProblemsData.length - 1) {
      navigate(`/problems/${importantProblemsData[currentIndex + 1].id}`);
    } else {
      navigate('/problems'); // Fallback to list if no next problem
    }
  };

  return (
    <div className="problem-detail-page">
      <div className="container">
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          onNextProblem={handleNextProblem}
        />

        <div className="problem-layout">
          <div className="problem-content">
            <div className="problem-header">
              <h1 className="problem-title">{problem.title}</h1>
              <span className={`badge badge-${problem.difficulty}`}>
                {problem.difficulty}
              </span>
            </div>

            <div className="tabs">
              <button
                className={`tab ${activeTab === 'problem' ? 'active' : ''}`}
                onClick={() => setActiveTab('problem')}
              >
                Problem
              </button>
              <button
                className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
                onClick={() => setActiveTab('submissions')}
              >
                Submissions
              </button>
              <button
                className={`tab ${activeTab === 'solution' ? 'active' : ''}`}
                onClick={() => setActiveTab('solution')}
              >
                Solution
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'problem' && (
                <div className="problem-description">
                  <div className="description-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2>Description</h2>
                    {userSolved && <span className="badge badge-accepted">Solved</span>}
                  </div>
                  <p>{problem.description}</p>

                  <h2>Constraints</h2>
                  <pre className="constraints">{problem.constraints}</pre>

                  <h2>Sample Input</h2>
                  <pre className="sample-input">{problem.sampleInput}</pre>

                  <h2>Sample Output</h2>
                  <pre className="sample-output">{problem.sampleOutput}</pre>

                  <h2>Explanation</h2>
                  <p>{problem.explanation}</p>
                </div>
              )}

              {activeTab === 'submissions' && (
                <div className="submissions-section">
                  <h2>My Submissions</h2>
                  {submissions.length === 0 ? (
                    <p className="no-data">No submissions yet.</p>
                  ) : (
                    <div className="submissions-list">
                      {submissions.map((sub, index) => (
                        <div key={sub.id || index} className="submission-item">
                          <div className="submission-info">
                            <span className={`status-badge badge-${sub.status.toLowerCase().replace(' ', '_')}`}>
                              {sub.status}
                            </span>
                            <span className="submission-date">
                              {new Date(sub.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="submission-metrics">
                            <span className="metric">
                              ⏱️ {sub.executionTime || 'N/A'}
                            </span>
                            <span className="metric">
                              💾 {sub.memoryUsed || 'N/A'}
                            </span>
                          </div>
                          <button
                            className="btn-text"
                            onClick={() => {
                              setCode(sub.code);
                              setLanguage(sub.language);
                              setActiveTab('problem');
                            }}
                          >
                            View Code
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'solution' && (
                <div className="solution-content">
                  <h2>Solution</h2>

                  <div className="language-selector">
                    <label>Language: </label>
                    <select
                      value={solutionLanguage}
                      onChange={(e) => setSolutionLanguage(e.target.value)}
                      className="language-select"
                    >
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>

                  {problem.solution && problem.solution[solutionLanguage] && (
                    <>
                      <div className="complexity-info">
                        <div>
                          <strong>Time Complexity:</strong> {problem.solution[solutionLanguage].timeComplexity}
                        </div>
                        <div>
                          <strong>Space Complexity:</strong> {problem.solution[solutionLanguage].spaceComplexity}
                        </div>
                      </div>
                      <pre className="solution-code">
                        <code>{problem.solution[solutionLanguage].code}</code>
                      </pre>
                      <h3>Explanation</h3>
                      <p>{problem.solution[solutionLanguage].explanation}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-header">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="language-select"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
              </select>
              <button
                className="btn btn-secondary"
                onClick={handleRun}
                disabled={running || submitting}
              >
                {running ? 'Running...' : 'Run'}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || running}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
            />



            <div className="modern-console">
              {/* Status Header */}
              {consoleData.status && (
                <div className="console-card status-header">
                  <div className="status-badge">
                    <span className={`badge badge-${consoleData.status}`}>
                      {consoleData.status === 'accepted' ? 'Accepted' :
                        consoleData.status === 'wrong_answer' ? 'Wrong Answer' :
                          consoleData.status === 'runtime_error' ? 'Runtime Error' :
                            consoleData.status === 'compilation_error' ? 'Compilation Error' :
                              consoleData.status === 'time_limit_exceeded' ? 'Time Limit Exceeded' :
                                consoleData.status === 'system_error' ? 'System Error' : 'Unknown'}
                    </span>
                  </div>
                </div>
              )}

              {/* Execution Summary */}
              {(consoleData.executionTime || consoleData.memoryUsed || consoleData.testCasesPassed !== undefined) && (
                <div className="console-card execution-summary">
                  <h5>Execution Summary</h5>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="label">Language</span>
                      <span className="value">{language.toUpperCase()}</span>
                    </div>
                    {consoleData.executionTime && (
                      <div className="summary-item">
                        <span className="label">Time</span>
                        <span className="value">{consoleData.executionTime.toFixed(2)}ms</span>
                      </div>
                    )}
                    {consoleData.memoryUsed && (
                      <div className="summary-item">
                        <span className="label">Memory</span>
                        <span className="value">{consoleData.memoryUsed}MB</span>
                      </div>
                    )}
                    {consoleData.testCasesPassed !== undefined && (
                      <div className="summary-item">
                        <span className="label">Test Cases</span>
                        <span className="value">{consoleData.testCasesPassed} / {consoleData.totalTestCases || 0}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sample Test Results for Run */}
              {consoleData.sampleResults && consoleData.sampleResults.length > 0 && (
                <div className="console-card test-results">
                  <h5>Sample Test Results</h5>
                  <div className="test-cases">
                    {consoleData.sampleResults.map((test, index) => (
                      <div key={index} className={`test-case ${test.passed ? 'passed' : 'failed'}`}>
                        <div className="test-header">
                          <span className="test-number">Sample Test {test.testCaseNumber}</span>
                          <span className={`test-status status-${test.passed ? 'passed' : 'failed'}`}>
                            {test.passed ? '✓ Passed' : '✗ Failed'}
                          </span>
                        </div>

                        <div className="test-details">
                          <div className="test-input">
                            <strong>Input:</strong>
                            <pre>{test.input}</pre>
                          </div>
                          <div className="test-expected">
                            <strong>Expected Output:</strong>
                            <pre>{test.expectedOutput}</pre>
                          </div>
                          <div className="test-actual">
                            <strong>Your Output:</strong>
                            <pre>{test.actualOutput || 'No output'}</pre>
                          </div>
                          {test.error && (
                            <div className="test-error">
                              <strong>Error:</strong>
                              <pre>{test.error}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed Test Case Details for Submit */}
              {consoleData.failedTestCase && consoleData.isSubmission && (
                <div className="console-card test-results">
                  <h5>Failed Test Case</h5>
                  <div className="test-case failed">
                    <div className="test-header">
                      <span className="test-number">Test Case {consoleData.failedTestCase.index}</span>
                      <span className="test-status status-failed">✗ Failed</span>
                    </div>

                    <div className="test-details">
                      <div className="test-input">
                        <strong>Input:</strong>
                        <pre>{consoleData.failedTestCase.input}</pre>
                      </div>
                      <div className="test-expected">
                        <strong>Expected Output:</strong>
                        <pre>{consoleData.failedTestCase.expectedOutput}</pre>
                      </div>
                      <div className="test-actual">
                        <strong>Your Output:</strong>
                        <pre>{consoleData.failedTestCase.actualOutput || 'No output'}</pre>
                      </div>
                      {consoleData.failedTestCase.error && (
                        <div className="test-error">
                          <strong>Error:</strong>
                          <pre>{consoleData.failedTestCase.error}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Messages */}
              {consoleData.errorMessage && (
                <div className="console-card error-message">
                  <h5>Error Details</h5>
                  <div className="error-content">
                    <pre>{consoleData.errorMessage}</pre>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!consoleData.status && !consoleData.errorMessage && (
                <div className="console-card empty-state">
                  <p>Click "Run" to test your code against sample inputs, or "Submit" to evaluate against all test cases.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;

