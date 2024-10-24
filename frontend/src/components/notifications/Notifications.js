import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import CustomerNavBar from '../navbars/CustomerNavBar';


export function Notifications(props) {

    const email = localStorage.getItem("email");
    const navigate = useNavigate()

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function getMessages() {
            await fetch('https://us-central1-serverless-fall.cloudfunctions.net/pullMessages'
                , {
                    method: 'POST',
                    body: JSON.stringify({ customerEmail: email })
                }).then(response => response.json())
                .then(data => {
                    data.forEach(message => {
                        console.log(message);
                        setMessages(messages => [...messages, JSON.parse(message)]);
                        console.log(messages);
                    });
                    setLoading(false);
                })
        }
        getMessages()
    }, [email]);

    const openChat = (chatSessionId) => {
        navigate(`/chat?sessionId=${chatSessionId}`);
    }

    return (
        <div>
            <CustomerNavBar activeTab="notifications" />
            <h1>Notifications</h1>
            {loading ? <div>Loading...</div> :
                messages.map((message) => (
                    <div className="card chat-item" key={message.chatSessionId}>
                        <p>{message.chatSessionId}</p>
                        <p>{message.customerEmail}</p>
                        <button onClick={() => openChat(message.chatSessionId)} className="btn btn-primary">Open Chat</button>
                    </div>
                ))
            }
        </div>
    )
}

export default Notifications