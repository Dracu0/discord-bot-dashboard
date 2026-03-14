const fs = require('fs');
const path = require('path');

const { CONFIG_SCHEMA_VERSION, FEATURE_CONTRACT } = require('../src/config/configContract');

const contractPath = path.resolve(__dirname, '../../docs/contracts/dashboard-bot-config-contract.v1.json');
const raw = fs.readFileSync(contractPath, 'utf8');
const parsed = JSON.parse(raw);

function sortObject(obj) {
  return Object.keys(obj).sort().reduce((acc, key) => {
    const value = obj[key];
    acc[key] = Array.isArray(value) ? [...value] : value;
    return acc;
  }, {});
}

if (parsed.version !== CONFIG_SCHEMA_VERSION) {
  console.error(`Contract version mismatch: docs=${parsed.version} code=${CONFIG_SCHEMA_VERSION}`);
  process.exit(1);
}

const docsFeatures = sortObject(parsed.features || {});
const codeFeatures = sortObject(FEATURE_CONTRACT || {});

if (JSON.stringify(docsFeatures) !== JSON.stringify(codeFeatures)) {
  console.error('Feature contract mismatch between docs artifact and server code.');
  process.exit(1);
}

console.log('Contract sync check passed.');
