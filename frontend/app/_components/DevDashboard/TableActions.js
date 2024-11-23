import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import { handleDeleteProject, handlePrintInvoice } from '@/app/utils/projectUtil';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export const PrintInvoicingButton = ({ projectID }) => {
  const handlePrintClick = () => {
    if (!confirm('Are you sure you want to print invoice of this project?')) return;

    handlePrintInvoice(projectID);
  };
  return (
    <button
      onClick={handlePrintClick}
      title='Print Invoice'
      className='rounded-md border p-2 hover:bg-primary-blue-light'
    >
      <LocalPrintshopOutlinedIcon className='w-5' />
    </button>
  );
};

export const EditButton = ({ projectID }) => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/dev-dashboard/projects/${projectID}/edit`);
  };
  return (
    <button
      onClick={handleEditClick}
      title='Edit Project'
      className='rounded-md border p-2 hover:bg-primary-blue-light'
    >
      <PencilIcon className='w-5' />
    </button>
  );
};

export const DeleteButton = ({ projectID, setProjects }) => {
  const router = useRouter();

  const handleDeleteClick = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    await handleDeleteProject(projectID, () => {
      router.refresh('/dev-dashboard/projects');
      setProjects(prevProjects => prevProjects.filter(project => project.id !== projectID));
      toast.success('Project deleted successfully! 🎉');
    });
  };
  return (
    <button
      onClick={handleDeleteClick}
      title='Delete Project'
      className='rounded-md border p-2 hover:bg-primary-blue-light'
    >
      <TrashIcon className='w-5' />
    </button>
  );
};
