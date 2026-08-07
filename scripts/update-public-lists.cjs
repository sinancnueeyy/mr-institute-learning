const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');

// Courses.tsx
let coursesPath = path.join(dir, 'Courses.tsx');
let coursesContent = fs.readFileSync(coursesPath, 'utf-8');
coursesContent = coursesContent.replace(
  `import { mockCourses } from '../data/mockData';`,
  `import { useState, useEffect } from 'react';\nimport { coursesRepository } from '../repositories/cms';\nimport { type CourseContent } from '../types/cms';`
);
coursesContent = coursesContent.replace(
  `export default function Courses() {`,
  `export default function Courses() {\n  const [courses, setCourses] = useState<CourseContent[]>([]);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    const fetch = async () => {\n      const res = await coursesRepository.query([{ field: 'isActive', operator: '==', value: true }]);\n      if(res.data) setCourses(res.data);\n      setIsLoading(false);\n    };\n    fetch();\n  }, []);`
);
coursesContent = coursesContent.replace(/mockCourses/g, 'courses');
fs.writeFileSync(coursesPath, coursesContent);

// CourseDetails.tsx
let detailsPath = path.join(dir, 'CourseDetails.tsx');
let detailsContent = fs.readFileSync(detailsPath, 'utf-8');
detailsContent = detailsContent.replace(
  `import { mockCourses } from '../data/mockData';`,
  `import { useState, useEffect } from 'react';\nimport { coursesRepository } from '../repositories/cms';\nimport { type CourseContent } from '../types/cms';`
);
detailsContent = detailsContent.replace(
  `  const course = mockCourses.find(c => c.id === courseId);`,
  `  const [course, setCourse] = useState<CourseContent | null>(null);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    const fetch = async () => {\n      if(courseId) {\n        const res = await coursesRepository.getById(courseId);\n        if(res.data) setCourse(res.data);\n      }\n      setIsLoading(false);\n    };\n    fetch();\n  }, [courseId]);`
);
detailsContent = detailsContent.replace(
  `if (!course)`,
  `if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;\n  if (!course)`
);
fs.writeFileSync(detailsPath, detailsContent);

// Services.tsx
let servicesPath = path.join(dir, 'Services.tsx');
let servicesContent = fs.readFileSync(servicesPath, 'utf-8');
servicesContent = servicesContent.replace(
  `import { mockServices } from '../data/mockData';`,
  `import { useState, useEffect } from 'react';\nimport { servicesRepository } from '../repositories/cms';\nimport { type ServiceContent } from '../types/cms';`
);
servicesContent = servicesContent.replace(
  `export default function Services() {`,
  `export default function Services() {\n  const [services, setServices] = useState<ServiceContent[]>([]);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    const fetch = async () => {\n      const res = await servicesRepository.query([{ field: 'isActive', operator: '==', value: true }]);\n      if(res.data) setServices(res.data);\n      setIsLoading(false);\n    };\n    fetch();\n  }, []);`
);
servicesContent = servicesContent.replace(/mockServices/g, 'services');
fs.writeFileSync(servicesPath, servicesContent);

// Charity.tsx
let charityPath = path.join(dir, 'Charity.tsx');
let charityContent = fs.readFileSync(charityPath, 'utf-8');
charityContent = charityContent.replace(
  `import { mockCharity } from '../data/mockData';`,
  `import { useState, useEffect } from 'react';\nimport { charityRepository } from '../repositories/cms';\nimport { type CharityContent } from '../types/cms';`
);
charityContent = charityContent.replace(
  `export default function Charity() {`,
  `export default function Charity() {\n  const [charityPrograms, setCharityPrograms] = useState<CharityContent[]>([]);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    const fetch = async () => {\n      const res = await charityRepository.query([{ field: 'isActive', operator: '==', value: true }]);\n      if(res.data) setCharityPrograms(res.data);\n      setIsLoading(false);\n    };\n    fetch();\n  }, []);`
);
charityContent = charityContent.replace(/mockCharity/g, 'charityPrograms');
fs.writeFileSync(charityPath, charityContent);

// Gallery.tsx
let galleryPath = path.join(dir, 'Gallery.tsx');
let galleryContent = fs.readFileSync(galleryPath, 'utf-8');
galleryContent = galleryContent.replace(
  `import { mockGallery } from '../data/mockData';`,
  `import { useState, useEffect } from 'react';\nimport { galleryRepository } from '../repositories/cms';\nimport { type GalleryContent } from '../types/cms';`
);
galleryContent = galleryContent.replace(
  `export default function Gallery() {\n  const [activeTab, setActiveTab] = useState('All');`,
  `export default function Gallery() {\n  const [activeTab, setActiveTab] = useState('All');\n  const [gallery, setGallery] = useState<GalleryContent[]>([]);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    const fetch = async () => {\n      const res = await galleryRepository.query([{ field: 'isActive', operator: '==', value: true }]);\n      if(res.data) setGallery(res.data);\n      setIsLoading(false);\n    };\n    fetch();\n  }, []);`
);
galleryContent = galleryContent.replace(/mockGallery/g, 'gallery');
fs.writeFileSync(galleryPath, galleryContent);

console.log('Public pages converted.');
