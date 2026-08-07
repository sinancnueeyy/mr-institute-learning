const fs = require('fs');
const path = require('path');

const now = new Date().toISOString();

const seedData = {
  applications: [
    {
      applicantName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 9876543210',
      courseId: 'course_123',
      status: 'under_review',
      documents: ['https://example.com/doc1.pdf'],
      submittedAt: now,
      updatedAt: now,
    }
  ],
  students: [
    {
      applicationId: 'app_123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9123456789',
      enrollmentDate: now,
      status: 'active',
      courseIds: ['course_123'],
      createdAt: now,
      updatedAt: now,
    }
  ],
  enquiries: [
    {
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '+91 9888877777',
      subject: 'Admission Process',
      message: 'I would like to know more about the admission process for the upcoming semester.',
      status: 'new',
      createdAt: now,
    }
  ],
  scholarships: [
    {
      applicantName: 'Bob Williams',
      email: 'bob.w@example.com',
      incomeBracket: 'Below 2L',
      reason: 'Financial hardship due to recent family circumstances.',
      documents: ['https://example.com/income_cert.pdf'],
      status: 'pending',
      submittedAt: now,
    }
  ]
};

const outputPath = path.join(__dirname, 'operations-seed.json');
fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2));

console.log('Seed data generated at operations-seed.json');
console.log('You can manually import this into your Firestore Database during development.');
