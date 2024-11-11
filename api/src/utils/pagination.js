export const getPaginationParams = (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  return { offset, limit };
};
