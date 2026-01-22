const codeExecutor = require('./services/CodeExecutor');

async function testDirect() {
  console.log('Testing direct CodeExecutor...');

  try {
    const result = await codeExecutor.execute('print("Hello World")', 'python');
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testDirect();