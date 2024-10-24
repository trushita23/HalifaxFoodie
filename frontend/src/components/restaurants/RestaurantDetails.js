import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomerNavBar from '../navbars/CustomerNavBar';
import './styles/RestaurantDetails.css'
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner'
import Modal from 'react-bootstrap/Modal';

export function RestaurantDetails() {

    let navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("restaurants");
    const [recipes, SetRecipes] = useState([]);
    const [restaurantName, setRestaurantName] = useState([]);
    const [isOrderProcessing, setIsOrderProcessing] = useState(false);
    const [open, setOpen] = useState(false);

    const [openFeedbackMessage, setOpenFeedbackMessage] = useState(false);
    const [openSimilarRecipes, setOpenSimilarRecipes] = useState(false);

    const close = () => {
        setOpen(false);
        setOpenFeedbackMessage(false);
        setOpenSimilarRecipes(false);
    }

    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState("");

    const [similarRecipes, setSimilarRecipes] = useState([])

    const handleShowFeedback = () => setShowFeedback(true);

    useEffect(() => {
        if (localStorage.getItem("isUserLoggedIn") !== "true") {
            navigate('/login');
        }
        if (!location.state) {
            navigate('/homepage');
        }
        setRestaurantName(location.state.details.restName);
        SetRecipes(location.state.details.restMenu);
        setRestaurantTraffic();

    }, []);

    const setRestaurantTraffic = async () => {
        await fetch(`https://jrffmmailylycot5oepnfffhbe0halbg.lambda-url.us-east-1.on.aws/`, {
            method: 'POST',
            body: JSON.stringify({ email: location.state.details.email })
        }).then(res => { });
    }

    const order = async (email, recipeName, recipePrice) => {

        setIsOrderProcessing(true);

        // calling for recipe order count increment
        await fetch(` https://xm7zew4b62kpm67qn76myhmar40gpkng.lambda-url.us-east-1.on.aws/`, {
            method: 'POST',
            body: JSON.stringify({ recipeName: recipeName })
        }).then(res => {
        });

        // calling to do actual entry in order section of users table
        await fetch(` https://2cxziyjuois4gqtzhgienpo65e0xeeez.lambda-url.us-east-1.on.aws/`, {
            method: 'POST',
            body: JSON.stringify({ email: email, recipeName: recipeName, recipePrice: recipePrice, restName: restaurantName, restEmail: location.state.details.email })
        }).then((res) => {
            setIsOrderProcessing(false);
            setOpen(true);
        });
    }

    const sendFeedback = async () => {
        await fetch(`https://2fbv3hbofw4mvim7zrtyxhsf2a0miyfj.lambda-url.us-east-1.on.aws/`, {
            method: 'POST',
            body: JSON.stringify({ customerEmail: localStorage.getItem("email"), restaurantEmail: location.state.details.email, feedback: feedback })
        }).then((res) => {
            setShowFeedback(false);
            setOpenFeedbackMessage(true);
        });
    }

    const getSimilarRecipes = async (ingredients) => {
        let label = '';
        await fetch('https://uorxflgskpddpw7fyb5ow6qir40nwfrr.lambda-url.us-east-1.on.aws/', {
            method: 'POST',
            body: JSON.stringify({ ingredients: 'veggi salad cucumber' })
        })
            .then(res => res.json())
            .then(data => {
                label = data.label;
            });

        if (label != 'No label found') {
            await fetch(`https://ko2phbho33ohcq7zjhvb6vr2g40flhev.lambda-url.us-east-1.on.aws/?` + new URLSearchParams({ label: label }), {
                method: 'POST',
            }).then((res) => res.json()).then((data) => {
                console.log(data.items);
                setSimilarRecipes(data.items);
                setOpenSimilarRecipes(true);
            });
        }

    }

    const handleChange = (event) => {
        setFeedback(event.target.value);
    };


    return (
        <div>
            <CustomerNavBar activeTab={activeTab} />
            <h1>{restaurantName}</h1>
            <br />
            <h3 className='title'> Recipes</h3>
            <div className='feedback'>
                {!showFeedback ? <button className="btn btn-primary" onClick={handleShowFeedback}>Feedback</button>
                    : <div />}
                {showFeedback ? <div><input
                    className="form-control"
                    type="text"
                    placeholder="Enter a message"
                    value={feedback}
                    onChange={handleChange}
                />
                    <button className="btn btn-primary" onClick={sendFeedback}>Send</button>
                </div> : <div />}
            </div>
            <table className='recipesTable'>
                <tr>
                    <th>Name</th>
                    <th>Ingredients</th>
                    <th>Price</th>
                    <th></th>
                </tr>
                {
                    location.state.details.restMenu ? location.state.details.restMenu.map((val, key) => {
                        return (
                            <tr>
                                <td>{val.name}</td>
                                <td>{val.ingredients}</td>
                                <td>{val.price}</td>
                                <td>{
                                    isOrderProcessing === false ? <Button type="submit" onClick={() => order(localStorage.getItem("email"), val.name, val.price)}>Order</Button> : null
                                }</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => getSimilarRecipes(val.ingredients)}>View similar recipes</button>
                                </td>
                            </tr>
                        )
                    }) : null}
            </table>
            <div className='spinnerOrderProcess'>
                {
                    isOrderProcessing === true ? <Spinner animation="border" /> : null
                }
            </div>
            <Modal show={open} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>Order status</Modal.Title>
                </Modal.Header>
                <Modal.Body>Order successfully processed</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={openFeedbackMessage} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>Feedback submitted successfully</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={openSimilarRecipes} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>Similar Recipes</Modal.Title>
                </Modal.Header>
                {similarRecipes.length > 0 ? similarRecipes.map((recipe, index) => {
                    return (
                        <Modal.Body>{recipe.title}</Modal.Body>
                    )
                }) : <Modal.Body>No similar recipes found</Modal.Body>}

                <Modal.Body>Feedback submitted successfully</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
}

export default RestaurantDetails;

