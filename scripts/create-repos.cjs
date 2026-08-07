const fs = require('fs');
const path = require('path');

const types = [
  { name: 'homepageRepository', type: 'HomepageContent' },
  { name: 'aboutRepository', type: 'AboutContent' },
  { name: 'coursesRepository', type: 'CourseContent' },
  { name: 'servicesRepository', type: 'ServiceContent' },
  { name: 'charityRepository', type: 'CharityContent' },
  { name: 'galleryRepository', type: 'GalleryContent' },
  { name: 'formsRepository', type: 'FormSchema' },
  { name: 'mediaRepository', type: 'MediaAsset' },
];

const dir = path.join(__dirname, 'src/repositories/cms');

types.forEach(t => {
  const content = `import { BaseRepository } from '../BaseRepository';
import { type ${t.type} } from '../../types/cms';

class ${t.name.charAt(0).toUpperCase() + t.name.slice(1)} extends BaseRepository<${t.type}> {
  constructor() {
    super('cms_${t.type.toLowerCase()}');
  }
}

export const ${t.name} = new ${t.name.charAt(0).toUpperCase() + t.name.slice(1)}();
`;
  fs.writeFileSync(path.join(dir, `${t.name}.ts`), content);
});

// Also create an index.ts file for easy exports
const indexContent = types.map(t => `export * from './${t.name}';`).join('\n');
fs.writeFileSync(path.join(dir, 'index.ts'), indexContent);
console.log('Repositories created successfully.');
