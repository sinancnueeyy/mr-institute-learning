import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { FadeIn } from '../../components/animations/FadeIn';
import { Save, Eye, EyeOff, MapPin, Phone, Mail, Clock, Plus, Trash2 } from 'lucide-react';
import { type SiteSettings, type ContactPageContent } from '../../types/cms';
import { settingsRepository } from '../../repositories/cms';
import { SectionEditor } from '../../components/cms/SectionEditor';
import { SeoEditor } from '../../components/cms/SeoEditor';
import { MediaSelector } from '../../components/cms/MediaSelector';

const DEFAULT_CONTACT_CONTENT: ContactPageContent = {
  headline: 'Get In Touch',
  subheadline: 'We are here to answer your questions and guide you.',
  description: 'Have questions about admissions, courses, or charity programs? Our team is here to help you.',
  heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  primaryCtaText: 'Send a Message',
  primaryCtaLink: '#contact-form',
  infoTitle: 'Contact Information',
  infoSubtitle: 'Fill out the form and our admissions team will get back to you within 24 hours. Alternatively, you can reach us directly using the information below.',
  mapEmbedUrl: 'https://maps.google.com/maps?q=MR+Institute+of+Learning+Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed',
  mapLocationName: 'MR Institute Main Campus, Knowledge City, Kerala',
  mapTitle: 'Our Campus Location',
  mapSubtitle: 'Visit our modern, serene campus equipped with state-of-the-art facilities.',
  formTitle: 'Send Us a Message',
  formSubtitle: 'Fill out the details below and we will respond promptly.',
  submitButtonText: 'Submit Enquiry'
};

