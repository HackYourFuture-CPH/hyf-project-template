import React, { useEffect, useState } from 'react';

export default function ProjectStatus({ percentage = 50 }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    let start = animatedPercentage;
    const duration = 1000;
    const interval = 10;
    const totalSteps = duration / interval;
    const step = (percentage - start) / totalSteps;

    const intervalId = setInterval(() => {
      setAnimatedPercentage(prev => {
        const nextValue = prev + step;
        if ((step > 0 && nextValue >= percentage) || (step < 0 && nextValue <= percentage)) {
          clearInterval(intervalId);
          return percentage;
        }
        return nextValue;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [percentage]);

  return (
    <div className='bg-white rounded-lg p-4 flex flex-col items-center'>
      <h2 className='text-lg text-primary-blue font-semibold mb-4'>
        Status: {Math.round(animatedPercentage)}% Completed
      </h2>
      <div
        className='relative w-24 h-24 flex items-center justify-center rounded-full'
        style={{
          background: `conic-gradient(#4338CA ${animatedPercentage}%, #e5e7eb ${animatedPercentage}% 100%)`,
        }}
      >
        <div className='absolute w-20 h-20 bg-white rounded-full flex items-center justify-center text-xl font-bold'>
          {Math.round(animatedPercentage)}%
        </div>
      </div>
    </div>
  );
}
