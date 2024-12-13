import '@/style/Pagination.css';

function Pagination({ currentPage, totalPages, handlePageChange }) {
    return (
        <div className="pagination-container">
            <button
                className="pagination-nav"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                &lt; Back
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                key={index}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
                >
                {index + 1}
                </button>
            ))}
            <button
                className="pagination-nav"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Next &gt;
            </button>
            </div>
    );
  }

  export default Pagination
  