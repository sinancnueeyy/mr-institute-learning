const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/Home.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Add React hooks
content = content.replace(
  `import { mockCourses, mockTestimonials, mockGallery } from '../data/mockData';`,
  `import { useState, useEffect } from 'react';\nimport { mockTestimonials } from '../data/mockData';\nimport { coursesRepository, galleryRepository } from '../repositories/cms';\nimport { type CourseContent, type GalleryContent } from '../types/cms';`
);

// Update component body
const targetStr = `  const featuredCourses = mockCourses.slice(0, 3);\n  const featuredGallery = mockGallery.slice(0, 4);`;

const replacement = `  const [featuredCourses, setFeaturedCourses] = useState<CourseContent[]>([]);
  const [featuredGallery, setFeaturedGallery] = useState<GalleryContent[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      // In production, these should be queries with limits, but getAll works for now.
      const coursesRes = await coursesRepository.query([{ field: 'isActive', operator: '==', value: true }], { limit: 3 });
      if (coursesRes.data) setFeaturedCourses(coursesRes.data);

      const galleryRes = await galleryRepository.query([{ field: 'isActive', operator: '==', value: true }], { limit: 4 });
      if (galleryRes.data) setFeaturedGallery(galleryRes.data);
    };
    fetchHomeData();
  }, []);`;

content = content.replace(targetStr, replacement);
fs.writeFileSync(filePath, content);
console.log('Home.tsx updated.');
