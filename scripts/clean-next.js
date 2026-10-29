const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');

try {
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
  }
} catch (err) {
  // Non-fatal if locked temporarily
}

