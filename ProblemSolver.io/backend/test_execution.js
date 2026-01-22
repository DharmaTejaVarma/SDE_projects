async function testExecution() {
  try {
    console.log('Testing Python execution...');

    const response = await fetch('http://localhost:5000/api/submissions/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: '1',
        code: 'print("Hello World")',
        language: 'python'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testExecution();