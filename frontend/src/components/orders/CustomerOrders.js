import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavBar from '../navbars/CustomerNavBar';
import './styles/CustomerOrders.css'
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner'

export function CustomerOrders() {

    let navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("customerorders");
    const [orders, SetOrders] = useState([]); 
    const [isOrderProcessing, setIsOrderListloading] = useState(false);

    useEffect( () => { 
        if(localStorage.getItem("isUserLoggedIn") !== "true")
        {
            navigate('/login');  
        }
        getOrders();
    }, []);

    const getOrders = async() =>{
        setIsOrderListloading(true);
        await fetch(`https://tj76tlvx2jxgljm6xfvsazvgua0okllv.lambda-url.us-east-1.on.aws/`,
         {
                    method: 'POST',
                    body: JSON.stringify({
                        email:localStorage.getItem("email")
                    })
                }).then((res) => res.json()).then((res)=>{
                    console.log(res);
                    if(res.result === true)
                    {
                        SetOrders(res.orders);
                    }
                    else
                    {
                        alert("some error occurred");
                    }
                    setIsOrderListloading(false);   
                });
    }

    return (
        <div>
            <CustomerNavBar activeTab={activeTab}/>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Order No.</th>
                    <th>Recipe Name</th>
                    <th>Amount</th>
                    <th>Restaurant</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (orders) ? 
                            orders.map((val, key) => {
                            return (
                                <tr>
                                    <td>{val.orderNo}</td>
                                    <td>{val.recipeName}</td>
                                    <td>{val.recipePrice}</td>
                                    <td>{val.restName}</td>
                                    <td>{val.orderStatus}</td>
                                    <td>{ val.rating !== 0 ? val.rating : "Not given yet"}</td>
                                    <td>{val.orderTime}</td>
                                </tr>
                        )
                     }): null
                    }
                </tbody>
            </Table>
            <div className='spinnerOrderProcess'>
                {
                    isOrderProcessing === true ? <Spinner animation="border" />: null
                }
            </div>
        </div>
    );
}

export default CustomerOrders;

