import { DeleteButton, EditButton, PrintInvoicingButton } from './TableActions';
import { statusColors, getStatusIcon, formatProjectData } from './helpers';
import Link from 'next/link';

export default function ProjectsTableMobile({ projects, setProjects }) {
  return (
    <div className='md:hidden p-2'>
      {projects.length > 0 ? (
        projects.map(project => {
          const formattedProject = formatProjectData(project);
          const statusColor = statusColors[formattedProject.status.toLowerCase()] || statusColors.default;
          return (
            <div key={formattedProject.id} className='mb-2 w-full rounded-md bg-white pt p-4'>
              <div className='flex items-center justify-between border-b pb-4'>
                <div>
                  <h3 className='mb-2 text-base font-semibold'>
                    <Link
                      href={`/dev-dashboard/projects/${formattedProject.id}`}
                      className='text-blue-500 hover:text-blue-700'
                    >
                      {formattedProject.title}
                    </Link>
                  </h3>
                  <p className='text-sm text-gray-500'>{formattedProject.clientName}</p>
                </div>
                <div
                  className='flex items-center space-x-1 text-sm font-medium rounded-full px-1.5 py-0.5 whitespace-nowrap'
                  style={{ backgroundColor: statusColor }}
                >
                  {getStatusIcon(formattedProject.status)}
                  <span className='text-gray-700'>{formattedProject.statusCapital}</span>
                </div>
              </div>
              <div className='flex w-full items-center justify-between pt-4'>
                <div>
                  <p className='text-base font-medium pb-3'>$ {formattedProject.budget}</p>
                  <p className='text-sm'>
                    <span>Start:</span> {formattedProject.startDate}
                  </p>
                  <p className='text-sm'>
                    <span>End:</span> {formattedProject.endDate}
                  </p>
                </div>
                <div className='flex justify-end gap-2'>
                  <PrintInvoicingButton projectID={formattedProject.id} />
                  <EditButton projectID={formattedProject.id} />
                  <DeleteButton projectID={formattedProject.id} setProjects={setProjects} />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className='p-2 text-center text-gray-600'>No projects found.</div>
      )}
    </div>
  );
}
