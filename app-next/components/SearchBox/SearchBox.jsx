import { useState } from 'react';
import styles from './SearchBox.module.css';

const SearchBox = ({ 
  placeholder = "Search...", 
  onSearch, 
  onClear,
  isLoading = false,
  className = "",
  forceLightTheme = false
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  return (
    <div className={`${styles.searchContainer} ${className} ${forceLightTheme ? styles.forceLight : ''}`}>
      <div className={`${styles.searchInputWrapper} ${forceLightTheme ? styles.forceLightWrapper : ''}`}>
        <div className={styles.searchIcon}>
          {isLoading ? (
            <div className={styles.spinner}></div>
          ) : (
            <i className="fas fa-search"></i>
          )}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            title="Clear"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
