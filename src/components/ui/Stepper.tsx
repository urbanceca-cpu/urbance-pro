interface StepperProps {
  steps: ReadonlyArray<{ readonly number: number; readonly title: string; readonly description?: string }> | Array<{ number: number; title: string; description?: string }>;
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 border ${
                    isCompleted
                      ? 'bg-[#2F80ED] text-white border-[#2F80ED]'
                      : isCurrent
                        ? 'bg-white text-[#2F80ED] border-blue-400 shadow-soft'
                        : 'bg-blue-50 text-blue-400 border-blue-100'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <h4 className={`mt-2 text-sm font-semibold ${isCurrent || isCompleted ? 'text-dark' : 'text-medium-grey'}`}>
                  {step.title}
                </h4>
                {step.description && (
                  <p className="mt-1 text-xs text-medium-grey">{step.description}</p>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-4 transition-all duration-200 rounded-full ${
                    isCompleted ? 'bg-[#2F80ED]' : 'bg-blue-100'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
