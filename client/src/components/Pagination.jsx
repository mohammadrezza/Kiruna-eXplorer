import '@/style/Pagination.css';
import PropTypes from 'prop-types';


function Pagination({ currentPage, totalPages, handlePageChange }) {
    return (
        <div className="pagination-container">
            {currentPage!=1 && <button
                className="pagination-nav"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                &lt; Back
            </button>}
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                key={index}
                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
                >
                {index + 1}
                </button>
            ))}
            {totalPages>1 && currentPage!=totalPages && <button
                className="pagination-nav"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Next &gt;
            </button>}
            </div>
    );
  }

  Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,   // La pagina corrente (numero)
    totalPages: PropTypes.number.isRequired,    // Il numero totale di pagine (numero)
    handlePageChange: PropTypes.func.isRequired, // Funzione per cambiare pagina
  };
  

  export default Pagination
  