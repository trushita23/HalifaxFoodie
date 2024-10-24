import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavBar from '../navbars/CustomerNavBar';
import './styles/CustomerHomePage.css'
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import LexChatBot from '../LexChatBot';


const myStyle = {
    height: "100%",
    width: "100%",
};
export function CustomerHomePage() {
    const [show, setShow] = useState(false);
    const displayChatBox = () => {
        setShow((show) => !show);
    };
    let navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("restaurants");
    const [restaurants, SetRestaurants] = useState([]);
    const [isRestaurantListOpening, setIsRestaurantListOpening] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("isUserLoggedIn") !== "true") {
            navigate('/login');
        }
        getRestaurants();
    }, []);

    const getRestaurants = async () => {
        setIsRestaurantListOpening(true);
        await fetch(`https://tulpdugbizdjgyalang3n7qhsm0lvxjr.lambda-url.us-east-1.on.aws/`, {
            method: 'POST',
            body: JSON.stringify()
        }).then((res) => res.json()).then((res) => {
            console.log(res);
            if (res.result === true) {
                console.log(res.items);
                SetRestaurants(res.items);
            }
            else {
                alert("some error occurred");
            }
            setIsRestaurantListOpening(false);
        });
    }

    const goToRestaurantPage = (val) => {
        navigate('/restaurantdetails', { state: { details: val } });
    }

    return (
        <div>
            <CustomerNavBar activeTab={activeTab} />
            <table className='restaurantsTable'>
                <tr>
                    <th>Restaurant Name</th>
                    {/* <th>Contact Number</th> */}
                    <th></th>
                </tr>
                {
                    restaurants.map((val, key) => {
                        return (
                            <tr>
                                <td>{val.restName}</td>
                                <td>
                                    <Button type="submit" onClick={() => goToRestaurantPage(val)}>Go to restaurant</Button></td>
                            </tr>
                        )
                    })}
            </table>
            <div className='spinnerOrderProcess'>
                {
                    isRestaurantListOpening === true ? <Spinner animation="border" /> : null
                }
            </div>
            <div style={{float:"right"}}>
              {show && <LexChatBot displayChatBox={displayChatBox} />}
            </div>
            <div>
                <FontAwesomeIcon icon={faMessage} size="3x" className='chatIcon' onClick={displayChatBox} />

            </div>
        </div>
    );
}

export default CustomerHomePage;

