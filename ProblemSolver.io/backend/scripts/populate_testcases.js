const fs = require('fs');
const path = require('path');

const problemsPath = path.join(__dirname, '../data/problems.json');
const rawData = fs.readFileSync(problemsPath, 'utf-8');
const problems = JSON.parse(rawData);

// Helper to generate generic test cases based on sample
const generateGenericTestCases = (sampleInput, sampleOutput, count = 8) => {
    const testCases = [];
    for (let i = 0; i < count; i++) {
        testCases.push({
            input: sampleInput,
            expectedOutput: sampleOutput,
            isHidden: i >= 2 // Hide test cases after the first 2
        });
    }
    return testCases;
};

// Specific test case generators for known problems
const specificTestCases = {
    "Two Sum": [
        { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
        { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
        { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true },
        { input: "[2,7,11,15]\n26", expectedOutput: "[2,3]", isHidden: true },
        { input: "[1,2,3,4,5]\n9", expectedOutput: "[3,4]", isHidden: true },
        { input: "[-1,-2,-3,-4,-5]\n-8", expectedOutput: "[2,4]", isHidden: true },
        { input: "[10,20,30,40,50]\n90", expectedOutput: "[3,4]", isHidden: true },
        { input: "[5,25,75]\n100", expectedOutput: "[1,2]", isHidden: true }
    ],
    "Valid Parentheses": [
        { input: "()", expectedOutput: "true", isHidden: false },
        { input: "()[]{}", expectedOutput: "true", isHidden: false },
        { input: "(]", expectedOutput: "false", isHidden: true },
        { input: "([)]", expectedOutput: "false", isHidden: true },
        { input: "{[]}", expectedOutput: "true", isHidden: true },
        { input: "", expectedOutput: "true", isHidden: true }, // Empty string is valid? Usually.
        { input: "((", expectedOutput: "false", isHidden: true },
        { input: "}}{", expectedOutput: "false", isHidden: true }
    ]
};

const updatedProblems = problems.map(problem => {
    // If specific test cases exist, use them
    if (specificTestCases[problem.title]) {
        return { ...problem, testCases: specificTestCases[problem.title] };
    }

    // Otherwise, generate generic ones based on sample
    // Ensure we have a sample input/output to duplicate
    const sampleInput = problem.sampleInput || "";
    const sampleOutput = problem.sampleOutput || "";

    // If no sample exists, provide a dummy one (shouldn't happen with our dataset)
    if (!sampleInput && !sampleOutput) {
        return {
            ...problem,
            testCases: generateGenericTestCases("test", "test")
        };
    }

    return {
        ...problem,
        testCases: generateGenericTestCases(sampleInput, sampleOutput)
    };
});

fs.writeFileSync(problemsPath, JSON.stringify(updatedProblems, null, 2));
console.log(`Updated ${updatedProblems.length} problems with test cases.`);
