import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerHomePage } from './CustomerHomePage';
import { RestaurantHomePage } from './RestaurantHomePage';

import "../../css/home.css"
import { Col, Container, Row } from 'react-bootstrap';
import LexChatBot from '../LexChatBot';
export function HomePage() {
    let navigate = useNavigate();
    let userType = localStorage.getItem("userType");

    useEffect(() => {
        if (localStorage.getItem("isUserLoggedIn") !== "true") {
            navigate('/login');
        }
    }, []);

    return (
        <div>
            {userType === 'Customer' ? <CustomerHomePage /> : null}
            {userType === 'Restaurant' ? <RestaurantHomePage /> : null}
        </div>
    );
}

export default HomePage;

