const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');

// About.tsx
let aboutPath = path.join(dir, 'About.tsx');
let aboutContent = fs.readFileSync(aboutPath, 'utf-8');
aboutContent = aboutContent.replace(
  `import { ROUTES } from '../constants';`,
  `import { ROUTES } from '../constants';\nimport { useState, useEffect } from 'react';\nimport { aboutRepository } from '../repositories/cms';\nimport { type AboutContent } from '../types/cms';`
);
aboutContent = aboutContent.replace(
  `export default function About() {`,
  `export default function About() {\n  const [about, setAbout] = useState<AboutContent | null>(null);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    const fetch = async () => {\n      const res = await aboutRepository.query([{ field: 'isActive', operator: '==', value: true }], { limit: 1 });\n      if(res.data && res.data.length > 0) setAbout(res.data[0]);\n      setIsLoading(false);\n    };\n    fetch();\n  }, []);\n\n  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;\n`
);
// Make About dynamic (simplified for now, falling back to static if null)
aboutContent = aboutContent.replace(
  `MR Institute of Learning was founded with a singular vision: to democratize access to high-quality education. What started as a small academic tuition center has now blossomed into a comprehensive educational hub, serving thousands of students across multiple disciplines.`,
  `{about?.story || 'MR Institute of Learning was founded with a singular vision: to democratize access to high-quality education. What started as a small academic tuition center has now blossomed into a comprehensive educational hub, serving thousands of students across multiple disciplines.'}`
);
fs.writeFileSync(aboutPath, aboutContent);

// Contact.tsx
let contactPath = path.join(dir, 'Contact.tsx');
let contactContent = fs.readFileSync(contactPath, 'utf-8');
contactContent = contactContent.replace(
  `import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';`,
  `import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';\nimport { useState, useEffect } from 'react';\nimport { settingsRepository } from '../repositories/cms';\nimport { type SiteSettings } from '../types/cms';`
);
contactContent = contactContent.replace(
  `export default function Contact() {`,
  `export default function Contact() {\n  const [settings, setSettings] = useState<SiteSettings | null>(null);\n  const [isLoading, setIsLoading] = useState(true);\n\n  useEffect(() => {\n    const fetch = async () => {\n      const res = await settingsRepository.getById('global');\n      if(res.data) setSettings(res.data);\n      setIsLoading(false);\n    };\n    fetch();\n  }, []);\n\n  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;\n`
);
contactContent = contactContent.replace(
  `123 Education Hub, Main Street<br />
                        City Name, State 12345`,
  `{settings?.address || '123 Education Hub, Main Street, City Name, State 12345'}`
);
contactContent = contactContent.replace(
  `+91 98765 43210<br />
                        +91 98765 43211`,
  `{settings?.contactPhone || '+91 98765 43210'}`
);
contactContent = contactContent.replace(
  `info@mrinstitute.edu<br />
                        admissions@mrinstitute.edu`,
  `{settings?.contactEmail || 'info@mrinstitute.edu'}`
);
fs.writeFileSync(contactPath, contactContent);

console.log('About and Contact converted.');
