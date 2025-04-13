import React from 'react';

interface Subsection {
  title: string;
  isActive: boolean;
}

interface Step {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  subsections?: Subsection[];
}

interface ProgressStepperProps {
  steps: Step[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps }) => {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-[#333333] mb-6">Questionnaire</h3>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className={`
                  w-5 h-5 flex items-center justify-center rounded-full
                  ${step.isActive ? 'bg-[#007B87] text-white' : 
                    step.isCompleted ? 'bg-[#90CAB3] text-white' : 'bg-[#D8D8D8] text-[#666666] border border-white'}
                `}>
                  {step.isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.stepNumber
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-[1px] h-16 bg-[#D8D8D8]"></div>
                )}
              </div>
              
              <div className="flex flex-col">
                <div className="flex flex-col mb-1">
                  <span className="text-xs font-medium uppercase text-[#666666]">STEP {step.stepNumber}</span>
                  <span className={`font-semibold text-lg ${step.isActive ? 'text-[#007B87]' : 'text-[#333333]'}`}>
                    {step.title}
                  </span>
                </div>
                
                {step.subsections && step.subsections.length > 0 && (
                  <div className="ml-2 mt-2 space-y-2">
                    {step.subsections.map((subsection, subIndex) => (
                      <div 
                        key={subIndex} 
                        className={`pl-3 border-l-2 ${
                          subsection.isActive 
                            ? 'border-[#007B87] text-[#007B87]' 
                            : 'border-[#D8D8D8] text-[#666666]'
                        } text-sm font-medium`}
                      >
                        {subsection.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;
