import DoneAllIcon from '@mui/icons-material/DoneAll';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';

export const statusColors = {
  completed: '#a2ebb3',
  'in-progress': '#a8ecf7',
  pending: '#f7f5be',
  default: '#b7bfc7',
};

export const getStatusIcon = status => {
  switch (status.toLowerCase()) {
    case 'completed':
      return <DoneAllIcon style={{ color: '#4f4f4f' }} />;
    case 'in-progress':
      return <PublishedWithChangesOutlinedIcon style={{ color: '#4f4f4f' }} />;
    case 'pending':
      return <PendingOutlinedIcon style={{ color: '#4f4f4f' }} />;
    default:
      return null;
  }
};

export const formatProjectData = project => ({
  id: project.projects.id,
  budget: Number(project.projects.budget).toFixed(0),
  clientName: project.projects.client.name || 'No client',
  status: project.projects.status,
  statusCapital: capitalizeStatus(project.projects.status),
  title: project.projects.title,
  startDate: project.projects.startDate,
  endDate: project.projects.endDate,
  deadline: project.projects.deadline,
  assignedDate: project.assignedDate,
  description: project.projects.description,
});

// export const formatProjectData = project => ({
//   id: project.id,
//   clientName: 'No client',
//   status: project.status,
//   statusCapital: capitalizeStatus(project.status),
//   title: project.title,
//   startDate: project.startDate,
//   endDate: project.endDate,
//   deadline: project.deadline,
// });

export const capitalizeStatus = status =>
  status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
