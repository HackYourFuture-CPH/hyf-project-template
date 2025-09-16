/**
 * Parse validation errors from backend response
 * @param {Object} response - Backend response object
 * @returns {Object} - Parsed errors with field-specific messages
 */
export const parseValidationErrors = (response) => {
  const errors = {};
  
  if (!response) return errors;
  
  // Handle different error response formats
  const details = response.details || response.errors || response.validation_errors || [];
  
  if (Array.isArray(details)) {
    details.forEach(error => {
      if (error.field && error.message) {
        // Convert field name to a more readable format
        const fieldName = formatFieldName(error.field);
        errors[error.field] = {
          field: fieldName,
          message: error.message
        };
      } else if (error.path && error.message) {
        // Handle Zod-style errors
        const fieldName = formatFieldName(error.path.join('.'));
        errors[error.path.join('.')] = {
          field: fieldName,
          message: error.message
        };
      }
    });
  }
  
  // Handle single error message
  if (response.message && !Array.isArray(details)) {
    errors.general = {
      field: 'General',
      message: response.message
    };
  }
  
  return errors;
};

/**
 * Format field name to be more readable
 * @param {string} fieldName - Raw field name
 * @returns {string} - Formatted field name
 */
const formatFieldName = (fieldName) => {
  const fieldMap = {
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'email': 'Email',
    'username': 'Username',
    'password': 'Password',
    'role': 'Role',
    'title': 'Title',
    'content': 'Content',
    'category': 'Category',
    'cover_image_url': 'Cover Image',
    'name': 'Name',
    'description': 'Description',
    'location': 'Location',
    'price': 'Price',
    'duration': 'Duration',
    'max_participants': 'Max Participants',
    'start_date': 'Start Date',
    'end_date': 'End Date',
    'is_active': 'Status'
  };
  
  return fieldMap[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get error message for a specific field
 * @param {Object} errors - Parsed errors object
 * @param {string} fieldName - Field name to get error for
 * @returns {string|null} - Error message or null
 */
export const getFieldError = (errors, fieldName) => {
  if (!errors || !fieldName) return null;
  
  const error = errors[fieldName];
  return error ? error.message : null;
};

/**
 * Check if there are any validation errors
 * @param {Object} errors - Parsed errors object
 * @returns {boolean} - True if there are errors
 */
export const hasValidationErrors = (errors) => {
  return errors && Object.keys(errors).length > 0;
};
