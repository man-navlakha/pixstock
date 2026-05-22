#!/usr/bin/env node
const http = require('http');

// Helper to make HTTP POST/GET requests
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
  console.log('===========================================');
  console.log('TEMPLATE RENDER API - HTTP CONTRACT TESTS');
  console.log('===========================================\n');

  const endpoint = '/api/tamplates/profile/developer/ocean/render';

  // Test 1: Empty object body
  console.log('───────────────────────────────────────────');
  console.log('TEST 1: Empty JSON object {}');
  console.log('───────────────────────────────────────────');
  console.log('Request: POST', endpoint);
  console.log('Body:', JSON.stringify({}));
  try {
    const result = await makeRequest('POST', endpoint, {});
    console.log('Status:', result.status);
    console.log('Response Body:', result.body);
    console.log();
  } catch (error) {
    console.log('ERROR:', error.message);
    console.log();
  }

  // Test 2: Full template body
  console.log('───────────────────────────────────────────');
  console.log('TEST 2: Full template with all fields');
  console.log('───────────────────────────────────────────');
  const fullBody = {
    name: 'John Developer',
    email: 'john@example.com',
    bio: 'Full-stack developer with ocean passion',
    skills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL'],
    experience: '5 years',
    projects: [
      {
        name: 'Project Alpha',
        description: 'Real-time collaboration',
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
  console.log('Request: POST', endpoint);
  console.log('Body: (', Object.keys(fullBody).length, 'fields )');
  console.log('  -', Object.keys(fullBody).join(', '));
  try {
    const result = await makeRequest('POST', endpoint, fullBody);
    console.log('Status:', result.status);
    console.log('Response Body:', result.body.substring(0, 500));
    if (result.body.length > 500) console.log('  ... (truncated)');
    console.log();
  } catch (error) {
    console.log('ERROR:', error.message);
    console.log();
  }

  // Test 3: Minimal fields only
  console.log('───────────────────────────────────────────');
  console.log('TEST 3: Minimal fields (name + email)');
  console.log('───────────────────────────────────────────');
  const minimalBody = {
    name: 'Developer',
    email: 'dev@example.com',
  };
  console.log('Request: POST', endpoint);
  console.log('Body:', JSON.stringify(minimalBody));
  try {
    const result = await makeRequest('POST', endpoint, minimalBody);
    console.log('Status:', result.status);
    console.log('Response Body:', result.body);
    console.log();
  } catch (error) {
    console.log('ERROR:', error.message);
    console.log();
  }

  // Test 4: Array instead of object (wrong shape)
  console.log('───────────────────────────────────────────');
  console.log('TEST 4: Array instead of object (wrong shape)');
  console.log('───────────────────────────────────────────');
  const arrayBody = ['developer', 'ocean', 'profile'];
  console.log('Request: POST', endpoint);
  console.log('Body:', JSON.stringify(arrayBody));
  try {
    const result = await makeRequest('POST', endpoint, arrayBody);
    console.log('Status:', result.status);
    console.log('Response Body:', result.body);
    console.log();
  } catch (error) {
    console.log('ERROR:', error.message);
    console.log();
  }

  // Test 5: GET request (should proxy to upstream)
  console.log('───────────────────────────────────────────');
  console.log('TEST 5: GET request (no body)');
  console.log('───────────────────────────────────────────');
  console.log('Request: GET', endpoint);
  try {
    const result = await makeRequest('GET', endpoint, null);
    console.log('Status:', result.status);
    console.log('Response Body:', result.body.substring(0, 500));
    if (result.body.length > 500) console.log('  ... (truncated)');
    console.log();
  } catch (error) {
    console.log('ERROR:', error.message);
    console.log();
  }

  console.log('===========================================');
  console.log('END OF TESTS');
  console.log('===========================================');
  process.exit(0);
}

// Run with timeout
const timeout = setTimeout(() => {
  console.error('Tests timed out after 30 seconds');
  process.exit(1);
}, 30000);

runTests().catch(err => {
  clearTimeout(timeout);
  console.error('Fatal error:', err);
  process.exit(1);
}).finally(() => {
  clearTimeout(timeout);
});
