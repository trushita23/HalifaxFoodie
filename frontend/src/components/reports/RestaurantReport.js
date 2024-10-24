import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantNavBar from '../navbars/RestaurantNavBar';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export function RestaurantReport() {

  let navigate = useNavigate();
  let trafficReportURL = "https://datastudio.google.com/embed/reporting/c9d2380f-7ebe-47d5-ac8b-82e47e7912c2/page/R5E9C";
  let recipeReportURL =  "https://datastudio.google.com/embed/reporting/2a7d8d28-5342-423d-b97f-ba98065f82fd/page/ncT9C";
  const [reportURL, setReportURL] = useState(trafficReportURL);
  const [activeTab, setActiveTab] = useState("reports"); 

  useEffect( () => { 
      if(localStorage.getItem("isUserLoggedIn") !== "true")
      {
          navigate('/login');  
      }
  }, []);

  return (
      <div>
          <RestaurantNavBar activeTab={activeTab}/>
          <DropdownButton id="dropdown-basic-button" title="Select report type" on>
                <Dropdown.Item as="button"><div onClick={() => setReportURL(trafficReportURL)}>Traffic Report</div></Dropdown.Item>
                <Dropdown.Item as="button"><div onClick={() => setReportURL(recipeReportURL)}>Recipe Report</div></Dropdown.Item>
          </DropdownButton>

          <iframe width="800" height="1000" src={reportURL} frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
      </div>
  );
}

export default RestaurantReport;