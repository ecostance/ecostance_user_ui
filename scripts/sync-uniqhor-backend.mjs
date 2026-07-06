/**
 * Syncs uniqhorTemplate.js to backend sustainabilityTemplates/uniqhor.js
 * Run: node scripts/sync-uniqhor-backend.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendPath = join(
  __dirname,
  '../src/components/businessSustainabilityPage/uniqhorTemplate.js'
);
const backendPath =
  'C:/Users/ramma/Desktop/Projects/Backend/ecostance_api/api/templates/sustainabilityTemplates/uniqhor.js';

let content = readFileSync(frontendPath, 'utf8');
content = content.replace('export const uniqhorTemplate', 'export const uniqhor');
content = content.replace(
  "const uiUrl = dynamic?.UI_URL || '';",
  "const uiUrl = dynamic?.UI_URL || dynamic?.homePageURL || dynamic?.companyURL || '';"
);

writeFileSync(backendPath, content, 'utf8');
console.log(`Synced to ${backendPath} (${content.length} bytes)`);
