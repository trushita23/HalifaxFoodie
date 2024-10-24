import React, { useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import './styles/NavBar.css';

export function RestaurantNavBar({ activeTab }) {

    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("isUserLoggedIn") !== "true") {
            navigate('/login');
        }
    }, [navigate]);


    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/homepage" className='halifaxFoodieBrand'>HalifaxFoodie</Navbar.Brand>
                <Nav className="me-auto" activeKey={activeTab}>
                    <Nav.Link eventKey="chats" href="/chats">Chats</Nav.Link>
                    <Nav.Link eventKey="reviews" href="/reviews">Reviews</Nav.Link>
                    <Nav.Link eventKey="reports" href="/reports">Reports</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link eventKey="logout" href="/logout">Logout</Nav.Link>
                </Nav>
            </Navbar>
        </div>
    );
}

export default RestaurantNavBar;

