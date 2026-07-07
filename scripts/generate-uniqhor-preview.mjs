/**
 * Generates a standalone HTML preview for uniqhorTemplate.js
 * Run: node scripts/generate-uniqhor-preview.mjs
 *
 * Open the output:
 *   - With Next dev:  http://localhost:3000/uniqhor-preview.html
 *   - Direct file:    public/uniqhor-preview.html (images use relative paths)
 */

import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const templatePath = pathToFileURL(
  join(root, 'src/components/businessSustainabilityPage/uniqhorTemplate.js')
).href;

const { uniqhorTemplate } = await import(templatePath);

const asset = (name) => `./assets/images/sustainability/${name}`;

const sampleDynamic = {
  UI_URL: '.',
  companyName: 'Uniqohr',
  title: 'Carbon,<br/>Accounted For.',
  description:
    'Three decades of environmental expertise. Every tonne measured, retired and verifiable.',
  logo: asset('uniqhor.jpg'),
  aboutUs: '',
  contactPageURL: '#contact',
  showSocial: false,
  certData: [
    {
      originNumber: '100000002043',
      createdAt: '2026-07-01T10:00:00.000Z',
      quantity: 1,
      product: {
        name: 'Piedra Wind Farm',
        shortDescription: 'Utility-scale wind farm displacing fossil-fuel electricity on the Mexican national grid.',
        thumbImage: [asset('eco-wind2.jpg')],
      },
      certificate: { certificateURL: 'https://example.com/cert/100000002043' },
    },
    {
      originNumber: '100000002044',
      createdAt: '2026-07-01T10:00:00.000Z',
      quantity: 2,
      product: {
        name: 'Coastal Plastic Recovery',
        shortDescription: 'Removes ocean-bound plastic from coastal waterways and funds local collector livelihoods.',
        thumbImage: [asset('eco-ocean.jpg')],
      },
      certificate: { certificateURL: 'https://example.com/cert/100000002044' },
    },
    {
      originNumber: '100000002045',
      createdAt: '2026-07-01T10:00:00.000Z',
      quantity: 3,
      product: {
        name: 'Atlantic Reforestation',
        shortDescription: 'Native-species planting that restores degraded Atlantic Forest and rebuilds habitat corridors.',
        thumbImage: [asset('eco-sapling.jpg')],
      },
      certificate: { certificateURL: 'https://example.com/cert/100000002045' },
    },
    {
      originNumber: '100000002046',
      createdAt: '2026-07-01T10:00:00.000Z',
      quantity: 2,
      product: {
        name: 'Rajasthan Solar Array',
        shortDescription: 'Grid-connected solar generation displacing coal-fired power across northern India.',
        thumbImage: [asset('eco-wind2.jpg')],
      },
      certificate: { certificateURL: 'https://example.com/cert/100000002046' },
    },
    {
      originNumber: '100000002047',
      createdAt: '2026-07-01T10:00:00.000Z',
      quantity: 4,
      product: {
        name: 'Sundarbans Mangrove Restoration',
        shortDescription: 'Community-led mangrove replanting that sequesters blue carbon and protects coastal villages.',
        thumbImage: [asset('eco-hero.jpg')],
      },
      certificate: { certificateURL: 'https://example.com/cert/100000002047' },
    },
    {
      originNumber: '100000002048',
      createdAt: '2026-07-01T10:00:00.000Z',
      quantity: 1,
      product: {
        name: 'Efficient Cookstoves Programme',
        shortDescription: 'High-efficiency cookstoves that cut wood use, indoor smoke, and household carbon footprints.',
        thumbImage: [asset('eco-methane.jpg')],
      },
      certificate: { certificateURL: 'https://example.com/cert/100000002048' },
    },
  ],
  dppProducts: [
    {
      isPublic: true,
      name: 'Wind Energy Project',
      slug: 'wind-energy-project',
      businessSlugName: 'uniqohr',
      published: {
        formalName: 'Wind Energy Project',
        Category: 'Renewable Energy',
        shortDescription: 'Utility-scale wind generation with verified chain of custody.',
        productImages: [asset('eco-wind2.jpg')],
      },
    },
    {
      isPublic: true,
      name: 'Reforestation Initiative',
      slug: 'reforestation-initiative',
      businessSlugName: 'uniqohr',
      published: {
        formalName: 'Reforestation Initiative',
        Category: 'Nature Based',
        shortDescription: 'Native sapling planting with full supply chain traceability.',
        productImages: [asset('eco-sapling.jpg')],
      },
    },
    {
      isPublic: true,
      name: 'Merino Base Layer',
      slug: 'merino-base-layer',
      businessSlugName: 'uniqohr',
      published: {
        formalName: 'Merino Base Layer',
        Category: 'Base Layers',
        shortDescription: 'RWS-certified merino with environmental reporting via Ecostance.',
        productImages: [asset('eco-founder.jpg')],
      },
    },
    {
      isPublic: true,
      name: 'Forest Conservation',
      slug: 'forest-conservation',
      businessSlugName: 'uniqohr',
      published: {
        formalName: 'Forest Conservation',
        Category: 'Nature Based',
        shortDescription: 'Protected boreal forest with documented carbon outcomes.',
        productImages: [asset('eco-hero.jpg')],
      },
    },
  ],
};

const html = uniqhorTemplate(sampleDynamic);
const outPath = join(root, 'public/uniqhor-preview.html');

writeFileSync(outPath, html, 'utf8');
console.log(`Preview written to: ${outPath}`);
console.log('Open via Next dev: http://localhost:3000/uniqhor-preview.html');
console.log('Or open the file directly from public/uniqhor-preview.html');
