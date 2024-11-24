'use client';

import Breadcrumbs from '@/app/_components/DevDashboard/Breadcrumbs';
import { getProjectById } from '@/app/utils/projectUtil';
import { use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import { capitalizeStatus, getStatusIcon, statusColors } from '@/app/_components/DevDashboard/helpers';
import ProgressBar from '@/app/_components/DevDashboard/ProgressBar';
import { DeleteButton, EditButton, PrintInvoicingButton } from '@/app/_components/DevDashboard/TableActions';
import ProjectSkeleton from '@/app/_components/DevDashboard/ProjectSkeleton';
import Cookies from 'js-cookie';
import { getFieldFromCookie } from '@/app/utils/auth';

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!id) {
    setError('Invalid project ID');
    setLoading(false);
    return toast.error('Invalid project ID');
  }

  const cachedProjectTitle = getFieldFromCookie('projectTitle');

  useEffect(() => {
    const fetchProject = async () => {
      const data = await getProjectById(id);
      setProject(data);
      Cookies.set('projectTitle', data.title);

      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <ProjectSkeleton id={id} title={cachedProjectTitle} />;
  }

  if (error) return toast.error(error);

  const statusColor = statusColors[project.status.toLowerCase()] || statusColors.default;

  return (
    <div className='h-full mx-auto max-w-screen-xl flex-grow'>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Projects', href: '/dev-dashboard/projects' },
          { label: project.title, href: `/dev-dashboard/projects/${id}` },
        ]}
      />
      <div className='flow-root md:mx-6 mx-0 bg-white rounded-xl shadow-lg p-6 max-w-full overflow-auto'>
        <div className='md:flex-row flex-col md:justify-between flex md:items-center mb-2'>
          <div className='flex-col flex mb-4'>
            <div className='md:text-3xl text-lg font-semibold text-primary-blue-dark '>{project.title}</div>
            <div
              className='flex md:mt-4 mt-2 items-center space-x-2 text-sm font-semibold rounded-full max-w-fit md:px-3 px-1.5 py-1 whitespace-nowrap bg-primary-neutral-light'
              style={{ backgroundColor: statusColor }}
            >
              {getStatusIcon(project.status)}
              <span className='text-gray-700'>{capitalizeStatus(project.status)}</span>
            </div>
          </div>

          <div className='flex md:justify-end items-center justify-evenly gap-3 mb-2 text-xs'>
            <div className='flex items-center gap-1'>
              <p className='inline md:hidden text-sm'>Print</p>
              <PrintInvoicingButton projectID={project.id} />
            </div>

            <div className='flex items-center gap-1'>
              <p className='inline md:hidden text-sm'>Edit</p>
              <EditButton projectID={project.id} />
            </div>

            <div className='flex items-center gap-1'>
              <p className='inline md:hidden text-sm'>Delete</p>
              <DeleteButton projectID={project.id} setProjects={setProject} />
            </div>
          </div>
        </div>

        <div className='text-sm md:text-base grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-0 bg-white text-gray-800'>
          <div>
            <p className='flex items-center mb-4'>
              <PersonOutlineOutlinedIcon className='mr-3 text-primary-blue-dark text-xl md:text-2xl' />
              <strong className='mr-2 text-base'>Client:</strong> {project.client?.name}
            </p>
            <p className='flex items-center mb-4'>
              <EuroOutlinedIcon className='mr-3 text-primary-blue-dark text-xl md:text-2xl' />
              <strong className='mr-2 text-base'>Budget:</strong> ${project.budget}
            </p>
          </div>

          <div>
            <p className='flex items-center mb-4'>
              <CalendarTodayOutlinedIcon className='mr-3 text-primary-blue-dark text-xl md:text-2xl' />
              <strong className='mr-2 text-base'>Start Date:</strong> {project.startDate}
            </p>
            <p className='flex items-center mb-4'>
              <CalendarTodayOutlinedIcon className='mr-3 text-primary-blue-dark text-xl md:text-2xl' />
              <strong className='mr-2 text-base'>Deadline:</strong> {project.deadline}
            </p>
          </div>
        </div>

        {/* {project.demoUrl && ( */}
        <div className=' md:p-6 flex justify-center items-center'>
          <div className='flex flex-col items-center'>
            <a href={project.demoUrl}>
              <img
                src='https://triple-minds.com/wp-content/uploads/2020/02/Datenbank.jpg'
                alt='Demo'
                className='cursor-pointer rounded-lg shadow-lg hover:opacity-80'
              />
            </a>
            <p className=' text-base text-start mt-4 w-full text-gray-600'>Description: {project.description}</p>
          </div>
        </div>
        {/* )} */}

        <ProgressBar startDate={project.startDate} deadline={project.deadline} status={project.status} />
      </div>
    </div>
  );
}
