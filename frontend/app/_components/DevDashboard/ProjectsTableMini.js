import Link from 'next/link';
import { formatProjectData, getStatusIcon, statusColors } from './helpers';

export default function ProjectsTableMini({ projects }) {
  return (
    <div>
      <div className='block md:hidden'>
        {projects.length > 0 ? (
          projects.map(project => {
            const formattedProject = formatProjectData(project);
            const statusColor = statusColors[formattedProject.status.toLowerCase()] || statusColors.default;

            return (
              <div key={formattedProject.id} className='mb-4 rounded-lg border bg-white shadow-md p-4'>
                <Link
                  href={`/dev-dashboard/projects/${formattedProject.id}`}
                  className='block text-lg font-semibold text-blue-500 hover:text-blue-700'
                >
                  {formattedProject.title}
                </Link>
                <div className='mt-2 text-sm text-gray-700'>
                  <div>
                    <span className='font-medium'>Client: </span>
                    {formattedProject.clientName}
                  </div>
                  <div>
                    <span className='font-medium'>End Date: </span>
                    {formattedProject.endDate}
                  </div>
                  <div className='mt-2 flex items-center space-x-2 text-sm'>
                    <div
                      className='flex items-center space-x-1 text-xs font-semibold rounded-full px-2 py-0.5'
                      style={{ backgroundColor: statusColor }}
                    >
                      {getStatusIcon(formattedProject.status)}
                      <span className='text-gray-700'>{formattedProject.statusCapital}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className='text-center text-gray-600'>No projects found.</p>
        )}
      </div>

      <table className='hidden md:table text-gray-900 min-w-full'>
        <thead className='rounded-lg text-left text-base font-normal max-w-full whitespace-nowrap'>
          <tr>
            <th scope='col' className='p-3 font-medium'>
              Project
            </th>
            <th scope='col' className='p-3 font-medium'>
              Client
            </th>
            <th scope='col' className='px-3 py-5 font-medium'>
              End Date
            </th>
            <th scope='col' className='p-3 font-medium'>
              Status
            </th>
          </tr>
        </thead>
        <tbody className='bg-white overflow-auto'>
          {projects.length > 0 ? (
            projects.map(project => {
              const formattedProject = formatProjectData(project);
              const statusColor = statusColors[formattedProject.status.toLowerCase()] || statusColors.default;

              return (
                <tr key={formattedProject.id} className='border-b text-sm'>
                  <td className='whitespace-nowrap pl-6 pr-2 py-6'>
                    <Link
                      href={`/dev-dashboard/projects/${formattedProject.id}`}
                      className='text-blue-500 hover:text-blue-700'
                    >
                      {formattedProject.title}
                    </Link>
                  </td>
                  <td className='whitespace-nowrap px-2 py-3'>{formattedProject.clientName}</td>
                  <td className='whitespace-nowrap px-2 py-3'>{formattedProject.endDate}</td>
                  <td className='whitespace-nowrap px-2 py-3'>
                    <div
                      className='flex items-center space-x-1 text-xs font-semibold rounded-full max-w-fit px-2 py-0.5 whitespace-nowrap'
                      style={{ backgroundColor: statusColor }}
                    >
                      {getStatusIcon(formattedProject.status)}
                      <span className='text-gray-700'>{formattedProject.statusCapital}</span>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan='7' className='p-2 text-center text-gray-600'>
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
