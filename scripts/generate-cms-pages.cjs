const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'DeveloperHomepage', type: 'HomepageContent', title: 'Homepage Content', empty: 'No homepage content configured.' },
  { name: 'DeveloperAbout', type: 'AboutContent', title: 'About Us Content', empty: 'No about content found.' },
  { name: 'DeveloperCourses', type: 'CourseContent', title: 'Courses Management', empty: 'No courses available.' },
  { name: 'DeveloperServices', type: 'ServiceContent', title: 'Services Management', empty: 'No services available.' },
  { name: 'DeveloperCharity', type: 'CharityContent', title: 'Charity Initiatives', empty: 'No charity initiatives found.' },
  { name: 'DeveloperGallery', type: 'GalleryContent', title: 'Gallery Management', empty: 'No gallery images found.' },
  { name: 'DeveloperForms', type: 'FormSchema', title: 'Dynamic Forms', empty: 'No forms created yet.' },
  { name: 'DeveloperMedia', type: 'MediaAsset', title: 'Media Library', empty: 'No media files uploaded.' },
];

const dir = path.join(__dirname, 'src/pages/developer');

pages.forEach(p => {
  const content = `import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { FadeIn } from '../../components/animations/FadeIn';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { type ${p.type} } from '../../types/cms';

export default function ${p.name}() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for UI representation
  const [data, setData] = useState<${p.type}[]>([]);

  const columns: Column<${p.type}>[] = [
    { header: 'ID', accessorKey: 'id' },
    ${p.type !== 'SiteSettings' && p.type !== 'MediaAsset' ? `{
      header: 'Status',
      accessorKey: 'isActive',
      cell: (item) => (
        <Badge variant={item.isActive ? 'success' : 'secondary'}>
          {item.isActive ? 'Active' : 'Draft'}
        </Badge>
      )
    },` : ''}
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Edit2 className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="text-error border-error/20 hover:bg-error/10"><Trash2 className="w-4 h-4" /></Button>
        </div>
      )
    }
  ];

  return (
    <FadeIn className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">${p.title}</h2>
          <p className="text-text-secondary">Manage and organize your ${p.title.toLowerCase()}.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add New
        </Button>
      </div>

      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-surface/30">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          <DataTable 
            data={data}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="${p.empty}"
          />
        </CardContent>
      </Card>
    </FadeIn>
  );
}
`;
  fs.writeFileSync(path.join(dir, `${p.name}.tsx`), content);
});

// Settings page is slightly different (usually a form rather than a table)
const settingsContent = `import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { FadeIn } from '../../components/animations/FadeIn';
import { Save } from 'lucide-react';
import { type SiteSettings } from '../../types/cms';

export default function DeveloperSettings() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    siteName: 'MR Institute of Learning',
    contactEmail: 'info@mrinstitute.edu',
    contactPhone: '+91 98765 43210',
    address: '123 Education Hub, Main Street, City Name, State 12345',
    maintenanceMode: false
  });

  return (
    <FadeIn className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Site Settings</h2>
        <p className="text-text-secondary">Configure global website parameters and integrations.</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-surface/30">
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Site Name</label>
              <Input 
                value={settings.siteName} 
                onChange={(e) => setSettings({...settings, siteName: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Contact Email</label>
              <Input 
                value={settings.contactEmail} 
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Contact Phone</label>
              <Input 
                value={settings.contactPhone} 
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Address</label>
              <Input 
                value={settings.address} 
                onChange={(e) => setSettings({...settings, address: e.target.value})} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-surface/30">
          <CardTitle>Advanced</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-text-primary">Maintenance Mode</h4>
              <p className="text-sm text-text-secondary">Disable public access to the website during updates.</p>
            </div>
            <Switch 
              checked={settings.maintenanceMode} 
              onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">
          <Save className="w-4 h-4 mr-2" /> Save Settings
        </Button>
      </div>
    </FadeIn>
  );
}
`;
fs.writeFileSync(path.join(dir, 'DeveloperSettings.tsx'), settingsContent);

console.log('CMS pages created successfully.');