export default function DeveloperContact() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [contactContent, setContactContent] = useState<ContactPageContent>(DEFAULT_CONTACT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsRepository.getById('global');
        if (res.data) {
          setSettings(res.data);
          if (res.data.contactContent) {
            setContactContent({ ...DEFAULT_CONTACT_CONTENT, ...res.data.contactContent });
          } else if (res.data.seo && (res.data.seo as any).contactContent) {
            setContactContent({ ...DEFAULT_CONTACT_CONTENT, ...(res.data.seo as any).contactContent });
          }
        }
      } catch (err) {
        console.error('Failed to load contact settings', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updatedPayload: Partial<SiteSettings> = {
        ...settings,
        id: 'global',
        contactContent,
        mapEmbedUrl: contactContent.mapEmbedUrl,
        updatedAt: new Date().toISOString(),
      };

      await settingsRepository.create(updatedPayload as SiteSettings, 'global');
      setSettings(updatedPayload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e) {
      console.error('Failed to save contact CMS', e);
      alert('Failed to save Contact page settings. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateContact = (key: keyof ContactPageContent, val: any) => {
    setContactContent(prev => ({ ...prev, [key]: val }));
  };

  // Branch handlers
  const addBranch = () => {
    const branches = settings.branches ? [...settings.branches] : [];
    branches.push({ name: 'New Branch', address: '', phone: '', email: '', mapUrl: '' });
    setSettings({ ...settings, branches });
  };

  const updateBranch = (index: number, field: string, val: string) => {
    const branches = settings.branches ? [...settings.branches] : [];
    if (branches[index]) {
      branches[index] = { ...branches[index], [field]: val };
      setSettings({ ...settings, branches });
    }
  };

  const removeBranch = (index: number) => {
    const branches = settings.branches ? settings.branches.filter((_, i) => i !== index) : [];
    setSettings({ ...settings, branches });
  };

  // Department contact handlers
  const addDepartmentContact = () => {
    const deptContacts = settings.departmentContacts ? [...settings.departmentContacts] : [];
    deptContacts.push({ department: 'New Department', name: '', email: '', phone: '' });
    setSettings({ ...settings, departmentContacts: deptContacts });
  };

  const updateDepartmentContact = (index: number, field: string, val: string) => {
    const deptContacts = settings.departmentContacts ? [...settings.departmentContacts] : [];
    if (deptContacts[index]) {
      deptContacts[index] = { ...deptContacts[index], [field]: val };
      setSettings({ ...settings, departmentContacts: deptContacts });
    }
  };

  const removeDepartmentContact = (index: number) => {
    const deptContacts = settings.departmentContacts ? settings.departmentContacts.filter((_, i) => i !== index) : [];
    setSettings({ ...settings, departmentContacts: deptContacts });
  };

  if (isLoading) {
    return (
      <FadeIn className="space-y-6 max-w-5xl">
        <div className="h-10 w-1/3 animate-shimmer rounded bg-border/50" />
        <div className="h-64 w-full animate-shimmer rounded bg-border/30" />
      </FadeIn>
    );
  }

  return (
    <FadeIn className="space-y-6 h-full flex flex-col max-w-6xl pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Phone className="w-6 h-6 text-brand-primary" />
            Contact Page CMS
          </h2>
          <p className="text-text-secondary mt-1">
            Manage public contact details, hero banner, Google Maps integration, form text, and branch offices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm font-semibold text-success bg-success/10 px-3 py-1.5 rounded-md border border-success/30 animate-fade-in">
              ✓ Saved & Published
            </span>
          )}
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <><EyeOff className="w-4 h-4 mr-2" /> Hide Preview</> : <><Eye className="w-4 h-4 mr-2" /> Live Preview</>}
          </Button>
          <Button onClick={handleSave} loading={isSaving} className="shadow-md">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6 flex-1`}>
        {/* Editor Form Columns */}
        <div className="space-y-6 overflow-y-auto pr-1">

          {/* Section 1: Hero Banner */}
          <SectionEditor title="1. Hero Banner & Introduction" defaultOpen>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Hero Title / Headline</label>
                <Input
                  value={contactContent.headline || ''}
                  onChange={e => updateContact('headline', e.target.value)}
                  placeholder="e.g. Get In Touch"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Description / Subtitle</label>
                <Textarea
                  value={contactContent.description || ''}
                  onChange={e => updateContact('description', e.target.value)}
                  placeholder="Introductory text describing how prospective students and visitors can get support..."
                  rows={3}
                />
              </div>

              <MediaSelector
                label="Hero Background Image"
                value={contactContent.heroImage || ''}
                onChange={val => updateContact('heroImage', val)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Primary CTA Button Text</label>
                  <Input
                    value={contactContent.primaryCtaText || ''}
                    onChange={e => updateContact('primaryCtaText', e.target.value)}
                    placeholder="e.g. Send a Message"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">CTA Target Link / Anchor</label>
                  <Input
                    value={contactContent.primaryCtaLink || ''}
                    onChange={e => updateContact('primaryCtaLink', e.target.value)}
                    placeholder="e.g. #contact-form"
                  />
                </div>
              </div>
            </div>
          </SectionEditor>

          {/* Section 2: Contact Information Details */}
          <SectionEditor title="2. Direct Contact Details & Campus Information" defaultOpen>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Section Heading</label>
                  <Input
                    value={contactContent.infoTitle || ''}
                    onChange={e => updateContact('infoTitle', e.target.value)}
                    placeholder="e.g. Contact Information"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Primary Phone Number</label>
                  <Input
                    value={settings.contactPhone || ''}
                    onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Section Subtitle / Helper Text</label>
                <Textarea
                  value={contactContent.infoSubtitle || ''}
                  onChange={e => updateContact('infoSubtitle', e.target.value)}
                  placeholder="Fill out the form and our admissions team will get back to you within 24 hours..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Primary Email Address</label>
                  <Input
                    value={settings.contactEmail || ''}
                    onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                    placeholder="info@mrinstitute.edu"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Office Working Hours</label>
                  <Input
                    value={settings.officeHours || ''}
                    onChange={e => setSettings({ ...settings, officeHours: e.target.value })}
                    placeholder="Mon - Sat: 8:30 AM - 5:30 PM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Main Campus Physical Address</label>
                <Textarea
                  value={settings.address || ''}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  placeholder="MR Institute Campus, Main Knowledge City Road, Kerala, India"
                  rows={2}
                />
              </div>
            </div>
          </SectionEditor>

          {/* Section 3: Google Maps Configuration */}
          <SectionEditor title="3. Google Maps & Location Embed" defaultOpen>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Google Maps Embed URL</label>
                <Input
                  value={contactContent.mapEmbedUrl || ''}
                  onChange={e => updateContact('mapEmbedUrl', e.target.value)}
                  placeholder="https://maps.google.com/maps?q=MR+Institute+Kerala&output=embed"
                />
                <p className="text-xs text-text-muted">
                  Tip: Provide an embed URL (e.g. from Google Maps Share &gt; Embed a map) or search query URL. A fallback interactive directions link is automatically generated if empty.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Map Section Title</label>
                  <Input
                    value={contactContent.mapTitle || ''}
                    onChange={e => updateContact('mapTitle', e.target.value)}
                    placeholder="e.g. Our Campus Location"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Location / Landmark Name</label>
                  <Input
                    value={contactContent.mapLocationName || ''}
                    onChange={e => updateContact('mapLocationName', e.target.value)}
                    placeholder="e.g. MR Institute Main Campus, Knowledge City"
                  />
                </div>
              </div>

              {contactContent.mapEmbedUrl && (
                <div className="mt-4 border border-border rounded-lg overflow-hidden">
                  <div className="bg-surface-muted px-4 py-2 text-xs font-semibold text-text-muted border-b border-border flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-primary" />
                    Map Preview
                  </div>
                  <iframe
                    src={contactContent.mapEmbedUrl}
                    title="Map Preview"
                    className="w-full h-48 border-0"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </SectionEditor>

          {/* Section 4: Enquiry Form Configuration */}
          <SectionEditor title="4. Public Enquiry Form Labels" defaultOpen={false}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Form Title</label>
                  <Input
                    value={contactContent.formTitle || ''}
                    onChange={e => updateContact('formTitle', e.target.value)}
                    placeholder="e.g. Send Us a Message"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">Submit Button Text</label>
                  <Input
                    value={contactContent.submitButtonText || ''}
                    onChange={e => updateContact('submitButtonText', e.target.value)}
                    placeholder="e.g. Submit Enquiry"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Form Subtitle / Instructions</label>
                <Input
                  value={contactContent.formSubtitle || ''}
                  onChange={e => updateContact('formSubtitle', e.target.value)}
                  placeholder="e.g. Fill out the details below and we will respond promptly."
                />
              </div>
            </div>
          </SectionEditor>

          {/* Section 5: Branches Management */}
          <SectionEditor title={`5. Branch Locations (${settings.branches?.length || 0})`} defaultOpen={false}>
            <div className="space-y-4">
              {settings.branches?.map((branch, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-surface-muted/50 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-primary uppercase">Branch #{index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeBranch(index)} className="text-error h-7 px-2">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Branch Name (e.g. City Learning Centre)"
                      value={branch.name}
                      onChange={e => updateBranch(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Phone"
                      value={branch.phone}
                      onChange={e => updateBranch(index, 'phone', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Email"
                      value={branch.email}
                      onChange={e => updateBranch(index, 'email', e.target.value)}
                    />
                    <Input
                      placeholder="Address"
                      value={branch.address}
                      onChange={e => updateBranch(index, 'address', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addBranch}>
                <Plus className="w-4 h-4 mr-2" /> Add Branch Location
              </Button>
            </div>
          </SectionEditor>

          {/* Section 6: Department Contacts */}
          <SectionEditor title={`6. Department Contacts (${settings.departmentContacts?.length || 0})`} defaultOpen={false}>
            <div className="space-y-4">
              {settings.departmentContacts?.map((dept, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-surface-muted/50 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-primary uppercase">Department #{index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeDepartmentContact(index)} className="text-error h-7 px-2">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Department (e.g. Admissions Office)"
                      value={dept.department}
                      onChange={e => updateDepartmentContact(index, 'department', e.target.value)}
                    />
                    <Input
                      placeholder="Contact Person (e.g. Admissions Officer)"
                      value={dept.name}
                      onChange={e => updateDepartmentContact(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Email"
                      value={dept.email}
                      onChange={e => updateDepartmentContact(index, 'email', e.target.value)}
                    />
                    <Input
                      placeholder="Phone"
                      value={dept.phone}
                      onChange={e => updateDepartmentContact(index, 'phone', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addDepartmentContact}>
                <Plus className="w-4 h-4 mr-2" /> Add Department Contact
              </Button>
            </div>
          </SectionEditor>

          {/* Section 7: SEO Settings */}
          <SectionEditor title="7. SEO & Social Meta" defaultOpen={false}>
            <SeoEditor
              seo={settings.seo || { title: 'Contact Us - MR Institute of Learning', description: '', keywords: '' }}
              onChange={val => setSettings({ ...settings, seo: val })}
            />
          </SectionEditor>
        </div>

        {/* Live Preview Side Panel */}
        {showPreview && (
          <div className="border border-border rounded-lg p-6 bg-white overflow-y-auto space-y-6 shadow-sm sticky top-24 max-h-[85vh]">
            <div className="border-b border-border pb-3 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Public Page Live Preview</span>
              <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-semibold">Real-Time</span>
            </div>

            {/* Hero Preview */}
            <div className="p-6 bg-surface-muted rounded-lg border border-border text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Hero Banner</span>
              <h3 className="text-2xl font-bold text-text-primary">{contactContent.headline || 'Get In Touch'}</h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto">{contactContent.description}</p>
              <div className="pt-2">
                <span className="inline-block bg-brand-primary text-white text-xs px-4 py-2 rounded font-semibold shadow-sm">
                  {contactContent.primaryCtaText || 'Send a Message'}
                </span>
              </div>
            </div>

            {/* Direct Info Preview */}
            <div className="space-y-3">
              <h4 className="font-bold text-text-primary text-sm uppercase tracking-wide">Contact Info Cards</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 border border-border rounded bg-white flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text-primary">Our Campus</p>
                    <p className="text-xs text-text-secondary">{settings.address || 'Address not configured'}</p>
                  </div>
                </div>
                <div className="p-3 border border-border rounded bg-white flex items-start gap-2">
                  <Phone className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text-primary">Phone</p>
                    <p className="text-xs text-text-secondary">{settings.contactPhone || 'Phone not configured'}</p>
                  </div>
                </div>
                <div className="p-3 border border-border rounded bg-white flex items-start gap-2">
                  <Mail className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text-primary">Email</p>
                    <p className="text-xs text-text-secondary">{settings.contactEmail || 'Email not configured'}</p>
                  </div>
                </div>
                <div className="p-3 border border-border rounded bg-white flex items-start gap-2">
                  <Clock className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-text-primary">Office Hours</p>
                    <p className="text-xs text-text-secondary">{settings.officeHours || 'Hours not configured'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="space-y-2">
              <h4 className="font-bold text-text-primary text-sm uppercase tracking-wide">Location Map</h4>
              <div className="border border-border rounded bg-surface-muted overflow-hidden">
                {contactContent.mapEmbedUrl ? (
                  <iframe src={contactContent.mapEmbedUrl} title="Map" className="w-full h-36 border-0" loading="lazy" />
                ) : (
                  <div className="h-32 flex items-center justify-center text-xs text-text-muted">
                    Fallback interactive location banner active
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  );
}
