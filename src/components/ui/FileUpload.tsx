import React, { useRef } from 'react';
import { cn } from '../../utils';
import { UploadCloud } from 'lucide-react';

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  onFileSelect?: (file: File | null) => void;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, label, error, onFileSelect, onChange, disabled, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (onFileSelect) {
        onFileSelect(file);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const handleBoxClick = () => {
      if (disabled) return;
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>}
        <div
          onClick={handleBoxClick}
          className={cn(
            'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-surface hover:bg-brand-secondary transition-colors',
            error ? 'border-error' : 'border-border',
            disabled && 'cursor-not-allowed opacity-50 hover:bg-surface',
            className
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-3 text-text-muted" />
            <p className="mb-2 text-sm text-text-secondary">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-text-muted">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-error mt-1 block">{error}</span>}
      </div>
    );
  }
);
FileUpload.displayName = 'FileUpload';
