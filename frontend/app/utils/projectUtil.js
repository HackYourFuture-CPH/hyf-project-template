import { toast } from 'react-toastify';
import { handleResponse, sendGetRequest, defaultSuccessCallback, sendDeleteRequest, sendPostJsonRequest } from './resHandler';

export const getAllProjectsFromDeveloper = async UserId => {
  const response = await sendGetRequest(`/api/developer/getAllProjectsFromDeveloper/${UserId}`);
  return handleResponse(response, defaultSuccessCallback, () => {
    toast.error('Failed to fetch projects');
  });
};

export const getProjectById = async id => {
  const response = await sendGetRequest(`/api/projects/${id}`);
  return handleResponse(response, defaultSuccessCallback, () => {
    toast.error('Failed to fetch project');
  });
};

// // ----- testing endpoint
// export const getAllProjects = async () => {
//   const response = await sendGetRequest(`/api/projects`);
//   return handleResponse(response, defaultSuccessCallback, () => {
//     toast.error('Failed to fetch projects');
//   });
// };
// // ----- testing endpoint

export const handleDeleteProject = async (projectId, deleteCallBack) => {
  const response = await sendDeleteRequest(`/api/projects/${projectId}`, {}, { method: 'DELETE' });
  return handleResponse(response, deleteCallBack, () => {
    toast.error('Failed to delete project');
  });
};

export const handlePrintInvoice = async projectId => {
  const response = await sendGetRequest(`/api/projects/${projectId}/invoice`);
  return handleResponse(response, defaultSuccessCallback, () => {
    toast.error('Failed to print invoice');
  });
};

export const updateProjectById = async (id, project) => {
  const response = await sendPostJsonRequest(`/api/projects/${id}`, project);
  return handleResponse(response, defaultSuccessCallback, () => {
    toast.error('Failed to update project');
  });
};
