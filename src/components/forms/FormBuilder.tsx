import React, { useState } from 'react';
import { type FormSchema, type FormField, type FormFieldType } from '../../types/cms';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Plus, Settings, ChevronUp, ChevronDown, Trash2, Layout, Type, Mail, Phone, Hash, Lock, AlignLeft, Calendar, Image as ImageIcon, Link2, EyeOff, Minus, FileText } from 'lucide-react';
import { FieldEditor } from './FieldEditor';

interface FormBuilderProps {
  initialSchema: FormSchema;
  onSave: (schema: FormSchema) => void;
  onCancel: () => void;
}

const FIELD_ICONS: Record<FormFieldType, React.ReactNode> = {
  'text': <Type className="w-4 h-4" />,
  'email': <Mail className="w-4 h-4" />,
  'phone': <Phone className="w-4 h-4" />,
  'number': <Hash className="w-4 h-4" />,
  'password': <Lock className="w-4 h-4" />,
  'textarea': <AlignLeft className="w-4 h-4" />,
  'select': <Layout className="w-4 h-4" />,
  'multi-select': <Layout className="w-4 h-4" />,
  'radio': <Layout className="w-4 h-4" />,
  'checkbox': <Layout className="w-4 h-4" />,
  'toggle': <Layout className="w-4 h-4" />,
  'date': <Calendar className="w-4 h-4" />,
  'time': <Calendar className="w-4 h-4" />,
  'datetime': <Calendar className="w-4 h-4" />,
  'file': <FileText className="w-4 h-4" />,
  'image': <ImageIcon className="w-4 h-4" />,
  'url': <Link2 className="w-4 h-4" />,
  'hidden': <EyeOff className="w-4 h-4" />,
  'divider': <Minus className="w-4 h-4" />,
  'heading': <Type className="w-4 h-4" />,
  'paragraph': <AlignLeft className="w-4 h-4" />
};

