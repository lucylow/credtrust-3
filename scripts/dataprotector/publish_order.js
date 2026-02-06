// scripts/dataprotector/publish_order.js
// Node script: read the local data/orders.json and POST to a marketplace endpoint (example)
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function main() {
  const ordersFile = './data/orders.json';
  if (!fs.existsSync(ordersFile)) {
    console.error('No orders file found.');
    process.exit(1);
  }
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  const server = process.env.MARKETPLACE_URL || 'http://localhost:4000';
  for (const o of orders) {
    const resp = await fetch(`${server}/api/marketplace/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(o)
    });
    console.log('Published order', o.id, '->', resp.status);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
