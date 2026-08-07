import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { FadeIn } from '../../components/animations/FadeIn';
import { Save } from 'lucide-react';
import { type SiteSettings } from '../../types/cms';
import { settingsRepository } from '../../repositories/cms';
import { SectionEditor } from '../../components/cms/SectionEditor';
import { SortableList } from '../../components/cms/SortableList';
import { SeoEditor } from '../../components/cms/SeoEditor';

export default function DeveloperSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    id: 'global',
    siteName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    officeHours: '',
    maintenanceMode: false,
    branches: [],
    departmentContacts: [],
    emergencyContacts: [],
    socialLinks: {}
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await settingsRepository.getById('global');
      if (data) {
        setSettings(data);
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // Since global might not exist on fresh DB, we should 'create' it with custom ID or update
    await settingsRepository.create(settings as SiteSettings, 'global');
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  if (isLoading) {
    return (
      <FadeIn className="space-y-6 max-w-4xl">
        <div className="h-8 w-1/3 animate-pulse bg-surface rounded"></div>
        <div className="h-40 w-full animate-pulse bg-surface rounded"></div>
      </FadeIn>
    );
  }

  return (
    <FadeIn className="space-y-6 max-w-4xl pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Site Settings</h2>
          <p className="text-text-secondary">Configure global website parameters and integrations.</p>
        </div>
        <Button size="lg" onClick={handleSave} loading={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <SectionEditor title="General Information" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Site Name</label>
            <Input 
              value={settings.siteName} 
              onChange={(e) => setSettings({...settings, siteName: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Primary Contact Email</label>
            <Input 
              value={settings.contactEmail} 
              onChange={(e) => setSettings({...settings, contactEmail: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Primary Contact Phone</label>
            <Input 
              value={settings.contactPhone} 
              onChange={(e) => setSettings({...settings, contactPhone: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Main Address</label>
            <Input 
              value={settings.address} 
              onChange={(e) => setSettings({...settings, address: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-primary">Office Hours</label>
            <Input 
              value={settings.officeHours || ''} 
              onChange={(e) => setSettings({...settings, officeHours: e.target.value})} 
            />
          </div>
        </div>
      </SectionEditor>

      <SectionEditor title="Branches">
        <Button 
          variant="outline" size="sm" className="mb-4"
          onClick={() => setSettings({ ...settings, branches: [...(settings.branches || []), { name: '', address: '', phone: '', email: '' }] })}
        >
          Add Branch
        </Button>
        <SortableList 
          items={settings.branches || []}
          onReorder={(newVals) => setSettings({ ...settings, branches: newVals })}
          onRemove={(idx) => setSettings({ ...settings, branches: (settings.branches || []).filter((_, i) => i !== idx) })}
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <Input 
                placeholder="Branch Name" 
                value={item.name} 
                onChange={e => {
                  const newF = [...(settings.branches || [])];
                  newF[index].name = e.target.value;
                  setSettings({ ...settings, branches: newF });
                }} 
              />
              <Input 
                placeholder="Phone" 
                value={item.phone} 
                onChange={e => {
                  const newF = [...(settings.branches || [])];
                  newF[index].phone = e.target.value;
                  setSettings({ ...settings, branches: newF });
                }} 
              />
              <div className="col-span-2">
                <Input 
                  placeholder="Address" 
                  value={item.address} 
                  onChange={e => {
                    const newF = [...(settings.branches || [])];
                    newF[index].address = e.target.value;
                    setSettings({ ...settings, branches: newF });
                  }} 
                />
              </div>
            </div>
          )}
        />
      </SectionEditor>

      <SectionEditor title="Department Contacts">
        <Button 
          variant="outline" size="sm" className="mb-4"
          onClick={() => setSettings({ ...settings, departmentContacts: [...(settings.departmentContacts || []), { department: '', name: '', phone: '', email: '' }] })}
        >
          Add Department Contact
        </Button>
        <SortableList 
          items={settings.departmentContacts || []}
          onReorder={(newVals) => setSettings({ ...settings, departmentContacts: newVals })}
          onRemove={(idx) => setSettings({ ...settings, departmentContacts: (settings.departmentContacts || []).filter((_, i) => i !== idx) })}
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <Input 
                placeholder="Department" 
                value={item.department} 
                onChange={e => {
                  const newF = [...(settings.departmentContacts || [])];
                  newF[index].department = e.target.value;
                  setSettings({ ...settings, departmentContacts: newF });
                }} 
              />
              <Input 
                placeholder="Email" 
                value={item.email} 
                onChange={e => {
                  const newF = [...(settings.departmentContacts || [])];
                  newF[index].email = e.target.value;
                  setSettings({ ...settings, departmentContacts: newF });
                }} 
              />
            </div>
          )}
        />
      </SectionEditor>

      <SectionEditor title="Emergency Contacts">
        <Button 
          variant="outline" size="sm" className="mb-4"
          onClick={() => setSettings({ ...settings, emergencyContacts: [...(settings.emergencyContacts || []), { label: '', phone: '' }] })}
        >
          Add Emergency Contact
        </Button>
        <SortableList 
          items={settings.emergencyContacts || []}
          onReorder={(newVals) => setSettings({ ...settings, emergencyContacts: newVals })}
          onRemove={(idx) => setSettings({ ...settings, emergencyContacts: (settings.emergencyContacts || []).filter((_, i) => i !== idx) })}
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <Input 
                placeholder="Label (e.g. 24/7 Helpline)" 
                value={item.label} 
                onChange={e => {
                  const newF = [...(settings.emergencyContacts || [])];
                  newF[index].label = e.target.value;
                  setSettings({ ...settings, emergencyContacts: newF });
                }} 
              />
              <Input 
                placeholder="Phone" 
                value={item.phone} 
                onChange={e => {
                  const newF = [...(settings.emergencyContacts || [])];
                  newF[index].phone = e.target.value;
                  setSettings({ ...settings, emergencyContacts: newF });
                }} 
              />
            </div>
          )}
        />
      </SectionEditor>

      <SectionEditor title="Social Links">
        <div className="space-y-4">
           {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((network) => (
              <div key={network} className="flex gap-4 items-center">
                 <label className="w-24 font-semibold capitalize text-sm">{network}</label>
                 <Input 
                   className="flex-1"
                   placeholder={`https://${network}.com/...`}
                   value={settings.socialLinks?.[network] || ''}
                   onChange={e => setSettings({...settings, socialLinks: {...(settings.socialLinks || {}), [network]: e.target.value}})}
                 />
              </div>
           ))}
        </div>
      </SectionEditor>

      <SectionEditor title="Advanced">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-text-primary">Maintenance Mode</h4>
            <p className="text-sm text-text-secondary">Disable public access to the website during updates.</p>
          </div>
          <Switch 
            checked={settings.maintenanceMode} 
            onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
          />
        </div>
      </SectionEditor>

      <SectionEditor title="Global SEO Settings">
        <SeoEditor 
          seo={settings.seo}
          onChange={(seo) => setSettings({ ...settings, seo })}
        />
      </SectionEditor>

    </FadeIn>
  );
}
