import React, { useEffect, useState } from "react";
import RestaurantNavBar from '../navbars/RestaurantNavBar';
import './Reviews.css';

export function Reviews(props) {

    const mlPolaityUrl = 'https://ab3ooq6hium3ox35nqip5h2nve0nhyex.lambda-url.us-east-1.on.aws/';
    const email = localStorage.getItem("email");

    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        async function loadReviews() {
            const response = await fetch(mlPolaityUrl + '?' + new URLSearchParams({ restaurantEmail: email }));
            const data = await response.json();
            setFeedback(data);
        }
        loadReviews();
    }, [email]);

    return (
        <div>
            <RestaurantNavBar activeTab="reviews" />
            <h1>Reviews</h1>
            <iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/ea0a5361-5969-4ef1-a150-b52400fd77ed/page/m077C" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
            <div className="list-group">
                {feedback.map((f) => {
                    return (
                        <div key={f.id} className="card chat-item">
                            <div className="item-content">
                                <p>Feedback: {f.feedback}</p>
                                <p>Polarity: {f.polarity}</p>
                                <p>Customer Email: {f.customerEmail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Reviews