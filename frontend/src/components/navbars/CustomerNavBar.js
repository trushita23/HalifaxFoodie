import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './styles/NavBar.css'

export function CustomerNavBar({ activeTab }) {

    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("isUserLoggedIn") !== "true") {
            navigate('/login');
        }
    }, []);


    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/homepage" className='halifaxFoodieBrand'>HalifaxFoodie</Navbar.Brand>
                <Nav className="me-auto" activeKey={activeTab}>
                    <Nav.Link eventKey="restaurants" href="/homepage">Restaurants</Nav.Link>
                    <Nav.Link href="/notifications">Notifications</Nav.Link>
                    <Nav.Link eventKey="customerorders" href="/customerorders">My Orders</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link eventKey="logout" href="/logout">Logout</Nav.Link>
                </Nav>
            </Navbar>
        </div>
    );
}

export default CustomerNavBar;

