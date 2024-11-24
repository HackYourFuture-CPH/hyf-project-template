import { CircularProgress } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';
import { use } from 'react';

export default function ProjectSkeleton({ id, title }) {
  return (
    <div className='h-full mx-auto max-w-screen-xl flex-grow'>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Projects', href: '/dev-dashboard/projects' },
          { label: title, href: `/dev-dashboard/projects/${id}` },
        ]}
      />
      <div className='flow-root md:mx-6 mx-0 bg-white rounded-xl shadow-lg p-6 max-w-full overflow-auto'>
        <div className='bg-white p-6 rounded-lg w-full max-w-screen-xl animate-pulse'>
          <div className='md:flex-row flex-col md:justify-between flex md:items-center mb-2'>
            <div className='flex-col flex mb-4 w-full'>
              <div className='h-8 bg-gray-300 rounded mb-4 md:mb-0 w-full md:w-3/4'></div>
              <div className='flex my-4 items-center space-x-2 text-sm font-semibold rounded-full w-20 md:px-3 px-1.5 py-1 whitespace-nowrap bg-gray-300 h-8'></div>
            </div>

            <div className='flex justify-evenly gap-3'>
              <div className='h-8 bg-gray-300 rounded w-16 md:w-20'></div>
              <div className='h-8 bg-gray-300 rounded w-16 md:w-20'></div>
              <div className='h-8 bg-gray-300 rounded w-16 md:w-20'></div>
            </div>
          </div>

          <div className='text-sm md:text-base grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4 bg-white text-gray-800'>
            <div>
              <div className='flex items-center mb-4'>
                <div className='h-5 w-5 bg-gray-300 rounded mr-3'></div>
                <div className='h-4 bg-gray-300 rounded w-3/4'></div>
              </div>
              <div className='flex items-center mb-4'>
                <div className='h-5 w-5 bg-gray-300 rounded mr-3'></div>
                <div className='h-4 bg-gray-300 rounded w-3/4'></div>
              </div>
            </div>

            <div>
              <div className='flex items-center mb-4'>
                <div className='h-5 w-5 bg-gray-300 rounded mr-3'></div>
                <div className='h-4 bg-gray-300 rounded w-3/4'></div>
              </div>
              <div className='flex items-center mb-4'>
                <div className='h-5 w-5 bg-gray-300 rounded mr-3'></div>
                <div className='h-4 bg-gray-300 rounded w-3/4'></div>
              </div>
            </div>
          </div>

          <div className='md:p-6 flex justify-center items-center'>
            <div className='flex flex-col items-center'>
              <div className='w-[640px] h-80 bg-gray-300 rounded mb-4'></div>
              <div className='h-4 bg-gray-300 rounded w-3/4 mb-4'></div>
            </div>
          </div>

          <div className='text-sm md:text-base grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4 bg-white text-gray-800'>
            <div className='flex items-center mb-4'>
              <div className='h-5 w-5 bg-gray-300 rounded mr-3'></div>
              <div className='h-4 bg-gray-300 rounded w-3/4'></div>
            </div>
          </div>

          <div className='h-5 bg-gray-300 rounded w-full mb-4'></div>
        </div>
      </div>
    </div>
  );
}
