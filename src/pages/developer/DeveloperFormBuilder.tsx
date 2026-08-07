import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageTransition } from '../../components/animations/PageTransition';
import { FormBuilder } from '../../components/forms/FormBuilder';
import { type FormSchema } from '../../types/cms';
import { formsRepository } from '../../repositories/cms';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function DeveloperFormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      if (id && id !== 'new') {
        const res = await formsRepository.getById(id);
        if (res.data) {
          // ensure steps exist (migration for older forms)
          if (!res.data.steps) {
            res.data.steps = [{ id: crypto.randomUUID(), title: 'Step 1', order: 0, fields: (res.data as any).fields || [] }];
          }
          setSchema(res.data);
        } else {
          toast.error('Form not found');
          navigate(ROUTES.DEVELOPER.CMS.FORMS);
        }
      } else {
        setSchema({
          id: '',
          title: 'New Form',
          type: 'general',
          description: '',
          steps: [
            { id: crypto.randomUUID(), title: 'Step 1', order: 0, fields: [] }
          ],
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      setIsLoading(false);
    };
    fetchForm();
  }, [id, navigate]);

  const handleSave = async (updatedSchema: FormSchema) => {
    try {
      const isNew = !updatedSchema.id;
      const schemaToSave = { ...updatedSchema, updatedAt: new Date().toISOString() };
      
      if (isNew) {
        schemaToSave.createdAt = new Date().toISOString();
        await formsRepository.create(schemaToSave);
      } else {
        await formsRepository.update(updatedSchema.id as string, schemaToSave);
      }
      
      toast.success('Form saved successfully');
      navigate(ROUTES.DEVELOPER.CMS.FORMS);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save form');
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.DEVELOPER.CMS.FORMS);
  };

  if (isLoading || !schema) {
    return <div className="p-8 flex justify-center">Loading...</div>;
  }

  return (
    <PageTransition className="h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            {id === 'new' ? 'Create Form' : 'Edit Form'}
          </h2>
          <p className="text-text-secondary">Design your form layout and configure fields.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <FormBuilder 
          initialSchema={schema} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    </PageTransition>
  );
}
