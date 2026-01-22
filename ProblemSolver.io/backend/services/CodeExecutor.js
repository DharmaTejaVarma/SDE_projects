const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class CodeExecutor {
  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'dsa-executor');
    this.timeLimit = 5000; // 5 seconds
    this.memoryLimit = 256 * 1024 * 1024; // 256MB
  }

  async execute(code, language, input = '', timeLimit = 5000, memoryLimit = 256 * 1024 * 1024, functionName = 'solve') {
    const executionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const workDir = path.join(this.tempDir, executionId);

    try {
      // Create working directory
      await fs.mkdir(workDir, { recursive: true });

      const result = {
        verdict: 'accepted',
        executionTime: 0,
        memoryUsed: 0,
        output: '',
        error: '',
        testCaseResults: []
      };

      // Step 1: Compilation
      const compileResult = await this.compileCode(code, language, workDir, functionName);
      if (compileResult.verdict !== 'accepted') {
        return {
          ...result,
          verdict: compileResult.verdict,
          error: compileResult.error
        };
      }

      // Step 2: Execution
      const execResult = await this.runCode(language, workDir, input, timeLimit);
      result.executionTime = execResult.executionTime;
      result.memoryUsed = execResult.memoryUsed;
      result.output = execResult.output;
      result.fullOutput = execResult.fullOutput || execResult.output;
      result.error = execResult.error;

      if (execResult.verdict !== 'accepted') {
        result.verdict = execResult.verdict;
      }

      return result;

    } catch (error) {
      return {
        verdict: 'runtime_error',
        executionTime: 0,
        memoryUsed: 0,
        output: '',
        error: error.message,
        testCaseResults: []
      };
    } finally {
      // Cleanup
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }
  }

  async compileCode(code, language, workDir, functionName = 'solve') {
    const result = {
      verdict: 'accepted',
      error: ''
    };

    try {
      switch (language) {
        case 'python':
          // Python with driver code
          const codeFile = path.join(workDir, 'solution.py');

          // Remove potential conflicting main blocks from user code
          const sanitizedCode = code.replace(/if\s+__name__\s*==\s*['"]__main__['"]\s*:[\s\S]*/g, '');

          const driverCode = `
import sys
import json

${sanitizedCode}

if __name__ == "__main__":
    try:
        # Read all stdin
        input_str = sys.stdin.read().strip()
        if not input_str:
            sys.exit(0)
            
        lines = input_str.split('\\n')
        args = []
        for line in lines:
            line = line.strip()
            if line:
                try:
                    # Attempt JSON parse
                    args.append(json.loads(line))
                except json.JSONDecodeError:
                    # Fallback for simple integers/strings if not valid JSON
                    try:
                        args.append(eval(line))
                    except:
                        args.append(line)

        # Call solve function
        if '${functionName}' in globals():
            print(f"Input Args: {args}") # Debug: Show input in console
            result = ${functionName}(*args)
            print(json.dumps(result))
        else:
            print("Error: Function '${functionName}' not found. Please define 'def ${functionName}(...):'", file=sys.stderr)
            sys.exit(1)
            
    except Exception as e:
        print(f"Runtime Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
`;
          await fs.writeFile(codeFile, driverCode);
          break;

        case 'javascript':
          const jsFile = path.join(workDir, 'solution.js');

          const jsDriverCode = `
const fs = require('fs');

// --- USER CODE START ---
${code}
// --- USER CODE END ---

// --- DRIVER CODE ---
try {
  // Read all stdin
  let input = '';
  try {
    input = fs.readFileSync(0, 'utf-8').trim();
  } catch (e) {
    // No input provided or error reading
  }

  if (input) {
    const lines = input.split('\\n');
    const args = lines.map(line => {
      line = line.trim();
      if (!line) return undefined;
      try {
        return JSON.parse(line);
      } catch (e) {
        // Fallback for simple types similar to Python's eval assumption
        if (!isNaN(line)) return Number(line);
        if (line === 'true') return true;
        if (line === 'false') return false;
        // Strip quotes if they exist but JSON.parse failed (unlikely but safe)
        return line.replace(/^['"]|['"]$/g, '');
      }
    }).filter(arg => arg !== undefined);

    if (typeof ${functionName} !== 'function') {
      console.error("Function '${functionName}' not found or is not defined.");
      process.exit(1);
    }

    // Call the function with parsed arguments
    const result = ${functionName}(...args);
    
    // Output result as JSON
    console.log(JSON.stringify(result));
  }
} catch (error) {
  console.error("Runtime Error: " + error.message);
  process.exit(1);
}
`;
          await fs.writeFile(jsFile, jsDriverCode);

          // Syntax Check
          const syntaxCheck = await this.runProcess('node', ['--check', 'solution.js'], workDir, 5000);
          if (syntaxCheck.exitCode !== 0) {
            result.verdict = 'compilation_error';
            result.error = syntaxCheck.stderr || syntaxCheck.stdout;
          }
          break;

        case 'cpp':
          const cppFile = path.join(workDir, 'solution.cpp');
          await fs.writeFile(cppFile, code);

          const compileResult = await this.runProcess('g++', ['-o', 'solution', 'solution.cpp'], workDir, 10000);
          if (compileResult.exitCode !== 0) {
            result.verdict = 'compilation_error';
            result.error = compileResult.stderr || compileResult.stdout;
          }
          break;

        case 'java':
          const javaFile = path.join(workDir, 'Solution.java');
          await fs.writeFile(javaFile, code);

          const javacResult = await this.runProcess('javac', ['Solution.java'], workDir, 10000);
          if (javacResult.exitCode !== 0) {
            result.verdict = 'compilation_error';
            result.error = javacResult.stderr || javacResult.stdout;
          }
          break;

        default:
          result.verdict = 'compilation_error';
          result.error = `Unsupported language: ${language}`;
      }
    } catch (error) {
      result.verdict = 'compilation_error';
      result.error = error.message;
    }

    return result;
  }

  async runCode(language, workDir, input, timeLimit) {
    const result = {
      verdict: 'accepted',
      executionTime: 0,
      memoryUsed: 0,
      output: '',
      error: ''
    };

    const startTime = process.hrtime.bigint();

    try {
      let command, args;

      switch (language) {
        case 'python':
          command = 'python';
          args = ['solution.py'];
          break;

        case 'javascript':
          command = 'node';
          args = ['solution.js'];
          break;

        case 'cpp':
          command = './solution';
          args = [];
          break;

        case 'java':
          command = 'java';
          args = ['Solution'];
          break;

        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      const execResult = await this.runProcess(command, args, workDir, timeLimit, input);

      const endTime = process.hrtime.bigint();
      result.executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds

      if (execResult.timedOut) {
        result.verdict = 'time_limit_exceeded';
        result.error = 'Time limit exceeded';
      } else if (execResult.exitCode !== 0) {
        result.verdict = 'runtime_error';
        result.error = execResult.stderr || 'Runtime error';
      } else {
        // Parse stdout to separate logs from result (last line)
        const stdout = execResult.stdout.trim();
        const lastNewLine = stdout.lastIndexOf('\n');
        if (lastNewLine !== -1) {
          result.output = stdout.substring(lastNewLine + 1).trim();
          result.fullOutput = stdout;
        } else {
          result.output = stdout;
          result.fullOutput = stdout;
        }
      }

      // Estimate memory usage (simplified)
      result.memoryUsed = Math.floor(Math.random() * 50) + 10; // Mock memory usage

    } catch (error) {
      result.verdict = 'runtime_error';
      result.error = error.message;
    }

    return result;
  }

  runProcess(command, args, cwd, timeout, input = '') {
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout
      });

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      // Handle timeout
      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, timeout);

      // Write input to stdin
      if (input) {
        child.stdin.write(input);
        child.stdin.end();
      }

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        resolve({
          exitCode: code,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          timedOut
        });
      });

      child.on('error', (error) => {
        clearTimeout(timer);
        resolve({
          exitCode: -1,
          stdout: '',
          stderr: error.message,
          timedOut: false
        });
      });
    });
  }

  async judgeTestCases(code, language, testCases, functionName = 'solve') {
    const results = {
      verdict: 'accepted',
      testCasesPassed: 0,
      totalTestCases: testCases.length,
      failedTestCase: null,
      executionTime: 0,
      memoryUsed: 0
    };

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const executionResult = await this.execute(code, language, testCase.input, 5000, 256 * 1024 * 1024, functionName);

      if (executionResult.verdict !== 'accepted') {
        results.verdict = executionResult.verdict;
        results.failedTestCase = {
          index: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: executionResult.output,
          error: executionResult.error
        };
        break;
      }

      // Compare outputs
      if (!this.compareOutputs(executionResult.output, testCase.expectedOutput)) {
        results.verdict = 'wrong_answer';
        results.failedTestCase = {
          index: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          expectedOutput: testCase.expectedOutput,
          actualOutput: executionResult.fullOutput || executionResult.output
        };
        break;
      }

      results.testCasesPassed++;
      results.executionTime = Math.max(results.executionTime, executionResult.executionTime);
      results.memoryUsed = Math.max(results.memoryUsed, executionResult.memoryUsed);
    }

    return results;
  }

  compareOutputs(actual, expected) {
    // 1. Try JSON comparison first
    try {
      const actualObj = JSON.parse(actual);
      const expectedObj = JSON.parse(expected);
      // Canonicalize JSON string for comparison
      return JSON.stringify(actualObj) === JSON.stringify(expectedObj);
    } catch (e) {
      // 2. Fallback to string normalization
      const normalize = (str) => {
        return str
          .trim()
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .replace(/[ \t]+$/gm, ''); // Remove trailing spaces
      };

      const normalizedActual = normalize(actual);
      const normalizedExpected = normalize(expected);

      return normalizedActual === normalizedExpected;
    }
  }
}

module.exports = new CodeExecutor();