'use client';
import Breadcrumbs from '@/app/_components/DevDashboard/Breadcrumbs';
import ProjectsTableDesktop from '@/app/_components/DevDashboard/ProjectsTableDesktop';
import ProjectsTableMobile from '@/app/_components/DevDashboard/ProjectsTableMobile';
import { DesktopTableSkeleton, MobileTableSkeleton } from '@/app/_components/DevDashboard/TableSkeletons';
import { getFieldFromCookie } from '@/app/utils/auth';
import { getAllProjects, getAllProjectsFromDeveloper } from '@/app/utils/projectUtil';
import { useEffect, useState } from 'react';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (error) return <div>{error}</div>;

  return (
    <div className='h-full mx-auto max-w-screen-xl flex-grow '>
      <Breadcrumbs breadcrumbs={[{ label: 'Projects', href: '/dev-dashboard/projects' }]} />

      <div className='flow-root md:mx-6 mx-0 rounded-lg bg-primary-neutral-light max-w-full p-2 md:pt-0 overflow-auto'>
        {isLoading ? (
          <>
            <DesktopTableSkeleton />
            <MobileTableSkeleton />
          </>
        ) : (
          <>
            <ProjectsTableDesktop projects={projects} setProjects={setProjects} />
            <ProjectsTableMobile projects={projects} setProjects={setProjects} />
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
