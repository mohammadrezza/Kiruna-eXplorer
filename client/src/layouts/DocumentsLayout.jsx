import React, { useState,useEffect, useContext } from 'react';
import {Button} from 'react-bootstrap';
import { useNavigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { LiaThListSolid, LiaMapMarkedAltSolid } from "react-icons/lia";
import { VscSettings } from "react-icons/vsc";
import { AuthContext } from '@/layouts/AuthContext';
import FilterModal from '@/components/FilterModal';
import API from '@/services/API.mjs';
import '@/style/DocumentsList.css';
import { RiArrowGoBackFill } from "react-icons/ri";

function DocumentsList() {

  const navigate = useNavigate();
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false)
  const isList = location.pathname === '/documents';
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filters,setFilters] = useState({ documentTypes: '', stakeholders: '', issuanceDateStart: '', issuanceDateEnd: '' })

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
        setList(documents);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFiltered();
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };


  return (
    <div className="wrapper">
      <div className="layout-container">
      <h2 className='layout-container-title'>
          {isList ? "List of Documents" : "Map View"}
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
        <div className="map-view-documents" onClick={()=>handleNavigation(isList ? "/documents/map" : "/documents")}>
          {isList ? <LiaMapMarkedAltSolid /> : <LiaThListSolid/>}
          <span>{isList ? "Show On Map" : "Show List"}</span>
        </div>
      </div>
      <div className="filter-container">
        <Button className="filter-button" onClick={()=>setShowModal(true)}>
          <VscSettings />
          Filters
        </Button>
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
