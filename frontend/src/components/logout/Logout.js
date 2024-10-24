import React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export function Logout() {

  let navigate = useNavigate();

  useEffect( () => { 
          localStorage.removeItem("isUserLoggedIn");
          localStorage.removeItem("userType");
          localStorage.removeItem("email");
          localStorage.removeItem("name");
          navigate('/login');  
  }, []);

  return (
      <div>
          
      </div>
  );
}

export default Logout;