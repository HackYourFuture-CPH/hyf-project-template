'use client';

import { useEffect, useState } from 'react';
import ClientCard from '../_components/DevDashboard/ClientDetails';
import ProjectStatus from '../_components/DevDashboard/ProjectStatus';
import { getFieldFromCookie } from '../utils/auth';
import { getAllProjectsFromDeveloper } from '../utils/projectUtil';
import ProjectsTableMini from '../_components/DevDashboard/ProjectsTableMini';
import ClientDetails from '../_components/DevDashboard/ClientDetails';
import { useRouter } from 'next/navigation';

const DevDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const userId = getFieldFromCookie('userId');

      const allProjects = await getAllProjectsFromDeveloper(userId);

      if (Array.isArray(allProjects)) {
        setProjects(allProjects);
      } else {
        setProjects([]);
      }

      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className='flex flex-col md:gap-6 gap-4 my-4 p-4 mx-auto max-w-screen-xl h-full'>
      <div className='flex md:flex-row flex-col gap-4'>
        <div
          className='flex-1 bg-white shadow-md rounded-lg p-2 md:p-4 cursor-pointer hover:shadow-lg hover:bg-gray-100 transition-all duration-300'
          onClick={() => router.push('/dev-dashboard/chat')}
        >
          <ClientDetails />
        </div>

        <div className='flex-1 bg-white shadow-md rounded-lg p-2 md:p-4 cursor-pointer hover:shadow-lg hover:bg-gray-100 transition-all duration-300'>
          <ProjectStatus />
        </div>
      </div>

      <div
        className='flex-2 bg-primary-neutral-light shadow-md rounded-lg p-4 overflow-x-auto cursor-pointer hover:shadow-2xl hover:bg-primary-neutral-lighter transition-all duration-300'
        onClick={() => router.push('/dev-dashboard/projects')}
      >
        <p className='md:hidden m-2 font-semibold text-lg text-primary-blue-dark'>Projects</p>
        <ProjectsTableMini projects={projects} setProjects={setProjects} />
      </div>
    </div>
  );
};

export default DevDashboard;
