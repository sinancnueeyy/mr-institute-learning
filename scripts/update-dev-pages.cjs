const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'DeveloperHomepage', type: 'HomepageContent', repo: 'homepageRepository' },
  { name: 'DeveloperAbout', type: 'AboutContent', repo: 'aboutRepository' },
  { name: 'DeveloperCourses', type: 'CourseContent', repo: 'coursesRepository' },
  { name: 'DeveloperServices', type: 'ServiceContent', repo: 'servicesRepository' },
  { name: 'DeveloperCharity', type: 'CharityContent', repo: 'charityRepository' },
  { name: 'DeveloperGallery', type: 'GalleryContent', repo: 'galleryRepository' },
  { name: 'DeveloperForms', type: 'FormSchema', repo: 'formsRepository' },
  { name: 'DeveloperMedia', type: 'MediaAsset', repo: 'mediaRepository' },
];

const dir = path.join(__dirname, 'src/pages/developer');

pages.forEach(p => {
  const filePath = path.join(dir, `${p.name}.tsx`);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Add React useEffect to import if missing
  if (!content.includes('useEffect')) {
    content = content.replace(/import { useState } from 'react';/, "import { useState, useEffect } from 'react';");
  }
  
  // Add repository import
  if (!content.includes(p.repo)) {
    content = content.replace(
      `import { type ${p.type} } from '../../types/cms';`, 
      `import { type ${p.type} } from '../../types/cms';\nimport { ${p.repo} } from '../../repositories/cms';`
    );
  }

  // Add loading state
  if (!content.includes('isLoading')) {
    content = content.replace(
      `  const [searchQuery, setSearchQuery] = useState('');`,
      `  const [searchQuery, setSearchQuery] = useState('');\n  const [isLoading, setIsLoading] = useState(true);`
    );
  }

  // Replace data mock with useEffect
  const regex = new RegExp(`const \\[data\\] = useState<${p.type}\\[\\]>\\(\\[\\]\\);`);
  content = content.replace(regex, `const [data, setData] = useState<${p.type}[]>([]);\n\n  useEffect(() => {\n    const unsubscribe = ${p.repo}.listenAll((docs) => {\n      setData(docs);\n      setIsLoading(false);\n    });\n    return () => unsubscribe();\n  }, []);`);
  
  // Update DataTable props to include isLoading
  content = content.replace(
    /emptyMessage="([^"]+)"/,
    `emptyMessage="$1"\n            isLoading={isLoading}`
  );

  // Implement simple delete
  content = content.replace(
    `className="text-error border-error/20 hover:bg-error/10"><Trash2`,
    `className="text-error border-error/20 hover:bg-error/10" onClick={() => ${p.repo}.delete(item.id as string)}><Trash2`
  );
  
  // For the edit, we need 'item' in the scope of cell render
  content = content.replace(
    `cell: () => (`,
    `cell: (item) => (`
  );

  fs.writeFileSync(filePath, content);
});

console.log('Firebase integrated into Developer pages.');
