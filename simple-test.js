const http = require('http');

function makeRequest(method, path, bodyObj) {
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
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: data,
        });
      });
    });

    req.on('error', reject);

    if (bodyObj) {
      req.write(JSON.stringify(bodyObj));
    }
    req.end();
  });
}

async function test() {
  console.log('TEMPLATE RENDER API - HTTP CONTRACT TESTS\n');

  const endpoint = '/api/tamplates/profile/developer/ocean/render';

  try {
    // Test 1
    console.log('=== TEST 1: Empty JSON object ===');
    console.log(`POST ${endpoint}`);
    console.log('Body: {}\n');
    const r1 = await makeRequest('POST', endpoint, {});
    console.log(`STATUS: ${r1.status}`);
    console.log(`RESPONSE: ${r1.body.substring(0, 300)}`);
    console.log('---\n');

    // Test 2
    console.log('=== TEST 2: Full payload with all fields ===');
    console.log(`POST ${endpoint}`);
    const payload2 = {
      name: 'John Developer',
      email: 'john@example.com',
      bio: 'Full-stack developer',
      skills: ['TypeScript', 'Node.js', 'React'],
      experience: '5 years',
      projects: [{name: 'Alpha', description: 'Real-time tool', link: 'https://github.com/example/alpha'}],
      social: {github: 'https://github.com/john', linkedin: 'https://linkedin.com/in/john'},
      theme: 'ocean',
    };
    console.log('Body: (', Object.keys(payload2).length, 'fields )\n');
    const r2 = await makeRequest('POST', endpoint, payload2);
    console.log(`STATUS: ${r2.status}`);
    console.log(`RESPONSE: ${r2.body.substring(0, 300)}`);
    console.log('---\n');

    // Test 3
    console.log('=== TEST 3: Minimal fields (name + email) ===');
    console.log(`POST ${endpoint}`);
    const payload3 = {
      name: 'Developer',
      email: 'dev@example.com',
    };
    console.log('Body:', JSON.stringify(payload3) + '\n');
    const r3 = await makeRequest('POST', endpoint, payload3);
    console.log(`STATUS: ${r3.status}`);
    console.log(`RESPONSE: ${r3.body.substring(0, 300)}`);
    console.log('---\n');

    // Test 4
    console.log('=== TEST 4: Array instead of object (wrong shape) ===');
    console.log(`POST ${endpoint}`);
    const payload4 = ['developer', 'ocean', 'profile'];
    console.log('Body:', JSON.stringify(payload4) + '\n');
    const r4 = await makeRequest('POST', endpoint, payload4);
    console.log(`STATUS: ${r4.status}`);
    console.log(`RESPONSE: ${r4.body.substring(0, 300)}`);
    console.log('---\n');

    // Test 5
    console.log('=== TEST 5: GET request (no body) ===');
    console.log(`GET ${endpoint}\n`);
    const r5 = await makeRequest('GET', endpoint, null);
    console.log(`STATUS: ${r5.status}`);
    console.log(`RESPONSE: ${r5.body.substring(0, 300)}`);
    console.log('---\n');

    console.log('=== ALL TESTS COMPLETE ===');
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

test();
