import { PrintInvoicingButton, EditButton, DeleteButton } from './TableActions';
import { statusColors, getStatusIcon, formatProjectData } from './helpers';
import Link from 'next/link';

export default function ProjectsTableDesktop({ projects, setProjects }) {
  return (
    <table className='hidden text-gray-900 md:table min-w-full'>
      <thead className='rounded-lg text-left text-base font-normal max-w-full whitespace-nowrap'>
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
                <td className='whitespace-nowrap px-2 py-3'>${formattedProject.budget}</td>
                <td className='whitespace-nowrap px-2 py-3'>{formattedProject.startDate}</td>
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
                <td className='whitespace-nowrap pl-3 pr-6'>
                  <div className='flex justify-end gap-3'>
                    <PrintInvoicingButton projectID={formattedProject.id} />
                    <EditButton projectID={formattedProject.id} />
                    <DeleteButton projectID={formattedProject.id} setProjects={setProjects} />
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
  );
}
