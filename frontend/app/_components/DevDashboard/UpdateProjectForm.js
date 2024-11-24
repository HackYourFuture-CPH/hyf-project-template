'use client';

function UpdateProjectForm({ project, onChange, onSubmit, loading }) {
  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const fields = [
    { label: 'Title', type: 'text', field: 'title' },
    { label: 'Description', type: 'textarea', field: 'description' },
    { label: 'Status', type: 'select', field: 'status', options: ['pending', 'in-progress', 'completed'] },
    { label: 'Budget', type: 'number', field: 'budget' },
    { label: 'Start Date', type: 'date', field: 'startDate' },
    { label: 'End Date', type: 'date', field: 'endDate' },
    { label: 'Deadline', type: 'date', field: 'deadline' },
  ];
  return (
    <>
      <h1 className='md:text-2xl text-lg font-bold text-primary-blue-dark md:mb-8 mt-2 mb-4'>Update Project</h1>
      <form onSubmit={onSubmit} className='md:space-y-6 space-y-4'>
        {fields.map(({ label, type, field, options }, index) => (
          <div key={index} className='flex flex-col sm:flex-row items-center gap-1'>
            <label
              htmlFor={field}
              className='w-full sm:w-1/5 font-medium text-primary-blue dark:text-primary-blue-dark'
            >
              {label}
            </label>
            <div className='w-full sm:w-4/5'>
              {type === 'textarea' ? (
                <textarea
                  id={field}
                  value={project?.[field] || ''}
                  onChange={e => handleInputChange(field, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className='w-full border border-primary-neutral-dark rounded p-2 focus:ring-2 focus:ring-primary-purple placeholder-gray-400'
                />
              ) : type === 'select' ? (
                <select
                  id={field}
                  value={project?.[field] || ''}
                  onChange={e => handleInputChange(field, e.target.value)}
                  className='w-full border border-primary-neutral-dark rounded p-2 focus:ring-2 focus:ring-primary-purple placeholder-gray-400'
                >
                  {options.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field}
                  type={type}
                  value={project?.[field] || ''}
                  onChange={e => handleInputChange(field, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className='w-full border border-primary-neutral-dark rounded p-2 focus:ring-2 focus:ring-primary-purple placeholder-gray-400'
                />
              )}
            </div>
          </div>
        ))}

        <div className='flex justify-end'>
          <button
            type='submit'
            className='bg-primary-blue text-white rounded px-6 py-2 mt-4 hover:bg-primary-blue-dark disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </>
  );
}

export default UpdateProjectForm;
