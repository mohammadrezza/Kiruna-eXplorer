import React, { useState,useEffect } from 'react';
import {Button} from 'react-bootstrap';
import { useNavigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { LiaThListSolid, LiaMapMarkedAltSolid } from "react-icons/lia";
import { VscSettings } from "react-icons/vsc";
import { useAuth } from '@/layouts/AuthContext';
import FilterModal from '@/components/FilterModal';
import API from '@/services/API.mjs';
import '@/style/DocumentsList.css';
import Pagination from '@/components/Pagination';
import dayjs from 'dayjs';

function DocumentsList() {

  const navigate = useNavigate();
  const location = useLocation();
  const url = new URL(window.location.href)
  let [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth(); 
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true)
  const isList = location.pathname === '/documents';
  const isMap = location.pathname === '/documents/map';
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filter,setFilter] = useState({ documentTypes: '', stakeholders: '', issuanceDateStart: '', issuanceDateEnd: '' })
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Numero di documenti per pagina
  const [totalPages,setTotalPages] = useState(0)
  const [sortConfig, setSortConfig] = useState({ key: '', direction: "" });
  const [stakeholders,setStakeholders] = useState([])
  const [types,setTypes] = useState([])
  const [issuanceDateStart, setIssuanceDateStart] = useState('');
  const [issuanceDateEnd, setIssuanceDateEnd] = useState('');


  useEffect(()=>{
    const loadData = async () => {
      try {
        
        const title = searchParams.get('title');
        if (title) {
          setSearchQuery(title);
        }
        const documents = await API.getList(filter,isMap ? 0 : currentPage,itemsPerPage,sortConfig.key,sortConfig.direction,url.searchParams.get('title'));
        // console.log(documents)
        setList(documents.data);
        setTotalPages(documents.pagination.totalPages)
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage,sortConfig,filter, isMap]);

  const handleNavigation = () => {
    let path = isList ? "/documents/map" : "/documents"
    navigate(path);
    setFilter({ documentTypes: '', stakeholders: '', issuanceDateStart: '', issuanceDateEnd: '' })
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClickSearch = () => {
    //temporary solution
    if (searchParams.has('title')) {
      searchParams.delete('title');
      setSearchParams(searchParams); // Update the URL without reloading the page
    }
    const loadSearch = async () => {
      try {
        url.searchParams.set('title', searchQuery);
        window.history.pushState({}, '', url);
        const documents = await API.getList(filter,isMap ? 0 : currentPage,itemsPerPage,sortConfig.key,sortConfig.direction,searchQuery);
        setList(documents.data);
        setTotalPages(documents.pagination.totalPages)
        setCurrentPage(1)
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSearch();
  }


  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1)
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "▲"; // Default quando la colonna non è attiva
  };


  const handleClickFilter = () => {
    const filters = { documentTypes: '', stakeholders: '', issuanceDateStart: '', issuanceDateEnd: '' }
    let st = ''
    stakeholders.forEach((s) =>{st= st.concat(s.value,',')} )
    filters.stakeholders=st.slice(0,-1);
    let dt = '';
    types.forEach((t) => dt = dt.concat(t.value,','))
    filters.documentTypes=dt.slice(0,-1);
    filters.issuanceDateEnd=(issuanceDateEnd ? dayjs(issuanceDateEnd).format('DD-MM-YYYY') : '');
    filters.issuanceDateStart=(issuanceDateStart ? dayjs(issuanceDateStart).format('DD-MM-YYYY'): '');
    setFilter(filters)
    setCurrentPage(1)
  }

  const handleDeleteFilter = (key) =>{
    const updatedFilter = { ...filter };

  switch (key) {
    case "documentTypes":
      setTypes([]);
      updatedFilter.documentTypes = '';
      break;
    case "stakeholders":
      setStakeholders([]);
      updatedFilter.stakeholders = '';
      break;
    case "issuanceDateStart":
      setIssuanceDateStart('');
      updatedFilter.issuanceDateStart = '';
      break;
    case "issuanceDateEnd":
      setIssuanceDateEnd('');
      updatedFilter.issuanceDateEnd = '';
      break;
    default:
      break;
  }

  setFilter(updatedFilter);
  setCurrentPage(1); // Reset della paginazione
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="wrapper">
      <div className={`layout-container ${isMap ? 'map-container' : ''}`}>
      <h2 className='layout-container-title'>
          {isList ? "List of Documents" : "Map of Documents"}
          {isList && user && 
          (<Button  className='add-button' onClick={()=>navigate('/document/add')}>+ New document</Button>)
          }
      </h2>
      <div className='layout-container-subtitle'>
        {user &&<div className="search-bar-list">
            <input
              type="text"
              placeholder="Enter the document name to search"
              value={searchQuery}
              onChange={handleSearch}
              className="search-input-list"
            />
            <button
                className="search-button-list"
                aria-label="Search"
                onClick={handleClickSearch}
              >
                Search
              </button>
        </div>
        }
        {user && <div className="map-documents-button" role="button" onClick={()=>handleNavigation()} onKeyDown={()=>handleNavigation()}>
          {isList ? <LiaMapMarkedAltSolid /> : <LiaThListSolid/>}
          <span>{isList ? "Show Map" : "Show List"}</span>
        </div>
        }
      </div>
      {user && <div className="filter-container">
        <Button className="filter-button" onClick={()=>setShowModal(true)}>
          <VscSettings />
          Filters
        </Button>
        <div className="active-filters">
            {Object.entries(filter).map(([key, value]) =>
              value ? (
                <div key={key} className="filter-tag">
                  <span>{key}: {value}</span>
                  <span
                    className="remove-filter"
                    onClick={() => {
                      handleDeleteFilter(key)
                    }}

                    onKeyDown={() => {
                      handleDeleteFilter(key)
                    }}
                  >
                    ✕
                  </span>
                </div>
              ) : null
            )}
        </div>
      </div>}
      <Outlet context={{list, loading,getSortIndicator,sortConfig,handleSort}} />
      {isList && <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        handlePageChange={handlePageChange} 
      />}
      </div>
      <FilterModal
          show={showModal}
          onHide={handleCloseModal}
          handleFilter={handleClickFilter}
          stakeholders={stakeholders}
          changeStake={setStakeholders}
          issuanceDateEnd={issuanceDateEnd}
          changeIssuanceDateEnd={setIssuanceDateEnd}
          issuanceDateStart={issuanceDateStart}
          changeIssuanceDateStart={setIssuanceDateStart}
          types={types}
          changeTypes={setTypes}
            />
      
    </div>
  );
}

export default DocumentsList;
