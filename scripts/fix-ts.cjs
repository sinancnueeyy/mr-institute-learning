const fs = require('fs');
const path = require('path');

const pages = [
  'DeveloperHomepage', 'DeveloperAbout', 'DeveloperCourses', 
  'DeveloperServices', 'DeveloperCharity', 'DeveloperGallery', 
  'DeveloperForms', 'DeveloperMedia'
];

const dir = path.join(__dirname, 'src/pages/developer');

pages.forEach(p => {
  const filePath = path.join(dir, `${p}.tsx`);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove CardTitle from import
  content = content.replace(/CardTitle, /g, '');
  
  // Change const [data, setData] to const [data]
  content = content.replace(/const \[data, setData\] = useState/g, 'const [data] = useState');
  
  if (p === 'DeveloperMedia') {
    // Remove Badge import
    content = content.replace(/import { Badge } from '\.\.\/\.\.\/components\/ui\/Badge';\r?\n/g, '');
  }
  
  fs.writeFileSync(filePath, content);
});

console.log('Fixed TS errors.');
