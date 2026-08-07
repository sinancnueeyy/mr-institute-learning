import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  if (totalSteps <= 1) return null;

  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />
        
        {stepTitles.map((title, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-primary text-white' 
                    : isCurrent 
                      ? 'bg-white border-2 border-primary text-primary' 
                      : 'bg-white border-2 border-border text-text-muted'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <div className="absolute top-10 w-24 text-center">
                <span className={`text-xs font-semibold ${isCurrent || isCompleted ? 'text-primary' : 'text-text-muted'}`}>
                  {title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
