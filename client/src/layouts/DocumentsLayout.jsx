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
  let [searchParams, setSearchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false)
  const isList = location.pathname === '/documents';
  const isMap = location.pathname === '/documents/map';
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filter,setFilter] = useState({ documentTypes: '', stakeholders: '', issuanceDateStart: '', issuanceDateEnd: '' })

  useEffect(()=>{
    const loadData = async () => {
      try {
        console.log(searchParams.get('title'))
        const documents = (!searchParams.get('title') ? await API.getDocuments() : await API.searchDoc(searchParams.get('title')));
        setList(documents);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClickSearch = () => {
    const loadSearch = async () => {
      try {
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

  const handleClickFilter = (filters) => {
    const loadFiltered = async () => {
      try {
        const documents = await API.getFIilteredDocuments(filters);
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
    handleClickFilter(f)
  }

  const handleCloseModal = () => {
    setShowModal(false);
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
        <div className="map-documents-button" onClick={()=>handleNavigation(isList ? "/documents/map" : "/documents")}>
          {isList ? <LiaMapMarkedAltSolid /> : <LiaThListSolid/>}
          <span>{isList ? "Show On Map" : "Show List"}</span>
        </div>
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
      <Outlet context={{list, loading}} />
      </div>
      <FilterModal
          show={showModal}
          onHide={handleCloseModal}
          handleFilter={handleClickFilter}
            />
    </div>
  );
}

export default DocumentsList;
