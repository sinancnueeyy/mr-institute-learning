import { AlertCircle } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';

interface ValidationMessageProps {
  message?: string;
}

export function ValidationMessage({ message }: ValidationMessageProps) {
  if (!message) return null;
  
  return (
    <FadeIn>
      <div className="flex items-center gap-1.5 mt-1 text-error text-sm font-medium">
        <AlertCircle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    </FadeIn>
  );
}
