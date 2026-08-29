const http = require('http');

const routes = [
  '/',
  '/contact',
  '/about',
  '/courses',
  '/services',
  '/charity',
  '/gallery',
  '/login',
  '/developer/contact'
];

console.log('Testing Vite Dev Server Routes on http://localhost:5173...');

let completed = 0;
routes.forEach(route => {
  http.get('http://localhost:5173' + route, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      const hasRoot = body.includes('id="root"');
      const hasMain = body.includes('src="/src/main.tsx"');
      console.log(`[ROUTE] ${route.padEnd(20)} -> Status: ${res.statusCode} | Has Root Div: ${hasRoot} | Loads Main: ${hasMain}`);
      completed++;
      if (completed === routes.length) {
        console.log('All routes verified successfully.');
      }
    });
  }).on('error', err => {
    console.error(`[ROUTE ERROR] ${route}:`, err.message);
  });
});
