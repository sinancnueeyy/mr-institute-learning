const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/repositories/operations');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const repos = [
  { name: 'applicationsRepository', type: 'Application', col: 'applications' },
  { name: 'studentsRepository', type: 'Student', col: 'students' },
  { name: 'enquiriesRepository', type: 'Enquiry', col: 'enquiries' },
  { name: 'scholarshipsRepository', type: 'ScholarshipApplication', col: 'scholarships' },
  { name: 'charityRepository', type: 'CharityApplication', col: 'charityApplications' },
  { name: 'notificationsRepository', type: 'Notification', col: 'notifications' },
  { name: 'followUpsRepository', type: 'FollowUpRecord', col: 'followUps' },
];

let indexContent = '';

repos.forEach(repo => {
  const content = `import { BaseRepository } from '../BaseRepository';
import type { ${repo.type} } from '../../types/operations';

class ${repo.name.charAt(0).toUpperCase() + repo.name.slice(1)} extends BaseRepository<${repo.type}> {
  constructor() {
    super('${repo.col}');
  }
}

export const ${repo.name} = new ${repo.name.charAt(0).toUpperCase() + repo.name.slice(1)}();
`;

  fs.writeFileSync(path.join(dir, `${repo.name}.ts`), content);
  indexContent += `export * from './${repo.name}';\n`;
});

fs.writeFileSync(path.join(dir, 'index.ts'), indexContent);

console.log('Operational repositories created.');
