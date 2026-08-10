import React, { useState, useEffect } from 'react';
import { type FormSchema } from '../../types/cms';
import { formsRepository } from '../../repositories/cms';
import { formSubmissionsRepository } from '../../repositories/operations/formSubmissionsRepository';
import { notificationsRepository } from '../../repositories/operations';
import { StorageService } from '../../firebase/storage';
import { FormFieldRenderer } from './FormFieldRenderer';
import { StepIndicator } from './StepIndicator';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';

interface DynamicFormRendererProps {
  type?: string;
  formId?: string;
}

export function DynamicFormRenderer({ type, formId }: DynamicFormRendererProps) {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fileData, setFileData] = useState<Record<string, File>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        let result = null;
        if (formId) {
          result = await formsRepository.getById(formId);
        } else if (type) {
          // Query active forms by type
          const forms = await formsRepository.query([
            { field: 'type', operator: '==', value: type },
            { field: 'isActive', operator: '==', value: true }
          ]);
          if (forms.data && forms.data.length > 0) {
            result = { data: forms.data[0] };
          }
        }

        if (result?.data) {
          // Backward compatibility for old schemas missing steps
          if (!result.data.steps) {
            result.data.steps = [{
              id: 'default',
              title: 'Details',
              order: 0,
              fields: (result.data as any).fields || []
            }];
          }
          
          // Sort steps and fields
          result.data.steps.sort((a: any, b: any) => a.order - b.order);
          result.data.steps.forEach((step: any) => step.fields.sort((a: any, b: any) => a.order - b.order));
          
          setSchema(result.data);
        } else {
          setError('Form not found or is currently unavailable.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load form. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchema();
  }, [type, formId]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const handleFileSelect = (name: string, file: File | null) => {
    if (file) {
      setFileData(prev => ({ ...prev, [name]: file }));
    } else {
      setFileData(prev => {
        const newData = { ...prev };
        delete newData[name];
        return newData;
      });
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    if (!schema) return false;
    const fields = schema.steps[stepIndex].fields;
    const errors: Record<string, string> = {};
    let isValid = true;

    for (const field of fields) {
      // Check conditional visibility first
      if (field.conditionalVisibility) {
        const { fieldId, operator, value } = field.conditionalVisibility;
        const targetValue = formData[fieldId];
        let isVisible = false;
        
        if (operator === 'equals' && targetValue === value) isVisible = true;
        if (operator === 'not_equals' && targetValue !== value) isVisible = true;
        if (operator === 'contains' && Array.isArray(targetValue) && targetValue.includes(value)) isVisible = true;
        
        if (!isVisible) continue; // Skip validation for hidden fields
      }

      const val = formData[field.name];

      if (field.required && (val === undefined || val === null || val === '')) {
        errors[field.name] = 'This field is required';
        isValid = false;
        continue;
      }

      if (val && field.validation) {
        if (field.validation.minLength && String(val).length < field.validation.minLength) {
          errors[field.name] = field.validation.customErrorMessage || `Minimum length is ${field.validation.minLength}`;
          isValid = false;
        }
        if (field.validation.maxLength && String(val).length > field.validation.maxLength) {
          errors[field.name] = field.validation.customErrorMessage || `Maximum length is ${field.validation.maxLength}`;
          isValid = false;
        }
        if (field.validation.min !== undefined && Number(val) < field.validation.min) {
          errors[field.name] = field.validation.customErrorMessage || `Minimum value is ${field.validation.min}`;
          isValid = false;
        }
        if (field.validation.max !== undefined && Number(val) > field.validation.max) {
          errors[field.name] = field.validation.customErrorMessage || `Maximum value is ${field.validation.max}`;
          isValid = false;
        }
        if (field.validation.regex && !new RegExp(field.validation.regex).test(String(val))) {
          errors[field.name] = field.validation.customErrorMessage || `Invalid format`;
          isValid = false;
        }
        if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(String(val))) {
          errors[field.name] = field.validation.customErrorMessage || `Please enter a valid email address`;
          isValid = false;
        }
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schema) return;
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload Files
      const uploadedFiles: { fieldName: string; url: string; fileName: string }[] = [];
      const submissionId = crypto.randomUUID();

      for (const [fieldName, file] of Object.entries(fileData)) {
        // Upload to a generic form-submissions path
        const url = await StorageService.uploadFile(file, `documents/submissions/${submissionId}`);
        uploadedFiles.push({
          fieldName,
          fileName: file.name,
          url
        });
      }

      // 2. Save Submission
      await formSubmissionsRepository.create({
        formId: schema.id,
        formType: schema.type,
        formTitle: schema.title,
        data: formData,
        files: uploadedFiles,
        status: 'new',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, submissionId); // Use predefined ID

      // 3. Trigger Notification
      await notificationsRepository.create({
        title: `New Submission: ${schema.title}`,
        message: `A new submission was received for ${schema.title}.`,
        type: 'info',
        isRead: false,
        createdAt: new Date().toISOString()
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
        <p className="text-text-secondary">Loading form...</p>
      </div>
    );
  }

  if (error || !schema) {
    return (
      <Card className="border-error/20 bg-error/5">
        <CardContent className="p-8 text-center">
          <p className="text-error font-medium">{error || 'Form not found'}</p>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <FadeIn>
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-12 text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-success mb-6" />
            <h3 className="text-2xl font-bold text-text-primary mb-2">Successfully Submitted!</h3>
            <p className="text-text-secondary mb-8 max-w-md">
              Thank you for submitting the form. Your information has been securely received and will be reviewed shortly.
            </p>
            <Button onClick={() => window.location.reload()}>Submit Another</Button>
          </CardContent>
        </Card>
      </FadeIn>
    );
  }

  const currentStepData = schema.steps[currentStep];

  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">{schema.title}</h2>
          {schema.description && <p className="text-text-secondary text-lg">{schema.description}</p>}
        </div>

        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={schema.steps.length} 
          stepTitles={schema.steps.map(s => s.title)} 
        />

        <Card className="shadow-sm border-border">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={schema.steps.length === 1 || currentStep === schema.steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              <div className="grid grid-cols-12 gap-6">
                {currentStepData.fields.map(field => {
                  // Check conditional visibility
                  if (field.conditionalVisibility) {
                    const { fieldId, operator, value } = field.conditionalVisibility;
                    const targetValue = formData[fieldId];
                    let isVisible = false;
                    
                    if (operator === 'equals' && targetValue === value) isVisible = true;
                    if (operator === 'not_equals' && targetValue !== value) isVisible = true;
                    if (operator === 'contains' && Array.isArray(targetValue) && targetValue.includes(value)) isVisible = true;
                    
                    if (!isVisible) return null;
                  }

                  return (
                    <FormFieldRenderer
                      key={field.id}
                      field={field}
                      value={formData[field.name]}
                      onChange={handleChange}
                      onFileSelect={handleFileSelect}
                      error={validationErrors[field.name]}
                    />
                  );
                })}
              </div>

              {error && (
                <div className="mt-8 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-border flex justify-between items-center">
                {currentStep > 0 ? (
                  <Button type="button" variant="outline" onClick={handlePrevious} disabled={isSubmitting}>
                    Previous Step
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < schema.steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {isSubmitting ? 'Submitting...' : 'Submit Form'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  );
}
