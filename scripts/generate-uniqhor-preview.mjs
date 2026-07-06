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
  title: 'Carbon,<br/>accounted for.',
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
        category: 'Renewable Energy · Mexico',
        shortDescription:
          'Renewable electricity generation in Mexico through the construction and operation of a 220 MW wind farm.',
        thumbImage: [asset('eco-wind2.jpg')],
      },
      certificate: {
        certificateURL: 'https://example.com/cert/100000002043',
      },
    },
    {
      originNumber: '100000002044',
      createdAt: '2026-06-14T10:00:00.000Z',
      quantity: 3,
      product: {
        name: 'Amazon Reforestation',
        category: 'Nature Based · Brazil',
        shortDescription:
          'Native species reforestation across degraded pastureland in the Brazilian Amazon basin.',
        thumbImage: [asset('eco-hero.jpg')],
      },
      certificate: {
        certificateURL: 'https://example.com/cert/100000002044',
      },
    },
    {
      originNumber: '100000002045',
      createdAt: '2026-05-22T10:00:00.000Z',
      quantity: 2,
      product: {
        name: 'Ocean Plastic Recovery',
        category: 'Marine · Pacific',
        shortDescription:
          'Coastal cleanup and marine plastic recovery operations across the Eastern Pacific.',
        thumbImage: [asset('eco-ocean.jpg')],
      },
      certificate: {
        certificateURL: 'https://example.com/cert/100000002045',
      },
    },
    {
      originNumber: '100000002046',
      createdAt: '2026-04-08T10:00:00.000Z',
      quantity: 5,
      product: {
        name: 'Methane Capture',
        category: 'Engineered Removal',
        shortDescription:
          'Engineered methane capture and destruction at industrial waste facilities.',
        thumbImage: [asset('eco-methane.jpg')],
      },
      certificate: {
        certificateURL: 'https://example.com/cert/100000002046',
      },
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
