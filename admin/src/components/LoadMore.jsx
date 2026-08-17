const LoadMore = ({ displayLimit, setDisplayLimit, totalItems }) => {
  // Hide button if all items are already displayed
  if (displayLimit >= totalItems) return null;

  const handleLoadMore = (e) => {
    e.preventDefault();    // Stops any default form/link action
    e.stopPropagation();   // Stops the click from "bubbling" up to any parent links
    setDisplayLimit((prev) => prev + 5); // Increments the list
  };

  return (
    <div className="flex justify-center w-full py-6">
      <button
        type="button"
        onClick={handleLoadMore}
        className='group flex items-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-2 rounded-full font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-lg cursor-pointer active:scale-95'
      >
        Load More
        <span className='group-hover:translate-y-1 transition-transform'>↓</span>
      </button>
    </div>
  );
};

export default LoadMore