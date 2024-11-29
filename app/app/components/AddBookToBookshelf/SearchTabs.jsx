const SearchTabs = ({ activeTab, onTabChange }) => {
  return (
    <div>
      <button
        className={activeTab === "search" ? styles.activeTab : ""}
        onClick={() => onTabChange("search")}
      >
        Search
      </button>
      <button
        className={activeTab === "browse" ? styles.activeTab : ""}
        onClick={() => onTabChange("browse")}
      >
        Browse
      </button>
      <button></button>
    </div>
  );
};

export default SearchTabs;
