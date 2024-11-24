export function DesktopTableSkeleton() {
  return (
    <table className='hidden text-gray-900 md:table min-w-full '>
      <thead className='rounded-lg text-left text-base font-normal max-w-full'>
        <tr>
          <th scope='col' className='px-4 py-5 font-medium sm:pl-6'>
            Project
          </th>
          <th scope='col' className='px-3 py-5 font-medium'>
            Client
          </th>
          <th scope='col' className='px-3 py-5 font-medium'>
            Budget
          </th>
          <th scope='col' className='px-3 py-5 font-medium'>
            Start Date
          </th>
          <th scope='col' className='px-3 py-5 font-medium'>
            End Date
          </th>
          <th scope='col' className='px-3 py-5 font-medium'>
            Status
          </th>
          <th scope='col' className='relative py-3 pl-6 pr-3'>
            <span className='sr-only'>Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className='bg-white overflow-auto'>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className='border-b text-sm'>
            <td className='whitespace-nowrap pl-6 pr-2 py-6'>
              <div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
            </td>
            <td className='whitespace-nowrap px-2 py-3'>
              <div className='h-4 bg-gray-200 rounded w-1/2 animate-pulse'></div>
            </td>
            <td className='whitespace-nowrap px-2 py-3'>
              <div className='h-4 bg-gray-200 rounded w-1/4 animate-pulse'></div>
            </td>
            <td className='whitespace-nowrap px-2 py-3'>
              <div className='h-4 bg-gray-200 rounded w-1/2 animate-pulse'></div>
            </td>
            <td className='whitespace-nowrap px-2 py-3'>
              <div className='h-4 bg-gray-200 rounded w-1/2 animate-pulse'></div>
            </td>
            <td className='whitespace-nowrap px-2 py-3'>
              <div className='h-4 bg-gray-200 rounded w-1/3 animate-pulse'></div>
            </td>
            <td className='whitespace-nowrap pl-3 pr-6'>
              <div className='flex justify-end gap-3'>
                <div className='h-4 bg-gray-200 rounded w-12 animate-pulse'></div>
                <div className='h-4 bg-gray-200 rounded w-12 animate-pulse'></div>
                <div className='h-4 bg-gray-200 rounded w-12 animate-pulse'></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MobileTableSkeleton() {
  return (
    <div className='md:hidden p-2'>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className='mb-2 w-full rounded-md bg-white pt p-4'>
          <div className='flex items-center justify-between border-b pb-4'>
            <div className='w-2/3'>
              <div className='mb-2 h-4 bg-gray-300 rounded'></div>
              <div className='w-3/4 h-3 bg-gray-200 rounded'></div>
            </div>
            <div className='w-1/4 h-6 bg-gray-300 rounded'></div>
          </div>

          <div className='flex w-full items-center justify-between pt-4'>
            <div className='w-1/2'>
              <div className='h-4 bg-gray-300 rounded mb-2'></div>
              <div className='h-3 bg-gray-200 rounded mb-1'></div>
              <div className='h-3 bg-gray-200 rounded'></div>
            </div>
            <div className='flex justify-end gap-2'>
              <div className='h-8 w-8 bg-gray-300 rounded-full'></div>
              <div className='h-8 w-8 bg-gray-300 rounded-full'></div>
              <div className='h-8 w-8 bg-gray-300 rounded-full'></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