export function FormBuilder({ initialSchema, onSave, onCancel }: FormBuilderProps) {
  const [schema, setSchema] = useState<FormSchema>(initialSchema);
  const [selectedField, setSelectedField] = useState<{stepIndex: number, fieldIndex: number} | null>(null);

  const handleUpdateField = (updatedField: FormField) => {
    if (!selectedField) return;
    const { stepIndex, fieldIndex } = selectedField;
    const newSchema = { ...schema };
    newSchema.steps[stepIndex].fields[fieldIndex] = updatedField;
    setSchema(newSchema);
  };

  const handleAddField = (stepIndex: number, type: FormFieldType) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type} field`,
      name: `field_${Date.now()}`,
      required: false,
      order: schema.steps[stepIndex].fields.length,
    };
    const newSchema = { ...schema };
    newSchema.steps[stepIndex].fields.push(newField);
    setSchema(newSchema);
    setSelectedField({ stepIndex, fieldIndex: newSchema.steps[stepIndex].fields.length - 1 });
  };

  const handleRemoveField = (stepIndex: number, fieldIndex: number) => {
    const newSchema = { ...schema };
    newSchema.steps[stepIndex].fields.splice(fieldIndex, 1);
    // Reorder
    newSchema.steps[stepIndex].fields.forEach((f, i) => f.order = i);
    setSchema(newSchema);
    setSelectedField(null);
  };

  const handleMoveField = (stepIndex: number, fieldIndex: number, direction: 'up' | 'down') => {
    if (direction === 'up' && fieldIndex === 0) return;
    if (direction === 'down' && fieldIndex === schema.steps[stepIndex].fields.length - 1) return;
    
    const newSchema = { ...schema };
    const fields = newSchema.steps[stepIndex].fields;
    const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    
    const temp = fields[fieldIndex];
    fields[fieldIndex] = fields[targetIndex];
    fields[targetIndex] = temp;
    
    fields.forEach((f, i) => f.order = i);
    setSchema(newSchema);
    if (selectedField?.stepIndex === stepIndex && selectedField.fieldIndex === fieldIndex) {
      setSelectedField({ stepIndex, fieldIndex: targetIndex });
    } else if (selectedField?.stepIndex === stepIndex && selectedField.fieldIndex === targetIndex) {
      setSelectedField({ stepIndex, fieldIndex });
    }
  };

  const handleAddStep = () => {
    const newSchema = { ...schema };
    newSchema.steps.push({
      id: crypto.randomUUID(),
      title: `Step ${newSchema.steps.length + 1}`,
      order: newSchema.steps.length,
      fields: []
    });
    setSchema(newSchema);
  };

  const handleRemoveStep = (stepIndex: number) => {
    if (schema.steps.length <= 1) return;
    const newSchema = { ...schema };
    newSchema.steps.splice(stepIndex, 1);
    newSchema.steps.forEach((s, i) => s.order = i);
    setSchema(newSchema);
    setSelectedField(null);
  };

  return (
    <div className="flex gap-6 h-full min-h-[700px]">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1 block">Form Title</label>
              <Input 
                value={schema.title} 
                onChange={(e) => setSchema({ ...schema, title: e.target.value })} 
                className="text-lg font-bold"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Form Description (Optional)</label>
              <Input 
                value={schema.description || ''} 
                onChange={(e) => setSchema({ ...schema, description: e.target.value })} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 overflow-y-auto space-y-6 pb-20">
          {schema.steps.map((step, stepIndex) => (
            <Card key={step.id} className="border border-border">
              <CardHeader className="bg-surface/50 border-b border-border p-4 flex flex-row items-center justify-between">
                <div className="flex-1 mr-4">
                  <Input 
                    value={step.title} 
                    onChange={(e) => {
                      const newSchema = { ...schema };
                      newSchema.steps[stepIndex].title = e.target.value;
                      setSchema(newSchema);
                    }}
                    className="font-semibold bg-transparent border-none px-0 focus:ring-0"
                    placeholder="Step Title"
                  />
                </div>
                {schema.steps.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveStep(stepIndex)} className="text-error">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {step.fields.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-text-muted">
                    <Layout className="w-8 h-8 mb-2 opacity-50" />
                    <p>No fields in this step. Add one from the toolbox.</p>
                  </div>
                ) : (
                  step.fields.map((field, fieldIndex) => (
                    <div 
                      key={field.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        selectedField?.stepIndex === stepIndex && selectedField?.fieldIndex === fieldIndex 
                        ? 'border-brand-primary bg-brand-primary/5' 
                        : 'border-border bg-white hover:border-brand-primary/30'
                      }`}
                      onClick={() => setSelectedField({ stepIndex, fieldIndex })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface flex items-center justify-center text-text-secondary">
                          {FIELD_ICONS[field.type] || <Type className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-text-primary">{field.label}</p>
                          <p className="text-xs text-text-muted font-mono">{field.name} | {field.type} {field.required && '*Required'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={fieldIndex === 0}
                          onClick={() => handleMoveField(stepIndex, fieldIndex, 'up')}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={fieldIndex === step.fields.length - 1}
                          onClick={() => handleMoveField(stepIndex, fieldIndex, 'down')}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-error"
                          onClick={() => handleRemoveField(stepIndex, fieldIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">Add Field</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAddField(stepIndex, 'text')}>Text</Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddField(stepIndex, 'email')}>Email</Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddField(stepIndex, 'select')}>Dropdown</Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddField(stepIndex, 'file')}>File Upload</Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddField(stepIndex, 'date')}>Date</Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddField(stepIndex, 'divider')}>Divider</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button variant="outline" className="w-full border-dashed" onClick={handleAddStep}>
            <Plus className="w-4 h-4 mr-2" /> Add Step
          </Button>
        </div>
      </div>

      {/* Editor Panel */}
      <Card className="w-[400px] flex-shrink-0 sticky top-0 h-full max-h-[800px] overflow-hidden flex flex-col">
        <CardHeader className="border-b border-border bg-surface/50 p-4">
          <h3 className="font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-primary" />
            {selectedField ? 'Edit Field' : 'Form Settings'}
          </h3>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          {selectedField ? (
            <FieldEditor 
              field={schema.steps[selectedField.stepIndex].fields[selectedField.fieldIndex]} 
              onChange={handleUpdateField} 
            />
          ) : (
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Form Key (Type)</label>
                <Input 
                  value={schema.type} 
                  onChange={(e) => setSchema({ ...schema, type: e.target.value })} 
                  placeholder="e.g. contact, admission"
                />
              </div>
              <p className="text-sm text-text-muted mt-4">
                Select a field on the canvas to configure its properties, validation, and advanced settings.
              </p>
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t border-border bg-surface flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button className="flex-1" onClick={() => onSave(schema)}>Save Form</Button>
        </div>
      </Card>
    </div>
  );
}
