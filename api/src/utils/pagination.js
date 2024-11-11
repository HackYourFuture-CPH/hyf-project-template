export const getPaginationParams = (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  return { offset, pageSize };
};
