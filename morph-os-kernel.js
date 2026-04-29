#!/usr/bin/env node
const { MorphOrchestrator } = require('./kernel/morph-os-kernel.js');
module.exports = { MorphOrchestrator };
if (require.main === module) {
  const os = new MorphOrchestrator();
  console.log('\n[MORPH-OS] Booted successfully!');
  console.log('[MORPH-OS] Stats:', JSON.stringify(os.getStats(), null, 2));
  os.shutdown();
  process.exit(0);
}
