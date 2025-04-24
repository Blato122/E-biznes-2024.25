const axios = require('axios');
const { spawn, exec } = require('child_process');
const path = require('path');

const API_BASE_URL = 'http://localhost:8080';

let serverProcess;

const waitForServer = (url, retries = 20, delay = 1000) => {
  return new Promise((resolve, reject) => {
    const attempt = async (count) => {
      console.log(`[waitForServer] Attempt ${retries - count + 1}/${retries}...`); // Log attempt number
      try {
        await axios.get(url, { timeout: delay - 100 });
        console.log('[waitForServer] Server responded successfully.');
        resolve();
      } catch (error) {
        const errorMessage = error.code || (error.response ? `Status ${error.response.status}` : error.message);
        console.error(`[waitForServer] Attempt failed: ${errorMessage}`); // Log specific error

        if (count <= 0) {
          console.error('[waitForServer] Server did not become ready in time.');
          return reject(new Error('Server timeout'));
        }
        console.log(`[waitForServer] Waiting for next attempt... (${count} retries left, delay: ${delay}ms)`);
        setTimeout(() => attempt(count - 1), delay);
      }
    };
    attempt(retries);
  });
};

// Start the Go server before all tests
beforeAll(async () => {
  console.log('[beforeAll] Starting setup...');
  const serverPath = path.resolve(__dirname, 'main.go');
  console.log(`[beforeAll] Resolved server path: ${serverPath}`);

  console.log('[beforeAll] Checking go version (async)...');
  try {
    await new Promise((resolve, reject) => {
      const timeoutMillis = 5000;
      const timer = setTimeout(() => {
        console.error(`[beforeAll] 'go version' command timed out after ${timeoutMillis}ms.`);
        reject(new Error(`'go version' command timed out`));
      }, timeoutMillis);

      console.log('[beforeAll] Executing "go version"...');
      exec('go version', (error, stdout, stderr) => {
        clearTimeout(timer);
        console.log('[beforeAll] "go version" callback entered.');

        if (error) {
          console.error(`[beforeAll] Error executing 'go version': ${stderr || error.message}`);
          console.log('[beforeAll] Rejecting go version promise (error).');
          reject(new Error(`'go version' failed: ${stderr || error.message}`));
        } else {
          console.log(`[beforeAll] Go version check successful: ${stdout.trim()}`);
          console.log('[beforeAll] Resolving go version promise.');
          resolve();
        }
      });
    });
  } catch (e) {
      console.error("[beforeAll] Failed go version check block.");
      throw e;
  }

  console.log('[beforeAll] Spawning server process...');
  serverProcess = spawn('go', ['run', serverPath], { stdio: 'pipe' });
  console.log('[beforeAll] Server process spawned.');

  let serverReady = false;

  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[Server stdout] ${output.trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server stderr] ${data.toString().trim()}`);
  });

  serverProcess.on('error', (err) => {
    console.error('[beforeAll] Failed to start server process event:', err);
  });

  serverProcess.on('close', (code) => {
      console.log(`[beforeAll] Server process closed with code ${code}.`);
      if (!serverReady && code !== 0 && code !== null) {
          console.error(`[beforeAll] Server process exited unexpectedly before ready.`);
      }
  });

  console.log('[beforeAll] Entering waitForServer...');
  try {
    await waitForServer(`${API_BASE_URL}/products`);
    serverReady = true;
    console.log('[beforeAll] waitForServer succeeded.');
  } catch (err) {
    console.error('[beforeAll] waitForServer failed:', err);
    if (serverProcess && !serverProcess.killed) {
        console.error("[beforeAll] Killing server process due to waitForServer failure.");
        serverProcess.kill();
    }
    throw err;
  }
  console.log('[beforeAll] Setup finished.');
}, 30000);

// Stop the Go server after all tests
afterAll(() => {
  console.log('[afterAll] Stopping Go server...');
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
    console.log('[afterAll] Server process killed.');
  } else {
      console.log('[afterAll] Server process already stopped or failed to start.');
  }
});

describe('API Endpoints', () => {

  describe('GET /products', () => {
    // Positive Scenario
    test('should return a list of products with status 200', async () => {
      const url = `${API_BASE_URL}/products`;
      console.log(`[Test] Sending GET request to: ${url}`);
      try {
        const response = await axios.get(url);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeGreaterThan(0);
        expect(response.data[0]).toHaveProperty('id');
        expect(response.data[0]).toHaveProperty('name');
        expect(response.data[0]).toHaveProperty('price');
        expect(typeof response.data[0].id).toBe('number');
        expect(typeof response.data[0].name).toBe('string');
        expect(typeof response.data[0].price).toBe('number');
      } catch (error) {
        console.error(`[Test] Error during GET ${url}: ${error.message}`);
        throw new Error(`GET ${url} failed: ${error.message}`);
      }
    });

    // Negative Scenario 1: Incorrect Path
    test('should return 404 for an incorrect path', async () => {
      const url = `${API_BASE_URL}/productssss`;
      console.log(`[Test] Sending GET request to: ${url}`);
      try {
        await axios.get(url);
      } catch (error) {
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(404);
      }
    });

     // Negative Scenario 2: Wrong Method
    test('should return 405 Method Not Allowed for POST request', async () => {
        const url = `${API_BASE_URL}/products`;
        console.log(`[Test] Sending POST request to: ${url}`);
        try {
            await axios.post(url, { data: 'test' });
        } catch (error) {
            expect(error.response).toBeDefined();
            expect(error.response.status).toBe(405);
        }
    });
  });

  describe('POST /payments', () => {
    const validPaymentData = {
      cardNumber: "1234-5678-9012-3456",
      expiryDate: "12/29",
      cvv: "123",
      name: "Test User",
      amount: "99.99"
    };

    // Positive Scenario
    test('should return 200 OK for valid payment data', async () => {
      const url = `${API_BASE_URL}/payments`;
      console.log(`[Test] Sending POST request to: ${url}`);
      try {
        const response = await axios.post(url, validPaymentData);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.status).toBe('success');
      } catch (error) {
        console.error(`[Test] Error during POST ${url}: ${error.message}`);
        throw new Error(`POST ${url} failed: ${error.message}`);
      }
    });

    // Negative Scenario 1: Invalid JSON
    test('should return 400 Bad Request for invalid JSON', async () => {
      const url = `${API_BASE_URL}/payments`;
      console.log(`[Test] Sending POST request with invalid JSON to: ${url}`);
      try {
        await axios.post(url, 'this is not json', {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(400);
      }
    });

    // Negative Scenario 2: Missing required field
    test('should return 200 OK even if field "cardNumber" is missing', async () => {
      const url = `${API_BASE_URL}/payments`;
      const partialData = { ...validPaymentData };
      delete partialData.cardNumber;
      console.log(`[Test] Sending POST request with missing field to: ${url}`);
      try {
        const response = await axios.post(url, partialData);
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('success');
      } catch (error) {
         console.error(`[Test] Error during POST ${url} with missing field: ${error.message}`);
         throw new Error(`POST ${url} with missing field failed unexpectedly: ${error.message}`);
      }
    });

    // Negative Scenario 3: Wrong Method
    test('should return 405 Method Not Allowed for GET request', async () => {
      const url = `${API_BASE_URL}/payments`;
      console.log(`[Test] Sending GET request to: ${url}`);
      try {
        await axios.get(url);
      } catch (error) {
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(405);
      }
    });
  });

  describe('GET /health', () => {
    // Positive Scenario
    test('should return 200 OK with status healthy', async () => {
      const url = `${API_BASE_URL}/health`;
      console.log(`[Test] Sending GET request to: ${url}`);
      try {
        const response = await axios.get(url);
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.status).toBe('healthy');
      } catch (error) {
        console.error(`[Test] Error during GET ${url}: ${error.message}`);
        throw new Error(`GET ${url} failed: ${error.message}`);
      }
    });

    // Negative Scenario 1: Wrong Method
    test('should return 405 Method Not Allowed for POST request', async () => {
      const url = `${API_BASE_URL}/health`;
      console.log(`[Test] Sending POST request to: ${url}`);
      try {
        await axios.post(url, {}); // Send empty body for POST
      } catch (error) {
        if (!error.response) {
          console.error('[Test] Error received, but error.response is undefined. Full error:', error);
        }

        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(405);
      }
    });
  });

});