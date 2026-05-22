const http = require('http');

// Helper to make HTTP POST requests
function makeRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3102,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== Template Render API Tests ===\n');

  const endpoint = '/api/tamplates/profile/developer/ocean/render';

  // Test 1: Minimal empty JSON body
  console.log('TEST 1: POST with minimal empty JSON body');
  console.log(`Endpoint: ${endpoint}`);
  try {
    const result1 = await makeRequest('POST', endpoint, {});
    console.log(`Status: ${result1.status}`);
    console.log(`Response:`, result1.body);
    console.log();
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Test 2: With plausible template values
  console.log('TEST 2: POST with filled template fields');
  console.log(`Endpoint: ${endpoint}`);
  const testBody = {
    name: 'John Developer',
    email: 'john@example.com',
    bio: 'Full-stack developer passionate about Node.js and React',
    skills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL'],
    experience: '5 years',
    projects: [
      {
        name: 'Project Alpha',
        description: 'Real-time collaboration tool',
        link: 'https://github.com/example/alpha',
      },
    ],
    social: {
      github: 'https://github.com/john',
      linkedin: 'https://linkedin.com/in/john',
      twitter: 'https://twitter.com/john',
    },
    theme: 'ocean',
  };
  try {
    const result2 = await makeRequest('POST', endpoint, testBody);
    console.log(`Status: ${result2.status}`);
    console.log(`Response:`, result2.body);
    console.log();
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Test 3: With minimal required fields only
  console.log('TEST 3: POST with minimal required-looking fields');
  console.log(`Endpoint: ${endpoint}`);
  const minimalBody = {
    name: 'Developer',
    email: 'dev@example.com',
  };
  try {
    const result3 = await makeRequest('POST', endpoint, minimalBody);
    console.log(`Status: ${result3.status}`);
    console.log(`Response:`, result3.body);
    console.log();
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Test 4: Invalid JSON shape - missing top-level properties
  console.log('TEST 4: POST with array body (wrong shape)');
  console.log(`Endpoint: ${endpoint}`);
  try {
    const result4 = await makeRequest('POST', endpoint, ['item1', 'item2']);
    console.log(`Status: ${result4.status}`);
    console.log(`Response:`, result4.body);
    console.log();
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Test 5: GET request to same endpoint
  console.log('TEST 5: GET request to endpoint');
  try {
    const result5 = await makeRequest('GET', endpoint, null);
    console.log(`Status: ${result5.status}`);
    console.log(`Response:`, result5.body);
    console.log();
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  console.log('=== Tests Complete ===');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
