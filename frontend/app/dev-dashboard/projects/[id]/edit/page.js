'use client';
import Breadcrumbs from '@/app/_components/DevDashboard/Breadcrumbs';
import { getProjectById, updateProjectById } from '@/app/utils/projectUtil';
import { use, useEffect, useState } from 'react';
import UpdateProjectForm from '@/app/_components/DevDashboard/UpdateProjectForm';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getFieldFromCookie } from '@/app/utils/auth';

function EditPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Invalid project ID');
        setLoading(false);
        return;
      }

      const data = await getProjectById(id);
      if (!data) {
        setError('Project not found');
      } else {
        setProject(data);
      }

      setLoading(false);
    };

    fetchProject();
  }, [id]);

  const handleInputChange = (field, value) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    await updateProjectById(id, project);

    router.push(`/dev-dashboard/projects/${id}`);
    toast.success('Project updated successfully! 🎉');
    setLoading(false);
  };

  if (error) {
    return (
      <div className='bg-red-100 shadow-lg rounded-lg p-6 max-w-xl mx-auto'>
        <p className='text-red-800 font-medium'>{error}</p>
      </div>
    );
  }

  const cachedProjectTitle = getFieldFromCookie('projectTitle');

  if (error) return toast.error(error);

  return (
    <div className='h-full mx-auto max-w-screen-xl flex-grow'>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Projects', href: '/dev-dashboard/projects' },
          { label: cachedProjectTitle, href: `/dev-dashboard/projects/${id}` },
          { label: 'Edit', href: `/dev-dashboard/projects/${id}/edit` },
        ]}
      />
      <div className='flow-root md:mx-6 mx-0 bg-white rounded-xl shadow-lg max-w-full overflow-auto'>
        <div className='flex justify-center items-center'>
          <div className='bg-white rounded-xl md:w-4/5 w-full p-6'>
            <UpdateProjectForm
              project={project}
              onChange={handleInputChange}
              onSubmit={handleFormSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
