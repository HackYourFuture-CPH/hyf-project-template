import styles from './UserSearchResults.module.css';

const UserSearchResults = ({ 
  users, 
  isLoading, 
  error, 
  hasSearched, 
  onEdit, 
  onDelete 
}) => {
  if (isLoading) {
    return (
      <div className={styles.resultsContainer}>
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span>Searching...</span>
      </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (hasSearched && users.length === 0) {
    return (
      <div className={styles.resultsContainer}>
      <div className={styles.noResults}>
        <i className="fas fa-search"></i>
        <span>No users found</span>
      </div>
      </div>
    );
  }

  if (!hasSearched) {
    return null;
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <span className={styles.resultsCount}>
          {users.length} results found
        </span>
      </div>
      
      <div className={styles.usersGrid}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user.first_name} {user.last_name}
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userEmail}>
                  <i className="fas fa-envelope"></i>
                  {user.email}
                </div>
                <div className={styles.userUsername}>
                  <i className="fas fa-user"></i>
                  @{user.username}
                </div>
                {user.mobile && (
                  <div className={styles.userMobile}>
                    <i className="fas fa-phone"></i>
                    {user.mobile}
                  </div>
                )}
              </div>
              <div className={styles.userMeta}>
                <span className={`${styles.userRole} ${user.role === 'admin' ? styles.adminRole : styles.userRole}`}>
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </span>
                <span className={`${styles.userStatus} ${user.is_active ? styles.active : styles.inactive}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className={styles.userActions}>
              <button
                className={styles.editButton}
                onClick={() => onEdit && onEdit(user)}
                title="Edit user"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => onDelete && onDelete(user)}
                title="Delete user"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearchResults;
