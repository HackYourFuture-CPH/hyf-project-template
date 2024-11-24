import { useEffect, useState } from 'react';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
export default function ProgressBar({ startDate, deadline, status }) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const calculateProgress = (startDate, deadline, status) => {
    if (status.toLowerCase() === 'completed') {
      return 100;
    }

    const start = new Date(startDate);
    const end = new Date(deadline);
    const current = new Date();

    if (current >= start && current <= end) {
      const totalDuration = end - start;
      const elapsed = current - start;
      return (elapsed / totalDuration) * 100;
    } else if (current > end) {
      return 100;
    } else {
      return 0;
    }
  };

  const progress = Math.min(calculateProgress(startDate, deadline, status), 100);

  useEffect(() => {
    const start = animatedProgress;
    const difference = Math.abs(progress - start);
    const duration = Math.max(difference * 10, 200);
    const interval = 10;
    const totalSteps = duration / interval;
    const step = (progress - start) / totalSteps;

    const intervalId = setInterval(() => {
      setAnimatedProgress(prev => {
        const nextValue = prev + step;
        if ((step > 0 && nextValue >= progress) || (step < 0 && nextValue <= progress)) {
          clearInterval(intervalId);
          return progress;
        }
        return nextValue;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [progress]);

  return (
    <div className='relative mt-6'>
      <p className='flex items-center mb-4'>
        <EventRepeatOutlinedIcon className='mr-3 text-primary-blue-dark text-xl md:text-2xl' />
        <strong className='mr-2 md:text-base text-sm'>Progress:</strong>
      </p>
      <div className='relative w-full '>
        <div className='relative w-full h-6 bg-gray-200 rounded-full overflow-hidden'>
          <div
            className='flex absolute h-6 bg-primary-blue-dark rounded-full'
            style={{ width: `${animatedProgress}%` }}
          >
            <div className='items-center absolute text-sm font-semibold flex text-white justify-end w-full h-full pr-2'>
              {Math.round(animatedProgress)}% <span className='md:ml-1.5 hidden md:inline'> completed</span>
            </div>
          </div>
        </div>

        <div className='flex justify-between mt-1 md:text-base text-sm'>
          <p className='flex md:flex-row flex-col text-gray-600 mt-1 items-center'>
            Start:<span className='md:ml-1.5  md:inline'>{startDate}</span>
          </p>

          <p className='flex md:flex-row flex-col text-gray-600 mt-1 items-center'>
            Deadline:<span className='md:ml-1.5  md:inline'>{deadline}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
