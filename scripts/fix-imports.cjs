const fs = require('fs');
const path = require('path');

const filesToClean = [
  'src/components/public/CourseCard.tsx',
  'src/components/public/GalleryCard.tsx',
  'src/components/public/HeroSection.tsx',
  'src/components/public/StatCard.tsx',
  'src/components/public/TestimonialCard.tsx',
  'src/pages/About.tsx',
  'src/pages/Charity.tsx',
  'src/pages/Contact.tsx',
  'src/pages/CourseDetails.tsx',
  'src/pages/Courses.tsx',
  'src/pages/Gallery.tsx',
  'src/pages/Home.tsx',
  'src/pages/Services.tsx'
];

filesToClean.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    content = content.replace(/^import React,?.*from 'react';\r?\n/m, '');
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`Cleaned ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
