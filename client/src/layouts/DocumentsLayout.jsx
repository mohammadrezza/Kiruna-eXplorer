import React, { useState,useEffect, useContext } from 'react';
import {Button} from 'react-bootstrap';
import { useNavigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { LiaThListSolid, LiaMapMarkedAltSolid } from "react-icons/lia";
import { VscSettings } from "react-icons/vsc";
import { AuthContext } from '@/layouts/AuthContext';
import FilterModal from '@/components/FilterModal';
import API from '@/services/API.mjs';
import '@/style/DocumentsList.css';

function DocumentsList() {

  const navigate = useNavigate();
  const location = useLocation();
  const url = new URL(window.location.href)
  let [searchParams, setSearchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false)
  const isList = location.pathname === '/documents';
  const isMap = location.pathname === '/documents/map';
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filter,setFilter] = useState({ documentTypes: '', stakeholders: '', issuanceDateStart: '', issuanceDateEnd: '' })
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Numero di documenti per pagina
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
        const documents = (!url.searchParams.get('title') ? await API.getList(filter,isMap ? 0 : currentPage,isMap ? 100 : itemsPerPage,sortConfig.key,sortConfig.direction) : await API.searchDoc(url.searchParams.get('title')));
        setList(documents);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isMap]);

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
        const documents = await API.searchDoc(searchQuery);
        setList(documents);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSearch();
  }

  useEffect(()=>{
    const loadDoc = async () => {
      try {
        const documents = await API.getList(filter,isMap ? 0 : 1,isMap ? 100 : itemsPerPage,sortConfig.key,sortConfig.direction);
        setList(documents);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadDoc();
  }, [sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };


  const handleClickFilter = (filters) => {
    const loadFiltered = async () => {
      try {
        const documents = await API.getList(filters,isMap ? 0 : 1, isMap ? 100 : itemsPerPage,sortConfig.key,sortConfig.direction);
        setFilter(filters)
        setList(documents);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFiltered();
  }

  const handleDeleteFilter = (key) =>{
    const f = filter;
    f[key]='';
    switch (key)
{
   case "documentTypes":
    setTypes([])
   case "stakeholders":
    setStakeholders([])
   case "issuanceDateStart": 
    setIssuanceDateStart('')
       break;
   case "issuanceDateEnd": 
    setIssuanceDateEnd('')
}
    handleClickFilter(f)
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
        <div className="search-bar-list">
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
        {user && <div className="map-documents-button" role="button" onClick={()=>handleNavigation()}>
          {isList ? <LiaMapMarkedAltSolid /> : <LiaThListSolid/>}
          <span>{isList ? "Show Map" : "Show List"}</span>
        </div>
        }
      </div>
      <div className="filter-container">
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
                  >
                    ✕
                  </span>
                </div>
              ) : null
            )}
        </div>
      </div>
      <Outlet context={{list, loading,getSortIndicator,sortConfig,handleSort}} />
      {!isMap && <div className="pagination-container">
      {Array.from({ length: 3 }, (_, index) => (
        <button
          key={index}
          className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
      }
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
