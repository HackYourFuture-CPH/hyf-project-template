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
        // If field already has errors, append to existing message
        if (errors[error.field]) {
          errors[error.field].message += `; ${error.message}`;
        } else {
          errors[error.field] = {
            field: fieldName,
            message: error.message
          };
        }
      } else if (error.path && error.message) {
        // Handle Zod-style errors
        const fieldName = formatFieldName(error.path.join('.'));
        const pathKey = error.path.join('.');
        if (errors[pathKey]) {
          errors[pathKey].message += `; ${error.message}`;
        } else {
          errors[pathKey] = {
            field: fieldName,
            message: error.message
          };
        }
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
    // User fields
    'first_name': 'First Name',
    'last_name': 'Last Name',
    'email': 'Email',
    'username': 'Username',
    'password': 'Password',
    'password_confirmation': 'Password Confirmation',
    'current_password': 'Current Password',
    'new_password': 'New Password',
    'new_password_confirmation': 'New Password Confirmation',
    'mobile': 'Mobile Number',
    'profile_image': 'Profile Image',
    'role': 'Role',
    'is_active': 'Status',
    
    // Post fields
    'title': 'Title',
    'content': 'Content',
    'category': 'Category',
    'cover_image_url': 'Cover Image',
    
    // Tour fields
    'name': 'Tour Name',
    'description': 'Description',
    'price_minor': 'Price',
    'duration_days': 'Duration (Days)',
    'capacity': 'Capacity',
    'currency_code': 'Currency Code',
    'start_date': 'Start Date',
    'end_date': 'End Date',
    'destinations': 'Destinations',
    
    // Attraction fields
    'location': 'Location',
    'type': 'Type',
    
    // Review fields
    'rating': 'Rating',
    
    // Comment fields
    'post_id': 'Post',
    'tour_id': 'Tour',
    
    // General fields
    'item_id': 'Item ID',
    'item_type': 'Item Type'
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
  return error ? (typeof error === 'string' ? error : error.message) : null;
};

/**
 * Check if there are any validation errors
 * @param {Object} errors - Parsed errors object
 * @returns {boolean} - True if there are errors
 */
export const hasValidationErrors = (errors) => {
  return errors && Object.keys(errors).length > 0;
};

/**
 * Get combined error message from server and client validation errors
 * @param {Object} serverErrors - Server validation errors
 * @param {Object} clientErrors - Client validation errors  
 * @param {string} fieldName - Field name to get error for
 * @returns {string|null} - Combined error message or null
 */
export const getCombinedFieldError = (serverErrors, clientErrors, fieldName) => {
  const serverError = getFieldError(serverErrors, fieldName);
  const clientError = getFieldError(clientErrors, fieldName);
  
  return serverError || clientError;
};
