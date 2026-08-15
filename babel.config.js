const fs = require('fs');
const path = require('path');

const ENV_KEYS = [
  'WALLETCONNECT_PROJECT_ID',
  'EXPLAIN_PROVIDER',
  'EXPLAIN_API_URL',
  'EXPLAIN_API_KEY',
  'DEMO_SIGNER_KEY',
  'DEMO_SIGNER_RPC',
];

function loadDotEnv() {
  const file = path.join(__dirname, '.env');
  if (!fs.existsSync(file)) {
    return;
  }
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const eq = line.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = line.slice(0, eq).trim();
    if (!ENV_KEYS.includes(key) || process.env[key]) {
      continue;
    }
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadDotEnv();

function inlineEnv() {
  const keys = new Set(ENV_KEYS);
  return {
    visitor: {
      MemberExpression(p) {
        if (!p.get('object').matchesPattern('process.env')) {
          return;
        }
        const prop = p.get('property');
        const key = prop.isIdentifier()
          ? prop.node.name
          : prop.isStringLiteral()
            ? prop.node.value
            : null;
        if (!key || !keys.has(key)) {
          return;
        }
        p.replaceWith({
          type: 'StringLiteral',
          value: process.env[key] ?? '',
        });
      },
    },
  };
}

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: process.env.JEST_WORKER_ID ? [] : [inlineEnv],
};
